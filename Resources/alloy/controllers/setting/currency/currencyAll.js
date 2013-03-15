function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.currencyAll = Ti.UI.createView({
        backgroundColor: "cyan",
        title: "币种设置",
        id: "currencyAll"
    });
    $.addTopLevelView($.__views.currencyAll);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "币种设置"
    });
    $.__views.titleBar.setParent($.__views.currencyAll);
    $.__views.currenciesTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
        id: "currenciesTable",
        bottom: "42",
        top: "42"
    });
    $.__views.currenciesTable.setParent($.__views.currencyAll);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection();
        menuSection.add($.createContextMenuItem("新增币种", function() {
            Alloy.Globals.openWindow("setting/currency/currencyForm", {
                $model: "Currency",
                saveableMode: "add"
            });
        }));
        return menuSection;
    };
    $.titleBar.bindXTable($.currenciesTable);
    var collection = Alloy.Models.User.xGet("currencies").xCreateFilter();
    $.currenciesTable.addCollection(collection);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;