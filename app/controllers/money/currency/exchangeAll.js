Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.exchangesTable.UIInit($, $.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增汇率", function() {
		Alloy.Globals.openWindow("money/currency/exchangeForm", {
			$model : "Exchange",
			data : {
				localCurrency : Alloy.Models.User.xGet("activeCurrency")
			}
		});
	}));
	return menuSection;
}
// $.titleBar.bindXTable($.exchangesTable);

var collection = Alloy.Models.User.xGet("exchanges").xCreateFilter({}, $);
$.exchangesTable.addCollection(collection);
$.exchangesTable.autoHideFooter($.footerBar);

function onFooterbarTap(e) {
	if (e.source.id === "addExchange") {
		Alloy.Globals.openWindow("money/currency/exchangeForm", {
			$model : "Exchange",
			data : {
				localCurrency : Alloy.Models.User.xGet("activeCurrency")
			}
		});
	} else if (e.source.id === "updateAllExchanges") {
		var exchanges = Alloy.Models.User.xGet("exchanges").map(function(exchange) {
			return {
				id : exchange.xGet("id"),
				fromCurrency : exchange.xGet("localCurrencyId"),
				toCurrency : exchange.xGet("foreignCurrencyId")
			}
		});
		if (exchanges.length > 0) {
			$.footerBar.updateAllExchanges.setEnabled(false);
			$.footerBar.updateAllExchanges.showActivityIndicator();
			Alloy.Globals.Server.getExchangeRates(exchanges, function(exchanges) {
				exchanges.forEach(function(exchange) {
					var ex = Alloy.Collections.Exchange.get(exchange.id);
					ex.save({
						rate : exchange.rate
					}, {
						patch : true
					});
				});
				alert("全部汇率更新成功");
				$.footerBar.updateAllExchanges.setEnabled(true);
				$.footerBar.updateAllExchanges.hideActivityIndicator();
			}, function(e) {
				alert(e);
				$.footerBar.updateAllExchanges.setEnabled(true);
				$.footerBar.updateAllExchanges.hideActivityIndicator();
			})
		}
	}
}

// $.localCurrencySymbol.UIInit($, $.getCurrentWindow());
// $.localCurrencyName.UIInit($, $.getCurrentWindow());
