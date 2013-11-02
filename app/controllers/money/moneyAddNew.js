Alloy.Globals.extendsBaseViewController($, arguments[0]);

var currentForm, lastAmountValue;

if ($.$attrs.selectedModel) {
	var modelType = $.$attrs.selectedModel.config.adapter.collection_name;
	modelType = "money" + modelType.slice(5) + "Form";
	currentForm = $[modelType] = loadForm(modelType, $.$attrs.selectedModel);
} else {
	currentForm = $.moneyExpenseForm = loadForm("moneyExpenseForm", null, true);
}

function loadForm(formName, model, autoInit) {
	var form;
	if (!autoInit) {
		form = Alloy.createController("money/" + formName, {
			addNewAgant : model,
			currentWindow : $.getCurrentWindow(),
			parentController : $.getParentController(),
			autoInit : "false",
			top : 0,
			bottom : 50
		});
		form.UIInit();
	} else {
		form = Alloy.createController("money/" + formName, {
			addNewAgant : model,
			autoInit : "false",
			top : 0,
			bottom : 50
		});
	}
	form.setParent($.$view);
	return form;
}

function onFooterbarTap(e) {
	if (e.source.id === "moneyLoan") {
		$.getCurrentWindow().closeNumericKeyboard();
		return;
	}
	if (!$[e.source.id]) {
		$[e.source.id] = loadForm(e.source.id);
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
		if (!lastAmountValue) {
			$.getCurrentWindow().openNumericKeyboard(currentForm.amount, function() {
				currentForm.titleBar.save();
			}, function() {

			}, 42);
		} else {
			currentForm.amount.setValue(lastAmountValue);
			currentForm.amount.field.fireEvent("change");
		}
		$.getCurrentWindow().__dirtyCount = $.__dirtyCount = currentForm.__dirtyCount;
	}, 1);

	currentForm.$view.show();
	previousForm.$view.hide();
}

$.onWindowOpenDo(function() {
	//$.getCurrentWindow().$view.addEventListener("contentready", function() {
	if (!$.$attrs.selectedModel) {
		currentForm.date.setValue((new Date()).toISOString());
		$.moneyExpenseForm.UIInit($, $.getCurrentWindow());
		$.moneyExpenseForm.doUIInit($.getCurrentWindow());
	}
	//});
	setTimeout(function() {
		$.getCurrentWindow().openNumericKeyboard(currentForm.amount, function() {
			currentForm.titleBar.save();
		}, function() {
		}, 42);
		$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", "widget", {
			autoInit : "false",
			// currentWindow : $.getCurrentWindow(),
			// parentController : $.getParentController(),
			buttons : "支出,收入,转账,借贷;借入;借出;还款;收款,项目充值",
			imagesFolder : "/images/money/moneyAddNew",
			ids : ids = "moneyExpenseForm,moneyIncomeForm,moneyTransferForm,moneyLoan;moneyBorrowForm;moneyLendForm;moneyReturnForm;moneyPaybackForm,projectDepositeForm"
		});
		$.footerBar.setParent($.$view);
		// $.footerBar.UIInit($, $.getCurrentWindow());
		$.footerBar.on("singletap", onFooterbarTap);
	}, 10);
});

$.onWindowCloseDo(function() {
	Alloy.Globals.moneyAddNewView = Alloy.createController("money/moneyAddNew", {
		autoInit : "false"
	});
});
