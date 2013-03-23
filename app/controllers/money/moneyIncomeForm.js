Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldAmount;
var oldMoneyAccount;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		amount : 0,
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : 1,
		incomeType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		category : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
	});
	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
	$.setSaveableMode("add");
}
oldMoneyAccount = $.$model.xGet("moneyAccount");
oldAmount = $.$model.xGet("amount");

$.moneyAccount.field.addEventListener("change", updateExchangeRate);

// 这个没必要做了，如果window关闭了，这个 moneyAccount field 也会被删掉，不会造成内存泄漏
// $.onWindowCloseDo(function() {
	// $.moneyAccount.field.removeEventListener("change", updateExchangeRate);
// });

// setExchange will 触发 change 事件，change事件会使 form dirty, dirty form 会提示用户说修改未保存，
// 只有新增时才需要做这步，我们直接在上面做	
// $.onWindowOpenDo(function() {
	// updateExchangeRate(); 
// });

function updateExchangeRate(e) {
	if ($.moneyAccount.getValue()) {
		setExchangeRate($.moneyAccount.getValue(), $.$model);
	}
}

function setExchangeRate(moneyAccount, model, setToModel){
		var exchangeCurrencyRateValue;
		if (moneyAccount.xGet("currency") === model.xGet("localCurrency")) {
			exchangeCurrencyRateValue = 1;
			$.exchangeCurrencyRate.hide();
			// var animation = Titanium.UI.createAnimation();
			// animation.height = 1;
			// animation.duration = 200;
			// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
			// $.exchangeCurrencyRateWrapper.animate(animation);	
		} else {
			var exchanges =  model.xGet("localCurrency").getExchanges(moneyAccount.xGet("currency"));
			if (exchanges.length) {
				exchangeCurrencyRateValue = exchanges.at(0).xGet("rate");
			} else {
				exchangeCurrencyRateValue = null;
			}
			$.exchangeCurrencyRate.show();
			// $.exchangeCurrencyRateWrapper.addEventListener("postlayout", function(){
				// console.info("wraper after show x " + $.exchangeCurrencyRateWrapper.getRect().x);
				// console.info("wraper after show y " + $.exchangeCurrencyRateWrapper.getRect().y);
				// console.info("wraper after show w " + $.exchangeCurrencyRateWrapper.getRect().width);
				// console.info("wraper after show h " + $.exchangeCurrencyRateWrapper.getRect().height);
			// });
			// var animation = Titanium.UI.createAnimation();
			// animation.height = 42;
			// animation.width = Ti.UI.FILL;
			// animation.duration = 200;
			// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
			// $.exchangeCurrencyRateWrapper.animate(animation);
		}
		if(setToModel){
			model.xSet("exchangeCurrencyRate", exchangeCurrencyRateValue);			
		} else {
			$.exchangeCurrencyRate.setValue(exchangeCurrencyRateValue);
			$.exchangeCurrencyRate.field.fireEvent("change");
		}
}

$.onSave = function(saveEndCB, saveErrorCB) {
	var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
	var newAmount = $.$model.xGet("amount");
	var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");

	if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
	} else {
		oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
	}

	Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
	Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", $.$model.xGet("category"));

	$.saveModel(saveEndCB, function(e) {
		newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
		oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
		Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", Alloy.Models.User.previous("activeProject").xGet("defaultIncomeCategory"));
		saveErrorCB(e);
	});
}