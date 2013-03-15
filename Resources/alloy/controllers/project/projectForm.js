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
    $.__views.table = Ti.UI.createScrollView({
        layout: "vertical",
        scrollType: "vertical",
        disableBounce: "true",
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.projectForm.add($.__views.table);
    $.__views.__alloyId62 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级项目",
        hintText: "请选择上级项目",
        bindModel: "$.$model",
        bindAttribute: "parentProject",
        bindAttributeIsModel: "name",
        bindModelSelector: "project/projectAll",
        id: "__alloyId62"
    });
    $.__views.__alloyId62.setParent($.__views.table);
    $.__views.__alloyId63 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "项目名称",
        hintText: "请输入项目名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId63"
    });
    $.__views.__alloyId63.setParent($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;