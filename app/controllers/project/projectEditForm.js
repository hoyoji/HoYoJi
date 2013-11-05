Alloy.Globals.extendsBaseFormController($, arguments[0]);

// $.onWindowOpenDo(function() {
	// $.name.field.focus();
// });

$.parentProject = null;
// var oldParentProject = null;
// var parentProject = null;
// $.project = null;
// 
// parentProject = Alloy.createModel("ParentProject").xFindInDb({
	// subProjectId : $.$model.xGet("id")
// });
// if(parentProject.id){
	// $.project = parentProject.xGet("parentProject");
	// oldParentProject = $.project;
	// if($.project){
		// $.parentProject.setValue($.project.xGet("name"));
	// } else {
		// $.parentProject.setValue(null);
	// }
// }
// 
// // 从projectAll中选取project
// function openProjectSelector() {
	// // $.friendUser.field.blur();
	// var attributes = {
		// closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
		// selectorCallback : function(model) {
			// $.project = model;
			// if($.project){
				// $.parentProject.setValue($.project.xGet("name"));
			// } else {
				// $.parentProject.setValue(null);
			// }
		// }
	// };
	// attributes.title = "项目";
	// attributes.selectModelType = "Project";
	// attributes.selectModelCanBeNull = true;
	// attributes.selectedModel = $.project;
	// attributes.selectModelCanNotBeChild = true;
	// Alloy.Globals.openWindow("project/projectAll", attributes);
// }

$.onSave = function(saveEndCB, saveErrorCB) {
	// if (oldParentProject !== $.project) {
		// if (parentProject.id) {
			// parentProject.xSet("parentProject", $.project);
			// parentProject.xSave();
		// } else {
			// parentProject = Alloy.createModel("ParentProject", {
				// subProject : $.$model,
				// parentProject : $.project,
				// ownerUser : Alloy.Models.User
			// }).xSave();
		// }
	// }
	$.parentProjects.xAddToSave($);
	$.parentProjects.xAddToDelete($);
	$.saveCollection(saveEndCB, saveErrorCB);
	$.$model.xRefresh();
	// $.getCurrentWindow().$view.close();
};

function createParentProjectExchange(successCB, errorCB) {
	// if($.project && $.project.xGet("currency") !== $.$model.xGet("currency")) {
		// var parentProjectCurrency = $.project.xGet("currency");
		var parentProjectexchange = Alloy.createModel("Exchange").xFindInDb({
			localCurrencyId : $.$model.xGet("currency").xGet("id"),
			foreignCurrencyId : $.parentProject.xGet("currency").xGet("id")
		});
		if (!parentProjectexchange.id) {
			Alloy.Globals.Server.getExchangeRate($.$model.xGet("currency").xGet("id"), $.parentProject.xGet("currency").xGet("id"), function(rate) {
				exchange = Alloy.createModel("Exchange", {
					localCurrencyId : $.$model.xGet("currency").xGet("id"),
					foreignCurrencyId : $.parentProject.xGet("currency").xGet("id"),
					rate : rate
				});
				exchange.xSet("ownerUser", Alloy.Models.User);
				exchange.xSet("ownerUserId", Alloy.Models.User.id);
				exchange.save();
				successCB();
			}, function(e) {
				errorCB(e);
			});
		} else {
			successCB();
		}
	// } else {
		// successCB();
	// }
}

function createSubProjectExchange(successCB, errorCB) {
	var errorCount = 0, projectCurrencyIdsCount = 0, projectCurrencyIdsTotal = $.$model.xGetDescendents("subProjects").length, fetchingExchanges = {};
	if (projectCurrencyIdsTotal > 0) {
		$.$model.xGetDescendents("subProjects").forEach(function(subProject) {
			if (errorCount > 0) {
				return;
			}
			if (subProject.xGet("currency").xGet("id") === $.parentProject.xGet("currency").xGet("id")) {
				projectCurrencyIdsCount++;
				if (projectCurrencyIdsCount === projectCurrencyIdsTotal) {
					successCB();
				}
				return;
	
			}
			if (fetchingExchanges[subProject.xGet("currency").xGet("id")] !== true) {
				var exchange = Alloy.createModel("Exchange").xFindInDb({
					localCurrencyId : subProject.xGet("currency").xGet("id"),
					foreignCurrencyId : $.parentProject.xGet("currency").xGet("id")
				});
				if (!exchange.id) {
					fetchingExchanges[subProject.xGet("currency").xGet("id")] = true;
					Alloy.Globals.Server.getExchangeRate(subProject.xGet("currency").xGet("id"), $.parentProject.xGet("currency").xGet("id"), function(rate) {
						exchange = Alloy.createModel("Exchange", {
							localCurrencyId : subProject.xGet("currency").xGet("id"),
							foreignCurrencyId : $.parentProject.xGet("currency").xGet("id"),
							rate : rate
						});
						exchange.xSet("ownerUser", Alloy.Models.User);
						exchange.xSet("ownerUserId", Alloy.Models.User.id);
						exchange.save();
	
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
	} else {
		successCB();
	}
}

$.convertParentProject = function(model){
	return Alloy.createModel("ParentProject", {
			subProject : $.$model,
			parentProject : model,
			ownerUser : Alloy.Models.User
	});
};

$.checkDuplicateParentProject = function(model, confirmCB, errorCB){
	var ret = $.$model.xGet("parentProjectParentProjects").findWhere({parentProject : model }) === undefined;
	if(!ret){
		errorCB("该项目已经是上级项目");
	} else if(model === $.$model){
		errorCB("同一项目不能作为上级项目");
	} else if(model && model.xFindDescendents("parentProjects", $.$model) !== undefined){
		errorCB("该项目已经是上级项目");
	} else {
		if (model){
			$.parentProject = model;
			createParentProjectExchange(function() {
				createSubProjectExchange(function() {
					confirmCB();
				}, function(e) {
					errorCB("父项目添加失败,请重试");
					return;
				});
			}, function(e) {
				errorCB("父项目添加失败,请重试");
				return;
			});
		} else {
			confirmCB();
		}
	}
};

// $.parentProject.UIInit($, $.getCurrentWindow());
$.parentProjects.UIInit($, $.getCurrentWindow());
$.name.UIInit($, $.getCurrentWindow());
$.currency.UIInit($, $.getCurrentWindow());
// $.autoAddCategory.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
// $.autoApportion.UIInit($, $.getCurrentWindow());
