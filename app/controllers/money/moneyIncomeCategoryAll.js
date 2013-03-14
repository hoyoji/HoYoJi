Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收入分类", function() {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {$model : "MoneyIncomeCategory", saveableMode : "add", data : {project : selectedProject}});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyIncomeCategoriesTable);

var collection = selectedProject.xGet("moneyIncomeCategories").xCreateFilter({parentIncomeCategory : null});
$.moneyIncomeCategoriesTable.addCollection(collection);
