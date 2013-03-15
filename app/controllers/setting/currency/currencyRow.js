Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "币种设置操作"});
	menuSection.add($.createContextMenuItem("删除币种", function() {
		$.deleteModel();
	}));
	menuSection.add($.createContextMenuItem("设为本币", function() {
		var oldActiveCurrency = Alloy.Models.User.xGet("activeCurrency");
		var selectActiveCurrency = $.$model;
		if(selectActiveCurrency !== oldActiveCurrency)
		{
			Alloy.Models.User.xSet("activeCurrency",selectActiveCurrency);
		}
	}));
	return menuSection;
}

// Alloy.Models.User.on("change : activeCurrency",function(){
// 	
// });
