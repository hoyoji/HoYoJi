function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyExpenseCategoryForm = Ti.UI.createView({
        backgroundColor: "white",
        saveableContainer: "true",
        width: "100%",
        height: "100%",
        id: "moneyExpenseCategoryForm"
    });
    $.addTopLevelView($.__views.moneyExpenseCategoryForm);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        addModeTitle: "新增支出分类",
        readModeTitle: "支出分类",
        editModeTitle: "修改支出分类"
    });
    $.__views.titleBar.setParent($.__views.moneyExpenseCategoryForm);
    $.__views.__alloyId45 = Ti.UI.createTableViewRow({
        id: "__alloyId45"
    });
    var __alloyId46 = [];
    __alloyId46.push($.__views.__alloyId45);
    $.__views.__alloyId47 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级分类",
        hintText: "请选择上级分类",
        bindModel: "$.$model",
        bindAttribute: "parentExpenseCategory",
        bindAttributeIsModel: "name",
        bindModelSelector: "money/moneyExpenseCategoryAll",
        bindModelSelectorParams: "selectedProject:project",
        id: "__alloyId47"
    });
    $.__views.__alloyId47.setParent($.__views.__alloyId45);
    $.__views.__alloyId48 = Ti.UI.createTableViewRow({
        id: "__alloyId48"
    });
    __alloyId46.push($.__views.__alloyId48);
    $.__views.__alloyId49 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "分类名称",
        hintText: "请输入分类名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId49"
    });
    $.__views.__alloyId49.setParent($.__views.__alloyId48);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId46,
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.moneyExpenseCategoryForm.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;