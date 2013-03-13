Alloy.Globals.extendsBaseUIController($, arguments[0]);

var collections = [];

$.$view.addEventListener("click", function(e) {
	if (e.deleterow === true) {
		e.cancelBubble = true;
		$.table.deleteRow(e.index);
	}
});

function addRow(rowModel, collection) {
	var rowView = Alloy.createController(rowModel.config.rowView, {
		$model : rowModel,
		$collection : collection
	});
	var row = Ti.UI.createTableViewRow();

	rowView.setParent(row);
	$.table.appendRow(row);
}

exports.addCollection = function(collection) {
	console.info("xTableView adding collection " + collection.length);
	collections.push(collection);

	collection.map(function(row) {
		addRow(row, collection);
	});
	collection.on("add", addRow);
}
var clearCollections = function() {
	for (var i = 0; i < collections.length; i++) {
		if (collections[i]) {
			collections[i].off("add", addRow);
		}
	}
	collections = [];
}

$.onWindowCloseDo(clearCollections);

exports.removeCollection = function(collection) {
	collection.off("add", addRow);
	collections[_.indexOf(collections, collection)] = null;
}
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
	// $.$view.setTop("100%");
}

exports.open = function(top) {
	if (top === undefined)
		top = 42;
	function animate() {
		// $.$view.removeEventListener("postlayout", animate);
		var animation = Titanium.UI.createAnimation();
		animation.top = top;
		animation.duration = 500;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;

		$.$view.animate(animation);
	}

	//$.$view.addEventListener("postlayout", animate);
	$.$view.setTop("99%")
	animate();
}

exports.createChildTable = function(theBackNavTitle, collections) {
	$.detailsTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
		top : "100%"
	});
	$.detailsTable.setParent($.$view);
	// detailsTable.$view.setZIndex($.$view.getZIndex() ? $.$view.getZIndex() + 1 : 1);
	$.detailsTable.open(0);

	$.$view.fireEvent("navigatedown", {
		bubbles : true,
		childTableTitle : theBackNavTitle
	});

	$.detailsTable.backNavTitle = theBackNavTitle;
	$.detailsTable.previousBackNavTitle = $.backNavTitle
	
	for (var i = 0; i < collections.length; i++) {
		$.detailsTable.addCollection(collections[i]);
	}
}

exports.navigateUp = function() {
	var lastTable = $, parentTable;
	console.info("navigating up... from " + $.backNavTitle);
	while (lastTable.detailsTable) {
		parentTable = lastTable;
		lastTable = lastTable.detailsTable;
		console.info("finding lastTable ...");
	}
	if (lastTable !== $) {
		//lastTable.$view.hide();
		// lastTable.parent.remove($.$view);
		$.$view.fireEvent("navigateup", {
			bubbles : true,
			childTableTitle : lastTable.previousBackNavTitle
		});
		console.info("removing lastTable ..." + lastTable.backNavTitle + " from its parentTable " + parentTable.backNavTitle);
		parentTable.detailsTable = null;
		lastTable.close();
	}
}
