Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldDetailAmount = $.$model.xGet("amount") || 0;

$.onSave = function(saveEndCB, saveErrorCB){
	var expenseAmount = 0; 
	if($.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").length > 0){
		expenseAmount = $.$model.xGet("moneyExpense").xGet("amount");	
	} 
	
	$.$model.xGet("moneyExpense").xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
	$.$model.trigger("xchange:amount", $.$model);
	
	if(!$.$model.xGet("moneyExpense").isNew()){
		$.$model.xGet("moneyExpense").xAddToSave($);
		$.saveModel(saveEndCB, saveErrorCB);
	} else {
		saveEndCB();
		$.$model.xGet("moneyExpense").trigger("xchange:amount", $.$model.xGet("moneyExpense"));
		$.becameClean();
		$.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").add($.$model);
		$.getCurrentWindow().$view.close();
	}
}