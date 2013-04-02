( function() {
		var dataUrl = "http://localhost/data/";
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
			createData : function(data, xFinishedCallback, xErrorCallback){
				data = JSON.stringify(data);
				console.info(data);
				var url = dataUrl + "createData";
				var xhr = Ti.Network.createHTTPClient({
					onload : function(e) {
						console.info("Server.createData success : " + JSON.stringify(this.responseText));
						xFinishedCallback();
					},
					onerror : function(e) {
						console.info("Server.createData error : " + JSON.stringify(this.responseText));
						xErrorCallback(e);
					},
					timeout : 5000 /* in milliseconds */
				});
				xhr.open("POST", url);
				xhr.send(data);
			},
			sync : function(lastSyncTime, xFinishedCallback, xErrorCallback) {
				var url = dataUrl + "User/1";
				var xhr = Ti.Network.createHTTPClient({
					onload : function(e) {
						alert(JSON.stringify(this.responseText));
					},
					onerror : function(e) {
						alert(e.error);
					},
					timeout : 5000 /* in milliseconds */
				});
				xhr.open("GET", url);
				xhr.send();
			}
		}
	}());
