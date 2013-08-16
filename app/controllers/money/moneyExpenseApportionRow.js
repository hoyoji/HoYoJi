Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onWindowOpenDo(function() {
	if ($.$model.xGet("moneyExpense").xGet("ownerUser") !== Alloy.Models.User) {
		$.amountView.setHeight(0);
		$.localAmount.$view.setHeight(28);
	}
});

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "分摊明细操作"
	});
	menuSection.add($.createContextMenuItem("移除成员", function() {
		deleteApportion();
	}, $.$model.xGet("moneyExpense").xGet("ownerUser") !== Alloy.Models.User));

	return menuSection;
};
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

function deleteApportion() {
	if ($.$model.xGet("moneyExpense").xGet("ownerUser") === Alloy.Models.User) {
		if ($.$model.isNew()) {
			$.$model.__xDeletedHidden = true;
			$.$model.xGet("moneyExpense").xGet("moneyExpenseApportions").remove($.$model);
			updateAmount();
		} else {
			$.deleteModel();
		}
	} else {
		alert("没有权限");
	}
}

$.amount.$view.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
});

$.apportionType.label.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
});

$.$view.addEventListener("singletap", function(e) {
	if ($.$model.xGet("moneyExpense").xGet("ownerUser") === Alloy.Models.User) {
		if (e.source !== $.amount.$view || e.source !== $.apportionType.$view) {
			if ($.$model.xGet("apportionType") === "Fixed") {
				$.$model.xSet("apportionType", "Average");
			} else if ($.$model.xGet("apportionType") === "Average") {
				$.$model.xSet("apportionType", "Fixed");
			}
			// $.apportionType.label.fireEvent("change");
		}
	} else {
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

$.amount.field.addEventListener("singletap",function(){
	console.info("+++focus+"+ $.amount.field.focus());
	if($.$model.xGet("apportionType") === "Fixed"){
		$.$model.apportionFocus = true;
	}
});

var oldAmount;
$.onWindowOpenDo(function() {
	if ($.$model.xGet("apportionType") === "Fixed" && $.$model.xGet("moneyExpense").xGet("ownerUser") === Alloy.Models.User) {
		$.amount.$attrs.editModeEditability = "editable";
		$.amount.$attrs.addModeEditability = "editable";
	}
	oldAmount = $.$model.xGet("amount") || 0;
	$.$model.on("_xchange:amount", function() {
		console.info("++++++focus+" + $.amount.field.focus());
		if ($.amount.getValue() && $.$model.xGet("moneyExpense").xGet("amount") && $.$model.xGet("apportionType") === "Fixed" && $.$model.apportionFocus) {
			$.$model.apportionFocus = false;
			var fixedTotal = 0;
			$.$model.xGet("moneyExpense").xGet("moneyExpenseApportions").forEach(function(item) {
				if (!item.__xDeletedHidden && !item.__xDeleted && item.xGet("apportionType") === "Fixed" && item !== $.$model) {
					fixedTotal = fixedTotal + item.xGet("amount");
				}
			});
			if ($.amount.getValue() + fixedTotal > $.$model.xGet("moneyExpense").xGet("amount")) {
				console.info("++amountValue++" + $.amount.getValue() + "++++fixedTotal+++" + fixedTotal);
				alert("分摊总额大于实际支出金额(" + $.$model.xGet("moneyExpense").xGet("amount") + ")，请重新调整");
			} else if ($.amount.getValue() !== oldAmount) {
				updateAmount();
			}
		}
	});
});

if ($.$model.isNew()) {
	updateAmount();
}

function updateAmount() {
	var moneyExpenseApportionsArray = [];
	$.$model.xGet("moneyExpense").xGet("moneyExpenseApportions").forEach(function(item) {
		if (!item.__xDeletedHidden && !item.__xDeleted) {
			moneyExpenseApportionsArray.push(item);
		}
	});
	if (moneyExpenseApportionsArray.length > 0) {
		var expense = $.$model.xGet("moneyExpense");
		var expenseAmount = expense.xGet("amount") || 0;
		var averageApportions = [];
		var fixedTotal = 0;
		moneyExpenseApportionsArray.forEach(function(item) {
			if (item.xGet("apportionType") === "Fixed") {
				fixedTotal = fixedTotal + item.xGet("amount");
			} else {
				averageApportions.push(item);
			}
		});
		if (averageApportions.length > 0) {
			var average = Number(((expenseAmount - fixedTotal) / averageApportions.length).toFixed(2));
			var averageTotal = 0;
			for (var i = 0; i < averageApportions.length - 1; i++) {
				averageApportions[i].xSet("amount", average);
				averageTotal += average;
			}

			console.info("++averageTotal++" + averageTotal + "+++averageApportionsLength+++" + averageApportions.length + "++++++" + ($.$model.xGet("moneyExpense").xGet("amount") - averageTotal));
			averageApportions[averageApportions.length - 1].xSet("amount", $.$model.xGet("moneyExpense").xGet("amount") - averageTotal - fixedTotal);

		}
	}
}

$.name.UIInit($, $.getCurrentWindow());
$.apportionType.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.sharePercentage.UIInit($, $.getCurrentWindow());
$.picture.UIInit($, $.getCurrentWindow());
$.moneySymbol.UIInit($, $.getCurrentWindow());
