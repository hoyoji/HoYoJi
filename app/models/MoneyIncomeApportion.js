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
			xDelete : function(xFinishCallback, options) {
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;
				var self = this;
				var projectShareAuthorizations = self.xGet("moneyIncome").xGet("project").xGet("projectShareAuthorizations");
				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === self.xGet("friendUser")) {
						var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
						projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - self.xGet("amount")*self.xGet("moneyIncome").xGet("exchangeRate"));
						projectShareAuthorization.save({
							apportionedTotalIncome : apportionedTotalIncome - self.xGet("amount")*self.xGet("moneyIncome").xGet("exchangeRate")
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
			// syncAddNew : function(record, dbTrans) {
			// // 更新账户余额
			// // 1. 如果收入也是新增的
			// // 2. 收入已经存在
			//
			// var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
			// id : record.moneyIncomeId
			// });
			// if (moneyIncome.id) {
			// // 支出已在本地存在
			// if (moneyIncome.xGet("moneyIncomeDetails").length > 0) {
			// var oldIncomeAmount = moneyIncome.__syncAmount || moneyIncome.xGet("amount");
			// moneyIncome.__syncAmount = oldIncomeAmount + record.amount
			// // moneyIncome.save("amount", moneyIncome.__syncAmount, {
			// // dbTrans : dbTrans,
			// // patch : true
			// // });
			// } else {
			// moneyIncome.__syncAmount = moneyIncome.__syncAmount !== undefined ? moneyIncome.__syncAmount + record.amount : record.amount;
			// }
			// }
			// },
			// syncUpdate : function(record, dbTrans) {
			// var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
			// id : record.moneyIncomeId
			// });
			// var oldIncomeAmount = moneyIncome.__syncAmount || moneyIncome.xGet("amount");
			// moneyIncome.__syncAmount = oldIncomeAmount - this.xGet("amount") + record.amount
			// },
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
			// // 支出已在本地存在
			// // if (moneyIncome.xGet("moneyIncomeDetails").length > 0) {
			// var oldIncomeAmount = moneyIncome.__syncAmount || moneyIncome.xGet("amount");
			// moneyIncome.__syncAmount = oldIncomeAmount - this.xGet("amount");
			// // }
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
}

