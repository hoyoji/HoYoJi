( function() {
		var dataUrl = "http://2.money.app100697798.twsapp.com/";
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

				xFinishedCallback(collection);
			},
			getData : function(data, xFinishedCallback, xErrorCallback, target) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "getData");
			},
			loadData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				this.searchData(modelName, filter, function(collection) {
					// collection.map(function(item){
					// item.save({wait : true});
					// });
					if (collection.length > 0) {
						xFinishedCallback(collection);
						return;
					}

					var requestData = [];
					filter.forEach(function(id) {
						requestData.push({
							__dataType : modelName,
							id : id
						});
					})
					Alloy.Globals.Server.getData(requestData, function(data) {
						var returnCollection = Alloy.createCollection(modelName);
						data.forEach(function(record) {
							var modelData = record[0];
							var id = modelData.id;
							delete modelData.id;
							var model = Alloy.createModel(modelData.__dataType, modelData);
							model.attributes.id = id;
							model.save();
							returnCollection.push(model);
						});
						xFinishedCallback(returnCollection);
					}, xErrorCallback);

				}, xErrorCallback);
			},
			// updateData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
			// var collection = Alloy.createCollection(modelName);
			// collection.xSearchInDb(filter);
			// xFinishedCallback(collection);
			// },
			// deleteData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
			// var collection = Alloy.createCollection(modelName);
			// collection.xSearchInDb(filter);
			// xFinishedCallback(collection);
			// },
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
					timeout : 5000 /* in milliseconds */
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
				this.syncPull(function() {
					self.syncPush(function(data) {
						if (xFinishedCallback) {
							xFinishedCallback();
						}
						alert("sync finished");
					}, function(e) {
						if (xErrorCallback) {
							xErrorCallback(e);
						}
						alert("sync error : " + e.__summary.msg);
					});
				}, function(e) {
					if (xErrorCallback) {
						xErrorCallback(e);
					}
					alert("sync error " + e.__summary.msg);
				});

			},
			syncPull : function(xFinishedCallback, xErrorCallback) {
				this.getData(Alloy.Models.User.xGet("lastSyncTime"), function(data) {
					var lastSyncTime = data.lastSyncTime;
					data = _.flatten(data.data);

					var db = Ti.Database.open("hoyoji");
					var dbTrans = {
						db : db
					};
					_.extend(dbTrans, Backbone.Events);

					db.execute("BEGIN;");

					Alloy.Models.User.save({
						"lastSyncTime" : lastSyncTime
					}, {
						noSyncUpdate : true,
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
							if (!model.isNew()) {
								model.syncDelete(record, dbTrans);
							}
							// 如果该记录同时在本地和服务器上都已被删除， 也没有必要将该删除同步到服务器
							sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
							db.execute(sql, [id]);
						} else {
							// 该记录是在服务器上新增的或被修改的。
							// 1. 我们先检查看该记录是否有被本地修改过，如果有修改过，我们处理冲突。
							// 2. 否则，检查看该记录在不在本地表里面, 如果不再我们将其添加进来
							sql = "SELECT * FROM ClientSyncTable WHERE recordId = ?";
							rs = db.execute(sql, [record.id]);
							if (rs.rowCount > 0) {
								var operation = rs.fieldByName("operation");
								rs.close()
								// 该记录同时在本地和服务器被修改过
								// 1. 如果该记录同時已被本地删除，那我们什么也不做，让其将服务器上的该记录也被删除
								// 2. 如果该记录同時已被本地修改过，那我们也什么不做，让本地修改覆盖服务器上的记录
								if (operation === "update") {
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
								for(var belongsTo in model.config.belongsTo){
									if(model.config.belongsTo[belongsTo].attribute){
										rs = db.execute(sql, [record.id]);
										if (rs.rowCount > 0) {
											belongsToDeleted = true;
											break;
										}
										rs.close();
									}
								}
								if(belongsToDeleted) {
									// 如果该model是新的，我们要通知服务器删除该记录
									if (model.isNew() && record.id === Alloy.Models.User.id) {
										db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + record.id + "','" + model.config.adapter.collection_name + "','delete','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
									}
								} else {
									if (model.isNew()) {
										// 没有找到该记录
										model.syncAddNew(record, dbTrans);
										model._syncAddNew(record,dbTrans);
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
					db.execute("COMMIT;");
					dbTrans.trigger("commit");
					db.close();
					db = null;
					xFinishedCallback();
				}, function(e) {
					xErrorCallback(e);
				}, "syncPull");
			},
			// _syncInsertLocal : function(record, dataType, db) {
			// // 该记录不在本地表里面, 我们将其添加进来
			// var attrs = _.keys(record), values = _.values(record), questionMarks = attrs.map(function() {
			// return "?";
			// }), sql = "INSERT INTO " + dataType + "(" + attrs.join(",") + ") VALUES(" + questionMarks.join(",") + ")";
			// db.execute(sql, values);
			// },
			// _syncDeleteLocal : function(record, dataType, db) {
			// var sql = "DELETE FROM " + dataType + " WHERE id = ?";
			// db.execute(sql, [record.id]);
			// },
			// _syncUpdateLocal : function(record, dataType, db) {
			// var sql, id = record.id, values = [], attrs = [];
			// delete record.id;
			// for (var attr in record) {
			// attrs.push(attr + "=?");
			// values.push(record[attr]);
			// }
			// values.push(id);
			// sql = "UPDATE " + dataType + " SET " + attrs.join(",") + " WHERE id = ?";
			// db.execute(sql, values);
			// record.id = id;
			// },
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
					var db = Ti.Database.open("hoyoji");
					db.execute("DELETE FROM ClientSyncTable WHERE ownerUserId = '" + Alloy.Models.User.id + "'");
					db.close();
					db = null;
					xFinishedCallback();
				}, xErrorCallback, "syncPush");
			}
		}
	}());
