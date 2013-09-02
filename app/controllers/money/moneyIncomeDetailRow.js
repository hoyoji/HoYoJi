Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "收入明细操作"
	});
	menuSection.add($.createContextMenuItem("删除收入明细", function() {
		$.deleteModel();
	}, !$.$model.canDelete()));

	return menuSection;
};

function updateAmount() {
	$.amount.refresh();
}

function updateName() {
	$.name.refresh();
}

$.$model.on("xchange:amount", updateAmount);
$.$model.on("xchange:name", updateName);
$.onWindowCloseDo(function() {
	$.$model.off("xchange:amount", updateAmount);
	$.$model.off("xchange:name", updateName);
});

$.name.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
