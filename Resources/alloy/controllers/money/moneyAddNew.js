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
    var __alloyId24 = [];
    $.__views.__alloyId25 = Alloy.createController("money/moneyExpenseForm", {
        saveableMode: "add",
        id: "__alloyId25"
    });
    __alloyId24.push($.__views.__alloyId25.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId26 = Alloy.createController("money/moneyIncomeForm", {
        saveableMode: "add",
        id: "__alloyId26"
    });
    __alloyId24.push($.__views.__alloyId26.getViewEx({
        recurse: !0
    }));
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId24,
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