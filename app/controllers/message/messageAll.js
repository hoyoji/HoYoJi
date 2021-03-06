Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.receivedMessagesTable.UIInit($, $.getCurrentWindow());

var receivedMessagesCollection = Alloy.createCollection("Message");
// .xSearchInDb({
// messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
// toUserId : Alloy.Models.User.id
// });
receivedMessagesCollection.xSetFilter(function(model) {
	return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId") && model.xGet("toUserId") === Alloy.Models.User.id);
}, $);
$.receivedMessagesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB) {
	receivedMessagesCollection.xSearchInDb({
		messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
		toUserId : Alloy.Models.User.id
	}, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	successCB();
};

$.footerBar.beforeOpenSubFooterBar = function(buttonWidget, callback) {
	if ($.footerBar.currentSlide && $.footerBar.currentSlide.$view.id !== buttonWidget.id) {
		return;
	}
	callback();
};

var inBoxTitle = "收件箱";
function onFooterbarTap(e) {
	if (e.source.id === "sendedMessagesTable") {
		if (!$.sendedMessagesTable) {
			$.sendedMessagesTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
				id : "sendedMessagesTable",
				bottom : "0",
				top : "0",
				sortByField : "date",
				sortReverse : "true",
				groupByField : "date",
				pageSize : 10,
				autoInit : "false",
				parentController : $,
				currentWindow : $.__currentWindow
			});
			$.sendedMessagesTable.setParent($.body);
			$.sendedMessagesTable.UIInit();
			$.sendedMessagesTable.autoHideFooter($.footerBar);

			var sendedMsgCollection = Alloy.createCollection("Message");
			// .xSearchInDb({
			// messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
			// fromUserId : Alloy.Models.User.id
			// });
			sendedMsgCollection.xSetFilter({
				messageBox : Alloy.Models.User.xGet("messageBox"),
				fromUser : Alloy.Models.User
			}, $);
			$.receivedMessagesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB) {
				receivedMessagesCollection.xSearchInDb({
					messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
					fromUserId : Alloy.Models.User.id
				}, {
					offset : offset,
					limit : limit,
					orderBy : orderBy
				});
				successCB();
			};
			$.sendedMessagesTable.addCollection(sendedMsgCollection);
			$.sendedMessagesTable.autoHideFooter($.footerBar);
			$.sendedMessagesTable.fetchNextPage();
		}

		$.titleBar.setTitle(e.source.getTitle());
	} else if (e.source.id === "receivedMessagesTable") {
		$.titleBar.setTitle(inBoxTitle);
	} else {
		if (e.source.id === "allMessagesTable") {
			inBoxTitle = "收件箱";
		} else {
			inBoxTitle = e.source.getTitle();
		}
		$.titleBar.setTitle(inBoxTitle);
	}
	if (e.source.id === "allMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model) {
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId") && model.xGet("toUserId") === Alloy.Models.User.id);
		});
		// receivedMessagesCollection.xSearchInDb({
			// messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
			// toUserId : Alloy.Models.User.id
		// });
		$.receivedMessagesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB) {
			receivedMessagesCollection.xSearchInDb({
				messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
				toUserId : Alloy.Models.User.id
			}, {
				offset : offset,
				limit : limit,
				orderBy : orderBy
			});
			successCB();
		};		
		$.receivedMessagesTable.fetchFirstPage();
	} else if (e.source.id === "newMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model) {
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId") && (model.xGet("messageState") === "new" || model.xGet("messageState") === "unread") && model.xGet("toUserId") === Alloy.Models.User.id);
		});
		$.receivedMessagesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB) {
			receivedMessagesCollection.xSearchInDb(sqlAND("messageBoxId".sqlEQ(Alloy.Models.User.xGet("messageBoxId")), sqlOR("messageState".sqlEQ("new"), "messageState".sqlEQ("unread")), "toUserId".sqlEQ(Alloy.Models.User.id))
		, {
				offset : offset,
				limit : limit,
				orderBy : orderBy
			});
			successCB();
		};	
		$.receivedMessagesTable.fetchFirstPage();
	} else if (e.source.id === "oldMessagesTable") {
		receivedMessagesCollection.xSetFilter(function(model) {
			return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId") && (model.xGet("messageState") === "read" || model.xGet("messageState") === "closed") && model.xGet("toUserId") === Alloy.Models.User.id);
		});
		$.receivedMessagesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB) {
			receivedMessagesCollection.xSearchInDb(sqlAND("messageBoxId".sqlEQ(Alloy.Models.User.xGet("messageBoxId")), sqlOR("messageState".sqlEQ("read"), "messageState".sqlEQ("closed")), "toUserId".sqlEQ(Alloy.Models.User.id))
		, {
				offset : offset,
				limit : limit,
				orderBy : orderBy
			});
			successCB();
		};
		$.receivedMessagesTable.fetchFirstPage();
	}
}

// var refreshButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
// id : "refreshkButton",
// left : 5,
// height : Ti.UI.FILL,
// width : 45,
// image : "/images/home/sync"
// });
// refreshButton.addEventListener("singletap", function(e){
// e.cancelBubble = true;
// Alloy.Globals.Server.sync();
// });
// $.titleBar.setBackButton(refreshButton);
//
// function refreshSyncCount(){
// var syncCount = Alloy.Globals.getClientSyncCount();
// refreshButton.setBubbleCount(syncCount);
// }
// refreshSyncCount();
// Ti.App.addEventListener("updateSyncCount", refreshSyncCount);
// $.onWindowCloseDo(function(){
// Ti.App.removeEventListener("updateSyncCount", refreshSyncCount);
// });

$.receivedMessagesTable.addCollection(receivedMessagesCollection);
$.receivedMessagesTable.autoHideFooter($.footerBar);
$.receivedMessagesTable.fetchNextPage();

$.titleBar.UIInit($, $.getCurrentWindow());
