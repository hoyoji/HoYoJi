Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "借入操作"
	});
	if (!$.$model.isNew()) {
		menuSection.add($.createContextMenuItem("还款明细", function() {
			Alloy.Globals.openWindow("money/moneyReturnAll", {
				selectedBorrow : $.$model
			});
		}));
	}
	menuSection.add($.createContextMenuItem("导入图片", function() {
		$.picture.importPictureFromGallery();
	}, !$.$model.canEdit()));
	return menuSection;
};

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

$.project.rightButton.addEventListener("singletap", function() {//未输入金额时，不打开分摊
	if ($.amount.getValue()) {
		Alloy.Globals.openWindow("money/moneyBorrowApportionAll", {
			selectedBorrow : $.$model,
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

function updateApportionAmount() {//amount改变，平均分摊也跟着改变
	if ($.$model.xGet("moneyBorrowApportions").length > 0) {
		var fixedTotal = 0;
		var averageApportionsNotDelete = [];
		$.$model.xGet("moneyBorrowApportions").forEach(function(item) {//获取当前固定分摊的总和，平均分摊的每个元素
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
var oldFriend;
var oldApportions = [];

if (!$.$model) {
	if ($.$attrs.addNewAgant) {
		var templateModel = $.$attrs.addNewAgant;
		$.$model = Alloy.createModel("MoneyBorrow", {
			date : (new Date()).toISOString(),
			amount : templateModel.xGet("amount"),
			exchangeRate : templateModel.xGet("exchangeRate"),
			moneyAccount : templateModel.xGet("moneyAccount"),
			project : templateModel.xGet("project"),
			friendUser : templateModel.xGet("friendUser") ? templateModel.xGet("friendUser") : null,
			returnDate : templateModel.xGet("returnDate"),
			returnedAmount : 0,
			ownerUser : Alloy.Models.User
		});
	} else {
		$.$model = Alloy.createModel("MoneyBorrow", {
			date : (new Date()).toISOString(),
			exchangeRate : 1,
			moneyAccount : Alloy.Models.User.xGet("userData").xGet("activeMoneyAccount"),
			project : Alloy.Models.User.xGet("userData").xGet("activeProject"),
			returnedAmount : 0,
			ownerUser : Alloy.Models.User
		});
	}
	$.setSaveableMode("add");
} else {
	$.returnedAmountView.setHeight(42);
}

// if ($.saveableMode === "edit") {
// $.project.label.setColor("#6e6d6d");
// $.project.field.setColor("#6e6d6d");
// }

function updateAccountBalance() {
	$.moneyAccount.updateField();
}

$.$model.on("xchange:moneyAccount.currentBalance", updateAccountBalance);
//在借入form新增还款时如果账户金额改变 同时更新借入form的账户金额
$.onWindowCloseDo(function() {
	$.$model.off("xchange:moneyAccount.currentBalance", updateAccountBalance);
});

function deleteApportion(apportionModel) {//从form打开apportion进行删除，只是把该row设成xDeleted 在form保存时才进行真正的删除，删除后要重新计算平均分摊
	var borrowAmount = $.$model.xGet("amount");
	var moneyBorrowApportions = $.$model.xGet("moneyBorrowApportions");
	var averageApportions = [];
	var fixedTotal = 0;
	moneyBorrowApportions.forEach(function(item) {
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
		var average = Number(((borrowAmount - fixedTotal) / averageApportions.length).toFixed(2));
		var averageTotal = 0;
		for (var i = 0; i < averageApportions.length - 1; i++) {
			averageApportions[i].xSet("amount", average);
			averageTotal += average;
		}
		averageApportions[averageApportions.length - 1].xSet("amount", borrowAmount - averageTotal - fixedTotal);
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

var apportionsDirty = false;
function updateApportions() {
	if (!apportionsDirty) {
		$.becameDirty();
		apportionsDirty = true;
	}
}


$.$model.xGet("moneyBorrowApportions").on("xdelete", deleteApportion);
$.$model.xGet("moneyBorrowApportions").on("add _xchange xdelete", updateApportions);

$.onWindowCloseDo(function() {
	$.$model.xGet("moneyBorrowApportions").off("xdelete", deleteApportion);
	$.$model.xGet("moneyBorrowApportions").off("add _xchange xdelete", updateApportions);
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
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	});

	oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	if (!$.$model.xGet("localFriend")) {
		oldFriend = $.convertUser2FriendModel($.$model.xGet("friendUser"));
	} else {
		oldFriend = $.$model.xGet("localFriend");
	}

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
	$.project.field.addEventListener("change", function() {
		if ($.project.getValue()) {
			updateExchangeRate();
			if ($.project.getValue().xGet("projectShareAuthorizations").length > 1) {
				$.project.showRightButton();
			} else {
				$.project.hideRightButton();
			}
		}
		if ($.$model.xGet("moneyBorrowApportions").length > 0) {
			if ($.$model.isNew()) {
				$.$model.xGet("moneyBorrowApportions").reset();
			} else {
				$.$model.xGet("moneyBorrowApportions").forEach(function(item) {
					if (item.isNew()) {
						$.$model.xGet("moneyBorrowApportions").remove(item);
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

		var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");

		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
		}

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

		/*更新借贷账户*/
		var newFriend;
		if (!$.$model.xGet("localFriend")) {
			newFriend = $.convertUser2FriendModel($.$model.xGet("friendUser"));
		} else {
			newFriend = $.$model.xGet("localFriend");
		}
		var oldDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
			accountType : "Debt",
			currencyId : oldMoneyAccount.xGet("currency").xGet("id"),
			friendId : oldFriend ? oldFriend.xGet("id") : null,
			ownerUserId : Alloy.Models.User.xGet("id")
		});

		var newDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
			accountType : "Debt",
			currencyId : $.$model.xGet("moneyAccount").xGet("currency").xGet("id"),
			friendId : newFriend ? newFriend.xGet("id") : null,
			ownerUserId : Alloy.Models.User.xGet("id")
		});

		if ($.$model.isNew()) {
			if (newDebtAccount.id) {
				newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") + oldAmount - newAmount);
				newDebtAccount.xAddToSave($);
			} else {
				var debAcount = Alloy.createModel("MoneyAccount", {
					name :  newFriend ? newFriend.xGet("id") : "匿名借贷账户",
					currency : $.$model.xGet("moneyAccount").xGet("currency"),
					currentBalance : -newAmount,
					sharingType : "Private",
					accountType : "Debt",
					friend : newFriend,
					ownerUser : Alloy.Models.User
				});
				debAcount.xAddToSave($);
			}
		}else {
			if (newDebtAccount.id) {
				if (oldDebtAccount.id === newDebtAccount.id) {
					newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") + oldAmount - newAmount);
					newDebtAccount.xAddToSave($);
				} else {
					oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") + oldAmount);
					oldDebtAccount.xAddToSave($);
					newDebtAccount.xSet("currentBalance", newDebtAccount.xGet("currentBalance") - newAmount);
					newDebtAccount.xAddToSave($);
				}
			}else{
				oldDebtAccount.xSet("currentBalance", oldDebtAccount.xGet("currentBalance") + oldAmount);
				oldDebtAccount.xAddToSave($);
				
				var debAcount = Alloy.createModel("MoneyAccount", {
				name : newFriend ? newFriend.xGet("id") : "匿名借贷账户",
				currency : $.$model.xGet("moneyAccount").xGet("currency"),
				currentBalance : -newAmount,
				sharingType : "Private",
				accountType : "Debt",
				friend : newFriend,
				ownerUser : Alloy.Models.User
			});
			debAcount.xAddToSave($);
			}
		}

		if ($.$model.xGet("project").xGet("projectShareAuthorizations").length > 0) {
			if ($.$model.isNew()) {
				$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
					if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
						item.xSet("actualTotalBorrow", item.xGet("actualTotalBorrow") + $.$model.getProjectCurrencyAmount());
						item.xAddToSave($);
					}
				});
			} else {
				if ($.$model.hasChanged("project")) {
					$.$model.xPrevious("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalBorrow", item.xGet("actualTotalBorrow") - Number((oldAmount * $.$model.xPrevious("exchangeRate")).toFixed(2)));
							item.xAddToSave($);
						}
					});
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalBorrow", item.xGet("actualTotalBorrow") + $.$model.getProjectCurrencyAmount());
							item.xAddToSave($);
						}
					});
				} else {
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalBorrow", item.xGet("actualTotalBorrow") - Number((oldAmount * $.$model.xPrevious("exchangeRate")).toFixed(2)) + $.$model.getProjectCurrencyAmount());
							item.xAddToSave($);
						}
					});
				}
			}
			// 生成分摊
			$.$model.generateBorrowApportions(true);
		}

		var oldProjectShareAuthorizations = $.$model.xPrevious("project").xGet("projectShareAuthorizations");
		var projectShareAuthorizations = $.$model.xGet("project").xGet("projectShareAuthorizations");
		$.$model.xGet("moneyBorrowApportions").forEach(function(item) {

			if (item.__xDeleted) {//删除
				item.xAddToDelete($);

				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalBorrow = projectShareAuthorization.xGet("apportionedTotalBorrow") || 0;
						projectShareAuthorization.xSet("apportionedTotalBorrow", apportionedTotalBorrow - Number((item.xPrevious("amount") * item.xGet("moneyBorrow").xPrevious("exchangeRate")).toFixed(2)));
						projectShareAuthorization.xAddToSave($);
					}
				});
			} else if (item.__xDeletedHidden) {//修改时切换项目删除的分摊
				item.xAddToDelete($);

				oldProjectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalBorrow = projectShareAuthorization.xGet("apportionedTotalBorrow") || 0;
						projectShareAuthorization.xSet("apportionedTotalBorrow", apportionedTotalBorrow - Number((item.xPrevious("amount") * item.xGet("moneyBorrow").xPrevious("exchangeRate")).toFixed(2)));
						projectShareAuthorization.xAddToSave($);
					}
				});
			} else {
				item.xAddToSave($);
				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
						var apportionedTotalBorrow = projectShareAuthorization.xGet("apportionedTotalBorrow") || 0;
						if (item.isNew()) {
							projectShareAuthorization.xSet("apportionedTotalBorrow", apportionedTotalBorrow + Number((item.xGet("amount") * item.xGet("moneyBorrow").xGet("exchangeRate")).toFixed(2)));
						} else {
							projectShareAuthorization.xSet("apportionedTotalBorrow", apportionedTotalBorrow - Number((item.xPrevious("amount") * item.xGet("moneyBorrow").xPrevious("exchangeRate")).toFixed(2)) + Number((item.xGet("amount") * item.xGet("moneyBorrow").xGet("exchangeRate")).toFixed(2)));
						}
						projectShareAuthorization.xAddToSave($);
					}
				});
			}
		});


		var modelIsNew = $.$model.isNew();
		$.saveModel(function(e) {
			if (modelIsNew) {//记住当前账户为下次打开时的默认账户
				Alloy.Models.User.xGet("userData").xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				Alloy.Models.User.xGet("userData").xSet("activeProject", $.$model.xGet("project"));
				if (Alloy.Models.User.xGet("userData").xGet("activeMoneyAccount") !== $.$model.xGet("moneyAccount") || Alloy.Models.User.xGet("activeProject") !== $.$model.xGet("project")) {
					Alloy.Models.User.xGet("userData").save({
						activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
						activeProjectId : $.$model.xGet("project").xGet("id")
					}, {
						patch : true,
						wait : true
					});
				}
			}

			if (apportionsDirty) {
				$.becameClean();
				apportionsDirty = false;
			}
			saveEndCB(e);
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			if (oldDebtAccount.id) {
				oldDebtAccount.xSet("currentBalance", oldDebtAccount.previous("currentBalance"));
			}
			if (newDebtAccount.id) {
				newDebtAccount.xSet("currentBalance", newDebtAccount.previous("currentBalance"));
			}
			projectShareAuthorizations.forEach(function(projectShareAuthorization) {
				if (projectShareAuthorization.hasChanged("apportionedTotalBorrow")) {
					projectShareAuthorization.xSet("apportionedTotalBorrow", projectShareAuthorization.previous("apportionedTotalBorrow"));
				}
				if (projectShareAuthorization.xGet("friendUser") === $.$model.xGet("ownerUser")) {
					projectShareAuthorization.xSet("actualTotalBorrow", projectShareAuthorization.previous("actualTotalBorrow"));
				}
			});
			// if (exchange) {
			// exchange.xAddToDelete($);
			// }
			if ($.$model.isNew()) {
				$.$model.xGet("moneyBorrowApportions").reset();
				Alloy.Models.User.xGet("userData").xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
				Alloy.Models.User.xGet("userData").xSet("activeProject", Alloy.Models.User.previous("activeProject"));
			}
			saveErrorCB(e);
		});
	};
}

$.picture.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.projectAmount.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.exchangeRate.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.returnDate.UIInit($, $.getCurrentWindow());
$.returnedAmount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());

