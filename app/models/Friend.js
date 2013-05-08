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
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
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
							if(model.xPrevious("state") === "Wait" || model.xPrevious("state") === "Accept"){
								if (!model.xPrevious("project").xPrevious("parentProject")){
									found = true;
								}else{
									var parentProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
										projectId : model.xPrevious("project").xPrevious("parentProject").xGet("id"),
										friendId : model.xPrevious("friendId")
									});
									if(parentProjectShareAuthorizations.length > 0){
										found = true;
										for(var i=0 ; i<parentProjectShareAuthorizations.length ; i++){
											if(parentProjectShareAuthorizations.at(i).xPrevious("state") === "Wait" || parentProjectShareAuthorizations.at(i).xPrevious("state") === "Accept"){
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

			xDelete : function(xFinishCallback, options) {
				var self = this;
				Alloy.Globals.Server.getData([{
					__dataType : "ProjectShareAuthorization",
					ownerUserId : Alloy.Models.User.id,
					state : "Accept",
					friendId : this.xGet("id")
				}], function(data) {
					if (data[0].length > 0) {
						xFinishCallback({
							msg : "您与该好友有共享项目,请移除共享再删除"
						});
					} else {
						Alloy.Globals.Server.getData([{
							__dataType : "ProjectShareAuthorization",
							state : "Accept",
							ownerUserId : self.xGet("friendUserId")
						}], function(data) {
							if (data[0].length > 0) {
								xFinishCallback({
									msg : "您与该好友有共享项目,请移除共享再删除"
								});
							} else {
								Alloy.Globals.Server.sendMsg({
									id : guid(),
									"toUserId" : self.xGet("friendUserId"),
									"fromUserId" : Alloy.Models.User.id,
									"type" : "System.Friend.Delete",
									"messageState" : "new",
									"messageTitle" : Alloy.Models.User.xGet("userName"),
									"date" : (new Date()).toISOString(),
									"detail" : "用户" + Alloy.Models.User.xGet("userName") + "把您移除出好友列表",
									"messageBoxId" : self.xGet("friendUser").xGet("messageBoxId")
								}, function() {
									
									Alloy.Globals.Server.deleteData(
									[{__dataType : "Friend", id : self.xGet("id")}], function() {
									}, function(e) {
										alert(e.__summary.msg);
									});
									self._xDelete(xFinishCallback, options);
									xFinishCallback({
										msg : "删除好友成功"
									});
									
								}, function(e){
									alert(e.__summary.msg);
								});
							}
						}, function(e) {
							alert(e.__summary.msg);
						});
					}
				}, function(e) {
					alert(e.__summary.msg);
				});
			},
			syncAddNew : function(record, dbTrans) {
				var self = this;
				var friendUser = Alloy.createModel("User").xFindInDb({id : record.friendUserId});
				if(!friendUser.id){
					Alloy.Globals.Server.loadData("User", [record.friendUserId], function(collection) {
						if (collection.length > 0) {
							successCB();
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
