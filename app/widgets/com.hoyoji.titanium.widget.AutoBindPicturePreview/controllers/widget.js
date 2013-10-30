Alloy.Globals.extendsBaseUIController($, arguments[0]);

var picture;
	
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
		if($.$attrs.bindAttributeIsModel){
			model = value;
			value = value.xGet($.$attrs.bindAttributeIsModel);
		}
		if($.$attrs.fetchRemoteImage && value){
			$.showActivityIndicator();
			Alloy.Globals.Server[$.$attrs.fetchRemoteImage](value, function(remotePicture){
				picture = remotePicture;
				var f = Alloy.Globals.getTempDirectory() + picture.xGet("id") + "_icon." + picture.xGet("pictureType");
				$.$view.setBackgroundImage(f);
				$.hideActivityIndicator();
			}, function(){
				if ($.$attrs.defaultImage) {
					$.$view.setBackgroundImage($.$attrs.defaultImage+".png");
				} else {
					$.$view.setBackgroundImage(WPATH("/images/noPicture.png"));
				}
				$.hideActivityIndicator();
			});
			return;
		}
		
		if (value && model.xGet("picture")) {
			picture = model.xGet("picture");
			var f = Alloy.Globals.getApplicationDirectory() + value + "_icon." + model.xGet("picture").xGet("pictureType");
			$.$view.setBackgroundImage(f);
		} else if ($.$attrs.defaultImage) {
			$.$view.setBackgroundImage($.$attrs.defaultImage+".png");
		} else {
			$.$view.setBackgroundImage(WPATH("/images/noPicture.png"));
		}
	}


	$.onWindowCloseDo(function() {
		model.off("sync", updatePicture);
	});

	model.on("sync", updatePicture);

	updatePicture(model);
	
	$.$view.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		if (!picture)
			return;
		Alloy.Globals.openWindow("ImagePreview", {
			title : "图片预览",
			image : picture,
			images : model.xGet("pictures"),
			fetchImageTarget : model.config.adapter.collection_name === "User" ? "fetchUserImage" : null,
			scrollingEnabled : false
		});
	});
});

