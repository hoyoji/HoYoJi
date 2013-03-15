function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.projectForm = Ti.UI.createView({
        backgroundColor: "white",
        saveableContainer: "true",
        width: "100%",
        height: "100%",
        id: "projectForm"
    });
    $.addTopLevelView($.__views.projectForm);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        addModeTitle: "新增项目",
        readModeTitle: "项目资料",
        editModeTitle: "修改项目"
    });
    $.__views.titleBar.setParent($.__views.projectForm);
<<<<<<< HEAD
    $.__views.__alloyId44 = Ti.UI.createTableViewRow({
        id: "__alloyId44"
    });
    var __alloyId45 = [];
    __alloyId45.push($.__views.__alloyId44);
    $.__views.__alloyId46 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
    $.__views.table = Ti.UI.createScrollView({
        layout: "vertical",
        disableBounce: "true",
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.projectForm.add($.__views.table);
    $.__views.__alloyId62 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
        labelText: "上级项目",
        hintText: "请选择上级项目",
        bindModel: "$.$model",
        bindAttribute: "parentProject",
        bindAttributeIsModel: "name",
        bindModelSelector: "project/projectAll",
<<<<<<< HEAD
        id: "__alloyId46"
    });
    $.__views.__alloyId46.setParent($.__views.__alloyId44);
    $.__views.__alloyId47 = Ti.UI.createTableViewRow({
        id: "__alloyId47"
    });
    __alloyId45.push($.__views.__alloyId47);
    $.__views.__alloyId48 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
=======
        id: "__alloyId62"
    });
    $.__views.__alloyId62.setParent($.__views.table);
    $.__views.__alloyId63 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
        labelText: "项目名称",
        hintText: "请输入项目名称",
        bindModel: "$.$model",
        bindAttribute: "name",
<<<<<<< HEAD
        id: "__alloyId48"
    });
    $.__views.__alloyId48.setParent($.__views.__alloyId47);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId45,
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.projectForm.add($.__views.table);
=======
        id: "__alloyId63"
    });
    $.__views.__alloyId63.setParent($.__views.table);
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;