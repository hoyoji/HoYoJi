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
    $.__views.__alloyId26 = Ti.UI.createView({
        height: "42",
        borderWidth: "1",
        borderColor: "black",
        bottom: "0",
        id: "__alloyId26"
    });
    $.__views.home.add($.__views.__alloyId26);
    $.__views.__alloyId27 = Ti.UI.createButton({
        title: "记一笔",
        id: "__alloyId27"
    });
    $.__views.__alloyId26.add($.__views.__alloyId27);
    openMoneyAddNew ? $.__views.__alloyId27.addEventListener("click", openMoneyAddNew) : __defers["$.__views.__alloyId27!click!openMoneyAddNew"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection({
            headerTitle: "设置操作"
        });
        menuSection.add($.createContextMenuItem("币种设置", function() {
            Alloy.Globals.openWindow("setting/currency/currencyAll");
        }));
        return menuSection;
    };
    __defers["$.__views.__alloyId27!click!openMoneyAddNew"] && $.__views.__alloyId27.addEventListener("click", openMoneyAddNew);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;