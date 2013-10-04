$.attrs = arguments[0] || {};

if (OS_ANDROID) {
	$.getView().addEventListener('androidback', function() {
	});
}

var activityIndicator, stepLabels;
$.open = function(msg, steps) {
	var style, indicatorTop;

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

	$.centerView.add(activityIndicator);
	activityIndicator.show();
	
	if (steps) {	
		stepLabels = [];
		for(var i = 0; i < steps.length; i++){
			var stepLabel = Ti.UI.createLabel({
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				// textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				text : steps[i],
				color : 'white',
				font : {
					fontSize : 16,
					fontWeight : 'bold'
				},
				wordWrap : false
			});
			stepLabels.push(stepLabel);
			$.centerView.add(stepLabel);
		}
	}

	$.activityView.open();
};

$.progressFinish = function(msg){
	activityIndicator.hide();
	stepLabels[stepLabels.length-1].setColor('white');
	_addMsgView($.centerView, msg);
};

$.progressStep = function(number, msg) {
	stepLabels[number-1].setColor('cyan');
	if(msg){
		stepLabels[number-1].setText(msg);
	}
	if(number-2 >= 0){
		stepLabels[number-2].setColor('white');
	}
};

$.progressMsg = function(msg) {
	activityIndicator.setMessage(msg);
};

$.close = function() {
	$.activityView.close();
};

$.showMsg = function(msg, closeCallback) {
	activityIndicator.hide();
	$.centerView.hide();
	_addMsgView($.activityView, msg, closeCallback);
};

function _addMsgView(container, msg, closeCallback){
	if (!$.msgView) {
		$.msgView = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			layout : "vertical"
		});
		container.add($.msgView);
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
			if(closeCallback){
				closeCallback();
			}
			$.close();
		});
	}
	$.msgView.add($.confirmButton);
}
