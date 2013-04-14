Alloy.Globals.extendsBaseFormController($, arguments[0]);

if ($.$model.isNew()) {
	var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
		name : "日常收入",
		project : $.$model
	}).xAddToSave($);
	$.$model.xSet("defaultIncomeCategory", defaultIncomeCategory);

	var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
		name : "日常支出",
		project : $.$model
	}).xAddToSave($);
	$.$model.xSet("defaultExpenseCategory", defaultExpenseCategory);
	$.name.field.focus();
}