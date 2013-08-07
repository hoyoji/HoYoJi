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
	return menuSection;
}

$.apportion.addEventListener("singletap", function() {
	if ($.amount.getValue()) {
		Alloy.Globals.openWindow("money/moneyExpenseApportionAll", {
			selectedExpense : $.$model,
			closeWithoutSave : true
		});
	} else {
		alert("请先输入金额,再调整分摊");
	}
});

$.exchangeRate.rightButton.addEventListener("singletap", function(e) {
	if(!$.$model.xGet("moneyAccount")){
		alert("请选择账户");
		return;
	}
	if(!$.$model.xGet("project")){
		alert("请选择项目");
		return;
	}
	Alloy.Globals.Server.getExchangeRate(
		$.$model.xGet("moneyAccount").xGet("currency").id,
		$.$model.xGet("project").xGet("currency").id,
		function(rate){
			$.exchangeRate.setValue(rate);
			$.exchangeRate.field.fireEvent("change");
		},
		function(e){
			alert(e);
		}
	);
});

function updateApportionAmount() {
	if ($.$model.xGet("moneyExpenseApportions").length > 0) {
		var fixedTotal = 0;
		var averageApportionsNotDelete = [];
		$.$model.xGet("moneyExpenseApportions").forEach(function(item) {
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
var oldApportions = [];

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyExpense", {
		date : (new Date()).toISOString(),
		exchangeRate : 1,
		expenseType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyExpenseCategory : Alloy.Models.User.xGet("activeProject") ? Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory") : null,
		ownerUser : Alloy.Models.User
	});

	$.setSaveableMode("add");
}

function updateAmount() {
	$.amount.setValue($.$model.xGet("amount"));
	$.amount.field.fireEvent("change");
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
	var average = 0;
	if (apportionModel.xGet("apportionType") === "Average") {
		if (averageApportions.length > 0) {
			average = (expenseAmount - fixedTotal) / averageApportions.length;
		}
	} else {
		average = (expenseAmount - fixedTotal + apportionModel.xGet("amount")) / (averageApportions.length);
	}
	var averageTotal = 0;
	averageApportions.forEach(function(item) {
		item.xSet("amount", average);
		averageTotal += average;
	});
	if ((averageTotal !== $.$model.xGet("amount") - fixedTotal) && averageApportions.length > 3) {
		averageApportions[averageApportions.length - 1].xSet("amount", average + ($.amount.getValue() - fixedTotal - averageTotal));
	}
}

$.onWindowOpenDo(function() {
	$.$model.on("xchange:amount", updateAmount);
	// $.$model.xGet("moneyExpenseDetails").on("xdelete", deleteDetail);//隐藏功能,使用明细金额作为收支金额
	$.$model.xGet("moneyExpenseApportions").on("xdelete", deleteApportion);

	if ($.$model.xGet("project") && $.$model.xGet("project").xGet("projectShareAuthorizations").length < 2) {
		$.apportion.$view.setHeight(0);
	} else {
		$.apportion.$view.setHeight(42);
	}
});

$.onWindowCloseDo(function() {
	$.$model.off("xchange:amount", updateAmount);
	// $.$model.xGet("moneyExpenseDetails").off("xdelete", deleteDetail);//隐藏功能,使用明细金额作为收支金额
	$.$model.xGet("moneyExpenseApportions").off("xdelete", deleteApportion);
});

if ($.$model.xGet("ownerUser") !== Alloy.Models.User) {
	$.localAmountContainer.setHeight(84);
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
	$.moneyAccount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
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
	}
	oldMoneyAccount = $.$model.xGet("moneyAccount");
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
		if (moneyAccount.xGet("currency") === model.xGet("project").xGet("currency")) {
			isRateExist = true;
			exchangeRateValue = 1;
			$.exchangeRate.$view.setHeight(0);
		} else {
			var exchanges = moneyAccount.xGet("currency").getExchanges(model.xGet("project").xGet("currency"));
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

	var projectFirstChangeFlag;
	var oldProject = $.$model.xGet("project");
	$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
		if ($.project.getValue()) {
			updateExchangeRate();
			var defaultExpenseCategory = $.project.getValue().xGet("defaultExpenseCategory");
			$.moneyExpenseCategory.setValue(defaultExpenseCategory);
			$.moneyExpenseCategory.field.fireEvent("change");
			if ($.project.getValue().xGet("projectShareAuthorizations").length < 2) {
				$.apportion.$view.setHeight(0);
			} else {
				$.apportion.$view.setHeight(42);
			}
		} else {
			$.apportion.$view.setHeight(0);
		}

		if ($.$model.xGet("moneyExpenseApportions").length > 0) {
			// collection = $.$model.xGet("moneyExpenseApportions");
			// $.moneyExpenseApportionsTable.removeCollection(collection);
			if ($.project.getValue() !== oldProject && !projectFirstChangeFlag) {
				projectFirstChangeFlag = true;
				console.info("projectFirstChangeFlag++++++" + projectFirstChangeFlag);
				$.$model.xGet("moneyExpenseApportions").forEach(function(item) {
					// oldApportions.push(item);
					if (item.isNew()) {
						console.info("aaaaaaaaaaaaaaa");
						$.$model.xGet("moneyExpenseApportions").remove(item);
					} else {
						item.__xDeletedHidden = true;
						console.info("bbbbbbbbbbbbb");
					}
				});
			}
			// $.$model.xGet("moneyExpenseApportions").reset();
			// console.info("reset++++++");
		}
		if ($.project.getValue() === oldProject) {
			// console.info("oldApportions1++++++"+oldApportions.length);
			// oldApportions.forEach(function(item) {
			// $.$model.xGet("moneyExpenseApportions").add(item);
			// });
			$.$model.xGet("moneyExpenseApportions").forEach(function(item) {
				if (item.isNew()) {
					$.$model.xGet("moneyExpenseApportions").remove(item);
				} else {
					item.__xDeletedHidden = false;
				}
			});

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

		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
			if ($.$model.xGet("exchangeRate")) {
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
			if ($.$model.isNew()) {
				$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
					if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
						item.xSet("actualTotalExpense", item.xGet("actualTotalExpense") + $.$model.getProjectCurrencyAmount());
						item.xAddToSave($);
					}
				});
			} else {
				if ($.$model.hasChanged("project")) {
					$.$model.xPrevious("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalExpense", item.xGet("actualTotalExpense") - oldAmount*$.$model.xPrevious("exchangeRate"));
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
							item.xSet("actualTotalExpense", item.xGet("actualTotalExpense") - oldAmount*$.$model.xPrevious("exchangeRate") + $.$model.getProjectCurrencyAmount());
							item.xAddToSave($);
						}
					});
				}
			}

			// 生成分摊
			$.$model.generateExpenseApportions();
		}
		// else if ($.$model.xGet("project").xGet("projectShareAuthorizations").length === 1) {
		// var projectShareAuthorization = $.$model.xGet("project").xGet("projectShareAuthorizations").at[0];
		// projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.xGet("actualTotalExpense") + $.$model.xGet("amount"));
		// projectShareAuthorization.xSet("apportionedTotalExpense", projectShareAuthorization.xGet("apportionedTotalExpense") + $.$model.xGet("amount"));
		// projectShareAuthorization.xAddToSave($);
		// }
		if ($.$model.hasChanged("project") && !$.$model.isNew()) {
			var oldProjectShareAuthorizations = $.$model.xPrevious("project").xGet("projectShareAuthorizations");
			var newProjectShareAuthorizations = $.$model.xGet("project").xGet("projectShareAuthorizations");
			$.$model.xGet("moneyExpenseApportions").forEach(function(item) {
				console.info("__xDeletedHidden+++++++" + item.__xDeletedHidden);
				if (item.__xDeletedHidden) {
					item.xAddToDelete($);

					oldProjectShareAuthorizations.forEach(function(projectShareAuthorization) {
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
							projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - item.xPrevious("amount")*item.xGet("moneyExpense").xPrevious("exchangeRate"));
							projectShareAuthorization.xAddToSave($);
						}
					});
				} else/*if (item.hasChanged())*/
				{
					item.xAddToSave($);

					newProjectShareAuthorizations.forEach(function(projectShareAuthorization) {
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
							projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense + item.xGet("amount")*item.xGet("moneyExpense").xGet("exchangeRate"));
							projectShareAuthorization.xAddToSave($);
						}
					});
				}
			});
		} else {
			var projectShareAuthorizations = $.$model.xGet("project").xGet("projectShareAuthorizations");
			$.$model.xGet("moneyExpenseApportions").forEach(function(item) {
				console.info("__xDeletedHidden+++++++" + item.__xDeletedHidden);
				if (item.__xDeleted) {
					item.xAddToDelete($);

					projectShareAuthorizations.forEach(function(projectShareAuthorization) {
						console.info("++++++++++++aas++++" + (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")));
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							console.info("++++++++++++aasd++++");
							var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
							console.info("+++++delete0++" + projectShareAuthorization.xGet("apportionedTotalExpense"));
							projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - item.xPrevious("amount")*item.xGet("moneyExpense").xPrevious("exchangeRate"));
							console.info("+++++delete1++" + projectShareAuthorization.xGet("apportionedTotalExpense"));
							projectShareAuthorization.xAddToSave($);
						}
					});
				} else/*if (item.hasChanged())*/
				{
					item.xAddToSave($);
					projectShareAuthorizations.forEach(function(projectShareAuthorization) {
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
							console.info("+++++xPrevious0++" + projectShareAuthorization.xGet("apportionedTotalExpense"));
							if (item.isNew() || $.$model.hasChanged("project")) {
								console.info("+++++xPrevious0++" + projectShareAuthorization.xGet("apportionedTotalExpense"));
								projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense + item.xGet("amount")*item.xGet("moneyExpense").xGet("exchangeRate"));
								console.info("+++++xPrevious1++" + projectShareAuthorization.xGet("apportionedTotalExpense") + "__________" + item.xGet("amount"));
							} else {
								projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - item.xPrevious("amount")*item.xGet("moneyExpense").xPrevious("exchangeRate") + item.xGet("amount")*item.xGet("moneyExpense").xGet("exchangeRate"));
								console.info("+++++xPrevious2++" + projectShareAuthorization.xGet("apportionedTotalExpense") + "++++xPrevious++++" + item.xPrevious("amount") + "+++++++++++amount+++" + item.xGet("amount"));
							}
							projectShareAuthorization.xAddToSave($);
						}
					});
				}
			});
		}

		var modelIsNew = $.$model.isNew();
		$.saveModel(function(e) {
			if (modelIsNew) {
				//记住当前分类为下次打开时的默认分类
				$.$model.xGet("project").setDefaultExpenseCategory($.$model.xGet("moneyExpenseCategory"));

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
			saveEndCB(e);
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			projectShareAuthorizations.forEach(function(projectShareAuthorization) {
				if (projectShareAuthorization.hasChanged("apportionedTotalExpense")) {
					projectShareAuthorization.xSet("apportionedTotalExpense", projectShareAuthorization.previous("apportionedTotalExpense"));
				}
				if (projectShareAuthorization.xGet("friendUser") === $.$model.xGet("ownerUser")) {
					projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.previous("actualTotalExpense"));
				}
			});
			saveErrorCB(e);
		});
	}
}

$.amount.rightButton.addEventListener("singletap", function(e) {
	Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
		selectedExpense : $.$model,
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
$.moneyExpenseCategory.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
// $.exchangeRate.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.apportion.UIInit($, $.getCurrentWindow());

