Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedDepositeMsg = $.$attrs.selectedDepositeMsg;

$.convertSelectedFriend2UserModel = function(selectedFriendModel){
	if(selectedFriendModel){
		return selectedFriendModel.xGet("friendUser");
	}else{
		return null;
	}
}

$.convertUser2FriendModel = function(userModel){
	if(userModel){
		var friend = Alloy.createModel("Friend").xFindInDb({friendUserId : userModel.id});
		if(friend.id){
			return friend;
		}
	}
	return userModel;
}

var oldAmount;
var oldMoneyAccount;
var isRateExist;
var fistChangeFlag;

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		localAmount : 0,
		exchangeRate : 1,
		incomeType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyIncomeCategory : Alloy.Models.User.xGet("activeProject").xGet("depositeIncomeCategory"),
		ownerUser : Alloy.Models.User
	});

	$.setSaveableMode("add");
}

if ($.saveableMode === "read") {
	$.localAmount.setHeight(42);
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
	if($.saveableMode === "add"){
		oldAmount = 0
	}else{
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
		var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
			projectId : $.$model.xGet("project").xGet("id"),
			friendUserId : Alloy.Models.User.id
		});
		projectShareAuthorization.xSet("actualTotalIncome",projectShareAuthorization.xGet("actualTotalIncome") + newAmount);
		projectShareAuthorization.xAddToSave($);
		
		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
		}

		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
			if ($.$model.xGet("exchangeRate")) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrency : $.$model.xGet("localCurrency"),
					foreignCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
					rate : $.$model.xGet("exchangeRate"),
					ownerUser : Alloy.Models.User
				});
				exchange.xAddToSave($);
			}
		}

		var modelIsNew = $.$model.isNew();
		$.saveModel(function(e) {
			if (modelIsNew) {
				//记住当前分类为下次打开时的默认分类
				$.$model.xGet("project").setDefaultIncomeCategory($.$model.xGet("moneyIncomeCategory"));

				//记住当前账户为下次打开时的默认账户
				// Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				// Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
				//直接把activeMoneyAccountId保存到数据库，不经过validation，注意用 {patch : true, wait : true}
				if (Alloy.Models.User.xGet("activeMoneyAccount") !== $.$model.xGet("moneyAccount") || Alloy.Models.User.xGet("activeProject") !== $.$model.xGet("project")) {
					Alloy.Models.User.save({
						activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
						activeProjectId : $.$model.xGet("project").xGet("id")
					}, {
						patch : true,
						wait : true
					});
				}
			}
			if($.$model.xGet("friendUser").xGet("id") !== Alloy.Models.User.id){
				var date = (new Date()).toISOString();
				Alloy.Globals.Server.sendMsg({
					id : guid(),
					"toUserId" : selectedDepositeMsg.xGet("fromUser").xGet("id"),
					"fromUserId" : Alloy.Models.User.id,
					"type" : "Project.Deposite.Response",
					"messageState" : "unread",
					"messageTitle" : "充值回复",
					"date" : date,
					"detail" : $.$model.xGet("detail"),
					"messageBoxId" : selectedDepositeMsg.xGet("fromUser").xGet("messageBoxId"),
					messageData : selectedDepositeMsg.xGet("messageData")
				}, function() {
					saveEndCB(e);
				}, function(e) {
					alert(e.__summary.msg);
				});
			}else{
				saveEndCB(e);
			}
			
			
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			saveErrorCB(e);
		});
	}
}