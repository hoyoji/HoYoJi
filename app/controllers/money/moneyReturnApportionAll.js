Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyReturnApportionsTable.UIInit($, $.getCurrentWindow());

var selectedReturn = $.$attrs.selectedReturn;

$.onWindowOpenDo(function() {//不是自己的账务，分摊不可增删改
	if (selectedReturn.xGet("ownerUser") !== Alloy.Models.User) {
		$.footerBar.addReturnApportionMember.setEnabled(false);
		$.footerBar.addAllReturnApportionMember.setEnabled(false);
		$.footerBar.sharePercentage.setEnabled(false);
		$.footerBar.average.setEnabled(false);
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addReturnApportionMember") {
		var attributes = {
			selectedProject : selectedReturn.xGet("project"),
			closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
			selectorCallback : function(model) {
				$.projectShareAuthorization = model;
				var oldCollection = selectedReturn.xGet("moneyReturnApportions");
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
					var newMoneyReturnApportion = Alloy.createModel("MoneyReturnApportion", {
						moneyReturn : selectedReturn,
						friendUser : $.projectShareAuthorization.xGet("friendUser"),
						amount : 0,
						apportionType : "Average"
					});
					selectedReturn.xGet("moneyReturnApportions").add(newMoneyReturnApportion);
					// collection = selectedReturn.xGet("moneyReturnApportions");
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
	} else if (e.source.id === "addAllReturnApportionMember") {
		selectedReturn.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
			var existApportion = selectedReturn.xGet("moneyReturnApportions").xCreateFilter(function(model) {
				return model.xGet("friendUser") === projectShareAuthorization.xGet("friendUser") && !model.__xDeletedHidden && !model.__xDeleted;
			}, $);
			if (projectShareAuthorization.xGet("state") === "Accept" && existApportion.length === 0) {
				// var amount = Number((selectedReturn.xGet("amount") * (projectShareAuthorization.xGet("sharePercentage") / 100)).toFixed(2));
				var returnApportion = Alloy.createModel("MoneyReturnApportion", {
					moneyReturn : selectedReturn,
					friendUser : projectShareAuthorization.xGet("friendUser"),
					amount : 0,
					apportionType : "Average"
				});
				selectedReturn.xGet("moneyReturnApportions").add(returnApportion);
			}
		});
	} else if (e.source.id === "sharePercentage") {
		var amountTotal = 0;
		var apportions = [];
		selectedReturn.xGet("moneyReturnApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				apportions.push(item);
			}
		});
		if (apportions.length > 0) {
			for (var i = 0; i < apportions.length - 1; i++) {
				var amount = Number((selectedReturn.xGet("amount") * (apportions[i].getSharePercentage() / 100)).toFixed(2));
				apportions[i].xSet("amount", amount);
				apportions[i].xSet("apportionType", "Fixed");
				amountTotal += amount;
			}
			// 把分不尽的小数部分加到最后一个人身上
			apportions[apportions.length - 1].xSet("apportionType", "Fixed");
			apportions[apportions.length - 1].xSet("amount", (selectedReturn.xGet("amount") - amountTotal));
		}
	} else if (e.source.id === "average") {
		var apportions = [];
		selectedReturn.xGet("moneyReturnApportions").forEach(function(item) {
			if (!item.__xDeletedHidden && !item.__xDeleted) {
				apportions.push(item);
			}
		});
		if (apportions.length > 0) {
			var amount = Number((selectedReturn.xGet("amount") / apportions.length).toFixed(2));
			console.info("+++++aveAmount+++" + amount);
			var amountTotal = 0;
			for (var i = 0; i < apportions.length - 1; i++) {
				apportions[i].xSet("amount", amount);
				apportions[i].xSet("apportionType", "Average");
				amountTotal += amount;
			}
			// 把分不尽的小数部分加到最后一个人身上
			apportions[apportions.length - 1].xSet("apportionType", "Average");
			apportions[apportions.length - 1].xSet("amount", (selectedReturn.xGet("amount") - amountTotal));
		}
	}
}

selectedReturn.generateReturnApportions();
var collection = selectedReturn.xGet("moneyReturnApportions").xCreateFilter(function(model) {
	return model.__xDeletedHidden !== true;
});
$.moneyReturnApportionsTable.addCollection(collection);

$.moneyReturnApportionsTable.autoHideFooter($.footerBar);
$.titleBar.UIInit($, $.getCurrentWindow());
