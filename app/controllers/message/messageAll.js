Alloy.Globals.extendsBaseViewController($, arguments[0]);

//$.titleBar.bindXTable($.newMessagesTable);



// var newMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	// messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	// toUserId : Alloy.Models.User.id,
	// messageState : "new"
// });
// newMsgCollection = newMsgCollection.xSetFilter({
	// messageBox : Alloy.Models.User.xGet("messageBox"),
	// toUser : Alloy.Models.User,
	// messageState : "new"
// });
// var noReadMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	// messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	// toUserId : Alloy.Models.User.id,
	// messageState : "noRead"
// });
// noReadMsgCollection = noReadMsgCollection.xSetFilter({
	// messageBox : Alloy.Models.User.xGet("messageBox"),
	// toUser : Alloy.Models.User,
	// messageState : "noRead"
// });
// var readedMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	// messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	// toUserId : Alloy.Models.User.id,
	// messageState : "readed"
// });
// readedMsgCollection = readedMsgCollection.xSetFilter({
	// messageBox : Alloy.Models.User.xGet("messageBox"),
	// toUser : Alloy.Models.User,
	// messageState : "readed"
// });
// var closedMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	// messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	// toUserId : Alloy.Models.User.id,
	// messageState : "closed"
// });
// closedMsgCollection = closedMsgCollection.xSetFilter({
	// messageBox : Alloy.Models.User.xGet("messageBox"),
	// toUser : Alloy.Models.User,
	// messageState : "closed"
// }); 
var sendedMsgCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	fromUserId : Alloy.Models.User.id
});
sendedMsgCollection.xSetFilter({
	messageBox : Alloy.Models.User.xGet("messageBox"),
	fromUser : Alloy.Models.User
});


var receivedMessagesCollection = Alloy.createCollection("Message").xSearchInDb({
	messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
	toUserId : Alloy.Models.User.id
});
receivedMessagesCollection.xSetFilter(function(model){
	return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId")
			&& model.xGet("toUserId") === Alloy.Models.User.id)
});


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
	} else if (e.source.id === "newMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model){
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId")
					&& (model.xGet("messageState") === "new" || model.xGet("messageState") === "noRead")
					&& model.xGet("toUserId") === Alloy.Models.User.id)
		});
		receivedMessagesCollection.xSearchInDb(
			sqlAND(
				"messageBoxId".sqlEQ(Alloy.Models.User.xGet("messageBoxId")),
				sqlOR("messageState".sqlEQ("new"), "messageState".sqlEQ("noRead")),
				"toUserId".sqlEQ(Alloy.Models.User.id)
			)
		);
	} else if (e.source.id === "oldMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model){
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId")
					&& (model.xGet("messageState") === "readed" || model.xGet("messageState") === "closed")
					&& model.xGet("toUserId") === Alloy.Models.User.id)
		});
		receivedMessagesCollection.xSearchInDb(
			sqlAND(
				"messageBoxId".sqlEQ(Alloy.Models.User.xGet("messageBoxId")),
				sqlOR("messageState".sqlEQ("readed"), "messageState".sqlEQ("closed")),
				"toUserId".sqlEQ(Alloy.Models.User.id)
			)
		);
	}
}
// $.newMessagesTable.addCollection(newMsgCollection);
// $.newMessagesTable.addCollection(noReadMsgCollection);
// $.oldMessagesTable.addCollection(readedMsgCollection);
// $.oldMessagesTable.addCollection(closedMsgCollection);
$.receivedMessagesTable.addCollection(receivedMessagesCollection);
$.sendedMessagesTable.addCollection(sendedMsgCollection);
