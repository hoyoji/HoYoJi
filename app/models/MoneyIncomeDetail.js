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
			lastServerUpdateTime : "INTEGER"
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
						}
					}
					xValidateComplete(error);
				}
			},
			getAmount : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("moneyIncome").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					return this.xGet("moneyIncome").xGet("localCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyIncome").xGet("exchangeRate")).toUserCurrency();
				}
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				if (this.xGet("moneyIncome").isNew()) {
					this.xGet("moneyIncome").xSet("amount", this.xGet("moneyIncome").xGet("amount") - this.xGet("amount"));
					this.xGet("moneyIncome").trigger("xchange:amount", this.xGet("moneyIncome"));
					this.xGet("moneyIncome").xGet("moneyIncomeDetails").remove(this);
					xFinishCallback();
				} else {
					this._xDelete(function(error, options) {
						if (!error) {
							var amount = self.xGet("amount");
							var moneyAccount = self.xGet("moneyIncome").xGet("moneyAccount");
							moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - amount);
							moneyAccount._xSave();

							var incomeAmount = self.xGet("moneyIncome").xGet("amount");
							self.xGet("moneyIncome").xSet("amount", incomeAmount - amount);
							self.xGet("moneyIncome")._xSave();

						}
					});
				}
			},
			canEdit : function() {
				return this.xGet("moneyIncome").canEdit();
			},
			canDelete : function() {
				return this.xGet("moneyIncome").canDelete();
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

