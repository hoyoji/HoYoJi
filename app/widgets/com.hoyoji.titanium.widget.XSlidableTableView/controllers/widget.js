Alloy.Globals.extendsBaseUIController($, arguments[0]);

function setParent(view, parent) {
	roots = view.getTopLevelViews();
	var len = roots.length;

	if (!len) {
		return;
	}

	if (parent.__iamalloy) {
		view.parent = parent.parent;
	} else {
		view.parent = parent;
	}

	for (var i = 0; i < len; i++) {
		if (roots[i].__iamalloy) {
			roots[i].setParent(this.parent);
		} else {
			view.parent.addView(roots[i]);
		}
	}
}
$.$attrs.parentController = $;
$.mainTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", $.$attrs);
setParent($.mainTable, $.scrollableView);
if ($.$attrs.autoInit === "false") {
	$.mainTable.UIInit($, $.getCurrentWindow());
}

var currentTable = $.mainTable, tables = [];
tables.push($.mainTable);
exports.expandHasDetailSection = function(rowIndex, sectionRowId) {
	currentTable.expanHasDetailSection(rowIndex, sectionRowId);
};

exports.collapseHasDetailSection = function(rowIndex, sectionRowId) {
	currentTable.collapseHasDetailSection(rowIndex, sectionRowId);
};

exports.refreshTable = function() {
	currentTable.refreshTable();
};

exports.fetchFirstPage = function() {
	currentTable.fetchFirstPage();
};

exports.fetchNextPage = function(tableRowsCount) {
	currentTable.fetchNextPage(tableRowsCount);
};

exports.getDataCount = function() {
	return currentTable.getDataCount();
};

exports.getRowsCount = function() {
	return currentTable.getRowsCount();
};

exports.addCollection = function(collection, rowView) {
	currentTable.addCollection(collection, rowView);
};

exports.clearAllCollections = function() {
	currentTable.clearAllCollections();
};

exports.resetTable = function() {
	currentTable.resetTable();
};

exports.removeCollection = function(collection) {
	currentTable.removeCollection(collection);
};

exports.getCollections = function() {
	return currentTable.getCollections();
};

exports.close = function() {
	//currentTable.close();
};

exports.open = function(top) {
	//currentTable.open(top);
};

exports.getLastTableTitle = function() {
	return currentTable.getLastTableTitle();
};

exports.createChildTable = function(theBackNavTitle, collections) {
	//alert("createChildTable " + theBackNavTitle);
		if($.scrollableView.getCurrentPage() < $.scrollableView.getViews().length - 1){
			tables[$.scrollableView.getCurrentPage() + 1].clearAllCollections();
			tables.splice($.scrollableView.getCurrentPage() + 1, 1);
			$.scrollableView.removeView($.scrollableView.getCurrentPage() + 1);
		}
		var attrs = _.extend({}, $.$attrs);
		attrs.id = $.$attrs.id + $.scrollableView.getViews().length;
		var detailsTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", attrs);
		// detailsTable.setParent($.$view);
		//detailsTable.UIInit();
		//detailsTable.open();
		setParent(detailsTable, $.scrollableView);
		if ($.$attrs.autoInit === "false") {
			$.mainTable.UIInit($, $.getCurrentWindow());
		}
		$.$view.fireEvent("navigatedown", {
			bubbles : true,
			childTableTitle : theBackNavTitle
		});
	
		detailsTable.backNavTitle = theBackNavTitle;
		detailsTable.previousBackNavTitle = $.backNavTitle;
	
		for (var i = 0; i < collections.length; i++) {
			detailsTable.addCollection(collections[i]);
		}
		
		currentTable = detailsTable;
		tables.push(currentTable);
		$.scrollableView.scrollToView($.scrollableView.getCurrentPage()+1);
};

exports.navigateUp = function() {
};

exports.setHeaderView = function(headerView) {
	currentTable.setHeaderView();
};

exports.sort = function(fieldName, reverse, groupField, refresh, appendRows, removedRows, collectionId, finishCB) {
	currentTable.sort(fieldName, reverse, groupField, refresh, appendRows, removedRows, collectionId, finishCB);
};

exports.getPageSize = function() {
	return currentTable.getPageSize();
};

exports.getOrderBy = function() {
	return currentTable.getOrderBy();
};

exports.getSortOrder = function() {
	return currentTable.getSortOrder();
};

exports.autoFetchNextPage = function() {
	currentTable.autoFetchNextPage();
};

exports.autoHideFooter = function(footer) {
	currentTable.autoHideFooter(footer);
};

$.scrollableView.addEventListener("scrollend", function(e){
	var len = $.scrollableView.getViews().length - 1;
	for(var i = len; i > e.currentPage; i--){
		tables[i].clearAllCollections();
		tables.splice(i, 1);
		$.scrollableView.removeView(i);
	}
	currentTable = tables[e.currentPage];
	$.$view.fireEvent("navigateup", {
		bubbles : true,
		childTableTitle : currentTable.backNavTitle
	});	
});
