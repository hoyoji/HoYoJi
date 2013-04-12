Alloy.Globals.extendsBaseFormController($, arguments[0]);

var projectShareData = JSON.parse($.$model.xGet("messageData"));
$.projectShareAuthorizations = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
		id : projectShareData.projectShareAuthorizationId
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

$.onWindowOpenDo(function() {
	$.showHideAuthorization.hide();
});