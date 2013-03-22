exports.definition = {
	config : {
		columns : {
			"id" : "TEXT NOT NULL PRIMARY KEY",
			"date" : "TEXT NOT NULL",
			"amount" : "REAL NOT NULL",
			"expenseType" : "TEXT NOT NULL",
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
				type : "MoneyExpenseCategory",
				attribute : "moneyExpenses"
			},
			localCurrency : {
				type : "Currency",
				attribute : null
			},

			ownerUser : {
				type : "User",
				attribute : "expenses"
			}
		},
		rowView : "money/moneyExpenseRow",
		adapter : {
			collection_name : "MoneyExpense",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
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

