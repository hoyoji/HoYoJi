Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
		var menuSection = Ti.UI.createTableViewSection({
			headerTitle : "充值操作"
		});
	menuSection.add($.createContextMenuItem("导入图片", function() {
		$.picture.importPictureFromGallery();
	}));
	return menuSection;
};

var selectedDepositeMsg = $.$attrs.selectedDepositeMsg;
var depositeExchangeRate = $.$attrs.depositeExchangeRate;
var depositeAmount = $.$attrs.depositeAmount;

//更新汇率
$.exchangeRate.rightButton.addEventListener("singletap", function(e) {
	if (!$.$model.xGet("moneyAccount")) {
		alert("请选择账户");
		return;
	}
	if (!$.$model.xGet("project")) {
		alert("请选择项目");
		return;
	}
	$.exchangeRate.rightButton.setEnabled(false);
	$.exchangeRate.rightButton.showActivityIndicator();
	Alloy.Globals.Server.getExchangeRate($.$model.xGet("moneyAccount").xGet("currency").id, $.$model.xGet("project").xGet("currency").id, function(rate) {
		$.exchangeRate.setValue(rate);
		$.exchangeRate.field.fireEvent("change");

		if ($.$model.xGet("friendUser").xGet("id") !== Alloy.Models.User.id) {
			$.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / rate);
			$.amount.refresh();
		}
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
	}, function(e) {
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
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

var loading;
//防止多次点击row后多次执行$.beforeProjectSelectorCallback生成多条汇率
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
				// //改变账户后要更新金额
				// $.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / rate);
				// $.amount.refresh();
				successCallback();
				loading = false;
			}, function(e) {
				alert("无法获取该项目与用户本币的转换汇率，请手动增加该汇率");
			});
		} else {
			successCallback();
		}
	} else {
		$.$model.xSet("amount", depositeAmount * depositeExchangeRate);
		$.amount.refresh();
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
		if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
			$.exchangeRate.$view.setHeight(42);
			$.exchangeRate.hideRightButton();
		}
	} else {
		$.moneyAccount.$view.setHeight(0);
		$.localAmountContainer.setHeight(42);
		$.amount.$view.setHeight(0);
		$.ownerUser.setHeight(42);
	}

} else {
	$.project.label.setColor("#6e6d6d");
	$.project.field.setColor("#6e6d6d");

	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model.xGet("project"), true);
			if ($.$model.xGet("friendUser").xGet("id") !== Alloy.Models.User.id) {
				if (!$.$model.xGet("exchangeRate")) {
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
	
	//改变账户，更新汇率
	$.moneyAccount.field.addEventListener("change", updateExchangeRate);
	
	//汇率改变时，要重新计算充值金额
	$.exchangeRate.field.addEventListener("change", function() {
		if($.$model.xGet("exchangeRate")){
			$.$model.xSet("amount", (depositeAmount * depositeExchangeRate) / $.$model.xGet("exchangeRate"));
			$.amount.refresh();
		}
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
			// //改变汇率更新金额
		} else {
			$.exchangeRate.setValue(exchangeRateValue);
			$.$model.xSet("exchangeRate", exchangeRateValue);
			$.exchangeRate.field.fireEvent("change");
		}
	}

	$.onSave = function(saveEndCB, saveErrorCB) {
		$.picture.xAddToSave($);
		
		var editData = [];
		var addData = [];
		var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		//如果汇率为空则不执行
		if ($.$model.xGet("exchangeRate")) {
			//查找共享给我的projectShareAuthorization
			var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
				projectId : $.$model.xGet("project").xGet("id"),
				friendUserId : Alloy.Models.User.id
			});
			Alloy.Globals.Server.getData([{__dataType : "ProjectShareAuthorization",id : projectShareAuthorization.id}], function(data1) {
				if(data1[0][0].actualTotalIncome === projectShareAuthorization.xGet("actualTotalIncome") && data1[0][0].actualTotalExpense === projectShareAuthorization.xGet("actualTotalExpense")){
					projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") + newAmount * $.$model.xGet("exchangeRate"));
					projectShareAuthorization.xAddToSave($);
					editData.push(projectShareAuthorization.toJSON());
					
					//账户相同时，即新增和账户不改变的修改
					if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {
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
					//若汇率不存在 ，保存时自动新建一条
					if (isRateExist === false) {
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
					//新增项目于本币的汇率，以免添加成功之后主页金额显示错误
					if (Alloy.Models.User.xGet("activeCurrencyId") !== $.$model.xGet("moneyAccount").xGet("currencyId")) {
						var activeToProjectExchange = Alloy.createModel("Exchange").xFindInDb({
							localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
							foreignCurrencyId : $.$model.xGet("project").xGet("currencyId")
						});
						if (!activeToProjectExchange.id) {
							Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("activeCurrencyId"), $.$model.xGet("project").xGet("currencyId"), function(rate) {
		
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
	
				// if ($.$model.xGet("friendUser").xGet("id") !== Alloy.Models.User.id) {
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
						selectedDepositeMsg.xSet("messageState", "closed");
						selectedDepositeMsg.xAddToSave($);
						editData.push(selectedDepositeMsg.toJSON());
						addData.push($.$model.toJSON());
						Alloy.Globals.Server.postData(addData, function(data) {
							Alloy.Globals.Server.putData(editData, function(data) {
								//把服务器上创建的充值支出和充值发起者的ProjectShareAuthorization更新到本地
								Alloy.Globals.Server.loadData("MoneyExpense", [$.$model.xGet("depositeId")], function(collection) {
									Alloy.Globals.Server.loadData("ProjectShareAuthorization",[{
										projectId : $.$model.xGet("project").xGet("id"),
										friendUserId : $.$model.xGet("friendUser").xGet("id")
									}], function(collection) {
										$.saveModel(saveEndCB, saveErrorCB, {
											syncFromServer : true
										});
									}, saveErrorCB);
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
					saveErrorCB();
					Alloy.Globals.confirm("同步", "与服务器数据有冲突，请同步后重试", function(){
						Alloy.Globals.Server.sync();
					});
				}
				
			}, saveErrorCB);
				// } else {
					// addData.push($.$model.toJSON());
					// Alloy.Globals.Server.postData(addData, function(data) {
						// Alloy.Globals.Server.putData(editData, function(data) {
							// $.saveModel(saveEndCB, saveErrorCB, {
								// syncFromServer : true
							// });
						// }, function(e) {
							// alert(e.__summary.msg);
						// });
					// }, function(e) {
						// alert(e.__summary.msg);
					// });
				// }
		} else {
			alert("保存失败，汇率不能为空");
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
// $.friendAccount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
