function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.projectAll = Ti.UI.createView({
        title: "项目",
        backgroundColor: "cyan",
        id: "projectAll"
    });
    $.addTopLevelView($.__views.projectAll);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "项目"
    });
    $.__views.titleBar.setParent($.__views.projectAll);
    $.__views.projectsTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
        id: "projectsTable",
        bottom: "42",
        top: "42"
    });
    $.__views.projectsTable.setParent($.__views.projectAll);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    $.makeContextMenu = function(e, isSelectMode, sourceModel) {
        var menuSection = Ti.UI.createTableViewSection();
        menuSection.add($.createContextMenuItem("新增项目", function() {
            Alloy.Globals.openWindow("project/projectForm", {
                $model: "Project",
                saveableMode: "add",
                data: {
                    parentProject: sourceModel
                }
            });
        }));
        return menuSection;
    };
    $.titleBar.bindXTable($.projectsTable);
    var collection = Alloy.Models.User.xGet("projects").xCreateFilter({
        parentProject: null
    });
    $.projectsTable.addCollection(collection);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;