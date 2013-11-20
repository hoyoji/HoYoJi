Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function() {
	var currency = Alloy.createModel("Currency").xFindInDb({
		id : $.$model.xGet("id")
	});
	if (!currency.id) {
		delete $.$model.id;
		// add it as new record
		var activityWindow = Alloy.createController("activityMask");
		activityWindow.open("正在添加币种...");


		// function getAllExchanges(successCB, errorCB) {
		// var errorCount = 0, currencyCount = 0, currencyTotal = Alloy.Models.User.xGet("currencies").length, fetchingExchanges = {};
		// Alloy.Models.User.xGet("currencies").forEach(function(currency) {
		// if (errorCount > 0) {
		// return;
		// }
		// if (currency.xGet("id") === $.$model.xGet("id")) {
		// currencyCount++;
		// if (currencyCount === currencyTotal) {
		// successCB();
		// }
		// return;
		// }
		// if (fetchingExchanges[currency.xGet("id")] !== true) {
		// var exchange = Alloy.createModel("Exchange").xFindInDb({
		// localCurrencyId : $.$model.xGet("id"),
		// foreignCurrencyId : currency.xGet("id")
		// });
		// if (!exchange.id) {
		// fetchingExchanges[currency.xGet("id")] = true;
		// Alloy.Globals.Server.getExchangeRate($.$model.xGet("id"), currency.xGet("id"), function(rate) {
		// exchange = Alloy.createModel("Exchange", {
		// localCurrencyId : $.$model.xGet("id"),
		// foreignCurrencyId : currency.xGet("id"),
		// rate : rate
		// });
		// exchange.xSet("ownerUser", Alloy.Models.User);
		// exchange.xSet("ownerUserId", Alloy.Models.User.id);
		// exchange.save();
		//
		// currencyCount++;
		// if (currencyCount === currencyTotal) {
		// successCB();
		// }
		// }, function(e) {
		// if (errorCount === 0) {
		// errorCB(e);
		// }
		// errorCount++;
		// });
		// } else {
		// currencyCount++;
		// if (currencyCount === currencyTotal) {
		// successCB();
		// }
		// }
		//
		// } else {
		// currencyCount++;
		// if (currencyCount === currencyTotal) {
		// successCB();
		// }
		// }
		// });
		// }


		// getAllExchanges(function(e) {
		// $.$model.xSet("ownerUser", Alloy.Models.User);
		// $.$model.xSet("ownerUserId", Alloy.Models.User.id);
		// $.$model.save();
		// activityWindow.showMsg("币种添加成功。");
		// $.getCurrentWindow().close();
		// }, function(e) {
		// activityWindow.showMsg("币种添加失败,请重试：" + e.__summary.msg);
		// return;
		// });
		function createExchange(successCB, errorCB) {
			var activeCurrency = Alloy.Models.User.xGet("activeCurrency");
			var exchange = Alloy.createModel("Exchange").xFindInDb({
				localCurrencyId : $.$model.xGet("id"),
				foreignCurrencyId : activeCurrency.xGet("id")
			});
			if (!exchange.id) {
				Alloy.Globals.Server.getExchangeRate($.$model.xGet("id"), activeCurrency.xGet("id"), function(rate) {
					exchange = Alloy.createModel("Exchange", {
						localCurrencyId : $.$model.xGet("id"),
						foreignCurrencyId : activeCurrency.xGet("id"),
						rate : rate
					});
					exchange.xSet("ownerUser", Alloy.Models.User);
					exchange.xSet("ownerUserId", Alloy.Models.User.id);
					$.$model.xSet("ownerUser", Alloy.Models.User);
					$.$model.xSet("ownerUserId", Alloy.Models.User.id);
					$.$model.save();
					exchange.save();
					successCB();
				}, function(e) {
					errorCB(e);
				});
			} else {
				$.$model.xSet("ownerUser", Alloy.Models.User);
				$.$model.xSet("ownerUserId", Alloy.Models.User.id);
				$.$model.save();
				successCB();
			}
		}

		createExchange(function(e) {
			activityWindow.showMsg("币种添加成功");
			$.getCurrentWindow().close();
		}, function(e) {
			activityWindow.showMsg("币种添加失败,请重试：" + e.__summary.msg);
			return;
		});
	} else {
		alert("币种已经存在，不能重复添加");
	}

	return false;
};

$.name.UIInit($, $.getCurrentWindow());
$.symbol.UIInit($, $.getCurrentWindow());
$.code.UIInit($, $.getCurrentWindow());
