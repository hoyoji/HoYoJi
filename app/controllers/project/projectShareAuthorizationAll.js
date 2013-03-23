Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("添加共享好友", function() {
		Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {$model : "ProjectShareAuthorization", saveableMode : "add", data : {project : selectedProject}});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.myProjectShareAuthorizationsTable);

var collection = selectedProject.xGet("projectShareAuthorizations").xCreateFilter({parentExpenseCategory : null});
$.myProjectShareAuthorizationsTable.addCollection(collection);