Alloy.Globals.extendsBaseFormController($, arguments[0]);

var onFooterbarTap = function(e) {
	$.titleBar.save();
}

$.onWindowOpenDo(function() {
	if ($.$model.xGet('messageState') !== "closed") {
		// var friendlength = Alloy.createCollection("Friend").xSearchInDb({
		// friendUserId : $.$model.xGet("fromUser").xGet("id"),
		// friendCategoryId : Alloy.Models.User.xGet("defaultFriendCategory").xGet("id")
		// }).length;

		Alloy.Globals.Server.getData([{
			__dataType : "Friend",
			friendUserId : $.$model.xGet("fromUserId"),
			friendCategoryId : Alloy.Models.User.xGet("defaultFriendCategory").xGet("id")
		}], function(data) {
			if (data[0].length > 0) {
				$.$model.xSet('messageState', "closed");
				$.$model.xSave();
				$.footerBar.$view.hide();
			}
		}, function(e) {
			alert(e.__summary.msg);
		});
	}
	if ($.$model.xGet('messageState') === "unread") {
		$.$model.xSet('messageState', "closed");
		$.$model.xSave();
		$.footerBar.$view.hide();
	}
	if ($.$model.xGet('messageState') === "closed") {
		$.footerBar.$view.hide();
	}
	if ($.$model.xGet('messageState') === "new") {
		$.$model.xSet('messageState', "read");
		$.$model.xSave();
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	var accountShareData = JSON.parse($.$model.xGet("messageData"));
	if(accountShareData.accountType === "MoneyExpense"){
		var moneyExpense = Alloy.createModel("MoneyExpense",{date : accountShareData.account.date , amount : accountShareData.account.amount , remark : accountShareData.account.remark , ownerUser : $.$model}).xAddToSave($);
	}
	$.saveModel(saveEndCB, saveErrorCB);
}
