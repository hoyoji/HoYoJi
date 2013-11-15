Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onWindowOpenDo(function() {
	if ($.$model.xGet("moneyPayback").xGet("ownerUser") !== Alloy.Models.User) {
		$.amountView.setHeight(0);
	}else {
		$.localAmount.hide();
	}
});

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "分摊明细操作"
	});
	menuSection.add($.createContextMenuItem("移除成员", function() {
		deleteApportion();
	}, $.$model.xGet("moneyPayback").xGet("ownerUser") !== Alloy.Models.User));
	menuSection.add($.createContextMenuItem("设为均摊", function() {
		setToAverage();
	}, $.$model.xGet("moneyPayback").xGet("ownerUser") !== Alloy.Models.User || $.$model.xGet("apportionType") === "Average"));
	
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
	if ($.$model.xGet("moneyPayback").xGet("ownerUser") === Alloy.Models.User) {
		if ($.$model.isNew()) {
			$.$model.__xDeletedHidden = true;
			$.$model.xGet("moneyPayback").xGet("moneyPaybackApportions").remove($.$model);
			updateAmount();
		} else {
			$.deleteModel();
		}
	} else {
		alert("没有权限");
	}
}

function setToAverage() {
	$.$model.xSet("apportionType", "Average");
	$.apportionType.refresh();
	updateAmount();
}

// $.amount.$view.addEventListener("singletap", function(e) {
// e.cancelBubble = true;
// });
//
// $.apportionType.label.addEventListener("singletap", function(e) {
// e.cancelBubble = true;
// });

$.$view.addEventListener("singletap", function(e) {
	if ($.$model.xGet("moneyPayback").xGet("ownerUser") === Alloy.Models.User) {
		// if (e.source !== $.amount.$view || e.source !== $.apportionType.$view) {
		// if ($.$model.xGet("apportionType") === "Fixed") {
		// $.$model.xSet("apportionType", "Average");
		// } else if ($.$model.xGet("apportionType") === "Average") {
		// $.$model.xSet("apportionType", "Fixed");
		// }
		// }
		$.$model.apportionFocus = true;
		$.getCurrentWindow().openNumericKeyboard($.amount);

	} else {
		alert("没有权限");
	}
});

// function editApportionType() {
// if ($.$model.xGet("apportionType") === "Fixed") {
// $.amount.$attrs.editModeEditability = "editable";
// $.amount.$attrs.addModeEditability = "editable";
// } else {
// $.amount.$attrs.editModeEditability = "noneditable";
// $.amount.$attrs.addModeEditability = "noneditable";
// updateAmount();
// }
// }
//
// $.$model.on("_xchange:apportionType", editApportionType);
// $.onWindowCloseDo(function() {
// $.$model.off("_xchange:apportionType", editApportionType);
// });

// $.amount.field.addEventListener("singletap", function() {
// // if ($.$model.xGet("apportionType") === "Fixed") {
// $.$model.apportionFocus = true;
// // }
// });

var oldAmount;
$.onWindowOpenDo(function() {
	// if ($.$model.xGet("apportionType") === "Fixed" && $.$model.xGet("moneyPayback").xGet("ownerUser") === Alloy.Models.User) {
	// $.amount.$attrs.editModeEditability = "editable";
	// $.amount.$attrs.addModeEditability = "editable";
	// }
	oldAmount = $.$model.xGet("amount") || 0;
	$.$model.on("_xchange:amount", function() {
		if ($.$model.xGet("amount") && $.$model.xGet("moneyPayback").xGet("amount") && $.$model.apportionFocus) {
			$.$model.apportionFocus = false;
			if ($.$model.xGet("apportionType") === "Average") {
				$.$model.xSet("apportionType", "Fixed");
			}
			var fixedTotal = 0;
			$.$model.xGet("moneyPayback").xGet("moneyPaybackApportions").forEach(function(item) {
				if (!item.__xDeletedHidden && !item.__xDeleted && item.xGet("apportionType") === "Fixed" && item !== $.$model) {
					fixedTotal = fixedTotal + item.xGet("amount");
				}
			});
			if ($.$model.xGet("amount") + fixedTotal > ($.$model.xGet("moneyPayback").xGet("amount") + $.$model.xGet("moneyPayback").xGet("interest"))) {
				console.info("++amountValue++" + $.$model.xGet("amount") + "++++fixedTotal+++" + fixedTotal);
				alert("分摊总额大于实际支出金额(" + $.$model.xGet("moneyPayback").xGet("amount") + ")，请重新调整");
			} else if ($.$model.xGet("amount") !== oldAmount) {
				updateAmount();
			}
		}
	});
});

if ($.$model.isNew()) {
	updateAmount();
}

function updateAmount() {
	var moneyPaybackApportionsArray = [];
	$.$model.xGet("moneyPayback").xGet("moneyPaybackApportions").forEach(function(item) {
		if (!item.__xDeletedHidden && !item.__xDeleted) {
			moneyPaybackApportionsArray.push(item);
		}
	});
	if (moneyPaybackApportionsArray.length > 0) {
		var payback = $.$model.xGet("moneyPayback");
		var paybackAmount = payback.xGet("amount") || 0;
		var averageApportions = [];
		var fixedTotal = 0;
		moneyPaybackApportionsArray.forEach(function(item) {
			if (item.xGet("apportionType") === "Fixed") {
				fixedTotal = fixedTotal + item.xGet("amount");
			} else {
				averageApportions.push(item);
			}
		});
		if ($.$model.hasChanged("apportionType") && $.$model.xGet("apportionType") === "Average" && (fixedTotal > ($.$model.xGet("moneyPayback").xGet("amount") + $.$model.xGet("moneyPayback").xGet("interest")))) {//若其他固定分摊总和大于收支总额，分摊从固定转成均摊不作操作
			alert("分摊总额大于实际支出金额(" + $.$model.xGet("moneyPayback").xGet("amount") + ")，请重新调整");
		} else {
			if (averageApportions.length > 0) {
				var average = Number(((paybackAmount - fixedTotal) / averageApportions.length).toFixed(2));
				var averageTotal = 0;
				for (var i = 0; i < averageApportions.length - 1; i++) {
					averageApportions[i].xSet("amount", average);
					averageTotal += average;
				}

				console.info("++averageTotal++" + averageTotal + "+++averageApportionsLength+++" + averageApportions.length + "++++++" + ($.$model.xGet("moneyPayback").xGet("amount") - averageTotal));
				averageApportions[averageApportions.length - 1].xSet("amount", $.$model.xGet("moneyPayback").xGet("amount") + $.$model.xGet("moneyPayback").xGet("interest") - averageTotal - fixedTotal);

			}
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
