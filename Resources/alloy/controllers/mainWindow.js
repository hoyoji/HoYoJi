function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.mainWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        navBarHidden: "true",
        id: "mainWindow"
    });
    $.addTopLevelView($.__views.mainWindow);
    $.__views.tabBar = Alloy.createWidget("com.hoyoji.titanium.widget.ScrollableViewTabBar", "widget", {
        id: "tabBar"
    });
    $.__views.tabBar.setParent($.__views.mainWindow);
    var __alloyId14 = [];
    $.__views.__alloyId15 = Alloy.createController("message/messageAll", {
        id: "__alloyId15"
    });
    __alloyId14.push($.__views.__alloyId15.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId16 = Alloy.createController("money/moneyAll", {
        id: "__alloyId16"
    });
    __alloyId14.push($.__views.__alloyId16.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId17 = Alloy.createController("home/home", {
        id: "__alloyId17"
    });
    __alloyId14.push($.__views.__alloyId17.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId18 = Alloy.createController("friend/friendAll", {
        id: "__alloyId18"
    });
    __alloyId14.push($.__views.__alloyId18.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId19 = Alloy.createController("project/projectAll", {
        id: "__alloyId19"
    });
    __alloyId14.push($.__views.__alloyId19.getViewEx({
        recurse: !0
    }));
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId14,
        id: "scrollableView",
        currentPage: "2",
        showPagingControl: "false",
        top: "5"
    });
    $.__views.mainWindow.add($.__views.scrollableView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseWindowController($, arguments[0]);
    exports.close = function(e) {
        Alloy.Globals.confirm("退出", "您确定要退出吗？", function() {
            $.$view.close({
                animated: !1
            });
        });
    };
    $.onWindowCloseDo(function() {
        Alloy.Models.User = null;
        Alloy.Globals.initStore();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;