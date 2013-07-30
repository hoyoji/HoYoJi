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
	return menuSection;
}

$.apportion.addEventListener("singletap", function() {
	Alloy.Globals.openWindow("money/moneyIncomeApportionAll", {
		selectedIncome : $.$model,
		closeWithoutSave : true
	});
});

function updateApportionAmount() {
	if ($.$model.xGet("moneyIncomeApportions").length > 0) {
		var fixedApportions = $.$model.xGet("moneyIncomeApportions").xCreateFilter({
			apportionType : "Fixed"
		});
		var averageApportions = $.$model.xGet("moneyIncomeApportions").xCreateFilter({
			apportionType : "Average"
		});
		var fixedTotal = 0;
		fixedApportions.forEach(function(item) {
			fixedTotal = fixedTotal + item.xGet("amount");
		});
		var averageApportionsNotDelete = [];
		averageApportions.forEach(function(item){
			if(!item.__xDeleted){
				averageApportionsNotDelete.push(item);
			}
		});
		var average = ($.amount.getValue() - fixedTotal ) / averageApportionsNotDelete.length;
		averageApportions.forEach(function(item) {
			if (item.__xDeleted) {
				item.xSet("amount", 0);
			} else {
				item.xSet("amount", average);
			}
		});
		// if (averageApportions.length === 0) {
			// fixedApportions.forEach(function(item) {
				// if (item.__xDeleted) {
					// item.xSet("amount", 0);
				// } else {
					// item.xSet("amount", $.amount.getValue() * (item.getSharePercentage() / 100));
				// }
			// });
		// }
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
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		localAmount : 0,
		exchangeRate : 1,
		incomeType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyIncomeCategory : Alloy.Models.User.xGet("activeProject") ? Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory") : null,
		ownerUser : Alloy.Models.User
	});

	$.setSaveableMode("add");
}

function updateAmount() {
	$.amount.setValue($.$model.xGet("amount"));
	$.amount.field.fireEvent("change");
}

function deleteDetail(detailModel) {
	if ($.$model.xGet("useDetailsTotal") || $.$model.isNew() && !$.$model.hasChanged("useDetailsTotal")) {
		$.$model.xSet("amount", $.$model.xGet("amount") - detailModel.xGet("amount"));
		updateAmount();
	}
}

function deleteApportion(apportionModel) {
	var incomeAmount = $.$model.xGet("amount");
	var moneyIncomeApportions = $.$model.xGet("moneyIncomeApportions");
	var averageApportions = [];
	var fixedTotal = 0;
	moneyIncomeApportions.forEach(function(item) {
		if (item.xGet("apportionType") === "Fixed") {
			fixedTotal = fixedTotal + item.xGet("amount");
		} else {
			averageApportions.push(item);
		}
	});
	var average = 0;
	if (apportionModel.xGet("apportionType") === "Average") {
		if (averageApportions.length > 0) {
			average = (incomeAmount - fixedTotal) / (averageApportions.length - 1);
		}
	} else {
		average = (incomeAmount - fixedTotal + apportionModel.xGet("amount")) / (averageApportions.length);
	}
	averageApportions.forEach(function(item) {
		if (item.__xDeleted) {
			item.xSet("amount", 0);
		} else {
			item.xSet("amount", average);
		}
	});

}

$.onWindowOpenDo(function() {
	$.$model.on("xchange:amount", updateAmount);
	$.$model.xGet("moneyIncomeDetails").on("xdelete", deleteDetail);
	$.$model.xGet("moneyIncomeApportions").on("xdelete", deleteApportion);

	if ($.$model.xGet("project") && $.$model.xGet("project").xGet("projectShareAuthorizations").length < 2) {
		$.apportion.$view.setHeight(0);
	} else {
		$.apportion.$view.setHeight(42);
	}

});
$.onWindowCloseDo(function() {
	$.$model.off("xchange:amount", updateAmount);
	$.$model.xGet("moneyIncomeDetails").off("xdelete", deleteDetail);
	$.$model.xGet("moneyIncomeApportions").off("xdelete", deleteApportion);
});

if ($.saveableMode === "read") {
	// $.setSaveableMode("read");
	// $.exchangeRate.hide();
	// $.moneyAccount.hide();
	// $.localAmountContainer.show();
	// $.ownerUser.show();
	// $.amount.hide();

	$.localAmountContainer.setHeight(42);
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
	$.moneyAccount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		// $.localAmountContainer.hide();
		// $.ownerUser.hide();
		// $.localAmountContainer.setHeight(0);
		// $.ownerUser.setHeight(0);
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("localCurrency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	});

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

var projectFirstChangeFlag;
	var oldProject = $.$model.xGet("project");
	$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
		if ($.project.getValue()) {
			var defaultIncomeCategory = $.project.getValue().xGet("defaultIncomeCategory");
			$.moneyIncomeCategory.setValue(defaultIncomeCategory);
			$.moneyIncomeCategory.field.fireEvent("change");
			if ($.project.getValue().xGet("projectShareAuthorizations").length < 2) {
				$.apportion.$view.setHeight(0);
			} else {
				$.apportion.$view.setHeight(42);
			}
		} else {
			$.apportion.$view.setHeight(0);
		}
		if ($.$model.xGet("moneyIncomeApportions").length > 0) {
			// collection = $.$model.xGet("moneyIncomeApportions");
			// $.moneyIncomeApportionsTable.removeCollection(collection);
			if ($.project.getValue() !== oldProject && !projectFirstChangeFlag) {
				projectFirstChangeFlag = true;
				console.info("projectFirstChangeFlag++++++" + projectFirstChangeFlag);
				$.$model.xGet("moneyIncomeApportions").forEach(function(item) {
					// oldApportions.push(item);
					if (item.isNew()) {
						console.info("aaaaaaaaaaaaaaa");
						$.$model.xGet("moneyIncomeApportions").remove(item);
					} else {
						item.__xDeletedHidden = true;
						console.info("bbbbbbbbbbbbb");
					}
				});
			}
			// $.$model.xGet("moneyIncomeApportions").reset();
			// console.info("reset++++++");
		}
		if ($.project.getValue() === oldProject) {
			// console.info("oldApportions1++++++"+oldApportions.length);
			// oldApportions.forEach(function(item) {
			// $.$model.xGet("moneyIncomeApportions").add(item);
			// });
			$.$model.xGet("moneyIncomeApportions").forEach(function(item) {
				if (item.isNew()) {
					$.$model.xGet("moneyIncomeApportions").remove(item);
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

		if ($.$model.xGet("project").xGet("projectShareAuthorizations").length > 0) {
			if ($.$model.isNew()) {
				$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
					if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
						item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") + $.$model.xGet("amount"));
						item.xAddToSave($);
					}
				});
			} else {
				if ($.$model.hasChanged("project")) {
					$.$model.xPrevious("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") - oldAmount);
							item.xAddToSave($);
						}
					});
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") + $.$model.xGet("amount"));
							item.xAddToSave($);
						}
					});
				} else {
					$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === $.$model.xGet("ownerUser")) {
							item.xSet("actualTotalIncome", item.xGet("actualTotalIncome") - oldAmount + $.$model.xGet("amount"));
							item.xAddToSave($);
						}
					});
				}
			}

			var moneyIncomeApportionsArray = [];
			$.$model.xGet("moneyIncomeApportions").forEach(function(item) {
				if (!item.__xDeletedHidden) {
					moneyIncomeApportionsArray.push(item);
				}
			});
			if (moneyIncomeApportionsArray.length < 1) {
				$.$model.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("state") === "Accept") {
						var moneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
							moneyIncome : $.$model,
							friendUser : projectShareAuthorization.xGet("friendUser"),
							amount : $.$model.xGet("amount") * (projectShareAuthorization.xGet("sharePercentage") / 100),
							apportionType : "Fixed"
						});
						$.$model.xGet("moneyIncomeApportions").add(moneyIncomeApportion);
					}
				});
			}
		}
		// else if ($.$model.xGet("project").xGet("projectShareAuthorizations").length === 1) {
		// var projectShareAuthorization = $.$model.xGet("project").xGet("projectShareAuthorizations").at[0];
		// projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") + $.$model.xGet("amount"));
		// projectShareAuthorization.xSet("apportionedTotalIncome", projectShareAuthorization.xGet("apportionedTotalIncome") + $.$model.xGet("amount"));
		// projectShareAuthorization.xAddToSave($);
		// }
		if ($.$model.hasChanged("project") && !$.$model.isNew()) {
			var oldProjectShareAuthorizations = $.$model.xPrevious("project").xGet("projectShareAuthorizations");
			var newProjectShareAuthorizations = $.$model.xGet("project").xGet("projectShareAuthorizations");
			$.$model.xGet("moneyIncomeApportions").map(function(item) {
				console.info("__xDeletedHidden+++++++" + item.__xDeletedHidden);
				if (item.__xDeletedHidden) {
					item.xAddToDelete($);

					oldProjectShareAuthorizations.forEach(function(projectShareAuthorization) {
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
							projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - item.xPrevious("amount"));
							projectShareAuthorization.xAddToSave($);
						}
					});
				} else/*if (item.hasChanged())*/
				{
					item.xAddToSave($);

					newProjectShareAuthorizations.forEach(function(projectShareAuthorization) {
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
							projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome + item.xGet("amount"));
							projectShareAuthorization.xAddToSave($);
						}
					});
				}
			});
		} else {
			var projectShareAuthorizations = $.$model.xGet("project").xGet("projectShareAuthorizations");
			$.$model.xGet("moneyIncomeApportions").map(function(item) {
				console.info("__xDeletedHidden+++++++" + item.__xDeletedHidden);
				if (item.__xDeleted) {
					item.xAddToDelete($);

					projectShareAuthorizations.forEach(function(projectShareAuthorization) {
						console.info("++++++++++++aas++++" + (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")));
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							console.info("++++++++++++aasd++++");
							var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
							console.info("+++++delete0++" + projectShareAuthorization.xGet("apportionedTotalIncome"));
							projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - item.xPrevious("amount"));
							console.info("+++++delete1++" + projectShareAuthorization.xGet("apportionedTotalIncome"));
							projectShareAuthorization.xAddToSave($);
						}
					});
				} else/*if (item.hasChanged())*/
				{
					item.xAddToSave($);
					projectShareAuthorizations.forEach(function(projectShareAuthorization) {
						if (projectShareAuthorization.xGet("friendUser") === item.xGet("friendUser")) {
							var apportionedTotalIncome = projectShareAuthorization.xGet("apportionedTotalIncome") || 0;
							if (item.isNew() || $.$model.hasChanged("project")) {
								console.info("+++++xPrevious0++" + projectShareAuthorization.xGet("apportionedTotalIncome"));
								projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome + item.xGet("amount"));
								console.info("+++++xPrevious1++" + projectShareAuthorization.xGet("apportionedTotalIncome"));
							} else {
								projectShareAuthorization.xSet("apportionedTotalIncome", apportionedTotalIncome - item.xPrevious("amount") + item.xGet("amount"));
								console.info("+++++xPrevious2++" + projectShareAuthorization.xGet("apportionedTotalIncome"));
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
			saveEndCB(e)
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			projectShareAuthorizations.forEach(function(projectShareAuthorization) {
				if (projectShareAuthorization.hasChanged("apportionedTotalIncome")) {
					projectShareAuthorization.xSet("apportionedTotalIncome", projectShareAuthorization.previous("currentBalance"));
				}
				if (projectShareAuthorization.xGet("friendUser") === $.$model.xGet("ownerUser")) {
					projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.previous("actualTotalIncome"));
				}
			});
			saveErrorCB(e);
		});
	}
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
$.localAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyIncomeCategory.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.exchangeRate.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.apportion.UIInit($, $.getCurrentWindow());

