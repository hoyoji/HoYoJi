exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			nickName : "TEXT",
			remark : "TEXT",
			friendUserId : "TEXT NOT NULL",
			friendCategoryId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER"
		},
		belongsTo : {
			friendCategory : {
				type : "FriendCategory",
				attribute : "friends"
			},
			friendUser : {
				type : "User",
				attribute : null
			},
			ownerUser : {
				type : "User",
				attribute : null
			}
		},
		hasMany : {
			projectShareAuthorizations : {
				type : "ProjectShareAuthorization",
				attribute : "friend"
			},
			moneyExpenses : {
				type : "MoneyExpense",
				attribute : "friend"
			},
			moneyIncomes : {
				type : "MoneyIncome",
				attribute : "friend"
			},
			moneyBorrows : {
				type : "MoneyBorrow",
				attribute : "friend"
			},
			moneyLends : {
				type : "MoneyLend",
				attribute : "friend"
			},
			moneyPayback : {
				type : "MoneyPayback",
				attribute : "friend"
			},
			moneyReturns : {
				type : "MoneyReturn",
				attribute : "friend"
			}
		},
		rowView : "friend/friendRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			validators : {
				friendCategory : function(xValidateComplete) {
					var error;
					if (!this.xGet("friendCategory")) {
						error = {
							msg : "好友分类不能为空"
						};
					}
					xValidateComplete(error);
				}
			},
			getSharedWithHerProjects : function(){
				var self = this;
				var found = false;
				if(!this.__getSharedWithHerProjectsFilter){
					this.__getSharedWithHerProjectsFilter = this.xGet("projectShareAuthorizations").xCreateFilter(function(model){
						found = false;
							if(model.xGet("state") === "Wait" || model.xGet("state") === "Accept"){
								if (!model.xGet("project").xGet("parentProject")){
									found = true;
								}else{
									var parentProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
										projectId : model.xGet("project").xGet("parentProject").xGet("id"),
										friendId : model.xGet("friendId")
									});
									if(parentProjectShareAuthorizations.length > 0){
										found = true;
										for(var i=0 ; i<parentProjectShareAuthorizations.length ; i++){
											if(parentProjectShareAuthorizations.at(i).xGet("state") === "Wait" || parentProjectShareAuthorizations.at(i).xGet("state") === "Accept"){
											 	found = false;
											 	break;
											 }
										}
									}else{
										found = true;
									}
								}
							}
						return found;
					});
				}
				return this.__getSharedWithHerProjectsFilter;
			},
			getDisplayName : function() {
				if (!this.xGet("nickName")) {
					return this.xGet("friendUser").xGet("userName");
				} else {
					return this.xGet("nickName") + "(" + this.xGet("friendUser").xGet("userName") + ")";
				}
			},
			getSharedAccounts : function() {
				if (!this.__sharedAccounts) {
					var moneyAccounts = Alloy.createCollection("MoneyAccount");
					moneyAccounts.xSetFilter({
						ownerUser : this.xGet("friendUser")
					});
					moneyAccounts.xSearchInDb({
						ownerUserId : this.xGet("friendUser").xGet("id")
					});
					this.__sharedAccounts = moneyAccounts;
				}
				return this.__sharedAccounts;
			},

			xDelete : function(xFinishCallback) {
				var self = this;
				var projectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
					ownerUserId : Alloy.Models.User.id,
					friendId : this.xGet("id")
				});
				if (projectShareAuthorizations.length > 0) {
					xFinishCallback({
						msg : "您们之间有分享项目,请移除共享再删除"
					});
				} 
				else if(this.xGet("moneyExpenses").length > 0 || this.xGet("moneyIncomes").length > 0 || this.xGet("moneyBorrows").length > 0 || this.xGet("moneyLends").length > 0 || this.xGet("moneyPaybacks").length > 0 || this.xGet("moneyReturns").length > 0 ){
						xFinishCallback({
						msg : "账务中有数据与当前好友有关，不能删除"
					});
				}
				else {
					var friendProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
						ownerUserId : this.xGet("friendUserId")
					});
					if (friendProjectShareAuthorizations.length > 0) {
						xFinishCallback({
							msg : "您们之间有分享项目,请移除共享再删除"
						});
					} else {
						Alloy.Globals.Server.sendMsg({
							"toUserId" : this.xGet("friendUserId"),
							"fromUserId" : Alloy.Models.User.id,
							"type" : "System.Friend.Delete",
							"messageState" : "new",
							"messageTitle" : Alloy.Models.User.xGet("userName") + "把您移除出好友列表",
							"date" : (new Date()).toISOString(),
							"detail" : "用户" + Alloy.Models.User.xGet("userName") + "把您移除出好友列表",
							"messageBoxId" : this.xGet("friendUser").xGet("messageBoxId")
						}, function() {
							self._xDelete(xFinishCallback);
						});
					}
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
