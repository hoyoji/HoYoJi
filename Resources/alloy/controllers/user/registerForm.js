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
    $.__views.__alloyId71 = Ti.UI.createTableViewRow({
        id: "__alloyId71"
    });
    var __alloyId72 = [];
    __alloyId72.push($.__views.__alloyId71);
    $.__views.__alloyId73 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "用户名",
        hintText: "请输入用户名",
        keyboardType: Ti.UI.KEYBOARD_ASCII,
        editModeEditability: "noneditable",
        bindModel: "$.$model",
        bindAttribute: "userName",
        id: "__alloyId73"
    });
    $.__views.__alloyId73.setParent($.__views.__alloyId71);
    $.__views.__alloyId74 = Ti.UI.createTableViewRow({
        id: "__alloyId74"
    });
    __alloyId72.push($.__views.__alloyId74);
    $.__views.__alloyId75 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "密码",
        hintText: "请输入密码",
        passwordMask: "true",
        bindModel: "$.$model",
        bindAttribute: "password",
        id: "__alloyId75"
    });
    $.__views.__alloyId75.setParent($.__views.__alloyId74);
    $.__views.__alloyId76 = Ti.UI.createTableViewRow({
        id: "__alloyId76"
    });
    __alloyId72.push($.__views.__alloyId76);
    $.__views.__alloyId77 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "确认密码",
        hintText: "请再次输入密码",
        passwordMask: "true",
        bindModel: "$.$model",
        bindAttribute: "password2",
        id: "__alloyId77"
    });
    $.__views.__alloyId77.setParent($.__views.__alloyId76);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId72,
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