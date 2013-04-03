Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.titleBar.bindXTable($.newMessagesTable);


var newMsgcollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id,
	messageState : "new"
});
newMsgcollection = newMsgcollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	toUser : Alloy.Models.User,
	messageState : "new"
});
var noReadMsgcollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id,
	messageState : "noRead"
});
noReadMsgcollection = noReadMsgcollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	toUser : Alloy.Models.User,
	messageState : "noRead"
});
var readedMsgcollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id,
	messageState : "readed"
});
readedMsgcollection = readedMsgcollection.xSetFilter({
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
sendedMsgCollection = closedMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	fromUser : Alloy.Models.User
}); 

$.newMessagesTable.addCollection(newMsgcollection);
$.newMessagesTable.addCollection(noReadMsgcollection);
$.oldMessagesTable.addCollection(readedMsgcollection);
$.oldMessagesTable.addCollection(closedMsgCollection);
$.sendedMessagesTable.addCollection(sendedMsgCollection);
