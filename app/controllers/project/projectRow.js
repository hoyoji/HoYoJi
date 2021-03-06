Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e) {
	// if($.$model.xGet("ownerUserId") === Alloy.Models.User.id){
	// Alloy.Globals.openWindow("project/projectForm", {$model : $.$model});
	// return false;
	// }else{
	// Alloy.Globals.openWindow("project/projectSharedWithMeAuthorizationForm", {$model : $.$model.xGet("projectShareAuthorizations").at(0), saveableMode : "read"});
	// return false;
	// }

	// Alloy.Globals.openWindow("project/projectShareAuthorizationAll", {
	// selectedProject : $.$model
	// });

	Alloy.Globals.openWindow("money/moneyAll", {
		queryFilter : {
			project : $.$model
		}
	});
	return false;
};

$.setSelected = function(selected) {
	if (selected) {
		$.projectName.$view.setColor("blue");
	}
};

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "项目操作"
	});
	var projectIsSharedToMe = true;
	if ($.$model.xGet("ownerUserId") === Alloy.Models.User.id) {
		projectIsSharedToMe = false;
	}

	menuSection.add($.createContextMenuItem("支出分类", function() {
		Alloy.Globals.openWindow("money/moneyExpenseCategoryAll", {
			selectedProject : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("收入分类", function() {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryAll", {
			selectedProject : $.$model
		});
	}));
	// menuSection.add($.createContextMenuItem("常用支出分类", function() {
		// Alloy.Globals.openWindow("money/moneyExpenseCategoryRecent", {
			// selectedProject : $.$model
		// });
	// }));
	// menuSection.add($.createContextMenuItem("常用收入分类", function() {
		// Alloy.Globals.openWindow("money/moneyIncomeCategoryRecent", {
			// selectedProject : $.$model
		// });
	// }));
	if ($.$model.xGet("ownerUserId") === Alloy.Models.User.id) {
		menuSection.add($.createContextMenuItem("项目资料", function() {
			Alloy.Globals.openWindow("project/projectForm", {
				$model : $.$model
			});
		}));
	} else {
		menuSection.add($.createContextMenuItem("项目资料", function() {
			Alloy.Globals.openWindow("project/projectEditForm", {
				$model : $.$model,
			});
		}));
	}

	menuSection.add($.createContextMenuItem("删除项目", function() {
		$.deleteModel();
	}, isSelectMode || projectIsSharedToMe));

	// menuSection.add($.createContextMenuItem("备注名称", function() {
		// var projectRemark = Alloy.createModel("ProjectRemark").xFindInDb({
			// projectId : $.$model.xGet("id")
		// });
		// if (projectRemark && projectRemark.id) {
			// Alloy.Globals.openWindow("project/projectRemarkForm", {
				// $model : projectRemark
			// });
		// } else {
			// Alloy.Globals.openWindow("project/projectRemarkForm", {
				// $model : "ProjectRemark",
				// data : {
					// project : $.$model,
					// ownerUser : Alloy.Models.User
				// }
			// });
		// }
	// }));

	menuSection.add($.createContextMenuItem("项目成员", function() {
		Alloy.Globals.openWindow("project/projectShareAuthorizationAll", {
			selectedProject : $.$model
		});
	}));

	return menuSection;
};

if ($.$model.xGet("ownerUserId") === Alloy.Models.User.id) {
	$.projectImage.setImage("/images/project/projectAll/myProjectsTableGreen@2x.png");
} else {
	$.projectImage.setImage("/images/project/projectAll/sharedWithMeTableGreen@2x.png");
}

$.onWindowOpenDo(function() {
	//setActualTotalMoneyColor();
	// $.$model.xGet("projectShareAuthorizations").on("sync", setActualTotalMoneyColor);
	// //$.$model.xGetDescendents("subProjects").on("sync", setActualTotalMoneyColor);
	// $.$model.xGet("subProjects").on("add", addNewSubProject);
	// $.$model.xGet("subProjects").on("remove", removeSubProject);
	// $.$model.xGetDescendents("subProjects").forEach(function(subProject) {
		// subProject.xGet("projectShareAuthorizations").on("sync", setActualTotalMoneyColor);
		// subProject.xGet("subProjects").on("add", addNewSubProject);
		// subProject.xGet("subProjects").on("remove", removeSubProject);
	// });
	addNewSubProject($.$model);
	$.$model.on("xrefresh", setProjectRemark);
});

$.onWindowCloseDo(function() {
	$.$model.xGet("projectShareAuthorizations").off("sync", setActualTotalMoneyColor);
	//$.$model.xGetDescendents("subProjects").off("sync", setActualTotalMoneyColor);
	$.$model.xGet("subProjects").off("add", addNewSubProject);
	$.$model.xGet("subProjects").off("remove", removeSubProject);
	$.$model.xGetDescendents("subProjects").forEach(function(subProject) {
		subProject.xGet("projectShareAuthorizations").off("sync", setActualTotalMoneyColor);
		subProject.xGet("subProjects").off("add", addNewSubProject);
		subProject.xGet("subProjects").off("remove", removeSubProject);
		subProject.xGet("parentProjects").off("add", addNewSubProject);
		subProject.xGet("parentProjects").off("remove", removeSubProject);
	});
	$.$model.off("xrefresh", setProjectRemark);
});

function addNewSubProject(project){
	project.xGet("projectShareAuthorizations").on("sync", setActualTotalMoneyColor);
	project.xGet("subProjects").on("add", addNewSubProject);
	project.xGet("subProjects").on("remove", removeSubProject);
	project.xGetDescendents("subProjects").forEach(function(subProject) {
		subProject.xGet("projectShareAuthorizations").on("sync", setActualTotalMoneyColor);
		subProject.xGet("subProjects").on("add", addNewSubProject);
		subProject.xGet("subProjects").on("remove", removeSubProject);
		subProject.xGet("parentProjects").off("add", addNewSubProject);
		subProject.xGet("parentProjects").off("remove", removeSubProject);
	});
	setActualTotalMoneyColor();
}
function removeSubProject(project){
	project.xGet("projectShareAuthorizations").off("sync", setActualTotalMoneyColor);
	project.xGet("subProjects").off("add", addNewSubProject);
	project.xGet("subProjects").off("remove", removeSubProject);
	project.xGetDescendents("subProjects").forEach(function(subProject) {
		subProject.xGet("projectShareAuthorizations").off("sync", setActualTotalMoneyColor);
		subProject.xGet("subProjects").off("add", addNewSubProject);
		subProject.xGet("subProjects").off("remove", removeSubProject);
		subProject.xGet("parentProjects").off("add", addNewSubProject);
		subProject.xGet("parentProjects").off("remove", removeSubProject);
	});
	setActualTotalMoneyColor();
}
function setActualTotalMoneyColor() {
	$.actualTotalMoney.refresh();
	if ($.$model.getActualTotalMoneyType(true)) {
		$.actualTotalMoney.label.setColor("#329600");
	} else {
		$.actualTotalMoney.label.setColor("#c80032");
	}
	// if ($.$model.xGet("parentProject")) {
		// $.$model.xGet("parentProject").xRefresh();
	// }
}

function setProjectRemark() {
	$.projectName.refresh();
}

$.ownerUserName.UIInit($, $.getCurrentWindow());
$.projectName.UIInit($, $.getCurrentWindow());
$.actualTotalMoney.UIInit($, $.getCurrentWindow());
