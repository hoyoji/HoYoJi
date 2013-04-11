Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function(){
	$.showHideAuthorization.hide();
});

$.allAuthorization.addEventListener("click",function(e){
	if($.showHideAuthorization.getVisible()){
		$.showHideAuthorization.hide();
		e.source.setTitle("打开详细权限");
	}else{
		$.showHideAuthorization.show();
		e.source.setTitle("关闭详细权限");
	}
});