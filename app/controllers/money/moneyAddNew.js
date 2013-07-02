Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyExpenseForm = Alloy.createController("money/moneyExpenseForm", {
	currentWindow : $.getCurrentWindow(),
	parentController : $.getParentController(),
	autoInit : "false",
	top : 0,
	bottom : 50
});
$.moneyExpenseForm.setParent($.$view);
$.moneyExpenseForm.UIInit();

var currentForm = $.moneyExpenseForm;

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
		// $[e.source.id].$view.setTop(0);
		// $[e.source.id].$view.setBottom(84);
		$[e.source.id].setParent($.$view);
		$[e.source.id].UIInit();
	}
	if (currentForm === $[e.source.id]) {
		return;
	}
	var previousForm = currentForm;
	// currentForm.$view.hide();
	currentForm = $[e.source.id];
	currentForm.date.setValue((new Date()).toISOString());
	
	$.getCurrentWindow().openNumericKeyboard(currentForm.amount, function() {
		currentForm.titleBar.save();
	}, 42);
	$.getCurrentWindow().__dirtyCount = currentForm.__dirtyCount;
	currentForm.$view.show();
	previousForm.$view.hide();
}

$.getCurrentWindow().$view.addEventListener("show", function() {
	currentForm.date.setValue((new Date()).toISOString());
	$.getCurrentWindow().openNumericKeyboard(currentForm.amount, function() {
		currentForm.titleBar.save();
	}, 42);
});

