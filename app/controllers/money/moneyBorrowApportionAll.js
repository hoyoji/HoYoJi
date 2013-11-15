Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyBorrowApportionsTable.UIInit($, $.getCurrentWindow());

var selectedBorrow = $.$attrs.selectedBorrow;

$.onWindowOpenDo(function() {//不是自己的账务，分摊不可增删改
	if (selectedBorrow.xGet("ownerUser") !== Alloy.Models.User) {
		$.footerBar.addBorrowApportionMember.setEnabled(false);
		$.footerBar.addAllBorrowApportionMember.setEnabled(false);
		$.footerBar.sharePercentage.setEnabled(false);
		$.footerBar.average.setEnabled(false);
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addBorrowApportionMember") {
		var attributes = {
			selectedProject : selectedBorrow.xGet("project"),
			closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
			selectorCallback : function(model) {
				$.projectShareAuthorization = model;
				var oldCollection = selectedBorrow.xGet("moneyBorrowApportions");
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
					var newMoneyBorrowApportion = Alloy.createModel("MoneyBorrowApportion", {
						moneyBorrow : selectedBorrow,
						friendUser : $.projectShareAuthorization.xGet("friendUser"),
						amount : 0,
						apportionType : "Average"
					});
					selectedBorrow.xGet("moneyBorrowApportions").add(newMoneyBorrowApportion);
					// collection = selectedBorrow.xGet("moneyBorrowApportions");
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
	} else if (e.source.id === "addAllBorrowApportionMember") {
		selectedBorrow.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
			var existApportion = selectedBorrow.xGet("moneyBorrowApportions").xCreateFilter(function(model) {
				return model.xGet("friendUser") === projectShareAuthorization.xGet("friendUser") && !model.__xDeletedHidden && !model.__xDeleted;
			}, $);
			if (projectShareAuthorization.xGet("state") === "Accept" && existApportion.length === 0) {
				// var amount = Number((selectedBorrow.xGet("amount") * (projectShareAuthorization.xGet("sharePercentage") / 100)).toFixed(2));
				var borrowApportion = Alloy.createModel("MoneyBorrowApportion", {
					moneyBorrow : selectedBorrow,
					friendUser : projectShareAuthorization.xGet("friendUser"),
					amount : 0,
					apportionType : "Average"
				});
				selectedBorrow.xGet("moneyBorrowApportions").add(borrowApportion);
			}
		});
	} else if (e.source.id === "sharePercentage") {
		var amountTotal = 0;
		var apportions = [];
		selectedBorrow.xGet("moneyBorrowApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				apportions.push(item);
			}
		});
		if (apportions.length > 0) {
			for (var i = 0; i < apportions.length - 1; i++) {
				var amount = Number((selectedBorrow.xGet("amount") * (apportions[i].getSharePercentage() / 100)).toFixed(2));
				apportions[i].xSet("amount", amount);
				apportions[i].xSet("apportionType", "Fixed");
				amountTotal += amount;
			}
			// 把分不尽的小数部分加到最后一个人身上
			apportions[apportions.length - 1].xSet("apportionType", "Fixed");
			apportions[apportions.length - 1].xSet("amount", (selectedBorrow.xGet("amount") - amountTotal));
		}
	} else if (e.source.id === "average") {
		var apportions = [];
		selectedBorrow.xGet("moneyBorrowApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				apportions.push(item);
			}
		});
		if (apportions.length > 0) {
			var amount = Number((selectedBorrow.xGet("amount") / apportions.length).toFixed(2));
			console.info("+++++aveAmount+++" + amount);
			var amountTotal = 0;
			for (var i = 0; i < apportions.length - 1; i++) {
				apportions[i].xSet("amount", amount);
				apportions[i].xSet("apportionType", "Average");
				amountTotal += amount;
			}
			// 把分不尽的小数部分加到最后一个人身上
			apportions[apportions.length - 1].xSet("apportionType", "Average");
			apportions[apportions.length - 1].xSet("amount", (selectedBorrow.xGet("amount") - amountTotal));
		}
	}
}

selectedBorrow.generateBorrowApportions();
var collection = selectedBorrow.xGet("moneyBorrowApportions").xCreateFilter(function(model) {
	return model.__xDeletedHidden !== true;
});
$.moneyBorrowApportionsTable.addCollection(collection);

$.moneyBorrowApportionsTable.autoHideFooter($.footerBar);
$.titleBar.UIInit($, $.getCurrentWindow());
