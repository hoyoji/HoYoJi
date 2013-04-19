exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			moneyExpenseId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			lastSyncTime : "TEXT",
			lastModifyTime : "TEXT"
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
			getAmount : function(){
				return this.xGet("moneyExpense").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
			},
			xDelete : function(xFinishCallback) {
				var self = this;
				if (this.xGet("moneyExpense").isNew()) {
					this.xGet("moneyExpense").xSet("amount",this.xGet("moneyExpense").xGet("amount") - this.xGet("amount"));
					this.xGet("moneyExpense").trigger("xchange:amount", this.xGet("moneyExpense"));
					this.xGet("moneyExpense").xGet("moneyExpenseDetails").remove(this);
					xFinishCallback();
				} else {

					this._xDelete(function(error) {
						if (!error) {
							var amount = self.xGet("amount");

							var moneyAccount = self.xGet("moneyExpense").xGet("moneyAccount");
							moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + amount);
							moneyAccount._xSave();

							var expenseAmount = self.xGet("moneyExpense").xGet("amount");
							self.xGet("moneyExpense").xSet("amount", expenseAmount - amount);
							self.xGet("moneyExpense")._xSave();
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

