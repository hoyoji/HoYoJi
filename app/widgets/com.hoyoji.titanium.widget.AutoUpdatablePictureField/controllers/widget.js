Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var mainPicture, firstTimeSetValue = true, selectedPicture = null;
$.__newPictures = [];

// $.$view.addEventListener("longpress", function(e) {
// e.cancelBubble = true;
// });

function openOptionsDialog() {
	var optArray;
	if (mainPicture === selectedPicture) {
		optArray = ['删除图片', '取消'];
	} else {
		optArray = ['删除图片', '设为主图标', '取消'];
	}
	var opts = {
		cancel : optArray.length - 1,
		options : optArray,
		selectedIndex : optArray.length - 1,
		destructive : 0,
		title : '图片操作'
	};

	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener("click", function(e) {
		if (e.index === 0) {
			deleteSelectedPicture();
		} else if (e.index === 1 && optArray.length > 2) {
			setAsMainIcon(selectedPicture);
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

$.autoSave = function (){
	$.__newPictures.forEach(function(picture) {
		picture.xSave();
	});
};

function getImage(event) {
	if (event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
		var imageType = event.media.mimeType.slice(6);
		var pictureIcon = Alloy.Globals.creatImageThumbnail(event.media, 56);

		var newPicture = Alloy.createModel("Picture", {
			recordId : $.$attrs.bindModel.xGet("id"),
			recordType : $.$attrs.bindModel.config.adapter.collection_name,
			pictureType : imageType,
			ownerUser : Alloy.Models.User
		});
		$.__newPictures.push(newPicture);

		//save to picture to temp directory
		var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType), scaledPicture;
		scaledPicture = Alloy.Globals.resizeImage(event.media, 600, 800);
		f.write(scaledPicture);
		f = null;
		// alert(event.media.length + " -> " + scaledPicture.length + " :: " + imageType);
		function showOptionsDialog(e) {
			e.cancelBubble = true;
			selectedPicture = newPicture;
			openOptionsDialog();
		}

		function previewImage(e) {
			Alloy.Globals.openWindow("ImagePreview", {
				image : newPicture
			});
		}

		if (!mainPicture) {
			$.__bindAttributeIsModel = newPicture;
			//$.field.setImage(pictureIcon);
			$.fieldContainer.setImage(pictureIcon);
			// if (firstTimeSetValue) {
			// firstTimeSetValue = false;
			mainPicture = newPicture;
			// }
			$.field.fireEvent("change");
			$.fieldContainer.addEventListener("longpress", showOptionsDialog);
			$.fieldContainer.addEventListener("singletap", previewImage);
		} else {
			var imageView = createImageView(pictureIcon, newPicture.pictureType, true);
			imageView.addEventListener("longpress", showOptionsDialog);
			imageView.addEventListener("singletap", previewImage);

			if ($.__dirtyCount === 0) {
				$.becameDirty();
			}
		}

		// var pictureIcon = imageView.toImage();

		function xDestroyPictureView() {
			newPicture.off("xdestroy", xDestroyPictureView);
			if (mainPicture === newPicture) {
				mainPicture = null;
				//$.field.setImage(WPATH("/images/noPicture.png"));
			$.fieldContainer.setImage(WPATH("/images/noPicture.png"));
				$.__bindAttributeIsModel = null;
				$.fieldContainer.removeEventListener("longpress", showOptionsDialog);
				$.fieldContainer.removeEventListener("singletap", previewImage);
				$.field.fireEvent("change");
			} else {
				imageView.removeEventListener("longpress", showOptionsDialog);
				imageView.removeEventListener("singletap", previewImage);
				$.picturesContainer.remove(imageView);
			}
		}

		function discardPicture() {
			var fName = newPicture.xGet("id");
			var tmpf = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fName + "." + imageType);
			tmpf.deleteFile();
			tmpf = null;
			newPicture.off("sync", savePicture);
			newPicture.off("xdiscard", discardPicture);
			// xDestroyPictureView();
			newPicture.trigger("xdestroy");
		}

		function savePicture() {
			newPicture.off("sync", savePicture);
			newPicture.off("xdiscard", discardPicture);
			newPicture.off("xdestroy", xDestroyPictureView);
			var fName = newPicture.xGet("id"), f;
			f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "_icon." + imageType);
			f.write(pictureIcon);
			f = null;
			var tmpf = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fName + "." + imageType);
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "." + imageType);
			f.write(tmpf.read());
			f = null;
			tmpf.deleteFile();
			tmpf = null;
		}

		newPicture.on("xdestroy", xDestroyPictureView);
		newPicture.on("xdiscard", discardPicture);
		newPicture.on("sync", savePicture);
	} else {
		alert("此设备不支持视频");
	}
}

$.importPictureFromGallery = function() {
	Ti.Media.openPhotoGallery({
		success : getImage,
		error : function(error) {
			// create alert
			var a = Titanium.UI.createAlertDialog({
				title : '导入图片'
			});
			a.setMessage('错误：' + error.code);
			// show alert
			a.show();
		},
		allowEditing : false,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	});
};

$.takePicture.addEventListener("singletap", function() {
	Ti.Media.showCamera({
		success : getImage,
		// cancel : function() {
		// // alert('You canceled the action.');
		// },
		error : function(error) {
			// create alert
			var a = Titanium.UI.createAlertDialog({
				title : '拍照'
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
		// autohide : true,
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
	var previousModel = $.__bindAttributeIsModel = value;
	$.$attrs.bindAttributeIsModel && value && ($.$attrs.bindAttributeIsModel.endsWith("()") ? value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0, -2)]() : value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel));

	if (mainPicture) {
		mainPicture.trigger("xdestroy");
	}
	mainPicture = $.__bindAttributeIsModel = previousModel;
	if (!value) {
		value = WPATH("/images/noPicture.png");
	} else {
		function showMainPictureOptionsDialog(e) {
			e.cancelBubble = true;
			selectedPicture = $.__bindAttributeIsModel;
			openOptionsDialog();
		}

		function previewMainPicture(e) {
			Alloy.Globals.openWindow("ImagePreview", {
				image : $.__bindAttributeIsModel
			});
		}

		function removeMainPictureFromView() {
			mainPicture.off("destroy", removeMainPictureFromView);
			mainPicture.off("xdestroy", removeMainPictureFromView);
			$.fieldContainer.removeEventListener("longpress", showMainPictureOptionsDialog);
			$.fieldContainer.removeEventListener("singletap", previewMainPicture);
			mainPicture = null;
			//$.field.setImage(WPATH("/images/noPicture.png"));
			$.fieldContainer.setImage(WPATH("/images/noPicture.png"));
			$.__bindAttributeIsModel = null;
			$.field.fireEvent("change");
		}


		$.fieldContainer.addEventListener("longpress", showMainPictureOptionsDialog);
		$.fieldContainer.addEventListener("singletap", previewMainPicture);
		mainPicture.on("destroy", removeMainPictureFromView);
		mainPicture.on("xdestroy", removeMainPictureFromView);

		if (mainPicture.isNew()) {
			value = generateIconImage(mainPicture);
		} else {
			if (OS_IOS) {
				value = Ti.Filesystem.applicationDataDirectory + value + "_icon." + mainPicture.xGet("pictureType");
			}
			if (OS_ANDROID) {
				value = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/" + value + "_icon." + mainPicture.xGet("pictureType");
			}
		}
	}
	//$.field.setImage(value);
	$.fieldContainer.setImage(value);
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
		height : Ti.UI.SIZE,
		left : 2,
		right : 2
	});
	// var imageView = Ti.UI.createView({
		// width : 56,
		// height : 56,
		// left : 2,
		// right : 2,
		// backgroundColor : "#e9f3f0"
	// });
	// view.add(imageView);
	if (addToContainer) {
		$.picturesContainer.add(imageView);
	}
	if (imageData) {
		imageView.setImage(imageData);
	}
	return imageView;
}

function createImage(picture) {
	var imageView = createImageView(picture.xGet("id"), picture.xGet("pictureType"), true);
	function showOptionsDialog(e) {
		e.cancelBubble = true;
		selectedPicture = picture;
		openOptionsDialog();
	}

	function previewImage(e) {
		Alloy.Globals.openWindow("ImagePreview", {
			image : picture
		});
	}

	function removePictureFromView() {
		picture.off("destroy", removePictureFromView);
		picture.off("xdestroy", removePictureFromView);
		imageView.removeEventListener("longpress", showOptionsDialog);
		imageView.removeEventListener("singletap", previewImage);
		$.picturesContainer.remove(imageView);
	}


	imageView.addEventListener("longpress", showOptionsDialog);
	imageView.addEventListener("singletap", previewImage);
	picture.on("destroy", removePictureFromView);
	picture.on("xdestroy", removePictureFromView);
}

function generateIconImage(newPicture) {
	var imageType = newPicture.xGet("pictureType"), media, f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, newPicture.xGet("id") + "." + imageType);
	media = f.read();
	f = null;
	return Alloy.Globals.creatImageThumbnail(media, 56);
}

function appendTempImageToEnd(newPicture) {
	var imageType = newPicture.xGet("pictureType");
	var pictureIcon = generateIconImage(newPicture);

	function showOptionsDialog(e) {
		e.cancelBubble = true;
		selectedPicture = newPicture;
		openOptionsDialog();
	}

	function previewImage(e) {
		Alloy.Globals.openWindow("ImagePreview", {
			image : newPicture
		});
	}

	var imageView = createImageView(pictureIcon, newPicture.pictureType, true);
	imageView.addEventListener("longpress", showOptionsDialog);
	imageView.addEventListener("singletap", previewImage);

	function xDestroyPictureView() {
		newPicture.off("xdestroy", xDestroyPictureView);
		imageView.removeEventListener("longpress", showOptionsDialog);
		imageView.removeEventListener("singletap", previewImage);
		$.picturesContainer.remove(imageView);
	}

	newPicture.on("xdestroy", xDestroyPictureView);

}

function displayPictures() {
	var pictures = $.$attrs.bindModel.xGet("pictures");
	if (pictures) {
		pictures.forEach(function(picture) {
			if (picture !== mainPicture) {
				createImage(picture);
			}
		});
	}
}

function setAsMainIcon(picture) {
	var mainImage = mainPicture;
	picture.trigger("xdestroy");

	$.setValue(picture);
	$.field.fireEvent("change");

	if (mainImage) {
		if (mainImage.isNew()) {
			appendTempImageToEnd(mainImage);
		} else {
			createImage(mainImage);
		}
	}

}
