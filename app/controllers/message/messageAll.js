Alloy.Globals.extendsBaseViewController($, arguments[0]);

var sendedMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	fromUserId : Alloy.Models.User.id
});
sendedMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	fromUser : Alloy.Models.User
}, $);


var receivedMessagesCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id
});
receivedMessagesCollection.xSetFilter(function(model){
	return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId")
			&& model.xGet("toUserId") === Alloy.Models.User.id)
}, $);

$.footerBar.beforeOpenSubFooterBar = function(buttonWidget, callback){
	if($.footerBar.currentSlide
		&& $.footerBar.currentSlide.$view.id !== buttonWidget.id){
		return;
	}
	callback();
}

function onFooterbarTap (e) {
	$.titleBar.setTitle(e.source.getTitle());
	if (e.source.id === "receivedMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model){
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId")
			&& model.xGet("toUserId") === Alloy.Models.User.id)
		});
		receivedMessagesCollection.xSearchInDb({
			messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
			toUserId : Alloy.Models.User.id
		});
	} 
	else if (e.source.id === "newMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model){
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId")
					&& (model.xGet("messageState") === "new" || model.xGet("messageState") === "unread")
					&& model.xGet("toUserId") === Alloy.Models.User.id)
		});
		receivedMessagesCollection.xSearchInDb(
			sqlAND(
				"messageBoxId".sqlEQ(Alloy.Models.User.xGet("messageBoxId")),
				sqlOR("messageState".sqlEQ("new"), "messageState".sqlEQ("unread")),
				"toUserId".sqlEQ(Alloy.Models.User.id)
			)
		);
	} else if (e.source.id === "oldMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model){
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId")
					&& (model.xGet("messageState") === "read" || model.xGet("messageState") === "closed")
					&& model.xGet("toUserId") === Alloy.Models.User.id)
		});
		receivedMessagesCollection.xSearchInDb(
			sqlAND(
				"messageBoxId".sqlEQ(Alloy.Models.User.xGet("messageBoxId")),
				sqlOR("messageState".sqlEQ("read"), "messageState".sqlEQ("closed")),
				"toUserId".sqlEQ(Alloy.Models.User.id)
			)
		);
	}
}

$.receivedMessagesTable.addCollection(receivedMessagesCollection);
$.sendedMessagesTable.addCollection(sendedMsgCollection);
