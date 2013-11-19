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
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER",
			actualTotalIncome : "REAL NOT NULL",
			actualTotalExpense : "REAL NOT NULL",
			actualTotalBorrow : "REAL NOT NULL",
			actualTotalLend : "REAL NOT NULL",
			actualTotalReturn : "REAL NOT NULL",
			actualTotalPayback : "REAL NOT NULL",
			apportionedTotalIncome : "REAL NOT NULL",
			apportionedTotalExpense : "REAL NOT NULL",
			apportionedTotalBorrow : "REAL NOT NULL",
			apportionedTotalLend : "REAL NOT NULL",
			apportionedTotalReturn : "REAL NOT NULL",
			apportionedTotalPayback : "REAL NOT NULL",
			sharedTotalIncome : "REAL NOT NULL",
			sharedTotalExpense : "REAL NOT NULL",
			sharedTotalBorrow : "REAL NOT NULL",
			sharedTotalLend : "REAL NOT NULL",
			sharedTotalReturn : "REAL NOT NULL",
			sharedTotalPayback : "REAL NOT NULL",
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
			actualTotalBorrow : 0,
			actualTotalLend : 0,
			actualTotalReturn : 0,
			actualTotalPayback : 0,
			apportionedTotalIncome : 0,
			apportionedTotalExpense : 0,
			apportionedTotalBorrow : 0,
			apportionedTotalLend : 0,
			apportionedTotalReturn : 0,
			apportionedTotalPayback : 0,
			sharedTotalIncome : 0,
			sharedTotalExpense : 0,
			sharedTotalBorrow : 0,
			sharedTotalLend : 0,
			sharedTotalReturn : 0,
			sharedTotalPayback : 0,
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
					return this.xGet("friendUser").getUserDisplayName();
				}
			},
			getActualTotalText : function() {
				var getActualTotal = 0;
				if (this.xGet("actualTotalIncome") - this.xGet("actualTotalExpense") + this.xGet("actualTotalBorrow") - this.xGet("actualTotalReturn") - this.xGet("actualTotalLend") + this.xGet("actualTotalPayback") <= 0) {
					return "已经支出";
				} else {
					return "已经收入";
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
				var actualTotalBorrow = this.xGet("actualTotalBorrow") || 0;
				var actualTotalLend = this.xGet("actualTotalLend") || 0;
				var actualTotalReturn = this.xGet("actualTotalReturn") || 0;
				var actualTotalPayback = this.xGet("actualTotalPayback") || 0;
				var actualTotalMoney = actualTotalExpense - actualTotalIncome - actualTotalBorrow + actualTotalLend + actualTotalReturn - actualTotalPayback;
				if (actualTotalMoney < 0) {
					actualTotalMoney = -actualTotalMoney;
				}
				return actualTotalMoney;
			},
			getActualTotalMoneyToShow : function() {//界面转成本币显示
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
				// return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + this.getActualTotalMoneyToShow();
				return this.xGet("project").xGet("currency").xGet("symbol") + this.getActualTotalMoney().toFixed(2);
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
				var actualTotalBorrow = this.xGet("actualTotalBorrow") || 0;
				var actualTotalLend = this.xGet("actualTotalLend") || 0;
				var actualTotalReturn = this.xGet("actualTotalReturn") || 0;
				var actualTotalPayback = this.xGet("actualTotalPayback") || 0;
				var settlementMoney = 0;
				if ((actualTotalExpense + actualTotalLend + actualTotalReturn) > (actualTotalIncome + actualTotalBorrow + actualTotalPayback)) {
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
				var apportionedTotalBorrow = this.xGet("apportionedTotalBorrow") || 0;
				var apportionedTotalLend = this.xGet("apportionedTotalLend") || 0;
				var apportionedTotalReturn = this.xGet("apportionedTotalReturn") || 0;
				var apportionedTotalPayback = this.xGet("apportionedTotalPayback") || 0;
				return apportionedTotalExpense - apportionedTotalBorrow - apportionedTotalPayback - apportionedTotalIncome + apportionedTotalLend + apportionedTotalReturn;
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
				var actualTotalBorrow = this.xGet("actualTotalBorrow") || 0;
				var actualTotalLend = this.xGet("actualTotalLend") || 0;
				var actualTotalReturn = this.xGet("actualTotalReturn") || 0;
				var actualTotalPayback = this.xGet("actualTotalPayback") || 0;
				var settlementMoney = 0;
				if ((actualTotalExpense + actualTotalLend + actualTotalReturn) > (actualTotalIncome + actualTotalBorrow + actualTotalPayback)) {
					settlementMoney = this.getApportionedTotalMoney() - this.getActualTotalMoney();
				} else {
					settlementMoney = this.getApportionedTotalMoney() + this.getActualTotalMoney();
				}

				if (settlementMoney < 0) {
					settlementMoney = -settlementMoney;
				}
				// var projectCurrency = this.xGet("project").xGet("currency");
				// var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				// var exchanges = userCurrency.getExchanges(projectCurrency);
				// var exchange = 1;
				// if (exchanges.length) {
					// exchange = exchanges.at(0).xGet("rate");
				// }
				// return (settlementMoney / exchange).toFixed(2);
				return settlementMoney.toFixed(2);
			},
			getCurrencySettlementMoney : function() {
				// return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + this.getSettlementMoney();
				return this.xGet("project").xGet("currency").xGet("symbol") + this.getSettlementMoney();
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
					
					record.actualTotalBorrow = (this.__syncActualTotalBorrow || 0) + (this.xGet("actualTotalBorrow") || 0);
					delete this.__syncActualTotalBorrow;
					
					record.actualTotalLend = (this.__syncActualTotalLend || 0) + (this.xGet("actualTotalLend") || 0);
					delete this.__syncActualTotalLend;
					
					record.actualTotalReturn = (this.__syncActualTotalReturn || 0) + (this.xGet("actualTotalReturn") || 0);
					delete this.__syncActualTotalReturn;
					
					record.actualTotalPayback = (this.__syncActualTotalPayback || 0) + (this.xGet("actualTotalPayback") || 0);
					delete this.__syncActualTotalPayback;
				}

				record.apportionedTotalIncome = (this.__syncApportionedTotalIncome || 0) + (this.xGet("apportionedTotalIncome") || 0);
				delete this.__syncApportionedTotalIncome;

				record.apportionedTotalExpense = (this.__syncApportionedTotalExpense || 0) + (this.xGet("apportionedTotalExpense") || 0);
				delete this.__syncApportionedTotalExpense;
				
				record.apportionedTotalBorrow = (this.__syncApportionedTotalBorrow || 0) + (this.xGet("apportionedTotalBorrow") || 0);
				delete this.__syncApportionedTotalBorrow;
				
				record.apportionedTotalLend = (this.__syncApportionedTotalLend || 0) + (this.xGet("apportionedTotalLend") || 0);
				delete this.__syncApportionedTotalLend;
				
				record.apportionedTotalReturn = (this.__syncApportionedTotalReturn || 0) + (this.xGet("apportionedTotalReturn") || 0);
				delete this.__syncApportionedTotalReturn;
				
				record.apportionedTotalPayback = (this.__syncApportionedTotalPayback || 0) + (this.xGet("apportionedTotalPayback") || 0);
				delete this.__syncApportionedTotalPayback;

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
				var dataToBeDeleted = ["MoneyIncome", "MoneyExpense", "MoneyLend", "MoneyBorrow", "MoneyReturn", "MoneyPayback"], dataToBeLoaded = [];
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
							}else if (table === "MoneyBorrow") {
								item.xGet("moneyBorrowApportions").forEach(function(apportion) {
									apportion.destroy({
										dbTrans : dbTrans,
										wait : true,
										syncFromServer : true
									});
								});
							}else if (table === "MoneyLend") {
								item.xGet("moneyLendApportions").forEach(function(apportion) {
									apportion.destroy({
										dbTrans : dbTrans,
										wait : true,
										syncFromServer : true
									});
								});
							}else if (table === "MoneyReturn") {
								item.xGet("moneyReturnApportions").forEach(function(apportion) {
									apportion.destroy({
										dbTrans : dbTrans,
										wait : true,
										syncFromServer : true
									});
								});
							}else if (table === "MoneyPayback") {
								item.xGet("moneyPaybackApportions").forEach(function(apportion) {
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
				localUpdated = this.__syncActualTotalIncome !== undefined || this.__syncActualTotalExpense !== undefined || this.__syncActualTotalBorrow !== undefined || this.__syncActualTotalLend !== undefined || this.__syncActualTotalReturn !== undefined || this.__syncActualTotalPayback !== undefined 
				|| this.__syncApportionedTotalIncome !== undefined || this.__syncApportionedTotalExpense !== undefined || this.__syncApportionedTotalBorrow !== undefined || this.__syncApportionedTotalLend !== undefined || this.__syncApportionedTotalReturn !== undefined || this.__syncApportionedTotalPayback !== undefined;
				if (localUpdated) {
					this.syncUpdate(record, dbTrans);
				}
				if (this.xGet("lastClientUpdateTime") >= record.lastClientUpdateTime) {
					// 让本地修改覆盖服务器上的记录
					// 但是取服务器上的占股比例
					var updates = {
						lastServerUpdateTime : record.lastServerUpdateTime
					};
					if (localUpdated) {
						updates.actualTotalIncome = record.actualTotalIncome;
						updates.actualTotalExpense = record.actualTotalExpense;
						updates.actualTotalBorrow = record.actualTotalBorrow;
						updates.actualTotalLend = record.actualTotalLend;
						updates.actualTotalReturn = record.actualTotalReturn;
						updates.actualTotalPayback = record.actualTotalPayback;
						updates.apportionedTotalIncome = record.apportionedTotalIncome;
						updates.apportionedTotalExpense = record.apportionedTotalExpense;
						updates.apportionedTotalBorrow = record.apportionedTotalBorrow;
						updates.apportionedTotalLend = record.apportionedTotalLend;
						updates.apportionedTotalReturn = record.apportionedTotalReturn;
						updates.apportionedTotalPayback = record.apportionedTotalPayback;
					}
					if (record.sharePercentage !== this.xGet("sharePercentage")) {
						updates.sharePercentage = record.sharePercentage;
					}
					this._syncUpdate(updates, dbTrans);
				}

				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					this._syncUpdate(record, dbTrans);
					if (!localUpdated) {
						var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
						dbTrans.db.execute(sql, [this.xGet("id")]);
					}
				}
			},
			syncRollback : function() {
				delete this.__syncActualTotalIncome;
				delete this.__syncActualTotalExpense;
				delete this.__syncActualTotalBorrow;
				delete this.__syncActualTotalLend;
				delete this.__syncActualTotalReturn;
				delete this.__syncActualTotalPayback;
				delete this.__syncApportionedTotalIncome;
				delete this.__syncApportionedTotalExpense;
				delete this.__syncApportionedTotalBorrow;
				delete this.__syncApportionedTotalLend;
				delete this.__syncApportionedTotalReturn;
				delete this.__syncApportionedTotalPayback;
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
