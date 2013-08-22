Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.projectShareAuthorization = null;
$.depositeFriendAccount = null;

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
	}, function(e) {
		alert(e);
	});
});

$.depositeAccountExchangeRate.rightButton.addEventListener("singletap", function(e) {
	if (!$.depositeFriendAccount) {
		alert("请选择存入账户");
		return;
	}
	if (!$.$model.xGet("project")) {
		alert("请选择项目");
		return;
	}
	Alloy.Globals.Server.getExchangeRate($.depositeFriendAccount.xGet("currency").id, $.$model.xGet("project").xGet("currency").id, function(rate) {
		$.depositeAccountExchangeRate.setValue(rate);
		$.depositeAccountExchangeRate.field.fireEvent("change");
	}, function(e) {
		alert(e);
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
$.beforeProjectSelectorCallback = function(project, successCallback) {
	if (project.xGet("currency") !== Alloy.Models.User.xGet("activeCurrency")) {
		if (Alloy.Models.User.xGet("activeCurrency").getExchanges(project.xGet("currency")).length === 0 && !loading) {
			loading = true;
			Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("activeCurrency").id, project.xGet("currency").id, function(rate) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
					foreignCurrencyId : project.xGet("currencyId"),
					rate : rate
				});
				exchange.xSet("ownerUser", Alloy.Models.User);
				exchange.xSet("ownerUserId", Alloy.Models.User.id);
				exchange.save();
				successCallback();
				loading = false;
			}, function(e) {
				alert("连接汇率服务器错误，无法获取该项目与用户本币的转换汇率，请手动增加该汇率");
			});
		} else {
			successCallback();
		}
	} else {
		successCallback();
	}
};

function openFriendSelector() {
	// $.friendUser.field.blur();
	var attributes = {
		selectedProject : $.$model.xGet("project"),
		closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
		selectorCallback : function(model) {
			$.projectShareAuthorization = model;
			$.$model.xSet("friendUser", $.projectShareAuthorization.xGet("friendUser"));
			$.friendUser.setValue($.projectShareAuthorization.getFriendDisplayName());

			if ($.$model.xGet("friendUser").xGet("id") === Alloy.Models.User.id) {
				$.depositeAccount.$view.setHeight(42);
			} else {
				$.depositeAccount.$view.setHeight(0);
			}
		}
	};
	attributes.title = "项目成员";
	attributes.selectModelType = "ProjectShareAuthorization";
	attributes.selectModelCanBeNull = false;
	attributes.selectedModel = $.projectShareAuthorization;
	Alloy.Globals.openWindow("project/projectShareAuthorizationAll", attributes);
}

function openDepositeAccountSelector() {
	var attributes = {
		closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
		selectorCallback : function(model) {
			$.depositeFriendAccount = model;
			$.depositeAccount.setValue($.depositeFriendAccount.getAccountNameCurrency());
			updateDepositeExchangeRate();
		}
	};
	attributes.title = "账户";
	attributes.selectModelType = "MoneyAccount";
	attributes.selectModelCanBeNull = false;
	attributes.selectedModel = $.depositeFriendAccount;
	Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll", attributes);
}

var oldAmount;
var oldMoneyAccount;
var isRateExist;
var isDepositeRateExist;
var fistChangeFlag;

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyExpense", {
		date : (new Date()).toISOString(),
		exchangeRate : 1,
		expenseType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyExpenseCategory : Alloy.Models.User.xGet("activeProject").xGet("depositeExpenseCategory"),
		ownerUser : Alloy.Models.User,
		expenseType : "Deposite"
	});
	$.setSaveableMode("add");
}
// else {
// $.friendUser.setValue($.$model.xGet("friendUser").getFriendDisplayName());
// }

if ($.saveableMode === "read") {
	if ($.$model.xGet("ownerUserId") === Alloy.Models.User.id) {
		$.moneyAccount.$view.setHeight(42);
		$.exchangeRate.$view.setHeight(42);
	} else {
		$.localAmountContainer.setHeight(42);
		$.amount.$view.setHeight(0);
		$.moneyAccount.$view.setHeight(0);
		$.ownerUser.setHeight(42);
	}
	$.friendUser.setValue($.$model.xGet("friendUser").getFriendDisplayName());
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model.xGet("project"), true);
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
				$.exchangeRate.$view.setHeight(42);
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
	};

	$.moneyExpenseCategory.beforeOpenModelSelector = function() {
		if (!$.$model.xGet("project")) {
			return "请先选择项目";
		}
	};
	oldMoneyAccount = $.$model.xGet("moneyAccount");

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
		} else {
			$.exchangeRate.setValue(exchangeRateValue);
			$.exchangeRate.field.fireEvent("change");
		}
	}

	function updateDepositeExchangeRate(e) {
		if ($.depositeAccount.getValue() && $.project.getValue()) {
			setDepositeExchangeRate($.depositeAccount.getValue(), $.project.getValue());
		}
	}


	$.moneyAccount.field.addEventListener("change", updateDepositeExchangeRate);

	function setDepositeExchangeRate(moneyAccount, project, setToModel) {
		var depositeExchangeRateValue;
		if ($.depositeFriendAccount.xGet("currency") === project.xGet("currency")) {
			isDepositeRateExist = true;
			depositeExchangeRateValue = 1;
			$.depositeAccountExchangeRate.$view.setHeight(0);
		} else {
			var exchanges = $.depositeFriendAccount.xGet("currency").getExchanges(project.xGet("currency"));
			if (exchanges.length) {
				isDepositeRateExist = true;
				depositeExchangeRateValue = exchanges.at(0).xGet("rate");
			} else {
				isDepositeRateExist = false;
				depositeExchangeRateValue = null;
			}
			$.depositeAccountExchangeRate.$view.setHeight(42);
		}
		// if (setToModel) {
		// // $.$model.xSet("exchangeRate", depositeExchangeRateValue);
		// $.depositeAccountExchangeRate.setValue(depositeExchangeRateValue);
		// $.depositeAccountExchangeRate.refresh();
		// } else {
		$.depositeAccountExchangeRate.setValue(depositeExchangeRateValue);
		$.depositeAccountExchangeRate.field.fireEvent("change");
		// }
	}


	$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
		if ($.project.getValue()) {
			updateExchangeRate();
			var depositeExpenseCategory = $.project.getValue().xGet("depositeExpenseCategory");
			$.moneyExpenseCategory.setValue(depositeExpenseCategory);
			$.moneyExpenseCategory.field.fireEvent("change");
			if ($.depositeFriendAccount && $.depositeFriendAccount.xGet("id")) {

			}
		}
	});

	$.friendUser.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
		if ($.$model.xGet("friendUser").xGet("id") === Alloy.Models.User.id) {
			$.depositeAccount.$view.setHeight(42);
		} else {
			$.depositeAccount.$view.setHeight(0);
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
		//先查找有没有选择收款人，否则提示收款人不能为空
		if ($.$model.xGet("friendUser") && $.$model.xGet("friendUser").xGet("id")) {
			var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
			var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
			var newAmount = $.$model.xGet("amount");
			var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");

			//比较收款人是不是当前用户，如果是则不需要发送消息。
			if ($.$model.xGet("friendUser").xGet("id") === Alloy.Models.User.id) {
				if ($.depositeFriendAccount && $.depositeFriendAccount.xGet("id")) {
					var editData = [];
					var addData = [];
					var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
						projectId : $.$model.xGet("project").xGet("id"),
						friendUserId : Alloy.Models.User.id
					});
					projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.xGet("actualTotalExpense") + newAmount * $.$model.xPrevious("exchangeRate"));
					projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") + newAmount * $.$model.xPrevious("exchangeRate"));

					editData.push(projectShareAuthorization.toJSON());
					projectShareAuthorization.xAddToSave($);

					if (oldMoneyAccount === newMoneyAccount) {
						newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
						newMoneyAccount.xAddToSave($);
						editData.push(newMoneyAccount.toJSON());
					} else {
						oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
						newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
						oldMoneyAccount.xAddToSave($);
						newMoneyAccount.xAddToSave($);
						editData.push(newMoneyAccount.toJSON());
						editData.push(oldMoneyAccount.toJSON());
					}

					if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
						if ($.$model.xGet("exchangeRate")) {
							var exchange = Alloy.createModel("Exchange", {
								localCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
								foreignCurrency : $.$model.xGet("project").xGet("currency"),
								rate : $.$model.xGet("exchangeRate"),
								ownerUser : Alloy.Models.User
							});
							exchange.xAddToSave($);
							editData.push(exchange.toJSON());
						}
					}

					if (isDepositeRateExist === false) {//若汇率不存在 ，保存时自动新建一条
						if ($.depositeAccountExchangeRate.getValue()) {
							var depositeExchange = Alloy.createModel("Exchange", {
								localCurrency : $.depositeFriendAccount.xGet("currency"),
								foreignCurrency : $.$model.xGet("project").xGet("currency"),
								rate : $.depositeAccountExchangeRate.getValue(),
								ownerUser : Alloy.Models.User
							});
							depositeExchange.xAddToSave($);
							editData.push(depositeExchange.toJSON());
						}
					}

					addData.push($.$model.toJSON());

					var incomeMoney = (newAmount * $.$model.xGet("exchangeRate")) / $.depositeAccountExchangeRate.getValue();
					var depositeIncome = Alloy.createModel("MoneyIncome", {
						date : $.$model.xGet("date"),
						amount : incomeMoney,
						remark : $.$model.xGet("remark"),
						ownerUser : Alloy.Models.User,
						exchangeRate : $.depositeAccountExchangeRate.getValue(),
						incomeType : $.$model.xGet("expenseType"),
						moneyAccount : $.depositeFriendAccount,
						project : $.$model.xGet("project"),
						moneyIncomeCategory : $.$model.xGet("project").xGet("depositeIncomeCategory"),
						friendUser : $.$model.xGet("friendUser"),
						depositeId : $.$model.xGet("id")
					});
					depositeIncome.xAddToSave($);
					addData.push(depositeIncome.toJSON());
					$.depositeFriendAccount.xSet("currentBalance", $.depositeFriendAccount.xGet("currentBalance") + incomeMoney);
					editData.push($.depositeFriendAccount.toJSON());
					$.depositeFriendAccount.xAddToSave($);
					// $.depositeFriendAccount.xSet("currentBalance", $.depositeFriendAccount.xGet("currentBalance") + newAmount);
					// $.depositeFriendAccount.xAddToSave($);
					// editData.push($.depositeFriendAccount.toJSON());

					$.saveModel(function(e) {
						// var depositeIncomeController = Alloy.Globals.openWindow("money/projectIncomeForm", {
						// $model : depositeIncome
						// });
						// depositeIncomeController.$view.addEventListener("contentready", function() {
						// depositeIncome.xAddToSave(depositeIncomeController.content);
						// depositeIncomeController.content.titleBar.dirtyCB();
						// });

						Alloy.Globals.Server.postData(addData, function(data) {
							Alloy.Globals.Server.putData(editData, function(data) {
								saveEndCB(e);
							}, function(e) {
								alert(e.__summary.msg);
							});
						}, function(e) {
							alert(e.__summary.msg);
						});

					}, function(e) {
						saveErrorCB(e);
					}, {
						syncFromServer : true
					});
				} else {
					saveErrorCB("请选择存入账户！");
				}
			} else {
				var date = (new Date()).toISOString();
				var account = {};
				for (var attr in $.$model.config.columns) {
					account[attr] = $.$model.xGet(attr);
				}
				//account还没有保存到数据库，所以要手动添加含id的字段.
				account["projectId"] = $.$model.xGet("project").xGet("id");
				account["moneyExpenseCategoryId"] = $.$model.xGet("moneyExpenseCategory").xGet("id");
				account["moneyAccountId"] = $.$model.xGet("moneyAccount").xGet("id");

				//发送消息给好友
				Alloy.Globals.Server.sendMsg({
					id : guid(),
					"toUserId" : $.$model.xGet("friendUser").xGet("id"),
					"fromUserId" : Alloy.Models.User.id,
					"type" : "Project.Deposite.AddRequest",
					"messageState" : "unread",
					"messageTitle" : "充值请求",
					"date" : date,
					"detail" : $.$model.xGet("remark") || ("充值" + $.$model.xGet("amount")),
					"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
					messageData : JSON.stringify({
						accountType : "MoneyExpense",
						account : account,
						depositeProject : $.$model.xGet("project")
					})
				}, function() {
					//在本地发件箱创建一条同样的消息
					var projectDepositeMsg = Alloy.createModel("Message", {
						toUserId : $.$model.xGet("friendUser").xGet("id"),
						fromUserId : Alloy.Models.User.id,
						type : "Project.Deposite.AddRequest",
						messageState : "closed",
						messageTitle : "充值请求",
						date : date,
						detail : $.$model.xGet("remark") || ("充值" + $.$model.xGet("amount")),
						messageBoxId : Alloy.Models.User.xGet("messageBoxId"),
						messageData : JSON.stringify({
							accountType : "MoneyExpense",
							account : account,
							depositeProject : $.$model.xGet("project")
						})
					}).xSave();
					//不保存当前的account，等好友接受之后再保存
					$.getCurrentWindow().$view.close();
					alert("充值成功，请等待回复");
				}, function(e) {
					alert(e.__summary.msg);
				});
			}
		} else {
			saveErrorCB("请选择收款人！");
		}

	};
}

$.picture.UIInit($, $.getCurrentWindow());
$.friendUser0.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.depositeAccount.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyExpenseCategory.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.exchangeRate.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());

