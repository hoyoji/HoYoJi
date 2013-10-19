Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "用户操作"
	});
	menuSection.add($.createContextMenuItem("导入图片", function() {
		$.picture.importPictureFromGallery();
	}));
	return menuSection;
};

function changePassword() {
	Alloy.Globals.openWindow("user/changePasswordForm", {
		$model : Alloy.Models.User
	});
}

$.changePassword.addEventListener("singletap", changePassword);

$.picture.UIInit($, $.getCurrentWindow());
$.changePassword.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
