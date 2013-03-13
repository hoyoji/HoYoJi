function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyExpenseCategoryAll = Ti.UI.createView({
        backgroundColor: "cyan",
        title: "支出分类",
        id: "moneyExpenseCategoryAll"
    });
    $.addTopLevelView($.__views.moneyExpenseCategoryAll);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "支出分类"
    });
    $.__views.titleBar.setParent($.__views.moneyExpenseCategoryAll);
    $.__views.moneyExpenseCategoriesTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
        id: "moneyExpenseCategoriesTable",
        bottom: "42",
        top: "42"
    });
    $.__views.moneyExpenseCategoriesTable.setParent($.__views.moneyExpenseCategoryAll);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    var selectedProject = $.$attrs.selectedProject;
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection();
        menuSection.add($.createContextMenuItem("新增支出分类", function() {
            Alloy.Globals.openWindow("money/moneyExpenseCategoryForm", {
                $model: "MoneyExpenseCategory",
                saveableMode: "add",
                data: {
                    project: selectedProject
                }
            });
        }));
        return menuSection;
    };
    $.titleBar.bindXTable($.moneyExpenseCategoriesTable);
    var collection = selectedProject.xGet("moneyExpenseCategories").xCreateFilter({
        parentExpenseCategory: null
    });
    $.moneyExpenseCategoriesTable.addCollection(collection);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;