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
<<<<<<< HEAD
    $.__views.__alloyId43 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
=======
    $.__views.__alloyId61 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
        top: "0",
        width: Ti.UI.SIZE,
        height: "42",
        bindModel: "$.$model",
        bindAttribute: "name",
<<<<<<< HEAD
        id: "__alloyId43"
    });
    $.__views.__alloyId43.setParent($.__views.content);
=======
        id: "__alloyId61"
    });
    $.__views.__alloyId61.setParent($.__views.content);
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    $.makeContextMenu = function(e, isSelectMode) {
        var menuSection = Ti.UI.createTableViewSection({
            headerTitle: "收入分类操作"
        });
        menuSection.add($.createContextMenuItem("删除收入分类", function() {
            $.deleteModel();
        }, isSelectMode));
        return menuSection;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;