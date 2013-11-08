Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "转账操作"
	});
	menuSection.add($.createContextMenuItem("导入图片", function() {
		$.picture.importPictureFromGallery();
	}, !$.$model.canEdit()));
	return menuSection;
};

if (!$.$model) {
	if ($.$attrs.addNewAgant) {
		var templateModel = $.$attrs.addNewAgant;
		$.$model = Alloy.createModel("MoneyTransfer", {
			date : (new Date()).toISOString(),
			exchangeRate : templateModel.xGet("exchangeRate"),
			transferOutUser : Alloy.Models.User,
			transferInUser : Alloy.Models.User,
			transferOut : templateModel.xGet("transferOut"),
			transferIn : templateModel.xGet("transferIn"),
			project : templateModel.xGet("project"),
			transferInAmount : 0,
			ownerUser : Alloy.Models.User
		});
	} else {
		$.$model = Alloy.createModel("MoneyTransfer", {
			date : (new Date()).toISOString(),
			transferOutUser : Alloy.Models.User,
			transferInUser : Alloy.Models.User,
			transferOut : Alloy.Models.User.xGet("activeMoneyAccount"),
			transferIn : Alloy.Models.User.xGet("activeMoneyAccount"),
			exchangeRate : 1,
			transferInAmount : 0,
			project : Alloy.Models.User.xGet("activeProject"),
			ownerUser : Alloy.Models.User
		});
	}
	$.setSaveableMode("add");
}

if ($.saveableMode === "edit") {
	$.project.label.setColor("#6e6d6d");
	$.project.field.setColor("#6e6d6d");
}

var oldTransferOutAmount = $.$model.xGet("transferOutAmount");
var oldTransferInAmount = $.$model.xGet("transferInAmount");
var oldTransferOut = $.$model.xGet("transferOut");
var oldTransferIn = $.$model.xGet("transferIn");
// var oldTransferOutOwnerUser = $.$model.xGet("transferOutOwnerUser");
// var oldTransferInOwnerUser = $.$model.xGet("transferInOwnerUser");

$.onWindowOpenDo(function() {
	setExchangeRate($.$model.xGet("transferOut"), $.$model.xGet("transferIn"));
	updateForeignCurrencyAmount();
	// firstOpenWindow();
	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
});

$.exchangeRate.rightButton.addEventListener("singletap", function(e) {
	if (!$.$model.xGet("transferOut")) {
		alert("请选择转出账户");
		return;
	}
	if (!$.$model.xGet("transferIn")) {
		alert("请选择转入账户");
		return;
	}
	$.exchangeRate.rightButton.setEnabled(false);
	$.exchangeRate.rightButton.showActivityIndicator();
	Alloy.Globals.Server.getExchangeRate($.$model.xGet("transferOut").xGet("currency").id, $.$model.xGet("transferIn").xGet("currency").id, function(rate) {
		$.exchangeRate.setValue(rate);
		$.exchangeRate.field.fireEvent("change");
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
	}, function(e) {
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
		alert(e.__summary.msg);
	});
});

var createRate;
$.transferOut.field.addEventListener("change", updateExchangeRate);
$.transferIn.field.addEventListener("change", updateExchangeRate);
function updateExchangeRate() {
	// if (!$.transferOutOwnerUser.getValue() && !$.transferInOwnerUser.getValue()) {
	if ($.transferOut.getValue() && $.transferIn.getValue()) {
		setExchangeRate($.transferOut.getValue(), $.transferIn.getValue());
	} else {
		$.exchangeRate.$view.setHeight(0);
		$.transferInAmount.$view.setHeight(0);
		$.exchangeRate.setValue(1);
		$.exchangeRate.field.fireEvent("change");
	}
	// }
}

function setExchangeRate(transferOut, transferIn) {
	var exchangeRateValue;
	if (transferOut.xGet("currency").xGet("code") === transferIn.xGet("currency").xGet("code")) {
		createRate = false;
		exchangeRateValue = 1;
		$.exchangeRate.$view.setHeight(0);
		$.transferInAmount.$view.setHeight(0);
	} else {
		var exchanges = transferOut.xGet("currency").getExchanges(transferIn.xGet("currency"));
		if (exchanges.length) {
			createRate = false;
			exchangeRateValue = exchanges.at(0).xGet("rate");
		} else {
			createRate = true;
			exchangeRateValue = null;
			$.transferInAmount.setValue(null);
			$.transferInAmount.field.fireEvent("change");
		}
		$.exchangeRate.$view.setHeight(42);
		$.transferInAmount.$view.setHeight(42);
	}
	$.exchangeRate.setValue(exchangeRateValue);
	$.exchangeRate.field.fireEvent("change");
}

$.amount.field.addEventListener("change", updateForeignCurrencyAmount);
$.exchangeRate.field.addEventListener("change", updateForeignCurrencyAmount);

function updateForeignCurrencyAmount() {
	// if (!$.transferOutOwnerUser.getValue() && !$.transferInOwnerUser.getValue()) {
	var transferOutAmount = $.amount.getValue() || 0;
	if ($.exchangeRate.getValue()) {
		var foreignCurrencyAmount = transferOutAmount * $.exchangeRate.getValue();
		$.transferInAmount.setValue(foreignCurrencyAmount);
		$.transferInAmount.field.fireEvent("change");
	}
	// }
}

$.transferOut.$view.addEventListener("singletap", function() {
	$.transferIn.hideErrorMsg();
});
$.transferIn.$view.addEventListener("singletap", function() {
	$.transferOut.hideErrorMsg();
});

$.transferOutUser.rightButton.addEventListener("singletap", function(e) {
	$.$model.xSet("transferOutUser", Alloy.Models.User);
	$.transferOutUser.refresh();
	$.transferOutUser.field.fireEvent("change");
});

$.transferInUser.rightButton.addEventListener("singletap", function(e) {
	$.$model.xSet("transferInUser", Alloy.Models.User);
	$.transferInUser.refresh();
	$.transferInUser.field.fireEvent("change");
});

//改变转出人，如果转出人自己就显示转出帐户，不是自己就隐藏转出帐户
$.transferOutUser.field.addEventListener("change", function() {
	if ($.$model.xGet("transferOutUser").xGet("id") === Alloy.Models.User.id) {
		$.transferOut.$view.setHeight(42);
	} else {
		$.transferOut.$view.setHeight(0);
		$.$model.xSet("transferOut", null);
		$.transferOut.refresh();
	}
});

//改变转入人，如果转出人自己就显示转入帐户，不是自己就隐藏转入帐户
$.transferInUser.field.addEventListener("change", function() {
	if ($.$model.xGet("transferInUser").xGet("id") === Alloy.Models.User.id) {
		$.transferIn.$view.setHeight(42);
	} else {
		$.transferIn.$view.setHeight(0);
		$.$model.xSet("transferIn", null);
		$.transferIn.refresh();
	}
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
// $.transferOutOwnerUser.field.addEventListener("change", transferToFriend);
// $.transferInOwnerUser.field.addEventListener("change", transferToFriend);
//
// function transferToFriend() {
// if ($.transferOutOwnerUser.getValue() || $.transferInOwnerUser.getValue()) {
// $.$model.xSet("exchangeRate", 1);
// $.exchangeRate.hide();
// if ($.transferOutOwnerUser.getValue()) {
// $.$model.xSet("transferOutAmount", 0);
// $.amount.hide();
// $.transferOut.setValue(null);
// $.transferOut.field.fireEvent("change");
// } else {
// $.transferOut.setValue(Alloy.Models.User.xGet("activeMoneyAccount"));
// $.transferOut.field.fireEvent("change");
// $.amount.show();
// }
// if ($.transferInOwnerUser.getValue()) {
// $.$model.xSet("transferInAmount", 0);
// $.transferInAmount.hide();
// $.transferIn.setValue(null);
// $.transferIn.field.fireEvent("change");
// } else {
// $.transferIn.setValue(Alloy.Models.User.xGet("activeMoneyAccount"));
// $.transferIn.field.fireEvent("change");
// $.transferInAmount.show();
// }
// } else {
// updateExchangeRate();
// }
// }

// function firstOpenWindow() {
// if ($.transferOutOwnerUser.getValue() || $.transferInOwnerUser.getValue()) {
// $.exchangeRate.hide();
// if ($.transferOutOwnerUser.getValue()) {
// $.amount.hide();
// } else {
// $.amount.show();
// }
// if ($.transferInOwnerUser.getValue()) {
// $.transferInAmount.hide();
// } else {
// $.transferInAmount.show();
// }
// }
// }

$.onSave = function(saveEndCB, saveErrorCB) {
	if ($.$model.xGet("project").xGet("ownerUserId") !== Alloy.Models.User.xGet("id")) {
		saveErrorCB("无法在共享来的项目新增转账，请切换项目");
		return;
	}


	$.picture.xAddToSave($);

	var newTransferOutAmount = $.$model.xGet("transferOutAmount");
	var newTransferInAmount = $.$model.xGet("transferInAmount");
	var newTransferOut = $.$model.xGet("transferOut");
	var newTransferIn = $.$model.xGet("transferIn");
	// var newTransferOutOwnerUser = $.$model.xGet("transferOutOwnerUser");
	// var newTransferInOwnerUser = $.$model.xGet("transferInOwnerUser");

	// if ($.$model.isNew()) {
	// if (!newTransferOutOwnerUser) {
	// newTransferOut.xSet("currentBalance", newTransferOut.xGet("currentBalance") - newTransferOutAmount);
	// }
	// if (!newTransferInOwnerUser) {
	// newTransferIn.xSet("currentBalance", newTransferIn.xGet("currentBalance") + newTransferInAmount);
	// }
	// } else {
	// if (!oldTransferOutOwnerUser) {
	// if (!newTransferOutOwnerUser) {
	// if (oldTransferOut.xGet("id") === newTransferOut.xGet("id")) {
	// newTransferOut.xSet("currentBalance", newTransferOut.xGet("currentBalance") + oldTransferOutAmount - newTransferOutAmount);
	// } else {
	// oldTransferOut.xSet("currentBalance", oldTransferOut.xGet("currentBalance") + oldTransferOutAmount);
	// newTransferOut.xSet("currentBalance", newTransferOut.xGet("currentBalance") - newTransferOutAmount);
	// }
	// } else {
	// oldTransferOut.xSet("currentBalance", oldTransferOut.xGet("currentBalance") + oldTransferOutAmount);
	// }
	// } else {
	// if (!newTransferOutOwnerUser) {
	// newTransferOut.xSet("currentBalance", newTransferOut.xGet("currentBalance") - newTransferOutAmount);
	// }
	// }
	// if (!oldTransferInOwnerUser) {
	// if (!newTransferInOwnerUser) {
	// if (oldTransferIn.xGet("id") === newTransferIn.xGet("id")) {
	// newTransferIn.xSet("currentBalance", newTransferIn.xGet("currentBalance") - oldTransferInAmount + newTransferInAmount);
	// } else {
	// oldTransferIn.xSet("currentBalance", oldTransferIn.xGet("currentBalance") - oldTransferInAmount);
	// newTransferIn.xSet("currentBalance", newTransferIn.xGet("currentBalance") + newTransferInAmount);
	// }
	// } else {
	// oldTransferIn.xSet("currentBalance", oldTransferIn.xGet("currentBalance") - oldTransferInAmount);
	// }
	// } else {
	// if (!newTransferInOwnerUser) {
	// newTransferIn.xSet("currentBalance", newTransferIn.xGet("currentBalance") + newTransferInAmount);
	// }
	// }
	// }
	if ($.$model.isNew()) {
		newTransferOut.xSet("currentBalance", newTransferOut.xGet("currentBalance") - newTransferOutAmount);
		newTransferIn.xSet("currentBalance", newTransferIn.xGet("currentBalance") + newTransferInAmount);
	} else {
		if (oldTransferOut.xGet("id") === newTransferOut.xGet("id")) {
			newTransferOut.xSet("currentBalance", newTransferOut.xGet("currentBalance") + oldTransferOutAmount - newTransferOutAmount);
		} else {
			oldTransferOut.xSet("currentBalance", oldTransferOut.xGet("currentBalance") + oldTransferOutAmount);
			newTransferOut.xSet("currentBalance", newTransferOut.xGet("currentBalance") - newTransferOutAmount);
		}
		if (oldTransferIn.xGet("id") === newTransferIn.xGet("id")) {
			newTransferIn.xSet("currentBalance", newTransferIn.xGet("currentBalance") - oldTransferInAmount + newTransferInAmount);
		} else {
			oldTransferIn.xSet("currentBalance", oldTransferIn.xGet("currentBalance") - oldTransferInAmount);
			newTransferIn.xSet("currentBalance", newTransferIn.xGet("currentBalance") + newTransferInAmount);
		}
	}
	if (oldTransferOut) {
		oldTransferOut.xAddToSave($);
	}
	if (oldTransferIn) {
		oldTransferIn.xAddToSave($);
	}
	newTransferOut.xAddToSave($);
	newTransferIn.xAddToSave($);

	var exchange;
	if (createRate && $.$model.xGet("exchangeRate")) {//若汇率不存在 ，保存时自动新建一条
		exchange = Alloy.createModel("Exchange", {
			localCurrency : $.$model.xGet("transferOut").xGet("currency"),
			foreignCurrency : $.$model.xGet("transferIn").xGet("currency"),
			rate : $.$model.xGet("exchangeRate"),
			ownerUser : Alloy.Models.User
		});
		exchange.xAddToSave($);
	}
	var modelIsNew = $.$model.isNew();
	$.saveModel(function(e) {
		if (modelIsNew) {//记住project为下次打开时project
			Alloy.Models.User.save({
				activeProjectId : $.$model.xGet("project").xGet("id")
			}, {
				patch : true,
				wait : true
			});
		}
		saveEndCB(e);
	}, function(e) {
		if (oldTransferOut) {
			oldTransferOut.xSet("currentBalance", oldTransferOut.previous("currentBalance"));
		}
		if (oldTransferIn) {
			oldTransferIn.xSet("currentBalance", oldTransferIn.previous("currentBalance"));
		}
		// if (exchange) {
		// exchange.xAddToDelete($);
		// }
		newTransferOut.xSet("currentBalance", newTransferOut.previous("currentBalance"));
		newTransferIn.xSet("currentBalance", newTransferIn.previous("currentBalance"));
		saveErrorCB(e);
	});
};

$.picture.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.transferOutUser.UIInit($, $.getCurrentWindow());
$.transferInUser.UIInit($, $.getCurrentWindow());
$.transferOut.UIInit($, $.getCurrentWindow());
$.transferIn.UIInit($, $.getCurrentWindow());
$.exchangeRate.UIInit($, $.getCurrentWindow());
$.transferInAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());

