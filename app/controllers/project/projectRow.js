Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
// if($.$model.xGet("ownerUserId") === Alloy.Models.User.id){
// Alloy.Globals.openWindow("project/projectForm", {$model : $.$model});
// return false;
// }else{
// Alloy.Globals.openWindow("project/projectSharedWithMeAuthorizationForm", {$model : $.$model.xGet("projectShareAuthorizations").at(0), saveableMode : "read"});
// return false;
// }
Alloy.Globals.openWindow("project/projectShareAuthorizationAll", {
	selectedProject : $.$model
});
return false;
}

$.setSelected = function(selected){
	if(selected){
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
	// if ($.$model.xGet("ownerUserId") === Alloy.Models.User.id) {
		menuSection.add($.createContextMenuItem("修改项目", function() {
			Alloy.Globals.openWindow("project/projectForm", {
				$model : $.$model
			});
		},$.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	// } else {
		// menuSection.add($.createContextMenuItem("共享权限", function() {
			// Alloy.Globals.openWindow("project/projectSharedWithMeAuthorizationForm", {
				// $model : $.$model.xGet("projectShareAuthorizations").at(0),
				// saveableMode : "read"
			// });
		// }));
	// }

	menuSection.add($.createContextMenuItem("删除项目", function() {
		$.deleteModel();
	}, isSelectMode || projectIsSharedToMe));
	
	menuSection.add($.createContextMenuItem("项目成员", function() {
	Alloy.Globals.openWindow("project/projectShareAuthorizationAll", {
	selectedProject : $.$model
	});
	}));

	return menuSection;
};

if($.$model.xGet("ownerUserId") === Alloy.Models.User.id){
	$.projectImage.setImage("/images/project/projectAll/myProjectsTable@2x.png");
}else{
	$.projectImage.setImage("/images/project/projectAll/sharedWithMeTable@2x.png");
}

$.onWindowOpenDo(function() {
	setActualTotalMoneyColor();
	$.$model.xGet("projectShareAuthorizations").on("sync",setActualTotalMoneyColor);
});

$.onWindowCloseDo(function() {
	$.$model.xGet("projectShareAuthorizations").off("sync",setActualTotalMoneyColor);
});

function setActualTotalMoneyColor(){
	$.actualTotalMoney.refresh();
	if($.$model.getActualTotalMoneyType(true)){
		$.actualTotalMoney.label.setColor("#329600");
	}else{
		$.actualTotalMoney.label.setColor("#c80032");
	}
}

$.projectName.UIInit($, $.getCurrentWindow());
$.actualTotalMoney.UIInit($, $.getCurrentWindow());
