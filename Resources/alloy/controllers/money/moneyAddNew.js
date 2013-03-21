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
    var __alloyId47 = [];
    $.__views.__alloyId48 = Alloy.createController("money/moneyExpenseForm", {
        saveableMode: "add",
        id: "__alloyId48"
    });
    __alloyId47.push($.__views.__alloyId48.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId49 = Alloy.createController("money/moneyIncomeForm", {
        saveableMode: "add",
        id: "__alloyId49"
    });
    __alloyId47.push($.__views.__alloyId49.getViewEx({
        recurse: !0
    }));
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId47,
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