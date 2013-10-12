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

	function getAttributeValue(model, attributes) {
		var path = attributes.split(".");
		var value = model;
		for (var i = 0; i < path.length - 1; i++) {
			value = value.xGet ? value.xGet(path[i]) : value[path[i]];
			if (!value) {
				return null;
			}
		}
		if (!value) {
			return null;
		}
		var lastAttr = path[path.length - 1];
		if (lastAttr.endsWith("()")) {
			return value[lastAttr.slice(0,-2)]();
		} else {
			return value.xGet ? value.xGet(lastAttr) : value[lastAttr];
		}
	}


	$.refresh = function() {
		updatePicture(model);
	};

	function updatePicture(model) {
		var value = getAttributeValue(model, $.$attrs.bindAttribute);
		if (value && model.xGet("picture")) {
			// value = value.replace(/-/g, "_");
			var f;
			if (OS_IOS) {
				f = Ti.Filesystem.applicationDataDirectory + value + "_icon." + model.xGet("picture").xGet("pictureType");
			}
			if (OS_ANDROID) {
				f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon." + model.xGet("picture").xGet("pictureType");
			}
			// var f = Ti.Filesystem.applicationDataDirectory + "/" + value + ".png";
			// $.picture.setImage(f);
			$.$view.setBackgroundImage(f);
		} else if ($.$attrs.defaultImage) {
			// $.picture.setImage($.$attrs.defaultImage + ".png");
			$.$view.setBackgroundImage($.$attrs.defaultImage+".png");
		} else {
			// $.picture.setImage(WPATH("/images/noPicture.png"));
			$.$view.setBackgroundImage(WPATH("/images/noPicture.png"));
		}
	}


	$.onWindowCloseDo(function() {
		model.off("sync", updatePicture);
	});

	console.info(model + " AutoBind Label get model : " + $.$attrs.bindModel + " from " + $.getParentController().$view.id);

	model.on("sync", updatePicture);

	updatePicture(model);

	$.$view.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		var picture = model.xGet("picture");
		if (!picture)
			return;
		// var filePath;
		// if (OS_IOS) {
			// filePath = Ti.Filesystem.applicationDataDirectory + picture.xGet("id") + "." + picture.xGet("pictureType");
		// }
		// if (OS_ANDROID) {
			// filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + picture.xGet("id") + "." + picture.xGet("pictureType");
		// }
		Alloy.Globals.openWindow("ImagePreview", {
			title : "图片预览",
			image : picture
		});
		// }
	});
});

