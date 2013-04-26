( function() {
		var dataUrl = "http://2.money.app100697798.twsapp.com/";
		exports.Server = {
			sendMsg : function(msgJSON, xFinishedCallback, xErrorCallback) {
				var msg = Alloy.createModel("Message");
				msgJSON.ownerUserId = msgJSON.toUserId;
				msg.save(msgJSON, {
					patch : true,
					wait : true,
					success : xFinishedCallback,
					error : xErrorCallback
				});
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

					xFinishedCallback(collection);
				}, xErrorCallback);
			},
			updateData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				var collection = Alloy.createCollection(modelName);
				collection.xSearchInDb(filter);
				xFinishedCallback(collection);
			},
			deleteData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				var collection = Alloy.createCollection(modelName);
				collection.xSearchInDb(filter);
				xFinishedCallback(collection);
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
					Alloy.Models.User.save({
						"lastSyncTime" : data.lastSyncTime
					}, {
						noSyncUpdate : true,
						patch : true,
						wait : true
					});
					data = _.flatten(data.data);
					var db = Ti.Database.open("hoyoji");
					db.execute("BEGIN;");
					data.forEach(function(record) {
						var rs, dataType = record.__dataType;
						delete record.__dataType;
						if (record.__dataType === "ServerSyncDeletedRecords") {
							this._syncDeleteLocal(record, dataType, db);
						} else {
							// 该记录是在服务器上新增的或被修改的。
							// 我们先检查看该记录是否有被本地修改过，如果有修改过，我们处理冲突。
							// 否则，检查看该记录在不在本地表里面, 如果不再我们将其添加进来
							sql = "SELECT * FROM ClientSyncTable WHERE recordId = ?";
							rs = db.execute(sql, [record.id]);
							if (rs.rowCount > 0) {
								rs.close()
								// 该记录同时被本地被修改过
								// 如果该记录是被本地删除，那么我们什么也不做，让其将服务器上的该记录也被删除
								// 如果该记录是被本地修改过，那我们也什么不错，让其覆盖服务器上的记录
								var model = Alloy.createModel(dataType);
								model.xFindInDb({id : record.id});
								model._resolveConflicts(record);
							} else {
								rs.close();
								// 否则，检查看该记录在不在本地表里面, 如果不在我们将其添加进来
								sql = "SELECT * FROM " + dataType + " WHERE id = ?";
								rs = db.execute(sql, [record.id]);
								
								if (rs.rowCount === 0) {
									this._syncInsertLocal(record, dataType, db);
								} else {
									// 本地记录未被修改过，直接更新本地记录
									this._syncUpdateLocal(record, dataType, db);
								}
								
								var o = {}, fc = 0;
								fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;
								_.times(fc, function(c) {
									var fn = rs.fieldName(c);
									o[fn] = rs.fieldByName(fn);
								});
								var model = Alloy.createModel(dataType, record);
								model._resolveConflicts(record);
							}
							rs = null;
						}
					});
					db.execute("COMMIT;");
					db.close();
					db = null;
					xFinishedCallback();
				}, function(e) {
					xErrorCallback(e);
				}, "syncPull");
			},
			_syncInsertLocal : function(record, dataType, db) {
				// 该记录不在本地表里面, 我们将其添加进来
				var attrs = _.keys(record), values = _.values(record), 
				questionMarks = attrs.map(function() {
											return "?";
										}), 
				sql = "INSERT INTO " + dataType + "(" + attrs.join(",") + ") VALUES(" + questionMarks.join(",") + ")";
				db.execute(sql, values);
			},
			_syncDeleteLocal : function(record, dataType, db) {
				var sql = "DELETE FROM " + dataType + " WHERE id = ?";
				db.execute(sql, [record.id]);
				// 如果该记录在本地也已被删除， 也没有必要将该删除同步到服务器
				sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
				db.execute(sql, [record.id]);
			},
			_syncUpdateLocal : function(record, dataType, db) {
				var sql, id = record.id, values = [], attrs = [];
				delete record.id;
				for (var attr in record) {
					attrs.push(attr + "=?");
					values.push(record[attr]);
				}
				values.push(id);
				sql = "UPDATE " + dataType + " SET " + attrs.join(",") + " WHERE id = ?";
				db.execute(sql, values);
				record.id = id;
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
							id : record.get("id")
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
