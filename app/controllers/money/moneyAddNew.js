Alloy.Globals.extendsBaseViewController($, arguments[0]);

var currentForm, currentFormName, lastAmountValue, loadedForm = [];

if ($.$attrs.selectedModel) {
	var modelType = $.$attrs.selectedModel.config.adapter.collection_name;
	modelType = "money" + modelType.slice(5) + "Form";
	currentForm = $[modelType] = loadForm(modelType, $.$attrs.selectedModel);
	currentFormName = modelType;
} else {
	currentForm = $.moneyExpenseForm = loadForm("moneyExpenseForm", null, true);
	currentFormName = "moneyExpenseForm";
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
	loadedForm.push(formName);
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
	currentFormName = e.source.id;
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

function initForm() {
	//$.getCurrentWindow().$view.addEventListener("contentready", function() {
	if (!$.$attrs.selectedModel) {
		$.moneyExpenseForm.UIInit($, $.getCurrentWindow());
		$.moneyExpenseForm.doUIInit($.getCurrentWindow());
		// currentForm.date.setValue((new Date()).toISOString());
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
}

$.onWindowOpenDo(function() {
	initForm();
	$.getCurrentWindow().$view.addEventListener("show", function() {
		setTimeout(function(){
			$.getCurrentWindow().openNumericKeyboard(currentForm.amount, function() {
				currentForm.titleBar.save();
			}, function() {
			}, 42);	
		}, 300);
	});
	$.getCurrentWindow().$view.addEventListener("hide", function() {
		if(OS_IOS){
			$.getCurrentWindow().closeNumericKeyboard();
		}
		setTimeout(function() {
			$.getCurrentWindow().__dirtyCount = $.__dirtyCount = 0;
			loadedForm.forEach(function(formName) {
				$[formName].remove();
				$.$view.remove($[formName].$view);
				$[formName] = null;
				delete $[formName];
			});
			loadedForm = [];
			currentForm = $.moneyExpenseForm = loadForm("moneyExpenseForm", null, true);
			currentFormName = "moneyExpenseForm";
			$.moneyExpenseForm.UIInit($, $.getCurrentWindow());
			$.moneyExpenseForm.doUIInit($.getCurrentWindow());
		}, 500);
	});
});
