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
				if(_.isArray(filter)){
					collection.fetch({query : "SELECT * FROM " + modelName + " main WHERE main.id IN ('" + filter.join("','") + "')"});	
				} else {
					collection.xSearchInDb(filter);
				}
				
				xFinishedCallback(collection);
			},
			getData : function(data, xFinishedCallback, xErrorCallback, target) {
				this.postData(data, xFinishedCallback, xErrorCallback, target || "getData");
			},
			loadData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				this.searchData(modelName, filter, function(collection){
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
			postData : function(data, xFinishedCallback, xErrorCallback, target){
				data = JSON.stringify(data);
				console.info(data);
				var url = dataUrl + (target || "postData") + ".php";
				var xhr = Ti.Network.createHTTPClient({
					onload : function(e) {
						console.info("Server.postData response : " + this.responseText);
						if(this.responseText){
							var returnedData = JSON.parse(this.responseText);
							if(returnedData.__summary){
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
							xErrorCallback({ __summary : {msg : "连接服务器出错 " + e.code}});
						//}
					},
					timeout : 5000 /* in milliseconds */
				});
				xhr.open("POST", url);
				if(Alloy.Models.User){
					var auth = Alloy.Models.User.xGet("userName") + ":" + Alloy.Models.User.xGet("password");
					xhr.setRequestHeader("Authorization", "Basic " + Ti.Utils.base64encode(auth));
				}
				xhr.send(data);
			},
			sync : function(xFinishedCallback, xErrorCallback) {
				this.syncPull();
				// this.syncPush(function(data){
					// Alloy.Models.User.save({"lastSyncTime" : data.lastSyncTime}, {patch : true, wait : true});
					// var db = Ti.Database.open("hoyoji");
					// db.execute("DELETE FROM ClientSyncTable WHERE ownerUserId = '" + Alloy.Models.User.id + "'");
					// db.close();
					// db = null;
					// alert("sync finished");
				// }, function(e){
					// alert("sync error : " + e.__summary.msg);
				// });			
			},
			syncPull : function(xFinishedCallback, xErrorCallback){
				this.getData(Alloy.Models.User.xGet("lastSyncTime"), function(data){
					
					
					
				}, function(e){
					alert("sync error " + e.__summary.msg);
				}, "syncPull");
			},
			syncPush : function(xFinishedCallback, xErrorCallback){
				var clientSyncRecords = Alloy.createCollection("ClientSyncTable"),
					data = [];
				clientSyncRecords.fetch({query : "SELECT * FROM ClientSyncTable main"});
				clientSyncRecords.forEach(function(record){
					var obj = {
						operation : record.get("operation")
					};
					if(record.get("operation") === "delete"){
						obj.recordData = {id : record.get("id")};
					} else {
						obj.recordData = Alloy.createModel(record.get("tableName")).xFindInDb({id : record.get("recordId")}).toJSON();
					}
					
					obj.recordData.__dataType = record.get("tableName");
					data.push(obj);
				});
				if(data.length === 0){
					xFinishedCallback();
					return;
				}
				this.postData(data, xFinishedCallback, xErrorCallback, "syncPush");
			}
		}
	}());
