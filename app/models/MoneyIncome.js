exports.definition = {
	config : {
		columns : {
			"id" : "TEXT NOT NULL PRIMARY KEY",
			"date" : "TEXT NOT NULL",
			"amount" : "REAL NOT NULL",
			"incomeType" : "TEXT NOT NULL",
			"friendId" : "TEXT",
			"moneyAccountId" : "TEXT NOT NULL",
			"projectId" : "TEXT NOT NULL",
			"categoryId" : "TEXT NOT NULL",
			"localCurrencyId" : "TEXT NOT NULL",
			"exchangeCurrencyRate" : "REAL NOT NULL",
			"remark" : "TEXT",
			"ownerUserId" : "TEXT NOT NULL"
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
			category : {
				type : "MoneyIncomeCategory",
				attribute : "moneyIncomes"
			},
			localCurrency : {
				type : "Currency",
				attribute : null
			},
			ownerUser : {
				type : "User",
				attribute : "incomes"
			}
		},
		rowView : "money/moneyIncomeRow",
		adapter : {
			collection_name : "MoneyIncome",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			// xDelete : function(xFinishCallback){
				// var error;
				// var moneyAccount = this.xGet("moneyAccount");
				// var amount = this.xGet("amount");
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

