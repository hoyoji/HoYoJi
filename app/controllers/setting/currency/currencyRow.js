Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "币种设置操作"});
	menuSection.add($.createContextMenuItem("设为本币", function() {
		if($.$model !== Alloy.Models.User.xGet("activeCurrency")) {
			Alloy.Models.User.xSet("activeCurrency",$.$model);
			Alloy.Models.User.save({activeCurrencyId : $.$model.xGet("id")},{wait : true, patch : true});
		}
	}));
	menuSection.add($.createContextMenuItem("删除币种", function() {
		$.deleteModel();
	}));
	return menuSection;
}

function setActiveCurrency(){
	if(Alloy.Models.User.xGet("activeCurrency") === $.$model){
		$.check.show();
	} else {
		$.check.hide();
	}
}

Alloy.Models.User.on("sync", setActiveCurrency);
$.onWindowCloseDo(function(){
	Alloy.Models.User.off("sync", setActiveCurrency);	
});

$.onWindowOpenDo(function(){
	setActiveCurrency();
});

