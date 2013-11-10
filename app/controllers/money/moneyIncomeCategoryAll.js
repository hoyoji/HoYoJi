Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyIncomeCategoriesTable.UIInit($, $.getCurrentWindow());

var selectedProject, collection;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收入分类", function() {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {
			$model : "MoneyIncomeCategory",
			data : {
				project : selectedProject,
				parentIncomeCategory : sourceModel
			}
		});
	}, !selectedProject.canIncomeCategoryAddNew()));
	return menuSection;
};

$.titleBar.bindXTable($.moneyIncomeCategoriesTable);
selectedProject = $.$attrs.selectedProject;
if (!selectedProject.canIncomeCategoryAddNew()) {
	$.footerBar.addIncomeCategory.setEnabled(false);
}

collection = selectedProject.xGet("moneyIncomeCategories").xCreateFilter(function(model) {
	return model.xPrevious("parentIncomeCategory") === null && model.xGet("id") !== selectedProject.xGet("depositeIncomeCategoryId");
}, $);
$.moneyIncomeCategoriesTable.addCollection(collection);
$.moneyIncomeCategoriesTable.autoHideFooter($.footerBar);

$.onWindowOpenDo(function() {
	$.getCurrentWindow().$view.addEventListener("show", function() {
		if (selectedProject === $.$attrs.selectedProject) {
			return;
		}
		$.moneyIncomeCategoriesTable.resetTable();
		selectedProject = $.$attrs.selectedProject;
		if (!selectedProject.canIncomeCategoryAddNew()) {
			$.footerBar.addIncomeCategory.setEnabled(false);
		}
		collection.xClearFilter();
		collection = selectedProject.xGet("moneyIncomeCategories").xCreateFilter(function(model) {
			return model.xPrevious("parentIncomeCategory") === null && model.xGet("id") !== selectedProject.xGet("depositeIncomeCategoryId");
		}, $);
		$.moneyIncomeCategoriesTable.addCollection(collection);
	});
});

function onFooterbarTap(e) {
	if (e.source.id === "addIncomeCategory") {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {
			$model : "MoneyIncomeCategory",
			data : {
				project : selectedProject
			}
		});
	}
}

$.titleBar.UIInit($, $.getCurrentWindow());
