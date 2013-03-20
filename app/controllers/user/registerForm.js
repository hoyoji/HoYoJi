Alloy.Globals.extendsBaseFormController($, arguments[0]);

var defaultProject = Alloy.createModel("Project", {name : "我的收支", ownerUser : $.$model}).xAddToSave($);
var defaultFriendCategory = Alloy.createModel("FriendCategory", {name : "我的好友", ownerUser : $.$model}).xAddToSave($);
var messageBox = Alloy.createModel("MessageBox", {ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("messageBox", messageBox);
$.$model.xSet("activeProject", defaultProject);
$.$model.xSet("defaultFriendCategory", defaultFriendCategory);
var activeCurrency = Alloy.createModel("Currency", {name : "人民币", symbol : "￥", code : "CNY", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeCurrency", activeCurrency);

var activeMoneyAccount = Alloy.createModel("MoneyAccount", {name : "现金", currency : $.$model.xGet("activeCurrency"), currentBalance : "0", sharingType : "个人", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeMoneyAccount", activeMoneyAccount);

var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory",{name : "日常", project:$.$model.xGet("activeProject")}).xAddToSave($);
$.$model.xGet("activeProject").xSet("defaultIncomeCategory",defaultIncomeCategory);

$.onWindowCloseDo(function(){
	Alloy.Globals.initStore();
})
