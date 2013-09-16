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
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
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
					return this.xGet("moneyExpense").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					return this.xGet("moneyExpense").xGet("project").xGet("currency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyExpense").xGet("exchangeRate")).toUserCurrency();
				}
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				if (this.xGet("moneyExpense").isNew()) {
					this.xGet("moneyExpense").xSet("amount", this.xGet("moneyExpense").xGet("amount") - this.xGet("amount"));
					this.xGet("moneyExpense").trigger("xchange:amount", this.xGet("moneyExpense"));
					this.xGet("moneyExpense").xGet("moneyExpenseDetails").remove(this);
					xFinishCallback();
				} else if (this.xGet("moneyExpense").xGet("useDetailsTotal")) {
					var saveOptions = _.extend({}, options);
					saveOptions.patch = true;

					var amount = self.xGet("amount");
					var moneyAccount = self.xGet("moneyExpense").xGet("moneyAccount");
					moneyAccount.save({
						currentBalance : moneyAccount.xGet("currentBalance") + amount
					}, saveOptions);

					var expenseAmount = self.xGet("moneyExpense").xGet("amount");
					self.xGet("moneyExpense").save({
						amount : expenseAmount - amount,
						moneyAccount : moneyAccount
					}, saveOptions);

					this._xDelete(xFinishCallback, options);
				} else {
					this._xDelete(xFinishCallback, options);
				}
			},
			canEdit : function() {
				return this.xGet("moneyExpense").canEdit();
			},
			canDelete : function() {
				return this.xGet("moneyExpense").canDelete();
			},
			syncAddNew : function(record, dbTrans) {
				// 更新支出余额
				// 1. 如果支出也是新增的，我们不需要更新支出余额
				// 2. 支出已经存在，我们需要合并该明细(更新支出余额)

				var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
					id : record.moneyExpenseId
				});
				if (moneyExpense.id) {
					// 支出已在本地存在, 我们要更新本地支出的余额
					// if (moneyExpense.xGet("useDetailsTotal")) {
					moneyExpense.__syncAmount = moneyExpense.__syncAmount ? moneyExpense.__syncAmount + record.amount : record.amount;
					// var oldExpenseAmount = moneyExpense.__syncAmount || moneyExpense.xGet("amount");
					// moneyExpense.__syncAmount = oldExpenseAmount + record.amount;
					// }
					// else {
					// moneyExpense.__syncAmount = moneyExpense.__syncAmount !== undefined ? moneyExpense.__syncAmount + record.amount : record.amount;
					// }
				}
			},
			syncUpdate : function(record, dbTrans) {
				var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
					id : record.moneyExpenseId
				});
				// 该支出明细在服务器上被改变了，我们将其变动缓存到 __syncAmount 里，等更新 moneyExpense 的时候会将该值替换本地的值
				// var oldExpenseAmount = moneyExpense.__syncAmount || moneyExpense.xGet("amount");
				// moneyExpense.__syncAmount = oldExpenseAmount - this.xGet("amount") + record.amount
				moneyExpense.__syncAmount = moneyExpense.__syncAmount ? moneyExpense.__syncAmount + record.amount - this.xGet("amount") : record.amount - this.xGet("amount");
			},
			syncUpdateConflict : function(record, dbTrans) {
				delete record.id;

				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					this.syncUpdate(record, dbTrans);
					this._syncUpdate(record, dbTrans);
					var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					dbTrans.db.execute(sql, [this.xGet("id")]);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
					id : this.xGet("moneyExpenseId")
				});
				if (moneyExpense.id) {
					// 支出已在本地存在
					// if (moneyExpense.xGet("moneyExpenseDetails").length > 0) {
					// var oldExpenseAmount = moneyExpense.__syncAmount || moneyExpense.xGet("amount");
					// moneyExpense.__syncAmount = oldExpenseAmount - this.xGet("amount");
					// }
					moneyExpense.__syncAmount = moneyExpense.__syncAmount ? moneyExpense.__syncAmount - this.xGet("amount") : -this.xGet("amount");
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

