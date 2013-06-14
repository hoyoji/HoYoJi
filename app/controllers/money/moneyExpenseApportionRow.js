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

$.removeMember.addEventListener("singletap", function() {
	$.deleteModel();
});

$.apportionType.field.addEventListener("change", function() {
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
	$.amount.field.addEventListener("change", function() {
		if ($.amount.getValue() && $.amount.getValue() !== oldAmount) {
			var expense = $.$model.xGet("moneyExpense");
			var expenseAmount = expense.xGet("amount");
			var moneyExpenseApportions = expense.xGet("moneyExpenseApportions");
			var fixedApportions;
			var averageApportions;
			var fixedTotal = 0;
			moneyExpenseApportions.forEach(function(item){
				if(item.xGet("apportionType") === "Fixed") {
					fixedTotal = fixedTotal + item.xGet("amount");
				}
				if(item.xGet("apportionType") === "Average") {
					averageApportions.add(item);
				}
			});
			var average = (expenseAmount - fixedTotal) / averageApportions.length;
			averageApportions.forEach(function(item) {
				item.xSet("amount", average);
			});
		}
	});
}); 