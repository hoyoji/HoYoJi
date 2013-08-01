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
					if (item.xGet("friendUser") === $.projectShareAuthorization.xGet("friendUser") && !item.__xDeletedHidden) {
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
					collection = selectedIncome.xGet("moneyIncomeApportions");
					collection.forEach(function(item) {
						if (!item.__xDeletedHidden) {
							item.trigger("_xchange:amount", item);
						}
					});
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
				return model.xGet("friendUser") === projectShareAuthorization.xGet("friendUser") && !model.__xDeletedHidden;
			}, $);
			if (existApportion.length < 1 && projectShareAuthorization.xGet("state") === "Accept") {
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
		var amountTotal = 0, lastItem;
		selectedIncome.xGet("moneyIncomeApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				var amount = Number((selectedIncome.xGet("amount") * (item.getSharePercentage() / 100)).toFixed(2));
				item.xSet("amount", amount);
				item.xSet("apportionType", "Fixed");
				lastItem = item;
				amountTotal += amount;
			}
		});
		// 把分不尽的小数部分加到最后一个人身上
		if (amountTotal !== selectedIncome.xGet("amount") && lastItem) {
			lastItem.xSet("amount", lastItem.xGet("amount") + (selectedIncome.xGet("amount") - amountTotal));
		}
	} else if (e.source.id === "halve") {
		var apportions = [];
		selectedIncome.xGet("moneyIncomeApportions").forEach(function(item) {
				if (!item.__xDeletedHidden && !item.__xDeleted) {
					apportions.push(item);
				}
		});
		if(apportions.length > 0) {
			var amount = Number((selectedIncome.xGet("amount") / apportions.length).toFixed(2));
			var amountTotal = 0;
			apportions.forEach(function(item){
				item.xSet("amount", amount);
				item.xSet("apportionType", "Average");
				amountTotal += amount;
			});
			// 把分不尽的小数部分加到最后一个人身上
			if(amountTotal !== selectedIncome.xGet("amount")){
				apportions[apportions.length - 1].xSet("amount", amount + (selectedIncome.xGet("amount") - amountTotal));
			}
		}
	}
}

selectedIncome.generateIncomeApportions();
var collection = selectedIncome.xGet("moneyIncomeApportions").xCreateFilter(function(model) {
	return model.__xDeletedHidden !== true;
});
$.moneyIncomeApportionsTable.addCollection(collection);

$.moneyIncomeApportionsTable.autoHideFooter($.footerBar);
