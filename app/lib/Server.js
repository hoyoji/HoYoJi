( function() {
		var dataUrl = "http://2.money.app100697798.twsapp.com/";
		Ti.include('suds.js');
		exports.Server = {
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
			getData : function(data, xFinishedCallback, xErrorCallback, target) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "getData");
			},
			findData : function(data, xFinishedCallback, xErrorCallback, target) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "findData");
			},
			loadSharedProjects : function(projectIds, xFinishedCallback, xErrorCallback) {
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
				Alloy.Globals.Server.getData(requestData, function(data) {
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
							model.xSet(modelData);
							model.save(null, {
								silent : true,
								syncFromServer : true
							});
							if (modelData.__dataType === "Project") {
								returnCollection.push(model);
							}
						}
					});
					if (xFinishedCallback) {
						xFinishedCallback(returnCollection);
					}
				}, xErrorCallback, "getSharedProjects");
				// }, xErrorCallback);
			},
			loadData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				// this.searchData(modelName, filter, function(collection) {
				// if (collection.length > 0) {
				// xFinishedCallback(collection);
				// return;
				// }

				var requestData = [];
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
				Alloy.Globals.Server.getData(requestData, function(data) {
					var returnCollection = Alloy.createCollection(modelName);
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
							model.xSet(modelData);
							model.save(null, {
								silent : true,
								syncFromServer : true
							});
							returnCollection.push(model);
						}
					});
					if (xFinishedCallback) {
						xFinishedCallback(returnCollection);
					}
				}, xErrorCallback);

				// }, xErrorCallback);
			},
			putData : function(data, xFinishedCallback, xErrorCallback, target) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "putData");
			},
			deleteData : function(data, xFinishedCallback, xErrorCallback, target) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "deleteData");
			},
			postData : function(data, xFinishedCallback, xErrorCallback, target) {
				data = JSON.stringify(data);
				console.info(data);
				var url = dataUrl + (target || "postData") + ".php";
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
					onerror : function(e) {
						console.info("Server.postData error : " + JSON.stringify(e));
						//if(e.code === 1){
						xErrorCallback({
							__summary : {
								msg : "连接服务器出错 " + e.code
							}
						});
						//}
					},
					timeout : 20000 /* in milliseconds */
				});
				xhr.open("POST", url);
				if (Alloy.Models.User) {
					var auth = Alloy.Models.User.xGet("userName") + ":" + Alloy.Models.User.xGet("password");
					xhr.setRequestHeader("Authorization", "Basic " + Ti.Utils.base64encode(auth));
				}
				xhr.send(data);
			},
			sync : function(xFinishedCallback, xErrorCallback) {
				var self = this;
				var activityWindow = Alloy.createController("activityMask");
				activityWindow.open("正在同步...");

				this.syncPull(function() {
					// alert("start push data");
					self.syncPush(function(data) {
						if (xFinishedCallback) {
							xFinishedCallback();
						}
						// activityWindow.close();
						activityWindow.showMsg("同步完成");
						//alert("sync finished");
					}, function(e) {
						if (xErrorCallback) {
							xErrorCallback(e);
						}
						// activityWindow.close();
						activityWindow.showMsg("同步错误：" + e.__summary.msg);
						//alert("sync error : " + e.__summary.msg);
					});
				}, function(e) {
					if (xErrorCallback) {
						xErrorCallback(e);
					}
					// activityWindow.close();
					activityWindow.showMsg("同步错误：" + e.__summary.msg);
					//alert("sync error " + e.__summary.msg);
				});
			},
			syncPull : function(xFinishedCallback, xErrorCallback) {
				this.getData(Alloy.Models.User.xGet("lastSyncTime"), function(data) {
					var lastSyncTime = data.lastSyncTime;
					data = _.flatten(data.data);

					var dbTrans = Alloy.Globals.DataStore.createTransaction();
					dbTrans.begin();

					Alloy.Models.User.save({
						"lastSyncTime" : lastSyncTime
					}, {
						wait : true,
						syncFromServer : true,
						patch : true,
						dbTrans : dbTrans
					});

					data.forEach(function(record) {
						var sql, rs, dataType = record.__dataType, asyncCount = 0;
						delete record.__dataType;
						if (dataType === "ServerSyncDeletedRecords") {
							var id = record.recordId;
							var model = Alloy.createModel(record.tableName).xFindInDb({
								id : id
							});
							// 如果该记录同时在本地和服务器上都已被删除， 也没有必要将该删除同步到服务器
							sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
							if (!model.isNew()) {
								if (model.xGet("ownerUserId") !== Alloy.Models.User.id) {
									// dbTrans.db.execute("DELETE FROM " + record.tableName + " WHERE id = ?", [id]);
									model.destroy({
										wait : true,
										syncFromServer : true,
										dbTrans : dbTrans
									});
								} else {
									// 我们要将该记录的所有hasMany一并删除
									for (var hasMany in model.config.hasMany) {
										model.xGet(hasMany).forEach(function(item) {
											item.syncDelete(record, dbTrans);
											item._syncDelete(record, dbTrans, function(e) {
											});
											dbTrans.db.execute(sql, [item.xGet("id")]);
										});
									}
									model.syncDelete(record, dbTrans);
									model._syncDelete(record, dbTrans, function(e) {
									});
								}
							}
							dbTrans.db.execute(sql, [id]);
						} else {
							// 该记录是在服务器上新增的或被修改的。
							// 1. 我们先检查看该记录是否有被本地修改过，如果有修改过，我们处理冲突。
							// 2. 否则，检查看该记录在不在本地表里面, 如果不再我们将其添加进来
							sql = "SELECT * FROM ClientSyncTable WHERE recordId = ?";
							rs = dbTrans.db.execute(sql, [record.id]);
							if (rs.rowCount > 0) {
								var operation = rs.fieldByName("operation");
								rs.close();
								// 该记录同时在本地和服务器被修改过
								// 1. 如果该记录同時已被本地删除，那我们什么也不做，让其将服务器上的该记录也被删除
								// 2. 如果该记录同時已被本地修改过，那我们也什么不做，让本地修改覆盖服务器上的记录
								if (operation !== "delete") {
									if (operation === "create") {
										dbTrans.db.execute("UPDATE ClientSyncTable SET operation = 'update' WHERE recordId = ? AND operation = 'create'", [record.id]);
									}
									var model = Alloy.createModel(dataType).xFindInDb({
										id : record.id
									});
									model.syncUpdateConflict(record, dbTrans);
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
										rs = dbTrans.db.execute(sql, [record.id]);
										if (rs.rowCount > 0) {
											belongsToDeleted = true;
											break;
										}
										rs.close();
									}
								}
								if (belongsToDeleted) {
									// 如果该model是新的，我们要通知服务器删除该记录
									if (model.isNew() && record.id === Alloy.Models.User.id) {
										dbTrans.db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + record.id + "','" + model.config.adapter.collection_name + "','delete','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
									}
								} else {
									if (model.isNew()) {
										// 没有找到该记录
										if (model.syncAddNew(record, dbTrans) !== false) {
											model._syncAddNew(record, dbTrans);
										}
									} else {
										// 该记录已存在本地，我们更新
										model.syncUpdate(record, dbTrans);
										model._syncUpdate(record, dbTrans);
									}
								}
							}
							rs = null;
						}
					});
					// alert("start committing");
					dbTrans.commit();
					Alloy.Models.User.xGet("messageBox").processNewMessages();
					xFinishedCallback();
				}, function(e) {
					xErrorCallback(e);
				}, "syncPull");
			},
			syncPush : function(xFinishedCallback, xErrorCallback) {
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

					var lastSyncTime = data.lastSyncTime;
					Alloy.Models.User.save({
						"lastSyncTime" : lastSyncTime
					}, {
						wait : true,
						syncFromServer : true,
						patch : true,
						dbTrans : dbTrans
					});

					dbTrans.db.execute("DELETE FROM ClientSyncTable WHERE ownerUserId = '" + Alloy.Models.User.id + "'");
					dbTrans.commit();
					xFinishedCallback();
				}, xErrorCallback, "syncPush");
			},
			getExchangeRateFromGoogle : function(fromCurrency, toCurrency, successCB, errorCB) {
				var url = "http://www.google.com/ig/calculator?hl=en&q=1" + fromCurrency + "=?" + toCurrency;
				var client = Ti.Network.createHTTPClient({
					// function called when the response data is available
					onload : function(e) {
						var rateMatch = this.responseText.match(/.+,rhs: "([^\s]+).+/);
						successCB(Number(rateMatch[1]).toFixed(4));
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
					timeout : 5000 // in milliseconds
				});
				// Prepare the connection.
				client.open("GET", url);
				// Send the request.
				client.send();
			},
			getExchangeRate : function(fromCurrency, toCurrency, successCB, errorCB) {
				this.getExchangeRateFromGoogle(fromCurrency, toCurrency, successCB, errorCB);
				return;
				
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
							var result = results.item(0);
							successCB(Number(results.item(0).text).toFixed(4));
						} else {
							errorCB({
								__summary : {
									msg : '获取汇率出错'
								}
							});
						}
					}, function(e) {
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
					});
				} catch(e) {
					errorCB({
						__summary : {
							msg : "连接服务器出错：" + e.code,
							code : e.code
						}
					});
				}
			},
			getExchangeRates : function(exchanges, successCB, errorCB) {
				var url = "http://www.webservicex.net/CurrencyConvertor.asmx";
				var exchangesCount = exchanges.length;
				var successCount = 0, errorCount = 0;

				exchanges.forEach(function(exchange) {
					if (errorCount > 0) {
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
						
						this.getExchangeRateFromGoogle(fromCurrency, toCurrency, successCB, errorCB);
						return;
						
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
									errorCount++;
									errorCB({
										__summary : {
											msg : '获取汇率出错'
										}
									});
								}
							}
						}, function(e) {
							if (errorCount === 0) {
								errorCount++;
								errorCB({
									__summary : {
										msg : "连接服务器出错：" + e.code,
										code : e.code
									}
								});
							}
						});
					} catch(e) {
						if (errorCount === 0) {
							errorCount++;
							errorCB({
								__summary : {
									msg : "连接服务器出错：" + e.code,
									code : e.code
								}
							});
						}
					}
				});
			}
		};
	}());
