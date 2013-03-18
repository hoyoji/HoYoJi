(function() {
    exports.extends = function($, attrs) {
        function enableOpenChildButton() {
            getChildCount() === 0 ? openChildButton.setEnabled(!1) : openChildButton.setEnabled(!0);
        }
        function enableOpenDetailButton() {
            getDetailCount() === 0 ? openDetailButton.setEnabled(!1) : openDetailButton.setEnabled(!0);
        }
        function addRowToExpandedSection(model) {
            isExpanded && $.$view.fireEvent("click", {
                bubbles: !0,
                addRowToSection: model.xGet("id"),
                sectionRowId: $.$model.xGet("id")
            });
        }
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
        var errorLabel, childrenCollections, detailCollections, isExpanded = !1, hasChild = $.$attrs.hasChild || $.$view.hasChild, hasDetail = $.$attrs.hasDetail || $.$view.hasDetail;
        $.getChildTitle = function() {
            var hasChildTitle = $.$attrs.hasChildTitle || $.$view.hasChildTitle || "name";
            return hasChildTitle ? $.$model.xGet(hasChildTitle) : "";
        };
        $.getChildCollections = function() {
            if (!childrenCollections) {
                var children = hasChild ? hasChild.split(",") : [];
                childrenCollections = [];
                for (var i = 0; i < children.length; i++) {
                    var collection = $.$model.xGet(children[i]);
                    childrenCollections.push(collection);
                    collection.on("remove", enableOpenChildButton);
                    collection.on("add", enableOpenChildButton);
                    $.onWindowCloseDo(function() {
                        collection.off("remove", enableOpenChildButton);
                        collection.off("add", enableOpenChildButton);
                    });
                }
            }
            return childrenCollections;
        };
        var getChildCount = function() {
            var count = 0;
            childrenCollections || $.getChildCollections();
            for (var i = 0; i < childrenCollections.length; i++) count += childrenCollections[i].length;
            return count;
        };
        $.getDetailCollections = function() {
            if (!detailCollections) {
                var details = hasDetail ? hasDetail.split(",") : [];
                detailCollections = [];
                for (var i = 0; i < details.length; i++) {
                    var collection = $.$model.xGet(details[i]);
                    detailCollections.push(collection);
                    collection.on("remove", enableOpenDetailButton);
                    collection.on("add", enableOpenDetailButton);
                    collection.on("add", addRowToExpandedSection);
                    $.onWindowCloseDo(function() {
                        collection.off("remove", enableOpenDetailButton);
                        collection.off("add", enableOpenDetailButton);
                        collection.off("add", addRowToExpandedSection);
                    });
                }
            }
            return detailCollections;
        };
        var getDetailCount = function() {
            var count = 0;
            detailCollections || $.getDetailCollections();
            for (var i = 0; i < detailCollections.length; i++) count += detailCollections[i].length;
            return count;
        };
        if (hasChild) {
            var openChildButton = Ti.UI.createButton({
                title: ">",
                height: Ti.UI.FILL,
                width: 42,
                right: 0
            });
            $.$view.add(openChildButton);
            $.content.setRight(42);
            openChildButton.addEventListener("singletap", function(e) {
                e.cancelBubble = !0;
                $.getParentController().createChildTable($.getChildTitle(), $.getChildCollections());
            });
            enableOpenChildButton();
        }
        if (hasDetail) {
            var openDetailButton = Ti.UI.createButton({
                title: "+",
                height: Ti.UI.FILL,
                width: 42,
                left: 0
            });
            $.$view.add(openDetailButton);
            $.content.setLeft(42);
            openDetailButton.addEventListener("singletap", function(e) {
                e.cancelBubble = !0;
                if (isExpanded) {
                    isExpanded = !1;
                    openDetailButton.setTitle("＋");
                    $.$view.fireEvent("click", {
                        bubbles: !0,
                        collapseSection: !0,
                        sectionRowId: $.$model.xGet("id")
                    });
                } else {
                    isExpanded = !0;
                    openDetailButton.setTitle("－");
                    $.$view.fireEvent("click", {
                        bubbles: !0,
                        expandSection: !0,
                        sectionRowId: $.$model.xGet("id")
                    });
                }
            });
            enableOpenDetailButton();
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