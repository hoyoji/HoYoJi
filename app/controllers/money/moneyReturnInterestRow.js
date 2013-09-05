Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "还款操作"
	});
	menuSection.add($.createContextMenuItem("删除还款", function() {
		$.deleteModel();
	}, !$.$model.canDelete()||$.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	return menuSection;
};

$.onWindowOpenDo(function() {
	$.$model.xGet("project").on("sync",projectRefresh);
});

$.onWindowCloseDo(function() {
	$.$model.xGet("project").off("sync",projectRefresh);
});

function projectRefresh() {
	$.projectName.refresh();
}

$.picture.UIInit($, $.getCurrentWindow());
$.projectName.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.interest.UIInit($, $.getCurrentWindow());
