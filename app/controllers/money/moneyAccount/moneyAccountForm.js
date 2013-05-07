Alloy.Globals.extendsBaseFormController($, arguments[0]);

if($.$model.isNew()){
	$.onWindowOpenDo(function() {
		$.name.field.focus();
	});
}
