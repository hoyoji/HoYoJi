exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			amount : "REAL NOT NULL",
			moneyExpenseId : "TEXT NOT NULL",
			friendUserId : "TEXT NOT NULL",
			apportionType : "TEXT NOT NULL", // fixed, average
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			moneyExpense : {
				type : "MoneyExpense",
				attribute : "moneyExpenseApportions"
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
		rowView : "money/moneyExpenseApportionRow",
		adapter : {
			type : "hyjSql",
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
				if (this.xGet("moneyExpense").xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("moneyExpense").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					var projectCurrency = this.xGet("moneyExpense").xGet("project").xGet("currency");
					var userCurrency = Alloy.Models.User.xGet("activeCurrency");
					var exchanges = userCurrency.getExchanges(projectCurrency);
					var exchange = 1;
					if (exchanges.length) {
						exchange = exchanges.at(0).xGet("rate");
					}
					return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyExpense").xGet("exchangeRate") / exchange).toUserCurrency();
				}
			},
			getSharePercentage : function() {
				var projectShareAuthorizations = this.xGet("moneyExpense").xGet("project").xGet("projectShareAuthorizations");
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
				var projectShareAuthorizations = this.xGet("moneyExpense").xGet("project").xGet("projectShareAuthorizations");
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
				var projectShareAuthorizations = self.xGet("moneyExpense").xGet("project").xGet("projectShareAuthorizations");
				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === self.xGet("friendUser")) {
						var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
						projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - self.xGet("amount")*self.xGet("moneyExpense").xGet("exchangeRate"));
						console.info("apportionedTotalExpense++++++++++" + apportionedTotalExpense - self.xGet("amount")*self.xGet("moneyExpense").xGet("exchangeRate"));
						projectShareAuthorization.save({
							apportionedTotalExpense : apportionedTotalExpense - self.xGet("amount")*self.xGet("moneyExpense").xGet("exchangeRate")
						}, saveOptions);
					}
				});
				this._xDelete(xFinishCallback, options);
			},
			canEdit : function() {
				return this.xGet("moneyExpense").canEdit();
			},
			canDelete : function() {
				return this.xGet("moneyExpense").canDelete();
			},
			// syncAddNew : function(record, dbTrans) {
			// // 更新账户余额
			// // 1. 如果支出也是新增的
			// // 2. 支出已经存在
			//
			// var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
			// id : record.moneyExpenseId
			// });
			// if (moneyExpense.id) {
			// // 支出已在本地存在, 我们要更新本地支出的余额
			// if (moneyExpense.xGet("moneyExpenseDetails").length > 0) {
			// var oldExpenseAmount = moneyExpense.__syncAmount || moneyExpense.xGet("amount");
			// moneyExpense.__syncAmount = oldExpenseAmount + record.amount
			// // moneyExpense.save("amount", moneyExpense.__syncAmount, {
			// // dbTrans : dbTrans,
			// // patch : true
			// // });
			// } else {
			// moneyExpense.__syncAmount = moneyExpense.__syncAmount !== undefined ? moneyExpense.__syncAmount + record.amount : record.amount;
			// }
			// }
			// },
			// syncUpdate : function(record, dbTrans) {
			// var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
			// id : record.moneyExpenseId
			// });
			// // 该支出明细在服务器上被改变了，我们将其变动缓存到 __syncAmount 里，等更新 moneyExpense 的时候会将该值替换本地的值
			// var oldExpenseAmount = moneyExpense.__syncAmount || moneyExpense.xGet("amount");
			// moneyExpense.__syncAmount = oldExpenseAmount - this.xGet("amount") + record.amount
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
			// var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
			// id : this.xGet("moneyExpenseId")
			// });
			// if (moneyExpense.id) {
			// // 支出已在本地存在
			// // if (moneyExpense.xGet("moneyExpenseDetails").length > 0) {
			// var oldExpenseAmount = moneyExpense.__syncAmount || moneyExpense.xGet("amount");
			// moneyExpense.__syncAmount = oldExpenseAmount - this.xGet("amount");
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

