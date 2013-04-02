exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			friendId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			localCurrencyId : "TEXT NOT NULL",
			exchangeCurrencyRate : "REAL NOT NULL",
			interest : "REAL NOT　NULL",
			remark : "TEXT",
			moneyLoanLendId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL"
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
				attribute : "moneyLoanPaybacks"
			},
			localCurrency : {
				type : "Currency",
				attribute : null
			},
			moneyLoanBorrow : {
				type : "MoneyLoanBorrow",
				attribute : "moneyLoanPaybacks"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyLoanPaybacks"
			}
		},
		rowView : "money/moneyLoanPaybackRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			getLocalAmount : function() {
				return this.xGet("amount") * this.xGet("exchangeCurrencyRate");
			},
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
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});

		return Collection;
	}
}

