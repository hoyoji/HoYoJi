Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "借入操作"
	});
	menuSection.add($.createContextMenuItem("还款明细", function() {
		Alloy.Globals.openWindow("money/moneyReturnAll", {
			selectedBorrow : $.$model
		});
	}));
	// menuSection.add($.createContextMenuItem("发送给好友", function() {
	// Alloy.Globals.openWindow("message/accountShare", {
	// $model : "Message",
	// selectedAccount : $.$model
	// });
	// }));
	menuSection.add($.createContextMenuItem("删除借入", function() {
		$.deleteModel();
	}, !$.$model.canDelete() || $.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	return menuSection;
};

$.onWindowOpenDo(function() {
	$.$model.xGet("project").on("sync", projectRefresh);
});

$.onWindowCloseDo(function() {
	$.$model.xGet("project").off("sync", projectRefresh);
});

function projectRefresh() {
	$.projectName.refresh();
}

$.picture.UIInit($, $.getCurrentWindow());
$.projectName.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.localAmountLabel.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.accountCurrency.UIInit($, $.getCurrentWindow());
