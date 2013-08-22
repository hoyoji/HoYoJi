$.attrs = arguments[0] || {};
var activityIndicator;
$.open = function(msg) {
	var style;
	if (OS_IOS) {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	} else {
		style = Ti.UI.ActivityIndicatorStyle.BIG;
	}

	activityIndicator = Ti.UI.createActivityIndicator({
		color : 'white',
		font : {
			fontSize : 16,
			fontWeight : 'bold'
		},
		message : msg,
		style : style,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE
	});
	$.activityView.add(activityIndicator);

	activityIndicator.show();
	$.activityView.open();
};

$.close = function() {
	$.activityView.close();
};

$.showMsg = function(msg) {
	activityIndicator.hide();
	if (!$.msgView) {
		$.msgView = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			layout : "vertical"
		});
		$.activityView.add($.msgView);
	}
	if (!$.msgLabel) {
		$.msgLabel = Ti.UI.createLabel({
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			text : msg,
			color : 'white',
			font : {
				fontSize : 16,
				fontWeight : 'bold'
			}
		});
		$.msgView.add($.msgLabel);
		$.saperatorView = Ti.UI.createView({
			width : 10,
			height : 20
		});
		$.msgView.add($.saperatorView);
	}

	if (!$.confirmButton) {
		$.confirmButton = Ti.UI.createButton({
			title : "确定"
		});
		$.confirmButton.addEventListener("singletap", function() {
			$.close();
		});
		$.msgView.add($.confirmButton);
	}
	$.msgView.show();
};

