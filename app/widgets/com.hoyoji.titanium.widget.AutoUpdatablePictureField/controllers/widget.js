Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var mainPicture = null, firstTimeSetValue = true;
	
// $.pictures = [];
$.$view.addEventListener("longpress", function(e){
	e.cancelBubble = true;	
});

$.takePicture.addEventListener("singletap", function() {
	Ti.Media.showCamera({
		success : function(event) {
			var image = event.media;

			Ti.API.debug('Our type was: ' + event.mediaType);
			if (event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
				var imageView = createImageView(event.media);

				var newPicture = Alloy.createModel("Picture", {
					// path : "TEXT NOT NULL",
					recordId : $.$attrs.bindModel.xGet("id"),
					recordType : $.$attrs.bindModel.config.adapter.collection_name
				}).xAddToSave($.getParentController());
				
				if (!mainPicture) {
					$.setValue(newPicture, event.media);
					$.field.fireEvent("change");
				} else {
					$.picturesContainer.add(imageView);
					if($.__dirtyCount === 0){
						$.becameDirty();
					}
				}
				
				var pictureIcon = imageView.toImage();
				newPicture.once("sync", function(newPicture) {
					var fName = newPicture.xGet("id");
					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "_icon.bmp");
					f.write(pictureIcon.media);
					f = null;
					// f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + ".jpg");
					// f.write(imageView.toBlob());
					// f = null;
					// $.$attrs.bindModel.trigger("sync");
				});
				imageView.addEventListener("longpress", function(e){
					setAsMainIcon(imageView, newPicture);
				});
			} else {
				alert("不支持视频");
			}
		},
		// cancel : function() {
			// // alert('You canceled the action.');
		// },
		error : function(error) {
			// create alert
			var a = Titanium.UI.createAlertDialog({
				title : '相片'
			});

			// set message
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('该设备没有摄像头');
			} else {
				a.setMessage('错误：' + error.code);
			}

			// show alert
			a.show();
		},
		// saveToPhotoGallery : true,
		// allowEditing : true,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	});
});
//
// $.getValue = function(e){
// return mainImage;
// }

$.setValue = function(value, image) {
	$.__bindAttributeIsModel = value;
	$.$attrs.bindAttributeIsModel && value && ($.$attrs.bindAttributeIsModel.endsWith("()") ? value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0, -2)]() : value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel));
	if (image) {
		$.field.setImage(image);
		if (firstTimeSetValue) {
			firstTimeSetValue = false;
			mainPicture = value;
		}
	} else {
		if (!value) {
			value = WPATH("/images/noPicture.png");
		} else {
			if (firstTimeSetValue) {
				firstTimeSetValue = false;
				mainPicture = value;
				displayPictures();
			}
			// value = value.replace(/-/g, "_");
           	// var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, value + "_icon.jpg");
			value = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon.bmp";
			// console.info(f);
		}
		$.field.setImage(value);

	}
};

function createImageView(imageData) {
	if (_.isString(imageData)) {
        imageData = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + imageData + "_icon.bmp";
		//imageData = Ti.Filesystem.applicationDataDirectory + "/" + imageData + "_icon.png";
	}
	var imageView = Ti.UI.createImageView({
		width : 56,
		height : 56,
		top : 2,
		left : 2,
		right : 2,
		image : imageData
	});
	return imageView;
}

function displayPictures() {
	var pictures = $.$attrs.bindModel.xGet("pictures");
	if (pictures) {
		pictures.forEach(function(picture) {
			if(picture.xGet("id") !== mainPicture){
	 			var imageView = createImageView(picture.xGet("id"));
				$.picturesContainer.add(imageView);
				
				imageView.addEventListener("longpress", function(e){
					setAsMainIcon(imageView, picture);
				});
			}
		});
	}
}

function setAsMainIcon(imageView, picture){
		Alloy.Globals.alloyAnimation.shake(imageView);
		var image = imageView.getImage();
		imageView.setImage($.field.getImage());
		$.setValue(picture);
		$.field.fireEvent("change");
		if(picture.isNew()){
			$.field.setImage(image);
		}
}
