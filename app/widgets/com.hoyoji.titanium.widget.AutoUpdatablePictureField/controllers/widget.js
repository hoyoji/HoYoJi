Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var mainPicture = null, firstTimeSetValue = true;

// $.pictures = [];
$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
});

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
				}).xAddToSave($.getParentController());
				// newPicture.xSet("path", Ti.Filesystem.applicationDataDirectory + newPicture.xGet("id") + "." + imageType);

				//save to picture to temp directory
				var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType);
				f.write(event.media);
				f = null;

				if (!mainPicture) {
					$.setValue(newPicture, pictureIcon);
					$.field.fireEvent("change");
					$.field.addEventListener("singletap", function(e) {
						var imgFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType);
						if (imgFile) {
							if (OS_ANDROID) {
								Ti.Media.previewImage({
									image : imgFile.read(),
									error : function() {
										alert("无法打开图像");
									}
								});
							}
						}
					});					
				} else {
					var imageView = createImageView(pictureIcon, newPicture.pictureType, true);
					// imageView.addEventListener("longpress", function(e){
					// setAsMainIcon(imageView, newPicture);
					// });

					imageView.addEventListener("singletap", function(e) {
						var imgFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType);
						if (imgFile) {
							if (OS_ANDROID) {
								Ti.Media.previewImage({
									image : imgFile.read(),
									error : function() {
										alert("无法打开图像");
									}
								});
							}
						}
					});

					if ($.__dirtyCount === 0) {
						$.becameDirty();
					}
				}

				// var pictureIcon = imageView.toImage();
				newPicture.once("sync", function(newPicture) {
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
	var imageType = "";
	if (value) {
		imageType = value.xGet("pictureType");
	}

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
				value = Ti.Filesystem.applicationDataDirectory + value + "_icon." + imageType;
			}
			if (OS_ANDROID) {
				value = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon." + imageType;
			}
		}
		$.field.setImage(value);
			$.field.addEventListener("singletap", function(e) {
			var value;
			if (OS_IOS) {
				value = Ti.Filesystem.applicationDataDirectory + mainPicture + "." + imageType;
			}
			if (OS_ANDROID) {
				value = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + mainPicture + "." + imageType;
			}				
				var imgFile = Ti.Filesystem.getFile(value);
				if (imgFile) {
					if (OS_ANDROID) {
						Ti.Media.previewImage({
							image : imgFile.read(),
							error : function() {
								alert("无法打开图像");
							}
						});
					}
				}
			});
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
		//width : 56,
		//height : 56,
		left : 2,
		right : 2
	});
	if (addToContainer) {
		$.picturesContainer.add(imageView);
	}
	if (imageData) {
		imageView.setImage(imageData);
	}
	return imageView;
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
					var filePath;
					if (OS_IOS) {
						filePath = Ti.Filesystem.applicationDataDirectory;
					}
					if (OS_ANDROID) {
						filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/";
					}
					var imgFile = Ti.Filesystem.getFile(filePath, picture.xGet("id") + "." + picture.xGet("pictureType"));
					if (imgFile) {
						if (OS_ANDROID) {
							Ti.Media.previewImage({
								image : imgFile.read(),
								error : function() {
									alert("无法打开图像");
								}
							});
						}
					}
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
