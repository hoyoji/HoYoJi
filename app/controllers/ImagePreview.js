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

// <View>
// <ScrollView platform="ios" id="scrollView" minZoomScale="0.1" maxZoomScale="10" >
// <ImageView id="image" width="Ti.UI.SIZE" height="Ti.UI.SIZE"/>
// </ScrollView>
// <ImageView id="image" platform="android" width="Ti.UI.SIZE" height="Ti.UI.SIZE" canScale="true" enableZoomControls="true"/>
// </View>
function createPage(currentImage){
		var filePath, fileName = currentImage.xGet("id") + "." + currentImage.xGet("pictureType");
		if (OS_IOS) {
			var scrollView = Ti.UI.createScrollView({
				id : "scrollView",
				minZoomScale : 0.1,
				maxZoomScale : 10
			});
			var image = Ti.UI.createImageView({
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE
			});
			scrollView.add(image);
			$.body.addView(scrollView);
			if (currentImage.isNew()) {
				filePath = Ti.Filesystem.tempDirectory;
			} else {
				filePath = Ti.Filesystem.applicationDataDirectory;
			}
		}
		if (OS_ANDROID) {
			var view = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : Ti.UI.FILL
			});
			var image = Ti.UI.createImageView({
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				canScale : true,
				enableZoomControls : true
			});
			view.add(image);
			$.body.addView(view);
			if (currentImage.isNew()) {
				filePath = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory).nativePath + "/";
			} else {
				filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/";
			}
		}
		var f = Ti.Filesystem.getFile(filePath, fileName);
		if (f.exists()) {
			if(OS_IOS){
				var zoomScale = Math.min($.$view.getSize().width/f.getBlob().width, $.$view.getSize().height/f.getBlob().height);
				scrollView.setZoomScale(zoomScale);
			}
			
			f = null;
			image.setImage(filePath + fileName);
		} else {
			f = null;
			image.setImage(filePath + currentImage.xGet("id") + "_icon." + currentImage.xGet("pictureType"));
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

			Alloy.Globals.Server.fetchImage(currentImage.xGet("id"), function() {
				var f = Ti.Filesystem.getFile(filePath, fileName);
				if (f.exists()) {
					if(OS_IOS){
						var zoomScale = Math.min($.$view.getSize().width/f.getBlob().width, $.$view.getSize().height/f.getBlob().height);
						scrollView.setZoomScale(zoomScale);
					}
					f = null;
					image.setImage(filePath + fileName);
				}
				$.titleBar.hideActivityIndicator();
				$.titleBar.setTitle("图片预览");
			}, function(e) {
				alert("下载图片错误：" + e.__summary.msg);
				$.titleBar.hideActivityIndicator();
				$.titleBar.setTitle("图片预览");
			}, $.$attrs.fetchImageTarget, filePath);
		}
}

$.onWindowOpenDo(function() {
	if($.getCurrentWindow().$attrs.images){
		for(var i = 0; i < $.getCurrentWindow().$attrs.images.length; i++){
			var image = $.getCurrentWindow().$attrs.images.at ? $.getCurrentWindow().$attrs.images.at(i) : $.getCurrentWindow().$attrs.images[i];
			createPage(image);
			if(image === $.getCurrentWindow().$attrs.image){
				$.body.setCurrentPage(i);
			}
		}
	} else if ($.getCurrentWindow().$attrs.image) {
		createPage($.getCurrentWindow().$attrs.image);
	}
});

$.titleBar.UIInit($, $.getCurrentWindow());
