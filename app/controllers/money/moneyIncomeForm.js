Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "收入操作"
	});
	menuSection.add($.createContextMenuItem("收入明细", function() {
		Alloy.Globals.openWindow("money/moneyIncomeDetailAll", {
			selectedIncome : $.$model,
			closeWithoutSave : true
		});
	}));
	menuSection.add($.createContextMenuItem("导入图片", function() {
		$.picture.importPictureFromGallery();
	}, !$.$model.canEdit()));
	return menuSection;
};

$.project.rightButton.addEventListener("singletap", function() {//未输入金额时，不打开分摊
	if ($.amount.getValue()) {
		Alloy.Globals.openWindow("money/moneyIncomeApportionAll", {
			selectedIncome : $.$model,
			closeWithoutSave : true
		});
	} else {
		alert("请先输入金额，再调整分摊");
	}
});

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
		$.exchangeRate.field.fireEvent("change", {
			bubbles : false
		});
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
	}, function(e) {
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
		alert(e.__summary.msg);
	});
});

$.details.addEventListener("singletap", function(e) {
	Alloy.Globals.openWindow("money/moneyIncomeDetailAll", {
		selectedIncome : $.$model,
		closeWithoutSave : true
	});
});

function updateApportionAmount() {
	if ($.$model.xGet("moneyIncomeApportions").length > 0) {
		var fixedTotal = 0;
		var averageApportionsNotDelete = [];
		$.$model.xGet("moneyIncomeApportions").forEach(function(item) {
			if (item.__xDeletedHidden) {
				// skip these
			} else if (item.__xDeleted) {
				item.xSet("amount", 0);
			} else if (item.xGet("apportionType") === "Fixed") {
				fixedTotal = fixedTotal + item.xGet("amount");
			} else if (item.xGet("apportionType") === "Average") {
				// averageApportions.push(item);
				// if (!item.__xDeleted) {
				averageApportionsNotDelete.push(item);
				// }
			}
		});

		if (averageApportionsNotDelete.length > 0) {
			console.info("++++++++++++averageApportionsNotDelete++++++" + averageApportionsNotDelete.length);
			var average = ($.amount.getValue() - fixedTotal ) / averageApportionsNotDelete.length;
			average = Number(average.toFixed(2));
			// 分摊取两位小数
			var averageTotal = 0;
			averageApportionsNotDelete.forEach(function(item) {
				item.xSet("amount", average);
				averageTotal += average;
			});
			// 把分不尽的加到最后一个人身上
			if (averageTotal !== $.amount.getValue() - fixedTotal) {
				averageApportionsNotDelete[averageApportionsNotDelete.length - 1].xSet("amount", average + ($.amount.getValue() - fixedTotal - averageTotal));
			}
		}
	}
}

$.amount.field.addEventListener("change", updateApportionAmount);

$.convertSelectedFriend2UserModel = function(selectedFriendModel) {
	if (selectedFriendModel) {
		if (selectedFriendModel.xGet("friendUser")) {
			$.$model.xSet("friendUser", selectedFriendModel.xGet("friendUser"));
			$.$model.xSet("localFriend", null);
			return selectedFriendModel.xGet("friendUser");
		} else {
			$.$model.xSet("localFriend", selectedFriendModel);
			$.$model.xSet("friendUser", null);
			return selectedFriendModel;
		}
	} else {
		$.$model.xSet("localFriend", null);
		$.$model.xSet("friendUser", null);
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
	} else if ($.$model.xGet("localFriend")) {
		return $.$model.xGet("localFriend");
	}
};

$.friend.convertModelValue = function(value) {
	if ($.$model.xGet("friendUser")) {
		return $.$model.xGet("friendUser").getFriendDisplayName();
	} else if ($.$model.xGet("localFriend")) {
		return $.$model.xGet("localFriend").getDisplayName();
	} else {
		return "";
	}
};

var loading;
//防止多次点击row后多次执行$.beforeProjectSelectorCallback生成多条汇率
$.beforeProjectSelectorCallback = function(project, successCallback) {
	var activityWindow = Alloy.createController("activityMask");
	activityWindow.open("正在获取该项目的汇率...");
	if (project.xGet("currency") !== Alloy.Models.User.xGet("userData").xGet("activeCurrency")) {
		if (Alloy.Models.User.xGet("userData").xGet("activeCurrency").getExchanges(project.xGet("currency")).length === 0 && !loading) {
			loading = true;
			Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("userData").xGet("activeCurrency").id, project.xGet("currency").id, function(rate) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrencyId : Alloy.Models.User.xGet("userData").xGet("activeCurrencyId"),
					foreignCurrencyId : project.xGet("currencyId"),
					rate : rate
				});
				exchange.xSet("ownerUser", Alloy.Models.User);
				exchange.xSet("ownerUserId", Alloy.Models.User.id);
				exchange.save();
				successCallback();
				loading = false;
				activityWindow.close();
			}, function(e) {
				activityWindow.close();
				alert("无法获取该项目与用户本币的转换汇率，请手动增加该汇率");
			});
		} else {
			activityWindow.close();
			successCallback();
		}
	} else {
		activityWindow.close();
		successCallback();
	}
};

var oldAmount;
var oldMoneyAccount;
var fistChangeFlag;
var oldApportions = [];

if (!$.$model) {
	if ($.$attrs.addNewAgant) {
		var templateModel = $.$attrs.addNewAgant;
		$.$model = Alloy.createModel("MoneyIncome", {
			date : (new Date()).toISOString(),
			amount : templateModel.xGet("amount"),
			exchangeRate : templateModel.xGet("exchangeRate"),
			incomeType : templateModel.xGet("incomeType"),
			moneyAccount : templateModel.xGet("moneyAccount"),
			project : templateModel.xGet("project"),
			moneyIncomeCategory : templateModel.xGet("moneyIncomeCategory"),
			friendUser : templateModel.xGet("friendUser") ? templateModel.xGet("friendUser") : null,
			ownerUser : Alloy.Models.User
		});
	} else {
		$.$model = Alloy.createModel("MoneyIncome", {
			date : (new Date()).toISOString(),
			exchangeRate : 1,
			incomeType : "Ordinary",
			moneyAccount : Alloy.Models.User.xGet("userData").xGet("activeMoneyAccount"),
			project : Alloy.Models.User.xGet("userData").xGet("activeProject"),
			moneyIncomeCategory : Alloy.Models.User.xGet("userData").xGet("activeProject") ? Alloy.Models.User.xGet("userData").xGet("activeProject").xGet("defaultIncomeCategory") : null,
			ownerUser : Alloy.Models.User
		});
	}
	$.setSaveableMode("add");
}

// if ($.saveableMode === "edit") {
// $.project.label.setColor("#6e6d6d");
// $.project.field.setColor("#6e6d6d");
// }

function updateAmount() {
	$.amount.setValue($.$model.xGet("amount"));
	$.amount.field.fireEvent("change", {
		bubbles : false
	});
}

/*//隐藏功能,使用明细金额作为收支金额
 function deleteDetail(detailModel) {
 if ($.$model.xGet("useDetailsTotal") || $.$model.isNew() && !$.$model.hasChanged("useDetailsTotal")) {
 $.$model.xSet("amount", $.$model.xGet("amount") - detailModel.xGet("amount"));
 updateAmount();
 }
 }
 */

function deleteApportion(apportionModel) {
	var incomeAmount = $.$model.xGet("amount");
	var moneyIncomeApportions = $.$model.xGet("moneyIncomeApportions");
	var averageApportions = [];
	var fixedTotal = 0;
	moneyIncomeApportions.forEach(function(item) {
		if (!item.__xDeleted && !item.__xDeletedHidden) {
			if (item.xGet("apportionType") === "Fixed") {
				fixedTotal = fixedTotal + item.xGet("amount");
			} else {
				averageApportions.push(item);
			}
		} else {
			item.xSet("amount", 0);
		}
	});
	if (averageApportions.length > 0) {
		var average = Number(((incomeAmount - fixedTotal) / averageApportions.length).toFixed(2));
		var averageTotal = 0;
		for (var i = 0; i < averageApportions.length - 1; i++) {
			averageApportions[i].xSet("amount", average);
			averageTotal += average;
		}
		averageApportions[averageApportions.length - 1].xSet("amount", incomeAmount - averageTotal - fixedTotal);
	}
}

// $.onWindowOpenDo(function() {
//如果是多人分摊则显示分摊button，反之隐藏
if ($.$model.xGet("project") && $.$model.xGet("project").xGet("projectShareAuthorizations").length === 1) {
	$.project.hideRightButton();
} else {
	$.project.showRightButton();
}
// });

var detailsDirty = false, apportionsDirty = false;
function updateDetails() {
	if (!detailsDirty) {
		$.becameDirty();
		detailsDirty = true;
	}
}

function updateApportions() {
	if (!apportionsDirty) {
		$.becameDirty();
		apportionsDirty = true;
	}
}

$.$model.on("xchange:amount", updateAmount);
// $.$model.xGet("moneyIncomeDetails").on("xdelete", deleteDetail);//隐藏功能,使用明细金额作为收支金额
$.$model.xGet("moneyIncomeApportions").on("xdelete", deleteApportion);
$.$model.xGet("moneyIncomeApportions").on("add _xchange xdelete", updateApportions);
$.$model.xGet("moneyIncomeDetails").on("add _xchange xdelete", updateDetails);

$.onWindowCloseDo(function() {
	$.$model.off("xchange:amount", updateAmount);
	// $.$model.xGet("moneyIncomeDetails").off("xdelete", deleteDetail);//隐藏功能,使用明细金额作为收支金额
	$.$model.xGet("moneyIncomeApportions").off("xdelete", deleteApportion);
	$.$model.xGet("moneyIncomeApportions").off("add _xchange xdelete", updateApportions);
	$.$model.xGet("moneyIncomeDetails").off("add _xchange xdelete", updateDetails);
});

if ($.$model.xGet("ownerUser") !== Alloy.Models.User) {
	$.projectAmountContainer.setHeight(42);
	if ($.$model.xGet("project").xGet("currency") !== Alloy.Models.User.xGet("activeCurrency")) {
		$.localAmountContainer.setHeight(42);
	}
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
	$.moneyAccount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model.xGet("project"), true);

		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	});

	/* //隐藏功能,使用明细金额作为收支金额
	 $.amount.field.addEventListener("singletap", function(e) {
	 if ($.$model.xGet("moneyIncomeDetails").length > 0 && $.$model.xGet("useDetailsTotal")) {
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
	 */

	$.moneyIncomeCategory.beforeOpenModelSelector = function() {
		if (!$.$model.xGet("project")) {
			return "请先选择项目";
		}
	};
	oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	if ($.saveableMode === "add") {
		oldAmount = 0;
	} else {
		oldAmount = $.$model.xGet("amount") || 0;
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
			exchangeRateValue = 1;
			$.exchangeRate.$view.setHeight(0);
		} else {
			var exchanges = moneyAccount.xGet("currency").getExchanges(project.xGet("currency"));
			if (exchanges.length) {
				exchangeRateValue = exchanges.at(0).xGet("rate");
			} else {
				exchangeRateValue = null;
			}
			$.exchangeRate.$view.setHeight(42);
		}
		if (setToModel) {
			$.$model.xSet("exchangeRate", exchangeRateValue);
			$.exchangeRate.refresh();
		} else {
			$.exchangeRate.setValue(exchangeRateValue);
			$.exchangeRate.field.fireEvent("change", {
				bubbles : false
			});
		}
	}

	var projectFirstChangeFlag;
	var oldProject = $.$model.xGet("project");
	$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
		if ($.project.getValue()) {
			updateExchangeRate();
			var defaultIncomeCategory = $.project.getValue().xGet("defaultIncomeCategory");
			$.moneyIncomeCategory.setValue(defaultIncomeCategory);
			$.moneyIncomeCategory.field.fireEvent("change", {
				bubbles : false
			});
			if ($.project.getValue().xGet("projectShareAuthorizations").length > 1) {
				$.project.showRightButton();
			} else {
				$.project.hideRightButton();
			}
		}

		if ($.$model.xGet("moneyIncomeApportions").length > 0) {
			if ($.$model.isNew()) {
				$.$model.xGet("moneyIncomeApportions").reset();
			} else {
				$.$model.xGet("moneyIncomeApportions").forEach(function(item) {
					if (item.isNew()) {
						$.$model.xGet("moneyIncomeApportions").remove(item);
					} else {
						if ($.project.getValue() !== oldProject) {
							item.__xDeletedHidden = true;
						} else {
							item.__xDeletedHidden = false;
						}
					}
				});
			}
		}
	});

	$.friend.field.addEventListener("change", function() {
		if ($.friend.getValue()) {
			$.friendAccount.$view.setHeight(0);
			//暂时隐藏好友账户
			$.friendAccount.setValue("");
			$.friendAccount.field.fireEvent("change", {
				bubbles : false
			});
		} else {
			$.friendAccount.$view.setHeight(0);
			$.friendAccount.setValue("");
		}
	});
	if (!$.friend.getValue()) {
		$.friendAccount.$view.setHeight(0);
	}

	$.onSave = function(saveEndCB, saveErrorCB) {
		$.picture.xAddToSave($);

		if ($.$model.xGet("useDetailsTotal")) {//在收支金额为空的情况新增明细 把useDetailsTotal设成true 使用明细金额为收支金额  后把useDetailsTotal设成false
			$.$model.xSet("useDetailsTotal", false);
		}

		var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");

		//if ($.$model.isNew() || ($.$model.xGet("moneyIncomeDetails").length === 0 && newAmount !== 0)) {
		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
			oldMoneyAccount.xAddToSave($);
		}
		//} else {
		// if ($.$model.hasChanged("moneyAccount")) {
		// var oldAccount = $.$model.previous("moneyAccount");
		// var newAccount = $.$model.xGet("moneyAccount");
		// oldAccount.xSet("currentBalance", oldAccount.xGet("currentBalance") - $.$model.previous("amount"));
		// newAccount.xSet("currentBalance", newAccount.xGet("currentBalance") + $.$model.xGet("amount"));
		// oldAccount.xAddToSave($);
		// newAccount.xAddToSave($);
		// }
		//}
		//if ($.$model.isNew()) {
		// save all income details
		$.$model.xGet("moneyIncomeDetails").map(function(item) {
			console.info("adding income detail : " + item.xGet("name") + " " + item.xGet("amount"));
			if (item.__xDeleted) {
				item.xAddToDelete($);
			} else if (item.hasChanged()) {
				item.xAddToSave($);
			}
		});
		//}

		var exchange;
		if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
			var rates = $.$model.xGet("moneyAccount").xGet("currency").getExchanges($.$model.xGet("project").xGet("currency"));
			if (!rates.length && $.$model.xGet("exchangeRate")) {//若汇率不存在 ，保存时自动新建一条
				exchange = Alloy.createModel("Exchange", {
					localCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
					foreignCurrency : $.$model.xGet("project").xGet("currency"),
					rate : $.$model.xGet("exchangeRate"),
					ownerUser : Alloy.Models.User
				});
				exchange.xAddToSave($);
			}
		}

		if ($.$model.xGet("project").xGet("projectShareAuthorizations").length > 0) {
			if ($.$model.isNew()) {
				$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
					if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
						item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") + $.$model.getProjectCurrencyAmount());
						item.xAddToSave($);
					}
				});
			} else {
				if ($.$model.hasChanged("project")) {
					$.$model.xPrevious("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") - Number((oldAmount * $.$model.xPrevious("exchangeRate")).toFixed(2)));
							item.xAddToSave($);
						}
					});
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") + $.$model.getProjectCurrencyAmount());
							item.xAddToSave($);
						}
					});
				} else {
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") - Number((oldAmount * $.$model.xPrevious("exchangeRate")).toFixed(2)) + $.$model.getProjectCurrencyAmount());
							item.xAddToSave($);
						}
					});
				}
			}

			// 生成分摊
			$.$model.generateIncomeApportions(true);
		}
		// else if ($.$model.xGet("project").xGet("projectShareAuthorizations").length === 1) {
		// var projectShareAuthorization = $.$model.xGet("project").xGet("projectShareAuthorizations").at[0];
		// projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") + $.$model.xGet("amount"));
		// projectShareAuthorization.xSet("apportionedTotalIncome", projectShareAuthorization.xGet("apportionedTotalIncome") + $.$model.xGet("amount"));
		// projectShareAuthorization.xAddToSave($);
		// }
		var oldProjectShareAuthorizations = $.$model.xPrevious("project").xGet("projectShareAuthorizations");
		var projectShareAuthorizations = $.$model.xGet("project").xGet("projectShareAuthorizations");
		var oldDebtAccount, newDebtAccount, debtAccountChanged = [];
		$.$model.xGet("moneyIncomeApportions").forEach(function(item) {
			if (item.xGet("friendUser").xGet("id") !== Alloy.Models.User.xGet("id")) {
				oldDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
					accountType : "Debt",
					currencyId : oldMoneyAccount.xGet("currency").xGet("id"),
					friendId : item.xGet("friendUser").getFriend().id,
					ownerUserId : Alloy.Models.User.xGet("id")
				});
			}
			
			if (item.__xDeleted) {//删除
				item.xAddToDelete($);
				if (oldDebtAccount && oldDebtAccount.id) {
					oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") + item.xPrevious("amount"));
					oldDebtAccount.xAddToSave($);
					debtAccountChanged.push(oldDebtAccount);
				}

				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
						projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - Number((item.xPrevious("amount") * item.xGet("moneyIncome").xPrevious("exchangeRate")).toFixed(2)));
						projectShareAuthorization.xAddToSave($);
					}
				});
			} else if (item.__xDeletedHidden) {//修改时切换项目删除的分摊
				item.xAddToDelete($);
				
				if (oldDebtAccount && oldDebtAccount.id) {
					oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") + item.xPrevious("amount"));
					oldDebtAccount.xAddToSave($);
					debtAccountChanged.push(oldDebtAccount);
				}

				oldProjectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
						projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - Number((item.xPrevious("amount") * item.xGet("moneyIncome").xPrevious("exchangeRate")).toFixed(2)));
						projectShareAuthorization.xAddToSave($);
					}
				});
			} else {
				item.xAddToSave($);
				
				if (item.xGet("friendUser").xGet("id") !== Alloy.Models.User.xGet("id")) {
					newDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						accountType : "Debt",
						currencyId : $.$model.xGet("moneyAccount").xGet("currency").xGet("id"),
						friendId : item.xGet("friendUser").getFriend().id,
						ownerUserId : Alloy.Models.User.xGet("id")
					});

					if (item.isNew()) {
						if (newDebtAccount.id) {
							newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") - item.xGet("amount"));
							newDebtAccount.xAddToSave($);
							debtAccountChanged.push(newDebtAccount);
						} else {
							var debAcount = Alloy.createModel("MoneyAccount", {
								name : item.xGet("friendUser").getFriend().id,
								currency : $.$model.xGet("moneyAccount").xGet("currency"),
								currentBalance : -(item.xGet("amount")),
								sharingType : "Private",
								accountType : "Debt",
								friend : item.xGet("friendUser").getFriend(),
								ownerUser : Alloy.Models.User
							});
							debAcount.xAddToSave($);
						}
					} else {
						if (newDebtAccount.id) {
							if (oldDebtAccount.id === newDebtAccount.id) {
								newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") + item.xPrevious("amount") - item.xGet("amount"));
								newDebtAccount.xAddToSave($);
								debtAccountChanged.push(newDebtAccount);
							} else {
								oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") + item.xPrevious("amount"));
								oldDebtAccount.xAddToSave($);
								debtAccountChanged.push(oldDebtAccount);
								newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") - item.xGet("amount"));
								newDebtAccount.xAddToSave($);
								debtAccountChanged.push(newDebtAccount);
							}
						} else {
							oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") + item.xPrevious("amount"));
							oldDebtAccount.xAddToSave($);
							debtAccountChanged.push(oldDebtAccount);

							var debAcount = Alloy.createModel("MoneyAccount", {
								name : item.xGet("friendUser").getFriend().id,
								currency : $.$model.xGet("moneyAccount").xGet("currency"),
								currentBalance : -(item.xGet("amount")),
								sharingType : "Private",
								accountType : "Debt",
								friend : item.xGet("friendUser").getFriend(),
								ownerUser : Alloy.Models.User
							});
							debAcount.xAddToSave($);
						}
					}
				}
				
				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
						if (item.isNew()) {
							projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome + Number((item.xGet("amount") * item.xGet("moneyIncome").xGet("exchangeRate")).toFixed(2)));
						} else {
							projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - Number((item.xPrevious("amount") * item.xGet("moneyIncome").xPrevious("exchangeRate")).toFixed(2)) + Number((item.xGet("amount") * item.xGet("moneyIncome").xGet("exchangeRate")).toFixed(2)));
						}
						projectShareAuthorization.xAddToSave($);
					}
				});
			}
		});

		var modelIsNew = $.$model.isNew();
		$.saveModel(function(e) {
			if (modelIsNew) {
				//记住当前分类为下次打开时的默认分类
				$.$model.xGet("project").setDefaultIncomeCategory($.$model.xGet("moneyIncomeCategory"));

				//记住当前账户为下次打开时的默认账户
				// Alloy.Models.User.xGet("userData").xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				// Alloy.Models.User.xGet("userData").xSet("activeProject", $.$model.xGet("project"));
				//直接把activeMoneyAccountId保存到数据库，不经过validation，注意用 {patch : true, wait : true}
				if (Alloy.Models.User.xGet("activeMoneyAccount") !== $.$model.xGet("moneyAccount") || Alloy.Models.User.xGet("activeProject") !== $.$model.xGet("project")) {
					Alloy.Models.User.xGet("userData").save({
						activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
						activeProjectId : $.$model.xGet("project").xGet("id")
					}, {
						patch : true,
						wait : true
					});
				}
			}

			if (detailsDirty) {
				$.becameClean();
				detailsDirty = false;
			}
			if (apportionsDirty) {
				$.becameClean();
				apportionsDirty = false;
			}
			saveEndCB(e);
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			
			for (var i = 0; i < debtAccountChanged.length; i++) {
				debtAccountChanged[i].xSet("currentBalance", debtAccountChanged[i].previous("currentBalance"));
			}
			
			projectShareAuthorizations.forEach(function(projectShareAuthorization) {
				if (projectShareAuthorization.hasChanged("apportionedTotalIncome")) {
					projectShareAuthorization.xSet("apportionedTotalIncome", projectShareAuthorization.previous("apportionedTotalIncome"));
				}
				if (projectShareAuthorization.xGet("friendUser") === $.$model.xGet("ownerUser")) {
					projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.previous("actualTotalIncome"));
				}
			});
			if ($.$model.isNew()) {
				$.$model.xGet("moneyIncomeApportions").reset();
			}
			saveErrorCB(e);
		});
	};
}

$.amount.rightButton.addEventListener("singletap", function(e) {
	Alloy.Globals.openWindow("money/moneyIncomeDetailAll", {
		selectedIncome : $.$model,
		closeWithoutSave : true
	});
});

$.picture.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.projectAmount.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyIncomeCategory.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.exchangeRate.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());

