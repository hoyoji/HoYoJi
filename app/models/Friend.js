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
			// moneyExpenses : {
				// type : "MoneyExpense",
				// attribute : "friend"
			// },
			// moneyIncomes : {
				// type : "MoneyIncome",
				// attribute : "friend"
			// },
			// moneyBorrows : {
				// type : "MoneyBorrow",
				// attribute : "friend"
			// },
			// moneyLends : {
				// type : "MoneyLend",
				// attribute : "friend"
			// },
			// moneyPayback : {
				// type : "MoneyPayback",
				// attribute : "friend"
			// },
			// moneyReturns : {
				// type : "MoneyReturn",
				// attribute : "friend"
			// }
		},
		rowView : "friend/friendRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
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
			getSharedWithHerProjects : function() {
				var self = this;
				var found = false;
				if (!this.__getSharedWithHerProjectsFilter) {
					this.__getSharedWithHerProjectsFilter = this.xGet("ownerUser").xGet("projectShareAuthorizations").xCreateFilter(function(model) {
						found = false;
						if ((model.xPrevious("state") === "Wait" || model.xPrevious("state") === "Accept") && !(model.xPrevious("friendUserId") === Alloy.Models.User.id)) {
							if (!model.xPrevious("project").xPrevious("parentProject")) {
								found = true;
							} else {
								var parentProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
									projectId : model.xPrevious("project").xPrevious("parentProject").xGet("id"),
									friendUserId : model.xPrevious("friendUserId")
								});
								if (parentProjectShareAuthorizations.length > 0) {
									found = true;
									for (var i = 0; i < parentProjectShareAuthorizations.length; i++) {
										if (parentProjectShareAuthorizations.at(i).xPrevious("state") === "Wait" || parentProjectShareAuthorizations.at(i).xPrevious("state") === "Accept") {
											found = false;
											break;
										}
									}
								} else {
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
				// if(this.xGet("moneyExpenses").length > 0){
					// xFinishCallback({ msg :"您与好友有支出关联，不能删除"});
				// }else if(this.xGet("moneyIncomes").length > 0){
					// xFinishCallback({ msg :"您与好友有收入关联，不能删除"});
				// }else if(this.xGet("moneyBorrows").length > 0){
					// xFinishCallback({ msg :"您与好友有借入关联，不能删除"});
				// }else if(this.xGet("moneyReturns").length > 0){
					// xFinishCallback({ msg :"您与好友有还款关联，不能删除"});
				// }else if(this.xGet("moneyLends").length > 0){
					// xFinishCallback({ msg :"您与好友有借出关联，不能删除"});
				// }else if(this.xGet("moneyPayback").length > 0){
					// xFinishCallback({ msg :"您与好友有收款关联，不能删除"});
				// }else {
					var self = this;
					if (options.dbTrans) {
						options.dbTrans.xCommitStart();
					}
					//去服务器上查找与该好友之间有没有共享存在
					Alloy.Globals.Server.getData([{
						__dataType : "ProjectShareAuthorization",
						ownerUserId : Alloy.Models.User.id,
						state : "Accept",
						friendUserId : this.xGet("friendUser").xGet("id")
					}, {
						__dataType : "ProjectShareAuthorization",
						state : "Accept",
						ownerUserId : self.xGet("friendUserId")
					}], function(data) {
						if (data[0].length > 0) {
							xFinishCallback({
								msg : "您与该好友有共享项目,请移除共享再删除"
							});
						} else if (data[1].length > 0) {
							xFinishCallback({
								msg : "您与该好友有共享项目,请移除共享再删除"
							});
						} else {
							//发送删除消息给好友
							Alloy.Globals.Server.sendMsg({
								id : guid(),
								"toUserId" : self.xGet("friendUserId"),
								"fromUserId" : Alloy.Models.User.id,
								"type" : "System.Friend.Delete",
								"messageState" : "new",
								"messageTitle" : "删除好友",
								"date" : (new Date()).toISOString(),
								"detail" : "用户" + Alloy.Models.User.xGet("userName") + "把您移除出好友列表",
								"messageBoxId" : self.xGet("friendUser").xGet("messageBoxId")
							}, function() {
								//在服务器上删除该好友
								Alloy.Globals.Server.deleteData([{
									__dataType : "Friend",
									id : self.xGet("id")
								}], function() {
									
									var delSuccess = self._xDelete(function(error){
										xFinishCallback(error);
									}, options);
									
									if (delSuccess && options.dbTrans) {
										options.dbTrans.xCommitEnd();
									}
									
								}, function(e) {
									alert(e.__summary.msg);
									xFinishCallback(e.__summary);
								});
								
							}, function(e) {
								alert(e.__summary.msg);
								xFinishCallback(e.__summary);
							});
						}
					}, function(e) {
						alert(e.__summary.msg);
						xFinishCallback(e.__summary);
					});
				// }
				
			},			
			_syncDelete : function(record, dbTrans, xFinishedCallback) {
				this._xDelete(xFinishedCallback, {
					dbTrans : dbTrans,
					syncFromServer : true,
					wait : true
				});
			}
			// ,
			// _syncUpdate : function(record, dbTrans) {
				// //delete record.id;
				// this.save(record, {
					// dbTrans : dbTrans,
					// syncFromServer : true,
					// patch : true,
					// wait : true
				// });
			// }			
			// syncAddNew : function(record, dbTrans) {
				// var self = this;
				// var friendUser = Alloy.createModel("User").xFindInDb({
					// id : record.friendUserId
				// });
				// // 同步新增好友时，一起把该好友用户同步下来
				// if (!friendUser.id) {
					// Alloy.Globals.Server.loadData("User", [record.friendUserId], function(collection) {
						// if (collection.length > 0) {
						// }
					// });
				// }
			// }
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
