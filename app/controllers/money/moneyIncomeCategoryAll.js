Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收入分类", function() {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {$model : "MoneyIncomeCategory", data : {project : selectedProject, parentIncomeCategory : sourceModel}});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyIncomeCategoriesTable);

var collection = selectedProject.xGet("moneyIncomeCategories").xCreateFilter({parentIncomeCategory : null});
$.moneyIncomeCategoriesTable.addCollection(collection);

function onFooterbarTap(e){
	if(e.source.id === "addIncomeCategory"){
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm",{$model : "MoneyIncomeCategory", data : {project : selectedProject, parentIncomeCategory : sourceModel}});
	}
}