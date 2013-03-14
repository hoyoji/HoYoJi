function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.registerForm = Ti.UI.createView({
        backgroundColor: "white",
        saveableContainer: "true",
        width: "100%",
        height: "100%",
        id: "registerForm"
    });
    $.addTopLevelView($.__views.registerForm);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        addModeTitle: "注册用户",
        readModeTitle: "用户资料",
        editModeTitle: "修改用户"
    });
    $.__views.titleBar.setParent($.__views.registerForm);
<<<<<<< HEAD
    $.__views.__alloyId48 = Ti.UI.createTableViewRow({
        id: "__alloyId48"
    });
    var __alloyId49 = [];
    __alloyId49.push($.__views.__alloyId48);
    $.__views.__alloyId50 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
    $.__views.__alloyId47 = Ti.UI.createTableViewRow({
        id: "__alloyId47"
    });
    var __alloyId48 = [];
    __alloyId48.push($.__views.__alloyId47);
    $.__views.__alloyId49 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> f26637615d92b5ad2345da662d510d9dc4427f16
        labelText: "用户名",
        hintText: "请输入用户名",
        editModeEditability: "noneditable",
        bindModel: "$.$model",
        bindAttribute: "userName",
<<<<<<< HEAD
        id: "__alloyId50"
    });
    $.__views.__alloyId50.setParent($.__views.__alloyId48);
    $.__views.__alloyId51 = Ti.UI.createTableViewRow({
        id: "__alloyId51"
    });
    __alloyId49.push($.__views.__alloyId51);
    $.__views.__alloyId52 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
        id: "__alloyId49"
    });
    $.__views.__alloyId49.setParent($.__views.__alloyId47);
    $.__views.__alloyId50 = Ti.UI.createTableViewRow({
        id: "__alloyId50"
    });
    __alloyId48.push($.__views.__alloyId50);
    $.__views.__alloyId51 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> f26637615d92b5ad2345da662d510d9dc4427f16
        labelText: "密码",
        hintText: "请输入密码",
        passwordMask: "true",
        bindModel: "$.$model",
        bindAttribute: "password",
<<<<<<< HEAD
        id: "__alloyId52"
    });
    $.__views.__alloyId52.setParent($.__views.__alloyId51);
    $.__views.__alloyId53 = Ti.UI.createTableViewRow({
        id: "__alloyId53"
    });
    __alloyId49.push($.__views.__alloyId53);
    $.__views.__alloyId54 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
        id: "__alloyId51"
    });
    $.__views.__alloyId51.setParent($.__views.__alloyId50);
    $.__views.__alloyId52 = Ti.UI.createTableViewRow({
        id: "__alloyId52"
    });
    __alloyId48.push($.__views.__alloyId52);
    $.__views.__alloyId53 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> f26637615d92b5ad2345da662d510d9dc4427f16
        labelText: "确认密码",
        hintText: "请再次输入密码",
        passwordMask: "true",
        bindModel: "$.$model",
        bindAttribute: "password2",
<<<<<<< HEAD
        id: "__alloyId54"
    });
    $.__views.__alloyId54.setParent($.__views.__alloyId53);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId49,
=======
        id: "__alloyId53"
    });
    $.__views.__alloyId53.setParent($.__views.__alloyId52);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId48,
>>>>>>> f26637615d92b5ad2345da662d510d9dc4427f16
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.registerForm.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    var defaultProject = Alloy.createModel("Project", {
        name: "我的收支",
        ownerUser: $.$model
    }).xAddToSave($), defaultFriendCategory = Alloy.createModel("FriendCategory", {
        name: "我的好友",
        ownerUser: $.$model
    }).xAddToSave($);
    $.$model.xSet("activeProject", defaultProject);
    $.$model.xSet("defaultFriendCategory", defaultFriendCategory);
    $.onWindowCloseDo(function() {
        Alloy.Globals.initStore();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;