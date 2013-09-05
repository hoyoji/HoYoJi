exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			shareType : "TEXT",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			// friendId : "TEXT",
			friendUserId : "TEXT NOT NULL",
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

			sharePercentageType : "Average",
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
			ownerUser : {
				type : "User",
				attribute : null
			},
			// friend : { type : "Friend", attribute : "projectShareAuthorizations" },
			friendUser : {
				type : "User",
				attribute : "projectShareAuthorizations"
			},
			project : {
				type : "Project",
				attribute : "projectShareAuthorizations"
			}
		},
		hasMany : {
		},
		rowView : "project/projectShareAuthorizationRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
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
			getSharedWithHerSubProjects : function() {
				var self = this;
				var found = false;
				if (!this.__getSharedWIthHerSubProjectsFilter) {
					this.__getSharedWIthHerSubProjectsFilter = this.xGet("ownerUser").xGet("projectShareAuthorizations").xCreateFilter(function(model) {
						found = false;
						self.xPrevious("project").xGet("subProjects").map(function(subProject) {
							if (model.xPrevious("project").xGet("id") === subProject.xGet("id") && (model.xPrevious("state") === "Wait" || model.xPrevious("state") === "Accept")) {
								found = true;
							}
						});
						return found;
					});
				}
				return this.__getSharedWIthHerSubProjectsFilter;
			},
			getFriendDisplayName : function() {
				var friend = Alloy.createModel("Friend").xFindInDb({
					friendUserId : this.xGet("friendUserId")
				});
				if (friend.id) {
					return friend.getDisplayName();
				} else {
					return this.xGet("friendUser").xGet("userName");
				}
			},
			getActualTotalText : function() {
				var getActualTotal = 0;
				if (this.xGet("actualTotalIncome") - this.xGet("actualTotalExpense") <= 0) {
					return "实际支出";
				} else {
					return "实际收入";
				}

			},
			getActualTotalMoney : function() {//真实数据，未四舍五入
				// var getActualTotal = 0;
				// if(this.xGet("actualTotalIncome") - this.xGet("actualTotalExpense") <= 0){
				// getActualTotal = this.xGet("actualTotalExpense") - this.xGet("actualTotalIncome");
				// return getActualTotal;
				// }else{
				// getActualTotal = this.xGet("actualTotalIncome") - this.xGet("actualTotalExpense");
				// return getActualTotal;
				// }
				var actualTotalExpense = this.xGet("actualTotalExpense") || 0;
				var actualTotalIncome = this.xGet("actualTotalIncome") || 0;
				var actualTotalMoney = actualTotalExpense - actualTotalIncome;
				if (actualTotalMoney < 0) {
					actualTotalMoney = -actualTotalMoney;
				}
				return actualTotalMoney;
			},
			getActualTotalMoneyToShow : function() {//界面显示
				var projectCurrency = this.xGet("project").xGet("currency");
				var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				var exchanges = userCurrency.getExchanges(projectCurrency);
				var exchange = 1;
				if (exchanges.length) {
					exchange = exchanges.at(0).xGet("rate");
				}
				return (this.getActualTotalMoney() / exchange).toFixed(2);
			},
			getCurrencyActualTotalMoney : function() {
				return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + this.getActualTotalMoneyToShow();
			},
			getSettlementText : function() {
				// var getApportionedTotal = 0;
				// var apportionedTotalIncome = this.xGet("apportionedTotalIncome") || 0;
				// var apportionedTotalExpense = this.xGet("apportionedTotalExpense") || 0;
				// if(apportionedTotalIncome - apportionedTotalExpense <= 0){
				// return "应该支出 : ";
				// }else{
				// return "应该收入 : ";
				// }
				// var settlementMoney = this.getApportionedTotalMoney() - this.getActualTotalMoney();
				// if (settlementMoney < 0) {
				// return "应该收入 : ";
				// }else{
				// return "应该支出 : "
				var actualTotalExpense = this.xGet("actualTotalExpense") || 0;
				var actualTotalIncome = this.xGet("actualTotalIncome") || 0;
				var settlementMoney = 0;
				if (actualTotalExpense > actualTotalIncome) {
					settlementMoney = this.getApportionedTotalMoney() - this.getActualTotalMoney();
				} else {
					settlementMoney = this.getApportionedTotalMoney() + this.getActualTotalMoney();
				};
				if (settlementMoney > 0) {
					return "应该支出";
				} else {
					return "应该收入";
				}
			},
			getApportionedTotalMoney : function() {
				var apportionedTotalIncome = this.xGet("apportionedTotalIncome") || 0;
				var apportionedTotalExpense = this.xGet("apportionedTotalExpense") || 0;
				return apportionedTotalExpense - apportionedTotalIncome;
			},
			getApportionedTotalMoneyToShow : function() {
				var projectCurrency = this.xGet("project").xGet("currency");
				var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				var exchanges = userCurrency.getExchanges(projectCurrency);
				var exchange = 1;
				if (exchanges.length) {
					exchange = exchanges.at(0).xGet("rate");
				}
				return Number(((this.getApportionedTotalMoney()) / exchange).toFixed(2));
			},
			getSettlementMoney : function() {
				var actualTotalExpense = this.xGet("actualTotalExpense") || 0;
				var actualTotalIncome = this.xGet("actualTotalIncome") || 0;
				var settlementMoney = 0;
				if (actualTotalExpense > actualTotalIncome) {
					settlementMoney = this.getApportionedTotalMoney() - this.getActualTotalMoney();
				} else {
					settlementMoney = this.getApportionedTotalMoney() + this.getActualTotalMoney();
				}

				if (settlementMoney < 0) {
					settlementMoney = -settlementMoney;
				}
				var projectCurrency = this.xGet("project").xGet("currency");
				var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				var exchanges = userCurrency.getExchanges(projectCurrency);
				var exchange = 1;
				if (exchanges.length) {
					exchange = exchanges.at(0).xGet("rate");
				}
				return (settlementMoney / exchange).toFixed(2);
			},
			getCurrencySettlementMoney : function() {
				return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + this.getSettlementMoney();
			},
			getSharePercentage : function() {
				if (this.xGet("state") === "Wait") {
					return "等待接受";
				} else {
					return "占股 : " + this.xGet("sharePercentage") + "%";
				}
			},
			// xDelete : function(xFinishCallback, options) {
			// var self = this;
			// var subProjectShareAuthorizationIds = [];
			// this.xGet("project").xGetDescendents("subProjects").map(function(subProject) {
			// var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
			// projectId : subProject.xGet("id"),
			// friendUserId : self.xGet("friendUserId")
			// });
			// if (subProjectShareAuthorization.id) {
			// subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
			// subProjectShareAuthorization._xDelete(xFinishCallback, options);
			// }
			// });
			// Alloy.Globals.Server.sendMsg({
			// id : guid(),
			// "toUserId" : self.xGet("friendUserId"),
			// "fromUserId" : Alloy.Models.User.xGet("id"),
			// "type" : "Project.Share.Delete",
			// "messageState" : "unread",
			// "messageTitle" : "移除共享",
			// "date" : (new Date()).toISOString(),
			// "detail" : "用户" + Alloy.Models.User.xGet("userName") + "不再共享项目" + self.xGet("project").xGet("name") + "及子项目给您",
			// "messageBoxId" : self.xGet("friendUser").xGet("messageBoxId"),
			// "messageData" : JSON.stringify({
			// shareAllSubProjects : this.xGet("shareAllSubProjects"),
			// projectShareAuthorizationId : this.xGet("id"),
			// subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
			// })
			// }, function() {
			// self._xDelete(xFinishCallback, options);
			// }, function(e) {
			// xFinishCallback({
			// msg : "删除出错,请重试 : " + e.__summary.msg
			// });
			// });
			// },
			canEdit : function() {
				if (this.isNew()) {
					return true;
				} else if (this.xGet("ownerUser") === Alloy.Models.User) {
					return true;
				}
				return false;
			},
			canDelete : function() {
				return this.xGet("ownerUser") === Alloy.Models.User;
			},			
			// _syncUpdate : function(record, dbTrans) {
				// this.save(record, {
					// dbTrans : dbTrans,
					// // syncFromServer : true,
					// patch : true,
					// wait : true
				// });
			// },
			syncUpdate : function(record, dbTrans) {
				var self = this;
				if (record.friendUserId === Alloy.Models.User.id) {
					record.actualTotalIncome = (this.__syncActualTotalIncome || 0) + (this.xGet("actualTotalIncome") || 0);
					delete this.__syncActualTotalIncome;

					record.actualTotalExpense = (this.__syncActualTotalExpense || 0) + (this.xGet("actualTotalExpense") || 0);
					delete this.__syncActualTotalExpense;
				}

				record.apportionedTotalIncome = (this.__syncApportionedTotalIncome || 0) + (this.xGet("apportionedTotalIncome") || 0);
				delete this.__syncApportionedTotalIncome;

				record.apportionedTotalExpense = (this.__syncApportionedTotalExpense || 0) + (this.xGet("apportionedTotalExpense") || 0);
				delete this.__syncApportionedTotalExpense;
				
				if (record.state === "Delete" && this.xGet("state") !== "Delete") {
					function refreshProject() {
						dbTrans.off("rollback", rollback);
						self.off("sync", refreshProject);
						self.xGet("project").xRefresh();
					}

					function rollback() {
						dbTrans.off("rollback", rollback);
						self.off("sync", refreshProject);
					}


					this.on("sync", refreshProject);
					dbTrans.on("rollback", rollback);
				}

				// delete all none-self data
				var dataToBeDeleted = ["MoneyIncome"], dataToBeLoaded = [];
				dataToBeDeleted.forEach(function(table) {
					if ((record.state === "Delete" && self.xGet("state") !== "Delete") || (record["projectShare" + table + "OwnerDataOnly"] === 1 && self.xGet("projectShare" + table + "OwnerDataOnly") === 0)) {
						Alloy.createCollection(table).xSearchInDb(sqlAND("main.projectId".sqlLE(self.xGet("project").id), "main.ownerUserId".sqlNE(Alloy.Models.User.id))).forEach(function(item) {
							if (table === "MoneyExpense") {
								item.xGet("moneyExpenseDetails").forEach(function(detail) {
									detail.destroy({
										dbTrans : dbTrans,
										wait : true,
										syncFromServer : true
									});
								});
								item.xGet("moneyExpenseApportions").forEach(function(apportion) {
									apportion.destroy({
										dbTrans : dbTrans,
										wait : true,
										syncFromServer : true
									});
								});
							} else if (table === "MoneyIncome") {
								item.xGet("moneyIncomeDetails").forEach(function(detail) {
									detail.destroy({
										dbTrans : dbTrans,
										wait : true,
										syncFromServer : true
									});
								});
								item.xGet("moneyIncomeApportions").forEach(function(apportion) {
									apportion.destroy({
										dbTrans : dbTrans,
										wait : true,
										syncFromServer : true
									});
								});
							}
							item.destroy({
								dbTrans : dbTrans,
								wait : true,
								syncFromServer : true
							});
						});
					} else if (record["projectShare" + table + "OwnerDataOnly"] === 0 && self.xGet("projectShare" + table + "OwnerDataOnly") === 1) {
						dataToBeLoaded.push(table);
					}
				});
				if (dataToBeLoaded.length > 0) {
					function rollbackLoadData() {
						dbTrans.off("rollback", rollbackLoadData);
						self.off("sync", commitLoadData);
					}

					function commitLoadData() {
						dbTrans.off("rollback", rollbackLoadData);
						self.off("sync", commitLoadData);
						dataToBeLoaded.forEach(function(table) {
							Alloy.Globals.Server.loadData(table, [{
								projectId : self.xGet("project").id,
								__NOT_FILTER__ : {
									ownerUserId : Alloy.Models.User.id
								}
							}]);
						});
					}

					this.on("sync", commitLoadData);
					dbTrans.on("rollback", rollbackLoadData);
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				delete record.id;
				var localUpdated = false;
				localUpdated = this.__syncActualTotalIncome !== undefined || this.__syncActualTotalExpense !== undefined || this.__syncApportionedTotalIncome !== undefined || this.__syncApportionedTotalExpense !== undefined;
				if (localUpdated) {
					this.syncUpdate(record, dbTrans);
				}
				if (this.xGet("lastClientUpdateTime") >= record.lastClientUpdateTime) {
					// 让本地修改覆盖服务器上的记录
					// 但是取服务器上的占股比例
					var updates;
					if (localUpdated) {
						updates = {
							actualTotalIncome : record.actualTotalIncome,
							actualTotalExpense : record.actualTotalExpense,
							apportionedTotalIncome : record.apportionedTotalIncome,
							apportionedTotalExpense : record.apportionedTotalExpense
						};
					}
					if (record.sharePercentage !== this.xGet("sharePercentage")) {
						updates = updates || {};
						updates.sharePercentage = record.sharePercentage;
					}
					if (updates) {
						this._syncUpdate(updates, dbTrans);
					}
				}

				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					this._syncUpdate(record, dbTrans);
					if (!localUpdated) {
						var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
						dbTrans.db.execute(sql, [this.xGet("id")]);
					}
				}
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
