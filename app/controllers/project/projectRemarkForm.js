Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onSave = function(saveEndCB, saveErrorCB) {
	$.saveModel(function(){
		$.$model.xGet("project").xRefresh();
		saveEndCB();
	}, saveErrorCB);
};

$.project.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());