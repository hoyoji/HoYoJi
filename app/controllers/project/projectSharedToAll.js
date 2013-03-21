Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("添加共享好友", function() {
		Alloy.Globals.openWindow("project/projectSharedToForm", {$model : "ProjectSharedTo", saveableMode : "add", data : {project : selectedProject}});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.myProjectSharedToesTable);

var collection = selectedProject.xGet("projectSharedToes").xCreateFilter({parentExpenseCategory : null});
$.myProjectSharedToesTable.addCollection(collection);