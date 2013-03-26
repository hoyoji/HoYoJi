Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldDetailAmount = $.$model.xGet("amount") || 0;

$.onSave = function(saveEndCB, saveErrorCB){
	var expenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
	$.$model.xGet("moneyExpense").xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
	$.$model.xGet("moneyExpense").xAddToSave($);
	
	$.saveModel(saveEndCB, saveErrorCB);
}

