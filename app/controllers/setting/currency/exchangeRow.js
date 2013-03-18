Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "汇率设置操作"
	});
	menuSection.add(
		$.createContextMenuItem("删除汇率", 
			function() {
				$.deleteModel();
			}
			,isSelectMode));
	
	return menuSection;
}

$.onWindowOpenDo(function(){

     var parentController = $.getParentController();

     parentController.localCurrencyAmount.addEventListener("change", function(){

                 var localCurrencyAmount = parentController.localCurrencyAmount.getValue();
                 var rate = $.$model.get("rate");
                 console.info("++++++"+localCurrencyAmount+"++++++++"+rate);
                 $.foreignCurrencyAmount.setText(String.formatCurrency(foreignCurrencyAmount/rate));
                 
    });

});
