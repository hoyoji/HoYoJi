Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "币种设置操作"
	});
	menuSection.add($.createContextMenuItem("设为本币", function() {
		if ($.$model !== Alloy.Models.User.xGet("userData").xGet("activeCurrency")) {
			var activityWindow = Alloy.createController("activityMask");
			activityWindow.open("正在切换...");
			function getAllExchanges(successCB, errorCB) {
				var errorCount = 0, currencyCount = 0, currencyTotal = Alloy.Models.User.xGet("currencies").length,fetchingExchanges = {};
				Alloy.Models.User.xGet("currencies").forEach(function(currency) {
					if (errorCount > 0) {
						return;
					}
					if (currency.xGet("id") === $.$model.xGet("id")) {
						currencyCount++;
						if (currencyCount === currencyTotal) {
							successCB();
						}
						return;
					}
					if (fetchingExchanges[currency.xGet("id")] !== true) {
						var exchange = Alloy.createModel("Exchange").xFindInDb({
							localCurrencyId : $.$model.xGet("id"),
							foreignCurrencyId : currency.xGet("id")
						});
						if (!exchange.id) {
							fetchingExchanges[currency.xGet("id")] = true;
							Alloy.Globals.Server.getExchangeRate($.$model.xGet("id"), currency.xGet("id"), function(rate) {
								exchange = Alloy.createModel("Exchange", {
									localCurrencyId : $.$model.xGet("id"),
									foreignCurrencyId : currency.xGet("id"),
									rate : rate
								});
								exchange.xSet("ownerUser", Alloy.Models.User);
								exchange.xSet("ownerUserId", Alloy.Models.User.id);
								exchange.save();

								currencyCount++;
								if (currencyCount === currencyTotal) {
									successCB();
								}
							}, function(e) {
								if (errorCount === 0) {
									errorCB(e);
								}
								errorCount++;
							});
						} else {
							currencyCount++;
							if (currencyCount === currencyTotal) {
								successCB();
							}
						}

					} else {
						currencyCount++;
						if (currencyCount === currencyTotal) {
							successCB();
						}
					}
				});
			}

			getAllExchanges(function(e) {
				Alloy.Models.User.xSet("activeCurrency", $.$model);
				Alloy.Models.User.save({
					activeCurrencyId : $.$model.xGet("id")
				}, {
					wait : true,
					patch : true
				});
				activityWindow.showMsg("币种切换成功，系统将自动重新登录以使外币金额换成新本币显示", Alloy.Globals.relogin);
			}, function(e) {
				activityWindow.showMsg("切换失败,请重试：" + e.__summary.msg);
				return;
			});
		}
	}, isSelectMode));
	// menuSection.add($.createContextMenuItem("删除币种", function() {
	// $.deleteModel();
	// },isSelectMode));
	return menuSection;
};

function setActiveCurrency() {
	if (Alloy.Models.User.xGet("userData").xGet("activeCurrency") === $.$model) {
		$.check.setVisible(true);
	} else {
		$.check.setVisible(false);
	}
}

Alloy.Models.User.on("sync", setActiveCurrency);
$.onWindowCloseDo(function() {
	Alloy.Models.User.off("sync", setActiveCurrency);
});

$.onWindowOpenDo(function() {
	setActiveCurrency();
});

$.name.UIInit($, $.getCurrentWindow());
$.symbol.UIInit($, $.getCurrentWindow());
$.code.UIInit($, $.getCurrentWindow());

