Alloy.Globals.extendsBaseViewController($, arguments[0]);

function submitChange(e) {
	updatePassword();
};

function updatePassword() {
	var passwordValidation = /^.{6,18}$/;
	var oldPassword = $.oldPassword.field.getValue() || "";
	if (!passwordValidation.test(oldPassword)) {
		$.oldPassword.showErrorMsg("当前密码长度不对");
		return;
	}
	var newPassword = $.newPassword.field.getValue() || "";
	if (!passwordValidation.test(newPassword)) {
		$.newPassword.showErrorMsg("新密码长度不对");
		return;
	}
	if(newPassword === oldPassword){
		$.newPassword.showErrorMsg("新密码和当前密码相同");
		return;
	}

	var newPassword2 = $.newPassword2.field.getValue() || "";
	if (newPassword !== newPassword2) {
		$.newPassword2.showErrorMsg("两次密码不相同");
		return;
	}
	
	var data = {
		userId : $.$attrs.currentUser.xGet("id"),
		oldPassword : Ti.Utils.sha1(oldPassword),
		newPassword : Ti.Utils.sha1(newPassword),
		newPassword2 : Ti.Utils.sha1(newPassword2)
	};
	Alloy.Globals.Server.postData(data, function(returnedData) {
		$.$attrs.currentUser.save({
			"password" : Ti.Utils.sha1(newPassword)
		}, {
			patch : true,
			wait : true
		});
		alert("修改成功");
		$.getCurrentWindow().__dirtyCount = 0;
		$.getCurrentWindow().close();
	}, function(e) {
		alert(e.__summary.msg);
	}, "changePassword");
}

$.oldPassword.UIInit($, $.getCurrentWindow());
$.newPassword.UIInit($, $.getCurrentWindow());
$.newPassword2.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
