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
    $.__views.__alloyId53 = Ti.UI.createTableViewRow({
        id: "__alloyId53"
    });
    var __alloyId54 = [];
    __alloyId54.push($.__views.__alloyId53);
    $.__views.__alloyId55 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
    $.__views.table = Ti.UI.createScrollView({
        layout: "vertical",
        disableBounce: "true",
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.registerForm.add($.__views.table);
    $.__views.__alloyId68 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
        labelText: "用户名",
        hintText: "请输入用户名",
        keyboardType: Ti.UI.KEYBOARD_ASCII,
        editModeEditability: "noneditable",
        bindModel: "$.$model",
        bindAttribute: "userName",
<<<<<<< HEAD
        id: "__alloyId55"
    });
    $.__views.__alloyId55.setParent($.__views.__alloyId53);
    $.__views.__alloyId56 = Ti.UI.createTableViewRow({
        id: "__alloyId56"
    });
    __alloyId54.push($.__views.__alloyId56);
    $.__views.__alloyId57 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
        id: "__alloyId68"
    });
    $.__views.__alloyId68.setParent($.__views.table);
    $.__views.__alloyId69 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
        labelText: "密码",
        hintText: "请输入密码",
        passwordMask: "true",
        bindModel: "$.$model",
        bindAttribute: "password",
<<<<<<< HEAD
        id: "__alloyId57"
    });
    $.__views.__alloyId57.setParent($.__views.__alloyId56);
    $.__views.__alloyId58 = Ti.UI.createTableViewRow({
        id: "__alloyId58"
    });
    __alloyId54.push($.__views.__alloyId58);
    $.__views.__alloyId59 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
        id: "__alloyId69"
    });
    $.__views.__alloyId69.setParent($.__views.table);
    $.__views.__alloyId70 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
        labelText: "确认密码",
        hintText: "请再次输入密码",
        passwordMask: "true",
        bindModel: "$.$model",
        bindAttribute: "password2",
<<<<<<< HEAD
        id: "__alloyId59"
    });
    $.__views.__alloyId59.setParent($.__views.__alloyId58);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId54,
        id: "table",
        bottom: "0",
        top: "42"
=======
        id: "__alloyId70"
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
    });
    $.__views.__alloyId70.setParent($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    var defaultProject = Alloy.createModel("Project", {
        name: "我的收支",
        ownerUser: $.$model
    }).xAddToSave($), defaultFriendCategory = Alloy.createModel("FriendCategory", {
        name: "我的好友",
        ownerUser: $.$model
    }).xAddToSave($), messageBox = Alloy.createModel("MessageBox", {
        ownerUser: $.$model
    }).xAddToSave($);
    $.$model.xSet("messageBox", messageBox);
    $.$model.xSet("activeProject", defaultProject);
    $.$model.xSet("defaultFriendCategory", defaultFriendCategory);
    $.onWindowCloseDo(function() {
        Alloy.Globals.initStore();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;