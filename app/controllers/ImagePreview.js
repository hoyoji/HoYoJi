Alloy.Globals.extendsBaseViewController($, arguments[0]);

var currentImage;

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "图片操作"
	});
	if (currentImage) {
		menuSection.add($.createContextMenuItem("保存到手机", saveToGallery));
	}
	return menuSection;
};

function saveToGallery() {
	if (OS_IOS) {
		Ti.Media.saveToPhotoGallery($.image.toBlob(), {
			success : function(e) {
				alert('图片成功保存到手机相册');
			},
			error : function(e) {
				alert('保存图片到手机相册时出错：' + e.error);
			}
		});
	} else {
		if (Ti.Filesystem.isExternalStoragePresent) {
			var dir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory + "HoYoJi");
			dir.createDirectory();
			var newPath = Ti.Filesystem.externalStorageDirectory + "HoYoJi/" + currentImage.xGet("id") + "." + currentImage.xGet("pictureType");
			var f = Ti.Filesystem.getFile(newPath);
			f.write($.image.toBlob());
			f = null;
			Ti.Media.Android.scanMediaFiles([newPath], null, function(e) {
				if (e.uri) {
					alert('图片成功保存到手机相册');
				} else {
					alert('保存图片到手机相册时出错：' + e.error);
				}
			});
		} else {
			alert('没有找到可用于存储的SD卡');
		}
	}
}

$.onWindowOpenDo(function() {
	if ($.getCurrentWindow().$attrs.image) {
		currentImage = $.getCurrentWindow().$attrs.image;
		var filePath, fileName = currentImage.xGet("id") + "." + currentImage.xGet("pictureType");
		if (OS_IOS) {
			if (currentImage.isNew()) {
				filePath = Ti.Filesystem.tempDirectory;
			} else {
				filePath = Ti.Filesystem.applicationDataDirectory;
			}
		}
		if (OS_ANDROID) {
			if (currentImage.isNew()) {
				filePath = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory).nativePath + "/";
			} else {
				filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/";
			}
		}
		var f = Ti.Filesystem.getFile(filePath, fileName);
		if (f.exists()) {
			f = null;
			$.image.setImage(filePath + fileName);
		} else {
			f = null;
			$.image.setImage(filePath + currentImage.xGet("id") + "_icon." + currentImage.xGet("pictureType"));
			var style;
			if (OS_IOS) {
				style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
			} else {
				style = Ti.UI.ActivityIndicatorStyle.PLAIN;
			}
			$.titleBar.showActivityIndicator("正在下载图片...", {
				color : "white",
				style : style
			});
			$.titleBar.setTitle("");

			Alloy.Globals.Server.fetchImage(currentImage.xGet("id"), function(imageData) {
				$.image.setImage(filePath + fileName);
				$.titleBar.hideActivityIndicator();
				$.titleBar.setTitle("图片预览");
			}, function(e) {
				alert("下载图片错误：" + e.__summary.msg);
				$.titleBar.hideActivityIndicator();
				$.titleBar.setTitle("图片预览");
			}, $.$attrs.fetchImageTarget, filePath);
		}
	}
});

$.titleBar.UIInit($, $.getCurrentWindow());
