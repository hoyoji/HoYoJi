Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.onWindowOpenDo(function(){
	if ($.getCurrentWindow().$attrs.image) {
		$.image.setImage($.getCurrentWindow().$attrs.image);
	}
});