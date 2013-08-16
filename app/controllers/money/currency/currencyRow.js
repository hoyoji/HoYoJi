Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "币种设置操作"});
	menuSection.add($.createContextMenuItem("设为本币", function() {
		if($.$model !== Alloy.Models.User.xGet("activeCurrency")) {
			Alloy.Models.User.xSet("activeCurrency",$.$model);
			Alloy.Models.User.save({activeCurrencyId : $.$model.xGet("id")},{wait : true, patch : true});
			
				// function getAllExchanges(successCB, errorCB) {
					// var errorCount = 0, projectCurrencyIdsCount = 0, projectCurrencyIdsTotal = projectCurrencyIds.length;
					
					Alloy.Models.User.xGet("projects").forEach(function(project) {
						// if (errorCount > 0) {
							// return;
						// }
						if (project.xGet("currencyId") === $.$model.xGet("id")) {
							// projectCurrencyIdsCount++;
							// if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
								// successCB();
							// }else{
								return;
							// }
						}
						var exchange = Alloy.createModel("Exchange").xFindInDb({
							localCurrencyId : $.$model.xGet("id"),
							foreignCurrencyId : project.xGet("currencyId")
						});
						if (!exchange.id) {
							Alloy.Globals.Server.getExchangeRate($.$model.xGet("id"), project.xGet("currencyId"), function(rate) {

								exchange = Alloy.createModel("Exchange", {
									localCurrencyId : $.$model.xGet("id"),
									foreignCurrencyId : project.xGet("currencyId"),
									rate : rate
								});
								exchange.xSet("ownerUser", Alloy.Models.User);
								exchange.xSet("ownerUserId", Alloy.Models.User.id);
								exchange.save();
								// projectCurrencyIdsCount++;
								// if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
									// successCB();
								// }
							}, function(e) {
								// errorCount++;
								errorCB(e)
							});

						} 
						// else {
							// projectCurrencyIdsCount++;
						// }
					});
					alert("需退出重新登录，显示的金额才会换成本币显示。")
				// }

		}
	},isSelectMode));
	// menuSection.add($.createContextMenuItem("删除币种", function() {
		// $.deleteModel();
	// },isSelectMode));
	return menuSection;
}

function setActiveCurrency(){
	if(Alloy.Models.User.xGet("activeCurrency") === $.$model){
		$.check.setVisible(true);
	} else {
		$.check.setVisible(false);
	}
}

Alloy.Models.User.on("sync", setActiveCurrency);
$.onWindowCloseDo(function(){
	Alloy.Models.User.off("sync", setActiveCurrency);	
});

$.onWindowOpenDo(function(){
	setActiveCurrency();
});

$.name.UIInit($, $.getCurrentWindow());
$.symbol.UIInit($, $.getCurrentWindow());
$.code.UIInit($, $.getCurrentWindow());

