Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增项目", function() {
		Alloy.Globals.openWindow("project/projectForm", {$model : "Project", data : { parentProject : sourceModel }});
	}));
	return menuSection;
}

$.getChildTitle = function() {
	return $.$model.xGet("name");
}

function onFooterbarTap (e) {
	if(e.source.id === "newProject"){
		Alloy.Globals.openWindow("project/projectForm",{$model : "Project"});
	}else{
		$.titleBar.setTitle(e.source.getTitle());
		$.titleBar.bindXTable($[e.source.id]);
	}
}
$.titleBar.bindXTable($.myProjectsTable);

var myProjectsTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter({parentProject : null, ownerUser : Alloy.Models.User});
var sharedWithMeTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model){
	return model.xGet("ownerUser") !== Alloy.Models.User && !model.xGet("parentProject");
});
// var sharedWithHerTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model){
	// return model.xGet("projectShareAuthorizations").length > 0 
			// && model.xGet("ownerUserId") === Alloy.Models.User.id;
// });
$.myProjectsTable.addCollection(myProjectsTableCollection);
$.sharedWithMeTable.addCollection(sharedWithMeTableCollection);
// $.sharedWithHerTable.addCollection(sharedWithHerTableCollection, "project/projectSharedWithHerRow");


