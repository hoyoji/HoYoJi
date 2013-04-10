exports.definition = {
	config: {
		columns: {
		    id: "TEXT NOT NULL PRIMARY KEY",
		    name: "TEXT NOT NULL",
		    parentIncomeCategoryId: "TEXT",
		    projectId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
		    lastSyncTime : "TEXT",
			lastModifyTime : "TEXT"
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
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			// extended functions and properties go here
			xDelete : function(xFinishCallback) {
				if(this.xGet("id") === this.xGet("project").xGet("defaultIncomeCategoryId")){
					this.xGet("project").xSet("defaultIncomeCategoryId",null);
					this.xGet("project").xSave();
				}
				this._xDelete(xFinishCallback);
			}
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

