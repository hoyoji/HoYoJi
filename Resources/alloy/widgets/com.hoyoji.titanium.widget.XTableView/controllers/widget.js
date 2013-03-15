function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.XTableView/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.XTableView/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function addRow(rowModel, collection) {
        var rowViewController = Alloy.createController(rowModel.config.rowView, {
            $model: rowModel,
            $collection: collection
        }), row = Ti.UI.createTableViewRow();
        rowViewController.setParent(row);
        if (rowViewController.$attrs.collapsible === "true" || rowViewController.$view.collapsible === "true") collapsibleSections[rowModel.xGet("id")] = {
            parentRowController: rowViewController,
            rows: []
        };
        $.table.appendRow(row);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.widget = Ti.UI.createView({
        backgroundColor: "white",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "widget"
    });
    $.addTopLevelView($.__views.widget);
    $.__views.table = Ti.UI.createTableView({
        id: "table",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        borderWidth: "1",
        borderColor: "red",
        allowSelection: "false"
    });
    $.__views.widget.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseUIController($, arguments[0]);
    var collections = [], collapsibleSections = {};
    $.table.addEventListener("scroll", function(e) {
        console.info("........... " + e.contentOffset.y);
        e.contentOffset.y <= 0 && (e.cancelBubbles = !0);
    });
    $.$view.addEventListener("click", function(e) {
        console.info("XTable get click event .... ");
        e.cancelBubble = !0;
        if (e.deleteRow === !0) $.table.deleteRow(e.index); else if (e.expandSection === !0) {
            console.info("XTable get expanding section .... ");
            exports.expandSection(e.index, e.sectionRowId);
        } else e.collapseSection === !0 && exports.collapseSection(e.index, e.sectionRowId);
    });
    exports.expandSection = function(rowIndex, sectionRowId) {
        var index = rowIndex, sectionRows = collapsibleSections[sectionRowId].rows, parentController = collapsibleSections[sectionRowId].parentRowController, collections = parentController.getChildCollections();
        console.info("expanding section .... ");
        for (var i = 0; i < collections.length; i++) {
            console.info("expanding section .... populating collection .... ");
            for (var j = 0; j < collections[i].length; j++) {
                console.info("expanding section .... populating collection .... adding row ");
                var rowModel = collections[i].at(j), rowViewController = Alloy.createController(rowModel.config.rowView, {
                    $model: rowModel,
                    $collection: collections[i],
                    collapsible: !1
                }), row = Ti.UI.createTableViewRow();
                rowViewController.setParent(row);
                sectionRows.push(row);
                $.table.insertRowAfter(index, row);
                index++;
            }
        }
    };
    exports.collapseSection = function(rowIndex, sectionRowId) {
        var index = rowIndex + 1, sectionRows = collapsibleSections[sectionRowId].rows;
        for (var i = 0; i < sectionRows.length; i++) $.table.deleteRow(index);
        collapsibleSections[sectionRowId].rows = [];
    };
    exports.addCollection = function(collection) {
        console.info("xTableView adding collection " + collection.length);
        collections.push(collection);
        collection.map(function(row) {
            addRow(row, collection);
        });
        collection.on("add", addRow);
    };
    var clearCollections = function() {
        for (var i = 0; i < collections.length; i++) collections[i] && collections[i].off("add", addRow);
        collections = [];
    };
    $.onWindowCloseDo(clearCollections);
    exports.removeCollection = function(collection) {
        collection.off("add", addRow);
        collections[_.indexOf(collections, collection)] = null;
    };
    exports.close = function() {
        var animation = Titanium.UI.createAnimation();
        animation.top = "100%";
        animation.duration = 500;
        animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
        animation.addEventListener("complete", function() {
            clearCollections();
            $.parent.remove($.$view);
        });
        $.$view.animate(animation);
    };
    exports.open = function(top) {
        function animate() {
            var animation = Titanium.UI.createAnimation();
            animation.top = top;
            animation.duration = 500;
            animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            $.$view.animate(animation);
        }
        top === undefined && (top = 42);
        $.$view.setTop("99%");
        animate();
    };
    exports.createChildTable = function(theBackNavTitle, collections) {
        $.detailsTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
            top: "100%"
        });
        $.detailsTable.setParent($.$view);
        $.detailsTable.open(0);
        $.$view.fireEvent("navigatedown", {
            bubbles: !0,
            childTableTitle: theBackNavTitle
        });
        $.detailsTable.backNavTitle = theBackNavTitle;
        $.detailsTable.previousBackNavTitle = $.backNavTitle;
        for (var i = 0; i < collections.length; i++) $.detailsTable.addCollection(collections[i]);
    };
    exports.navigateUp = function() {
        var lastTable = $, parentTable;
        console.info("navigating up... from " + $.backNavTitle);
        while (lastTable.detailsTable) {
            parentTable = lastTable;
            lastTable = lastTable.detailsTable;
            console.info("finding lastTable ...");
        }
        if (lastTable !== $) {
            $.$view.fireEvent("navigateup", {
                bubbles: !0,
                childTableTitle: lastTable.previousBackNavTitle
            });
            console.info("removing lastTable ..." + lastTable.backNavTitle + " from its parentTable " + parentTable.backNavTitle);
            parentTable.detailsTable = null;
            lastTable.close();
        }
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;