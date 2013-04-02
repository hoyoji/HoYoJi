exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			parentProjectId : "TEXT",
			defaultIncomeCategoryId : "TEXT",
			defaultExpenseCategoryId : "TEXT"
			// projectSharedById : "TEXT"
		},
		// defaults : {
			// name : "",
		// },
		belongsTo : {
			ownerUser : { type : "User", attribute : "projects" },
			parentProject : { type : "Project", attribute : "subProjects" },
			defaultIncomeCategory : {type : "MoneyIncomeCategory", attribute : null},
			defaultExpenseCategory : {type : "MoneyExpenseCategory", attribute : null}
			// projectSharedBy : {type : "ProjectShareAuthorization", attribute : null}
		},
		hasMany : {
			moneyExpenseCategories : { type : "MoneyExpenseCategory", attribute : "project"},
			moneyIncomeCategories : { type : "MoneyIncomeCategory", attribute : "project"},
			subProjects : { type : "Project", attribute : "parentProject" },
			projectShareAuthorizations : { type : "ProjectShareAuthorization", attribute : "project" },
			moneyExpenses : {type : "MoneyExpense", attribute : "project"},
			moneyIncomes : {type : "MoneyIncome", attribute : "project"},
			moneyTransfers : {type : "MoneyTransfer", attribute : "project"}
		},
		rowView : "project/projectRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			validators : {
				// name : function(xValidateComplete){
					// var error;
					// if(!this.has("name") || this.xGet("name").length <= 0){
						// error = {msg : "请输入项目名称"};
					// }
					// xValidateComplete(error);
				// }
			},
			setDefaultExpenseCategory : function(expenseCategory){
				if(this.xGet("ownerUser") === Alloy.Models.User && this.xGet("defaultExpenseCategory") !== expenseCategory){
					this.xSet("defaultExpenseCategory", expenseCategory);
					this.save({defaultExpenseCategoryId : expenseCategory.xGet("id")}, {wait : true, patch : true});
				}
			},
			setDefaultIncomeCategory : function(incomeCategory){
				if(this.xGet("ownerUser") === Alloy.Models.User && this.xGet("defaultIncomeCategory") !== incomeCategory){
					this.xSet("defaultIncomeCategory", incomeCategory);
					this.save({defaultIncomeCategoryId : incomeCategory.xGet("id")}, {wait : true, patch : true});
				}
			},
			canEdit : function(){
				if(this.isNew()){
					return true;
				} else if(this.xGet("ownerUser") === Alloy.Models.User){
					return true;
				}
				return false;
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});
		return Collection;
	}
}
