function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyIncomeCategoryForm = Ti.UI.createView({
        backgroundColor: "white",
        saveableContainer: "true",
        width: "100%",
        height: "100%",
        id: "moneyIncomeCategoryForm"
    });
    $.addTopLevelView($.__views.moneyIncomeCategoryForm);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        addModeTitle: "新增收入分类",
        readModeTitle: "收入分类",
        editModeTitle: "修改收入分类"
    });
    $.__views.titleBar.setParent($.__views.moneyIncomeCategoryForm);
    $.__views.__alloyId38 = Ti.UI.createTableViewRow({
        id: "__alloyId38"
    });
    var __alloyId39 = [];
    __alloyId39.push($.__views.__alloyId38);
    $.__views.__alloyId40 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级分类",
        hintText: "请选择上级分类",
        bindModel: "$.$model",
        bindAttribute: "parentIncomeCategory",
        bindAttributeIsModel: "name",
        bindModelSelector: "money/moneyIncomeCategoryAll",
        bindModelSelectorParams: "selectedProject:project",
        id: "__alloyId40"
    });
    $.__views.__alloyId40.setParent($.__views.__alloyId38);
    $.__views.__alloyId41 = Ti.UI.createTableViewRow({
        id: "__alloyId41"
    });
    __alloyId39.push($.__views.__alloyId41);
    $.__views.__alloyId42 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "分类名称",
        hintText: "请输入分类名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId42"
    });
    $.__views.__alloyId42.setParent($.__views.__alloyId41);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId39,
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.moneyIncomeCategoryForm.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;