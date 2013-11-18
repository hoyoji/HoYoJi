Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.setSelected = function(selected){
	if(selected){
		$.nickName.$view.setColor("blue");
	}
};

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "好友操作"});
	menuSection.add($.createContextMenuItem("好友资料", function() {
		Alloy.Globals.openWindow("friend/friendForm", {
			$model : $.$model
		});
	}, isSelectMode));
	menuSection.add($.createContextMenuItem("删除好友", function() {
		$.deleteModel();
	}, isSelectMode));
	return menuSection;
};

$.onRowTap = function(){
	Alloy.Globals.openWindow("money/moneyAll", {
		queryFilter : {
			friend : $.$model
		}
	});
	return false;
};

$.getChildTitle = function() {
	return $.$model.xGet("friendUser").xGet("userName");
};

// $.userName.UIInit($, $.getCurrentWindow());
$.nickName.UIInit($, $.getCurrentWindow());
$.picture.UIInit($, $.getCurrentWindow());	
