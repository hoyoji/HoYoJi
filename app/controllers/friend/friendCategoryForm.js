Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	if ($.$model.isNew()) {
		$.name.field.focus();
	}
});

$.parentFriendCategory.UIInit($, $.getCurrentWindow());
$.name.UIInit($, $.getCurrentWindow());

$.titleBar.UIInit($, $.getCurrentWindow());
