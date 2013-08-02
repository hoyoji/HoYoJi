Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyExpenseApportionsTable.UIInit($, $.getCurrentWindow());

var selectedExpense = $.$attrs.selectedExpense;

$.onWindowOpenDo(function() {
	if (selectedExpense.xGet("ownerUser") === Alloy.Models.User) {
		$.footerBar.addExpenseApportionMember.setEnabled(false);
		$.footerBar.addAllExpenseApportionMember.setEnabled(false);
		$.footerBar.sharePercentage.setEnabled(false);
		$.footerBar.average.setEnabled(false);
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addExpenseApportionMember") {
		var attributes = {
			selectedProject : selectedExpense.xGet("project"),
			closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
			selectorCallback : function(model) {
				$.projectShareAuthorization = model;
				var oldCollection = selectedExpense.xGet("moneyExpenseApportions");
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
					var newMoneyExpenseApportion = Alloy.createModel("MoneyExpenseApportion", {
						moneyExpense : selectedExpense,
						friendUser : $.projectShareAuthorization.xGet("friendUser"),
						amount : 0,
						apportionType : "Average"
					});
					selectedExpense.xGet("moneyExpenseApportions").add(newMoneyExpenseApportion);
					collection = selectedExpense.xGet("moneyExpenseApportions");
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
	} else if (e.source.id === "addAllExpenseApportionMember") {
		selectedExpense.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
			var existApportion = selectedExpense.xGet("moneyExpenseApportions").xCreateFilter(function(model) {
				return model.xGet("friendUser") === projectShareAuthorization.xGet("friendUser") && !model.__xDeletedHidden;
			}, $);
			if (projectShareAuthorization.xGet("state") === "Accept" && existApportion.length === 0) {
				var amount = Number((selectedExpense.xGet("amount") * (projectShareAuthorization.xGet("sharePercentage") / 100)).toFixed(2));
				var expenseApportion = Alloy.createModel("MoneyExpenseApportion", {
					moneyExpense : selectedExpense,
					friendUser : projectShareAuthorization.xGet("friendUser"),
					amount : amount,
					apportionType : "Fixed"
				});
				selectedExpense.xGet("moneyExpenseApportions").add(expenseApportion);
			}
		});
	} else if (e.source.id === "sharePercentage") {
		var amountTotal = 0, lastItem;
		selectedExpense.xGet("moneyExpenseApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				var amount = Number((selectedExpense.xGet("amount") * (item.getSharePercentage() / 100)).toFixed(2));
				console.info("+++++caoAmount+++"+ amount);
				item.xSet("amount", amount);
				item.xSet("apportionType", "Fixed");
				lastItem = item;
				amountTotal += amount;
			}
		});
		// 把分不尽的小数部分加到最后一个人身上
		if(amountTotal !== selectedExpense.xGet("amount") && lastItem){
			lastItem.xSet("amount", lastItem.xGet("amount") + (selectedExpense.xGet("amount") - amountTotal));
		}
	} else if (e.source.id === "average") {
		var apportions = [];
		selectedExpense.xGet("moneyExpenseApportions").forEach(function(item) {
				if (!item.__xDeletedHidden && !item.__xDeleted) {
					apportions.push(item);
				}
		});
		if(apportions.length > 0) {
			var amount = Number((selectedExpense.xGet("amount") / apportions.length).toFixed(2));
			console.info("+++++aveAmount+++"+ amount);
			var amountTotal = 0;
			apportions.forEach(function(item){
				item.xSet("amount", amount);
				item.xSet("apportionType", "Average");
				amountTotal += amount;
			});
			// 把分不尽的小数部分加到最后一个人身上
			if(amountTotal !== selectedExpense.xGet("amount")){
				apportions[apportions.length - 1].xSet("amount", amount + (selectedExpense.xGet("amount") - amountTotal));
			}
		}
	}
}

selectedExpense.generateExpenseApportions();
var collection = selectedExpense.xGet("moneyExpenseApportions").xCreateFilter(function(model) {
	return model.__xDeletedHidden !== true;
});
$.moneyExpenseApportionsTable.addCollection(collection);

$.moneyExpenseApportionsTable.autoHideFooter($.footerBar);
