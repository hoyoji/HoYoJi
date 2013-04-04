Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增项目", function() {
		Alloy.Globals.openWindow("project/projectForm", {$model : "Project", data : { parentProject : sourceModel }});
	}));
	return menuSection;
}

function onFooterbarTap (e) {
	$.titleBar.setTitle(e.source.getTitle());
	$.titleBar.bindXTable($[e.source.id]);
}
$.titleBar.bindXTable($.myProjectsTable);

var myProjectsTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter({parentProject : null, ownerUserId : Alloy.Models.User.id});
var sharedWithMeTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model){
	return model.xGet("ownerUserId") !== Alloy.Models.User.id && !model.xGet("parentProject");
});
var sharedWithHerTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model){
	return model.xGet("projectShareAuthorizations").length > 0 
			&& model.xGet("ownerUserId") === Alloy.Models.User.id;
});
$.myProjectsTable.addCollection(myProjectsTableCollection);
$.sharedWithMeTable.addCollection(sharedWithMeTableCollection);
$.sharedWithHerTable.addCollection(sharedWithHerTableCollection, "project/projectSharedWithHerRow");


