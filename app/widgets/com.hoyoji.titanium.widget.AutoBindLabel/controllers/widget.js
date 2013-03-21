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
	
	function getAttributeValue(model, attributes){
		var path = attributes.split(".");
		var value = model;
		for (var i = 0; i < path.length-1; i++) {
			if(!value){
				return null;
			}
			value = value.xGet(path[i]);
		}
		var lastAttr = path[path.length-1];
		if(lastAttr.endsWith("()")){
			return value[lastAttr.slice(0,-2)]();		
		} else {
			return value.xGet(lastAttr);
		}
	}
	
	function updateLabel(model) {
		var value = getAttributeValue(model, $.$attrs.bindAttribute), d;
		if($.$attrs.dataType === "DateTime"){
			d = new Date(value);
			value = String.formatDate(d, "medium") + " " + String.formatTime(d, "medium");	
		} else if($.$attrs.dataType === "Date"){
			d = new Date(value);
			value = String.formatDate(d, "medium");	
		} else if($.$attrs.dataType === "Time"){
			d = new Date(value);
			value = String.formatTime(d, "medium");	
		}
		$.label.setText(value);
	}


	$.onWindowCloseDo(function() {
		model.off("sync", updateLabel);
	});

	console.info(model + " AutoBind Label get model : " + $.$attrs.bindModel + " from " + $.getParentController().$view.id);

	model.on("sync", updateLabel);

	updateLabel(model);
});

