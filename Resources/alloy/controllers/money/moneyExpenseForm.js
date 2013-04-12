function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.moneyExpenseForm = Ti.UI.createView({
        title: "支出",
        saveableContainer: "true",
        id: "moneyExpenseForm"
    });
    $.addTopLevelView($.__views.moneyExpenseForm);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "新增支出"
    });
    $.__views.titleBar.setParent($.__views.moneyExpenseForm);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseFormController($, arguments[0]);
    $.onSave = function(saveEndCB, saveErrorCB) {
        console.info("on save expense!");
        setTimeout(saveEndCB, 3000);
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;