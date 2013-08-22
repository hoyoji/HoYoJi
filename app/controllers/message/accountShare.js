Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedAccount = $.$attrs.selectedAccount;
var datetime = new Date(selectedAccount.xGet("date"));

$.$model.xSet("fromUser", Alloy.Models.User);
$.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
$.$model.xSet("type", "Account.Share.AddRequest");
$.$model.xSet("messageState", "closed");
$.$model.xSet("messageTitle", Alloy.Models.User.xGet("userName"));

$.onWindowOpenDo(function() {
	//windowOpen的时候打开动态创建账务的信息
	if(selectedAccount.config.adapter.collection_name === "MoneyExpense"){
		
		$.$model.xSet("detail", "分享支出");
		//创建支出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("amount"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountExpenseTypeLabel = Ti.UI.createLabel({
			// text : "是否预付：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var accountExpenseTypeContentLabel = Ti.UI.createLabel({
			// text : selectedAccount.xGet("expenseType"),
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountExpenseTypeLabel);
		// accountRow3.add(accountExpenseTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("remark") || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
		
		$.accountDetails = [];
		selectedAccount.xGet("moneyExpenseDetails").map(function(moneyExpenseDetail){
			var moneyExpenseDetailArray = {};
			for (var attr in moneyExpenseDetail.config.columns) {
				moneyExpenseDetailArray[attr] = moneyExpenseDetail.xGet(attr);
			}
			$.accountDetails.push(moneyExpenseDetailArray);
		});
		
		
		
	}else if(selectedAccount.config.adapter.collection_name === "MoneyIncome"){
		$.$model.xSet("detail", "分享收入");
		//创建收入
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("amount"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountIncomeTypeLabel = Ti.UI.createLabel({
			// text : "是否预收：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			// text : selectedAccount.xGet("incomeType"),
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountIncomeTypeLabel);
		// accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("remark") || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
		
		$.accountDetails = [];
		selectedAccount.xGet("moneyIncomeDetails").map(function(moneyIncomeDetail){
			var moneyIncomeDetailArray = {};
			for (var attr in moneyIncomeDetail.config.columns) {
				moneyIncomeDetailArray[attr] = moneyIncomeDetail.xGet(attr);
			}
			$.accountDetails.push(moneyIncomeDetailArray);
		});
		
		
	}else if(selectedAccount.config.adapter.collection_name === "MoneyBorrow"){
		$.$model.xSet("detail", "分享借入");
		//创建借入
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("amount"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountIncomeTypeLabel = Ti.UI.createLabel({
			// text : "还款时间：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var returnDate = new Date(selectedAccount.xGet("returnDate"));
		// var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			// text : String.formatDate(returnDate, "medium") + " " + String.formatTime(returnDate, "medium"),
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountIncomeTypeLabel);
		// accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("remark") || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
	}else if(selectedAccount.config.adapter.collection_name === "MoneyLend"){
		$.$model.xSet("detail", "分享借出");
		//创建借出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("amount"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountIncomeTypeLabel = Ti.UI.createLabel({
			// text : "收款时间：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var paybackDate = new Date(selectedAccount.xGet("paybackDate"));
		// var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			// text : String.formatDate(paybackDate, "medium") + " " + String.formatTime(paybackDate, "medium"),
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountIncomeTypeLabel);
		// accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("remark") || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
	}else if(selectedAccount.config.adapter.collection_name === "MoneyPayback"){
		$.$model.xSet("detail", "分享收款");
		//创建收款
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("amount"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("remark") || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountDetailLabel);
		accountRow3.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
	}else if(selectedAccount.config.adapter.collection_name === "MoneyReturn"){
		$.$model.xSet("detail", "分享还款");
		//创建还款
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("amount"),
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : selectedAccount.xGet("remark") || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountDetailLabel);
		accountRow3.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
	}
	$.titleBar.dirtyCB();
});

$.onSave = function(saveEndCB, saveErrorCB) {
	//把账务发送给好友，所以好友不能为空
	if($.$model.xGet("toUser") && $.$model.xGet("toUser").xGet("id")){
		var date = (new Date()).toISOString();
		var account = {};
		for (var attr in selectedAccount.config.columns) {
			account[attr] = selectedAccount.xGet(attr);
		}
		$.$model.xSet("date", date);
		//如果发送的账务是支出或者收入，要把明细也一起放到JSON发给好友
		if(selectedAccount.config.adapter.collection_name === "MoneyExpense" || selectedAccount.config.adapter.collection_name === "MoneyIncome"){
			$.$model.xSet("messageData", JSON.stringify({
				accountType : selectedAccount.config.adapter.collection_name,
				account : account,
				currencyCode : selectedAccount.xGet("moneyAccount").xGet("currency").xGet("code"),
				accountDetails : $.accountDetails
			}));
		}else{
			$.$model.xSet("messageData", JSON.stringify({
				accountType : selectedAccount.config.adapter.collection_name,
				currencyCode : selectedAccount.xGet("moneyAccount").xGet("currency").xGet("code"),
				account : account
			}));
		}
		Alloy.Globals.Server.sendMsg({
			id : guid(),
			"toUserId" : $.$model.xGet("toUser").xGet("id"),
			"fromUserId" : Alloy.Models.User.id,
			"type" : "Account.Share.AddRequest",
			"messageState" : "unread",
			"messageTitle" : Alloy.Models.User.xGet("userName"),
			"date" : date,
			"detail" : $.$model.xGet("detail"),
			"messageBoxId" : $.$model.xGet("toUser").xGet("messageBoxId"),
			messageData : $.$model.xGet("messageData")
		}, function() {
			$.saveModel(saveEndCB, saveErrorCB);
			alert("发送成功");
		}, function(e) {
			alert(e.__summary.msg);
		});
	}else{
		saveErrorCB("请选择好友！");
	}
};
// function openFriendSelector(){
	// $.selectFriend.field.blur();
	// var attributes = {
	// selectorCallback : function(model) {
		// $.friend = model;
		// $.selectFriend.setValue(model.getDisplayName());
	// }
	// };
	// attributes.title = "好友";
	// attributes.selectModelType = "Friend";
	// attributes.selectModelCanBeNull = false;
	// attributes.selectedModel = $.friend;
// 	
	// Alloy.Globals.openWindow("friend/friendAll", attributes); 
// }

$.convertSelectedFriend2UserModel = function(selectedFriendModel){
	if(selectedFriendModel){
		return selectedFriendModel.xGet("friendUser");
	}else{
		return null;
	}
};

$.convertUser2FriendModel = function(userModel){
	if(userModel){
		var friend = Alloy.createModel("Friend").xFindInDb({friendUserId : userModel.id});
		if(friend.id){
			return friend;
		}
	}
	return userModel;
};

$.friend.UIInit($, $.getCurrentWindow());
$.requestContent.UIInit($, $.getCurrentWindow());
