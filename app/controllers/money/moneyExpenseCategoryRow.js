Alloy.Globals.extendsBaseRowController($, arguments[0]);
$.setSelected = function(selected) {
	if (selected) {
		$.categoryName.$view.setColor("blue");
	}
};

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "支出分类操作"
	});
	menuSection.add($.createContextMenuItem("删除支出分类", function() {
		$.deleteModel();
	}, isSelectMode || !$.$model.canDelete()));
	return menuSection;
};

$.categoryName.UIInit($, $.getCurrentWindow()); 