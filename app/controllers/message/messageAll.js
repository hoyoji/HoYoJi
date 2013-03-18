Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.titleBar.bindXTable($.newMessagesTable);

// var collection = Alloy.createCollection("Message").xSetFilter({messageBox : Alloy.Models.User.xGet("messageBox")});
var collection = Alloy.Models.User.xGet("messageBox").xGet("messages").xCreateFilter({messageBox : Alloy.Models.User.xGet("messageBox")});
$.newMessagesTable.addCollection(collection);

var zIndex = 10;
function onFooterbarTap(e){
	if(e.source.id === "oldMessages"){
		$.oldMessagesTable.slideDown(zIndex++);
	} else {
		$.newMessagesTable.slideDown(zIndex++);
	}
}