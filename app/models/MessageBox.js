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
			collection_name : "MessageBox",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
			},
			processNewMessages : function(){
				this.xGet("messages").map(function(msg){
					console.info("------------=============================="+msg.xGet("messageState"));
					if(msg.xGet("messageState") === "new"){
						if(msg.xGet("type") === "System.Friend.AddResponse"){
								msg.xSet("messageState","read");
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
								console.info("------------====================-----------"+msg.xGet("fromUser").xGet("userName"));
							}
							msg.xSave();
						}else if(msg.xGet("type") === "System.Friend.AutoAdd"){
							msg.xSet("messageState","read");
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
								console.info("------------====================-----------"+msg.xGet("fromUser").xGet("userName"));
							}
							msg.xSave();
						}else if(msg.xGet("type") === "System.Friend.Delete"){
							msg.xSet("messageState","read");
							var friends = Alloy.createCollection("Friend").xSearchInDb({
								friendUserId : msg.xGet("fromUserId"),
								ownerUserId : Alloy.Models.User.id
								});
						    var friendlength = friends.length;
							if (friendlength>0) {
								// console.info("--------------*******------------------"+friends.at(0).xGet("friendUser").xGet("userName"));
								friends.at(0)._xDelete(function(){
									
								});
							}
							msg.xSave();
						}
					}
				});
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});
		return Collection;
	}
}
