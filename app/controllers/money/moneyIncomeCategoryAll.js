Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyIncomeCategoriesTable.UIInit($, $.getCurrentWindow());

var selectedProject = $.$attrs.selectedProject;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收入分类", function() {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {$model : "MoneyIncomeCategory", data : {project : selectedProject, parentIncomeCategory : sourceModel}});
	},!selectedProject.canIncomeCategoryAddNew()));
	return menuSection;
}

$.titleBar.bindXTable($.moneyIncomeCategoriesTable);

var collection = selectedProject.xGet("moneyIncomeCategories").xCreateFilter({parentIncomeCategory : null}, $);
$.moneyIncomeCategoriesTable.addCollection(collection);
$.moneyIncomeCategoriesTable.autoHideFooter($.footerBar);

$.onWindowOpenDo(function() {
	if (!selectedProject.canIncomeCategoryAddNew()) {
		$.footerBar.addIncomeCategory.setEnabled(false);
	}
});

function onFooterbarTap(e){
	if(e.source.id === "addIncomeCategory"){
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm",{$model : "MoneyIncomeCategory", data : {project : selectedProject}});
	}
}
