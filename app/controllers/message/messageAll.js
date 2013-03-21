Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.titleBar.bindXTable($.newMessagesTable);

var newMsgcollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "new"});
    newMsgcollection = newMsgcollection.xSetFilter({messageBox : Alloy.Models.User.xGet("messageBox"),messageState : "new"});
var noReadMsgcollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "noRead"});
	noReadMsgcollection = noReadMsgcollection.xSetFilter({messageBox : Alloy.Models.User.xGet("messageBox"),messageState : "noRead"});
var readedMsgcollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "readed"});
	readedMsgcollection = readedMsgcollection.xSetFilter({messageBox : Alloy.Models.User.xGet("messageBox"),messageState : "readed"});
var closedMsgCollection = Alloy.createCollection("Message").xSearchInDb({messageBoxId : Alloy.Models.User.xGet("messageBoxId"),messageState : "closed"});
	closedMsgCollection = closedMsgCollection.xSetFilter({messageBox : Alloy.Models.User.xGet("messageBox"),messageState : "closed"});
$.newMessagesTable.addCollection(newMsgcollection);
$.newMessagesTable.addCollection(noReadMsgcollection);
$.oldMessagesTable.addCollection(readedMsgcollection);
$.oldMessagesTable.addCollection(closedMsgCollection);
