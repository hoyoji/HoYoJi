Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.titleBar.bindXTable($.newMessagesTable);

// var collection = Alloy.createCollection("Message").xSetFilter({messageBox : Alloy.Models.User.xGet("messageBox")});
var collection = Alloy.Models.User.xGet("messageBox").xGet("messages").xCreateFilter({messageBox : Alloy.Models.User.xGet("messageBox")});
$.newMessagesTable.addCollection(collection);
