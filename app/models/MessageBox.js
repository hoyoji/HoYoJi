exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			ownerUserId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
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
						var deleteFriendMsgLength = Alloy.createCollection("Message").xSearchInDb({
								fromUserId : msg.xGet("fromUserId"),
								toUserId : Alloy.Models.User.id,
								type : "System.Friend.Delete",
								messageState : "new"
							}).length;
						if(deleteFriendMsgLength === 0){
							Alloy.Globals.Server.getData([{
								__dataType : "Friend",
								friendUserId : msg.xGet("fromUserId"),
								ownerUserId : Alloy.Models.User.id
							}], function(data) {
								if (data[0].length === 0) {
						    		var friend = Alloy.createModel("Friend", {
										ownerUser :　Alloy.Models.User,
										friendUser : msg.xGet("fromUser"),
										friendCategory : Alloy.Models.User.xGet("userData").xGet("defaultFriendCategory")
									});
									
									Alloy.Globals.Server.postData(
									[friend.toJSON()], function(data) {
										msg.save({messageState : "unread"}, {wait : true, patch : true});
										friend.xSave({syncFromServer : true});
									}, function(e) {
										alert(e.__summary.msg);
									});
							    }else{
							    	msg.save({messageState : "unread"}, {wait : true, patch : true});
							    }
						    }, function(e) {
								alert(e.__summary.msg);
							});
						}
						
					} else if(msg.xGet("type") === "System.Friend.AutoAdd"){
						Alloy.Globals.Server.getData([{
								__dataType : "Friend",
								friendUserId : msg.xGet("fromUserId"),
								ownerUserId : Alloy.Models.User.id
						}], function(data) {
							if (data[0].length === 0) {
								var friend = Alloy.createModel("Friend", {
									ownerUser :　Alloy.Models.User,
									friendUser : msg.xGet("fromUser"),
									friendCategory : Alloy.Models.User.xGet("userData").xGet("defaultFriendCategory")
								});
								
								Alloy.Globals.Server.postData(
								[friend.toJSON()], function(data) {
									friend.xSave({syncFromServer : true});
									msg.save({messageState : "unread"}, {wait : true, patch : true});
								}, function(e) {
									alert(e.__summary.msg);
								});
							}
						}, function(e) {
							alert(e.__summary.msg);
						});
						
					} else if(msg.xGet("type") === "System.Friend.Delete"){
						var friend = Alloy.createModel("Friend").xFindInDb({
							friendUserId : msg.xGet("fromUserId"),
							ownerUserId : Alloy.Models.User.id
							});
						Alloy.Globals.Server.getData([{
							__dataType : "Friend",
							friendUserId : msg.xGet("fromUserId"),
							ownerUserId : Alloy.Models.User.id
						}], function(data) {
							if (data[0].length > 0) {
								Alloy.Globals.Server.deleteData(
								[{__dataType : "Friend", id : data[0][0].id}], function(data) {
								    if (friend && friend.xGet("id")) {
											friend._xDelete();
									}
									msg.save({messageState : "unread"}, {wait : true, patch : true});
								}, function(e) {
									alert(e.__summary.msg);
								});
							}else{
							    if (friend && friend.xGet("id")) {
										friend._xDelete();
								}
								msg.save({messageState : "unread"}, {wait : true, patch : true});
							}
						}, function(e) {
							alert(e.__summary.msg);
						});
					} 
					// else if(msg.xGet("type") === "Project.Share.Reject"){
						// msg.save({messageState : "unread"}, {wait : true, patch : true});
						// var projectShareData = JSON.parse(msg.xGet("messageData"));
						// var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							// id : projectShareData.projectShareAuthorizationId
						// });
						// if (projectShareAuthorization.id){
							// projectShareAuthorization._xDelete();
						// }
						// if(projectShareData.shareAllSubProjects){
							// projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
								// var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
									// id : subProjectShareAuthorizationId
								// });
								// if (subProjectShareAuthorization.id){
									// subProjectShareAuthorization._xDelete();
								// }
							// });
						// }
					// } 
					else if(msg.xGet("type") === "Project.Share.Edit"){
						var projectShareData = JSON.parse(msg.xGet("messageData"));
						var editProjectShareAuthorizationArray = [];
						if(projectShareData.shareAllSubProjects){
							var projectShareIds = _.union([projectShareData.projectShareAuthorizationId], projectShareData.subProjectShareAuthorizationIds);
							Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareIds, function(collection){
								if(collection.length > 0){
									var projectShareAuthorization = collection.get(projectShareData.projectShareAuthorizationId);
									if(projectShareAuthorization.xGet("state") === "Accept"){
										projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
											var subProjectShareAuthorization = collection.get(subProjectShareAuthorizationId);
											if(subProjectShareAuthorization.xGet("state") === "Wait"){
												editProjectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
												subProjectShareAuthorization.save({state : "Accept"}, {wait : true, patch : true});
											}
										});
										Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
											msg.save({messageState : "unread"}, {wait : true, patch : true});
										}, function(e) {
											alert(e.__summary.msg);
										});
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
