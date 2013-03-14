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
    $.__views.__alloyId33 = Ti.UI.createTableViewRow({
        id: "__alloyId33"
    });
    var __alloyId34 = [];
    __alloyId34.push($.__views.__alloyId33);
    $.__views.__alloyId35 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级分类",
        hintText: "请选择上级分类",
        bindModel: "$.$model",
        bindAttribute: "parentIncomeCategory",
        bindAttributeIsModel: "name",
        bindModelSelector: "money/moneyIncomeCategoryAll",
        bindModelSelectorParams: "selectedProject:project",
        id: "__alloyId35"
    });
    $.__views.__alloyId35.setParent($.__views.__alloyId33);
    $.__views.__alloyId36 = Ti.UI.createTableViewRow({
        id: "__alloyId36"
    });
    __alloyId34.push($.__views.__alloyId36);
    $.__views.__alloyId37 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "分类名称",
        hintText: "请输入分类名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId37"
    });
    $.__views.__alloyId37.setParent($.__views.__alloyId36);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId34,
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