Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedDepositeMsg = $.$attrs.selectedDepositeMsg;

$.convertSelectedFriend2UserModel = function(selectedFriendModel) {
	if (selectedFriendModel) {
		return selectedFriendModel.xGet("friendUser");
	} else {
		return null;
	}
}

$.convertUser2FriendModel = function(userModel) {
	if (userModel) {
		var friend = Alloy.createModel("Friend").xFindInDb({
			friendUserId : userModel.id
		});
		if (friend.id) {
			return friend;
		}
	}
	return userModel;
}
var oldAmount;
var oldMoneyAccount;
var isRateExist;
var fistChangeFlag;

if ($.saveableMode === "read") {
	// $.localAmountContainer.setHeight(42);
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
	$.moneyAccount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("localCurrency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	});

	$.moneyIncomeCategory.beforeOpenModelSelector = function() {
		if (!$.$model.xGet("project")) {
			return "请先选择项目";
		}
	}
	oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	if ($.saveableMode === "add") {
		oldAmount = 0
	} else {
		oldAmount = $.$model.xGet("amount")
	}

	function updateExchangeRate(e) {
		if ($.moneyAccount.getValue()) {
			setExchangeRate($.moneyAccount.getValue(), $.$model);
		}
	}


	$.moneyAccount.field.addEventListener("change", updateExchangeRate);

	function setExchangeRate(moneyAccount, model, setToModel) {
		var exchangeRateValue;
		if (moneyAccount.xGet("currency") === model.xGet("localCurrency")) {
			isRateExist = true;
			exchangeRateValue = 1;
			$.exchangeRate.$view.setHeight(0);
		} else {
			var exchanges = model.xGet("localCurrency").getExchanges(moneyAccount.xGet("currency"));
			if (exchanges.length) {
				isRateExist = true;
				exchangeRateValue = exchanges.at(0).xGet("rate");
			} else {
				isRateExist = false;
				exchangeRateValue = null;
			}
			$.exchangeRate.$view.setHeight(42);
		}
		if (setToModel) {
			model.xSet("exchangeRate", exchangeRateValue);
		} else {
			$.exchangeRate.setValue(exchangeRateValue);
			$.exchangeRate.field.fireEvent("change");
		}
	}


	$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
		if ($.project.getValue()) {
			var defaultIncomeCategory = $.project.getValue().xGet("defaultIncomeCategory");
			$.moneyIncomeCategory.setValue(defaultIncomeCategory);
			$.moneyIncomeCategory.field.fireEvent("change");
		}
	});

	$.friend.field.addEventListener("change", function() {
		if ($.friend.getValue()) {
			$.friendAccount.$view.setHeight(42);
			$.friendAccount.setValue("");
			$.friendAccount.field.fireEvent("change");
		} else {
			$.friendAccount.$view.setHeight(0);
			$.friendAccount.setValue("");
		}
	});
	if (!$.friend.getValue()) {
		$.friendAccount.$view.setHeight(0);
	}

	$.onSave = function(saveEndCB, saveErrorCB) {
		var editData = [];
		var addData = [];
		var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		
		var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
			projectId : $.$model.xGet("project").xGet("id"),
			friendUserId : Alloy.Models.User.id
		});
		projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") + newAmount);
		// projectShareAuthorization.xSet("apportionedTotalExpense", projectShareAuthorization.xGet("apportionedTotalExpense") + newAmount);
		projectShareAuthorization.xAddToSave($);
		editData.push(projectShareAuthorization.toJSON());

		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
		}
		editData.push(newMoneyAccount.toJSON());
		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
			if ($.$model.xGet("exchangeRate")) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrency : $.$model.xGet("localCurrency"),
					foreignCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
					rate : $.$model.xGet("exchangeRate"),
					ownerUser : Alloy.Models.User
				});
				exchange.xAddToSave($);
				addData.push(exchange.toJSON());
			}
		}

		if ($.$model.xGet("friendUser").xGet("id") !== Alloy.Models.User.id) {
			var date = (new Date()).toISOString();
			Alloy.Globals.Server.sendMsg({
				id : guid(),
				"toUserId" : selectedDepositeMsg.xGet("fromUser").xGet("id"),
				"fromUserId" : Alloy.Models.User.id,
				"type" : "Project.Deposite.Response",
				"messageState" : "new",
				"messageTitle" : "充值回复",
				"date" : date,
				"detail" : "好友" + Alloy.Models.User.xGet("userName") + "接受了您的充值",
				"messageBoxId" : selectedDepositeMsg.xGet("fromUser").xGet("messageBoxId"),
				messageData : selectedDepositeMsg.xGet("messageData")
			}, function() {
				selectedDepositeMsg.xSet("messageState","closed");
				selectedDepositeMsg.xAddToSave($);
				editData.push(selectedDepositeMsg.toJSON());
				// selectedDepositeMsg.save({
					// messageState : "closed"
				// }, {
					// wait : true,
					// patch : true
				// });
				addData.push($.$model.toJSON());
				Alloy.Globals.Server.postData(addData, function(data) {
					Alloy.Globals.Server.putData(editData, function(data) {
						Alloy.Globals.Server.loadData("MoneyExpense", [$.$model.xGet("depositeId")], function(collection) {
							$.saveModel(saveEndCB, saveErrorCB, {
								syncFromServer : true
							});
							saveEndCB(e);
						}, saveErrorCB);
					}, function(e) {
						alert(e.__summary.msg);
					});
				}, function(e) {
					alert(e.__summary.msg);
				});
			}, function(e) {
				alert(e.__summary.msg);
			});
		} else {
			saveEndCB(e);
		}
	}
}

$.picture.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyIncomeCategory.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow()); 
