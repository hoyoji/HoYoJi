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
			loadData : function(modelName, filter, xFinishedCallback, xErrorCallback) {
				var collection = Alloy.createCollection(modelName);
				collection.xSearchInDb(filter);
				xFinishedCallback(collection);
			},
			sync : function(lastSyncTime) {
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
