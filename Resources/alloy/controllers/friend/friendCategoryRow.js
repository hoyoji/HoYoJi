function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.friendCategoryRow = Ti.UI.createView({
        backgroundColor: "white",
        height: "42",
        openForm: "friend/friendCategoryForm",
        hasChild: "subFriendCategories",
        collapsible: "true",
        id: "friendCategoryRow"
    });
    $.addTopLevelView($.__views.friendCategoryRow);
    $.__views.content = Ti.UI.createView({
        id: "content",
        height: Ti.UI.FILL
    });
    $.__views.friendCategoryRow.add($.__views.content);
    $.__views.__alloyId43 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
        top: "0",
        width: Ti.UI.SIZE,
        height: "42",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId43"
    });
    $.__views.__alloyId43.setParent($.__views.content);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection({
            headerTitle: "好友分类操作"
        });
        menuSection.add($.createContextMenuItem("删除好友分类", function() {
            $.deleteModel();
        }));
        menuSection.add($.createContextMenuItem("新增子分类", function() {
            Alloy.Globals.openWindow("friend/friendCategoryForm", {
                $model: "FriendCategory",
                saveableMode: "add",
                data: {
                    parentFriendCategory: $.$model
                }
            });
        }));
        return menuSection;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;