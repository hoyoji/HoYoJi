exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			moneyIncomeId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			moneyIncome : {
				type : "MoneyIncome",
				attribute : "moneyIncomeDetails"
			},
			ownerUser : {
				type : "User",
				attribute : null
			}
		},
		rowView : "money/moneyIncomeDetailRow",
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
						} else if (this.xGet("amount") > 999999999) {
							error = {
								msg : "金额超出范围，请重新输入"
							};
						}
					}
					xValidateComplete(error);
				}
			},
			getAmount : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("moneyIncome").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					return this.xGet("moneyIncome").xGet("project").xGet("currency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyIncome").xGet("exchangeRate")).toUserCurrency();
				}
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				if (this.xGet("moneyIncome").isNew()) {
					this.xGet("moneyIncome").xSet("amount", this.xGet("moneyIncome").xGet("amount") - this.xGet("amount"));
					this.xGet("moneyIncome").trigger("xchange:amount", this.xGet("moneyIncome"));
					this.xGet("moneyIncome").xGet("moneyIncomeDetails").remove(this);
					xFinishCallback();
				} else if (this.xGet("moneyIncome").xGet("useDetailsTotal")) {
					var saveOptions = _.extend({}, options);
					saveOptions.patch = true;

					var amount = self.xGet("amount");
					var moneyAccount = self.xGet("moneyIncome").xGet("moneyAccount");
					moneyAccount.save({
						currentBalance : moneyAccount.xGet("currentBalance") - amount
					}, saveOptions);

					var incomeAmount = self.xGet("moneyIncome").xGet("amount");
					self.xGet("moneyIncome").save({
						amount : incomeAmount - amount,
						moneyAccount : moneyAccount
					}, saveOptions);

					this._xDelete(xFinishCallback, options);
				} else {
					this._xDelete(xFinishCallback, options);
				}
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

				var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
					id : record.moneyIncomeId
				});
				if (moneyIncome.id) {
					// 支出已在本地存在
					// if (moneyIncome.xGet("moneyIncomeDetails").length > 0) {
					// var oldIncomeAmount = moneyIncome.__syncAmount || moneyIncome.xGet("amount");
					// moneyIncome.__syncAmount = oldIncomeAmount + record.amount
					// // moneyIncome.save("amount", moneyIncome.__syncAmount, {
					// // dbTrans : dbTrans,
					// // patch : true
					// // });
					// } else {
					moneyIncome.__syncAmount = moneyIncome.__syncAmount ? moneyIncome.__syncAmount + record.amount : record.amount;
					// }
				}
			},
			syncUpdate : function(record, dbTrans) {
				var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
					id : record.moneyIncomeId
				});
				// var oldIncomeAmount = moneyIncome.__syncAmount || moneyIncome.xGet("amount");
				// moneyIncome.__syncAmount = oldIncomeAmount - this.xGet("amount") + record.amount
				moneyIncome.__syncAmount = moneyIncome.__syncAmount ? moneyIncome.__syncAmount + record.amount - this.xGet("amount") : record.amount - this.xGet("amount");
			},
			syncUpdateConflict : function(record, dbTrans) {
				delete record.id;

				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					this.syncUpdate(record, dbTrans);
					this._syncUpdate(record, dbTrans);
					var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					dbTrans.db.execute(sql, [this.xGet("id")]);
				}  else {
					// 让本地修改覆盖服务器上的记录
					this._syncUpdate({lastServerUpdateTime : record.lastServerUpdateTime}, dbTrans);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
					id : this.xGet("moneyIncomeId")
				});
				if (moneyIncome.id) {
					// 支出已在本地存在
					// if (moneyIncome.xGet("moneyIncomeDetails").length > 0) {
					var oldIncomeAmount = moneyIncome.__syncAmount || moneyIncome.xGet("amount");
					moneyIncome.__syncAmount = oldIncomeAmount - this.xGet("amount");
					// }
					moneyIncome.__syncAmount = moneyIncome.__syncAmount ? moneyIncome.__syncAmount - record.amount : -record.amount;

				}
			}
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

