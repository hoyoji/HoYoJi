Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldDetailAmount = $.$model.xGet("amount") || 0;

$.onSave = function(saveEndCB, saveErrorCB){
	var incomeAmount = 0; 
	if($.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").length > 0){
		incomeAmount = $.$model.xGet("moneyIncome").xGet("amount");	
	} 
	
	$.$model.xGet("moneyIncome").xSet("amount", incomeAmount - oldDetailAmount + $.$model.xGet("amount"));
	$.$model.trigger("xchange:amount", $.$model);
	
	if(!$.$model.xGet("moneyIncome").isNew()){
		$.$model.xGet("moneyIncome").xAddToSave($);
		$.saveModel(saveEndCB, saveErrorCB);
	} else {
		saveEndCB();
		$.$model.xGet("moneyIncome").trigger("xchange:amount", $.$model.xGet("moneyIncome"));
		$.becameClean();
		$.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").add($.$model);
		
		if(OS_IOS){
			$.getCurrentWindow().$view.close();
		}
	}
}

