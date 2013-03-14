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
    $.__views.__alloyId20 = Ti.UI.createTableViewRow({
        id: "__alloyId20"
    });
    var __alloyId21 = [];
    __alloyId21.push($.__views.__alloyId20);
    $.__views.__alloyId22 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级好友分类",
        hintText: "请选择上级好友分类",
        bindModel: "$.$model",
        bindAttribute: "parentFriendCategory",
        bindAttributeIsModel: "name",
        bindModelSelector: "friend/friendCategoryAll",
        id: "__alloyId22"
    });
    $.__views.__alloyId22.setParent($.__views.__alloyId20);
    $.__views.__alloyId23 = Ti.UI.createTableViewRow({
        id: "__alloyId23"
    });
    __alloyId21.push($.__views.__alloyId23);
    $.__views.__alloyId24 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "好友分类名称",
        hintText: "请输入好友分类名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId24"
    });
    $.__views.__alloyId24.setParent($.__views.__alloyId23);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId21,
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