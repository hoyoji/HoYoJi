Alloy.Globals.extendsBaseUIController($, arguments[0]);

var collections = [], collapsibleSections = {};

$.table.addEventListener("scroll", function(e) {
	console.info("........... " + e.contentOffset.y);
	if (e.contentOffset.y <= 0) {
		e.cancelBubbles = true;
	}
});

$.$view.addEventListener("click", function(e) {
		console.info("XTable get click event .... ");
		e.cancelBubble = true;
	if (e.deleteRow === true) {
		$.table.deleteRow(e.index);
	} else if (e.expandSection === true) {
		console.info("XTable get expanding section .... ");
		exports.expandSection(e.index, e.sectionRowId);
	} else if (e.collapseSection === true) {
		exports.collapseSection(e.index, e.sectionRowId);
	}
});

function addRow(rowModel, collection) {
	var rowViewController = Alloy.createController(rowModel.config.rowView, {
		$model : rowModel,
		$collection : collection
	});
	var row = Ti.UI.createTableViewRow();
	rowViewController.setParent(row);
	
	if(rowViewController.$attrs.collapsible === "true" || rowViewController.$view.collapsible === "true"){
		// var collapsibleSection = Ti.UI.createTableViewSection();
		// collapsibleSection.addEventListener("click", function(e){
			// console.info("collapsibleSection got click event ");
			// collapsibleSection.fireEvent("click",e);
		// });
		// collapsibleSection.add(row);
		collapsibleSections[rowModel.xGet("id")] = {parentRowController : rowViewController, rows : []};
		// $.table.appendSection(collapsibleSection);
	}
	$.table.appendRow(row);
}

exports.expandSection = function(rowIndex, sectionRowId){
	var index = rowIndex;
	var sectionRows = collapsibleSections[sectionRowId].rows;
	var parentController = collapsibleSections[sectionRowId].parentRowController;
	var collections = parentController.getChildCollections();
	console.info("expanding section .... ");
	for(var i = 0; i < collections.length; i++){
		console.info("expanding section .... populating collection .... ");
		for(var j=0; j < collections[i].length; j++){
		console.info("expanding section .... populating collection .... adding row ");
			var rowModel = collections[i].at(j);
			var rowViewController = Alloy.createController(rowModel.config.rowView, {
				$model : rowModel,
				$collection : collections[i],
				collapsible : false
			});
			var row = Ti.UI.createTableViewRow();
			rowViewController.setParent(row);
			sectionRows.push(row);
			$.table.insertRowAfter(index, row);
			index ++;
		}		
	}
}

exports.collapseSection = function(rowIndex, sectionRowId){
	var index = rowIndex + 1;
	var sectionRows = collapsibleSections[sectionRowId].rows;
	for(var i=0; i<sectionRows.length; i++){
		$.table.deleteRow(index);
	}
	collapsibleSections[sectionRowId].rows = [];
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
