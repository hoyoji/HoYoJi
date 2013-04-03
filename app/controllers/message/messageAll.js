Alloy.Globals.extendsBaseViewController($, arguments[0]);

//$.titleBar.bindXTable($.newMessagesTable);

function onFooterbarTap (e) {
	$.titleBar.setTitle(e.source.getTitle());
}

var newMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id,
	messageState : "new"
});
newMsgCollection = newMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	toUser : Alloy.Models.User,
	messageState : "new"
});
var noReadMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id,
	messageState : "noRead"
});
noReadMsgCollection = noReadMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	toUser : Alloy.Models.User,
	messageState : "noRead"
});
var readedMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id,
	messageState : "readed"
});
readedMsgCollection = readedMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	toUser : Alloy.Models.User,
	messageState : "readed"
});
var closedMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id,
	messageState : "closed"
});
closedMsgCollection = closedMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	toUser : Alloy.Models.User,
	messageState : "closed"
}); 
var sendedMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	fromUserId : Alloy.Models.User.id
});
sendedMsgCollection = sendedMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	fromUser : Alloy.Models.User
}); 
// var newMsgcollection = Alloy.Models.User.xGet("messageBox").xGet("messages").xCreateFilter(function(model){
	// return (model.xGet("messageState") === "new" || model.xGet("messageState") === "noRead") && model.xGet("toUserId") === Alloy.Models.User.id;
// });
// var closedMsgCollection = Alloy.Models.User.xGet("messageBox").xGet("messages").xCreateFilter(function(model){
	// return (model.xGet("messageState") === "closed" || model.xGet("messageState") === "readed") && model.xGet("toUserId") === Alloy.Models.User.id;
// });
// var sendedMsgcollection = Alloy.Models.User.xGet("messageBox").xGet("messages").xCreateFilter(function(model){
	// return model.xGet("fromUserId") === Alloy.Models.User.id;
// });
$.newMessagesTable.addCollection(newMsgCollection);
$.newMessagesTable.addCollection(noReadMsgCollection);
$.oldMessagesTable.addCollection(readedMsgCollection);
$.oldMessagesTable.addCollection(closedMsgCollection);
$.sendedMessagesTable.addCollection(sendedMsgCollection);
