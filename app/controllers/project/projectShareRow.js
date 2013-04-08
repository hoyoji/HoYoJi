Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.getChildTitle = function() {
	return $.$model.xGet("project").xGet("name");
}