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
    $.__views.__alloyId27 = Ti.UI.createTableViewRow({
        id: "__alloyId27"
    });
    var __alloyId28 = [];
    __alloyId28.push($.__views.__alloyId27);
    $.__views.__alloyId29 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级分类",
        hintText: "请选择上级分类",
        bindModel: "$.$model",
        bindAttribute: "parentExpenseCategory",
        bindAttributeIsModel: "name",
        bindModelSelector: "money/moneyExpenseCategoryAll",
        bindModelSelectorParams: "selectedProject:project",
        id: "__alloyId29"
    });
    $.__views.__alloyId29.setParent($.__views.__alloyId27);
    $.__views.__alloyId30 = Ti.UI.createTableViewRow({
        id: "__alloyId30"
    });
    __alloyId28.push($.__views.__alloyId30);
    $.__views.__alloyId31 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "分类名称",
        hintText: "请输入分类名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId31"
    });
    $.__views.__alloyId31.setParent($.__views.__alloyId30);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId28,
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