Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "分摊明细操作"
	});
	menuSection.add(
		$.createContextMenuItem("移除成员", 
			function() {
				$.deleteModel();
			}));
	
	return menuSection;
}

$.removeMember.addEventListener("singletap", function(){
	$.deleteModel();
});

function updateApportionAmount() {
	if ($.$model.xGet("apportionType") === "Average") {
		var fixedApportions = $.$model.xGet("moneyExpense").xGet("moneyExpenseApportions").xCreateFilter({apportionType : "Fixed"});
	    var fixedTotal;
	    fixedApportions.forEach(function(item){
	    	fixedTotal = fixedTotal + item.xGet("amount");
	    });
	    var average = ($.$model.xGet("moneyExpense").xGet("amount") - fixedTotal ) / ($.$model.xGet("moneyExpense").xGet("moneyExpenseApportions").length - fixedApportions.length);
	 $.amount.setValue(average); 
	 $.amount.field.fireEvent("change");  
	}
}

$.$model.xGet("moneyExpense").on("change:amount",updateApportionAmount);
$.onWindowCloseDo(function(){
	$.$model.xGet("moneyExpense").off("change:amount", updateApportionAmount);	
});