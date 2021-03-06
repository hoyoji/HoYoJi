Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyIncomeApportionsTable.UIInit($, $.getCurrentWindow());

var selectedIncome = $.$attrs.selectedIncome;

$.onWindowOpenDo(function() {
	if (selectedIncome.xGet("ownerUser") !== Alloy.Models.User) {
		$.footerBar.addIncomeApportionMember.setEnabled(false);
		$.footerBar.addAllIncomeApportionMember.setEnabled(false);
		$.footerBar.sharePercentage.setEnabled(false);
		$.footerBar.average.setEnabled(false);
	}
});

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
					if (item.xGet("friendUser") === $.projectShareAuthorization.xGet("friendUser") && !item.__xDeletedHidden && !item.__xDeleted) {
						hasMember = true;
						return;
					}
				});
				if (hasMember === true) {
					alert("该成员已存在，无需重复添加");
				} else if ($.projectShareAuthorization.xGet("state") === "Accept") {
					var newMoneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
						moneyIncome : selectedIncome,
						friendUser : $.projectShareAuthorization.xGet("friendUser"),
						amount : 0,
						apportionType : "Average"
					});
					selectedIncome.xGet("moneyIncomeApportions").add(newMoneyIncomeApportion);
					// collection = selectedIncome.xGet("moneyIncomeApportions");
					// collection.forEach(function(item) {
					// if (!item.__xDeletedHidden) {
					// item.trigger("_xchange:amount", item);
					// }
					// });
				} else {
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
				return model.xGet("friendUser") === projectShareAuthorization.xGet("friendUser") && !model.__xDeletedHidden && !model.__xDeleted;
			}, $);
			if (projectShareAuthorization.xGet("state") === "Accept" && existApportion.length === 0) {
				var incomeApportion = Alloy.createModel("MoneyIncomeApportion", {
					moneyIncome : selectedIncome,
					friendUser : projectShareAuthorization.xGet("friendUser"),
					amount : 0,
					apportionType : "average"
				});
				selectedIncome.xGet("moneyIncomeApportions").add(incomeApportion);
			}
		});

	} else if (e.source.id === "sharePercentage") {
		var amountTotal = 0;
		var apportions = [];
		selectedIncome.xGet("moneyIncomeApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				apportions.push(item);
			}
		});
		if (apportions.length > 0) {
			for (var i = 0; i < apportions.length - 1; i++) {
				var amount = Number((selectedIncome.xGet("amount") * (apportions[i].getSharePercentage() / 100)).toFixed(2));
				apportions[i].xSet("amount", amount);
				apportions[i].xSet("apportionType", "Fixed");
				amountTotal += amount;
			}
			// 把分不尽的小数部分加到最后一个人身上
			apportions[apportions.length - 1].xSet("apportionType", "Fixed");
			apportions[apportions.length - 1].xSet("amount", (selectedIncome.xGet("amount") - amountTotal));
		}
	} else if (e.source.id === "average") {
		var apportions = [];
		selectedIncome.xGet("moneyIncomeApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				apportions.push(item);
			}
		});
		if (apportions.length > 0) {
			var amount = Number((selectedIncome.xGet("amount") / apportions.length).toFixed(2));
			console.info("+++++aveAmount+++" + amount);
			var amountTotal = 0;
			for (var i = 0; i < apportions.length - 1; i++) {
				apportions[i].xSet("amount", amount);
				apportions[i].xSet("apportionType", "Average");
				amountTotal += amount;
			}
			// 把分不尽的小数部分加到最后一个人身上
			apportions[apportions.length - 1].xSet("apportionType", "Average");
			apportions[apportions.length - 1].xSet("amount", (selectedIncome.xGet("amount") - amountTotal));
		}
	}
}

selectedIncome.generateIncomeApportions();
var collection = selectedIncome.xGet("moneyIncomeApportions").xCreateFilter(function(model) {
	return model.__xDeletedHidden !== true;
});
$.moneyIncomeApportionsTable.addCollection(collection);

$.moneyIncomeApportionsTable.autoHideFooter($.footerBar);

$.titleBar.UIInit($, $.getCurrentWindow());
