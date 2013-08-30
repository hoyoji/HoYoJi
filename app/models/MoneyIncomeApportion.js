exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			amount : "REAL NOT NULL",
			moneyIncomeId : "TEXT NOT NULL",
			friendUserId : "TEXT NOT NULL",
			apportionType : "TEXT NOT NULL", // fixed, average
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			moneyIncome : {
				type : "MoneyIncome",
				attribute : "moneyIncomeApportions"
			},
			ownerUser : {
				type : "User",
				attribute : null
			},
			friendUser : {
				type : "User",
				attribute : null
			}
		},
		rowView : "money/moneyIncomeApportionRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				amount : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("amount"))) {
						error = {
							msg : "金额只能为数字"
						};
					} else {
						if (this.xGet("amount") < 0) {
							error = {
								msg : "金额不能为负数"
							};
						}
					}
					xValidateComplete(error);
				}
			},
			getDisplayName : function() {
				return this.xGet("friendUser").xGet("userName");
			},
			getFriendDisplayName : function() {
				var friend = Alloy.createModel("Friend").xFindInDb({
					friendUserId : this.xGet("friendUser").id
				});
				if (friend.id) {
					return friend.getDisplayName();
				}
				return this.getDisplayName();
			},
			getAmount : function() {
				if (this.xGet("moneyIncome").xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("moneyIncome").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					var projectCurrency = this.xGet("moneyIncome").xGet("project").xGet("currency");
					var userCurrency = Alloy.Models.User.xGet("activeCurrency");
					var exchanges = userCurrency.getExchanges(projectCurrency);
					var exchange = 1;
					if (exchanges.length) {
						exchange = exchanges.at(0).xGet("rate");
					}
					return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyIncome").xGet("exchangeRate") / exchange).toUserCurrency();
				}
			},
			getSharePercentage : function() {
				var projectShareAuthorizations = this.xGet("moneyIncome").xGet("project").xGet("projectShareAuthorizations");
				var self = this;
				var sharePercentage;
				projectShareAuthorizations.forEach(function(item) {
					if (self.xGet("friendUser") === item.xGet("friendUser")) {
						sharePercentage = item.xGet("sharePercentage");
						return;
					}
				});
				return sharePercentage;

			},
			getSharePercentageRow : function() {
				var projectShareAuthorizations = this.xGet("moneyIncome").xGet("project").xGet("projectShareAuthorizations");
				var self = this;
				var sharePercentage;
				projectShareAuthorizations.forEach(function(item) {
					if (self.xGet("friendUser") === item.xGet("friendUser")) {
						sharePercentage = item.xGet("sharePercentage");
						return;
					}
				});
				return "占股:" + sharePercentage + "%";

			},
			getApportionType : function() {
				if (this.xGet("apportionType") === "Fixed") {
					return "固定";
				} else if (this.xGet("apportionType") === "Average") {
					return "均摊";
				}
			},
			getMoneySymbol : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User || !this.xGet("ownerUser")) {
					return this.xGet("moneyIncome").xGet("moneyAccount").xGet("currency").xGet("symbol");
				} else {
					return "";
				}
			},
			xDelete : function(xFinishCallback, options) {
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;
				saveOptions.wait = true;
				var self = this;
				var projectShareAuthorizations = self.xGet("moneyIncome").xGet("project").xGet("projectShareAuthorizations");
				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === self.xGet("friendUser")) {
						var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
						// projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - self.xGet("amount")*self.xGet("moneyIncome").xGet("exchangeRate"));
						projectShareAuthorization.save({
							apportionedTotalIncome : apportionedTotalIncome - Number((self.xGet("amount") * self.xGet("moneyIncome").xGet("exchangeRate")).toFixed(2))
						}, saveOptions);
					}
				});
				this._xDelete(xFinishCallback, options);
			},
			canEdit : function() {
				return this.xGet("moneyIncome").canEdit();
			},
			canDelete : function() {
				return this.xGet("moneyIncome").canDelete();
			},

			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果收入也是新增的
				// 2. 收入已经存在

					var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
						projectId : record.projectId,
						friendUserId : record.friendUserId
					});
					if (projectShareAuthorization.id) {
						projectShareAuthorization.__syncApportionedTotalIncome = projectShareAuthorization.__syncApportionedTotalIncome ? 
								projectShareAuthorization.__syncApportionedTotalIncome + Number((record.amount * record.exchangeRate).toFixed(2)) : 
								Number((record.amount * record.exchangeRate).toFixed(2));
					}
					delete record.projectId;
					delete record.exchangeRate;
			},
			syncUpdate : function(record, dbTrans) {
				if (record.ownerUserId === Alloy.Models.User.id) {
				var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
					id : record.moneyIncomeId
				});
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : moneyIncome.xGet("projectId"),
					friendUserId : record.friendUserId
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncApportionedTotalIncome = projectShareAuthorization.__syncApportionedTotalIncome ? 
						projectShareAuthorization.__syncApportionedTotalIncome + Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * moneyIncome.xGet("exchangeRate")).toFixed(2)) : 
						Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount")  * moneyIncome.xGet("exchangeRate")).toFixed(2));
				}
				}
				delete record.projectId;
				delete record.exchangeRate; 

			},
			// syncUpdateConflict : function(record, dbTrans) {
			// delete record.id;
			//
			// // 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
			// if(this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime){
			// this.syncUpdate(record, dbTrans);
			// this._syncUpdate(record, dbTrans);
			// var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
			// dbTrans.db.execute(sql, [this.xGet("id")]);
			// }
			// // 让本地修改覆盖服务器上的记录
			// },
			// syncDelete : function(record, dbTrans, xFinishedCallback) {
				// var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
					// id : this.xGet("moneyIncomeId")
				// });
				// if (moneyIncome.id) {
					// var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
						// projectId : moneyIncome.xGet("projectId"),
						// friendUserId : moneyIncome.xGet("friendUserId")
					// });
					// if (projectShareAuthorization.id) {
						// projectShareAuthorization.__syncApportionedTotalIncome = projectShareAuthorization.__syncApportionedTotalIncome ? 
							// projectShareAuthorization.__syncApportionedTotalIncome - this.xGet("amount")  * moneyIncome.xGet("exchangeRate") : 
							// - this.xGet("amount") * moneyIncome.xGet("exchangeRate");
					// }
				// }
			// },
			// _syncDelete : function(record, dbTrans, xFinishedCallback) {
			// this._xDelete(xFinishedCallback, {
			// dbTrans : dbTrans,
			// syncFromServer : true
			// });
			// }
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});

		return Collection;
	}
};

