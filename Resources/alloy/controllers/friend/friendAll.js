function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.friendAll = Ti.UI.createView({
        title: "好友",
        backgroundColor: "cyan",
        id: "friendAll"
    });
    $.addTopLevelView($.__views.friendAll);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "好友"
    });
    $.__views.titleBar.setParent($.__views.friendAll);
    $.__views.friendCategoriesTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
        id: "friendCategoriesTable",
        bottom: "42",
        top: "42"
    });
    $.__views.friendCategoriesTable.setParent($.__views.friendAll);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection();
        menuSection.add($.createContextMenuItem("新增好友分类", function() {
            Alloy.Globals.openWindow("friend/friendCategoryForm", {
                $model: "FriendCategory",
                saveableMode: "add"
            });
        }));
        menuSection.add($.createContextMenuItem("添加好友", function() {
            Alloy.Globals.openWindow("friend/friendSearchAll");
        }));
        return menuSection;
    };
    $.titleBar.bindXTable($.friendCategoriesTable);
    var collection = Alloy.Models.User.xGet("friendCategories").xCreateFilter({
        parentFriendCategory: null
    });
    $.friendCategoriesTable.addCollection(collection);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;