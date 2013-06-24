Alloy.Globals.extendsBaseUIController($, arguments[0]);

var collections = [], hasDetailSections = {};
var sortByField = $.$attrs.sortByField, groupByField = $.$attrs.groupByField, sortReverse = $.$attrs.sortReverse === "true", pageSize = $.$attrs.pageSize ? Number($.$attrs.pageSize) : 0;

if (OS_ANDROID) {
	$.table.setOverScrollMode(Ti.UI.Android.OVER_SCROLL_NEVER);
	// $.table.addEventListener('scroll',function(e){
	// console.info("------ footer View y --------- " + $.table.footerView.getRect().y + " " + $.table.footerView.getRect().y);
	// console.info("------ table View  y --------- " + $.table.getRect().y + " " + $.table.getRect().height);
	// var offset = e.contentOffset.y;
	// var height = e.size.height;
	// var total = offset + height;
	// var theEnd = e.contentSize.height;
	// var distance = theEnd - total;
	//
	// if(distance === 0){
	// $.table.setOverScrollMode(Ti.UI.Android.OVER_SCROLL_NEVER);
	// }
	// });
}

// if(OS_ANDROID){
// if($.$attrs.groupByField){
// // <View height="45" width="Ti.UI.FILL" backgroundColor="#e7f5f5">
// // <View width="5" height="25" left="1" bottom="0" backgroundImage="/images/rowTopLeftShadow.png" zIndex="0" />
// // <View width="Ti.UI.FILL" height="25" left="3" bottom="0" zIndex="1">
// // 		<Label id="headerTitle" textAlign="Ti.UI.TEXTALIGNMENT_LEFT" width="Ti.UI.FILL" left="0" height="30" bottom="-5" borderRadius="5" backgroundColor="#d8fafa"/>
// // </View>
// // </View>
// var sectionHeader = Ti.UI.createView({height : 25, width : Ti.UI.FILL, backgroundColor : "#e7f5f5"});
// view1 = Ti.UI.createView({width : 5, height : 25, left:1, bottom : 0, backgroundImage : "/images/rowTopLeftShadow.png", zIndex : 0});
// sectionHeader.add(view1);
// view2 = Ti.UI.createView({width:Ti.UI.FILL, height:25, left:3, bottom:0, zIndex:1});
// view2.add(Ti.UI.createLabel({ textAlign:Ti.UI.TEXTALIGNMENT_LEFT, width:Ti.UI.FILL, left:0, height:30, bottom:-5, borderRadius:5, backgroundColor:"#d8fafa"}));
// sectionHeader.add(view2);
//
// // <View height="10" width="Ti.UI.FILL" backgroundColor="#e7f5f5">
// // <View id="sectionFooter" width="Ti.UI.FILL" height="10" left="0" top="0">
// // <View width="Ti.UI.FILL" left="0" height="10" top="0" borderRadius="5" backgroundColor="#f1fbfb" backgroundImage="/images/sectionBottomShadow.png"/>
// // <View width="Ti.UI.FILL" height="14" left="0" top="-7" borderRadius="5" backgroundColor="#f1fbfb" zIndex="0"/>
// // <View width="10" height="10" left="0" top="1" backgroundImage="/images/rowBottomLeftShadow.png" zIndex="1"/>
// // </View>
// // </View>
// var sectionFooter = Ti.UI.createView({height:10,width:Ti.UI.FILL,backgroundColor:"#e7f5f5"});
// var fView1 = Ti.UI.createView({width:Ti.UI.FILL,height:10,left:0,top:0});
// fView1.add(Ti.UI.createView({width:Ti.UI.FILL,left:0,height:10,top:0,borderRadius:5,backgroundColor:"#f1fbfb",backgroundImage:"/images/sectionBottomShadow.png"}));
// fView1.add(Ti.UI.createView({width:Ti.UI.FILL,left:0,height:14,top:-7,borderRadius:5,backgroundColor:"#f1fbfb",zIndex:0}));
// fView1.add(Ti.UI.createView({width:10,left:0,height:10,top:1,backgroundImage:"/images/rowBottomLeftShadow.png",zIndex:1}));
// sectionFooter.add(fView1);
//
//
// $.table.setHeaderView(sectionHeader);
// $.table.setFooterView(sectionFooter);
// }
// }

$.$view.addEventListener("click", function(e) {
	$.__changingRow = true;
	e.cancelBubble = true;
	if (e.deleteRow === true) {
		exports.collapseHasDetailSection(e.index, e.sectionRowId);

		var sectionIndex = getSectionIndexByRowIndex(e.index);
		if (e.rowHasRendered) {
			// remove the section header
			if ($.table.data[sectionIndex].rows.length === 1) {
				// setTimeout(function(){
				var data = $.table.data.slice(0);
				data.splice(sectionIndex, 1);
				$.table.setData(data);
				showNoDataIndicator(data.length);
				// },10000);
			} else {
				$.table.deleteRow(e.index);
			}
		} else {
			var data = $.table.data.slice(0);
			// remove the section header
			if ($.table.data[sectionIndex].rows.length === 1) {
				data.splice(sectionIndex, 1);
			} else {
				var rows = data[sectionIndex].rows.slice(0);
				rows.splice(e.index, 1);
				data[sectionIndex].rows = rows;
			}
			$.table.setData(data);
			showNoDataIndicator(data.length);
		}
	} else if (e.expandSection === true) {
		exports.expandHasDetailSection(e.index, e.sectionRowId);
	} else if (e.collapseSection === true) {
		exports.collapseHasDetailSection(e.index, e.sectionRowId);
	} else if (e.addRowToSection) {
		var section = hasDetailSections[e.sectionRowId];
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
	if (OS_ANDROID) {
		function deleteRowPostLayout() {
			$.table.removeEventListener("postlayout", deleteRowPostLayout);
			$.__changingRow = false;
			$.trigger("endchangingrow");
		}


		$.table.addEventListener("postlayout", deleteRowPostLayout);
	} else {
		$.__changingRow = false;
		$.trigger("endchangingrow");
	}
});

function createRowView(rowModel, collection) {
	var rowViewController = Alloy.createController(collection.__rowView || rowModel.config.rowView, {
		$model : rowModel,
		$collection : collection,
		hasDetail : $.$attrs.hasDetail,
		containingTable : $
	});
	var row = Ti.UI.createTableViewRow({
		id : rowModel.xGet("id"),
		//className : (collection.__rowView || rowModel.config.rowView).replace("/", ""),
		collectionId : collection.id
	});
	rowViewController.setParent(row);
	if (rowViewController.$attrs.hasDetail || rowViewController.$view.hasDetail) {
		hasDetailSections[rowModel.xGet("id")] = {
			parentRowController : rowViewController,
			collections : []
		};
	}
	return row;
}

function findInsertPosInSection(rowModel, sectionNameOfModel, pos, s, r, previousHasDetailSize) {
	if (!groupByField) {
		return {
			insertBefore : true,
			index : pos
		};
	}
	var rowSectionValue = rowModel.xDeepGet(groupByField);
	if (getSectionNameOfRowModel(rowSectionValue) !== sectionNameOfModel) {
		// if (pos > 0) {
		var previousRowModel;
		if (r > 0) {
			previousRowModel = findObject($.table.data[s].rows[r - previousHasDetailSize - 1].id);
		} else if ((s - 1) >= 0) {
			// find last row in previous sections
			var previousSection = s - 1;
			var sectionLength = $.table.data[previousSection].rows.length;
			while (previousSection > 0 && sectionLength === 0) {
				previousSection--;
				sectionLength = $.table.data[previousSection].rows.length;
			}
			if (sectionLength > 0) {
				previousRowModel = findObject($.table.data[previousSection].rows[sectionLength - previousHasDetailSize - 1].id);
			}
		}
		if (!previousRowModel) {// no previous section
			return {
				insertBefore : -1,
				index : s,
				sectionTitle : sectionNameOfModel
			};
		} else {
			if (getSectionNameOfRowModel(previousRowModel.xDeepGet(groupByField)) !== sectionNameOfModel) {
				return {
					insertBefore : -1,
					index : s,
					sectionTitle : sectionNameOfModel
				};
			} else {
				return {
					insertBefore : false,
					index : pos - 1
				};
			}
		}
		// } else {
		// return {
		// insertBefore : false,
		// index : pos - 1
		// };
		// }
	} else {
		return {
			insertBefore : true,
			index : pos
		};
	}
}

function getHasDetailSectionSize(sectionRowId) {
	var size = 0;
	if (hasDetailSections[sectionRowId] && hasDetailSections[sectionRowId].collections.length) {
		hasDetailSections[sectionRowId].collections.forEach(function(c) {
			size += c.length;
		});
	}
	return size;
}

function findSortPos(model) {
	var value = model.xDeepGet(sortByField), pos = -1, previousHasDetailSize = 0, sectionNameOfModel;
	if (groupByField) {
		sectionNameOfModel = getSectionNameOfRowModel(model.xDeepGet(groupByField));
	}
	for (var s = 0; s < $.table.data.length; s++) {
		for (var r = 0; r < $.table.data[s].rows.length; r++) {
			pos++;
			if (!$.table.data[s].rows[r].id) {
				continue;
			}
			var rowModel = findObject($.table.data[s].rows[r].id);
			var rowValue = rowModel.xDeepGet(sortByField);
			if (sortReverse) {
				// 4,3,2,1
				if (value > rowValue) {
					return findInsertPosInSection(rowModel, sectionNameOfModel, pos, s, r, previousHasDetailSize);
				}
			} else {
				// 1,2,3,4:6,7,8
				if (value < rowValue) {
					return findInsertPosInSection(rowModel, sectionNameOfModel, pos, s, r, previousHasDetailSize);
				}
			}
			// skip all the hasDetail rows
			previousHasDetailSize = getHasDetailSectionSize($.table.data[s].rows[r].id);
			pos += previousHasDetailSize;
			r += previousHasDetailSize;
		}
	}

	if (!groupByField) {
		return {
			insertBefore : pos === -1,
			index : pos
		};
	}

	if (pos === -1) {
		return {
			insertBefore : -1,
			index : 0,
			sectionTitle : sectionNameOfModel
		};
	} else if (getSectionNameOfRowModel(rowModel.xDeepGet(groupByField)) !== sectionNameOfModel) {
		return {
			insertBefore : -1,
			index : s,
			sectionTitle : sectionNameOfModel
		};
	} else {
		return {
			insertBefore : false,
			index : pos
		};
	}
}

function addRowToSection(rowModel, collection, index) {
	var row = createRowView(rowModel, collection);

	if (index === undefined) {
		if (sortByField) {
			var pos = findSortPos(rowModel);
			if (pos === null) {
				$.table.appendRow(row);
			} else if (pos.insertBefore === -1) {
				// need to create new section for this row
				var section = createSection(pos.sectionTitle, pos.index);
				section.add(row);
				var data = $.table.data.slice(0);
				data.splice(pos.index, 0, section);
				$.table.setData(data);
				// showNoDataIndicator(data.length);
				// $.table.insertRowBefore(pos.index, row);
			} else if (pos.insertBefore) {
				if (pos.index === -1) {
					$.table.appendRow(row);
				} else {
					$.table.insertRowBefore(pos.index, row);
				}
			} else {
				$.table.insertRowAfter(pos.index, row);
			}
		} else {
			$.table.appendRow(row);
		}
	} else {
		$.table.insertRowAfter(index, row);
	}
}

function addRow(rowModel, collection) {
	function doAddRow() {
		$.off("endchangingrow", doAddRow)
		if ($.__changingRow) {
			$.on("endchanggingrow", doAddRow);
			return;
		} else {
			addRowToSection(rowModel, collection);
			showNoDataIndicator($.table.data.length);
		}
	}

	if (collection.isFetching || collection.isFiltering) {
		return;
	}
	doAddRow();
}

exports.expandHasDetailSection = function(rowIndex, sectionRowId) {
	var index = rowIndex;
	var parentController = hasDetailSections[sectionRowId].parentRowController;
	var collections = parentController.getDetailCollections();
	for (var i = 0; i < collections.length; i++) {
		for (var j = 0; j < collections[i].length; j++) {
			addRowToSection(collections[i].at(j), collections[i], index);
			index++;
		}
		hasDetailSections[sectionRowId].collections.push(collections[i]);
	}
}
function getSectionIndexByRowIndex(index) {
	var sectionIndex = 0;
	var sectionSize = $.table.data[sectionIndex].rows.length;
	while (index >= sectionSize && sectionIndex + 1 < $.table.data.length) {
		sectionIndex++;
		index -= sectionSize;
		sectionSize = $.table.data[sectionIndex].rows.length;
	}
	return sectionIndex;
	//return $.table.data[sectionIndex].rows[index];
}

function getRowViewByRowIndex(index) {
	var sectionIndex = 0;
	var sectionSize = $.table.data[sectionIndex].rows.length;
	while (index >= sectionSize && sectionIndex + 1 < $.table.data.length) {
		sectionIndex++;
		index -= sectionSize;
		sectionSize = $.table.data[sectionIndex].rows.length;
	}
	return $.table.data[sectionIndex].rows[index];
}

exports.collapseHasDetailSection = function(rowIndex, sectionRowId) {
	if (!hasDetailSections[sectionRowId]) {
		return;
	}
	var index = rowIndex + 1;
	var collections = hasDetailSections[sectionRowId].collections;
	for (var c = 0; c < collections.length; c++) {
		for (var i = 0; i < collections[c].length; i++) {
			var rowId = collections[c].at(i).xGet("id");
			if (hasDetailSections[rowId]) {
				exports.collapseHasDetailSection(index, rowId);
			}

			getRowViewByRowIndex(index).fireEvent("rowremoved", {
				bubbles : false
			});
			$.table.deleteRow(index);
		}
	}
	hasDetailSections[sectionRowId].collections = [];
}
function collapseAllHasDetailSections() {
	var pos = -1;
	for (var s = 0; s < $.table.data.length; s++) {
		for (var r = 0; r < $.table.data[s].rows.length; r++) {
			pos++;
			if (hasDetailSections[$.table.data[s].rows[r].id] && hasDetailSections[$.table.data[s].rows[r].id].collections.length) {
				exports.collapseHasDetailSection(pos, hasDetailSections[$.table.data[s].rows[r].id]);
			}
		}
	}
}

var sortedArray_sortByField, sortedArray_sortReverse, sortedArray_groupByField;
exports.fetchNextPage = function(tableRowsCount) {
	var sortedArray = [];

	//$.showActivityIndicator("正在加载...");
	$.fetchNextPageButton.setText("正在加载更多...");

	if (sortByField && (sortByField !== sortedArray_sortByField || sortReverse !== sortedArray_sortReverse || groupByField !== sortedArray_groupByField
	)) {
		sortedArray_sortByField = sortByField;
		sortedArray_sortReverse = sortReverse;
		sortedArray_groupByField = groupByField;
		$.table.setData([]);
		tableRowsCount = 0;
	} else {
		tableRowsCount = tableRowsCount || exports.getRowsCount();
	}

	function doFetchNextPage() {
		sortedArray = [];
		for (var i = 0; i < collections.length; i++) {
			if (collections[i] && collections[i].length > 0) {
				collections[i].forEach(function(item) {
					sortedArray.push({
						record : item,
						collection : collections[i]
					});
				})
			}
		}

		if (sortByField) {
			sortedArray.sort(function(a, b) {
				a = a.record.xDeepGet(sortByField);
				b = b.record.xDeepGet(sortByField);
				if (a < b) {
					return sortedArray_sortReverse ? 1 : -1;
				} else if (a > b) {
					return sortedArray_sortReverse ? -1 : 1;
				}
				return 0;
			});
		}

		var newRows = [];
		sortedArray.slice(tableRowsCount, tableRowsCount + pageSize).forEach(function(item) {
			newRows.push(createRowView(item.record, item.collection));
		});

		if (newRows.length > 0) {
			$.sort(null, null, null, true, newRows);
		}

		//$.hideActivityIndicator();

		showNoDataIndicator();
	}

	if ($.beforeFetchNextPage) {
		$.beforeFetchNextPage(
			tableRowsCount,
			pageSize + 1,
			$.getOrderBy() + " " + $.getSortOrder(),
			doFetchNextPage, 
			function(err){
				showNoDataIndicator();
				alert(err.msg);
			});
	} else {
		doFetchNextPage();
	}
}

exports.getDataCount = function() {
	var count = 0;
	for (var i = 0; i < collections.length; i++) {
		if (collections[i] && collections[i].length > 0) {
			count += collections[i].length;
		}
	}
	return count;
}

exports.getRowsCount = function() {
	var sectionsSize = $.table.data.length;
	var count = 0;
	for (var i = 0; i < sectionsSize; i++) {
		count += $.table.data[i].rows.length
	}
	return count;
}

exports.addCollection = function(collection, rowView) {
	$.showActivityIndicator("正在加载...");

	console.info("xTableView adding collection " + collection.length);
	if (rowView) {
		collection.__rowView = rowView;
	}
	if (!collection.id) {
		collection.id = guid();
	}
	collections.push(collection);

	// collection.map(function(row) {
	// addRow(row, collection);
	// });

	if (collection.length > 0) {
		if (pageSize > 0) {
			// collection.forEach(function(item) {
			// sortedArray.push({record : item, collection : collection});
			// });
		} else {
			var newRows = [];
			collection.forEach(function(item) {
				newRows.push(createRowView(item, collection));
			});
			if (newRows.length > 0) {
				$.sort(null, null, null, true, newRows);
			}
		}
	}
	// else {
	// addRow(collection.at(0), collection);
	// }
	collection.on("add", addRow);
	collection.on("reset", resetCollection);
	collection.on("sync", refreshCollectionOnChange, collection);

	collection.on("xFetchEnd", refreshCollection);
	collection.on("xSetFilterEnd", refreshCollection);

	showNoDataIndicator($.table.data.length);
	$.hideActivityIndicator();
}
var clearCollections = function() {
	for (var i = 0; i < collections.length; i++) {
		if (collections[i]) {
			//exports.removeCollection(collections[i], {previousModels : collections[i].models});
			collections[i].off("add", addRow);
			collections[i].off("reset", resetCollection);
			collections[i].off("sync", refreshCollectionOnChange, collections[i]);
			collections[i].off("xFetchEnd", refreshCollection);
			collections[i].off("xSetFilterEnd", refreshCollection);
		}
	}
	collections = [];
	$.table.setData([]);
	showNoDataIndicator(0);
}
function refreshCollectionOnChange(model) {
	if (this.__compareFilter(model)) {
		$.sort(null, null, null, true);
		showNoDataIndicator();
	}
}

function refreshCollection(collection, appendRows, removedRows) {
	if (pageSize > 0 && appendRows && appendRows.length > 0) {
		// appendRows.forEach(function(item) {
		// sortedArray.push({record : item, collection : collection});
		// });
		// if(currentPage * pageSize < sortedArray.length){
		// $.fetchNextPageButton.show();
		// } else {
		// $.fetchNextPageButton.hide();
		// }
	} else {
		var newRows;
		if (appendRows && appendRows.length > 0) {
			newRows = [];
			appendRows.forEach(function(item) {
				newRows.push(createRowView(item, collection));
			});
		}
		if ((appendRows && appendRows.length > 0) || (removedRows && removedRows.length > 0)) {
			$.sort(null, null, null, true, newRows, removedRows, collection.id);
		}
	}
	showNoDataIndicator();
}

$.onWindowCloseDo(function() {
	clearCollections();
});

exports.resetTable = function() {
	for (var i = 0; i < collections.length; i++) {
		collections[i].off("reset", resetCollection);
		collections[i].reset();
		collections[i].on("reset", resetCollection);
	}
	$.table.setData([]);
	showNoDataIndicator(0);
}
var resetCollection = function(collection, options) {
	var data = $.table.data.slice(0);
	options.previousModels.forEach(function(model) {
		for (var i = 0; i < data.length; i++) {
			for (var r = 0; r < data[i].rows.length; r++) {
				var row = data[i].rows[r];
				if (row.id === model.xGet("id")) {
					var rows = data[i].rows.slice(0);
					rows.splice(r, 1);
					data[i].rows = rows;
					r--;
				}
			}
			if (data[i].rows.length === 0) {
				data.splice(i, 1);
				i--;
			}
		}
	});
	$.table.setData(data);
	showNoDataIndicator(data.length);
}

exports.removeCollection = function(collection) {
	collection.off("add", addRow);
	collection.off("reset", exports.resetCollection);
	resetCollection(collection, {
		previousModels : collection.models
	});
	var index = _.indexOf(collections, collection);
	collections[index] = null;
	collections.splice(index, 1);
}

exports.getCollections = function() {
	return collections;
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
		top = 0;
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
function getLastTable() {
	var lastTable = $;
	while (lastTable.detailsTable) {
		lastTable = lastTable.detailsTable;
	}
	return lastTable;
}

exports.getLastTableTitle = function() {
	return getLastTable().backNavTitle;
};

exports.createChildTable = function(theBackNavTitle, collections) {
	$.detailsTable = Alloy.createWidget("com.hoyoji.titanium.widget.XTableView", "widget", {
		top : "100%",
		hasDetail : $.$attrs.hasDetail,
		sortByField : sortByField,
		groupByField : groupByField,
		sortReverse : sortReverse
	});
	$.detailsTable.setParent($.$view);
	$.detailsTable.open();

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
		parentTable.detailsTable = null;
		lastTable.close();
	}
}
function findObject(id) {
	for (var c = 0; c < collections.length; c++) {
		//for (var i = 0; i < collections[c].length; i++) {
		var o = collections[c].get(id);
		if (o) {
			return o;
		}
		//}
	}
}

function getSectionNameOfRowModel(sectionName) {
	if (groupByField === "date" || groupByField.endsWith(".date")) {
		sectionName = String.formatDate(new Date(sectionName), "medium");
	}
	return sectionName;
}

exports.setHeaderView = function(headerView) {
	$.table.setHeaderView(headerView);
}

exports.sort = function(fieldName, reverse, groupField, refresh, appendRows, removedRows, collectionId) {

	if (!refresh) {
		if (groupField === groupByField && sortByField === fieldName && sortReverse === reverse) {
			return;
		}

		sortByField = fieldName;
		sortReverse = reverse;
		groupByField = groupField;
	}
	$.showActivityIndicator("正在排序...");

	collapseAllHasDetailSections();

	// if(pageSize > 0){
	// var tableRowsCount = exports.getRowsCount();
	// if(tableRowsCount < exports.getDataCount()){
	// appendRows = $.fetchNextPage(tableRowsCount, true);
	// }
	// }

	var data = $.table.data;

	data = _.flatten(data, true);
	data = _.pluck(data, "rows");
	data = _.flatten(data, true);
	if (appendRows && appendRows.length > 0) {
		appendRows.forEach(function(row) {
			data.push(row)
		});
	}
	if (removedRows && removedRows.length > 0) {
		data = _.filter(data, function(row) {
			for (var i = 0; i < removedRows.length; i++) {
				if (row.id === removedRows[i].id) {
					if (collectionId) {
						return row.collectionId !== collectionId;
					} else {
						return false;
					}
				}
			}
			return true;
		});
	}

	if (sortByField) {
		data.sort(function(a, b) {
			a = findObject(a.id);
			b = findObject(b.id);
			if (!a || !b) {
				return 0;
			}

			a = a.xDeepGet(sortByField);
			b = b.xDeepGet(sortByField);
			if (a < b) {
				return sortReverse ? 1 : -1;
			} else if (a > b) {
				return sortReverse ? -1 : 1;
			}
			return 0;
		});
	}
	if (groupByField) {
		var sectionData = _.groupBy(data, function(item) {
			var model = findObject(item.id);
			return model && getSectionNameOfRowModel(model.xDeepGet(groupByField));
		});
		data = [];
		var sectionIndex = 0;
		for (var sectionTitle in sectionData) {
			var section = createSection(sectionTitle, sectionIndex);
			sectionData[sectionTitle].forEach(function(row) {
				section.add(row);
			})
			data.push(section);
			sectionIndex++;
		}
	}
	$.table.setData(data);
	// showNoDataIndicator(data.length);
	$.hideActivityIndicator();

}
function createSection(sectionTitle, sectionIndex) {
	var section;

	// if (OS_IOS) {
	// // var sectionHeader = Alloy.createWidget("com.hoyoji.titanium.widget.XTableSectionHeader", "widget", {headerTitle : sectionTitle, sectionIndex : sectionIndex});
	// // var	sectionFooter = Alloy.createWidget("com.hoyoji.titanium.widget.XTableSectionFooter", "widget");
	//
	// var sectionHeader = Ti.UI.createView({
	// id : sectionIndex,
	// height : 25,
	// width : Ti.UI.FILL,
	// backgroundColor : "#e7f5f5"
	// });
	// view1 = Ti.UI.createView({
	// width : 5,
	// height : 25,
	// left : 1,
	// bottom : 0,
	// backgroundImage : "/images/rowTopLeftShadow.png",
	// zIndex : 0
	// });
	// sectionHeader.add(view1);
	// view2 = Ti.UI.createView({
	// width : Ti.UI.FILL,
	// height : 25,
	// left : 3,
	// bottom : 0,
	// zIndex : 1
	// });
	// view2.add(Ti.UI.createLabel({
	// text : sectionTitle,
	// textAlign : Ti.UI.TEXTALIGNMENT_LEFT,
	// width : Ti.UI.FILL,
	// left : 0,
	// height : 30,
	// bottom : -5,
	// borderRadius : 5,
	// backgroundColor : "#d8fafa"
	// }));
	// sectionHeader.add(view2);
	//
	// var sectionFooter = Ti.UI.createView({
	// height : 17,
	// width : Ti.UI.FILL,
	// backgroundColor : "#e7f5f5"
	// });
	// var fView1 = Ti.UI.createView({
	// width : Ti.UI.FILL,
	// height : 10,
	// left : 0,
	// top : 0
	// });
	// fView1.add(Ti.UI.createView({
	// width : Ti.UI.FILL,
	// left : 0,
	// height : 10,
	// top : 0,
	// borderRadius : 5,
	// backgroundColor : "#f1fbfb",
	// backgroundImage : "/images/sectionBottomShadow.png"
	// }));
	// fView1.add(Ti.UI.createView({
	// width : Ti.UI.FILL,
	// left : 0,
	// height : 14,
	// top : -7,
	// borderRadius : 5,
	// backgroundColor : "#f1fbfb",
	// zIndex : 0
	// }));
	// fView1.add(Ti.UI.createView({
	// width : 10,
	// left : 0,
	// height : 10,
	// top : 1,
	// backgroundImage : "/images/rowBottomLeftShadow.png",
	// zIndex : 1
	// }));
	// sectionFooter.add(fView1);
	//
	// section = Ti.UI.createTableViewSection({
	// headerView : sectionHeader,
	// footerView : sectionFooter
	// });
	//
	// } else {
	section = Ti.UI.createTableViewSection({
		headerTitle : sectionTitle
	});
	// }

	return section;
}

if (pageSize > 0) {
	$.fetchNextPageButton.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		exports.fetchNextPage();
	});
}

$.onWindowOpenDo(function() {
	if ($.getCurrentWindow().$attrs.selectorCallback && $.getCurrentWindow().$attrs.selectModelCanBeNull) {
		// var model = Alloy.createModel($.getCurrentWindow().$attrs.selectModelType);
		var titleLabel = Ti.UI.createLabel({
			text : "无" + $.getCurrentWindow().$attrs.title,
			height : 42,
			width : Ti.UI.FILL
		});

		titleLabel.addEventListener("singletap", function(e) {
			e.cancelBubble = true;
			$.getCurrentWindow().$attrs.selectorCallback(null);
			$.getCurrentWindow().close();
		});
		var row = Ti.UI.createTableViewRow();
		row.add(titleLabel);
		if (!$.getCurrentWindow().$attrs.selectedModel) {
			titleLabel.setColor("blue");
		}
		if ($.table.data.length > 0) {
			$.table.insertRowBefore(0, row);
		} else {
			$.table.appendRow(row);
		}
	}
});

var __noDataIndicator;
function showNoDataIndicator(hasData) {
	var dataCount = $.getDataCount();
	if (dataCount > 0) {
		// if (__noDataIndicator) {
		// __noDataIndicator.hide();
		// __noDataIndicator.setTop(-100);
		// }
		if (dataCount > $.getRowsCount()) {
			$.fetchNextPageButton.setText("点击加载更多...");
		} else {
			$.fetchNextPageButton.setText("无更多内容");
		}
	} else {
		$.fetchNextPageButton.setText("无内容");
		// if (!__noDataIndicator) {
		// __noDataIndicator = Ti.UI.createLabel({
		// text : "没有内容",
		// color : "blue",
		// backgroundColor : "transparent",
		// width : Ti.UI.SIZE,
		// height : Ti.UI.SIZE,
		// top : "25%",
		// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		// zIndex : 200
		// });
		// $.$view.add(__noDataIndicator);
		// } else {
		// __noDataIndicator.setTop("25%");
		// __noDataIndicator.show();
		// }
	}
}

exports.getPageSize = function(){
	return pageSize;
}

exports.getOrderBy = function(){
	return sortByField;
}

exports.getSortOrder = function(){
	return sortReverse ? "DESC" : "ASC";
}
