Alloy.Globals.extendsBaseUIController($, arguments[0]);

var collections = [], collapsibleSections = {};

$.$view.addEventListener("click", function(e) {
	e.cancelBubble = true;
	console.info("xtable catched row clickkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkked");
	if (e.deleteRow === true) {
		console.info("deleteRow clickkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkked");
		$.table.deleteRow(e.index);
	} else if (e.expandSection === true) {
		exports.expandSection(e.index, e.sectionRowId);
	} else if (e.collapseSection === true) {
		exports.collapseSection(e.index, e.sectionRowId);
	} else if (e.addRowToSection) {
		var section = collapsibleSections[e.sectionRowId];
		var rowModel, collection;
		for (var i = 0; i < section.collections.length; i++) {
			rowModel = section.collections[i].get(e.addRowToSection);
			if (rowModel) {
				collection = section.collections[i];
				break;
			}
		}
		var len = collection.length ? collection.length - 1 : 0;
		addRowToSection(rowModel, collection, e.index + len);
	}
});

function addRowToSection(rowModel, collection, index) {
	var rowViewController = Alloy.createController(rowModel.config.rowView, {
		$model : rowModel,
		$collection : collection
	});
	var row = Ti.UI.createTableViewRow();
	rowViewController.setParent(row);
	if (rowViewController.$attrs.hasDetail || rowViewController.$view.hasDetail) {
		collapsibleSections[rowModel.xGet("id")] = {
			parentRowController : rowViewController,
			collections : []
		};
	}
	
	if (index === undefined) {
		$.table.appendRow(row);
	} else {
		$.table.insertRowAfter(index, row);
	}
}

function addRow(rowModel, collection) {
	addRowToSection(rowModel, collection);
}

exports.expandSection = function(rowIndex, sectionRowId) {
	var index = rowIndex;
	var parentController = collapsibleSections[sectionRowId].parentRowController;
	var collections = parentController.getDetailCollections();
	for (var i = 0; i < collections.length; i++) {
		for (var j = 0; j < collections[i].length; j++) {
			addRowToSection(collections[i].at(j), collections[i], index);
			index++;
		}
		collapsibleSections[sectionRowId].collections.push(collections[i]);
	}
}

exports.collapseSection = function(rowIndex, sectionRowId) {
	var index = rowIndex + 1;
	var collections = collapsibleSections[sectionRowId].collections;
	for (var c = 0; c < collections.length; c++) {
		for (var i = 0; i < collections[c].length; i++) {
			var rowId = collections[c].at(i).get("id");
			if(collapsibleSections[rowId]){
				exports.collapseSection(index, rowId);
			}
			$.table.deleteRow(index);
		}
	}
	collapsibleSections[sectionRowId].collections = [];
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
}

exports.open = function(top) {
	if (top === undefined)
		top = 42;
	function animate() {
		var animation = Titanium.UI.createAnimation();
		animation.top = top;
		animation.duration = 500;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;

		$.$view.animate(animation);
	}


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
