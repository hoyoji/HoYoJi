Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onSave = function(saveEndCB, saveErrorCB) {
	Alloy.Models.User.save({
		newFriendAuthentication : "none"
	}, {
		wait : true,
		patch : true,
		success : saveEndCB
	});
}

$.newFriendAuthentication.UIInit($, $.getCurrentWindow());


