Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.titleBar.bindXTable($.newMessagesTable);

// var newMsgcollection = Alloy.Models.User.xGet("messageBox").xGet("messages").xCreateFilter({messageBox : Alloy.Models.User.xGet("messageBox"),messageState : "new"});
var newMsgcollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "new"});
    newMsgcollection = newMsgcollection.xSetFilter({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "new"});
var readMsgcollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "read"});
	readMsgcollection = readMsgcollection.xSetFilter({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "read"});
var closeMsgCollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "close"});
	closeMsgCollection = closeMsgCollection.xSetFilter({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "close"});
var closedMsgCollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "closed"});
	closedMsgCollection = closedMsgCollection.xSetFilter({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "closed"});
$.newMessagesTable.addCollection(newMsgcollection);
$.newMessagesTable.addCollection(readMsgcollection);
$.oldMessagesTable.addCollection(closeMsgCollection);
$.oldMessagesTable.addCollection(closedMsgCollection);
