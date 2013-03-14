function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.AutoBindLabel/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.AutoBindLabel/" + s.substring(index + 1);
    return path.indexOf("/") !== 0 ? "/" + path : path;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.label = Ti.UI.createLabel({
        color: "#000",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "label"
    });
    $.addTopLevelView($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseUIController($, arguments[0]);
    $.onWindowOpenDo(function() {
        function updateLabel(model) {
            $.label.setText(model.xGet($.$attrs.bindAttribute));
        }
        var model = $.$attrs.bindModel || $.$model;
        if (model && typeof model == "string") {
            var path = model.split(".");
            path[0] === "$" ? model = $.getParentController() : model = Alloy.Models[path[0]];
            for (var i = 1; i < path.length; i++) model = model[path[i]];
        }
        $.onWindowCloseDo(function() {
            model.off("sync", updateLabel);
        });
        console.info(model + " AutoBind Label get model : " + $.$attrs.bindModel + " from " + $.getParentController().$view.id);
        model.on("sync", updateLabel);
        updateLabel(model);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;