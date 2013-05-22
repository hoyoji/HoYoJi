Alloy.Globals.extendsBaseViewController($, arguments[0]);

function confirm(){
	$.getCurrentWindow().$attrs.selectorCallback($.textField.getValue());
	$.getCurrentWindow().close();
}

function close(){
	$.getCurrentWindow().close();
}

$.onWindowOpenDo(function() {
	if($.getCurrentWindow().$attrs.title){
		$.title.setText("请输入" + $.getCurrentWindow().$attrs.title);
	}
	$.textField.setValue($.getCurrentWindow().$attrs.field.getValue());
	// $.textField.addEventListener("singletap", confirm);
	$.textField.focus();
});
