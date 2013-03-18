Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.titleBar.bindXTable($.messagesTable);

// var collection = Alloy.createCollection("Message").xSetFilter({messageBox : Alloy.Models.User.xGet("messageBox")});
var collection = Alloy.Models.User.xGet("messageBox").xGet("messages").xCreateFilter();
$.messagesTable.addCollection(collection);