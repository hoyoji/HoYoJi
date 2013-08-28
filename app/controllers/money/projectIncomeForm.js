Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedDepositeMsg = $.$attrs.selectedDepositeMsg;
var depositeExchangeRate = $.$attrs.depositeExchangeRate;
var depositeAmount = $.$attrs.depositeAmount;
$.exchangeRate.rightButton.addEventListener("singletap", function(e) {
	if (!$.$model.xGet("moneyAccount")) {
		alert("请选择账户");
		return;
	}
	if (!$.$model.xGet("project")) {
		alert("请选择项目");
		return;
	}
	Alloy.Globals.Server.getExchangeRate($.$model.xGet("moneyAccount").xGet("currency").id, $.$model.xGet("project").xGet("currency").id, function(rate) {
		$.exchangeRate.setValue(rate);
		$.exchangeRate.field.fireEvent("change");

		if ($.$model.xGet("friendUser").xGet("id") !== Alloy.Models.User.id) {
			$.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / rate);
			$.amount.refresh();
		}
	}, function(e) {
		alert(e.__summary.msg);
	});
});

$.convertSelectedFriend2UserModel = function(selectedFriendModel) {
	if (selectedFriendModel) {
		return selectedFriendModel.xGet("friendUser");
	} else {
		return null;
	}
};

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
};

var loading;//防止多次点击row后多次执行$.beforeProjectSelectorCallback生成多条汇率
$.beforeMoneyAccountSelectorCallback = function(moneyAccount, successCallback) {
	if (moneyAccount.xGet("currency") !== Alloy.Models.User.xGet("activeCurrency")) {
		if (Alloy.Models.User.xGet("activeCurrency").getExchanges(moneyAccount.xGet("currency")).length === 0 && !loading) {
			loading = true;
			Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("activeCurrency").id, moneyAccount.xGet("currency").id, function(rate) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
					foreignCurrencyId : moneyAccount.xGet("currencyId"),
					rate : rate
				});
				exchange.xSet("ownerUser", Alloy.Models.User);
				exchange.xSet("ownerUserId", Alloy.Models.User.id);
				exchange.save();
				//改变账户后要更新金额
				$.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / rate);
				$.amount.refresh();
				successCallback();
				loading = false;
			}, function(e) {
				alert("无法获取该项目与用户本币的转换汇率，请手动增加该汇率");
			});
		} else {
			successCallback();
		}
	} else {
		successCallback();
	}
};

var oldAmount;
var oldMoneyAccount;
var isRateExist;
var fistChangeFlag;

if ($.saveableMode === "read") {
	// $.localAmountContainer.setHeight(42);
	if ($.$model.xGet("ownerUserId") === Alloy.Models.User.id) {
		$.moneyAccount.$view.setHeight(42);
		$.exchangeRate.$view.setHeight(42);
	} else {
		$.moneyAccount.$view.setHeight(0);
		$.localAmountContainer.setHeight(42);
		$.amount.$view.setHeight(0);
		$.ownerUser.setHeight(42);
	}

} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model.xGet("project"), true);
			if ($.$model.xGet("friendUser").xGet("id") !== Alloy.Models.User.id) {
				if ($.$model.xGet("exchangeRate") === null) {
					alert("请更新汇率查看金额");
				} else {
					$.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / $.$model.xGet("exchangeRate"));
					$.amount.refresh();
				}
			}
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	});

	$.moneyIncomeCategory.beforeOpenModelSelector = function() {
		if (!$.$model.xGet("project")) {
			return "请先选择项目";
		}
	};
	oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	if ($.saveableMode === "add") {
		oldAmount = 0;
	} else {
		oldAmount = $.$model.xGet("amount");
	}

	function updateExchangeRate(e) {
		if ($.moneyAccount.getValue() && $.project.getValue()) {
			setExchangeRate($.moneyAccount.getValue(), $.project.getValue());
		}
	}


	$.moneyAccount.field.addEventListener("change", updateExchangeRate);
	
	$.exchangeRate.field.addEventListener("change", function(){
		$.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / $.$model.xGet("exchangeRate"));
		$.amount.refresh();
	});

	function setExchangeRate(moneyAccount, project, setToModel) {
		var exchangeRateValue;
		if (moneyAccount.xGet("currency") === project.xGet("currency")) {
			isRateExist = true;
			exchangeRateValue = 1;
			$.exchangeRate.$view.setHeight(0);
		} else {
			var exchanges = moneyAccount.xGet("currency").getExchanges(project.xGet("currency"));
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
			$.$model.xSet("exchangeRate", exchangeRateValue);
			$.exchangeRate.refresh();
			//改变汇率更新金额
			$.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / exchangeRateValue);
			$.amount.refresh();
		} else {
			$.exchangeRate.setValue(exchangeRateValue);
			$.exchangeRate.field.fireEvent("change");
		}
	}

	// $.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
	// if ($.project.getValue()) {
	// var defaultIncomeCategory = $.project.getValue().xGet("defaultIncomeCategory");
	// $.moneyIncomeCategory.setValue(defaultIncomeCategory);
	// $.moneyIncomeCategory.field.fireEvent("change");
	// }
	// });

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
		//查找共享给我的projectShareAuthorization
		if ($.$model.xGet("exchangeRate")) {
			var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
				projectId : $.$model.xGet("project").xGet("id"),
				friendUserId : Alloy.Models.User.id
			});
			projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") + newAmount * $.$model.xGet("exchangeRate"));
			// projectShareAuthorization.xSet("apportionedTotalExpense", projectShareAuthorization.xGet("apportionedTotalExpense") + newAmount);
			projectShareAuthorization.xAddToSave($);
			editData.push(projectShareAuthorization.toJSON());

			if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
				newMoneyAccount.xAddToSave($);
				editData.push(newMoneyAccount.toJSON());
			} else {//账户改变时
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
				oldMoneyAccount.xAddToSave($);
				newMoneyAccount.xAddToSave($);
				editData.push(newMoneyAccount.toJSON());
				editData.push(oldMoneyAccount.toJSON());
			}
			
			if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
				if ($.$model.xGet("exchangeRate")) {
					var exchange = Alloy.createModel("Exchange").xFindInDb({
						localCurrencyId : $.$model.xGet("moneyAccount").xGet("currency"),
						foreignCurrencyId : $.$model.xGet("project").xGet("currency")
					});

					if (!exchange.id) {
						var exchange = Alloy.createModel("Exchange", {
							localCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
							foreignCurrency : $.$model.xGet("project").xGet("currency"),
							rate : $.$model.xGet("exchangeRate"),
							ownerUser : Alloy.Models.User
						});
						exchange.xSave();
						addData.push(exchange.toJSON());
					}
				}
			}
			if(Alloy.Models.User.xGet("activeCurrencyId") !== $.$model.xGet("moneyAccount").xGet("currencyId")){
				var activeToProjectExchange = Alloy.createModel("Exchange").xFindInDb({
					localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
					foreignCurrencyId : $.$model.xGet("project").xGet("currencyId")
				});
				if (!activeToProjectExchange.id) {
					Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("activeCurrencyId") , $.$model.xGet("project").xGet("currencyId"), function(rate) {
	
						activeToProjectExchange = Alloy.createModel("Exchange", {
							localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
							foreignCurrencyId : $.$model.xGet("project").xGet("currencyId"),
							rate : rate
						});
						activeToProjectExchange.xSet("ownerUser", Alloy.Models.User);
						activeToProjectExchange.xSet("ownerUserId", Alloy.Models.User.id);
						activeToProjectExchange.save();
						addData.push(activeToProjectExchange.toJSON());
					}, function(e) {
						errorCB(e.__summary.msg);
					});
	
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
					// var db = Ti.Database.open("hoyoji");
					// var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					// db.execute(sql, [selectedDepositeMsg.xGet("id")]);
					// db.close();
					selectedDepositeMsg.xSet("messageState", "closed");
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
								// saveEndCB(e);
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
				addData.push($.$model.toJSON());
				Alloy.Globals.Server.postData(addData, function(data) {
					Alloy.Globals.Server.putData(editData, function(data) {
						$.saveModel(saveEndCB, saveErrorCB, {
							syncFromServer : true
						});
					}, function(e) {
						alert(e.__summary.msg);
					});
				}, function(e) {
					alert(e.__summary.msg);
				});
			}
		}else{
			alert("不能保存，汇率不能为空");
		}
	};
}

$.picture.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyIncomeCategory.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.exchangeRate.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
