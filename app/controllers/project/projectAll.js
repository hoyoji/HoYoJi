Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增项目", function() {
		Alloy.Globals.openWindow("project/projectForm", {$model : "Project", saveableMode : "add"});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.projectsTable);

var collection = Alloy.Models.User.xGet("projects").xCreateFilter({parentProject : null});
$.projectsTable.addCollection(collection);
