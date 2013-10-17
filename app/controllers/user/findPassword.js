Alloy.Globals.extendsBaseViewController($, arguments[0]);

var onFooterbarTap = function(e) {
	if (e.source.id === "commit") {
		sendEmail();
	}
};

function sendEmail(){
	if (!$.email.getValue()) {
		alert("请输入邮箱");
	} else {
		var emailValidation = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$/;
		if (!emailValidation.test($.email.getValue())) {
			alert("email不正确");
			$.email.setValue("");
		} else {
			Alloy.Globals.Server.postData([{
				email : Alloy.Globals.alloyString.trim($.email.getValue())
			}], function(data) {
				alert(data.msg);
			}, function(e) {
				alert(e.__summary.msg);
			}, "passwordRecoverEmail");
		}
	}
}

$.titleBar.UIInit($, $.getCurrentWindow());