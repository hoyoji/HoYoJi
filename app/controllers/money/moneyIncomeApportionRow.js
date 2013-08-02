Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onWindowOpenDo(function() {
 if($.$model.xGet("moneyIncome").xGet("ownerUser") !== Alloy.Models.User){
 	$.amount.$view.setHeight(0);
 	$.localAmount.$view.setHeight(28);
 }
});

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "分摊明细操作"
	});
	menuSection.add($.createContextMenuItem("移除成员", function() {
		$.deleteModel();
	}, !$.$model.canDelete()));

	return menuSection;
}
function refreshAmount() {
	$.amount.refresh();
}

function updateApportionType() {
	$.apportionType.refresh();
}

$.$model.on("_xchange:amount", refreshAmount);
$.$model.on("_xchange:apportionType", updateApportionType);
$.onWindowCloseDo(function() {
	$.$model.off("_xchange:amount", refreshAmount);
	$.$model.off("_xchange:apportionType", updateApportionType);
});

$.removeMember.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
	if ($.$model.xGet("moneyIncome").xGet("ownerUser") === Alloy.Models.User) {
		if ($.$model.isNew()) {
			$.$model.__xDeletedHidden = true;
			$.$model.xGet("moneyIncome").xGet("moneyIncomeApportions").remove($.$model);
			updateAmount();
		} else {
			$.deleteModel();
		}
	} else {
		alert("没有权限");
	}
});

$.amount.$view.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
});

$.apportionType.label.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
});

$.$view.addEventListener("singletap", function(e) {
	if ($.$model.xGet("moneyIncome").xGet("ownerUser") === Alloy.Models.User) {
	if (e.source !== $.amount.$view || e.source !== $.apportionType.$view || e.source !== $.removeMember.$view) {
		if ($.$model.xGet("apportionType") === "Fixed") {
			$.$model.xSet("apportionType", "Average");
		} else if ($.$model.xGet("apportionType") === "Average") {
			$.$model.xSet("apportionType", "Fixed");
		}
		// $.apportionType.field.fireEvent("change");
	}}
	else {
		alert("没有权限");
	}
});

function editApportionType() {
	if ($.$model.xGet("apportionType") === "Fixed") {
		$.amount.$attrs.editModeEditability = "editable";
		$.amount.$attrs.addModeEditability = "editable";
	} else {
		$.amount.$attrs.editModeEditability = "noneditable";
		$.amount.$attrs.addModeEditability = "noneditable";
		updateAmount();
	}
}

$.$model.on("_xchange:apportionType", editApportionType);
$.onWindowCloseDo(function() {
	$.$model.off("_xchange:apportionType", editApportionType);
});

var oldAmount;
$.onWindowOpenDo(function() {
	if ($.$model.xGet("apportionType") === "Fixed" && $.$model.xGet("moneyIncome").xGet("ownerUser") === Alloy.Models.User) {
		$.amount.$attrs.editModeEditability = "editable";
		$.amount.$attrs.addModeEditability = "editable";
	}
	oldAmount = $.$model.xGet("amount") || 0;
	$.$model.on("_xchange:amount", function() {
		if ($.amount.getValue() && $.$model.xGet("moneyIncome").xGet("amount") && $.$model.xGet("apportionType") === "Fixed") {
			var fixedTotal = 0;
			$.$model.xGet("moneyIncome").xGet("moneyIncomeApportions").forEach(function(item) {
				if (!item.__xDeletedHidden && item.xGet("apportionType") === "Fixed" && item !== $.$model) {
					fixedTotal = fixedTotal + item.xGet("amount");
				}
			});
			if ($.amount.getValue() + fixedTotal > $.$model.xGet("moneyIncome").xGet("amount")) {
				alert("分摊总额大于实际收入金额(" + $.$model.xGet("moneyIncome").xGet("amount") + ")，请重新调整");
			}
			else if ($.amount.getValue() !== oldAmount) {
				updateAmount();
			}
		}
	});
});

if ($.$model.isNew()) {
	updateAmount();
}

function updateAmount() {
	var moneyIncomeApportionsArray = [];
	$.$model.xGet("moneyIncome").xGet("moneyIncomeApportions").forEach(function(item){
		if(!item.__xDeletedHidden){
			moneyIncomeApportionsArray.push(item);
		}
	});
	if (moneyIncomeApportionsArray.length > 0) {
		var income = $.$model.xGet("moneyIncome");
		var incomeAmount = income.xGet("amount") || 0;
		var averageApportions = [];
		var fixedTotal = 0;
		moneyIncomeApportionsArray.forEach(function(item) {
			if (item.xGet("apportionType") === "Fixed") {
				fixedTotal = fixedTotal + item.xGet("amount");
			} else {
				averageApportions.push(item);
			}
		});
		var average = (incomeAmount - fixedTotal) / averageApportions.length;
		averageApportions.forEach(function(item) {
			if (item.xGet("apportionType") === "Average") {
				item.xSet("amount", average);
			}
		});
	}
}

$.name.UIInit($, $.getCurrentWindow());
$.apportionType.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());

