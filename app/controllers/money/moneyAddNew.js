Alloy.Globals.extendsBaseViewController($, arguments[0]);

var currentForm = $.moneyExpenseForm;

function onFooterbarTap(e) {
		if(!$[e.source.id]){
			var formName;

			switch(e.source.id){
				case "moneyExpenseForm" : formName = "money/moneyExpenseForm"; break;
				case "moneyIncomeForm" : formName = "money/moneyIncomeForm"; break;
				case "moneyTransferForm" : formName = "money/moneyTransferForm"; break;
				case "moneyBorrowForm" : formName = "money/moneyBorrowForm"; break;
				case "moneyLendForm" : formName = "money/moneyLendForm"; break;
				case "moneyReturnForm" : formName = "money/moneyReturnForm"; break;
				case "moneyPaybackForm" : formName = "money/moneyPaybackForm"; break;
				default : return;
			}

			$[e.source.id]= Alloy.createController(formName);
			$[e.source.id].$view.setTop(0);
			$[e.source.id].$view.setBottom(84);
			$[e.source.id].setParent($.$view);
		} 
		if(currentForm === $[e.source.id]){
			return;
		}
		currentForm.$view.hide();
		currentForm = $[e.source.id];
		currentForm.date.setValue((new Date()).toISOString());	
		$.getCurrentWindow().numericKeyboard.open(currentForm.amount, function(){
			currentForm.titleBar.save();
		}, 42);
		$.getCurrentWindow().__dirtyCount = currentForm.__dirtyCount;
		currentForm.$view.show();
}

$.onWindowOpenDo(function(){
	currentForm.date.setValue((new Date()).toISOString());
	$.getCurrentWindow().numericKeyboard.open(currentForm.amount, function(){
		currentForm.titleBar.save();
	}, 42);
});
