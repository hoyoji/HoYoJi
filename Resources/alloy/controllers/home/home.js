function Controller() {
    function openMoneyAddNew(e) {
        Alloy.Globals.openWindow("money/moneyAddNew");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.home = Ti.UI.createView({
        backgroundColor: "white",
        title: "主页",
        id: "home"
    });
    $.addTopLevelView($.__views.home);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "主页"
    });
    $.__views.titleBar.setParent($.__views.home);
    $.__views.__alloyId44 = Ti.UI.createView({
        height: "42",
        borderWidth: "1",
        borderColor: "black",
        bottom: "0",
        id: "__alloyId44"
    });
    $.__views.home.add($.__views.__alloyId44);
    $.__views.__alloyId45 = Ti.UI.createButton({
        title: "记一笔",
        id: "__alloyId45"
    });
    $.__views.__alloyId44.add($.__views.__alloyId45);
    openMoneyAddNew ? $.__views.__alloyId45.addEventListener("click", openMoneyAddNew) : __defers["$.__views.__alloyId45!click!openMoneyAddNew"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    __defers["$.__views.__alloyId45!click!openMoneyAddNew"] && $.__views.__alloyId45.addEventListener("click", openMoneyAddNew);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;