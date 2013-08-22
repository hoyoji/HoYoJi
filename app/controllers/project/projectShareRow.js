Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.getChildTitle = function() {
	return $.$model.xGet("project").xGet("name");
};

function setWaitForAccept(){
	if($.$model.xGet("state") === "Wait"){
		$.checkAccept.show();
	} else {
		$.checkAccept.hide();
	}
}

$.onWindowOpenDo(function(){
	setWaitForAccept();
});

$.name.UIInit($, $.getCurrentWindow());
