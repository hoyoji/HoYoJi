exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			ownerUserId : "TEXT NOT NULL"
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
		_.extend(Model.prototype, {
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
							msg.xSet("messageState","noRead");
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
						msg.xSave();
					}else if(msg.xGet("type") === "System.Friend.AutoAdd"){
						msg.xSet("messageState","noRead");
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
						msg.xSave();
					}else if(msg.xGet("type") === "System.Friend.Delete"){
						msg.xSet("messageState","noRead");
						var friends = Alloy.createCollection("Friend").xSearchInDb({
							friendUserId : msg.xGet("fromUserId"),
							ownerUserId : Alloy.Models.User.id
							});
					    var friendlength = friends.length;
						if (friendlength>0) {
							friends.at(0)._xDelete(function(){
								
							});
						}
						msg.xSave();
					}else if(msg.xGet("type") === "Project.Share.Reject"){
						msg.xSet("messageState","noRead");
						var projectShareData = JSON.parse(msg.get("messageData"));
						var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							id : projectShareData.projectShareAuthorizationId
						});
						if (projectShareAuthorization.xGet("id")){
							projectShareAuthorization._xDelete();
						}
						if(projectShareData.shareAllSubProjects){
							projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
								var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
									id : subProjectShareAuthorizationId
								});
								if (subProjectShareAuthorization.xGet("id")){
									subProjectShareAuthorization._xDelete();
								}
							});
						msg.xSave();
						}
					}
				});
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});
		return Collection;
	}
}
