function Controller() {
    function doLogin(e) {
        Alloy.Models.instance("User").xFindInDb({
            userName: $.userName.getValue()
        });
        Alloy.Models.User.id && Alloy.createController("mainWindow").open();
    }
    function openRegister(e) {
        Alloy.Globals.openWindow("user/registerForm", {
            $model: "User",
            saveableMode: "add"
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.login = Ti.UI.createView({
        backgroundColor: "white",
        saveableContainer: "true",
        layout: "vertical",
        height: Ti.UI.SIZE,
        borderColor: "black",
        borderWidth: "1",
        id: "login"
    });
    $.addTopLevelView($.__views.login);
    $.__views.userName = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        id: "userName",
        labelText: "用户名",
        hintText: "请输入用户名",
        keyboardType: Ti.UI.KEYBOARD_ASCII
    });
    $.__views.userName.setParent($.__views.login);
    $.__views.password = Alloy.createWidget("com.hoyoji.titanium.widget.AutoUpdatableTextField", "widget", {
        id: "password",
        labelText: "密码",
        hintText: "请输入密码",
        passwordMask: "true"
    });
    $.__views.password.setParent($.__views.login);
    $.__views.__alloyId73 = Ti.UI.createView({
        layout: "horizontal",
        height: Ti.UI.SIZE,
        id: "__alloyId73"
    });
    $.__views.login.add($.__views.__alloyId73);
    $.__views.__alloyId74 = Ti.UI.createButton({
        title: "登入",
        width: "50%",
        id: "__alloyId74"
    });
    $.__views.__alloyId73.add($.__views.__alloyId74);
    doLogin ? $.__views.__alloyId74.addEventListener("click", doLogin) : __defers["$.__views.__alloyId74!click!doLogin"] = !0;
    $.__views.__alloyId75 = Ti.UI.createButton({
        title: "注册",
        width: "50%",
        id: "__alloyId75"
    });
    $.__views.__alloyId73.add($.__views.__alloyId75);
    openRegister ? $.__views.__alloyId75.addEventListener("click", openRegister) : __defers["$.__views.__alloyId75!click!openRegister"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.__alloyId74!click!doLogin"] && $.__views.__alloyId74.addEventListener("click", doLogin);
    __defers["$.__views.__alloyId75!click!openRegister"] && $.__views.__alloyId75.addEventListener("click", openRegister);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;