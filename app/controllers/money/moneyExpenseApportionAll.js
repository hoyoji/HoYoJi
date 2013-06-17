Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedExpense = $.$attrs.selectedExpense;

function onFooterbarTap(e) {
	if (e.source.id === "addExpenseApportionMember") {
		var attributes = {
			selectedProject : selectedExpense.xGet("project"),
			closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
			selectorCallback : function(model) {
				$.projectShareAuthorization = model;
				var oldCollection = selectedExpense.xGet("moneyExpenseApportions");
				var hasMember;
				oldCollection.forEach(function(item){
					if(item.xGet("friendUser") === $.projectShareAuthorization.xGet("friendUser")){
						hasMember = true;
						return;
					}
				});
				if (hasMember === true) {
					alert("该成员已存在，无需重复添加");
				} else {
					var newMoneyExpenseApportion = Alloy.createModel("MoneyExpenseApportion", {
						moneyExpense : selectedExpense,
						friendUser : $.projectShareAuthorization.xGet("friendUser"),
						amount : 0,
						apportionType : "Average"
					});
					selectedExpense.xGet("moneyExpenseApportions").add(newMoneyExpenseApportion);
					collection = selectedExpense.xGet("moneyExpenseApportions");
					collection.forEach(function(item) {
						item.trigger("_xchange:amount", item);
					});
				}
			}
		};
		attributes.title = "好友";
		attributes.selectModelType = "ProjectShareAuthorization";
		attributes.selectModelCanBeNull = false;
		attributes.selectedModel = $.projectShareAuthorization;
		Alloy.Globals.openWindow("project/projectShareAuthorizationAll", attributes);
	}
}

var collection;
if (selectedExpense.hasChanged("project") && !selectedExpense.hasChangedProject || selectedExpense.oldProject !== selectedExpense.xGet("project")) {
	selectedExpense.hasChangedProject = true;
	selectedExpense.hasAddedApportions = false;
	selectedExpense.oldProject = selectedExpense.xGet("project");
}

if (selectedExpense.isNew() && !selectedExpense.hasAddedApportions || !selectedExpense.isNew() && selectedExpense.xGet("moneyExpenseApportions").length < 1) {
	collection = selectedExpense.xGet("moneyExpenseApportions");
	$.moneyExpenseApportionsTable.removeCollection(collection);
	selectedExpense.xGet("moneyExpenseApportions").reset();

	selectedExpense.hasAddedApportions = true;
	var memberCount = selectedExpense.xGet("project").xGet("projectShareAuthorizations").length;
	var selectedExpenseAmount = selectedExpense.xGet("amount") || 0;
	selectedExpense.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
		var moneyExpenseApportion = Alloy.createModel("MoneyExpenseApportion", {
			moneyExpense : selectedExpense,
			friendUser : projectShareAuthorization.xGet("friendUser"),
			amount : selectedExpenseAmount / memberCount,
			apportionType : "Average"
		});
		selectedExpense.xGet("moneyExpenseApportions").add(moneyExpenseApportion);
	});
	collection = selectedExpense.xGet("moneyExpenseApportions");
	$.moneyExpenseApportionsTable.addCollection(collection);

} else {
	collection = selectedExpense.xGet("moneyExpenseApportions");
	$.moneyExpenseApportionsTable.addCollection(collection);
}
