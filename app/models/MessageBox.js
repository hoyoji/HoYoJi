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
					}
					else if(msg.xGet("type") === "System.Friend.AutoAdd"){
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
					}
					else if(msg.xGet("type") === "System.Friend.Delete"){
						msg.xSet("messageState","noRead");
						var friend = Alloy.createModel("Friend").xFindInDb({
							friendUserId : msg.xGet("fromUserId"),
							ownerUserId : Alloy.Models.User.id
							});
						console.info("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||out"+friend.xGet("id"));
					    if (friend.xGet("id")) {
						console.info("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||in");
							friend._xDelete();
						}
						msg.xSave();
					}
					else if(msg.xGet("type") === "Project.Share.Reject"){
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
					else if(msg.xGet("type") === "Project.Share.Edit"){
						msg.xSet("messageState","noRead");
						var projectShareData = JSON.parse(msg.get("messageData"));
						if(projectShareData.shareAllSubProjects){
							projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
								var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
									id : subProjectShareAuthorizationId
								});
								if (subProjectShareAuthorization.xGet("id")){
									var subProject = Alloy.createModel("Project", {
										ownerUser : Alloy.Models.User,
										name :　subProjectShareAuthorization.xGet("project").xGet("name"),
										projectSharedBy : subProjectShareAuthorization
									}); 
									
									var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
										name : "日常收入",
										project : subProject
									});
									subProject.xSet("defaultIncomeCategory", defaultIncomeCategory);
								
									var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
										name : "日常支出",
										project : subProject
									});
									subProject.xSet("defaultExpenseCategory", defaultExpenseCategory);
									defaultIncomeCategory.xSave();
									defaultExpenseCategory.xSave();
									subProject.xSave();
								}
							});
						}else{
							projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
								var subProject = Alloy.createModel("Project").xFindInDb({
									projectSharedById : subProjectShareAuthorizationId
								});
								if(subProject.xGet("id")){
									subProject.xGet("defaultExpenseCategory").destroy();
									subProject.xGet("defaultIncomeCategory").destroy();
									subProject.destroy();
								}
							});
						}
						msg.xSave();
					}
					else if(msg.xGet("type") === "Project.Share.Delete"){
						msg.xSet("messageState","noRead");
						var projectShareData = JSON.parse(msg.get("messageData"));
						var project = Alloy.createModel("Project").xFindInDb({
							projectSharedById : projectShareData.projectShareAuthorizationId
						});
						if(project.xGet("id")){
							project.xGet("projectSharedBy",null);
							project.xGet("defaultExpenseCategory").destroy();
							project.xGet("defaultIncomeCategory").destroy();
							project.destroy();
						}
						if(projectShareData.shareAllSubProjects){
							projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
								var subProject = Alloy.createModel("Project").xFindInDb({
									projectSharedById : subProjectShareAuthorizationId
								});
								if(subProject.xGet("id")){
									subProject.xGet("projectSharedBy",null);
									subProject.xGet("defaultExpenseCategory").destroy();
									subProject.xGet("defaultIncomeCategory").destroy();
									subProject.destroy();
								}
							});
						}
						msg.xSave();
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
