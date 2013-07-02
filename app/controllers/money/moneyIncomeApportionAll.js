Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyIncomeApportionsTable.UIInit($, $.getCurrentWindow());

var selectedIncome = $.$attrs.selectedIncome;

function onFooterbarTap(e) {
	if (e.source.id === "addIncomeApportionMember") {
		var attributes = {
			selectedProject : selectedIncome.xGet("project"),
			closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
			selectorCallback : function(model) {
				$.projectShareAuthorization = model;
				var oldCollection = selectedIncome.xGet("moneyIncomeApportions");
				var hasMember;
				oldCollection.forEach(function(item) {
					if (item.xGet("friendUser") === $.projectShareAuthorization.xGet("friendUser")) {
						hasMember = true;
						return;
					}
				});
				if (hasMember === true) {
					alert("该成员已存在，无需重复添加");
				} else {
					var newMoneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
						moneyIncome : selectedIncome,
						friendUser : $.projectShareAuthorization.xGet("friendUser"),
						amount : 0,
						apportionType : "Average"
					});
					selectedIncome.xGet("moneyIncomeApportions").add(newMoneyIncomeApportion);
					collection = selectedIncome.xGet("moneyIncomeApportions");
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
if (selectedIncome.hasChanged("project") && !selectedIncome.hasChangedProject || selectedIncome.oldProject !== selectedIncome.xGet("project")) {
	selectedIncome.hasChangedProject = true;
	selectedIncome.hasAddedApportions = false;
	selectedIncome.oldProject = selectedIncome.xGet("project");
}

if (selectedIncome.isNew() && !selectedIncome.hasAddedApportions || !selectedIncome.isNew() && selectedIncome.xGet("moneyIncomeApportions").length < 1) {
	collection = selectedIncome.xGet("moneyIncomeApportions");
	$.moneyIncomeApportionsTable.removeCollection(collection);
	selectedIncome.xGet("moneyIncomeApportions").reset();

	selectedIncome.hasAddedApportions = true;
	var memberCount = selectedIncome.xGet("project").xGet("projectShareAuthorizations").length;
	var selectedIncomeAmount = selectedIncome.xGet("amount") || 0;
	selectedIncome.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
		var moneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
			moneyIncome : selectedIncome,
			friendUser : projectShareAuthorization.xGet("friendUser"),
			amount : selectedIncomeAmount / memberCount,
			apportionType : "Average"
		});
		selectedIncome.xGet("moneyIncomeApportions").add(moneyIncomeApportion);
	});
	collection = selectedIncome.xGet("moneyIncomeApportions");
	$.moneyIncomeApportionsTable.addCollection(collection);

} else {
	collection = selectedIncome.xGet("moneyIncomeApportions");
	$.moneyIncomeApportionsTable.addCollection(collection);
}
$.moneyIncomeApportionsTable.autoHideFooter($.footerBar);
