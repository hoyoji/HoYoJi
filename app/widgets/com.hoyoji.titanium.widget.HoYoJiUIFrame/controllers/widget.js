var attrs = arguments[0] || {};
if(attrs.hasFooter === "false"){
	$.footerBar.hide();
	$.footerBar.setTop("100%");
}

if(attrs.hasHeader === "false"){
	$.headerBar.hide();
	$.headerBar.setTop("100%");
}

exports.showHeader = function(){
	$.headerBar.show();
};

exports.hideHeader = function(){
	$.headerBar.hide();
};

exports.showFooter = function(){
	$.footerBar.show();
};

exports.hideFooter = function(){
	$.footerBar.hide();
};