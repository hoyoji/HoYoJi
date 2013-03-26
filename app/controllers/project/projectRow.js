Alloy.Globals.extendsBaseRowController($, arguments[0]);

// $.onRowTap = function(e){
	// alert("openForm");
	// return false;
// }

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "项目操作"
	});

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
	menuSection.add(
		$.createContextMenuItem("删除项目", 
			function() {
				$.deleteModel();
			}
			,isSelectMode));
	menuSection.add($.createContextMenuItem("共享属性", function() {
		Alloy.Globals.openWindow("project/projectShareAuthorizationAll", {
			selectedProject : $.$model
		});
	}));
	
	return menuSection;
}
