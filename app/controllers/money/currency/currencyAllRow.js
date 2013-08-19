Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(){
	var currency = Alloy.createModel("Currency").xFindInDb({ id : $.$model.xGet("id")});
	if(!currency.id){
		delete $.$model.id; // add it as new record
		$.$model.xSet("ownerUser", Alloy.Models.User);
		$.$model.xSet("ownerUserId", Alloy.Models.User.id);
		$.$model.save();
		alert("币种添加成功");
		$.getCurrentWindow().close();
	} else {
		alert("币种已经存在，不能重复添加");
	}
	
	return false;
};


$.name.UIInit($, $.getCurrentWindow());
$.symbol.UIInit($, $.getCurrentWindow());
$.code.UIInit($, $.getCurrentWindow());