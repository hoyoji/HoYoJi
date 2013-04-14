Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onSave = function(saveEndCB, saveErrorCB){
	$.$model.attributes["id"]  = $.$model.xGet("code");
	$.saveModel(saveEndCB, saveErrorCB);
}
