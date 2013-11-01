Alloy.Globals.extendsBaseViewController($, arguments[0]);

function confirm(){
	$.getCurrentWindow().$attrs.selectorCallback($.textField.getValue());
	$.getCurrentWindow().close();
}

function close(){
	$.getCurrentWindow().close();
}

$.confirm.addEventListener("singletap", confirm);
$.close.addEventListener("singletap", close);

// $.onWindowOpenDo(function() {
	if($.getCurrentWindow().$attrs.title){
		$.title.setText("请输入" + $.getCurrentWindow().$attrs.title);
	}
	// $.textField.addEventListener("singletap", confirm);
// });

$.getCurrentWindow().$view.addEventListener("open", function(){
	$.textField.setValue($.getCurrentWindow().$attrs.field.getValue());
		if(OS_ANDROID){
			if($.textField.setSelection){
				var len = $.textField.getValue().length;
				$.textField.setSelection(len, len);
			}
			$.textField.focus();
		} else {
			setTimeout(function(){
				$.textField.focus();
			},500);
		}
});

$.textField.addEventListener("longpress", function(e){
	e.cancelBubble = true;
	return false;
});
