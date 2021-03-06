Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyExpenseCategoriesTable.UIInit($, $.getCurrentWindow());

var selectedProject, collection;

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
selectedProject = $.$attrs.selectedProject;
if (!selectedProject.canExpenseCategoryAddNew()) {
	$.footerBar.addExpenseCategory.setEnabled(false);
}
collection = selectedProject.xGet("moneyExpenseCategories").xCreateFilter(function(model) {
	return model.xPrevious("parentExpenseCategory") === null && model.xGet("id") !== selectedProject.xGet("depositeExpenseCategoryId");
}, $);
$.moneyExpenseCategoriesTable.addCollection(collection);
$.moneyExpenseCategoriesTable.autoHideFooter($.footerBar);

$.onWindowOpenDo(function() {
	function onShow() {
		if(selectedProject === $.$attrs.selectedProject){
			return;
		}
		$.moneyExpenseCategoriesTable.resetTable();
		selectedProject = $.$attrs.selectedProject;
		if (!selectedProject.canExpenseCategoryAddNew()) {
			$.footerBar.addExpenseCategory.setEnabled(false);
		}
		collection.xClearFilter();
		collection = selectedProject.xGet("moneyExpenseCategories").xCreateFilter(function(model) {
			return model.xPrevious("parentExpenseCategory") === null && model.xGet("id") !== selectedProject.xGet("depositeExpenseCategoryId");
		}, $);
		$.moneyExpenseCategoriesTable.addCollection(collection);
	}
	$.getCurrentWindow().$view.addEventListener("show", onShow);
	$.onWindowCloseDo(function(){
		$.getCurrentWindow().$view.removeEventListener("show", onShow);
	});
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