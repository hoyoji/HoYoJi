Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyExpenseCategoriesTable.UIInit($, $.getCurrentWindow());

var selectedProject = $.$attrs.selectedProject;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出分类", function() {
		Alloy.Globals.openWindow("money/moneyExpenseCategoryForm", {
			$model : "MoneyExpenseCategory",
			data : {
				project : selectedProject,
				parentExpenseCategory : sourceModel
			}
		});
	}, !selectedProject.canExpenseCategoryAddNew()));
	return menuSection;
};

$.titleBar.bindXTable($.moneyExpenseCategoriesTable);

// var collection = selectedProject.xGet("moneyExpenseCategories").xCreateFilter({parentExpenseCategory : null}, $);
var collection = selectedProject.xGet("moneyExpenseCategories").xCreateFilter(function(model) {
	return model.xPrevious("parentExpenseCategory") === null && model.xGet("id") !== selectedProject.xGet("depositeExpenseCategoryId");
}, $);
$.moneyExpenseCategoriesTable.addCollection(collection);
$.moneyExpenseCategoriesTable.autoHideFooter($.footerBar);

$.onWindowOpenDo(function() {
	if (!selectedProject.canExpenseCategoryAddNew()) {
		$.footerBar.addExpenseCategory.setEnabled(false);
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addExpenseCategory") {
		Alloy.Globals.openWindow("money/moneyExpenseCategoryForm", {
			$model : "MoneyExpenseCategory",
			data : {
				project : selectedProject
			}
		});
	}
}

$.titleBar.UIInit($, $.getCurrentWindow());