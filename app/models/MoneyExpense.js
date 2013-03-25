exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			expenseType : "TEXT NOT NULL",
			friendId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			moneyExpenseCategoryId : "TEXT NOT NULL",
			localCurrencyId : "TEXT NOT NULL",
			exchangeCurrencyRate : "REAL NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		hasMany : {
			moneyExpenseDetails : {type : "MoneyExpenseDetail",attribute : "moneyExpense"}
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
			moneyExpenseCategory : {
				type : "MoneyExpenseCategory",
				attribute : "moneyExpenses"
			},
			localCurrency : {
				type : "Currency",
				attribute : null
			},

			ownerUser : {
				type : "User",
				attribute : "moneyExpenses"
			}
		},
		rowView : "money/moneyExpenseRow",
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

