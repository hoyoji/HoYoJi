Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "分摊明细操作"
	});
	menuSection.add($.createContextMenuItem("移除成员", function() {
		$.deleteModel();
	}));

	return menuSection;
}

$.$model.on("_xchange:amount", function() {
	$.amount.refresh();
});

$.removeMember.addEventListener("singletap", function() {
	$.deleteModel();
});

$.$model.on("_xchange:apportionType", function() {
	if ($.apportionType.getValue() === "Fixed") {
		$.amount.$attrs.editModeEditability = "editable";
		$.amount.$attrs.addModeEditability = "editable";
	} else {
		$.amount.$attrs.editModeEditability = "noneditable";
		$.amount.$attrs.addModeEditability = "noneditable";
		updateAmount();
	}
});

$.onWindowOpenDo(function() {
	if ($.$model.xGet("apportionType") === "Fixed") {
		$.amount.$attrs.editModeEditability = "editable";
		$.amount.$attrs.addModeEditability = "editable";
	}
	oldAmount = $.$model.xGet("amount");
	$.$model.on("_xchange:amount", function() {
		if ($.amount.getValue() && $.$model.xGet("moneyIncome").xGet("amount") && $.amount.getValue() > $.$model.xGet("moneyIncome").xGet("amount")) {
			alert("分摊金额大于实际收入金额(" + $.$model.xGet("moneyIncome").xGet("amount") + ")，请重新输入");
		} else {
			if ($.$model.xGet("apportionType") === "Fixed" && $.amount.getValue() && $.amount.getValue() !== oldAmount) {
			updateAmount();
			}
		}
	});
});

var oldAmount;
var income;
var incomeAmount;
var moneyIncomeApportions;
var averageApportions;
var fixedTotal;
var average;
function updateAmount() {
	income = $.$model.xGet("moneyIncome");
	incomeAmount = income.xGet("amount");
	moneyIncomeApportions = income.xGet("moneyIncomeApportions");
	averageApportions = [];
	fixedTotal = 0;
	moneyIncomeApportions.forEach(function(item) {
		if (item.xGet("apportionType") === "Fixed") {
			fixedTotal = fixedTotal + item.xGet("amount");
		} else {
			averageApportions.push(item);
		}
	});
	average = (incomeAmount - fixedTotal) / averageApportions.length;
	averageApportions.forEach(function(item) {
		if (item.xGet("apportionType") === "Average") {
			item.xSet("amount", average);
		}
	});
}

