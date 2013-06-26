Alloy.Globals.extendsBaseFormController($, arguments[0]);

// $.contentScrollView.setOverScrollMode(Titanium.UI.Android.OVER_SCROLL_NEVER);

$.projectShareAuthorization = null;

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

function openFriendSelector(){
	$.friendUser.field.blur();
	var attributes = {
		selectedProject : $.$model.xGet("project"),
		closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
		selectorCallback : function(model) {
			$.projectShareAuthorization = model;
			$.$model.xSet("friendUser",$.projectShareAuthorization.xGet("friendUser"));
			$.friendUser.setValue($.projectShareAuthorization.getFriendDisplayName());
		}
	};
	attributes.title = "项目成员";
	attributes.selectModelType = "ProjectShareAuthorization";
	attributes.selectModelCanBeNull = false;
	attributes.selectedModel = $.projectShareAuthorization;
	Alloy.Globals.openWindow("project/projectShareAuthorizationAll", attributes);
}

var oldAmount;
var oldMoneyAccount;
var isRateExist;
var fistChangeFlag;

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyExpense", {
		date : (new Date()).toISOString(),
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeRate : 1,
		expenseType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyExpenseCategory : Alloy.Models.User.xGet("activeProject").xGet("depositeExpenseCategory"),
		ownerUser : Alloy.Models.User,
		expenseType : "Deposite"
	});
	$.setSaveableMode("add");
}else{
	$.friendUser.setValue($.$model.xGet("friendUser").getFriendDisplayName());
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
	});

	$.amount.field.addEventListener("singletap", function(e) {
		if ($.$model.xGet("moneyExpenseDetails").length > 0 && $.$model.xGet("useDetailsTotal")) {
			if (!fistChangeFlag) {
				fistChangeFlag = 1;
			}
		}
	});

	$.amount.beforeOpenKeyboard = function(confirmCB) {
		if (fistChangeFlag === 1) {
			Alloy.Globals.confirm("修改金额", "确定要修改并使用新金额？", function() {
				fistChangeFlag = 2;
				$.$model.xSet("useDetailsTotal", false);
				confirmCB();
			});

		} else {
			confirmCB();
		}
	}

	$.moneyExpenseCategory.beforeOpenModelSelector = function() {
		if (!$.$model.xGet("project")) {
			return "请先选择项目";
		}
	}
	oldMoneyAccount = $.$model.xGet("moneyAccount");
	
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
			var depositeExpenseCategory = $.project.getValue().xGet("depositeExpenseCategory");
			$.moneyExpenseCategory.setValue(depositeExpenseCategory);
			$.moneyExpenseCategory.field.fireEvent("change");
		}
	});

	// $.friend.field.addEventListener("change", function() {
		// if ($.friend.getValue()) {
			// $.friendAccount.$view.setHeight(42);
			// $.friendAccount.setValue("");
			// $.friendAccount.field.fireEvent("change");
		// } else {
			// $.friendAccount.$view.setHeight(0);
			// $.friendAccount.setValue("");
		// }
	// });
	// if (!$.friend.getValue()) {
		// $.friendAccount.$view.setHeight(0);
	// }

	$.onSave = function(saveEndCB, saveErrorCB) {
		if($.$model.xGet("friendUser") && $.$model.xGet("friendUser").xGet("id")){
			var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
			var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
			var newAmount = $.$model.xGet("amount");
			var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
			
			var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
				projectId : $.$model.xGet("project").xGet("id"),
				friendUserId : Alloy.Models.User.id
			});
			projectShareAuthorization.xSet("actualTotalExpense",projectShareAuthorization.xGet("actualTotalExpense") + newAmount);
			projectShareAuthorization.xAddToSave($);
			
			if (oldMoneyAccount === newMoneyAccount) {
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
				oldMoneyAccount.xAddToSave($);
			}
			$.$model.xGet("moneyExpenseDetails").map(function(item) {
				console.info("adding expense detail : " + item.xGet("name") + " " + item.xGet("amount"));
				if (item.__xDeleted) {
					item.xAddToDelete($);
				} else if (item.hasChanged()) {
					item.xAddToSave($);
				}
			});
	
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
					$.$model.xGet("project").setDefaultExpenseCategory($.$model.xGet("moneyExpenseCategory"));
					//记住当前账户为下次打开时的默认账户
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
				
				if($.$model.xGet("friendUser").xGet("id") === Alloy.Models.User.id){
					saveEndCB(e);
					var depositeIncome = Alloy.createModel("MoneyIncome", {
						date : $.$model.xGet("date"),
						amount : $.$model.xGet("amount"),
						remark : $.$model.xGet("remark"),
						ownerUser : Alloy.Models.User,
						localCurrency : Alloy.Models.User.xGet("activeCurrency"),
						exchangeRate : 1,
						incomeType : $.$model.xGet("expenseType"),
						moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
						project : $.$model.xGet("project"),
						moneyIncomeCategory : $.$model.xGet("project").xGet("depositeIncomeCategory"),
						friendUser : $.$model.xGet("friendUser")
					});
					var depositeIncomeController = Alloy.Globals.openWindow("money/projectIncomeForm", {
						$model : depositeIncome
					});
					depositeIncome.xAddToSave(depositeIncomeController.content);
					depositeIncomeController.content.titleBar.dirtyCB();
				}else{
					var date = (new Date()).toISOString();
					var account = {};
					for (var attr in $.$model.config.columns) {
						account[attr] = $.$model.xGet(attr);
					}
					Alloy.Globals.Server.sendMsg({
						id : guid(),
						"toUserId" : $.$model.xGet("friendUser").xGet("id"),
						"fromUserId" : Alloy.Models.User.id,
						"type" : "Project.Deposite.AddRequest",
						"messageState" : "unread",
						"messageTitle" : "充值请求",
						"date" : date,
						"detail" : $.$model.xGet("detail"),
						"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
						messageData : JSON.stringify({
										  accountType : "MoneyExpense",
										  account : account,
										  depositeProject : $.$model.xGet("project")
									  })
					}, function() {
						saveEndCB(e);
						alert("充值成功，请等待回复");
					}, function(e) {
						alert(e.__summary.msg);
					});
				}
				
				
				
				
			}, function(e) {
				newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
				oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
				saveErrorCB(e);
			});
		}else{
			saveErrorCB("请选择收款人！");
		}
		
	}
}
