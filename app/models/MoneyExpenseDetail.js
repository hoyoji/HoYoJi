exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			moneyExpenseId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER"
		},
		belongsTo : {
			moneyExpense : {
				type : "MoneyExpense",
				attribute : "moneyExpenseDetails"
			},
			ownerUser : {
				type : "User",
				attribute : null
			}
		},
		rowView : "money/moneyExpenseDetailRow",
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
			getAmount : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("moneyExpense").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					return this.xGet("moneyExpense").xGet("localCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyExpense").xGet("exchangeRate")).toUserCurrency();
				}
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				if (this.xGet("moneyExpense").isNew()) {
					this.xGet("moneyExpense").xSet("amount", this.xGet("moneyExpense").xGet("amount") - this.xGet("amount"));
					this.xGet("moneyExpense").trigger("xchange:amount", this.xGet("moneyExpense"));
					this.xGet("moneyExpense").xGet("moneyExpenseDetails").remove(this);
					xFinishCallback();
				} else {
					var saveOptions = _.extend({}, options);
					saveOptions.patch = true;

					var amount = self.xGet("amount");
					var moneyAccount = self.xGet("moneyExpense").xGet("moneyAccount");
					moneyAccount.save({
						currentBalance : moneyAccount.xGet("currentBalance") + amount
					}, saveOptions);

					var expenseAmount = self.xGet("moneyExpense").xGet("amount");
					self.xGet("moneyExpense").save({
						amount : expenseAmount - amount
					}, saveOptions);

					this._xDelete(function(error, options) {
						if (!error) {
						}
						xFinishCallback(error);
					});
				}
			},
			canEdit : function() {
				return this.xGet("moneyExpense").canEdit();
			},
			canDelete : function() {
				return this.xGet("moneyExpense").canDelete();
			},
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果支出也是新增的
				// 2. 支出已经存在

				var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
					id : record.moneyExpenseId
				});
				if (moneyExpense.id) {
					// 支出已在本地存在
					var newExpenseAmount, oldExpenseAmount = moneyExpense.xGet("amount");

					if (moneyExpense.xGet("moneyExpenseDetails").length === 0) {
						newExpenseAmount = record.amount;
					} else {
						newExpenseAmount = oldExpenseAmount + record.amount;
					}
					moneyExpense.save("amount", newExpenseAmount, {
						dbTrans : dbTrans,
						patch : true
					});
					// 我们还要更新本地账户余额

				}
			},
			syncUpdate : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果支出也是新增的
				// 2. 支出已经存在

				var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
					id : record.moneyExpenseId
				});
				moneyExpense.save("amount", moneyExpense.xGet("amount") + record.amount, {
					dbTrans : dbTrans,
					patch : true
				});
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
}

