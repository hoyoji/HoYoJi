(function() {
    exports.extends = function($, attrs) {
        function removeRow(row) {
            console.info("removing row ...........");
            if (row === $.$model) {
                isRemoving = !0;
                var animation = Titanium.UI.createAnimation();
                if ($.$model.id) {
                    console.info("removing row ...........");
                    animation.duration = 500;
                    animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
                    animation.left = "-100%";
                    animation.addEventListener("complete", function() {
                        $.$view.fireEvent("click", {
                            bubbles: !0,
                            deleteRow: !0
                        });
                    });
                    $.$view.animate(animation);
                } else {
                    console.info("destroy row ...........");
                    animation.duration = 800;
                    animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
                    animation.opacity = "0.5";
                    animation.height = 0;
                    animation.width = 0;
                    animation.addEventListener("complete", function() {
                        $.$view.fireEvent("click", {
                            bubbles: !0,
                            deleteRow: !0
                        });
                    });
                }
                $.$view.animate(animation);
            }
        }
        function shakeMe() {
            Alloy.Globals.alloyAnimation.shake($.$view, 200);
        }
        Alloy.Globals.extendsBaseViewController($, attrs);
        var errorLabel, childrenCollections, isExpanded = !1, hasChild = $.$attrs.hasChild || $.$view.hasChild, isCollapsible = $.$attrs.collapsible === "true" || $.$view.collapsible === "true";
        if ($.$attrs.collapsible === "false" || $.$attrs.collapsible === !1) isCollapsible = !1;
        $.getChildCollections = function() {
            if (!childrenCollections) {
                var children = hasChild ? hasChild.split(",") : [];
                childrenCollections = [];
                for (var i = 0; i < children.length; i++) childrenCollections.push($.$model.xGet(hasChild));
            }
            return childrenCollections;
        };
        $.getChildTitle = function() {
            var hasChildTitle = $.$attrs.hasChildTitle || $.$view.hasChildTitle || "name";
            return hasChildTitle ? $.$model.xGet(hasChildTitle) : "";
        };
        if (hasChild) {
            var openChildButton = Ti.UI.createButton({
                title: isCollapsible ? "＋" : ">",
                height: Ti.UI.FILL,
                width: 42,
                right: 0
            });
            $.$view.add(openChildButton);
            $.content.setRight(42);
            openChildButton.addEventListener("singletap", function(e) {
                e.cancelBubble = !0;
                if (isCollapsible) if (isExpanded) {
                    isExpanded = !1;
                    openChildButton.setTitle("＋");
                    $.$view.fireEvent("click", {
                        bubbles: !0,
                        collapseSection: !0,
                        sectionRowId: $.$model.xGet("id")
                    });
                } else {
                    isExpanded = !0;
                    openChildButton.setTitle("－");
                    $.$view.fireEvent("click", {
                        bubbles: !0,
                        expandSection: !0,
                        sectionRowId: $.$model.xGet("id")
                    });
                } else $.getParentController().createChildTable($.getChildTitle(), $.getChildCollections());
            });
        }
        $.deleteModel = function() {
            Alloy.Globals.confirm("确认删除", "你确定要删除选定的记录吗？", function() {
                var deleteFunc = $.$model.xDelete || $.$model._xDelete;
                deleteFunc.call($.$model, function(error) {
                    if (error) {
                        if (!errorLabel) {
                            errorLabel = Ti.UI.createLabel({
                                text: error.msg,
                                height: $.$view.getSize().height,
                                width: $.$view.getSize().width,
                                top: "-100%",
                                color: "red",
                                backgroundColor: "#40000000",
                                textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                            });
                            $.$view.add(errorLabel);
                        }
                        var animation = Titanium.UI.createAnimation();
                        animation.duration = 300;
                        animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
                        animation.top = "0";
                        $.content.setOpacity("0.3");
                        errorLabel.animate(animation);
                        errorLabel.addEventListener("longpress", function(e) {
                            e.cancelBubble = !0;
                        });
                        errorLabel.addEventListener("click", function(e) {
                            e.cancelBubble = !0;
                        });
                        errorLabel.addEventListener("singletap", function(e) {
                            e.cancelBubble = !0;
                            var animation = Titanium.UI.createAnimation();
                            animation.duration = 300;
                            animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
                            animation.top = "-100%";
                            animation.addEventListener("complete", function() {
                                $.content.setOpacity("1");
                            });
                            errorLabel.animate(animation);
                        });
                    }
                });
            });
        };
        var isRemoving = !1;
        $.$model.on("change", shakeMe);
        $.$attrs.$collection.on("remove", removeRow);
        $.onWindowCloseDo(function() {
            $.$attrs.$collection.off("remove", removeRow);
            $.$model.off("change", shakeMe);
        });
        $.$view.addEventListener("singletap", function(e) {
            e.cancelBubble = !0;
            if (!$.getCurrentWindow() || isRemoving) return;
            if ($.getCurrentWindow().$attrs.selectorCallback) {
                $.getCurrentWindow().$attrs.selectorCallback($.$model);
                $.getCurrentWindow().close();
                return;
            }
            var form = $.$attrs.openForm || $.$view.openForm, openForm;
            $.onRowTap && (openForm = $.onRowTap(e));
            form && openForm !== !1 && Alloy.Globals.openWindow(form, {
                $model: $.$model
            });
        });
    };
})();