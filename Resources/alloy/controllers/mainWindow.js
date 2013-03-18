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
    var __alloyId32 = [];
    $.__views.__alloyId33 = Alloy.createController("message/messageAll", {
        id: "__alloyId33"
    });
    __alloyId32.push($.__views.__alloyId33.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId34 = Alloy.createController("money/moneyAll", {
        id: "__alloyId34"
    });
    __alloyId32.push($.__views.__alloyId34.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId35 = Alloy.createController("home/home", {
        id: "__alloyId35"
    });
    __alloyId32.push($.__views.__alloyId35.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId36 = Alloy.createController("friend/friendAll", {
        id: "__alloyId36"
    });
    __alloyId32.push($.__views.__alloyId36.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId37 = Alloy.createController("project/projectAll", {
        id: "__alloyId37"
    });
    __alloyId32.push($.__views.__alloyId37.getViewEx({
        recurse: !0
    }));
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId32,
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