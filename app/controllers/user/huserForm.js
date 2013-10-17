Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.setSaveableMode("edit");

function changePassword() {

}

$.changePassword.addEventListener("singletap", changePassword);

$.onSave = function(saveEndCB, saveErrorCB) {
	$.picture.xAddToSave($);
	$.saveModel(saveEndCB, saveErrorCB);
};

$.picture.UIInit($, $.getCurrentWindow());
$.userName.UIInit($, $.getCurrentWindow());
$.changePassword.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
