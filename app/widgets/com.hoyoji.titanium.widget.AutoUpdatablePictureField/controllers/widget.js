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
// Alloy.Globals.patchScrollableViewOnAndroid($.picturesContainer);

var mainPicture, firstTimeSetValue = true, selectedPicture = null;
$.__newPictures = [];

// $.makeContextMenu = function() {
// var menuSection = Ti.UI.createTableViewSection({
// headerTitle : "图片操作"
// });
// if(selectedPicture){
// menuSection.add($.createContextMenuItem("删除图片", deleteSelectedPicture));
// }
// return menuSection;
// };

// $.$view.addEventListener("longpress", function(e) {
// e.cancelBubble = true;
// });

function openOptionsDialog() {
	var opts = {
		cancel : 2,
		options : ['删除图片', '设为主图标', '取消'],
		selectedIndex : 2,
		destructive : 0,
		title : '图片操作'
	};

	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener("click", function(e) {

		if (e.index === 0) {
			deleteSelectedPicture();
		} else if (e.index === 1) {
			alert("设为注图标还没做好");
		}

	});
	dialog.show();
}

function deleteSelectedPicture() {
	if (selectedPicture.isNew()) {
		selectedPicture.trigger("xdiscard");
		var index = _.indexOf($.__newPictures, selectedPicture);
		if (index !== -1) {
			$.__newPictures.splice(index, 1);
		}
	} else {
		selectedPicture.xDelete(function(e) {
			if (!e) {
				alert("图片已被删除");
			} else {
				alert("图片删除失败：" + e.summary.msg);
			}
		});
	}
}

$.xAddToSave = function(controller) {
	$.__newPictures.forEach(function(picture) {
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
				if (event.media.width > 600 || event.media.height > 800) {
					if (event.media.width / 600 > event.media.height / 800) {
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
					$.__bindAttributeIsModel = newPicture;
					$.field.setImage(pictureIcon);
					// if (firstTimeSetValue) {
						// firstTimeSetValue = false;
						mainPicture = newPicture;
					// }
					$.field.fireEvent("change");
					$.fieldContainer.addEventListener("longpress", function(e) {
						e.cancelBubble = true;
						//setAsMainIcon(imageView, newPicture);
						selectedPicture = newPicture;
						openOptionsDialog();
					});
					$.fieldContainer.addEventListener("singletap", function(e) {
						Alloy.Globals.openWindow("ImagePreview", {
							title : "图片预览",
							image : newPicture
						});
					});
				} else {
					var imageView = createImageView(pictureIcon, newPicture.pictureType, true);
					imageView.addEventListener("longpress", function(e) {
						e.cancelBubble = true;
						//setAsMainIcon(imageView, newPicture);
						selectedPicture = newPicture;
						openOptionsDialog();
					});

					imageView.addEventListener("singletap", function(e) {
						Alloy.Globals.openWindow("ImagePreview", {
							title : "图片预览",
							image : newPicture
						});
					});

					if ($.__dirtyCount === 0) {
						$.becameDirty();
					}
				}

				// var pictureIcon = imageView.toImage();
				function discardPicture() {
					var fName = newPicture.xGet("id");
					newPicture.off("sync", savePicture);
					newPicture.off("xdiscard", discardPicture);
					var tmpf = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fName + "." + imageType);
					tmpf.deleteFile();
					tmpf = null;
					if (mainPicture === newPicture) {
						mainPicture = null;
						$.field.setImage(WPATH("/images/noPicture.png"));
						$.__bindAttributeIsModel = null;
						$.field.fireEvent("change");
					} else {
						$.picturesContainer.remove(imageView);
					}
				}

				function savePicture(newPicture) {
					newPicture.off("sync", savePicture);
					newPicture.off("xdiscard", discardPicture);
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
				}


				newPicture.on("xdiscard", discardPicture);
				newPicture.on("sync", savePicture);

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

$.setValue = function(value) {
	$.__bindAttributeIsModel = value;
	$.$attrs.bindAttributeIsModel && value && ($.$attrs.bindAttributeIsModel.endsWith("()") ? value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0, -2)]() : value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel));

	mainPicture = $.__bindAttributeIsModel;
	if (!value) {
		value = WPATH("/images/noPicture.png");
	} else {
		if (OS_IOS) {
			value = Ti.Filesystem.applicationDataDirectory + value + "_icon." + $.__bindAttributeIsModel.xGet("pictureType");
		}
		if (OS_ANDROID) {
			value = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon." + $.__bindAttributeIsModel.xGet("pictureType");
		}
		$.field.addEventListener("longpress", function(e) {
			e.cancelBubble = true;
			//setAsMainIcon(imageView, newPicture);
			selectedPicture = $.__bindAttributeIsModel;
			openOptionsDialog();
		});
		$.fieldContainer.addEventListener("singletap", function(e) {
			Alloy.Globals.openWindow("ImagePreview", {
				title : "图片预览",
				image : $.__bindAttributeIsModel
			});
		});
		function setValueRemovePictureFromView() {
			mainPicture.off("destroy", setValueRemovePictureFromView);
			mainPicture = null;
			$.field.setImage(WPATH("/images/noPicture.png"));
			$.__bindAttributeIsModel = null;
			$.field.fireEvent("change");
		}
		mainPicture.on("destroy", setValueRemovePictureFromView);
		$.field.setImage(value);
	}
	if (firstTimeSetValue) {
		firstTimeSetValue = false;
		displayPictures();
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
			if (picture !== mainPicture) {
				var imageView = createImageView(picture.xGet("id"), picture.xGet("pictureType"), true);
				imageView.addEventListener("longpress", function(e) {
					e.cancelBubble = true;
					//setAsMainIcon(imageView, picture);
					selectedPicture = picture;
					openOptionsDialog();
				});
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
				function removePictureFromView() {
					picture.off("destroy", removePictureFromView);
					$.picturesContainer.remove(imageView);
				}


				picture.on("destroy", removePictureFromView);
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
