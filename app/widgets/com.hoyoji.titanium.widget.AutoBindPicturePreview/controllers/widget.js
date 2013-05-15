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
			value = value.xGet ? value.xGet(path[i]) : value[path[i]];
			if(!value){
				return null;
			}
		}
		if(!value){
			return null;
		}
		var lastAttr = path[path.length-1];
		if(lastAttr.endsWith("()")){
			return value[lastAttr.slice(0,-2)]();		
		} else {
			return value.xGet ? value.xGet(lastAttr) : value[lastAttr];
		}
	}

	$.refresh = function(){
		updatePicture(model);
	}
	
	function updatePicture(model) {
		var value = getAttributeValue(model, $.$attrs.bindAttribute);
        console.info("=================================================================== updatePIcture 1 :" + value);
		if(value){
			// value = value.replace(/-/g, "_");
			var f;
			if(OS_IOS){
				f = Ti.Filesystem.applicationDataDirectory + value + "_icon.png";
			}
			if(OS_ANDROID){
		    	f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon.png";
           	}
            // var f = Ti.Filesystem.applicationDataDirectory + "/" + value + ".png";
            console.info("=================================================================== updatePIcture :" + f);
			$.picture.setImage(f);
		} else if($.$attrs.defaultImage) {
        console.info("=================================================================== updatePIcture 2 :" + value);
			$.picture.setImage($.$attrs.defaultImage+".png");
		} else {
			
        console.info("=================================================================== updatePIcture 3 :" + value);
			$.picture.setImage(WPATH("/images/noPicture.png"));
        console.info("=================================================================== updatePIcture 4 :" + value);
		}
	}


	$.onWindowCloseDo(function() {
		model.off("sync", updatePicture);
	});

	console.info(model + " AutoBind Label get model : " + $.$attrs.bindModel + " from " + $.getParentController().$view.id);

    console.info("=================================================================== updatePIcture :");
	model.on("sync", updatePicture);

	updatePicture(model);
});

