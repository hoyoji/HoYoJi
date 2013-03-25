( function() {
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
			}
		}
	}());
