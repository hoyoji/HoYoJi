exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			shareType : "TEXT",
        	remark : "TEXT",
        	ownerUserId : "TEXT NOT NULL",
			friendId : "TEXT NOT NULL",
	        projectId : "TEXT NOT NULL",
			
			shareAllSubProjects : "INTEGER NOT NULL",
			
			projectShareMoneyExpenseOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyExpenseAddNew : "INTEGER NOT NULL",
	        projectShareMoneyExpenseEdit : "INTEGER NOT NULL",
	        projectShareMoneyExpenseDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyExpenseDetailOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyExpenseDetailAddNew : "INTEGER NOT NULL",
	        projectShareMoneyExpenseDetailEdit : "INTEGER NOT NULL",
	        projectShareMoneyExpenseDetailDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyIncomeOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyIncomeAddNew : "INTEGER NOT NULL",
	        projectShareMoneyIncomeEdit : "INTEGER NOT NULL",
	        projectShareMoneyIncomeDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyIncomeDetailOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyIncomeDetailAddNew : "INTEGER NOT NULL",
	        projectShareMoneyIncomeDetailEdit : "INTEGER NOT NULL",
	        projectShareMoneyIncomeDetailDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyExpenseCategoryAddNew : "INTEGER NOT NULL",
	        projectShareMoneyExpenseCategoryEdit : "INTEGER NOT NULL",
	        projectShareMoneyExpenseCategoryDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyIncomeCategoryAddNew : "INTEGER NOT NULL",
	        projectShareMoneyIncomeCategoryEdit : "INTEGER NOT NULL",
	        projectShareMoneyIncomeCategoryDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyTransferOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyTransferAddNew : "INTEGER NOT NULL",
	        projectShareMoneyTransferEdit : "INTEGER NOT NULL",
	        projectShareMoneyTransferDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanLendOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanLendAddNew : "INTEGER NOT NULL",
	        projectShareLoanLendEdit : "INTEGER NOT NULL",
	        projectShareLoanLendDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanBorrowOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanBorrowAddNew : "INTEGER NOT NULL",
	        projectShareLoanBorrowEdit : "INTEGER NOT NULL",
	        projectShareLoanBorrowDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanPaybackOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanPaybackAddNew : "INTEGER NOT NULL",
	        projectShareLoanPaybackEdit : "INTEGER NOT NULL",
	        projectShareLoanPaybackDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanReturnOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanReturnAddNew : "INTEGER NOT NULL",
	        projectShareLoanReturnEdit : "INTEGER NOT NULL",
	        projectShareLoanReturnDelete : "INTEGER NOT NULL"
		},
		defaults : {
			shareAllSubProjects : 0,
			
			projectShareMoneyExpenseOwnerDataOnly : 0,
	        projectShareMoneyExpenseAddNew : 1,
	        projectShareMoneyExpenseEdit : 1,
	        projectShareMoneyExpenseDelete : 1,
	        
	        projectShareMoneyExpenseDetailOwnerDataOnly : 0,
	        projectShareMoneyExpenseDetailAddNew : 1,
	        projectShareMoneyExpenseDetailEdit : 1,
	        projectShareMoneyExpenseDetailDelete : 1,
	        
	        projectShareMoneyIncomeOwnerDataOnly : 0,
	        projectShareMoneyIncomeAddNew : 1,
	        projectShareMoneyIncomeEdit : 1,
	        projectShareMoneyIncomeDelete : 1,
	        
	        projectShareMoneyIncomeDetailOwnerDataOnly : 0,
	        projectShareMoneyIncomeDetailAddNew : 1,
	        projectShareMoneyIncomeDetailEdit : 1,
	        projectShareMoneyIncomeDetailDelete : 1,
	        
	        projectShareMoneyExpenseCategoryAddNew : 1,
	        projectShareMoneyExpenseCategoryEdit : 1,
	        projectShareMoneyExpenseCategoryDelete : 1,
	        
	        projectShareMoneyIncomeCategoryAddNew : 1,
	        projectShareMoneyIncomeCategoryEdit : 1,
	        projectShareMoneyIncomeCategoryDelete : 1,
	        
	        projectShareMoneyTransferOwnerDataOnly : 0,
	        projectShareMoneyTransferAddNew : 1,
	        projectShareMoneyTransferEdit : 1,
	        projectShareMoneyTransferDelete : 1,
	        
	        projectShareLoanLendOwnerDataOnly : 0,
	        projectShareLoanLendAddNew : 1,
	        projectShareLoanLendEdit : 1,
	        projectShareLoanLendDelete : 1,
	        
	        projectShareLoanBorrowOwnerDataOnly : 0,
	        projectShareLoanBorrowAddNew : 1,
	        projectShareLoanBorrowEdit : 1,
	        projectShareLoanBorrowDelete : 1,
	        
	        projectShareLoanPaybackOwnerDataOnly : 0,
	        projectShareLoanPaybackAddNew : 1,
	        projectShareLoanPaybackEdit : 1,
	        projectShareLoanPaybackDelete : 1,
	        
	        projectShareLoanReturnOwnerDataOnly : 0,
	        projectShareLoanReturnAddNew : 1,
	        projectShareLoanReturnEdit : 1,
	        projectShareLoanReturnDelete : 1
		},
		belongsTo : {
			ownerUser : { type : "User", attribute : null },
			friend : { type : "Friend", attribute : "projectShareAuthorizations" },
			project : { type : "Project", attribute : "projectShareAuthorizations" }
		},
		hasMany : {
		},
		rowView : "project/projectShareAuthorizationRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			validators : {
				friend : function(xValidateComplete) {
					var error;
					if (!this.xGet("friend")) {
						error = {
							msg : "好友不能为空"
						};
					}else if (!this.isNew()) {
						if (this.hasChanged("friend")) {
							xValidateComplete({
								msg : "好友不能被修改"
							});
						}
					}
					xValidateComplete(error);
				}
			},
			xDelete : function(xFinishCallback) {
				var self = this;
				var subProjectShareAuthorizationIds = [];
				this.xGet("project").xGetDescendents("subProjects").map(function(subProject){
					var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							projectId : subProject.xGet("id"),
							friendId : self.xGet("friendId")
						});
					if(subProjectShareAuthorization.xGet("id")){
						subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
						subProjectShareAuthorization._xDelete();
					}
				});
				Alloy.Globals.Server.sendMsg({
					"toUserId" : this.xGet("friend").xGet("friendUser").xGet("id"),
					"fromUserId" : Alloy.Models.User.xGet("id"),
					"type" : "Project.Share.Delete",
					"messageState" : "new",
					"messageTitle" : Alloy.Models.User.xGet("userName")+"分享项目"+this.xGet("project").xGet("name")+"的子项目给您",
					"date" : (new Date()).toISOString(),
					"detail" : "用户" + Alloy.Models.User.xGet("userName") + "分享项目" + this.xGet("project").xGet("name") +"的子项目给您",
					"messageBoxId" : this.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
					"messageData" : JSON.stringify({
			                            shareAllSubProjects : this.xGet("shareAllSubProjects"),
			                            projectShareAuthorizationId : this.xGet("id"),
			                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
			                        })
			         },function(){
				        self._xDelete(xFinishCallback);
	    			},function(){
	    				xFinishCallback({ msg :"删除出错,请重试"});
	    			});	
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});
		return Collection;
	}
}
