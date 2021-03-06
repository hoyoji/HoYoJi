Alloy.Globals.extendsBaseFormController($, arguments[0]);

var onFooterbarTap = function(e) {
	if (e.source.id === "agree") {
		operation = "agree";
		$.titleBar.save();
	} else if (e.source.id === "reject") {
		operation = "reject";
		$.titleBar.save();
	} else if (e.source.id === "ignore") {
		$.getCurrentWindow().close();
	}
};

var operation = "";
var firstClickShowAuthorization = true;
var projectShareData = JSON.parse($.$model.xGet("messageData"));
var projectShareAuthorization = null;

$.allAuthorization.addEventListener("click", function(e) {
	if ($.showHideAuthorization.getVisible()) {
		$.showHideAuthorization.hide();
		e.source.setTitle("打开详细权限");
	} else {
		loadAuthorizationDetails(function() {
			$.showHideAuthorization.show();
			e.source.setTitle("关闭详细权限");
		});
	}
});

function loadAuthorizationDetails(successCB) {
	var _projectShareAuthorization;
	if (!projectShareAuthorization) {
		if (firstClickShowAuthorization) {
			firstClickShowAuthorization = false;
			_projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
				id : projectShareData.projectShareAuthorizationId
			});
			if (!_projectShareAuthorization.id) {
				var projectShareIds = _.union([projectShareData.projectShareAuthorizationId], projectShareData.subProjectShareAuthorizationIds);
				Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareIds, function(collection) {
					if (collection.length > 0) {
						projectShareAuthorization = collection.at(0);
						createProjectShareAuthorizationDetails(projectShareAuthorization);
						successCB();
					}
				});
			} else {
				createProjectShareAuthorizationDetails(_projectShareAuthorization);
				successCB();
			}
		} else {
			successCB();

		}
	} else {
		successCB();
	}
}

function createProjectShareAuthorizationDetails(projectShareAuthorization) {
	//创建支出权限
	var authorizationDetailRow1 = Titanium.UI.createView({
		layout : "horizontal",
		horizontalWrap : false,
		height : "42"
	});
	var projectShareMoneyExpenseAuthorizationLabel = Ti.UI.createLabel({
		text : "支出",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyExpenseOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyExpenseAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyExpenseEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyExpenseDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow1.add(projectShareMoneyExpenseAuthorizationLabel);
	authorizationDetailRow1.add(projectShareMoneyExpenseOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow1.add(projectShareMoneyExpenseAddNewAuthorizationLabel);
	authorizationDetailRow1.add(projectShareMoneyExpenseEditAuthorizationLabel);
	authorizationDetailRow1.add(projectShareMoneyExpenseDeleteAuthorizationLabel);

	//创建收入权限
	var authorizationDetailRow2 = Titanium.UI.createView({
		layout : "horizontal",
		height : "42"
	});
	var projectShareMoneyIncomeAuthorizationLabel = Ti.UI.createLabel({
		text : "收入",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyIncomeOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyIncomeAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyIncomeEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyIncomeDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow2.add(projectShareMoneyIncomeAuthorizationLabel);
	authorizationDetailRow2.add(projectShareMoneyIncomeOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow2.add(projectShareMoneyIncomeAddNewAuthorizationLabel);
	authorizationDetailRow2.add(projectShareMoneyIncomeEditAuthorizationLabel);
	authorizationDetailRow2.add(projectShareMoneyIncomeDeleteAuthorizationLabel);

	//创建借入权限
	var authorizationDetailRow4 = Titanium.UI.createView({
		layout : "horizontal",
		height : "42"
	});
	var projectShareMoneyBorrowAuthorizationLabel = Ti.UI.createLabel({
		text : "借入",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyBorrowOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyBorrowOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyBorrowAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyBorrowAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyBorrowEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyBorrowEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyBorrowDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyBorrowDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow4.add(projectShareMoneyBorrowAuthorizationLabel);
	authorizationDetailRow4.add(projectShareMoneyBorrowOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow4.add(projectShareMoneyBorrowAddNewAuthorizationLabel);
	authorizationDetailRow4.add(projectShareMoneyBorrowEditAuthorizationLabel);
	authorizationDetailRow4.add(projectShareMoneyBorrowDeleteAuthorizationLabel);

	//创建借出权限
	var authorizationDetailRow5 = Titanium.UI.createView({
		layout : "horizontal",
		horizontalWrap : false,
		height : "42"
	});
	var projectShareMoneyLendAuthorizationLabel = Ti.UI.createLabel({
		text : "借出",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyLendOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyLendOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyLendAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyLendAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyLendEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyLendEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyLendDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyLendDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow5.add(projectShareMoneyLendAuthorizationLabel);
	authorizationDetailRow5.add(projectShareMoneyLendOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow5.add(projectShareMoneyLendAddNewAuthorizationLabel);
	authorizationDetailRow5.add(projectShareMoneyLendEditAuthorizationLabel);
	authorizationDetailRow5.add(projectShareMoneyLendDeleteAuthorizationLabel);

	//创建还款权限
	var authorizationDetailRow6 = Titanium.UI.createView({
		layout : "horizontal",
		height : "42"
	});
	var projectShareMoneyReturnAuthorizationLabel = Ti.UI.createLabel({
		text : "还款",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyReturnOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyReturnOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyReturnAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyReturnAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyReturnEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyReturnEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyReturnDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyReturnDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow6.add(projectShareMoneyReturnAuthorizationLabel);
	authorizationDetailRow6.add(projectShareMoneyReturnOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow6.add(projectShareMoneyReturnAddNewAuthorizationLabel);
	authorizationDetailRow6.add(projectShareMoneyReturnEditAuthorizationLabel);
	authorizationDetailRow6.add(projectShareMoneyReturnDeleteAuthorizationLabel);

	//创建收款权限
	var authorizationDetailRow7 = Titanium.UI.createView({
		layout : "horizontal",
		horizontalWrap : false,
		height : "42"
	});
	var projectShareMoneyPaybackAuthorizationLabel = Ti.UI.createLabel({
		text : "收款",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyPaybackOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyPaybackOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyPaybackAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyPaybackAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyPaybackEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyPaybackEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyPaybackDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyPaybackDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow7.add(projectShareMoneyPaybackAuthorizationLabel);
	authorizationDetailRow7.add(projectShareMoneyPaybackOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow7.add(projectShareMoneyPaybackAddNewAuthorizationLabel);
	authorizationDetailRow7.add(projectShareMoneyPaybackEditAuthorizationLabel);
	authorizationDetailRow7.add(projectShareMoneyPaybackDeleteAuthorizationLabel);

	//创建支出分类权限
	var authorizationDetailRow8 = Titanium.UI.createView({
		layout : "horizontal",
		horizontalWrap : false,
		height : "42"
	});
	var projectShareMoneyExpenseCategoryAuthorizationLabel = Ti.UI.createLabel({
		text : "支出分类",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "30%"
	});
	var projectShareMoneyExpenseCategoryOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseCategoryOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "10%"
	});
	var projectShareMoneyExpenseCategoryAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseCategoryAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyExpenseCategoryEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseCategoryEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyExpenseCategoryDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyExpenseCategoryDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow8.add(projectShareMoneyExpenseCategoryAuthorizationLabel);
	authorizationDetailRow8.add(projectShareMoneyExpenseCategoryOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow8.add(projectShareMoneyExpenseCategoryAddNewAuthorizationLabel);
	authorizationDetailRow8.add(projectShareMoneyExpenseCategoryEditAuthorizationLabel);
	authorizationDetailRow8.add(projectShareMoneyExpenseCategoryDeleteAuthorizationLabel);

	//创建收入分类权限
	var authorizationDetailRow9 = Titanium.UI.createView({
		layout : "horizontal",
		height : "42"
	});
	var projectShareMoneyIncomeCategoryAuthorizationLabel = Ti.UI.createLabel({
		text : "收入分类",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "30%"
	});
	var projectShareMoneyIncomeCategoryOwnerDataOnlyAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeCategoryOwnerDataOnly") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "10%"
	});
	var projectShareMoneyIncomeCategoryAddNewAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeCategoryAddNew") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyIncomeCategoryEditAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeCategoryEdit") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	var projectShareMoneyIncomeCategoryDeleteAuthorizationLabel = Ti.UI.createLabel({
		text : projectShareAuthorization.xGet("projectShareMoneyIncomeCategoryDelete") ? "√" : "",
		height : 42,
		color : "black",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "20%"
	});
	authorizationDetailRow9.add(projectShareMoneyIncomeCategoryAuthorizationLabel);
	authorizationDetailRow9.add(projectShareMoneyIncomeCategoryOwnerDataOnlyAuthorizationLabel);
	authorizationDetailRow9.add(projectShareMoneyIncomeCategoryAddNewAuthorizationLabel);
	authorizationDetailRow9.add(projectShareMoneyIncomeCategoryEditAuthorizationLabel);
	authorizationDetailRow9.add(projectShareMoneyIncomeCategoryDeleteAuthorizationLabel);
	
	$.projectShareAuthorizationDetails.add(authorizationDetailRow1);
	$.projectShareAuthorizationDetails.add(authorizationDetailRow2);
	// $.projectShareAuthorizationDetails.add(authorizationDetailRow3);
	$.projectShareAuthorizationDetails.add(authorizationDetailRow4);
	$.projectShareAuthorizationDetails.add(authorizationDetailRow5);
	$.projectShareAuthorizationDetails.add(authorizationDetailRow6);
	$.projectShareAuthorizationDetails.add(authorizationDetailRow7);
	$.projectShareAuthorizationDetails.add(authorizationDetailRow8);
	$.projectShareAuthorizationDetails.add(authorizationDetailRow9);
}

$.onWindowOpenDo(function() {
	if ($.$model.xGet('messageState') !== "closed") {
		Alloy.Globals.Server.getData([{
			__dataType : "Message",
			id : $.$model.xGet("id"),
			messageState : "closed"
		}], function(msgdata) {
			if (msgdata[0].length > 0) {
				$.$model.save({
					messageState : "closed"
				}, {
					wait : true,
					patch : true
				});
			}
		}, function(e) {
			alert(e.__summary.msg);
		});
	}
	// $.showHideAuthorization.hide();
	//如果消息状态是new即把set为read,且显示出footerBar
	if ($.$model.xGet('messageState') === "new") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
		$.body.setBottom(50);
		$.footerBar.$view.show();
	} else if ($.$model.xGet('messageState') === "read") {
		$.body.setBottom(50);
		$.footerBar.$view.show();
	} else if ($.$model.xGet('messageState') === "unread") {
		$.$model.save({
			messageState : "closed"
		}, {
			wait : true,
			patch : true
		});
	}
	$.showHideAuthorization.hide();
});

$.onWindowCloseDo(function() {
	if ($.$model.xGet('messageState') === "new") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
	}
	projectShareAuthorization = null;
});

$.onSave = function(saveEndCB, saveErrorCB) {
	//服务器上查找当前消息，如果已经是closed，则提示消息过期
	Alloy.Globals.Server.getData([{
		__dataType : "Message",
		id : $.$model.xGet("id"),
		messageState : "closed"
	}], function(msgdata) {
		if (msgdata[0].length > 0) {
			saveErrorCB("操作失败，消息已过期");
		} else {
			var date = (new Date()).toISOString();

			Alloy.Globals.Server.getData([{
				__dataType : "User",
				id : $.$model.xGet("fromUserId")
			}], function(data) {
				var userData = data[0][0];
				var id = userData.id;
				var fromUser = Alloy.createModel("User").xFindInDb({
					id : id
				});
				if (!fromUser.id) {
					delete userData.id;
					fromUser = Alloy.createModel("User", userData);
					fromUser.attributes.id = id;
					fromUser.save(userData);
				}
				var addCurrencyExchangeArray = [];
				var editProjectShareAuthorizationArray = [];

				var detailArray = $.$model.xGet("detail").split(":");
				var projectName = detailArray[1];

				if (operation === "agree") {
					var activityWindow = Alloy.createController("activityMask");
					activityWindow.open("正在接受...");

					var projectCurrencyIds = projectShareData.projectCurrencyIds;

					function getAllCurrencies(successCB, errorCB) {
						var errorCount = 0, projectCurrencyIdsCount = 0, projectCurrencyIdsTotal = projectCurrencyIds.length;
						projectCurrencyIds.forEach(function(currencyId) {
							if (errorCount > 0) {
								return;
							}
							if (currencyId === Alloy.Models.User.xGet("userData").xGet("activeCurrencyId")) {
								projectCurrencyIdsCount++;
								if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
									successCB();
								}
								return;

							}
							var currency = Alloy.createModel("Currency").xFindInDb({
								id : currencyId
							});
							if (!currency.id) {
								Alloy.Globals.Server.getData([{
									__dataType : "CurrencyAll",
									id : currencyId
								}], function(data) {
									var currencyData = data[0][0];
									var id = currencyData.id;
									delete currencyData.id;
									try {
										currencyData.symbol = Ti.Locale.getCurrencySymbol(currencyData.code);
									} catch (e) {
										currencyData.symbol = currencyData.code;
									}
									currency = Alloy.createModel("Currency", currencyData);
									currency.attributes["id"] = id;

									currency.xSet("ownerUser", Alloy.Models.User);
									currency.xSet("ownerUserId", Alloy.Models.User.id);
									currency.save();

									//把币种传入服务器
									addCurrencyExchangeArray.push(currency.toJSON());

									projectCurrencyIdsCount++;
									if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
										successCB();
									}
								}, function(e) {
									errorCount++;
									errorCB(e);
								});
							} else {
								projectCurrencyIdsCount++;
								if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
									successCB();
								}
							}
						});
					}

					function getAllExchanges(successCB, errorCB) {
						var errorCount = 0, projectCurrencyIdsCount = 0, projectCurrencyIdsTotal = projectCurrencyIds.length, fetchingExchanges = {};
						projectCurrencyIds.forEach(function(currencyId) {
							if (errorCount > 0) {
								return;
							}
							if (currencyId === Alloy.Models.User.xGet("userData").xGet("activeCurrencyId")) {
								projectCurrencyIdsCount++;
								if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
									successCB();
								}
								return;

							}
							if (fetchingExchanges[currencyId] !== true) {
								var exchange = Alloy.createModel("Exchange").xFindInDb({
									localCurrencyId : Alloy.Models.User.xGet("userData").xGet("activeCurrencyId"),
									foreignCurrencyId : currencyId
								});
								if (!exchange.id) {
									fetchingExchanges[currencyId] = true;
									Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("userData").xGet("activeCurrencyId"), currencyId, function(rate) {
										exchange = Alloy.createModel("Exchange", {
											localCurrencyId : Alloy.Models.User.xGet("userData").xGet("activeCurrencyId"),
											foreignCurrencyId : currencyId,
											rate : rate
										});
										exchange.xSet("ownerUser", Alloy.Models.User);
										exchange.xSet("ownerUserId", Alloy.Models.User.id);
										exchange.save();

										//把汇率传入服务器
										addCurrencyExchangeArray.push(exchange.toJSON());

										projectCurrencyIdsCount++;
										if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
											successCB();
										}
									}, function(e) {
										errorCount++;
										errorCB(e);
									});

								} else {
									projectCurrencyIdsCount++;
									if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
										successCB();
									}
								}
							} else {
								projectCurrencyIdsCount++;
								if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
									successCB();
								}
							}
						});
					}

					getAllCurrencies(function() {
						getAllExchanges(acceptSharedProjects, function(e) {
							activityWindow.close();
							saveErrorCB("接受共享项目失败,请重新发送 : " + e.__summary.msg);
							return;
						});
					}, function(e) {
						activityWindow.close();
						saveErrorCB("接受共享项目失败,请重新发送 : " + e.__summary.msg);
						return;
					});

					function acceptSharedProjects() {
						var projectIds = [];
						var projectShareIds = _.union([projectShareData.projectShareAuthorizationId], projectShareData.subProjectShareAuthorizationIds);
						//从服务器上load全部共享的projectShareAuthorization
						Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareIds, function(collection) {
							if (collection.length > 0) {
								var projectShareAuthorization = collection.get(projectShareData.projectShareAuthorizationId);
								if (projectShareAuthorization.xGet("state") === "Wait") {
									projectShareAuthorization.xSet("state", "Accept");
									projectShareAuthorization.xAddToSave($);
									editProjectShareAuthorizationArray.push(projectShareAuthorization.toJSON());
									var projectLength = Alloy.createCollection("Project").xSearchInDb({
										id : projectShareAuthorization.xGet("projectId")
									}).length;
									if (projectLength === 0) {
										projectIds.push(projectShareAuthorization.xGet("projectId"));
									}
								}
								//把全部子项目的projectShareAuthorization的state设置为Accept。
								projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId) {
									var subProjectShareAuthorization = collection.get(subProjectShareAuthorizationId);
									if (subProjectShareAuthorization.xGet("state") === "Wait") {
										subProjectShareAuthorization.xSet("state", "Accept");
										subProjectShareAuthorization.xAddToSave($);
										editProjectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
										var subProjectLength = Alloy.createCollection("Project").xSearchInDb({
											id : subProjectShareAuthorization.xGet("projectId")
										}).length;
										if (subProjectLength === 0) {
											projectIds.push(subProjectShareAuthorization.xGet("projectId"));
										}
									}
								});
								$.$model.xSet("messageState", "closed");
								editProjectShareAuthorizationArray.push($.$model.toJSON());
								Alloy.Globals.Server.postData(addCurrencyExchangeArray, function(data) {
									Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
										Alloy.Globals.Server.sendMsg({
											id : guid(),
											"toUserId" : $.$model.xGet("fromUserId"),
											"fromUserId" : $.$model.xGet("toUserId"),
											"type" : "Project.Share.Accept",
											"messageState" : "new",
											"messageTitle" : "共享回复",
											"date" : date,
											"detail" : "用户" + $.$model.xGet("toUser").getUserDisplayName() + "接受了您共享的项目:" + projectName,
											"messageBoxId" : fromUser.xGet("messageBoxId"),
											"messageData" : $.$model.xGet("messageData")
										}, function() {
											$.saveModel(function(e) {
												//把与项目相关的资料全部下载下来
												Alloy.Globals.Server.loadSharedProjects(projectIds, function(collection) {
													// var parentProject = Alloy.createModel("ParentProject", {
														// subProject : projectShareAuthorization.xGet("project"),
														// parentProject : projectShareAuthorization.xGet("project").xGet("parentProject"),
														// ownerUser : Alloy.Models.User
													// }).xSave();
													projectIds.forEach(function(projectId){
														var project = Alloy.createModel("Project").xFindInDb({
															id : projectId
														});
														if(project.id) {
															var subParentProject = Alloy.createModel("ParentProject", {
																subProject : project,
																parentProject : null,
																ownerUser : Alloy.Models.User
															}).xSave();
															project.xRefresh();
														}
													});
													activityWindow.close();
													saveEndCB("接受成功");
													return;
												}, saveErrorCB);
											}, function(e) {
												activityWindow.close();
												saveErrorCB(e);
											}, {
												syncFromServer : true
											});
										}, function(e) {
											activityWindow.close();
											saveErrorCB("接受共享项目失败,请重新发送 : " + e.__summary.msg);
											return;
										});
									}, function(e) {
										activityWindow.close();
										saveErrorCB();
										alert(e.__summary.msg);
									});

								}, function(e) {
									activityWindow.close();
									alert(e.__summary.msg);
								});
							} else {
								activityWindow.close();
								saveErrorCB("接受共享项目失败，用户取消了该项目的分享");
								return;
							}
						}, saveErrorCB);

					}

				} else if (operation === "reject") {
					var projectShareIds = _.union([projectShareData.projectShareAuthorizationId], projectShareData.subProjectShareAuthorizationIds);
					//从服务器上load全部共享的projectShareAuthorization
					Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareIds, function(collection) {
						if (collection.length > 0) {
							var projectShareAuthorization = collection.get(projectShareData.projectShareAuthorizationId);
							if (projectShareAuthorization.xGet("state") === "Wait") {
								projectShareAuthorization.save({
									state : "Reject"
								}, {
									wait : true,
									patch : false
								});
								editProjectShareAuthorizationArray.push(projectShareAuthorization.toJSON());
							}
							if (projectShareData.shareAllSubProjects) {
								//把全部子项目的projectShareAuthorization的state设置为Reject。
								projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId) {
									var subProjectShareAuthorization = collection.get(subProjectShareAuthorizationId);
									if (subProjectShareAuthorization.xGet("state") === "Wait") {
										subProjectShareAuthorization.save({
											state : "Reject"
										}, {
											wait : true,
											patch : true
										});
										editProjectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
									}
								});
							}
							$.$model.save({
								messageState : "closed"
							}, {
								wait : true,
								patch : true
							});
							editProjectShareAuthorizationArray.push($.$model.toJSON());
							//去服务器上修改数据
							Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
								Alloy.Globals.Server.sendMsg({
									id : guid(),
									"toUserId" : $.$model.xGet("fromUserId"),
									"fromUserId" : $.$model.xGet("toUserId"),
									"type" : "Project.Share.Reject",
									"messageState" : "unread",
									"messageTitle" : "共享回复",
									"date" : date,
									"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "拒绝了您共享的项目:" + projectName,
									"messageBoxId" : fromUser.xGet("messageBoxId"),
									"messageData" : $.$model.xGet("messageData")
								}, function() {
									saveEndCB("您拒绝了" + fromUser.getUserDisplayName() + "共享的项目");
									return;
								}, function(e) {
									saveErrorCB("拒绝共享项目失败,请重新发送 : " + e.__summary.msg);
									return;
								});

							}, function(e) {
								alert(e.__summary.msg);
							});
						} else {
							saveErrorCB("拒绝共享项目失败，用户取消了该项目的分享");
							return;
						}
					}, saveErrorCB);
				}
			}, function(e) {
				alert(e.__summary.msg);
			});
		}
	}, function(e) {
		alert(e.__summary.msg);
	});
};

$.date.UIInit($, $.getCurrentWindow());
$.fromUser.UIInit($, $.getCurrentWindow());
$.msgDetail.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
