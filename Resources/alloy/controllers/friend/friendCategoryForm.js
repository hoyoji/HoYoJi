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
        readModeTitle: "好友分类",
        editModeTitle: "修改好友分类"
    });
    $.__views.titleBar.setParent($.__views.friendCategoryForm);
    $.__views.table = Ti.UI.createScrollView({
        layout: "vertical",
        scrollType: "vertical",
        disableBounce: "true",
        id: "table",
        bottom: "0",
        top: "42"
    });
    $.__views.friendCategoryForm.add($.__views.table);
    $.__views.__alloyId38 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "上级分类",
        hintText: "请选择上级分类",
        bindModel: "$.$model",
        bindAttribute: "parentFriendCategory",
        bindAttributeIsModel: "name",
        bindModelSelector: "friend/friendAll",
        id: "__alloyId38"
    });
    $.__views.__alloyId38.setParent($.__views.table);
    $.__views.__alloyId39 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        labelText: "分类名称",
        hintText: "请输入分类名称",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId39"
    });
    $.__views.__alloyId39.setParent($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;