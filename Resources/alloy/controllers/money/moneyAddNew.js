function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyAddNew = Ti.UI.createView({
        backgroundColor: "white",
        id: "moneyAddNew"
    });
    $.addTopLevelView($.__views.moneyAddNew);
    $.__views.tabBar = Alloy.createWidget("com.hoyoji.titanium.widget.ScrollableViewTabBar", "widget", {
        id: "tabBar"
    });
    $.__views.tabBar.setParent($.__views.moneyAddNew);
    var __alloyId50 = [];
    $.__views.__alloyId51 = Alloy.createController("money/moneyExpenseForm", {
        saveableMode: "add",
        id: "__alloyId51"
    });
    __alloyId50.push($.__views.__alloyId51.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId52 = Alloy.createController("money/moneyIncomeForm", {
        saveableMode: "add",
        id: "__alloyId52"
    });
    __alloyId50.push($.__views.__alloyId52.getViewEx({
        recurse: !0
    }));
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId50,
        id: "scrollableView",
        showPagingControl: "false",
        top: "5"
    });
    $.__views.moneyAddNew.add($.__views.scrollableView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;