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
    $.__views.__alloyId77 = Ti.UI.createView({
        layout: "horizontal",
        height: Ti.UI.SIZE,
        id: "__alloyId77"
    });
    $.__views.login.add($.__views.__alloyId77);
    $.__views.__alloyId78 = Ti.UI.createButton({
        title: "登入",
        width: "50%",
        id: "__alloyId78"
    });
    $.__views.__alloyId77.add($.__views.__alloyId78);
    doLogin ? $.__views.__alloyId78.addEventListener("click", doLogin) : __defers["$.__views.__alloyId78!click!doLogin"] = !0;
    $.__views.__alloyId79 = Ti.UI.createButton({
        title: "注册",
        width: "50%",
        id: "__alloyId79"
    });
    $.__views.__alloyId77.add($.__views.__alloyId79);
    openRegister ? $.__views.__alloyId79.addEventListener("click", openRegister) : __defers["$.__views.__alloyId79!click!openRegister"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.__alloyId78!click!doLogin"] && $.__views.__alloyId78.addEventListener("click", doLogin);
    __defers["$.__views.__alloyId79!click!openRegister"] && $.__views.__alloyId79.addEventListener("click", openRegister);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;