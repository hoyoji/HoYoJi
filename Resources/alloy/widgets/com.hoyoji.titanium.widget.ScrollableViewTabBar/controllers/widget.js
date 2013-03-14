function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.ScrollableViewTabBar/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.ScrollableViewTabBar/" + s.substring(index + 1);
    return path.indexOf("/") !== 0 ? "/" + path : path;
}

function Controller() {
    function animateHideTabBar() {
        firstTimeOpen && (firstTimeOpen = !1);
        var animation = Titanium.UI.createAnimation();
        animation.top = "-42";
        animation.duration = 500;
        animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
        animation.addEventListener("complete", function() {
            $.widget.height = "5";
            isExpanded = !1;
        });
        $.tabs.animate(animation);
    }
    function hideTabBar(timeout) {
        hideTimeoutId = setTimeout(animateHideTabBar, timeout);
    }
    function hightLightTab(e) {
        if (e.source !== scrollableView) return;
        if (e.currentPage >= 0 && e.currentPage <= 4) if (currentTab !== e.currentPage) {
            $.tabs.getChildren()[currentTab].setBackgroundColor("white");
            $.tabs.getChildren()[e.currentPage].setBackgroundColor("cyan");
            currentTab = e.currentPage;
            hideTabBar(800);
        } else if (firstTimeOpen) {
            firstTimeOpen = !1;
            hideTabBar(800);
        } else hideTabBar(1);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.widget = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "47",
        top: "0",
        backgroundColor: "#00000000",
        zIndex: "1",
        id: "widget"
    });
    $.addTopLevelView($.__views.widget);
    $.__views.__alloyId0 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: "white",
        top: "0",
        zIndex: "1",
        id: "__alloyId0"
    });
    $.__views.widget.add($.__views.__alloyId0);
    $.__views.hightlight = Ti.UI.createLabel({
        color: "#000",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: "5",
        width: "20%",
        id: "hightlight",
        backgroundColor: "cyan",
        top: "0"
    });
    $.__views.__alloyId0.add($.__views.hightlight);
    $.__views.tabs = Ti.UI.createView({
        id: "tabs",
        width: Ti.UI.FILL,
        height: "42",
        top: "5",
        layout: "horizontal",
        backgroundColor: "black",
        zIndex: "0"
    });
    $.__views.widget.add($.__views.tabs);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseUIController($, arguments[0]);
    var currentTab = 0, scrollableView = null, isExpanded = !0, hideTimeoutId = null, firstTimeOpen = !0;
    exports.init = function(scView) {
        scrollableView = scView;
        var views = scrollableView.getViews(), tabWidth = 1 / views.length * 100 + "%";
        $.hightlight.setWidth(tabWidth);
        views.map(function(view) {
            var label = Ti.UI.createLabel({
                backgroundColor: "white",
                color: "black",
                text: view.title,
                textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                width: tabWidth,
                top: 0,
                height: 42
            });
            $.tabs.add(label);
        });
        currentTab = scrollableView.getCurrentPage();
        $.tabs.getChildren()[currentTab].setBackgroundColor("cyan");
        $.hightlight.setLeft(currentTab / views.length * 100 + "%");
        scrollableView.addEventListener("scrollEnd", hightLightTab);
        scrollableView.addEventListener("scroll", function(e) {
            if (e.source !== scrollableView) return;
            if (!isExpanded) {
                isExpanded = !0;
                $.widget.height = "47";
                var animation = Titanium.UI.createAnimation();
                animation.top = "5";
                animation.duration = 500;
                animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
                $.tabs.animate(animation);
            }
            $.hightlight.setLeft(e.currentPageAsFloat * $.hightlight.getSize().width);
            clearTimeout(hideTimeoutId);
        });
        setTimeout(animateHideTabBar, 1000);
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;