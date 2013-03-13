exports.definition = {
	config: {
		columns: {
		    "id": "TEXT NOT NULL PRIMARY KEY",
		    "name": "TEXT NOT NULL",
		    "parentExpenseCategoryId": "TEXT",
		    "projectId" : "TEXT NOT NULL"
		},
		hasMany : {
			subExpenseCategories : { type : "MoneyExpenseCategory", attribute : "parentExpenseCategory" }
		},
		belongsTo : {
			project : { type : "Project", attribute : "moneyExpenseCategories" },
			parentExpenseCategory : { type : "MoneyExpenseCategory", attribute : "subExpenseCategories" }
		},
		rowView : "money/moneyExpenseCategoryRow",
		adapter: {
			collection_name: "MoneyExpenseCategory",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
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

