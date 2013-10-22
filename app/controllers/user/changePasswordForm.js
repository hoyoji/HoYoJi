Alloy.Globals.extendsBaseViewController($, arguments[0]);

function onFooterbarTap(e) {
	if (e.source.id === "commit") {
		updatePassword();
	}
};

function updatePassword() {
	var passwordValidation = /^.{6,18}$/;
	var oldPassword = $.oldPassword.field.getValue() || "";
	if (!passwordValidation.test(oldPassword)) {
		$.oldPassword.showErrorMsg("密码长度不对");
		return;
	}
	var newPassword = $.newPassword.field.getValue() || "";
	if (!passwordValidation.test(newPassword)) {
		$.newPassword.showErrorMsg("密码长度不对");
		return;
	}
	var newPassword2 = $.newPassword2.field.getValue() || "";
	if (newPassword !== newPassword2) {
		$.newPassword2.showErrorMsg("两次密码不相同");
		return;
	}

	var data = {
		userName : $.$attrs.currentUser.xGet("userName"),
		oldPassword : Ti.Utils.sha1(oldPassword),
		newPassword : Ti.Utils.sha1(newPassword),
		newPassword2 : Ti.Utils.sha1(newPassword2)
	};
	Alloy.Globals.Server.postData(data, function(returnedData) {
		saveEndCB("修改成功");
		$.getCurrentWindow().__dirtyCount = 0;
		$.getCurrentWindow().close();
	}, function(e) {
		// 连接服务器出错或用户名已经存在，注册不成功
		$.$model.__xValidationErrorCount = 1;
		$.$model.__xValidationError = e;
		saveErrorCB(e.__summary.msg);
	}, "changePassword");
}

$.oldPassword.UIInit($, $.getCurrentWindow());
$.newPassword.UIInit($, $.getCurrentWindow());
$.newPassword2.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
