Alloy.Globals.extendsBaseFormController($, arguments[0]);

function onFooterbarTap(e) {
	if(e.source.id === "commit"){
		updateUser();
	}
}

function updateUser() {
	$.picture.autoSave();
}

function changePassword() {
	Alloy.Globals.openWindow("user/changePassword", {
		currentUser : $.$model
	});
}

$.changePassword.addEventListener("singletap", changePassword);

$.picture.UIInit($, $.getCurrentWindow());
$.userName.UIInit($, $.getCurrentWindow());
$.changePassword.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
