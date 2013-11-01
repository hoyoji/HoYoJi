Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	$.name.field.focus();
});

var oldParentProject = null;
var parentProject = null;
$.project = null;

parentProject = Alloy.createModel("ParentProject").xFindInDb({
	subProjectId : $.$model.xGet("id")
});
if(parentProject.id){
	$.project = parentProject.xGet("parentProject");
	oldParentProject = $.project;
	if($.project){
		$.parentProject.setValue($.project.xGet("name"));
	} else {
		$.parentProject.setValue(null);
	}
}

// 从projectAll中选取project
function openProjectSelector() {
	// $.friendUser.field.blur();
	var attributes = {
		closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave,
		selectorCallback : function(model) {
			$.project = model;
			if($.project){
				$.parentProject.setValue($.project.xGet("name"));
			} else {
				$.parentProject.setValue(null);
			}
		}
	};
	attributes.title = "项目";
	attributes.selectModelType = "Project";
	attributes.selectModelCanBeNull = true;
	attributes.selectedModel = $.project;
	attributes.selectModelCanNotBeChild = true;
	Alloy.Globals.openWindow("project/projectAll", attributes);
}

$.onSave = function(saveEndCB, saveErrorCB) {
	if (oldParentProject !== $.project) {
		if (parentProject.id) {
			parentProject.xSet("parentProject", $.project);
			parentProject.xSave();
		} else {
			parentProject = Alloy.createModel("ParentProject", {
				subProject : $.$model,
				parentProject : $.project,
				ownerUser : Alloy.Models.User
			}).xSave();
		}
	}
	$.$model.xRefresh();
	$.getCurrentWindow().$view.close();
};


$.parentProject.UIInit($, $.getCurrentWindow());
$.name.UIInit($, $.getCurrentWindow());
$.currency.UIInit($, $.getCurrentWindow());
// $.autoAddCategory.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
// $.autoApportion.UIInit($, $.getCurrentWindow());
