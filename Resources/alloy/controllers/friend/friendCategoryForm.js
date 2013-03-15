function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.friendCategoryForm = Ti.UI.createView({
        backgroundColor: "white",
        saveableContainer: "true",
        width: "100%",
        height: "100%",
        id: "friendCategoryForm"
    });
    $.addTopLevelView($.__views.friendCategoryForm);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        addModeTitle: "新增好友分类",
        readModeTitle: "好友分类资料",
        editModeTitle: "修改好友分类"
    });
    $.__views.titleBar.setParent($.__views.friendCategoryForm);
    $.__views.__alloyId38 = Ti.UI.createTableViewRow({
        id: "__alloyId38"
    });
    var __alloyId39 = [];
    __alloyId39.push($.__views.__alloyId38);
    $.__views.__alloyId40 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级好友分类",
        hintText: "请选择上级好友分类",
        bindModel: "$.$model",
        bindAttribute: "parentFriendCategory",
        bindAttributeIsModel: "name",
        bindModelSelector: "friend/friendAll",
        id: "__alloyId40"
    });
    $.__views.__alloyId40.setParent($.__views.__alloyId38);
    $.__views.__alloyId41 = Ti.UI.createTableViewRow({
        id: "__alloyId41"
    });
    __alloyId39.push($.__views.__alloyId41);
    $.__views.__alloyId42 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "好友分类名称",
        hintText: "请输入好友分类名称",
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
    $.__views.friendCategoryForm.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;