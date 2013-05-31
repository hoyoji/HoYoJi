Alloy.Globals.extendsBaseRowController($, arguments[0]);
$.setSelected = function(selected){
	if(selected){
		$.nickName.$view.setColor("blue");
	}
}

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "好友操作"});
	menuSection.add($.createContextMenuItem("删除好友", function() {
		$.deleteModel();
	}, isSelectMode));
	return menuSection;
}
$.getChildTitle = function() {
	return $.$model.xGet("friendUser").xGet("userName");
}