Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var mainPicture = null, firstTimeSetValue = true;
	
// $.pictures = [];
$.$view.addEventListener("longpress", function(e){
	e.cancelBubble = true;	
});

$.takePicture.addEventListener("singletap", function() {
	Ti.Media.showCamera({
		success : function(event) {
			Ti.API.debug('Our type was: ' + event.mediaType);
			if (event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {

				var newPicture = Alloy.createModel("Picture", {
					// path : "TEXT NOT NULL",
					recordId : $.$attrs.bindModel.xGet("id"),
					recordType : $.$attrs.bindModel.config.adapter.collection_name
				}).xAddToSave($.getParentController());
				
				if (!mainPicture) {
					$.setValue(newPicture, event.media);
					$.field.fireEvent("change");
								
				} else {
					var imageView = createImageView(event.media, true);
					imageView.addEventListener("longpress", function(e){
						setAsMainIcon(imageView, newPicture);
					});
					// $.picturesContainer.add(imageView);
					// imageView.setImage(event.media);
					if($.__dirtyCount === 0){
						$.becameDirty();
					}
				}
				
				// var pictureIcon = imageView.toImage();
				newPicture.once("sync", function(newPicture) {
					var fName = newPicture.xGet("id"), f;
					var image = event.media;
					var ImageFactory = require('ti.imagefactory');
					var pictureIcon = ImageFactory.imageAsResized(event.media, { width:56, height:56 });
					
					f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "_icon.png");
					// if(OS_IOS){
						f.write(pictureIcon);
					// }
					// if(OS_ANDROID){
						// f.write(pictureIcon.media);
					// }
					f = null;
					// f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + ".png");
					// f.write(event.media);
					// f = null;
					// $.$attrs.bindModel.trigger("sync");
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
			if(!mainPicture){
				mainPicture = value;
			}
			if (firstTimeSetValue) {
				firstTimeSetValue = false;
				displayPictures();
			}
			// value = value.replace(/-/g, "_");
           	// var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, value + "_icon.jpg");
           	if(OS_IOS){
           		value = Ti.Filesystem.applicationDataDirectory + value + "_icon.png";
			}
			if(OS_ANDROID){
				value = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon.png";
			}
			// console.info(f);
		}
		// if(value){
			$.field.setImage(value);
		// }
	}
};

function createImageView(imageData, addToContainer) {
	if (_.isString(imageData)) {
		if(OS_IOS){
			imageData = Ti.Filesystem.applicationDataDirectory + imageData + "_icon.png";
		}
		if(OS_ANDROID){
			imageData = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + imageData + "_icon.png";
		}
        //imageData = Ti.Filesystem.applicationDataDirectory + "/" + imageData + "_icon.png";
	}
	var imageView = Ti.UI.createImageView({
		width : 56,
		height : 56,
		left : 2,
		right : 2
	});
	if(addToContainer){
		$.picturesContainer.add(imageView);
	}
	if(imageData){
		imageView.setImage(imageData);
	}
	return imageView;
}

function displayPictures() {
	var pictures = $.$attrs.bindModel.xGet("pictures");
	if (pictures) {
		pictures.forEach(function(picture) {
			if(picture.xGet("id") !== mainPicture){
	 			var imageView = createImageView(picture.xGet("id"), true);
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
