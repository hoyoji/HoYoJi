Alloy.Globals.extendsBaseFormController($, arguments[0]);

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyTransfer", {
		date : (new Date()).toISOString(),
		transferOut : Alloy.Models.User.xGet("activeMoneyAccount"),
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
var oldTransferInt = $.$model.xGet("transferIn");

$.onWindowOpenDo(function() {
	updateExchangeCurrencyRate();
	updateForeignCurrencyAmount();
	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
});

var isRateExist;
$.transferOut.field.addEventListener("change", updateExchangeCurrencyRate);
$.transferIn.field.addEventListener("change", updateExchangeCurrencyRate);
function updateExchangeCurrencyRate() {
	var exchangeCurrencyRateValue;
	if ($.transferOut.getValue() && $.transferIn.getValue()) {
		var transferOut = $.transferOut.getValue();
		var transferIn = $.transferIn.getValue();
		if (transferOut.xGet("currency") === transferIn.xGet("currency")) {
			isRateExist = true;
			exchangeCurrencyRateValue = 1;
			$.exchangeCurrencyRate.hide();
			$.transferInAmount.hide();
		} else {
			var exchanges = transferOut.xGet("currency").getExchanges(transferIn.xGet("currency"));
			if (exchanges.length) {
				isRateExist = true;
				exchangeCurrencyRateValue = exchanges.at(0).xGet("rate");
			} else {
				isRateExist = false;
				exchangeCurrencyRateValue = null;
			}
			$.exchangeCurrencyRate.show();
			$.transferInAmount.show();
		}
	} else {
		exchangeCurrencyRateValue = 1;
		$.exchangeCurrencyRate.hide();
		$.transferInAmount.hide();
	}
	$.exchangeCurrencyRate.setValue(exchangeCurrencyRateValue);
	$.exchangeCurrencyRate.field.fireEvent("change");
}

$.transferOutAmount.field.addEventListener("change", updateForeignCurrencyAmount);
$.exchangeCurrencyRate.field.addEventListener("change", updateForeignCurrencyAmount);

function updateForeignCurrencyAmount() {
	if ($.transferOutAmount.getValue() && $.exchangeCurrencyRate.getValue()) {
		var foreignCurrencyAmount = ($.transferOutAmount.getValue() / $.exchangeCurrencyRate.getValue()).toUserCurrency();
		$.transferInAmount.setValue(foreignCurrencyAmount);
		$.transferInAmount.field.fireEvent("change");
	}
}

$.transferOutOwnerUser.field.addEventLisener("change", transferToFriend);
$.transferInOwnerUser.field.addEventLisener("change", transferToFriend);

function transferToFriend() {
	if ($.transferOutOwnerUser.getValue()) {
		$.exchangeCurrencyRate.hide();
		$.transferOutAmount.hide();
	}
	if ($.transferInOwnerUser.getValue()) {
		$.exchangeCurrencyRate.hide();
		$.transferInAmount.hide();
	}
}

$.onSave = function(saveEndCB, saveErrorCB) {

	if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
		var exchange = Alloy.createModel("Exchange", {
			localCurrency : $.$model.xGet("transferOut").xGet("currency"),
			foreignCurrency : $.$model.xGet("transferIn").xGet("currency"),
			rate : $.$model.xGet("exchangeCurrencyRate")
		});
		exchange.xAddToSave($);
	}
	$.saveModel(saveEndCB, saveErrorCB);
}
