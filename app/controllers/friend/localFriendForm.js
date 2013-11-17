Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	if ($.$model.isNew()) {
		$.friendName.field.focus();
	}
});

$.friendName.UIInit($, $.getCurrentWindow());
$.friendCategory.UIInit($, $.getCurrentWindow());
// $.remark.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
