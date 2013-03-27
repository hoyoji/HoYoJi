Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增项目", function() {
		Alloy.Globals.openWindow("project/projectForm", {$model : "Project", saveableMode : "add", data : { parentProject : sourceModel }});
	}));
	menuSection.add($.createContextMenuItem("show project store", function() {
		Alloy.Collections.Project.map(function(item){
			console.info(" project in store : " + item.xGet("name"));
		});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.myProjectsTable);

var myProjectsTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter({parentProject : null,projectSharedBy : null});
$.myProjectsTable.addCollection(myProjectsTableCollection);

