Alloy.Globals.extendsBaseFormController($, arguments[0]);

var defaultProject = Alloy.createModel("Project", {name : "我的收支", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeProject", defaultProject);

$.onWindowCloseDo(function(){
	Alloy.Globals.initStore();
})
