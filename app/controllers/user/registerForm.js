Alloy.Globals.extendsBaseFormController($, arguments[0]);

var defaultProject = Alloy.createModel("Project", {name : "我的收支", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeProject", defaultProject);

var defaultCurrency = Alloy.createModel("Currency", {name : "人民币", symbol : "￥", code : "CNY", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeCurrency", defaultCurrency);

$.onWindowCloseDo(function(){
	Alloy.Globals.initStore();
})
