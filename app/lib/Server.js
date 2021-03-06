( function() {
		Ti.include('suds.js');
		var serverUrl = "http://hoyoji.app1101080392.twsapp.com/";
		if (!ENV_PROD) {
			serverUrl = "http://money.app100697798.twsapp.com/";
		}
		exports.Server = {
			dataUrl : serverUrl,
			sendMsg : function(msgJSON, xFinishedCallback, xErrorCallback) {
				//var msg = Alloy.createModel("Message");
				msgJSON.ownerUserId = msgJSON.toUserId;
				msgJSON.__dataType = "Message";
				this.postData([msgJSON], xFinishedCallback, xErrorCallback);
				// msg.save(msgJSON, {
				// patch : true,
				// wait : true,
				// success : xFinishedCallback,
				// error : xErrorCallback
				// });
			},
			searchData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				var collection = Alloy.createCollection(modelName);
				if (_.isArray(filter)) {
					collection.fetch({
						query : "SELECT * FROM " + modelName + " main WHERE main.id IN ('" + filter.join("','") + "')"
					});
				} else {
					collection.xSearchInDb(filter);
				}
				if (xFinishedCallback) {
					xFinishedCallback(collection);
				}
			},
			getData : function(data, xFinishedCallback, xErrorCallback, target, progressCallback) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "getData", progressCallback);
			},
			findData : function(data, xFinishedCallback, xErrorCallback, target, progressCallback) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "findData", progressCallback);
			},
			loadSharedProjects : function(projectIds, xFinishedCallback, xErrorCallback, options) {
				// this.searchData("Project", projectIds, function(collection) {
				// if (collection.length > 0) {
				// xFinishedCallback(collection);
				// return;
				// }

				var requestData = [];
				projectIds.forEach(function(projectId) {
					var filter = {
						__dataType : "Project",
						id : projectId
					};
					requestData.push(filter);
				});
				Alloy.Globals.Server.getData({
					lastSyncTime : options && options.lastSyncTime,
					projectIds : requestData
				}, function(data) {
					var returnCollection = Alloy.createCollection("Project");
					data = _.flatten(data);
					data.forEach(function(record) {
						if (record) {
							var modelData = record;
							var id = modelData.id;
							delete modelData.id;
							var model = Alloy.createModel(modelData.__dataType).xFindInDb({
								id : id
							});
							if (!model.id) {
								model.attributes.id = id;
							}
							if(modelData.__dataType === "User" && id === Alloy.Models.User.id){
								delete modelData.lastSyncTime;
							}
							model.xSet(modelData);
							if (modelData.__dataType === "Project") {
								returnCollection.push(model);
							}
							// if (modelData.__dataType === "Project" || modelData.__dataType === "ProjectShareAuthorization" || modelData.__dataType === "User") {
							// if (!options || options.saveProject !== false) {
							model.save(null, {
								silent : true,
								syncFromServer : true,
								dbTrans : options && options.dbTrans
							});
							//	}
							// } else {
							// model.save(null, {
							// silent : true,
							// syncFromServer : true,
							// dbTrans : options && options.dbTrans
							// });
							// }
						}
					});
					if (xFinishedCallback) {
						xFinishedCallback(returnCollection);
					}
				}, xErrorCallback, "getSharedProjects");
			},
			loadData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				// this.searchData(modelName, filter, function(collection) {
				// if (collection.length > 0) {
				// xFinishedCallback(collection);
				// return;
				// }

				var requestData = [];
				if (filter.forEach) {
					filter.forEach(function(filter) {
						if (_.isObject(filter)) {
							filter.__dataType = modelName;
						} else {
							filter = {
								__dataType : modelName,
								id : filter
							};
						}
						requestData.push(filter);
					});
				}
				Alloy.Globals.Server.getData(requestData, function(data) {
					data = _.flatten(data);
					var returnCollection = Alloy.createCollection(modelName);
					if (data.length > 0) {
						var dbTrans = Alloy.Globals.DataStore.createTransaction();
						dbTrans.begin();
						data.forEach(function(record) {
							if (record) {
								var modelData = record;
								var id = modelData.id;
								delete modelData.id;
								var model = Alloy.createModel(modelData.__dataType).xFindInDb({
									id : id
								});
								if (!model.id) {
									model.attributes.id = id;
								}
								model.xSet(modelData);
								model.save(null, {
									silent : true,
									dbTrans : dbTrans,
									syncFromServer : true
								});
								returnCollection.push(model);
							}
						});
						dbTrans.commit();
					}
					if (xFinishedCallback) {
						xFinishedCallback(returnCollection);
					}
				}, xErrorCallback);

				// }, xErrorCallback);
			},
			putData : function(data, xFinishedCallback, xErrorCallback, target, progressCallback) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "putData", progressCallback);
			},
			deleteData : function(data, xFinishedCallback, xErrorCallback, target) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "deleteData");
			},
			postData : function(data, xFinishedCallback, xErrorCallback, target, progressCallback) {
				var dataLength, dataSendLength;
				if (!_.isString(data)) {
					data = JSON.stringify(data);
				}
				console.info(data);
				var url = this.dataUrl + (target || "postData") + ".php";
				var xhr = Ti.Network.createHTTPClient({
					onload : function(e) {
						console.info("Server.postData response : " + this.responseText);
						if (this.responseText) {
							var returnedData = JSON.parse(this.responseText);
							if (returnedData.__summary) {
								xErrorCallback(returnedData);
							} else {
								xFinishedCallback(returnedData);
							}
						} else {
							xFinishedCallback();
						}
					},
					ondatastream : function(e) {
						if (progressCallback) {
							if (OS_ANDROID) {
								//if(dataLength === undefined || dataLength === null){
								dataLength = this.getResponseHeader("Content-Length") || (this.responseText && this.responseText.length) || -e.progress;
								//}
								if (dataLength) {
									progressCallback(Number((-e.progress / dataLength).toFixed(2)), dataLength);
								}
							} else {
								if (dataLength === undefined) {
									dataLength = this.getResponseHeader("Content-Length") || (this.responseText && this.responseText.length);
								}
								progressCallback(Number(e.progress.toFixed(2)), dataLength);
							}
						}
					},
					onsendstream : function(e) {
						if (progressCallback) {
							if (dataSendLength === undefined) {
								dataSendLength = data.length;
							}
							if (OS_ANDROID) {
								progressCallback(Number((-e.progress / dataSendLength).toFixed(2)), dataSendLength, true);
							} else {
								progressCallback(Number(e.progress.toFixed(2)), dataSendLength, true);
							}
						}
					},
					onreadystatechange : function() {
						if (progressCallback) {
							if (this.readyState === this.DONE) {
								progressCallback(1, dataLength);
								if (dataSendLength === undefined) {
									dataSendLength = data.length;
								}
								progressCallback(1, dataSendLength, true);
							}
						}
					},
					onerror : function(e) {
						console.info("Server.postData error : " + JSON.stringify(e));
						xErrorCallback({
							__summary : {
								msg : "连接服务器出错 " + e.code
							}
						});
					},
					timeout : 300000 /* in milliseconds */
				});
				xhr.open("POST", url);
				if (Alloy.Models.User && Alloy.Models.User.xGet("userData")) {
					var auth = Ti.Network.encodeURIComponent(Alloy.Models.User.xGet("userName")) + ":" + Ti.Network.encodeURIComponent(Alloy.Models.User.xGet("userData").xGet("password"));
					if (OS_IOS) {
						xhr.setRequestHeader("Cookie", "authentication=" + Ti.Utils.base64encode(auth).toString().replace("\r\n", "").replace(/=/g, "%$09"));
					} else {
						xhr.setRequestHeader("Authorization", "BASIC " + Ti.Utils.base64encode(auth));
					}
				}
				xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
				xhr.setRequestHeader('Accept-Encoding', 'gzip');
				xhr.setRequestHeader("HyjApp-Version", Ti.App.version);
				xhr.send(data);
			},
			sync : function(xFinishedCallback, xErrorCallback) {
				var self = this;
				if (Alloy.Globals.Server.__isSyncing) {
					return;
				}
				Alloy.Globals.Server.__isSyncing = true;
				var activityWindow = Alloy.createController("activityMask");
				activityWindow.open("正在同步...", ["下载数据", "合并数据", "上传数据"]);

				activityWindow.progressStep(1);
				this.syncPull(function() {
					// setTimeout(function() {
					Alloy.Globals.Server.__isSyncing = false;
					Ti.App.fireEvent("ServerSyncFinished");
					activityWindow.progressStep(3);
					self.syncPush(function(data) {
						if (xFinishedCallback) {
							xFinishedCallback();
						}
						// activityWindow.close();
						activityWindow.progressFinish("同步完成");
					}, function(e) {
						if (xErrorCallback) {
							xErrorCallback(e);
						}
						// activityWindow.close();
						activityWindow.showMsg("同步错误：" + e.__summary.msg);
						Alloy.Globals.Server.__isSyncing = false;
						//alert("sync error : " + e.__summary.msg);
					}, activityWindow);
					// }, 0);
				}, function(e) {
					if (xErrorCallback) {
						xErrorCallback(e);
					}
					// activityWindow.close();
					activityWindow.showMsg("同步错误：" + e.__summary.msg);
					Alloy.Globals.Server.__isSyncing = false;
					//alert("sync error " + e.__summary.msg);
				}, activityWindow);
			},
			syncPull : function(xFinishedCallback, xErrorCallback, activityWindow) {
				var originalLastSyncTime = Alloy.Models.User.xGet("lastSyncTime");
				this.getData(Number(Alloy.Models.User.xGet("lastSyncTime")), function(data) {
					activityWindow.progressStep(2, "合并数据");
					var lastSyncTime = data.lastSyncTime;
					var dbTrans = Alloy.Globals.DataStore.createTransaction();
					var userToFetchImage = [];
					data = _.flatten(data.data);
					dbTrans.newExchangesFromServer = {};
					dbTrans.newCurrenciesFromServer = {};
					dbTrans.__syncData = {};
					dbTrans.__syncUpdateData = {};
					dbTrans.begin();

					function rollbackSyncPull() {
						dbTrans.off("rollback", rollbackSyncPull);
						delete dbTrans.__syncData;
						delete dbTrans.newExchangesFromServer;
						delete dbTrans.newCurrenciesFromServer;
						delete dbTrans.__syncUpdateData;
						xErrorCallback({
							__summary : {
								msg : "同步出错"
							}
						});
					}


					dbTrans.on("rollback", rollbackSyncPull);

					Alloy.Models.User.save({
						"lastSyncTime" : lastSyncTime
					}, {
						wait : true,
						syncFromServer : true,
						patch : true,
						dbTrans : dbTrans
					});

					var mergeIndex = 0;
					data.forEach(function(record) {
						activityWindow.progressStep(2, "合并数据(" + ++mergeIndex + "/" + data.length + ")");
						var sql, rs, dataType = record.__dataType, asyncCount = 0;
						delete record.__dataType;
						if (dataType === "ServerSyncDeletedRecords") {
							// 该记录在服务器上已被删除

							var id = record.recordId;
							var model = Alloy.createModel(record.tableName).xFindInDb({
								id : id
							});
							if (!model.isNew()) {
								// 如果该记录在本地存在，我们要将其删除
								// 如果该记录不是自己创建的，我们直接将其删除，不需要进行帐户余额等维护
								if (model.xGet("ownerUserId") !== Alloy.Models.User.id && (record.tableName !== "MoneyExpenseApportion" && record.tableName !== "MoneyIncomeApportion" && record.tableName !== "MoneyBorrowApportion" && record.tableName !== "MoneyLendApportion" && record.tableName !== "MoneyReturnApportion" && record.tableName !== "MoneyPaybackApportion")) {
									// 这里不能直接用sql从数据库删除，因为那样的话如果model就不会从界面上移除
									// dbTrans.db.execute("DELETE FROM " + record.tableName + " WHERE id = ?", [id]);
									model.destroy({
										wait : true,
										syncFromServer : true,
										dbTrans : dbTrans
									});
								} else {
									// 如果该记录是自己创建的，我们要进行帐户余额等维护

									// 我们要将该记录的所有hasMany一并删除
									// for (var hasMany in model.config.hasMany) {
									// model.xGet(hasMany).forEach(function(item) {
									// item.syncDelete(record, dbTrans);
									// item._syncDelete(record, dbTrans, function(e) {
									// });
									// dbTrans.db.execute(sql, [item.xGet("id")]);
									// });
									// }
									if (model.syncDeleteHasMany) {
										model.syncDeleteHasMany(record, dbTrans);
									}
									model.syncDelete(record, dbTrans);
									model._syncDelete(record, dbTrans, function(e) {
									});
								}
							}
							// 如果该记录同时在本地和服务器上都已被删除， 也没有必要将该删除同步到服务器
							sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
							dbTrans.db.execute(sql, [id]);
						} else {
							// 该记录是在服务器上新增的或被修改的。
							// 1. 我们先检查看该记录是否有被本地修改过，如果有修改过，我们处理冲突。
							// 2. 否则，检查看该记录在不在本地表里面, 如果不再我们将其添加进来
							sql = "SELECT * FROM ClientSyncTable WHERE recordId = ?";
							rs = Alloy.Globals.DataStore.getReadDb().execute(sql, [record.id]);
							if (rs.rowCount > 0) {
								var operation = rs.fieldByName("operation");
								rs.close();
								// 该记录同时在本地和服务器被修改过
								// 1. 如果该记录同時已被本地删除，那我们什么也不做，让其将服务器上的该记录也被删除
								// 2. 如果该记录同時已被本地修改过，那我们也什么不做，让本地修改覆盖服务器上的记录
								if (operation !== "delete") {
									var model = Alloy.createModel(dataType).xFindInDb({
										id : record.id
									});
									if (model.isNew()) {
										dbTrans.db.execute("DELETE FROM ClientSyncTable WHERE recordId = ?", [record.id]);
										// 没有找到该记录
										if (model.syncAddNew(record, dbTrans) !== false) {
											model._syncAddNew(record, dbTrans);
										}
									} else {
										if (operation === "create") {
											dbTrans.db.execute("UPDATE ClientSyncTable SET operation = 'update' WHERE recordId = ? AND operation = 'create'", [record.id]);
										}
										if (model.syncRollback) {
											function syncRollbackConflict() {
												dbTrans.off("rollback", syncRollbackConflict);
												model.syncRollback();
											}


											dbTrans.on("rollback", syncRollbackConflict);
										}
										model.syncUpdateConflict(record, dbTrans);
										if (dbTrans.__syncUpdateData[model.config.adapter.collection_name]) {
											delete dbTrans.__syncUpdateData[model.config.adapter.collection_name][model.id];
										}
									}
								}
							} else {
								rs.close();
								// 该记录在本地未被修改，在服务器上新增或修改过。
								// 1. 检查看该记录在不在本地表里面, 如果不在我们将其添加进来
								// 2. 如果该记录已经存在本地表里，我们将其合并
								var model = Alloy.createModel(dataType).xFindInDb({
									id : record.id
								});

								// 检查belongsTo, 如果任何belongsTo已被删除，我们不将该记录同步下来
								var belongsToDeleted = false;
								sql = "SELECT * FROM ClientSyncTable WHERE recordId = ? AND operation = 'delete'";
								for (var belongsTo in model.config.belongsTo) {
									if (model.config.belongsTo[belongsTo].attribute) {
										rs = Alloy.Globals.DataStore.getReadDb().execute(sql, [record.id]);
										if (rs.rowCount > 0) {
											belongsToDeleted = true;
											break;
										}
										rs.close();
									}
								}
								if (belongsToDeleted) {
									// 如果该model是新的，我们要通知服务器删除该记录
									if (model.isNew() && record.ownerUserId === Alloy.Models.User.id) {
										dbTrans.db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + record.id + "','" + model.config.adapter.collection_name + "','delete','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
									}
								} else {
									if (model.isNew()) {
										// 没有找到该记录
										if (originalLastSyncTime && dataType === "ProjectShareAuthorization" && record.state === "Accept" && record.ownerUserId !== Alloy.Models.User.id && record.friendUserId === Alloy.Models.User.id) {
											dbTrans.xCommitStart();
											Alloy.Globals.Server.loadSharedProjects([record.projectId], function(collection) {
												dbTrans.xCommitEnd();
											}, function(e) {
												dbTrans.rollback("获取新共享来的项目资料时出错");
											}, {
												dbTrans : dbTrans,
												saveProject : false,
												lastSyncTime : originalLastSyncTime
											});
										}
										if (model.syncAddNew(record, dbTrans) !== false) {
											model._syncAddNew(record, dbTrans);
										}
										if (dataType === "User") {
											userToFetchImage.push(model);
										}
									} else {
										if (model.syncRollback) {
											function syncRollbackUpdate() {
												dbTrans.off("rollback", syncRollbackUpdate);
												model.syncRollback();
											}


											dbTrans.on("rollback", syncRollbackUpdate);
										}
										// 该记录已存在本地，我们更新
										if (originalLastSyncTime && dataType === "ProjectShareAuthorization" && record.state === "Accept" && model.xGet("state") !== "Accept" && record.ownerUserId !== Alloy.Models.User.id && record.friendUserId === Alloy.Models.User.id) {
											dbTrans.xCommitStart();
											Alloy.Globals.Server.loadSharedProjects([record.projectId], function(collection) {
												dbTrans.xCommitEnd();
											}, function(e) {
												dbTrans.rollback("获取新共享来的项目资料时出错");
											}, {
												dbTrans : dbTrans,
												saveProject : false,
												lastSyncTime : originalLastSyncTime
											});
										}
										model.syncUpdate(record, dbTrans);
										model._syncUpdate(record, dbTrans);
										if (dbTrans.__syncUpdateData[model.config.adapter.collection_name]) {
											dbTrans.__syncUpdateData[model.config.adapter.collection_name][model.id] = null;
											delete dbTrans.__syncUpdateData[model.config.adapter.collection_name][model.id];
										}
									}
								}
							}
							rs = null;
						}
					});
					for (var models in dbTrans.__syncUpdateData) {
						for (var model in dbTrans.__syncUpdateData[models]) {
							var record = {};
							dbTrans.__syncUpdateData[models][model].syncUpdate(record, dbTrans);
							dbTrans.__syncUpdateData[models][model]._syncUpdate(record, dbTrans);
						}
					}
					if (dbTrans.commit()) {
						delete dbTrans.__syncData;
						delete dbTrans.newExchangesFromServer;
						delete dbTrans.newCurrenciesFromServer;
						delete dbTrans.__syncUpdateData;
						Alloy.Models.User.xGet("messageBox").processNewMessages();
						fetchUserImages();
						updateDebtAccountBalances();
						xFinishedCallback();
					} else {
						function postCommit() {
							delete dbTrans.__syncData;
							delete dbTrans.newExchangesFromServer;
							delete dbTrans.newCurrenciesFromServer;
							delete dbTrans.__syncUpdateData;
							dbTrans.off("commit", postCommit);
							Alloy.Models.User.xGet("messageBox").processNewMessages();
							fetchUserImages();
							updateDebtAccountBalances();
							xFinishedCallback();
						}

						dbTrans.on("commit", postCommit);
					}
					function fetchUserImages() {
						userToFetchImage.forEach(function(user) {
							if (user.xGet("pictureId") && !user.xGet("picture")) {
								Alloy.Globals.Server.fetchUserImageIcon(user.xGet("pictureId"), function(picture) {
									delete picture.id;
									// add it as new record
									picture.save();

									var f = Ti.Filesystem.getFile(Alloy.Globals.getTempDirectory(), picture.xGet("id") + "_icon." + picture.xGet("pictureType"));
									if (f.exists()) {
										var img = f.read();
										var fnew = Ti.Filesystem.getFile(Alloy.Globals.getApplicationDataDirectory(), picture.xGet("id") + "_icon." + picture.xGet("pictureType"));
										fnew.write(img);
										img = null;
										fnew = null;
									}
									f = null;
								});
							}
						});
					}

					function updateDebtAccountBalances() {
						function updateDebtAccountOfTable(tableName, factor, owner, query) {
							//var config = Alloy.createModel(tableName).config;
							var Model = Alloy.M(tableName, {
								config : {
									adapter : {
										type : "hyjSql"
										// collection_name : tableName,
										// db_name : Alloy.Globals.DataStore.getDbName()
									}
								}
							});
							var Collection = Alloy.C(tableName, { }, Model);
							var results = new Collection();
							if (tableName.endsWith("Apportion")) {
								if (owner) {
									results.fetch({
										query : "SELECT f.id AS friendId, ma.currencyId  AS currencyId, SUM(main.amount) AS TOTAL FROM " + tableName + " main JOIN MoneyAccount ma ON mi.moneyAccountId = ma.id JOIN Project prj ON prj.id = mi.projectId LEFT JOIN Friend f ON main.friendUserId = f.friendUserId WHERE " + query + " qjkdasfllascordsdacmkludafouewqojmklvcxuioqew1234ewrokfjl;jklJLKJlkjlkjKNJKy	JKLKAS" + " GROUP BY friendId, currencyId"
									});
								} else {
									results.fetch({
										query : "SELECT f.id AS friendId, prj.currencyId  AS currencyId, SUM(main.amount * mi.exchangeRate) AS TOTAL FROM " + tableName + " main JOIN Project prj ON prj.id = mi.projectId LEFT JOIN Friend f ON main.ownerUserId = f.friendUserId WHERE " + query + " qjkdasfllascordsdacmkludafouewqojmklvcxuioqew1234ewrokfjl;jklJLKJlkjlkjKNJKy	JKLKAS" + " GROUP BY friendId, currencyId"
									});
								}
							} else {
								results.fetch({
									query : "SELECT f.id AS friendId, ma.currencyId AS currencyId, SUM(main.amount) AS TOTAL FROM " + tableName + " main JOIN MoneyAccount ma ON main.moneyAccountId = ma.id LEFT JOIN Friend f ON (main.friendUserId IS NOT NULL AND main.friendUserId = f.friendUserId) OR (main.localFriendId = f.id) WHERE " + query + " qjkdasfllascordsdacmkludafouewqojmklvcxuioqew1234ewrokfjl;jklJLKJlkjlkjKNJKy	JKLKAS" + " GROUP BY friendId, currencyId"
								});
							}

							results.forEach(function(item) {
								var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
									accountType : "Debt",
									friendId : item.get("friendId"),
									currencyId : item.get("currencyId")
								});
								if (moneyAccount.id) {
									var total = item.get("TOTAL") * factor;
									total += moneyAccount.xGet("currentBalance");
									moneyAccount.save({
										currentBalance : total
									}, {
										// wait : true,
										patch : true
									});
								} else {
									moneyAccount.xSet({
										name : item.get("friendId") || "匿名借贷账户",
										accountType : "Debt",
										friendId : item.get("friendId"),
										currencyId : item.get("currencyId"),
										sharingType : "Private",
										ownerUserId : Alloy.Models.User.id,
										currentBalance : item.get("TOTAL") * factor
									});
									moneyAccount.save(null, {
										// wait : true,
										patch : true
									});
								}
							});
						}


						Alloy.Models.User.xGet("moneyAccounts").forEach(function(moneyAccount) {
							if (moneyAccount.xGet("accountType") === "Debt") {
								moneyAccount.save({
									currentBalance : 0
								}, {
									//wait : true,
									patch : true
								});
							}
						});

						// 1. 借出、借入、收款、还款
						// 2. 充值收入、充值支出
						// 3. (自己记的)支出分摊给别人的 --> 当作应收
						// 4. (自己记的)收入分摊给别人的 --> 当作应付
						// 3. (别人记的)支出分摊给自己的 --> 当作应付
						// 4. (别人记的)收入分摊给自己的 --> 当作应收
						updateDebtAccountOfTable("MoneyBorrow", -1, true, "main.ownerUserId = '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyLend", 1, true, "main.ownerUserId = '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyPayback", -1, true, "main.ownerUserId = '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyReturn", 1, true, "main.ownerUserId = '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyExpense", 1, true, "main.expenseType = 'Deposite' AND main.ownerUserId = '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyIncome", -1, true, "main.incomeType = 'Deposite' AND main.ownerUserId = '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyExpenseApportion", 1, true, "main.ownerUserId = '" + Alloy.Models.User.id + "' AND main.friendUserId <> '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyIncomeApportion", -1, true, "main.ownerUserId = '" + Alloy.Models.User.id + "' AND main.friendUserId <> '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyExpenseApportion", -1, false, "main.ownerUserId <> '" + Alloy.Models.User.id + "' AND main.friendUserId = '" + Alloy.Models.User.id + "'");
						updateDebtAccountOfTable("MoneyIncomeApportion", 1, false, "main.ownerUserId <> '" + Alloy.Models.User.id + "' AND main.friendUserId = '" + Alloy.Models.User.id + "'");
					}

				}, function(e) {
					activityWindow.showMsg("同步错误：" + e.__summary.msg);
					xErrorCallback(e);
				}, "syncPull", function(progress, totalLen, sendProgress) {
					if (!sendProgress) {
						var totalLenStr = "";
						if (totalLen !== undefined) {
							if (totalLen < 10240) {
								totalLen += " Bytes";
							} else {
								totalLen = (totalLen / 1024 / 1024).toFixed(2) + " MBytes";
							}
							totalLenStr = "共" + totalLen;
						}
						var completed = progress > 0 && progress < 1 ? (progress * 100).toFixed(2) + "%, " : "";
						activityWindow.progressStep(1, "下载数据(" + completed + totalLenStr + ")");
					}
				});
			},
			syncPush : function(xFinishedCallback, xErrorCallback, activityWindow) {
				var clientSyncRecords = Alloy.createCollection("ClientSyncTable"), data = [];
				clientSyncRecords.fetch({
					query : "SELECT * FROM ClientSyncTable main"
				});
				clientSyncRecords.forEach(function(record) {
					var obj = {
						operation : record.get("operation")
					};
					if (record.get("operation") === "delete") {
						obj.recordData = {
							id : record.get("recordId")
						};
					} else {
						obj.recordData = Alloy.createModel(record.get("tableName")).xFindInDb({
							id : record.get("recordId")
						}).toJSON();
					}

					obj.recordData.__dataType = record.get("tableName");
					data.push(obj);
				});

				this.postData(data, function(data) {
					var dbTrans = Alloy.Globals.DataStore.createTransaction();
					dbTrans.begin();

					// var lastSyncTime = data.lastSyncTime;
					// Alloy.Models.User.save({
					// "lastSyncTime" : lastSyncTime
					// }, {
					// wait : true,
					// syncFromServer : true,
					// patch : true,
					// dbTrans : dbTrans
					// });

					dbTrans.db.execute("DELETE FROM ClientSyncTable WHERE ownerUserId = '" + Alloy.Models.User.id + "'");
					dbTrans.commit();
					xFinishedCallback();
				}, function(e) {
					activityWindow.showMsg("同步错误：" + e.__summary.msg);
					xErrorCallback(e);
				}, "syncPush", function(progress, totalLen, sendProgress) {
					if (sendProgress) {
						var totalLenStr = "";
						if (totalLen !== undefined) {
							if (totalLen < 10240) {
								totalLen += " Bytes";
							} else {
								totalLen = (totalLen / 1024 / 1024).toFixed(2) + " MBytes";
							}
							totalLenStr = "共" + totalLen;
						}

						var completed = progress > 0 && progress < 1 ? (progress * 100).toFixed(2) + "%, " : "";
						activityWindow.progressStep(3, "上传数据(" + completed + totalLenStr + ")");
					}
				});
			},
			getExchangeRateFromGoogle : function(fromCurrency, toCurrency, successCB, errorCB) {
				var url = "http://www.google.com/ig/calculator?hl=en&q=1" + fromCurrency + "=?" + toCurrency;
				var client = Ti.Network.createHTTPClient({
					// function called when the response data is available
					onload : function(e) {
						var errorMatch = this.responseText.match(/.+,error: "(\d)".+/);
						if (errorMatch) {
							errorCB({
								__summary : {
									msg : "服务器无法获取该汇率，请手工输入",
									code : e.code
								}
							});
						} else {
							var rateMatch = this.responseText.match(/.+,rhs: "([^\s]+).+/);
							successCB(Number(rateMatch[1]).toFixed(4));
						}
					},
					// function called when an error occurs, including a timeout
					onerror : function(e) {
						if (e.code === 500 || e.code === -1) {
							errorCB({
								__summary : {
									msg : "服务器无法获取该汇率，请手工输入",
									code : e.code
								}
							});
						} else {
							errorCB({
								__summary : {
									msg : "连接服务器出错：" + e.code,
									code : e.code
								}
							});
						}
					},
					timeout : 60000 // in milliseconds
				});
				// Prepare the connection.
				client.open("GET", url);
				// Send the request.
				client.send();
			},
			getExchangeRate : function(fromCurrency, toCurrency, successCB, errorCB) {

				if (fromCurrency === toCurrency) {
					successCB(1.0000);
					return;
				}

				var self = this;
				var url = "http://www.webservicex.net/CurrencyConvertor.asmx";
				var callparams = {
					FromCurrency : fromCurrency,
					ToCurrency : toCurrency
				};

				var suds = new SudsClient({
					endpoint : url,
					targetNamespace : 'http://www.webserviceX.NET/'
				});

				try {
					suds.invoke('ConversionRate', callparams, function(xmlDoc) {
						var results = xmlDoc.documentElement.getElementsByTagName('ConversionRateResult');
						if (results && results.length > 0) {
							successCB(Number(results.item(0).text).toFixed(4));
						} else {

							self.getExchangeRateFromGoogle(fromCurrency, toCurrency, successCB, errorCB);

							// errorCB({
							// __summary : {
							// msg : '获取汇率出错'
							// }
							// });
						}
					}, function(e) {
						if (e.code === 500 || e.code === -1) {

							self.getExchangeRateFromGoogle(fromCurrency, toCurrency, successCB, errorCB);

							// errorCB({
							// __summary : {
							// msg : "服务器无法获取该汇率，请手工输入",
							// code : e.code
							// }
							// });
						} else {

							self.getExchangeRateFromGoogle(fromCurrency, toCurrency, successCB, errorCB);

							// errorCB({
							// __summary : {
							// msg : "连接服务器出错：" + e.code,
							// code : e.code
							// }
							// });
						}
					});
				} catch(e) {
					self.getExchangeRateFromGoogle(fromCurrency, toCurrency, successCB, errorCB);

					// errorCB({
					// __summary : {
					// msg : "连接服务器出错：" + e.code,
					// code : e.code
					// }
					// });
				}
			},
			getExchangeRates : function(exchanges, successCB, errorCB) {
				var self = this;
				var url = "http://www.webservicex.net/CurrencyConvertor.asmx";
				var exchangesCount = exchanges.length;
				var successCount = 0, errorCount = 0;

				exchanges.forEach(function(exchange) {
					if (errorCount > 0) {
						return;
					}

					if (exchange.fromCurrency === exchange.toCurrency) {
						exchange.rate = 1.0000;
						successCount++;
						return;
					}

					var callparams = {
						FromCurrency : exchange.fromCurrency,
						ToCurrency : exchange.toCurrency
					};

					var suds = new SudsClient({
						endpoint : url,
						targetNamespace : 'http://www.webserviceX.NET/'
					});

					try {
						suds.invoke('ConversionRate', callparams, function(xmlDoc) {
							var results = xmlDoc.documentElement.getElementsByTagName('ConversionRateResult');
							if (results && results.length > 0) {
								var result = results.item(0);
								exchange.rate = Number(results.item(0).text).toFixed(4);
								successCount++;
								if (successCount === exchangesCount) {
									successCB(exchanges);
								}
							} else {
								if (errorCount === 0) {
									self.getExchangeRateFromGoogle(exchange.fromCurrency, exchange.toCurrency, function(rate) {
										exchange.rate = rate;
										successCount++;
										if (successCount === exchangesCount) {
											successCB(exchanges);
										}
									}, function(e) {
										errorCount++;
										errorCB(e);
									});
								}
							}
						}, function(e) {
							if (errorCount === 0) {
								self.getExchangeRateFromGoogle(exchange.fromCurrency, exchange.toCurrency, function(rate) {
									exchange.rate = rate;
									successCount++;
									if (successCount === exchangesCount) {
										successCB(exchanges);
									}
								}, function(e) {
									errorCount++;
									errorCB(e);
								});
								//
								// errorCount++;
								// errorCB({
								// __summary : {
								// msg : "连接服务器出错：" + e.code,
								// code : e.code
								// }
								// });
							}
						});
					} catch(e) {
						if (errorCount === 0) {
							self.getExchangeRateFromGoogle(exchange.fromCurrency, exchange.toCurrency, function(rate) {
								exchange.rate = rate;
								successCount++;
								if (successCount === exchangesCount) {
									successCB(exchanges);
								}
							}, function(e) {
								errorCount++;
								errorCB(e);
							});
							//
							// errorCount++;
							// errorCB({
							// __summary : {
							// msg : "连接服务器出错：" + e.code,
							// code : e.code
							// }
							// });
						}
					}
				});
			},
			fetchImage : function(id, successCB, errorCB, fetchImageTarget, filePath, progressCB) {
				fetchImageTarget = fetchImageTarget || "fetchImage";
				this.postData(id, function(data) {
					if (data.length > 0) {
						data = data[0];
						if (data.base64Picture) {
							if (!filePath) {
								if (OS_ANDROID) {
									filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/";
								} else {
									filePath = Ti.Filesystem.applicationDataDirectory;
								}
							}
							var f1 = Ti.Filesystem.getFile(filePath, data.id + "." + data.pictureType);
							f1.write(Ti.Utils.base64decode(data.base64Picture));
							f1 = null;
							successCB();
						} else {
							errorCB({
								__summary : {
									msg : "图片无内容"
								}
							});
						}
					} else {
						errorCB({
							__summary : {
								msg : "图片不存在"
							}
						});
					}
				}, errorCB, fetchImageTarget, progressCB);
			},
			loadRecordPictures : function(id, successCB, errorCB) {
				this.postData(id, function(dataCollection) {
					dataCollection.forEach(function(data) {
						if (data.base64PictureIcon) {
							var filePath = Alloy.Globals.getApplicationDataDirectory();
							var f1 = Ti.Filesystem.getFile(filePath, data.id + "_icon." + data.pictureType);
							f1.write(Ti.Utils.base64decode(data.base64PictureIcon));
							f1 = null;
							data.base64PictureIcon = null;
							delete data.base64PictureIcon;
						}

						var modelData = data;
						var id = modelData.id;
						delete modelData.id;
						var model = Alloy.createModel("Picture").xFindInDb({
							id : id
						});
						if (!model.id) {
							model.attributes.id = id;
						}
						model.xSet(modelData);
						model.save(null, {
							silent : true,
							//dbTrans : dbTrans,
							syncFromServer : true
						});

					});
					successCB();
				}, errorCB, "fetchRecordPictures");
			},
			// fetchUserImage : function(id, successCB, errorCB, progressCB) {
			// this.postData(id, function(data) {
			// if(data.length > 0){
			// data = data[0];
			// successCB(Ti.Utils.base64decode(data.base64Picture));
			// }
			// }, errorCB, "fetchUserImage", progressCB);
			// },
			fetchUserImageIcon : function(pid, successCB, errorCB, progressCB) {
				this.postData(pid, function(data) {
					if (data.length > 0) {
						data = data[0];
						if (data.base64PictureIcon) {
							var filePath = Alloy.Globals.getTempDirectory();
							var f1 = Ti.Filesystem.getFile(filePath, data.id + "_icon." + data.pictureType);
							f1.write(Ti.Utils.base64decode(data.base64PictureIcon));
							f1 = null;
							data.base64PictureIcon = null;
							delete data.base64PictureIcon;
							var id = data.id;
							// prevent it to be added to dataStore during object initialization
							delete data.id;
							var picture = Alloy.createModel("Picture", data);
							picture.attributes["id"] = id;
							successCB(picture);
						} else if (errorCB) {
							errorCB();
						}
					} else if (errorCB) {
						errorCB();
					}
				}, errorCB, "fetchUserImageIcon", progressCB);
			}
		};
	}());
