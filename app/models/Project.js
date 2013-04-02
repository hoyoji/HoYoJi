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
			moneyTransfers : {type : "MoneyTransfer", attribute : "project"},
			moneyLoanBorrows : {type : "MoneyLoanBorrow", attribute : "project"},
			moneyLoanReturns : {type : "MoneyLoanReturn", attribute : "project"},
			moneyLoanLends : {type : "MoneyLoanLend", attribute : "project"},
			moneyLoanPaybacks : {type : "MoneyLoanPayback", attribute : "project"}
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
			}
			// ,
			// xGet : function(attr) {
				// var projectSharedBy = Alloy.Globals.XModel.xGet.call(this, "projectSharedBy");
				// if(projectSharedBy){
					// return Alloy.Globals.XModel.xGet.call(projectSharedBy.xGet("project"), attr);
				// } else {
					// return Alloy.Globals.XModel.xGet.call(this, attr);
				// }
			// },
			// xSave : function(options) {
				// var projectSharedBy = Alloy.Globals.XModel.xGet.call(this, "projectSharedBy");
				// if(projectSharedBy){
					// return Alloy.Globals.XModel.xSave.call(projectSharedBy.xGet("project"), options);
				// } else {
					// return Alloy.Globals.XModel.xSave.call(this, options);
				// }
			// },
			// xAddToSave : function(saveableController) {
				// var projectSharedBy = Alloy.Globals.XModel.xGet.call(this, "projectSharedBy");
				// if(projectSharedBy){
					// return Alloy.Globals.XModel.xAddToSave.call(projectSharedBy.xGet("project"), saveableController);
				// } else {
					// return Alloy.Globals.XModel.xAddToSave.call(this, saveableController);
				// }
			// },
			// xSet : function(a, b, c) {
				// var projectSharedBy = Alloy.Globals.XModel.xGet.call(this, "projectSharedBy");
				// if(projectSharedBy){
					// return Alloy.Globals.XModel.xSet.call(projectSharedBy.xGet("project"), a, b, c);
				// } else {
					// return Alloy.Globals.XModel.xSet.call(this, a, b, c);
				// }
			// },			
			// xGetDescendents : function(attribute) {
				// var projectSharedBy = Alloy.Globals.XModel.xGet.call(this, "projectSharedBy");
				// if(projectSharedBy){
					// alert("we.should.not.use.this on shared project");
					// return null;
					// // return Alloy.Globals.XModel.xGetDescendents.call(projectSharedBy.xGet("project"), attribute);
				// } else {
					// return Alloy.Globals.XModel.xGetDescendents.call(this, attribute);
				// }
			// },
			// xGetAncestors : function(attribute) {
				// var projectSharedBy = Alloy.Globals.XModel.xGet.call(this, "projectSharedBy");
				// if(projectSharedBy){
					// alert("we.should.not.use.this on shared project");
					// return null;
					// // return Alloy.Globals.XModel.xGetAncestors.call(projectSharedBy.xGet("project"), attribute);
				// } else {
					// return Alloy.Globals.XModel.xGetAncestors.call(this, attribute);
				// }
			// },
			// xDelete : function(xFinishCallback) {
				// if(this.xGet("projectSharedBy")){
					// xFinishCallback({ msg : "不能移除共享来的项目"});
				// }else if(this.xGet("projectShareAuthorizations").length > 0){
					// xFinishCallback({ msg : "项目共享给好友,请移除共享再删除"});
				// }else{
					// this._xDelete(xFinishCallback);
				// }
			// }
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
