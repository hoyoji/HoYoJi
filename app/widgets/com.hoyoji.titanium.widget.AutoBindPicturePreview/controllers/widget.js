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

	$.refresh = function(){
		updatePicture(model);
	}
	
	function updatePicture(model) {
		var value = getAttributeValue(model, $.$attrs.bindAttribute), d;
		if(value){
			$.picture.setImage(value + "_icon.png");
		} else if($.$attrs.defaultImage){
			$.picture.setImage($.$attrs.defaultImage);
		} else {
			$.picture.setImage(WPATH("/images/noPicture_icon.png"));
		}
	}


	$.onWindowCloseDo(function() {
		model.off("sync", updatePicture);
	});

	console.info(model + " AutoBind Label get model : " + $.$attrs.bindModel + " from " + $.getParentController().$view.id);

	model.on("sync", updatePicture);

	updatePicture(model);
});

