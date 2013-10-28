Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "转账操作"
	});
	menuSection.add($.createContextMenuItem("再记一笔", function() {
		Alloy.Globals.openWindow("money/moneyAddNew", {
			selectedModel : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("删除转账", function() {
		$.deleteModel();
	}));
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
$.transferIn.UIInit($, $.getCurrentWindow());
$.transferInAmount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
