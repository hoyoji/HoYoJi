function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyIncomeCategoryAll = Ti.UI.createView({
        backgroundColor: "cyan",
        title: "收入分类",
        id: "moneyIncomeCategoryAll"
    });
    $.addTopLevelView($.__views.moneyIncomeCategoryAll);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "收入分类"
    });
    $.__views.titleBar.setParent($.__views.moneyIncomeCategoryAll);
    $.__views.moneyIncomeCategoriesTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
        id: "moneyIncomeCategoriesTable",
        bottom: "42",
        top: "42"
    });
    $.__views.moneyIncomeCategoriesTable.setParent($.__views.moneyIncomeCategoryAll);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    var selectedProject = $.$attrs.selectedProject;
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection();
        menuSection.add($.createContextMenuItem("新增收入分类", function() {
            Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {
                $model: "MoneyIncomeCategory",
                saveableMode: "add",
                data: {
                    project: selectedProject
                }
            });
        }));
        return menuSection;
    };
    $.titleBar.bindXTable($.moneyIncomeCategoriesTable);
    var collection = selectedProject.xGet("moneyIncomeCategories").xCreateFilter({
        parentIncomeCategory: null
    });
    $.moneyIncomeCategoriesTable.addCollection(collection);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;