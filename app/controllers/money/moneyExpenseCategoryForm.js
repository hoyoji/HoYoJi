Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	if ($.$model.isNew()) {
		$.name.field.focus();
	}
});

$.parentExpenseCategory.UIInit($, $.getCurrentWindow());
$.name.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
