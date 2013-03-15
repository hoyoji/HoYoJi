function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.currencyRow = Ti.UI.createView({
        backgroundColor: "white",
        height: "42",
        openForm: "setting/currency/currencyForm",
        id: "currencyRow"
    });
    $.addTopLevelView($.__views.currencyRow);
    $.__views.content = Ti.UI.createView({
        id: "content",
        height: Ti.UI.FILL
    });
    $.__views.currencyRow.add($.__views.content);
    $.__views.__alloyId57 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
        top: "0",
        width: Ti.UI.SIZE,
        height: "42",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId57"
    });
    $.__views.__alloyId57.setParent($.__views.content);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection({
            headerTitle: "币种设置操作"
        });
        menuSection.add($.createContextMenuItem("删除币种", function() {
            $.deleteModel();
        }));
        return menuSection;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;