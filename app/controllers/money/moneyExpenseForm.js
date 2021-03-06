Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "支出操作"
	});
	menuSection.add($.createContextMenuItem("支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
			selectedExpense : $.$model,
			closeWithoutSave : true
		});
	}));
	menuSection.add($.createContextMenuItem("导入图片", function() {
		$.picture.importPictureFromGallery();
	}, !$.$model.canEdit()));
	return menuSection;
};

$.convertSelectedFriend2UserModel = function(selectedFriendModel,willUpdateModel) {
	willUpdateModel.value = true;
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

$.project.rightButton.addEventListener("singletap", function() {//未输入金额时，不打开分摊
	if ($.amount.getValue()) {
		Alloy.Globals.openWindow("money/moneyExpenseApportionAll", {
			selectedExpense : $.$model,
			closeWithoutSave : true
		});
	} else {
		alert("请先输入金额，再调整分摊");
	}
});

$.exchangeRate.rightButton.addEventListener("singletap", function(e) {//汇率的更新键，从服务器获取汇率
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

$.details.addEventListener("singletap", function(e) {//非自己创建的账务的details入口
	Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
		selectedExpense : $.$model,
		closeWithoutSave : true
	});
});

function updateApportionAmount() {//amount改变，平均分摊也跟着改变
	if ($.$model.xGet("moneyExpenseApportions").length > 0) {
		var fixedTotal = 0;
		var averageApportionsNotDelete = [];
		$.$model.xGet("moneyExpenseApportions").forEach(function(item) {//获取当前固定分摊的总和，平均分摊的每个元素
			if (item.__xDeletedHidden) {
				// skip these
			} else if (item.__xDeleted) {
				item.xSet("amount", 0);
			} else if (item.xGet("apportionType") === "Fixed") {
				fixedTotal = fixedTotal + item.xGet("amount");
			} else if (item.xGet("apportionType") === "Average") {
				averageApportionsNotDelete.push(item);
			}
		});

		if (averageApportionsNotDelete.length > 0) {//更新平均分摊的金额
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

var oldAmount;
var oldMoneyAccount;
// var fistChangeFlag;
var oldApportions = [];

if (!$.$model) {
	if ($.$attrs.addNewAgant) {
		var templateModel = $.$attrs.addNewAgant;
		$.$model = Alloy.createModel("MoneyExpense", {
			date : (new Date()).toISOString(),
			amount : templateModel.xGet("amount"),
			exchangeRate : templateModel.xGet("exchangeRate"),
			expenseType : templateModel.xGet("expenseType"),
			moneyAccount : templateModel.xGet("moneyAccount"),
			project : templateModel.xGet("project"),
			moneyExpenseCategory : templateModel.xGet("moneyExpenseCategory"),
			friendUser : templateModel.xGet("friendUser") ? templateModel.xGet("friendUser") : null,
			ownerUser : Alloy.Models.User
		});
	} else {
		$.$model = Alloy.createModel("MoneyExpense", {
			date : (new Date()).toISOString(),
			exchangeRate : 1,
			expenseType : "Ordinary",
			moneyAccount : Alloy.Models.User.xGet("userData").xGet("activeMoneyAccount"),
			project : Alloy.Models.User.xGet("userData").xGet("activeProject"),
			moneyExpenseCategory : Alloy.Models.User.xGet("userData").xGet("activeProject") ? Alloy.Models.User.xGet("userData").xGet("activeProject").xGet("defaultExpenseCategory") : null,
			ownerUser : Alloy.Models.User
		});
	}
	$.setSaveableMode("add");
}

// if ($.saveableMode === "edit") {//修改时项目不可点击，设成灰色
// $.project.label.setColor("#6e6d6d");
// $.project.field.setColor("#6e6d6d");
// }

function updateAmount() {//没输入支出金额时，新增明细金额的同时更新账务金额
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

function deleteApportion(apportionModel) {//从form打开apportion进行删除，只是把该row设成xDeleted 在form保存时才进行真正的删除，删除后要重新计算平均分摊
	var expenseAmount = $.$model.xGet("amount");
	var moneyExpenseApportions = $.$model.xGet("moneyExpenseApportions");
	var averageApportions = [];
	var fixedTotal = 0;
	moneyExpenseApportions.forEach(function(item) {
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
		var average = Number(((expenseAmount - fixedTotal) / averageApportions.length).toFixed(2));
		var averageTotal = 0;
		for (var i = 0; i < averageApportions.length - 1; i++) {
			averageApportions[i].xSet("amount", average);
			averageTotal += average;
		}
		averageApportions[averageApportions.length - 1].xSet("amount", expenseAmount - averageTotal - fixedTotal);
	}
}

if ($.$model.xGet("project") && $.$model.xGet("project").xGet("projectShareAuthorizations").length === 1) {//如果是多人分摊则显示分摊button，反之隐藏
	$.project.hideRightButton();
} else {
	$.project.showRightButton();
}

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

function setDefaultCategory(project, setToModel) {//新增时根据时间设置早午晚餐
	var date = new Date($.$model.xGet("date"));
	var hours = date.getHours();
	var defaultCategory;
	if (hours > 6 && hours < 9) {
		defaultCategory = Alloy.createModel("MoneyExpenseCategory").xFindInDb({
			name : "早餐",
			projectId : project.xGet("id")
		});
	} else if (hours > 11 && hours < 14) {
		defaultCategory = Alloy.createModel("MoneyExpenseCategory").xFindInDb({
			name : "午餐",
			projectId : project.xGet("id")
		});
	} else if (hours > 17 && hours < 20) {
		defaultCategory = Alloy.createModel("MoneyExpenseCategory").xFindInDb({
			name : "晚餐",
			projectId : project.xGet("id")
		});
	} else if (hours > 21 || hours < 3) {
		defaultCategory = Alloy.createModel("MoneyExpenseCategory").xFindInDb({
			name : "夜宵",
			projectId : project.xGet("id")
		});
	} else {
		defaultCategory = project.xGet("defaultExpenseCategory");
	}
	if (!defaultCategory.xGet("project")) {
		defaultCategory = project.xGet("defaultExpenseCategory");

	}
	if (setToModel) {
		$.$model.xSet("moneyExpenseCategory", defaultCategory);
		$.moneyExpenseCategory.refresh();
	} else {
		$.moneyExpenseCategory.setValue(defaultCategory);
		$.moneyExpenseCategory.field.fireEvent("change", {
			bubbles : false
		});
	}
}

$.$model.on("xchange:amount", updateAmount);
/* $.$model.xGet("moneyExpenseDetails").on("xdelete", deleteDetail);*///隐藏功能,使用明细金额作为收支金额
$.$model.xGet("moneyExpenseApportions").on("xdelete", deleteApportion);
$.$model.xGet("moneyExpenseApportions").on("add _xchange xdelete", updateApportions);
$.$model.xGet("moneyExpenseDetails").on("add _xchange xdelete", updateDetails);

$.onWindowCloseDo(function() {
	$.$model.off("xchange:amount", updateAmount);
	/*  $.$model.xGet("moneyExpenseDetails").off("xdelete", deleteDetail);*///隐藏功能,使用明细金额作为收支金额
	$.$model.xGet("moneyExpenseApportions").off("xdelete", deleteApportion);
	$.$model.xGet("moneyExpenseApportions").off("add _xchange xdelete", updateApportions);
	$.$model.xGet("moneyExpenseDetails").off("add _xchange xdelete", updateDetails);
});

if ($.$model.xGet("ownerUser") !== Alloy.Models.User) {
	$.projectAmountContainer.setHeight(42);
	if ($.$model.xGet("project").xGet("currency") !== Alloy.Models.User.xGet("userData").xGet("activeCurrency")) {
		$.localAmountContainer.setHeight(42);
	}
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
	$.moneyAccount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model.xGet("project"), true);
			setDefaultCategory($.$model.xGet("project"), true);
			// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
	});

	/* //隐藏功能,使用明细金额作为收支金额
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
	 */

	$.moneyExpenseCategory.beforeOpenModelSelector = function() {
		if (!$.$model.xGet("project")) {
			return "请先选择项目";
		}
	};

	oldMoneyAccount = $.$model.xGet("moneyAccount");
	if ($.saveableMode === "add") {
		oldAmount = 0;
	} else {
		oldAmount = oldAmount = $.$model.xGet("amount") || 0;
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
			if (exchanges.length > 0) {
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
			var project = $.project.getValue();
			setDefaultCategory(project);
			if ($.project.getValue().xGet("projectShareAuthorizations").length > 1) {
				$.project.showRightButton();
			} else {
				$.project.hideRightButton();
			}
		}

		if ($.$model.xGet("moneyExpenseApportions").length > 0) {//切换项目后把原项目的apportion清空
			if ($.$model.isNew()) {
				$.$model.xGet("moneyExpenseApportions").reset();
			} else {
				$.$model.xGet("moneyExpenseApportions").forEach(function(item) {
					if (item.isNew()) {//如果apportion是刚新增的，直接移除
						$.$model.xGet("moneyExpenseApportions").remove(item);
					} else {//apportion已经保存在数据库的，先隐藏，保存expense成功后再删除；多次切换项目，又回到打开时的项目，把原项目隐藏的apportion再显示出来
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

		//if ($.$model.isNew() || ($.$model.xGet("moneyExpenseDetails").length === 0 && newAmount !==0)) {//新增时 或者 修改时且没有明细 计算账户余额
		if (oldMoneyAccount === newMoneyAccount) {
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
		} else {
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
			oldMoneyAccount.xAddToSave($);
		}
		// } else {
		// if ($.$model.hasChanged("moneyAccount")) {//修改明细后再改账户计算余额
		// var oldAccount = $.$model.previous("moneyAccount");
		// var newAccount = $.$model.xGet("moneyAccount");
		// oldAccount.xSet("currentBalance", oldAccount.xGet("currentBalance") + $.$model.xPrevious("amount"));
		// newAccount.xSet("currentBalance", newAccount.xGet("currentBalance") - $.$model.xGet("amount"));
		// oldAccount.xAddToSave($);
		// newAccount.xAddToSave($);
		// }
		// }
		//if ($.$model.isNew()) {
		// save all expense details
		$.$model.xGet("moneyExpenseDetails").forEach(function(item) {
			console.info("adding expense detail : " + item.xGet("name") + " " + item.xGet("amount"));
			if (item.__xDeleted) {
				item.xAddToDelete($);
			} else if (item.hasChanged()) {
				item.xAddToSave($);
			}
		});
		//}

		if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
			var rates = $.$model.xGet("moneyAccount").xGet("currency").getExchanges($.$model.xGet("project").xGet("currency"));
			if (!rates.length && $.$model.xGet("exchangeRate")) {//若汇率不存在 ，保存时自动新建一条
				var exchange = Alloy.createModel("Exchange", {
					localCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
					foreignCurrency : $.$model.xGet("project").xGet("currency"),
					rate : $.$model.xGet("exchangeRate"),
					ownerUser : Alloy.Models.User
				});
				exchange.xAddToSave($);
			}
		}

		if ($.$model.xGet("project").xGet("projectShareAuthorizations").length > 0) {
			if ($.$model.isNew()) {//更新用户在项目的总支出
				$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
					if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
						item.xSet("actualTotalExpense", item.xGet("actualTotalExpense") + $.$model.getProjectCurrencyAmount());
						item.xAddToSave($);
					}
				});
			} else {//更新用户在项目的总支出
				if ($.$model.hasChanged("project")) {
					$.$model.xPrevious("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalExpense", item.xGet("actualTotalExpense") - Number((oldAmount * $.$model.xPrevious("exchangeRate")).toFixed(2)));
							item.xAddToSave($);
						}
					});
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalExpense", item.xGet("actualTotalExpense") + $.$model.getProjectCurrencyAmount());
							item.xAddToSave($);
						}
					});
				} else {
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalExpense", item.xGet("actualTotalExpense") - Number((oldAmount * $.$model.xPrevious("exchangeRate")).toFixed(2)) + $.$model.getProjectCurrencyAmount());
							item.xAddToSave($);
						}
					});
				}
			}

			// 生成分摊
			$.$model.generateExpenseApportions(true);
		}

		var oldProjectShareAuthorizations = $.$model.xPrevious("project").xGet("projectShareAuthorizations");
		var projectShareAuthorizations = $.$model.xGet("project").xGet("projectShareAuthorizations");
		var oldDebtAccount, newDebtAccount, debtAccountChanged = [];//debtAccountChanged用来存放修改过的借贷账户，保存出错后将所有修改的借贷账户还原数据
		$.$model.xGet("moneyExpenseApportions").forEach(function(item) {
			if (item.xGet("friendUser").xGet("id") !== Alloy.Models.User.xGet("id")) {//该分摊成员不是支出创建者才更新借贷账户
				oldDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
					accountType : "Debt",
					currencyId : oldMoneyAccount.xGet("currency").xGet("id"),
					friendId : item.xGet("friendUser").getFriend() ? item.xGet("friendUser").getFriend().id : null,
					ownerUserId : Alloy.Models.User.xGet("id")
				});
			}
			if (item.__xDeleted) {//删除
				item.xAddToDelete($);

				if (oldDebtAccount && oldDebtAccount.id) {
					oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") - item.xPrevious("amount"));
					oldDebtAccount.xAddToSave($);
					debtAccountChanged.push(oldDebtAccount);
				}

				projectShareAuthorizations.forEach(function(projectShareAuthorization) {//删除时更新用户在该项目的总支出
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
						projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - Number((item.xPrevious("amount") * item.xGet("moneyExpense").xPrevious("exchangeRate")).toFixed(2)));
						projectShareAuthorization.xAddToSave($);
					}
				});
			} else if (item.__xDeletedHidden) {//修改时切换项目删除的分摊
				item.xAddToDelete($);

				if (oldDebtAccount && oldDebtAccount.id) {
					oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") - item.xPrevious("amount"));
					oldDebtAccount.xAddToSave($);
					debtAccountChanged.push(oldDebtAccount);
				}

				oldProjectShareAuthorizations.forEach(function(projectShareAuthorization) {//删除时更新用户在该项目的总支出
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
						projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - Number((item.xPrevious("amount") * item.xGet("moneyExpense").xPrevious("exchangeRate")).toFixed(2)));
						projectShareAuthorization.xAddToSave($);
					}
				});
			} else {
				item.xAddToSave($);

				if (item.xGet("friendUser").xGet("id") !== Alloy.Models.User.xGet("id")) {//该分摊成员不是支出创建者才更新借贷账户
					newDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						accountType : "Debt",
						currencyId : $.$model.xGet("moneyAccount").xGet("currency").xGet("id"),
						friendId : item.xGet("friendUser").getFriend() ? item.xGet("friendUser").getFriend().id : null,
						ownerUserId : Alloy.Models.User.xGet("id")
					});

					if (item.isNew()) {
						if (newDebtAccount.id) {
							newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") + item.xGet("amount"));
							newDebtAccount.xAddToSave($);
							debtAccountChanged.push(newDebtAccount);
						} else {
							var debAcount = Alloy.createModel("MoneyAccount", {
								name : item.xGet("friendUser").getFriend() ? item.xGet("friendUser").getFriend().id : "匿名借贷账户",
								currency : $.$model.xGet("moneyAccount").xGet("currency"),
								currentBalance : item.xGet("amount"),
								sharingType : "Private",
								accountType : "Debt",
								friend : item.xGet("friendUser").getFriend() ? item.xGet("friendUser").getFriend() : null,
								ownerUser : Alloy.Models.User
							});
							debAcount.xAddToSave($);
						}
					} else {
						if (newDebtAccount.id) {
							if (oldDebtAccount.id === newDebtAccount.id) {
								newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") - item.xPrevious("amount") + item.xGet("amount"));
								newDebtAccount.xAddToSave($);
								debtAccountChanged.push(newDebtAccount);
							} else {
								oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") - item.xPrevious("amount"));
								oldDebtAccount.xAddToSave($);
								debtAccountChanged.push(oldDebtAccount);
								newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") + item.xGet("amount"));
								newDebtAccount.xAddToSave($);
								debtAccountChanged.push(newDebtAccount);
							}
						} else {
							oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") - item.xPrevious("amount"));
							oldDebtAccount.xAddToSave($);
							debtAccountChanged.push(oldDebtAccount);

							var debAcount = Alloy.createModel("MoneyAccount", {
								name : item.xGet("friendUser").getFriend() ? item.xGet("friendUser").getFriend().id : "匿名借贷账户",
								currency : $.$model.xGet("moneyAccount").xGet("currency"),
								currentBalance : item.xGet("amount"),
								sharingType : "Private",
								accountType : "Debt",
								friend : item.xGet("friendUser").getFriend() ? item.xGet("friendUser").getFriend() : null,
								ownerUser : Alloy.Models.User
							});
							debAcount.xAddToSave($);
						}
					}
				}

				projectShareAuthorizations.forEach(function(projectShareAuthorization) {//更新用户的应该支出
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
						if (item.isNew()) {
							projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense + Number((item.xGet("amount") * item.xGet("moneyExpense").xGet("exchangeRate")).toFixed(2)));
						} else {
							projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - Number((item.xPrevious("amount") * item.xGet("moneyExpense").xPrevious("exchangeRate")).toFixed(2)) + Number((item.xGet("amount") * item.xGet("moneyExpense").xGet("exchangeRate")).toFixed(2)));
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
				if ($.$model.xGet("moneyExpenseCategory").xGet("name") !== "早餐" && $.$model.xGet("moneyExpenseCategory").xGet("name") !== "午餐" && $.$model.xGet("moneyExpenseCategory").xGet("name") !== "晚餐" && $.$model.xGet("moneyExpenseCategory").xGet("name") !== "夜宵") {
					$.$model.xGet("project").setDefaultExpenseCategory($.$model.xGet("moneyExpenseCategory"));
				}

				//记住当前账户为下次打开时的默认账户
				// Alloy.Models.User.xGet("userData").xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				// Alloy.Models.User.xGet("userData").xSet("activeProject", $.$model.xGet("project"));
				//直接把activeMoneyAccountId保存到数据库，不经过validation，注意用 {patch : true, wait : true}
				if (Alloy.Models.User.xGet("userData").xGet("activeMoneyAccount") !== $.$model.xGet("moneyAccount") || Alloy.Models.User.xGet("userData").xGet("activeProject") !== $.$model.xGet("project")) {
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
				if (projectShareAuthorization.hasChanged("apportionedTotalExpense")) {
					projectShareAuthorization.xSet("apportionedTotalExpense", projectShareAuthorization.previous("apportionedTotalExpense"));
				}
				if (projectShareAuthorization.xGet("friendUser") === $.$model.xGet("ownerUser")) {
					projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.previous("actualTotalExpense"));
				}
			});
			if ($.$model.isNew()) {
				$.$model.xGet("moneyExpenseApportions").reset();
			}
			saveErrorCB(e);
		});
	};
}

$.amount.rightButton.addEventListener("singletap", function(e) {
	Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
		selectedExpense : $.$model,
		closeWithoutSave : true
	});
});

$.doUIInit = function(currentWindow) {
	$.picture.UIInit($, currentWindow);
	$.friendUser.UIInit($, currentWindow);
	$.date.UIInit($, currentWindow);
	$.amount.UIInit($, currentWindow);
	$.projectAmount.UIInit($, currentWindow);
	$.localAmount.UIInit($, currentWindow);
	$.project.UIInit($, currentWindow);
	$.moneyExpenseCategory.UIInit($, currentWindow);
	$.moneyAccount.UIInit($, currentWindow);
	$.exchangeRate.UIInit($, currentWindow);
	$.friend.UIInit($, currentWindow);
	$.friendAccount.UIInit($, currentWindow);
	$.remark.UIInit($, currentWindow);
	$.titleBar.UIInit($, currentWindow);
};

if ($.$attrs.autoInit === "false" && $.__currentWindow) {
	$.doUIInit($.getCurrentWindow());
}
