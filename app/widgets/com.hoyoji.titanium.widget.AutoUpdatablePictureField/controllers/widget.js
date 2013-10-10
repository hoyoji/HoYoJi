Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

// $.fieldContainer = Ti.UI.createView({
	// width : "56",
	// height : "56",
	// left : "2",
	// right : "2"
// });
// 
// $.field = Ti.UI.createImageView({
	// width : Ti.UI.SIZE,
	// height : Ti.UI.SIZE
// });
// $.fieldContainer.add($.field);
// $.picturesContainer.add($.fieldContainer);
// $.field.setImage("/images/com.hoyoji.titanium.widget.AutoUpdatablePictureField/noPicture.png");

var mainPicture = null, firstTimeSetValue = true;

$.__newPictures = [];
$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
});

$.xAddToSave = function(controller) {
	$.__newPictures.forEach(function(picture){
		picture.xAddToSave(controller);
	});
};

$.takePicture.addEventListener("singletap", function() {
	Ti.Media.showCamera({
		success : function(event) {
			if (event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
				var imageType = event.media.mimeType.slice(6);

				var ImageFactory = require('ti.imagefactory'), width = 56, height = 56;
				if (event.media.height > event.media.width) {
					width = event.media.width / (event.media.height / 56);
				} else if (event.media.height < event.media.width) {
					height = event.media.height / (event.media.width / 56);
				}
				var pictureIcon = ImageFactory.imageAsResized(event.media, {
					width : width,
					height : height
				});

				var newPicture = Alloy.createModel("Picture", {
					recordId : $.$attrs.bindModel.xGet("id"),
					recordType : $.$attrs.bindModel.config.adapter.collection_name,
					pictureType : imageType,
					ownerUser : Alloy.Models.User
				});
				$.__newPictures.push(newPicture);
				// newPicture.xSet("path", Ti.Filesystem.applicationDataDirectory + newPicture.xGet("id") + "." + imageType);

				//save to picture to temp directory
				var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType), scaledPicture, scaledFactor;
				if(event.media.width > 600 || event.media.height > 800){
					if(event.media.width / 600 > event.media.height / 800){
						scaledFactor = event.media.width / 600;
					} else {
						scaledFactor = event.media.height / 800;
					}
					scaledPicture = ImageFactory.imageAsResized(event.media, {
						width : event.media.width / scaledFactor,
						height : event.media.height / scaledFactor
					});
				} else {
					scaledPicture = event.media;
				}
				f.write(scaledPicture);
				f = null;

				if (!mainPicture) {
					$.setValue(newPicture, pictureIcon);
					$.field.fireEvent("change");
					// $.fieldContainer.removeEventListener("singletap");
					$.fieldContainer.addEventListener("singletap", function(e) {
						// var imgFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType);
						// var filePath;
						// if (OS_IOS) {
							// filePath = Ti.Filesystem.tempDirectory + newPicture.xGet("id") + "." + imageType;
						// }
						// if (OS_ANDROID) {
							// filePath = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory).nativePath + "/" + newPicture.xGet("id") + "." + imageType;
						// }
						Alloy.Globals.openWindow("ImagePreview", {
							title : "图片预览",
							image : newPicture
						});
					});
				} else {
					var imageView = createImageView(pictureIcon, newPicture.pictureType, true);
					// imageView.addEventListener("longpress", function(e){
					// setAsMainIcon(imageView, newPicture);
					// });

					imageView.addEventListener("singletap", function(e) {
						// var imgFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType);
						// if (imgFile) {
						// var filePath;
						// if (OS_IOS) {
							// filePath = Ti.Filesystem.tempDirectory + newPicture.xGet("id") + "." + imageType;
						// }
						// if (OS_ANDROID) {
							// filePath = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory).nativePath + "/" + newPicture.xGet("id") + "." + imageType;
						// }
						Alloy.Globals.openWindow("ImagePreview", {
							title : "图片预览",
							image : newPicture
						});
						// }
					});

					if ($.__dirtyCount === 0) {
						$.becameDirty();
					}
				}

				// var pictureIcon = imageView.toImage();
				function deleteTempFile(){
					var fName = newPicture.xGet("id");
					newPicture.off("xdiscard", deleteTempFile);
					var tmpf = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fName + "." + imageType);
					tmpf.deleteFile();
					tmpf = null;
				}
				newPicture.on("xdiscard", deleteTempFile);
				newPicture.once("sync", function(newPicture) {
					newPicture.off("xdiscard", deleteTempFile);
					var fName = newPicture.xGet("id"), f;
					f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "_icon." + imageType);
					// if(OS_IOS){
					f.write(pictureIcon);
					// }
					// if(OS_ANDROID){
					// f.write(pictureIcon.media);
					// }
					f = null;
					var tmpf = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fName + "." + imageType);
					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "." + imageType);
					f.write(tmpf.read());
					f = null;
					tmpf.deleteFile();
					tmpf = null;
					// $.$attrs.bindModel.trigger("sync");
				});
				
				
			} else {
				alert("此设备不支持视频");
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
		autohide : true,
		saveToPhotoGallery : false,
		allowEditing : false,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	});
});
//
// $.getValue = function(e){
// return mainImage;
// }

$.setValue = function(value, image) {
	$.__bindAttributeIsModel = value;
	// var imageType = "";
	// if (value) {
	// imageType = value.xGet("pictureType");
	// }

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
			if (!mainPicture) {
				mainPicture = value;
			}
			if (firstTimeSetValue) {
				firstTimeSetValue = false;
				displayPictures();
			}
			if (OS_IOS) {
				value = Ti.Filesystem.applicationDataDirectory + value + "_icon." + $.__bindAttributeIsModel.xGet("pictureType");
			}
			if (OS_ANDROID) {
				value = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon." + $.__bindAttributeIsModel.xGet("pictureType");
			}
			$.fieldContainer.addEventListener("singletap", function(e) {
				// var filePath;
				// if (OS_IOS) {
					// filePath = Ti.Filesystem.applicationDataDirectory + mainPicture + "." + $.__bindAttributeIsModel.xGet("pictureType");
				// }
				// if (OS_ANDROID) {
					// filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + mainPicture + "." + $.__bindAttributeIsModel.xGet("pictureType");
				// }
				Alloy.Globals.openWindow("ImagePreview", {
					title : "图片预览",
					image : mainPicture
				});
				// var imgFile = Ti.Filesystem.getFile(value);
				// if (imgFile) {
				// if (OS_ANDROID) {
				// Ti.Media.previewImage({
				// image : imgFile.read(),
				// error : function() {
				// alert("无法打开图像");
				// }
				// });
				// }
				// }
			});
		}
		$.field.setImage(value);
	}
};

function createImageView(imageData, type, addToContainer) {
	if (_.isString(imageData)) {
		if (OS_IOS) {
			imageData = Ti.Filesystem.applicationDataDirectory + imageData + "_icon." + type;
		}
		if (OS_ANDROID) {
			imageData = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + imageData + "_icon." + type;
		}
	}
	var imageView = Ti.UI.createImageView({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE
	});
	var view = Ti.UI.createView({
		width : 56,
		height : 56,
		left : 2,
		right : 2,
		backgroundColor : "#e9f3f0"
	});
	view.add(imageView);
	if (addToContainer) {
		$.picturesContainer.add(view);
	}
	if (imageData) {
		imageView.setImage(imageData);
	}
	return view;
}

function displayPictures() {
	var pictures = $.$attrs.bindModel.xGet("pictures");
	if (pictures) {
		pictures.forEach(function(picture) {
			if (picture.xGet("id") !== mainPicture) {
				var imageView = createImageView(picture.xGet("id"), picture.xGet("pictureType"), true);
				// imageView.addEventListener("longpress", function(e){
				// setAsMainIcon(imageView, picture);
				// });
				imageView.addEventListener("singletap", function(e) {
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
				});
			}
		});
	}
}

function setAsMainIcon(imageView, picture) {
	Alloy.Globals.alloyAnimation.shake(imageView);
	var image = imageView.getImage();
	imageView.setImage($.field.getImage());
	$.setValue(picture);
	$.field.fireEvent("change");
	if (picture.isNew()) {
		$.field.setImage(image);
	}
}
