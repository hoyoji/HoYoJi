Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增项目", function() {
		Alloy.Globals.openWindow("project/projectForm", {$model : "Project", saveableMode : "add", data : { parentProject : sourceModel }});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.myProjectsTable);

var sharedWithMeTableCollection = Alloy.createCollection("Project").xSearchInDb({ownerUserId : Alloy.Models.User.id,projectSharedById : "NOT NULL"});
    sharedWithMeTableCollection = sharedWithMeTableCollection.xSetFilter({ownerUser : Alloy.Models.User,projectSharedBy : "NOT NULL"});
var myProjectsTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter({parentProject : null,projectSharedBy : null});
// var sharedWithMeTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter({projectSharedBy : "NOT NULL"});
var sharedWithHerTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter({projectShareAuthorizations : "NOT NULL"});
$.myProjectsTable.addCollection(myProjectsTableCollection);
$.sharedWithMeTable.addCollection(sharedWithMeTableCollection);
$.sharedWithHerTable.addCollection(sharedWithHerTableCollection);


