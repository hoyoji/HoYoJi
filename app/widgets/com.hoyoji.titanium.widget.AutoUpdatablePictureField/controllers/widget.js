Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var mainPicture = null;

// $.pictures = [];

$.field.addEventListener("singletap", function() {
	Ti.Media.showCamera({
		success : function(event) {
			var image = event.media;

			Ti.API.debug('Our type was: ' + event.mediaType);
			if (event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
				var imageView = Ti.UI.createImageView({
					width : 56,
					height : 56,
					top : 2,
					left : 2,
					right : 2,
					image : event.media
				});
				$.picturesContainer.add(imageView);
				
				var newPicture = Alloy.createModel("Picture", {
					// path : "TEXT NOT NULL",
				    recordId : $.$attrs.bindModel.xGet("id"),
				    recordType : $.$attrs.bindModel.config.adapter.collection_name
				}).xAddToSave($.getParentController());
				newPicture.once("sync", function(newPicture){
					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 
						newPicture.xGet("id") + "_icon.png");
						f.write(imageView.toImage());
						f = null;
						f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 
						newPicture.xGet("id") + ".png");
						f.write(imageView.toBlob());
						f = null;
				});
				// $.pictures.push(newPicture);
				if(!mainPicture){
					mainPicture = newPicture;
					$.setValue(newPicture, event.media);
   	 				$.field.fireEvent("change");
				}
				
			} else {
				alert("不支持视频");
			}
		},
		cancel : function() {
			alert('You canceled the action.');
		},
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
    if(image){
		$.field.setImage(image);    	
    } else {
	    if(!value){
	    	value = WPATH("/images/takePicture.png");
	    } else {
	    	value = Ti.Filesystem.applicationDataDirectory + value + "_icon.png"
	    }
	    $.field.setImage(value);
    }
};

