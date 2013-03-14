Alloy.Globals.extendsBaseFormController($, arguments[0]);

var defaultProject = Alloy.createModel("Project", {name : "我的收支", ownerUser : $.$model}).xAddToSave($);
var defaultFriendCategory = Alloy.createModel("FriendCategory", {name : "我的好友", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeProject", defaultProject);
$.$model.xSet("defaultFriendCategory", defaultFriendCategory);

$.onWindowCloseDo(function(){
	Alloy.Globals.initStore();
})