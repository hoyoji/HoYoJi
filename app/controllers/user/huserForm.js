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

function onFooterbarTap(e) {
	if(e.source.id === "commit"){
		updateUser();
	}
}

function updateUser() {
	$.picture.autoSave();
	Alloy.Models.User._xSave();
}

function changePassword() {
	Alloy.Globals.openWindow("user/changePassword", {
		currentUser : Alloy.Models.User
	});
}

$.changePassword.addEventListener("singletap", changePassword);

$.picture.UIInit($, $.getCurrentWindow());
$.userName.UIInit($, $.getCurrentWindow());
$.changePassword.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
