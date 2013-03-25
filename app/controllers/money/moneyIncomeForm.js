Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldAmount;
var oldMoneyAccount;
var isRateExist;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		amount : 0,
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : 1,
		incomeType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyIncomeCategory : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
	});
	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
	$.setSaveableMode("add");
}
oldMoneyAccount = $.$model.xGet("moneyAccount");
oldAmount = $.$model.xGet("amount");

$.moneyAccount.field.addEventListener("change", updateExchangeRate);
// setExchange will 触发 change 事件，change事件会使 form dirty, dirty form 会提示用户说修改未保存，
// 只有新增时才需要做这步，我们直接在上面做

function updateExchangeRate(e) {
	if ($.moneyAccount.getValue()) {
		setExchangeRate($.moneyAccount.getValue(), $.$model);
	}
}

function setExchangeRate(moneyAccount, model, setToModel) {
	var exchangeCurrencyRateValue;
	if (moneyAccount.xGet("currency") === model.xGet("localCurrency")) {
		isRateExist = true;
		exchangeCurrencyRateValue = 1;
		$.exchangeCurrencyRate.hide();
	} else {
		var exchanges = model.xGet("localCurrency").getExchanges(moneyAccount.xGet("currency"));
		if (exchanges.length) {
			isRateExist = true;
			exchangeCurrencyRateValue = exchanges.at(0).xGet("rate");
		} else {
			isRateExist = false;
			exchangeCurrencyRateValue = null;
		}
		$.exchangeCurrencyRate.show();
	}
	if (setToModel) {
		model.xSet("exchangeCurrencyRate", exchangeCurrencyRateValue);
	} else {
		$.exchangeCurrencyRate.setValue(exchangeCurrencyRateValue);
		$.exchangeCurrencyRate.field.fireEvent("change");
	}
}

$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
	if ($.project.getValue()) {
		var defaultIncomeCategory = $.project.getValue().xGet("defaultIncomeCategory");
		$.moneyIncomeCategory.setValue(defaultIncomeCategory);
		$.moneyIncomeCategory.field.fireEvent("change");
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
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

	//记住当前账户为下次打开时的默认账户
	Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
	//记住当前分类为下次打开时的默认分类
	Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", $.$model.xGet("category"));
	//直接把activeMoneyAccountId保存到数据库，不经过validation
	Alloy.Models.User.save({
			activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id")
	}, {patch : true, wait : true});
	Alloy.Models.User.xGet("activeProject").xAddToSave($);
	
	
	if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
		var exchange = Alloy.createModel("Exchange", {
			localCurrency : $.$model.xGet("localCurrency"),
			foreignCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
			rate : $.$model.xGet("exchangeCurrencyRate")
		});
		exchange.xAddToSave($);
	}
	$.saveModel(saveEndCB, function(e) {
		newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
		oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
		Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", Alloy.Models.User.previous("activeProject").xGet("defaultIncomeCategory"));
		saveErrorCB(e);
	});
}