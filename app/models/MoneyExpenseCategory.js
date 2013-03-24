exports.definition = {
	config: {
		columns: {
		    "id": "TEXT NOT NULL PRIMARY KEY",
		    "name": "TEXT NOT NULL",
		    "parentExpenseCategoryId": "TEXT",
		    "projectId" : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL"
		},
		hasMany : {
			subExpenseCategories : { type : "MoneyExpenseCategory", attribute : "parentExpenseCategory" }
		},
		belongsTo : {
			project : { type : "Project", attribute : "moneyExpenseCategories" },
			parentExpenseCategory : { type : "MoneyExpenseCategory", attribute : "subExpenseCategories" },
			ownerUser : {
				type : "User",
				attribute : "moneyIncomes"
			}
		},
		rowView : "money/moneyExpenseCategoryRow",
		adapter: {
			type : "hyjSql"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

