Alloy.Globals.extendsBaseUIController($, arguments[0]);

var totalField = $.$attrs.totalField || "SUM(main.amount / IFNULL(ex.rate, 1))", value = 0, query, queryApportion, queryLend, queryBorrow, queryReturnInterest, queryPaybackInterest, querySelect, querySelectApportion, querySelectLend, querySelectBorrow, querySelectReturnInterest, querySelectPaybackInterest;
if ($.$attrs.modelType === "PersonalIncome") {
	querySelect = "SELECT SUM(main.amount * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyIncome main JOIN Project prj1 ON prj1.id = main.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
	//querySelectApportion = "SELECT SUM(main.amount * mi.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyIncomeApportion main JOIN Project prj1 ON prj1.id = mi.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
	querySelectBorrow = "SELECT SUM(main.amount * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyBorrow main JOIN Project prj1 ON prj1.id = main.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
	querySelectPaybackInterest = "SELECT SUM(main.interest * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL, SUM(main.amount * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL2 FROM MoneyPayback main JOIN Project prj1 ON prj1.id = main.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
} else if ($.$attrs.modelType === "PersonalExpense") {
	querySelect = "SELECT SUM(main.amount * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyExpense main JOIN Project prj1 ON prj1.id = main.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
	//querySelectApportion = "SELECT SUM(main.amount * mi.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyExpenseApportion main JOIN Project prj1 ON prj1.id = mi.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
	querySelectLend = "SELECT SUM(main.amount * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyLend main JOIN Project prj1 ON prj1.id = main.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
	querySelectReturnInterest = "SELECT SUM(main.interest * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL, SUM(main.amount * main.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL2 FROM MoneyReturn main JOIN Project prj1 ON prj1.id = main.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
} else if ($.$attrs.modelType === "MoneyExpenseApportion") {
	querySelect = "SELECT SUM(main.amount * mi.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyExpenseApportion main JOIN Project prj1 ON prj1.id = mi.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
} else if ($.$attrs.modelType === "MoneyIncomeApportion") {
	querySelect = "SELECT SUM(main.amount * mi.exchangeRate / IFNULL(ex.rate, 1)) AS TOTAL FROM MoneyIncomeApportion main JOIN Project prj1 ON prj1.id = mi.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
} else {
	querySelect = "SELECT " + totalField + " AS TOTAL FROM " + $.$attrs.modelType + " main JOIN Project prj1 ON prj1.id = main.projectId LEFT JOIN Exchange ex ON ex.foreignCurrencyId = prj1.currencyId AND ex.localCurrencyId = '" + Alloy.Models.User.xGet("activeCurrencyId") + "' ";
}

exports.query = function(queryStr) {
	var queryStr = queryStr || $.$attrs.queryStr, queryStrApportion;
	if (queryStr) {
		if (queryStr.startsWith("dateRange:")) {
			var d = new Date(), dStart, dEnd;
			if (queryStr === "dateRange:date") {
				dStart = d.getUTCTimeOfDateStart().toISOString();
				dEnd = d.getUTCTimeOfDateEnd().toISOString();
			} else if (queryStr === "dateRange:week") {
				dStart = d.getUTCTimeOfWeekStart().toISOString();
				dEnd = d.getUTCTimeOfWeekEnd().toISOString();
			} else if (queryStr === "dateRange:month") {
				dStart = d.getUTCTimeOfMonthStart().toISOString();
				dEnd = d.getUTCTimeOfMonthEnd().toISOString();
			}
			queryStr = " date >= '" + dStart + "' AND date <= '" + dEnd + "'";
			if ($.$attrs.modelType === "PersonalIncome" || $.$attrs.modelType === "PersonalExpense") {
				//	queryStrApportion = queryStr + " AND main.friendUserId = '" + Alloy.Models.User.id + "' AND mi.ownerUserId <> '" + Alloy.Models.User.id + "'";
				queryStr = queryStr + " AND main.ownerUserId = '" + Alloy.Models.User.id + "'";
			} else if ($.$attrs.modelType === "MoneyIncomeApportion" || $.$attrs.modelType === "MoneyExpenseApportion") {
				queryStr = queryStr + " AND main.friendUserId = '" + Alloy.Models.User.id + "' AND mi.ownerUserId <> '" + Alloy.Models.User.id + "'";
			} else {
				queryStr = queryStr + " AND main.ownerUserId = '" + Alloy.Models.User.id + "'";
			}
		} else {
			if ($.$attrs.modelType === "PersonalIncome" || $.$attrs.modelType === "PersonalExpense") {
				queryStr = queryStr + " AND main.ownerUserId = '" + Alloy.Models.User.id + "'";
			} else if ($.$attrs.modelType === "MoneyIncomeApportion" || $.$attrs.modelType === "MoneyExpenseApportion") {
				queryStr = queryStr + " AND main.friendUserId = '" + Alloy.Models.User.id + "' AND mi.ownerUserId <> '" + Alloy.Models.User.id + "'";
			} else {
				queryStr = queryStr + " AND main.ownerUserId = '" + Alloy.Models.User.id + "'";
			}
		}
		query = querySelect + " WHERE " + queryStr;
		if ($.$attrs.modelType === "PersonalIncome") {
			//queryApportion = querySelectApportion + " WHERE " + queryStrApportion;
			queryBorrow = querySelectBorrow + " WHERE " + queryStr;
			queryPaybackInterest = querySelectPaybackInterest + " WHERE " + queryStr;
		} else if ($.$attrs.modelType === "PersonalExpense") {
			//queryApportion = querySelectApportion + " WHERE " + queryStrApportion;
			queryLend = querySelectLend + " WHERE " + queryStr;
			queryReturnInterest = querySelectReturnInterest + " WHERE " + queryStr;
		}
	} else {
		query = querySelect + " WHERE " + queryStr;
		if ($.$attrs.modelType === "PersonalIncome") {
			//queryApportion = querySelectApportion;
			queryBorrow = querySelectBorrow;
			queryPaybackInterest = querySelectPaybackInterest;
		} else if ($.$attrs.modelType === "PersonalExpense") {
			//queryApportion = querySelectApportion;
			queryLend = querySelectLend;
			queryReturnInterest = querySelectReturnInterest;
		} else if ($.$attrs.modelType === "MoneyIncomeApportion" || $.$attrs.modelType === "MoneyExpenseApportion") {
			queryStr = queryStr + " AND main.friendUserId = '" + Alloy.Models.User.id + "' AND mi.ownerUserId <> '" + Alloy.Models.User.id + "'";
		} else {
			queryStr = queryStr + " AND main.ownerUserId = '" + Alloy.Models.User.id + "'";
		}
	}
	exports.refresh();
};

exports.refresh = function() {
	var config, Model, model;

	if ($.$attrs.modelType === "PersonalIncome") {
		config = Alloy.createModel("MoneyIncome").config;
		Model = Alloy.M("MoneyIncome", {
			config : config
		});
	} else if ($.$attrs.modelType === "PersonalExpense") {
		config = Alloy.createModel("MoneyExpense").config;
		Model = Alloy.M("MoneyExpense", {
			config : config
		});
	} else {
		config = Alloy.createModel($.$attrs.modelType).config;
		Model = Alloy.M($.$attrs.modelType, {
			config : config
		});
	}

	model = new Model({
		TOTAL : 0
	});
	model.fetch({
		query : query
	});
	value = model.get("TOTAL") || 0;

	if ($.$attrs.modelType === "PersonalIncome") {
		// config = Alloy.createModel("MoneyIncomeApportion").config;
		// Model = Alloy.M("MoneyIncomeApportion", {
		// config : config
		// });
		// model = new Model({
		// TOTAL : 0
		// });
		// model.fetch({
		// query : queryApportion
		// });
		// value += model.get("TOTAL") || 0;

		config = Alloy.createModel("MoneyBorrow").config;
		Model = Alloy.M("MoneyBorrow", {
			config : config
		});
		model = new Model({
			TOTAL : 0,
			TOTAL2 : 0
		});
		model.fetch({
			query : queryBorrow
		});
		value += model.get("TOTAL") || 0;

		config = Alloy.createModel("MoneyPayback").config;
		Model = Alloy.M("MoneyPayback", {
			config : config
		});
		model = new Model({
			TOTAL : 0,
			TOTAL2 : 0
		});
		model.fetch({
			query : queryPaybackInterest
		});
		value += model.get("TOTAL") || 0 + model.get("TOTAL2") || 0;
	} else if ($.$attrs.modelType === "PersonalExpense") {
		// config = Alloy.createModel("MoneyExpenseApportion").config;
		// Model = Alloy.M("MoneyExpenseApportion", {
		// config : config
		// });
		// model = new Model({
		// TOTAL : 0
		// });
		// model.fetch({
		// query : queryApportion
		// });
		// value += model.get("TOTAL") || 0;

		config = Alloy.createModel("MoneyLend").config;
		Model = Alloy.M("MoneyLend", {
			config : config
		});
		model = new Model({
			TOTAL : 0,
			TOTAL2 : 0
		});
		model.fetch({
			query : queryLend
		});
		value += model.get("TOTAL") || 0;

		config = Alloy.createModel("MoneyReturn").config;
		Model = Alloy.M("MoneyReturn", {
			config : config
		});
		model = new Model({
			TOTAL : 0,
			TOTAL2 : 0
		});
		model.fetch({
			query : queryReturnInterest
		});
		value += model.get("TOTAL") || 0 + model.get("TOTAL2") || 0;
	}

	$.moneyTotal.setText(value.toUserCurrency());
};

exports.getValue = function() {
	return value;
};

if ($.$attrs.autoSync === "true") {
	exports.query();
	if ($.$attrs.modelType === "PersonalIncome") {
		Alloy.Collections["MoneyIncome"].on("add destroy sync", exports.refresh);
		Alloy.Collections["MoneyBorrow"].on("add destroy sync", exports.refresh);
		Alloy.Collections["MoneyPayback"].on("add destroy sync", exports.refresh);
	} else if ($.$attrs.modelType === "PersonalExpense") {
		Alloy.Collections["MoneyExpense"].on("add destroy sync", exports.refresh);
		Alloy.Collections["MoneyLend"].on("add destroy sync", exports.refresh);
		Alloy.Collections["MoneyReturn"].on("add destroy sync", exports.refresh);
	} else {
		Alloy.Collections[$.$attrs.modelType].on("add destroy sync", exports.refresh);
	}
	$.onWindowCloseDo(function() {
		if ($.$attrs.modelType === "PersonalIncome") {
			Alloy.Collections["MoneyIncome"].off("add destroy sync", exports.refresh);
			Alloy.Collections["MoneyBorrow"].off("add destroy sync", exports.refresh);
			Alloy.Collections["MoneyPayback"].off("add destroy sync", exports.refresh);
		} else if ($.$attrs.modelType === "PersonalExpense") {
			Alloy.Collections["MoneyExpense"].off("add destroy sync", exports.refresh);
			Alloy.Collections["MoneyLend"].off("add destroy sync", exports.refresh);
			Alloy.Collections["MoneyReturn"].off("add destroy sync", exports.refresh);
		} else {
			Alloy.Collections[$.$attrs.modelType].off("add destroy sync", exports.refresh);
		}
	});
}

if ($.$attrs.font) {
	$.moneyTotal.setFont($.$attrs.font);
}

if ($.$attrs.color) {
	$.moneyTotal.setColor($.$attrs.color);
}
