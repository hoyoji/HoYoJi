Alloy.Globals.extendsBaseFormController($, arguments[0]);

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyTransfer", {
		date : (new Date()).toISOString(),
		transferOut : Alloy.Models.User.xGet("activeMoneyAccount"),
		transferIn : Alloy.Models.User.xGet("activeMoneyAccount"),
		exchangeCurrencyRate : 1,
		transferOutAmount : 0,
		transferInAmount : 0,
		project : Alloy.Models.User.xGet("activeProject"),
	});
	$.setSaveableMode("add");
}
var oldTransferOutAmount = $.$model.xGet("transferOutAmount");
var oldTransferInAmount = $.$model.xGet("transferInAmount");
var oldTransferOut = $.$model.xGet("transferOut");
var oldTransferIn = $.$model.xGet("transferIn");
// var oldTransferOutOwnerUser = $.$model.xGet("transferOutOwnerUser");
// var oldTransferInOwnerUser = $.$model.xGet("transferInOwnerUser");

$.onWindowOpenDo(function() {
	setExchangeCurrencyRate($.$model.xGet("transferOut"), $.$model.xGet("transferIn"));
	updateForeignCurrencyAmount();
	// firstOpenWindow();
	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
});

var createRate;
$.transferOut.field.addEventListener("change", updateExchangeCurrencyRate);
$.transferIn.field.addEventListener("change", updateExchangeCurrencyRate);
function updateExchangeCurrencyRate(transferOut, transferIn) {
	// if (!$.transferOutOwnerUser.getValue() && !$.transferInOwnerUser.getValue()) {
		if ($.transferOut.getValue() && $.transferIn.getValue()) {
			setExchangeCurrencyRate($.transferOut.getValue(), $.transferIn.getValue());
		} else {
			$.exchangeCurrencyRate.hide();
			$.transferInAmount.hide();
			$.exchangeCurrencyRate.setValue(1);
			$.exchangeCurrencyRate.field.fireEvent("change");
		}
	// }
}

function setExchangeCurrencyRate(transferOut, transferIn) {
	var exchangeCurrencyRateValue;
	if (transferOut.xGet("currency").xGet("code") === transferIn.xGet("currency").xGet("code")) {
		createRate = false;
		exchangeCurrencyRateValue = 1;
		$.exchangeCurrencyRate.hide();
		$.transferInAmount.hide();
	} else {
		var exchanges = transferOut.xGet("currency").getExchanges(transferIn.xGet("currency"));
		if (exchanges.length) {
			createRate = false;
			exchangeCurrencyRateValue = exchanges.at(0).xGet("rate");
		} else {
			createRate = true;
			exchangeCurrencyRateValue = null;
		}
		$.exchangeCurrencyRate.show();
		$.transferInAmount.show();
	}
	$.exchangeCurrencyRate.setValue(exchangeCurrencyRateValue);
	$.exchangeCurrencyRate.field.fireEvent("change");
}

$.amount.field.addEventListener("change", updateForeignCurrencyAmount);
$.exchangeCurrencyRate.field.addEventListener("change", updateForeignCurrencyAmount);

function updateForeignCurrencyAmount() {
	// if (!$.transferOutOwnerUser.getValue() && !$.transferInOwnerUser.getValue()) {
		if ($.amount.getValue() && $.exchangeCurrencyRate.getValue()) {
			var foreignCurrencyAmount = ($.amount.getValue() / $.exchangeCurrencyRate.getValue()).toUserCurrency();
			$.transferInAmount.setValue(foreignCurrencyAmount);
			$.transferInAmount.field.fireEvent("change");
		}
	// }
}

// $.transferOutOwnerUser.field.addEventListener("change", transferToFriend);
// $.transferInOwnerUser.field.addEventListener("change", transferToFriend);
//
// function transferToFriend() {
// if ($.transferOutOwnerUser.getValue() || $.transferInOwnerUser.getValue()) {
// $.$model.xSet("exchangeCurrencyRate", 1);
// $.exchangeCurrencyRate.hide();
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
// updateExchangeCurrencyRate();
// }
// }

// function firstOpenWindow() {
// if ($.transferOutOwnerUser.getValue() || $.transferInOwnerUser.getValue()) {
// $.exchangeCurrencyRate.hide();
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
	if (newTransferOut) {
		newTransferOut.xAddToSave($);
	}
	if (newTransferIn) {
		newTransferIn.xAddToSave($);
	}
	if (createRate) {//若汇率不存在 ，保存时自动新建一条
		var exchange = Alloy.createModel("Exchange", {
			localCurrency : $.$model.xGet("transferOut").xGet("currency"),
			foreignCurrency : $.$model.xGet("transferIn").xGet("currency"),
			rate : $.$model.xGet("exchangeCurrencyRate")
		});
		exchange.xAddToSave($);
	}
	var modelIsNew = $.$model.isNew();
	$.saveModel(function(e) {
		if ($.$model.isNew()) {//记住project为下次打开时project
			Alloy.Models.User.save({
				activeProjectId : $.$model.xGet("project").xGet("id")
			}, {
				patch : true,
				wait : true
			});
		}
		saveEndCB(e);
	}, saveErrorCB);
}
