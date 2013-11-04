Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.setSelected = function(selected) {
	if (selected) {
		$.projectName.$view.setColor("blue");
	}
};

$.removeParentProjectButton.addEventListener("singletap", function(){
	$.deleteModel();
});

if (!$.$model.xGet("parentProject") || $.$model.xGet("parentProject").xGet("ownerUserId") === Alloy.Models.User.id) {
	$.projectImage.setImage("/images/project/projectAll/myProjectsTableGreen@2x.png");
} else {
	$.projectImage.setImage("/images/project/projectAll/sharedWithMeTableGreen@2x.png");
}

$.ownerUserName.UIInit($, $.getCurrentWindow());
$.projectName.UIInit($, $.getCurrentWindow());
