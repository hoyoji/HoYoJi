Alloy.Globals.extendsBaseUIController($, arguments[0]);

$.onWindowOpenDo(function() {
	var model = $.$attrs.bindModel || $.$model;

	if (model && typeof model === "string") {
		var path = model.split(".");
		if (path[0] === "$") {
			model = $.getParentController();
		} else {
			model = Alloy.Models[path[0]];
		}

		for (var i = 1; i < path.length; i++) {
			if (model.xGet) {
				model = model.xGet(path[i]);
			} else {
				model = model[path[i]];
			}
		}
	}

	function updateLabel(model) {
		$.label.setText(model.xGet($.$attrs.bindAttribute));
	}


	$.onWindowCloseDo(function() {
		model.off("sync", updateLabel);
	});

	console.info(model + " AutoBind Label get model : " + $.$attrs.bindModel + " from " + $.getParentController().$view.id);

	model.on("sync", updateLabel);

	updateLabel(model);
});

