exports.definition = {
	config : {
		columns : {
			"id" : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			"name" : "TEXT NOT NULL",
			"parentExpenseCategoryId" : "TEXT",
			"projectId" : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		hasMany : {
			subExpenseCategories : {
				type : "MoneyExpenseCategory",
				attribute : "parentExpenseCategory",
				cascadeDelete : true
			},
			moneyExpenses : {
				type : "MoneyExpense",
				attribute : "moneyExpenseCategory"
			}
		},
		belongsTo : {
			project : {
				type : "Project",
				attribute : "moneyExpenseCategories"
			},
			parentExpenseCategory : {
				type : "MoneyExpenseCategory",
				attribute : "subExpenseCategories"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyIncomes"
			}
		},
		rowView : "money/moneyExpenseCategoryRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			xDelete : function(xFinishCallback, options) {
				// if(this.xGet("moneyExpenses").length > 0){
				// xFinishCallback({ msg :"分类下支出不为空，不能删除"});
				// }else if(this.xGet("subExpenseCategories").length > 0){
				// xFinishCallback({ msg :"分类下下级分类不为空，不能删除"});
				// }else{
				var self = this;
				this._xDelete(function(e){
					if(!e){
						if (self.xGet("project") 
							&& !self.xGet("project").hasDestroyed 
							&& self.xGet("id") === self.xGet("project").xGet("defaultExpenseCategoryId")) {
							var saveOptions = {wait : true};
							saveOptions.patch = true;
							self.xGet("project").save({
								defaultExpenseCategoryId : null
							}, saveOptions);
						}
					}
					xFinishCallback(e);
				}, options);
				// }
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
};

