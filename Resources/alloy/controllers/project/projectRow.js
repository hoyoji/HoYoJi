function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.projectRow = Ti.UI.createView({
        backgroundColor: "white",
        height: "42",
        openForm: "project/projectForm",
        hasChild: "subProjects",
        collapsible: "true",
        id: "projectRow"
    });
    $.addTopLevelView($.__views.projectRow);
    $.__views.content = Ti.UI.createView({
        id: "content",
        height: Ti.UI.FILL
    });
    $.__views.projectRow.add($.__views.content);
    $.__views.__alloyId64 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
        top: "0",
        width: Ti.UI.SIZE,
        height: "42",
        bindModel: "$.$model",
        bindAttribute: "name",
        id: "__alloyId64"
    });
    $.__views.__alloyId64.setParent($.__views.content);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    $.makeContextMenu = function(e, isSelectMode) {
        var menuSection = Ti.UI.createTableViewSection({
            headerTitle: "项目操作"
        });
        menuSection.add($.createContextMenuItem("删除项目", function() {
            $.deleteModel();
        }, isSelectMode));
        menuSection.add($.createContextMenuItem("支出分类", function() {
            Alloy.Globals.openWindow("money/moneyExpenseCategoryAll", {
                selectedProject: $.$model
            });
        }));
        menuSection.add($.createContextMenuItem("收入分类", function() {
            Alloy.Globals.openWindow("money/moneyIncomeCategoryAll", {
                selectedProject: $.$model
            });
        }));
        return menuSection;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;