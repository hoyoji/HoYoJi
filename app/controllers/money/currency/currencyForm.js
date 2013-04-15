Alloy.Globals.extendsBaseFormController($, arguments[0]);

if($.$model.isNew()){
	$.name.field.focus();
}

$.onSave = function(saveEndCB, saveErrorCB){
	$.$model.attributes["id"]  = $.$model.xGet("code");
	$.saveModel(saveEndCB, saveErrorCB);
}
