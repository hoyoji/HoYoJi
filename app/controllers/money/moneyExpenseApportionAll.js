Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedExpense = $.$attrs.selectedExpense;

function onFooterbarTap(e){
	if(e.source.id === "addExpenseDetail"){
		Alloy.Globals.openWindow("money/moneyExpenseDetailForm",{selectedExpense : selectedExpense, closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave});
	}
}

