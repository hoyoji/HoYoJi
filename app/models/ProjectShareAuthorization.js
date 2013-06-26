exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			shareType : "TEXT",
        	remark : "TEXT",
        	ownerUserId : "TEXT NOT NULL",
			// friendId : "TEXT",
			friendUserId : "TEXT",
			state : "TEXT NOT NULL", // Accept, Reject, Wait, Delete
	        projectId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER",
			actualTotalIncome : "REAL NOT NULL",
			actualTotalExpense : "REAL NOT NULL",
			apportionedTotalIncome : "REAL NOT NULL",
			apportionedTotalExpense : "REAL NOT NULL",
			sharedTotalIncome : "REAL NOT NULL",
			sharedTotalExpense : "REAL NOT NULL",
			sharePercentage : "REAL NOT NULL",
		    sharePercentageType : "TEXT NOT NULL", // average, fixed
		    
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
	        
	        // projectShareMoneyTransferOwnerDataOnly : "INTEGER NOT NULL",
	        // projectShareMoneyTransferAddNew : "INTEGER NOT NULL",
	        // projectShareMoneyTransferEdit : "INTEGER NOT NULL",
	        // projectShareMoneyTransferDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyLendOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyLendAddNew : "INTEGER NOT NULL",
	        projectShareMoneyLendEdit : "INTEGER NOT NULL",
	        projectShareMoneyLendDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyBorrowOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyBorrowAddNew : "INTEGER NOT NULL",
	        projectShareMoneyBorrowEdit : "INTEGER NOT NULL",
	        projectShareMoneyBorrowDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyPaybackOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyPaybackAddNew : "INTEGER NOT NULL",
	        projectShareMoneyPaybackEdit : "INTEGER NOT NULL",
	        projectShareMoneyPaybackDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyReturnOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyReturnAddNew : "INTEGER NOT NULL",
	        projectShareMoneyReturnEdit : "INTEGER NOT NULL",
	        projectShareMoneyReturnDelete : "INTEGER NOT NULL"
		},
		defaults : {
			lastServerUpdateTime : 0,
			lastClientUpdateTime : 0,
			
			sharePercentageType : "average",
			sharePercentage : 100,
			
			actualTotalIncome : 0,
			actualTotalExpense : 0,
			apportionedTotalIncome : 0,
			apportionedTotalExpense : 0,
			sharedTotalIncome : 0,
			sharedTotalExpense : 0,
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
	        
	        // projectShareMoneyTransferOwnerDataOnly : 0,
	        // projectShareMoneyTransferAddNew : 1,
	        // projectShareMoneyTransferEdit : 1,
	        // projectShareMoneyTransferDelete : 1,
	        
	        projectShareMoneyLendOwnerDataOnly : 0,
	        projectShareMoneyLendAddNew : 1,
	        projectShareMoneyLendEdit : 1,
	        projectShareMoneyLendDelete : 1,
	        
	        projectShareMoneyBorrowOwnerDataOnly : 0,
	        projectShareMoneyBorrowAddNew : 1,
	        projectShareMoneyBorrowEdit : 1,
	        projectShareMoneyBorrowDelete : 1,
	        
	        projectShareMoneyPaybackOwnerDataOnly : 0,
	        projectShareMoneyPaybackAddNew : 1,
	        projectShareMoneyPaybackEdit : 1,
	        projectShareMoneyPaybackDelete : 1,
	        
	        projectShareMoneyReturnOwnerDataOnly : 0,
	        projectShareMoneyReturnAddNew : 1,
	        projectShareMoneyReturnEdit : 1,
	        projectShareMoneyReturnDelete : 1
		},
		belongsTo : {
			ownerUser : { type : "User", attribute : null },
			// friend : { type : "Friend", attribute : "projectShareAuthorizations" },
			friendUser : { type : "User", attribute : "projectShareAuthorizations" },
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
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			validators : {
				// friend : function(xValidateComplete) {
					// var error;
					// if (!this.xGet("friend")) {
						// error = {
							// msg : "好友不能为空"
						// };
					// }else if (!this.isNew()) {
						// if (this.hasChanged("friend")) {
							// xValidateComplete({
								// msg : "好友不能被修改"
							// });
						// }
					// }
					// xValidateComplete(error);
				// }
			},
			getSharedWithHerSubProjects : function(){
				var self = this;
				var found = false;
				if(!this.__getSharedWIthHerSubProjectsFilter){
					this.__getSharedWIthHerSubProjectsFilter = this.xGet("ownerUser").xGet("projectShareAuthorizations").xCreateFilter(function(model){
						found = false;
						self.xPrevious("project").xGet("subProjects").map(function(subProject){
							if (model.xPrevious("project").xGet("id") ===  subProject.xGet("id")
								&& (model.xPrevious("state") === "Wait" || model.xPrevious("state") === "Accept")){
								found = true;
							}
						});
						return found;
					});
				}
				return this.__getSharedWIthHerSubProjectsFilter;
			},
			getFriendDisplayName : function(){
				var friend = Alloy.createModel("Friend").xFindInDb({
					friendUserId : this.xGet("friendUserId")
				});
				if(friend.id){
					return friend.getDisplayName();
				} else {
					return this.xGet("friendUser").xGet("userName");
				}
			},
			getActualTotal : function(){
				var getActualTotal = 0;
				if(this.xGet("actualTotalIncome") - this.xGet("actualTotalExpense") <= 0){
					getActualTotal = this.xGet("actualTotalExpense") - this.xGet("actualTotalIncome");
					return "实际支出 : "+ getActualTotal;
				}else{
					getActualTotal = this.xGet("actualTotalIncome") - this.xGet("actualTotalExpense");
					return "实际收入 : "+ getActualTotal;
				}
				
			},
			getApportionedTotal : function(){
				var getApportionedTotal = 0;
				if(this.xGet("apportionedTotalIncome") - this.xGet("apportionedTotalExpense") <= 0){
					getApportionedTotal = this.xGet("apportionedTotalExpense") - this.xGet("apportionedTotalIncome");
					return "应该支出 : "+ getApportionedTotal;
				}else{
					getApportionedTotal = this.xGet("apportionedTotalIncome") - this.xGet("apportionedTotalExpense");
					return "应该收入 : "+ getApportionedTotal;
				}
			},
			getSharePercentage : function(){
				return "占股 : "+ this.xGet("sharePercentage");
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				var subProjectShareAuthorizationIds = [];
				this.xGet("project").xGetDescendents("subProjects").map(function(subProject){
					var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							projectId : subProject.xGet("id"),
							friendUserId : self.xGet("friendUserId")
						});
					if(subProjectShareAuthorization.id){
						subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
						subProjectShareAuthorization._xDelete(xFinishCallback, options);
					}
				});
				Alloy.Globals.Server.sendMsg({
					id : guid(),
					"toUserId" : self.xGet("friendUserId"),
					"fromUserId" : Alloy.Models.User.xGet("id"),
					"type" : "Project.Share.Delete",
					"messageState" : "unread",
					"messageTitle" : Alloy.Models.User.xGet("userName")+"不再共享项目"+self.xGet("project").xGet("name")+"及子项目给您",
					"date" : (new Date()).toISOString(),
					"detail" : "用户" + Alloy.Models.User.xGet("userName") + "不再共享项目" + self.xGet("project").xGet("name") +"及子项目给您",
					"messageBoxId" : self.xGet("friendUser").xGet("messageBoxId"),
					"messageData" : JSON.stringify({
			                            shareAllSubProjects : this.xGet("shareAllSubProjects"),
			                            projectShareAuthorizationId : this.xGet("id"),
			                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
			                        })
		         },function(){
			        self._xDelete(xFinishCallback, options);
    			},function(e){
    				xFinishCallback({ msg :"删除出错,请重试 : " + e.__summary.msg});
    			});	
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
			syncAddNew : function(record, dbTrans) {
				var self = this;
				var friendUser = Alloy.createModel("User").xFindInDb({
					id : record.friendUserId
				});
				// 同步新增好友时，一起把该好友用户同步下来
				if (!friendUser.id) {
					Alloy.Globals.Server.loadData("User", [record.friendUserId], function(collection) {
						if (collection.length > 0) {
						}
					});
				}
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
