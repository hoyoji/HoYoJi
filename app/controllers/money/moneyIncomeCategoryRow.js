Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "收入分类操作"});
	menuSection.add($.createContextMenuItem("删除收入分类", function() {
		$.deleteModel();
	}));
	menuSection.add($.createContextMenuItem("新增子收入分类", function() {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {$model : "MoneyIncomeCategory", saveableMode : "add", data : { parentIncomeCategory : $.$model, project : $.$model.xGet("project")}});
	}));
	return menuSection;
}
