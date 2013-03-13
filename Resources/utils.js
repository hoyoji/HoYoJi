(function() {
    exports.Utils = {};
    exports.Utils.alloyAnimation = require("alloy/animation");
    exports.Utils.alloyString = require("alloy/string");
    exports.Utils.alert = function(message) {
        alert(message);
    };
    exports.Utils.confirm = function(title, msg, confirmCB, cancelCB) {
        var dialog = Ti.UI.createAlertDialog({
            cancel: 1,
            buttonNames: [ "确认", "取消" ],
            message: msg,
            title: title
        });
        dialog.addEventListener("click", function(e) {
            e.index !== e.source.cancel ? confirmCB() : cancelCB && cancelCB();
        });
        dialog.show();
    };
    exports.Utils.openWindow = function(windowName, options) {
        Alloy.createController("window").openWin(windowName, options);
    };
    exports.Utils.patchScrollableViewOnAndroid = function(scView) {
        scView.getViews().map(function(view) {
            view.addEventListener("longpress", function(e) {
                if (!e.firstScrollableView) {
                    e.firstScrollableView = scView;
                    scView.setScrollingEnabled(!1);
                }
                scView.fireEvent("longpress", e);
            });
            view.addEventListener("becamedirty", function(e) {
                scView.fireEvent("becamedirty", e);
            });
            view.addEventListener("becameclean", function(e) {
                scView.fireEvent("becameclean", e);
            });
            view.addEventListener("closewin", function(e) {
                scView.fireEvent("closewin", e);
            });
            view.addEventListener("opencontextmenu", function(e) {
                if (!e.firstScrollableView) {
                    e.firstScrollableView = scView;
                    scView.setScrollingEnabled(!1);
                }
                scView.fireEvent("opencontextmenu", e);
            });
            view.addEventListener("save", function(e) {
                scView.fireEvent("save", e);
            });
            view.addEventListener("registerwindowevent", function(e) {
                scView.fireEvent("registerwindowevent", e);
            });
            view.addEventListener("registersaveablecallback", function(e) {
                scView.fireEvent("registersaveablecallback", e);
            });
            view.addEventListener("registerdirtycallback", function(e) {
                scView.fireEvent("registerdirtycallback", e);
            });
        });
    };
    String.prototype.contains = function(it) {
        return this.indexOf(it) != -1;
    };
    String.prototype.startsWith = function(str) {
        return this.substr(0, str.length) === str;
    };
    String.prototype.endsWith = function(str) {
        var thisLen = this.length, strLen = str.length;
        if (thisLen >= strLen) {
            var start = thisLen - strLen;
            return this.slice(start) === str;
        }
        return !1;
    };
    Function.prototype.bind || (Function.prototype.bind = function(obj) {
        if (typeof this != "function") throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        var slice = Array.prototype.slice, args = slice.call(arguments, 1), self = this, nop = function() {}, bound = function() {
            if (nop.prototype && this instanceof nop) {
                var result = self.apply(new nop, args.concat(slice.call(arguments)));
                return Object(result) === result ? result : self;
            }
            return self.apply(obj, args.concat(slice.call(arguments)));
        };
        nop.prototype = self.prototype;
        bound.prototype = new nop;
        return bound;
    });
    if (!Backbone.Model.prototype.once) {
        var eventSplitter = /\s+/, eventsApi = function(obj, action, name, rest) {
            if (!name) return !0;
            if (typeof name == "object") for (var key in name) obj[action].apply(obj, [ key, name[key] ].concat(rest)); else {
                if (!eventSplitter.test(name)) return !0;
                var names = name.split(eventSplitter);
                for (var i = 0, l = names.length; i < l; i++) obj[action].apply(obj, [ names[i] ].concat(rest));
            }
        };
        _.extend(Backbone.Model.prototype, {
            once: function(name, callback, context) {
                if (!eventsApi(this, "once", name, [ callback, context ]) || !callback) return this;
                var self = this, once = _.once(function() {
                    self.off(name, once);
                    callback.apply(this, arguments);
                });
                once._callback = callback;
                this.on(name, once, context);
                return this;
            }
        });
    }
})();