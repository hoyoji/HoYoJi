exports.definition = {
	config: {
		columns: {
		    id: "TEXT NOT NULL PRIMARY KEY",
		    name: "TEXT NOT NULL",
		    parentIncomeCategoryId: "TEXT",
		    projectId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL"
		},
		hasMany : {
			subIncomeCategories : { type : "MoneyIncomeCategory", attribute : "parentIncomeCategory" }
		},
		belongsTo : {
			project : { type : "Project", attribute : "moneyIncomeCategories" },
			parentIncomeCategory : { type : "MoneyIncomeCategory", attribute : "subIncomeCategories" },
			ownerUser : {
				type : "User",
				attribute : "moneyIncomes"
			}
		},
		rowView : "money/moneyIncomeCategoryRow",
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

