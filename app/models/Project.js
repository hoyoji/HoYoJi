exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			parentProjectId : "TEXT"
		},
		// defaults : {
			// name : "",
		// },
		belongsTo : {
			ownerUser : { type : "User", attribute : "projects" },
			parentProject : { type : "Project", attribute : "subProjects" }
		},
		hasMany : {
			moneyExpenseCategories : { type : "MoneyExpenseCategory", attribute : "project"},
			moneyIncomeCategories : { type : "MoneyIncomeCategory", attribute : "project"},
			subProjects : { type : "Project", attribute : "parentProject" }
		},
		rowView : "project/projectRow",
		adapter : {
			collection_name : "Project",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
				// name : function(xValidateComplete){
					// var error;
					// if(!this.has("name") || this.get("name").length <= 0){
						// error = {msg : "请输入项目名称"};
					// }
					// xValidateComplete(error);
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
}
