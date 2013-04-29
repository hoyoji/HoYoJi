exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    name: "TEXT NOT NULL",
		    parentIncomeCategoryId: "TEXT",
		    projectId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER"
		},
		hasMany : {
			subIncomeCategories : { type : "MoneyIncomeCategory", attribute : "parentIncomeCategory" },
			moneyIncomes : { type : "MoneyIncome", attribute : "moneyIncomeCategory" }
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
			xDelete : function(xFinishCallback, options) {
				// if(this.xGet("moneyIncomes").length > 0){
					// xFinishCallback({ msg :"分类下收入不为空，不能删除"});
				// }else if(this.xGet("subIncomeCategories").length > 0){
					// xFinishCallback({ msg :"分类下下级分类不为空，不能删除"});
				// }else{
							if(this.xGet("id") === this.xGet("project").xGet("defaultIncomeCategoryId")){
								var saveOptions = _.extend({}, options);
								saveOptions.patch = true;
								saveOptions.wait = true;
								this.xGet("project").save({ defaultIncomeCategoryId : null}, saveOptions);
							}
					this._xDelete(function(error, options){
						if(!error){
						}
						xFinishCallback(error);	
					}, options);
				// }
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

