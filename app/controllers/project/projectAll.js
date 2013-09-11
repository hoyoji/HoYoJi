Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.myProjectsTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
	id : "myProjectsTable",
	sortByField : "name",
	bottom : "0",
	top : "0",
	autoInit : "false",
	parentController : $,
	currentWindow : $.__currentWindow
});
$.myProjectsTable.setParent($.body);
$.myProjectsTable.UIInit();

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	if (!sourceModel || (sourceModel.config.adapter.collection_name === "Project" && sourceModel.xGet("ownerUserId") === Alloy.Models.User.id)) {
		menuSection.add($.createContextMenuItem("新增项目", function() {
			Alloy.Globals.openWindow("project/projectForm", {
				$model : "Project",
				data : {
					parentProject : sourceModel
				}
			});
		}));
	}
	return menuSection;
};

$.getChildTitle = function() {
	return $.$model.xGet("name");
};
function onFooterbarTap(e) {
	if (e.source.id === "newProject") {
		Alloy.Globals.openWindow("project/projectForm", {
			$model : "Project"
		});
	} else {
		if(e.source.id === "sharedWithMeTable"){
			if(!$.sharedWithMeTable){
				$.sharedWithMeTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
					id : "sharedWithMeTable",
					bottom : "0",
					top : "0",
					sortByField : "name",
					hasDetail : "",
					autoInit : "false",
					parentController : $,
					currentWindow : $.__currentWindow
				});
				$.sharedWithMeTable.setParent($.body);
				$.sharedWithMeTable.UIInit();
				
				var sharedWithMeTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model) {
					return model.xGet("ownerUserId") !== Alloy.Models.User.id 
							&& !model.xGet("parentProject") 
							&& model.xGet("projectShareAuthorizations").where({
								projectId : model.id,
								friendUserId : Alloy.Models.User.id,
								state : "Accept"
							}).length > 0;
				}, $);

				$.sharedWithMeTable.addCollection(sharedWithMeTableCollection);
				// $.sharedWithMeTable.slideDown();
			}
		}
		
		$.titleBar.setTitle(e.source.getTitle());
		$.titleBar.bindXTable($[e.source.id]);
	}
}

$.titleBar.bindXTable($.myProjectsTable);

var myProjectsTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model) {
	return model.xPrevious("parentProject") === null && model.xGet("ownerUserId") === Alloy.Models.User.id;
}, $);

// var sharedWithHerTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model){
// return model.xGet("projectShareAuthorizations").length > 0
// && model.xGet("ownerUserId") === Alloy.Models.User.id;
// }, $);
$.myProjectsTable.addCollection(myProjectsTableCollection);
// $.sharedWithHerTable.addCollection(sharedWithHerTableCollection, "project/projectSharedWithHerRow");
$.myProjectsTable.autoHideFooter($.footerBar);
