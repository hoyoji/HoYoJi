exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			parentProjectId : "TEXT",
			defaultIncomeCategoryId : "TEXT",
			defaultExpenseCategoryId : "TEXT",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		   },
		// defaults : {
			// name : "",
		// },
		belongsTo : {
			ownerUser : { type : "User", attribute : "projects" },
			parentProject : { type : "Project", attribute : "subProjects" },
			defaultIncomeCategory : {type : "MoneyIncomeCategory", attribute : null},
			defaultExpenseCategory : {type : "MoneyExpenseCategory", attribute : null}
		},
		hasMany : {
			moneyExpenseCategories : { type : "MoneyExpenseCategory", attribute : "project"},
			moneyIncomeCategories : { type : "MoneyIncomeCategory", attribute : "project"},
			subProjects : { type : "Project", attribute : "parentProject" },
			projectShareAuthorizations : { type : "ProjectShareAuthorization", attribute : "project" },
			moneyExpenses : {type : "MoneyExpense", attribute : "project"},
			moneyIncomes : {type : "MoneyIncome", attribute : "project"},
			moneyTransfers : {type : "MoneyTransfer", attribute : "project"},
			moneyBorrows : {type : "MoneyBorrow", attribute : "project"},
			moneyReturns : {type : "MoneyReturn", attribute : "project"},
			moneyLends : {type : "MoneyLend", attribute : "project"},
			moneyPaybacks : {type : "MoneyPayback", attribute : "project"}
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
				parentProject : function(xValidateComplete) {
					var error;
					if (this.xGet("parentProject") && (this.xGet("parentProject").xGet("ownerUserId") !== Alloy.Models.User.id)) {
						error = {
							msg : "共享项目不能作为本地项目的上级"
						};
					}
					xValidateComplete(error);
				}
			},
			xDelete : function(xFinishCallback, options) {
				// // if(Alloy.Models.User.xGet("activeProjectId") === this.xGet("id")){
					// // xFinishCallback({ msg :"不能删除当前激活的项目"});
				// // }else if(this.xGet("moneyExpenses").length > 0){
					// // xFinishCallback({ msg :"项目中的支出不为空，不能删除"});
				// // }else if(this.xGet("moneyIncomes").length > 0){
					// // xFinishCallback({ msg :"项目中的收入不为空，不能删除"});
				// // }else if(this.xGet("moneyTransfers").length > 0){
					// // xFinishCallback({ msg :"项目中的转账不为空，不能删除"});
				// // }else if(this.xGet("moneyBorrows").length > 0){
					// // xFinishCallback({ msg :"项目中的借出不为空，不能删除"});
				// // }else if(this.xGet("moneyReturns").length > 0){
					// // xFinishCallback({ msg :"项目中的还款不为空，不能删除"});
				// // }else if(this.xGet("moneyLends").length > 0){
					// // xFinishCallback({ msg :"项目中的借出不为空，不能删除"});
				// // }else if(this.xGet("moneyPaybacks").length > 0){
					// // xFinishCallback({ msg :"项目中的收款不为空，不能删除"});
				// // }else if(this.xGet("moneyExpenseCategories").length > 0){
					// // xFinishCallback({ msg :"项目中的支出分类不为空，不能删除"});
				// // }else if(this.xGet("moneyIncomeCategories").length > 0){
					// // xFinishCallback({ msg :"项目中的收入分类不为空，不能删除"});
				// // }else {
					this._xDelete(function(error){
						if(!error){
							if(Alloy.Models.User.xGet("activeProjectId") === this.xGet("id")){
								Alloy.Models.User.xSet("activeProject", null);
								Alloy.Models.User.save("activeProjectId", null, options);
							}
						}
						xFinishCallback(error);
					}, options);
				// // }
			},
			getSharedWithHerSubProjects : function(){
				if(!this.__getSharedWIthHerSubProjectsFilter){
					this.__getSharedWIthHerSubProjectsFilter = this.xGet("subProjects").xCreateFilter({
					// ....
					});
				}
				return this.__getSharedWIthHerSubProjectsFilter;
			},
			getSharedWithHerFriends : function(){
				if(!this.__getSharedWithHerFriendsFilter){
					this.__getSharedWithHerFriendsFilter = this.xGet("projectShareAuthorizations").xCreateFilter(function(model){
						return model.xGet("state") === "Wait" || model.xGet("state") === "Accept";
					});
				}
				return this.__getSharedWithHerFriendsFilter;
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
			},
			canDelete : function(){
				return this.xGet("ownerUser") === Alloy.Models.User;
			},
			canExpenseCategoryAddNew : function(){
				if(this.xGet("ownerUser") !== Alloy.Models.User){
					var projectShareAuthorization = this.xGet("projectShareAuthorizations").at(0);
					if(projectShareAuthorization.xGet("projectShareMoneyExpenseCategoryAddNew")){
						return true;		
					} else {
						return false;
					}
				}
				return this.xGet("ownerUser") === Alloy.Models.User;
			},
			canIncomeCategoryAddNew : function(){
				if(this.xGet("ownerUser") !== Alloy.Models.User){
					var projectShareAuthorization = this.xGet("projectShareAuthorizations").at(0);
					if(projectShareAuthorization.xGet("projectShareMoneyIncomeCategoryAddNew")){
						return true;		
					} else {
						return false;
					}
				}
				return this.xGet("ownerUser") === Alloy.Models.User;
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
