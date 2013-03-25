exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			incomeType : "TEXT NOT NULL",
			friendId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			moneyIncomeCategoryId : "TEXT NOT NULL",
			localCurrencyId : "TEXT NOT NULL",
			exchangeCurrencyRate : "REAL NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		hasMany : {
	    	moneyIncomeDetails : {type : "MoneyIncomeDetail", attribute : "moneyIncome"}
		},
		belongsTo : {
			friend : {
				type : "Friend",
				attribute : null
			},
			moneyAccount : {
				type : "MoneyAccount",
				attribute : null
			},
			project : {
				type : "Project",
				attribute : null
			},
			moneyIncomeCategory : {
				type : "MoneyIncomeCategory",
				attribute : "moneyIncomes"
			},
			localCurrency : {
				type : "Currency",
				attribute : null
			},
			ownerUser : {
				type : "User",
				attribute : "moneyIncomes"
			}
		},
		rowView : "money/moneyIncomeRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			xDelete : function(xFinishCallback) {
				var moneyAccount = this.xGet("moneyAccount");
				var amount = this.xGet("amount");
				this._xDelete(xFinishCallback);
				moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - amount);
				moneyAccount.xSave();
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
}

