Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "用户操作"
	});
	menuSection.add($.createContextMenuItem("导入用户图片", function() {
		$.picture.importPictureFromGallery();
	}));
	return menuSection;
};

function changePassword() {
	Alloy.Globals.openWindow("user/changePasswordForm", {
		currentUser : Alloy.Models.User
	});
}

$.email.rightButton.addEventListener("singletap", function(){
	alert("很抱歉，验证功能尚未完成！");
});
$.changePassword.addEventListener("singletap", changePassword);

$.picture.UIInit($, $.getCurrentWindow());
$.nickName.UIInit($, $.getCurrentWindow());
$.userName.UIInit($, $.getCurrentWindow());
$.email.UIInit($, $.getCurrentWindow());
$.changePassword.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());

