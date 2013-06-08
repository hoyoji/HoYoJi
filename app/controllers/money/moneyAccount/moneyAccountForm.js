Alloy.Globals.extendsBaseFormController($, arguments[0]);

if($.$model.isNew()){
	$.onWindowOpenDo(function() {
		$.name.field.focus();
	});
}


$.onSave = function(saveEndCB, saveErrorCB) {
	if($.$model.hasChanged("currentBalance")){
		// 这个主要用于同不时维护修改后的账户余额
		Alloy.createModel("MoneyAccountBalanceAdjustment", {
			moneyAccount : $.$model,
			amount : $.$model.xGet("currentBalance") - $.$model.xPrevious("currentBalance"),
			ownerUser : Alloy.Models.User
		}).xAddToSave($);
	}
	$.saveModel(saveEndCB, saveErrorCB);
}