function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyExpenseCategoryRow = Ti.UI.createView({
        backgroundColor: "white",
        height: "42",
        openForm: "money/moneyExpenseCategoryForm",
        hasChild: "subExpenseCategories",
        id: "moneyExpenseCategoryRow"
    });
    $.addTopLevelView($.__views.moneyExpenseCategoryRow);
    $.__views.content = Ti.UI.createView({
        id: "content",
        height: Ti.UI.FILL
    });
    $.__views.moneyExpenseCategoryRow.add($.__views.content);
<<<<<<< HEAD
    $.__views.__alloyId50 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
=======
    $.__views.__alloyId37 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
>>>>>>> a7e8848ee2b98cf8085c58364fafbea05b131011
        top: "0",
        width: Ti.UI.SIZE,
        height: "42",
        bindModel: "$.$model",
        bindAttribute: "name",
<<<<<<< HEAD
        id: "__alloyId50"
    });
    $.__views.__alloyId50.setParent($.__views.content);
=======
        id: "__alloyId37"
    });
    $.__views.__alloyId37.setParent($.__views.content);
>>>>>>> a7e8848ee2b98cf8085c58364fafbea05b131011
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection({
            headerTitle: "支出分类操作"
        });
        menuSection.add($.createContextMenuItem("删除支出分类", function() {
            $.deleteModel();
        }));
        menuSection.add($.createContextMenuItem("新增子支出分类", function() {
            Alloy.Globals.openWindow("money/moneyExpenseCategoryForm", {
                $model: "MoneyExpenseCategory",
                saveableMode: "add",
                data: {
                    parentExpenseCategory: $.$model,
                    project: $.$model.xGet("project")
                }
            });
        }));
        return menuSection;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;