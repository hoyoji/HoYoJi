Alloy.Globals.extendsBaseViewController($, arguments[0]);

function onFooterbarTap(e) {
	if (e.source.id === "moneyAddNew") {
		Alloy.Globals.openWindow("money/moneyAddNew");
	}
}

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "设置操作"
	});
	menuSection.add($.createContextMenuItem("新增收入", function() {
		Alloy.Globals.openWindow("money/moneyIncomeForm");
	}));

	menuSection.add($.createContextMenuItem("新增支出", function() {
		Alloy.Globals.openWindow("money/moneyExpenseForm");
	}));
	
	menuSection.add($.createContextMenuItem("切换权限", function() {
		// Alloy.Globals.openWindow("user/userForm",{$model : Alloy.Models.User});
		if(Alloy.Models.User.xGet("friendAuthorization") === "required"){
			Alloy.Models.User.save({friendAuthorization : "none" }, {wait : true, patch : true});
			alert("权限切换为：none");
		}else{
			Alloy.Models.User.save({friendAuthorization : "required" }, {wait : true, patch : true});
			alert("权限切换为：required");
		}

	}));
	return menuSection;
}