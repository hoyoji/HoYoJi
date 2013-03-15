function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.currencyForm = Ti.UI.createView({
        backgroundColor: "white",
        saveableContainer: "true",
        width: "100%",
        height: "100%",
        id: "currencyForm"
    });
    $.addTopLevelView($.__views.currencyForm);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        addModeTitle: "新增币种",
        readModeTitle: "币种详细",
        editModeTitle: "修改币种"
    });
    $.__views.titleBar.setParent($.__views.currencyForm);
    $.__views.__alloyId50 = Ti.UI.createTableViewRow({
        id: "__alloyId50"
    });
    var __alloyId51 = [];
    __alloyId51.push($.__views.__alloyId50);
    $.__views.__alloyId52 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "币种名称",
        hintText: "请输入币种名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId52"
    });
    $.__views.__alloyId52.setParent($.__views.__alloyId50);
    $.__views.__alloyId53 = Ti.UI.createTableViewRow({
        id: "__alloyId53"
    });
    __alloyId51.push($.__views.__alloyId53);
    $.__views.__alloyId54 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "币种符号",
        hintText: "请输入币种符号",
        bindModel: "$.$model",
        bindAttribute: "symbol",
        id: "__alloyId54"
    });
    $.__views.__alloyId54.setParent($.__views.__alloyId53);
    $.__views.__alloyId55 = Ti.UI.createTableViewRow({
        id: "__alloyId55"
    });
    __alloyId51.push($.__views.__alloyId55);
    $.__views.__alloyId56 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "币种代号",
        hintText: "请输入币种代号",
        bindModel: "$.$model",
        bindAttribute: "code",
        id: "__alloyId56"
    });
    $.__views.__alloyId56.setParent($.__views.__alloyId55);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId51,
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.currencyForm.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;