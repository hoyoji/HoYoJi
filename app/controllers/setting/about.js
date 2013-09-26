Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.currentVersionNumber.setText(Ti.App.version);

function checkUpdate() {

}

function openWebAddress() {
	Titanium.Platform.openURL("http://www.hoyoji.com");
}

function sendEmail() {
	var emailDialog = Ti.UI.createEmailDialog();
	// emailDialog.subject = "";
	emailDialog.toRecipients = ['support@hoyoji.com'];
	// emailDialog.messageBody = '';
	// var f = Ti.Filesystem.getFile('cricket.wav');
	// emailDialog.addAttachment(f);
	emailDialog.open();
}

function openSinaBlog() {
	Titanium.Platform.openURL("http://weibo.com/hoyoji");
}

function openQqBlog() {
	Titanium.Platform.openURL("http://weibo.com/hoyoji");
}
