Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	if ($.$model.isNew()) {
		$.name.field.focus();
	}
});

$.parentIncomeCategory.UIInit($, $.getCurrentWindow());
$.name.UIInit($, $.getCurrentWindow());
