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
    $.__views.__alloyId39 = Ti.UI.createTableViewRow({
        id: "__alloyId39"
    });
    var __alloyId40 = [];
    __alloyId40.push($.__views.__alloyId39);
    $.__views.__alloyId41 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级项目",
        hintText: "请选择上级项目",
        bindModel: "$.$model",
        bindAttribute: "parentProject",
        bindAttributeIsModel: "name",
        bindModelSelector: "project/projectAll",
        id: "__alloyId41"
    });
    $.__views.__alloyId41.setParent($.__views.__alloyId39);
    $.__views.__alloyId42 = Ti.UI.createTableViewRow({
        id: "__alloyId42"
    });
    __alloyId40.push($.__views.__alloyId42);
    $.__views.__alloyId43 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "项目名称",
        hintText: "请输入项目名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId43"
    });
    $.__views.__alloyId43.setParent($.__views.__alloyId42);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId40,
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.projectForm.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;