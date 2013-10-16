Alloy.Globals.extendsBaseViewController($, arguments[0]);

var onFooterbarTap = function(e) {
	if (e.source.id === "commit") {
		sendEmail();
	}
};

function sendEmail(){
	
}

$.titleBar.UIInit($, $.getCurrentWindow());