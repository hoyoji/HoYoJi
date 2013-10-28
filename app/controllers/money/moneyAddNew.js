Alloy.Globals.extendsBaseViewController($, arguments[0]);

var currentForm;
var model = $.$attrs.selectedModel;

if (model) {
	var formName;
	var modelType = model.config.adapter.collection_name;
	switch(modelType) {
		case "MoneyExpense" :
			formName = "money/moneyExpenseForm";
			break;
		case "MoneyIncome" :
			formName = "money/moneyIncomeForm";
			break;
		case "MoneyTransfer" :
			formName = "money/moneyTransferForm";
			break;
		case "MoneyBorrow" :
			formName = "money/moneyBorrowForm";
			break;
		case "MoneyLend" :
			formName = "money/moneyLendForm";
			break;
		case "MoneyReturn" :
			formName = "money/moneyReturnForm";
			break;
		case "MoneyPayback" :
			formName = "money/moneyPaybackForm";
			break;
		default :
			break;
	}
	if (formName) {
		$.moneyForm = Alloy.createController(formName, {
			addNewAgant : model,
			currentWindow : $.getCurrentWindow(),
			parentController : $.getParentController(),
			autoInit : "false",
			top : 0,
			bottom : 50
		});
		$.moneyForm.setParent($.$view);
		$.moneyForm.UIInit();
		currentForm = $.moneyForm;
	}
} else {
	$.moneyExpenseForm = Alloy.createController("money/moneyExpenseForm", {
		currentWindow : $.getCurrentWindow(),
		parentController : $.getParentController(),
		autoInit : "false",
		top : 0,
		bottom : 50
	});
	$.moneyExpenseForm.setParent($.$view);
	$.moneyExpenseForm.UIInit();
	currentForm = $.moneyExpenseForm;
}

$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", "widget", {
	autoInit : "false",
	currentWindow : $.getCurrentWindow(),
	parentController : $.getParentController(),
	buttons : "支出,收入,转账,借贷;借入;借出;还款;收款,项目充值",
	imagesFolder : "/images/money/moneyAddNew",
	ids : ids = "moneyExpenseForm,moneyIncomeForm,moneyTransferForm,moneyLoan;moneyBorrowForm;moneyLendForm;moneyReturnForm;moneyPaybackForm,projectDepositeForm"
});
$.footerBar.setParent($.$view);
$.footerBar.UIInit($, $.getCurrentWindow());
$.footerBar.on("singletap", onFooterbarTap);

var lastAmountValue;

function onFooterbarTap(e) {
	if (!$[e.source.id]) {
		var formName;

		switch(e.source.id) {
			case "moneyExpenseForm" :
				formName = "money/moneyExpenseForm";
				break;
			case "moneyIncomeForm" :
				formName = "money/moneyIncomeForm";
				break;
			case "moneyTransferForm" :
				formName = "money/moneyTransferForm";
				break;
			case "moneyBorrowForm" :
				formName = "money/moneyBorrowForm";
				break;
			case "moneyLendForm" :
				formName = "money/moneyLendForm";
				break;
			case "moneyReturnForm" :
				formName = "money/moneyReturnForm";
				break;
			case "moneyPaybackForm" :
				formName = "money/moneyPaybackForm";
				break;
			case "projectDepositeForm" :
				formName = "money/projectDepositeForm";
				break;
			case "moneyLoan" :
				$.getCurrentWindow().closeNumericKeyboard();
				return;
				break;
			default :
				return;
		}

		$[e.source.id] = Alloy.createController(formName, {
			currentWindow : $.getCurrentWindow(),
			parentController : $.getParentController(),
			autoInit : "false",
			top : 0,
			bottom : 50
		});
		$[e.source.id].setParent($.$view);
		// $[e.source.id].onWindowOpenDo(function(){
		// setTimeout(function(){
		// currentForm.date.setValue((new Date()).toISOString());
		// currentForm.amount.setValue(lastNumericKeyboardValue);
		// }, 1);
		// });
		$[e.source.id].UIInit();
	} else {
		// if(currentForm.amount.getValue() === null || isNaN(currentForm.amount.getValue())){
		// currentForm.amount.setValue(lastNumericKeyboardValue);
		// }
	}
	if (currentForm === $[e.source.id]) {
		return;
	}
	var previousForm = currentForm;
	// currentForm.$view.hide();
	currentForm = $[e.source.id];
	currentForm.date.setValue((new Date()).toISOString());
	if (previousForm.amount.getValue() !== null && !isNaN(previousForm.amount.getValue())) {
		lastAmountValue = previousForm.amount.getValue();
	}
	setTimeout(function() {
		currentForm.amount.setValue(lastAmountValue);
		currentForm.amount.field.fireEvent("change");
		if (!lastAmountValue) {
			$.getCurrentWindow().openNumericKeyboard(currentForm.amount, function() {
				currentForm.titleBar.save();
			}, function() {

			}, 42);
		}
		$.getCurrentWindow().__dirtyCount = $.__dirtyCount = currentForm.__dirtyCount;
	}, 1);

	currentForm.$view.show();
	previousForm.$view.hide();
}

$.getCurrentWindow().$view.addEventListener("contentready", function() {
	if (!model) {
		currentForm.date.setValue((new Date()).toISOString());
	}
	$.getCurrentWindow().openNumericKeyboard(currentForm.amount, function() {
		currentForm.titleBar.save();
	}, function() {

	}, 42);
});

