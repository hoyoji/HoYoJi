Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.makeContextMenu = function(e, isSelectMode, souceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出分类", function() {
		Alloy.Globals.openWindow("money/moneyExpenseCategoryForm", {$model : "MoneyExpenseCategory", saveableMode : "add", data : {project : selectedProject, parentExpenseCategory : sourceModel}});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyExpenseCategoriesTable);

var collection = selectedProject.xGet("moneyExpenseCategories").xCreateFilter({parentExpenseCategory : null});
$.moneyExpenseCategoriesTable.addCollection(collection);
