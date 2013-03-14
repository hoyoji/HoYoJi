function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyIncomeCategoryRow = Ti.UI.createView({
        backgroundColor: "white",
        height: "42",
        openForm: "money/moneyIncomeCategoryForm",
        hasChild: "subIncomeCategories",
        id: "moneyIncomeCategoryRow"
    });
    $.addTopLevelView($.__views.moneyIncomeCategoryRow);
    $.__views.content = Ti.UI.createView({
        id: "content",
        height: Ti.UI.FILL
    });
    $.__views.moneyIncomeCategoryRow.add($.__views.content);
    $.__views.__alloyId61 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
        top: "0",
        width: Ti.UI.SIZE,
        height: "42",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId61"
    });
    $.__views.__alloyId61.setParent($.__views.content);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    $.makeContextMenu = function() {
        var menuSection = Ti.UI.createTableViewSection({
            headerTitle: "收入分类操作"
        });
        menuSection.add($.createContextMenuItem("删除收入分类", function() {
            $.deleteModel();
        }));
        menuSection.add($.createContextMenuItem("新增子收入分类", function() {
            Alloy.Globals.openWindow("money/moneyIncomeCategoryForm", {
                $model: "MoneyIncomeCategory",
                saveableMode: "add",
                data: {
                    parentIncomeCategory: $.$model,
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