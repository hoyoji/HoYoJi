Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onSave = function(saveEndCB, saveErrorCB){
	 console.info("on save income!");
	 setTimeout(saveEndCB, 3000);
}
