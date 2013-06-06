Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedExpense = $.$attrs.selectedExpense;

function onFooterbarTap(e){
	if(e.source.id === "addExpenseApportion"){
		Alloy.Globals.openWindow("money/moneyExpenseDetailForm",{selectedExpense : selectedExpense, closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave});
	}
}

var memberCount = selectedExpense.xGet("project").xGet("projectShareAuthorizations").length;
selectedExpense.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization){
	var moneyExpenseApportion = Alloy.createModel("MoneyExpenseApportion", {
		expense : selectedExpense,
		amount : selectedExpense.xGet("amount") / memberCount,
		apportionType : "Average"
	});
	selectedExpense.xGet("moneyExpenseApportions").add(moneyExpenseApportion);
});

var collection = selectedExpense.xGet("moneyExpenseApportions");
$.moneyExpenseApportionsTable.addCollection(collection);
