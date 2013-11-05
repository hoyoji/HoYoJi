Alloy.Globals.extendsBaseRowController($, arguments[0]);
$.setSelected = function(selected){
	if(selected){
		$.accountName.$view.setColor("blue");
	}
};

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "账户操作"
	});	
	menuSection.add($.createContextMenuItem("账户资料", function() {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccoutForm", {
			$model : $.$model
		});
	}, isSelectMode));
	menuSection.add(
		$.createContextMenuItem("删除账户", 
			function() {
				$.deleteModel();
			}
			,isSelectMode));
	
	return menuSection;
};
$.onRowTap = function(){
	Alloy.Globals.openWindow("money/moneyAll", {
		queryFilter : {
			moneyAccount : $.$model
		}
	});
	return false;
};
$.accountName.UIInit($, $.getCurrentWindow());
$.symbol.UIInit($, $.getCurrentWindow());
$.currentBalance.UIInit($, $.getCurrentWindow());
