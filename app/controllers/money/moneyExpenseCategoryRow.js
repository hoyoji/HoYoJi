Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "支出分类操作"});
	menuSection.add($.createContextMenuItem("删除支出分类", function() {
		$.deleteModel();
	}));
	menuSection.add($.createContextMenuItem("新增子支出分类", function() {
		Alloy.Globals.openWindow("money/moneyExpenseCategoryForm", {$model : "MoneyExpenseCategory", saveableMode : "add", data : { parentExpenseCategory : $.$model, project : $.$model.xGet("project")}});
	}));
	return menuSection;
}
