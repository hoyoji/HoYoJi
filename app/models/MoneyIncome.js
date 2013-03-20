exports.definition = {
	config: {
		columns: {
		    "id": "TEXT NOT NULL PRIMARY KEY",
		    "date": "TEXT NOT NULL",
		    "amount": "TEXT NOT NULL",
		    "incomeType": "TEXT NOT NULL",
		    "friendId": "TEXT",
		    "moneyAccountId": "TEXT NOT NULL",
		    "projectId": "TEXT NOT NULL",
		    "categoryId": "TEXT NOT NULL",
		    "localCurrencyId": "TEXT NOT NULL",
		    "foreignCurrencyId": "TEXT NOT NULL",
		    "exchangeCurrencyRate" : "TEXT NOT NULL",
		    "remark" : "TEXT",
		    "ownerUserId" : "TEXT NOT NULL"
		},
		belongsTo : {
			friend : {type : "Friend", attribute : null},
			moneyAccount : {type : "MoneyAccount", attribute : null},
			project : {type : "Project", attribute : null},
			category : {type : "moneyIncomeCategory", attribute : "moneyIncomes"},
			localCurrency : {type : "localCurrency", attribute : null},
			foreignCurrency : {type : "foreignCurrency", attribute : null},
			ownerUser : {type : "User", attribute : null}
		},
		adapter: {
			type: "sql",
			collection_name: "MoneyIncome"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

