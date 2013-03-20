Alloy.Globals.extendsBaseViewController($, arguments[0]);

function onFooterbarTap(e){
	if(e.source.id === "moneyAddNew"){
		Alloy.Globals.openWindow("money/moneyAddNew");
	}
}

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "设置操作"
	});
	menuSection.add($.createContextMenuItem("新增收入", function() {
		Alloy.Globals.openWindow("money/moneyIncomeForm");
	}));
	return menuSection;
}