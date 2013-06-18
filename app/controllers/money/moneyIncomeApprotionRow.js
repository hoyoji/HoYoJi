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

$.$model.on("_xchange:amount", function(){
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
	}
});

$.onWindowOpenDo(function() {
	if ($.$model.xGet("apportionType") === "Fixed") {
		$.amount.$attrs.editModeEditability = "editable";
		$.amount.$attrs.addModeEditability = "editable";
	} 
	var oldAmount = $.$model.xGet("amount");
	$.$model.on("_xchange:amount", function() {
		if ($.$model.xGet("apportionType") === "Fixed" &&
			$.amount.getValue() && $.amount.getValue() !== oldAmount) {
			var income = $.$model.xGet("moneyIncome");
			var incomeAmount = income.xGet("amount");
			var moneyIncomeApportions = income.xGet("moneyIncomeApportions");
			// var fixedApportions;
			// var averageApportions;
			var averageApportions = [];
			var fixedTotal = 0;
			moneyIncomeApportions.forEach(function(item){
				if(item.xGet("apportionType") === "Fixed") {
					fixedTotal = fixedTotal + item.xGet("amount");
				} else {
				// if(item.xGet("apportionType") === "Average") {
					// averageApportions.add(item);
					averageApportions.push(item);
				}
			});
			var average = (incomeAmount - fixedTotal) / averageApportions.length;
			averageApportions.forEach(function(item) {
				item.xSet("amount", average);
			});
		}
	});
}); 