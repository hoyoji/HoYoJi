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
<<<<<<< HEAD
    var __alloyId42 = [];
    $.__views.__alloyId43 = Alloy.createController("money/moneyExpenseForm", {
        saveableMode: "add",
        id: "__alloyId43"
    });
    __alloyId42.push($.__views.__alloyId43.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId44 = Alloy.createController("money/moneyIncomeForm", {
        saveableMode: "add",
        id: "__alloyId44"
    });
    __alloyId42.push($.__views.__alloyId44.getViewEx({
        recurse: !0
    }));
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId42,
=======
    var __alloyId29 = [];
    $.__views.__alloyId30 = Alloy.createController("money/moneyExpenseForm", {
        saveableMode: "add",
        id: "__alloyId30"
    });
    __alloyId29.push($.__views.__alloyId30.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId31 = Alloy.createController("money/moneyIncomeForm", {
        saveableMode: "add",
        id: "__alloyId31"
    });
    __alloyId29.push($.__views.__alloyId31.getViewEx({
        recurse: !0
    }));
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId29,
>>>>>>> a7e8848ee2b98cf8085c58364fafbea05b131011
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