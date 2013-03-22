exports.definition = {
	config: {
		columns: {
		    id: "TEXT NOT NULL PRIMARY KEY",
		    name: "TEXT NOT NULL",
		    parentIncomeCategoryId: "TEXT",
		    projectId : "TEXT NOT NULL"
		},
		hasMany : {
			subIncomeCategories : { type : "MoneyIncomeCategory", attribute : "parentIncomeCategory" }
		},
		belongsTo : {
			project : { type : "Project", attribute : "moneyIncomeCategories" },
			parentIncomeCategory : { type : "MoneyIncomeCategory", attribute : "subIncomeCategories" }
		},
		rowView : "money/moneyIncomeCategoryRow",
		adapter: {
			collection_name: "MoneyIncomeCategory",
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

