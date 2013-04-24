exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			ownerUserId : "TEXT NOT NULL",
		    lastSyncTime : "TEXT",
		    lastSyncTime : "TEXT",
			lastModifyTime : "TEXT"
		},
		belongsTo : {
			ownerUser : { type : "User", attribute : null }
		},
		hasMany : {
			messages : { type : "Message", attribute : "messageBox"}
		},
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			validators : {
			},
			processNewMessages : function(){
				var newMessages = Alloy.createCollection("Message").xSearchInDb({
					messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
					toUserId : Alloy.Models.User.id,
					messageState : "new"
				})
				newMessages.map(function(msg){
					if(msg.xGet("type") === "System.Friend.AddResponse"){
						msg.save({messageState : "unread"}, {wait : true, patch : true});
						var deleteFriendMsgLength = Alloy.createCollection("Message").xSearchInDb({
								fromUserId : msg.xGet("fromUserId"),
								toUserId : Alloy.Models.User.id,
								type : "System.Friend.Delete",
								messageState : "new"
							}).length;
						if(deleteFriendMsgLength === 0){
							var friendlength = Alloy.createCollection("Friend").xSearchInDb({
							friendUserId : msg.xGet("fromUserId"),
							ownerUserId : Alloy.Models.User.id
							}).length;
							if (friendlength === 0) {
								var friend = Alloy.createModel("Friend", {
									ownerUser :　Alloy.Models.User,
									friendUser : msg.xGet("fromUser"),
									friendCategory : Alloy.Models.User.xGet("defaultFriendCategory")
								});
								friend.xSave();
							}
						}
						
					} else if(msg.xGet("type") === "System.Friend.AutoAdd"){
						msg.save({messageState : "unread"}, {wait : true, patch : true});
						var friendlength = Alloy.createCollection("Friend").xSearchInDb({
							friendUserId : msg.xGet("fromUserId"),
							ownerUserId : Alloy.Models.User.id
							}).length;
						if (friendlength===0) {
							var friend = Alloy.createModel("Friend", {
								ownerUser :　Alloy.Models.User,
								friendUser : msg.xGet("fromUser"),
								friendCategory : Alloy.Models.User.xGet("defaultFriendCategory")
							});
							friend.xSave();
						}
					} else if(msg.xGet("type") === "System.Friend.Delete"){
						msg.save({messageState : "unread"}, {wait : true, patch : true});
						var friend = Alloy.createModel("Friend").xFindInDb({
							friendUserId : msg.xGet("fromUserId"),
							ownerUserId : Alloy.Models.User.id
							});
					    if (friend && friend.xGet("id")) {
							friend._xDelete();
						}
					} 
					// else if(msg.xGet("type") === "Project.Share.Reject"){
						// msg.save({messageState : "unread"}, {wait : true, patch : true});
						// var projectShareData = JSON.parse(msg.xGet("messageData"));
						// var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							// id : projectShareData.projectShareAuthorizationId
						// });
						// if (projectShareAuthorization.xGet("id")){
							// projectShareAuthorization._xDelete();
						// }
						// if(projectShareData.shareAllSubProjects){
							// projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
								// var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
									// id : subProjectShareAuthorizationId
								// });
								// if (subProjectShareAuthorization.xGet("id")){
									// subProjectShareAuthorization._xDelete();
								// }
							// });
						// }
					// } 
					else if(msg.xGet("type") === "Project.Share.Edit"){
						var projectShareData = JSON.parse(msg.xGet("messageData"));
						if(projectShareData.shareAllSubProjects){
							var projectShareIds = _.union([projectShareData.projectShareAuthorizationId], projectShareData.subProjectShareAuthorizationIds);
							Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareIds, function(collection){
								if(collection.length > 0){
									var projectShareAuthorization = collection.get(projectShareData.projectShareAuthorizationId);
									if(projectShareAuthorization.xGet("state") === "Accept"){
										projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
											var subProjectShareAuthorization = collection.get(subProjectShareAuthorizationId);
											if(subProjectShareAuthorization.xGet("state") === "Wait"){
												subProjectShareAuthorization.save({state : "Accept"}, {wait : true, patch : true});
											}
										});
										msg.save({messageState : "unread"}, {wait : true, patch : true});
											// Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareData.subProjectShareAuthorizationIds, function(collection){
												// collection.map(function(projectShareAuthorization){
													// projectShareAuthorization.save({state : 'Accept'}, {wait : true, patch : true});
												// });
											// });
										// projectShareAuthorization.save({state : "Accept"}, {wait : true, patch : true});
									}
									
								}
							});
						}
						
						// else{
							// var collection = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb(projectShareData.subProjectShareAuthorizationIds);
							// collection.map(function(subProjectShareAuthorization){
								// subProjectShareAuthorization.save({state : "Delete"}, {wait : true, patch : true});						
							// });
						// }
					} 
					// else if(msg.xGet("type") === "Project.Share.Delete"){
						// msg.save({messageState : "unread"}, {wait : true, patch : true});
						// var projectShareData = JSON.parse(msg.xGet("messageData"));
						// var projectShareIds = _.union([projectShareData.projectShareAuthorizationId], projectShareData.subProjectShareAuthorizationIds);
						// var projectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb(projectShareIds);
						// projectShareAuthorizations.map(function(projectShareAuthorization){
							// projectShareAuthorization.save({state : "Delete"}, {wait : true, patch : true});
							// // we shall delete all the shared data from the phone
						// });
					// }			
				});
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});
		return Collection;
	}
}
