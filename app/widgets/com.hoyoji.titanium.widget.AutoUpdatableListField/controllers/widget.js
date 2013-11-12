Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var __newItems = [];
$.onWindowOpenDo(function() {
	$.table.UIInit($.getParentController(), $.getCurrentWindow());
});

$.xAddToSave = function(controller) {
	__newItems.forEach(function(item) {
		if (!item.__xDeleted) {
			item.xAddToSave(controller);
		}
	});
};

$.xAddToDelete = function(controller) {
	$.$attrs.bindModel.xGet("parentProjectParentProjects").forEach(function(item) {
		if (item.__xDeleted) {
			item.xAddToDelete(controller);
		}
	});
};

$.setValue = function(value) {
	if (value === $.__bindAttributeIsModel) {
		return;
	}
	if (value.length === undefined) {
		__newItems.push(value);
		$.__bindAttributeIsModel.add(value);
	} else {
		$.__bindAttributeIsModel = value;
		//$.$attrs.bindAttributeIsModel && value && ($.$attrs.bindAttributeIsModel.endsWith("()") ? value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0, -2)]() : value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel));

		if (!$.table.__currentWindow) {
			$.table.__currentWindow = $.getCurrentWindow();
			$.table.__parentController = $.getParentController();
		}
		$.table.addCollection($.__bindAttributeIsModel, $.$attrs.rowView);
	}
};

$.setEditable = function(editable) {
	if (editable === false) {
		$.field.hide();
	} else {
		$.field.show();
	}
};

$.__makeOpenWindowAttributes = function(attributes) {
	attributes.selectModelCanNotBeChild = $.$attrs.bindModel;
	return attributes;
};
