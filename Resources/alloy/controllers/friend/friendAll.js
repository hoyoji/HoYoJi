function Controller() {
    function openFriendAll(e) {
        Alloy.Globals.openWindow("project/projectAll");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.friendAll = Ti.UI.createView({
        title: "好友",
        backgroundColor: "blue",
        id: "friendAll"
    });
    $.addTopLevelView($.__views.friendAll);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "好友"
    });
    $.__views.titleBar.setParent($.__views.friendAll);
    $.__views.__alloyId20 = Ti.UI.createButton({
        title: "open projectAll",
        id: "__alloyId20"
    });
    $.__views.friendAll.add($.__views.__alloyId20);
    openFriendAll ? $.__views.__alloyId20.addEventListener("click", openFriendAll) : __defers["$.__views.__alloyId20!click!openFriendAll"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    __defers["$.__views.__alloyId20!click!openFriendAll"] && $.__views.__alloyId20.addEventListener("click", openFriendAll);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;