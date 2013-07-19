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
				} else if($.projectShareAuthorization.xGet("state") === "Accept") {
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
				else{
					alert("该成员尚未接受此项目，不能添加");
				}
			}
		};
		attributes.title = "好友";
		attributes.selectModelType = "ProjectShareAuthorization";
		attributes.selectModelCanBeNull = false;
		attributes.selectedModel = $.projectShareAuthorization;
		Alloy.Globals.openWindow("project/projectShareAuthorizationAll", attributes);
	} else if (e.source.id === "addAllIncomeApportionMember") {
		selectedIncome.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
			var existApportion = selectedIncome.xGet("moneyIncomeApportions").xCreateFilter(function(model) {
				return model.xGet("friendUser") === projectShareAuthorization.xGet("friendUser");
			}, $);
			if (projectShareAuthorization.xGet("state") === "Accept" && existApportion.length < 1) {
				var incomeApportion = Alloy.createModel("MoneyIncomeApportion", {
					moneyIncome : selectedIncome,
					friendUser : projectShareAuthorization.xGet("friendUser"),
					amount : selectedIncomeAmount * (projectShareAuthorization.xGet("sharePercentage") / 100),
					apportionType : "Fixed"
				});
				selectedIncome.xGet("moneyIncomeApportions").add(incomeApportion);
			}
		});

	} else if (e.source.id === "sharePercentage") {
		// if(selectedIncome.xGet("moneyIncomeApportions").length !== selectedIncome.xGet("project").xGet("projectShareAuthorizations").length) {
		// alert("只有全部项目成员都参与才能按占股摊");
		// }else {
		selectedIncome.xGet("moneyIncomeApportions").forEach(function(item) {
			item.xSet("amount", selectedIncome.xGet("amount") * (item.getSharePercentage() / 100));
			item.xSet("apportionType", "Fixed");
		});
		// }

	} else if (e.source.id === "halve") {
		var collections = selectedIncome.xGet("moneyIncomeApportions");
		collections.forEach(function(item) {
			item.xSet("amount", selectedIncome.xGet("amount") / collections.length);
			item.xSet("apportionType", "Average");
		});
	}
}

var collection;
if (selectedIncome.xGet("moneyIncomeApportions").length > 0) {
	selectedIncome.hasAddedApportions = true;
}
if (selectedIncome.hasChanged("project")) {
	if (selectedIncome.xGet("moneyIncomeApportions").length > 0) {
		collection = selectedIncome.xGet("moneyIncomeApportions");
		$.moneyIncomeApportionsTable.removeCollection(collection);
	}
	selectedIncome.xGet("moneyIncomeApportions").reset();

	var selectedIncomeAmount = selectedIncome.xGet("amount") || 0;
	selectedIncome.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
		if (projectShareAuthorization.xGet("state") === "Accept") {
			var moneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
				moneyIncome : selectedIncome,
				friendUser : projectShareAuthorization.xGet("friendUser"),
				amount : selectedIncomeAmount * (projectShareAuthorization.xGet("sharePercentage") / 100),
				apportionType : "Fixed"
			});
			selectedIncome.xGet("moneyIncomeApportions").add(moneyIncomeApportion);
		}
	});
	collection = selectedIncome.xGet("moneyIncomeApportions");
	$.moneyIncomeApportionsTable.addCollection(collection);
	selectedIncome.hasAddedApportions = true;
} else {
	if (selectedIncome.isNew() && !selectedIncome.hasAddedApportions) {
		var selectedIncomeAmount = selectedIncome.xGet("amount") || 0;
		selectedIncome.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
			if (projectShareAuthorization.xGet("state") === "Accept") {
				var moneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
					moneyIncome : selectedIncome,
					friendUser : projectShareAuthorization.xGet("friendUser"),
					amount : selectedIncomeAmount * (projectShareAuthorization.xGet("sharePercentage") / 100),
					apportionType : "Fixed"
				});
				selectedIncome.xGet("moneyIncomeApportions").add(moneyIncomeApportion);
			}
		});
		collection = selectedIncome.xGet("moneyIncomeApportions");
		$.moneyIncomeApportionsTable.addCollection(collection);
		selectedIncome.hasAddedApportions = true;
	} else {
		collection = selectedIncome.xGet("moneyIncomeApportions");
		$.moneyIncomeApportionsTable.addCollection(collection);
	}
}

// if (selectedIncome.hasChanged("project") && !selectedIncome.hasChangedProject || selectedIncome.oldProject !== selectedIncome.xGet("project")) {
// selectedIncome.hasChangedProject = true;
// selectedIncome.hasAddedApportions = false;
// selectedIncome.oldProject = selectedIncome.xGet("project");
// }
//
// if (selectedIncome.isNew() && !selectedIncome.hasAddedApportions || !selectedIncome.isNew() && selectedIncome.xGet("moneyIncomeApportions").length < 2) {
// collection = selectedIncome.xGet("moneyIncomeApportions");
// $.moneyIncomeApportionsTable.removeCollection(collection);
// selectedIncome.xGet("moneyIncomeApportions").reset();
//
// selectedIncome.hasAddedApportions = true;
// var selectedIncomeAmount = selectedIncome.xGet("amount") || 0;
// selectedIncome.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
// var moneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
// moneyIncome : selectedIncome,
// friendUser : projectShareAuthorization.xGet("friendUser"),
// amount : selectedIncomeAmount * (projectShareAuthorization.xGet("sharePercentage") / 100),
// apportionType : "Fixed"
// });
// selectedIncome.xGet("moneyIncomeApportions").add(moneyIncomeApportion);
// });
// collection = selectedIncome.xGet("moneyIncomeApportions");
// $.moneyIncomeApportionsTable.addCollection(collection);
//
// } else {
// collection = selectedIncome.xGet("moneyIncomeApportions");
// $.moneyIncomeApportionsTable.addCollection(collection);
// }

$.moneyIncomeApportionsTable.autoHideFooter($.footerBar);
