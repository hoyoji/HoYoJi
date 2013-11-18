Alloy.Globals.extendsBaseUIController($, arguments[0]);

var collections = [], hasDetailSections = {};
var sortByField = $.$attrs.sortByField, groupByField = $.$attrs.groupByField, sortReverse = $.$attrs.sortReverse === "true", pageSize;

if ($.$attrs.pageSize && $.$attrs.pageSize.toString().startsWith("rowHeight:")) {
	pageSize = Math.floor((Ti.Platform.displayCaps.platformHeight - 45) / Number($.$attrs.pageSize.slice(10)));
} else if ($.$attrs.pageSize) {
	pageSize = Number($.$attrs.pageSize);
} else {
	pageSize = 0;
}

function createRowView(rowModel, collection) {
	var row = rowModel.getRowViewData();
	// row.__rowModel = rowModel;
	row.id = rowModel.xGet("id");
	row.template = collection.__rowView;
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
	var rowsCount = $.getRowsCount();
	if (index === undefined) {
		if (sortByField) {
			var pos = findSortPos(rowModel);

			if (pos === null) {
				if (pageSize > 0 && rowsCount % pageSize === 0) {
					return;
				}
				$.table.appendRow(createRowView(rowModel, collection));
			} else if (pos.insertBefore === -1) {
				// if(pageSize > 0 && rowsCount % pageSize !== 0){
				// return;
				// }
				// if(rowsCount > 0){
				// getRowViewByRowIndex(rowsCount-1).fireEvent("rowremoved", {
				// bubbles : false
				// });
				// $.table.deleteRow(rowsCount-1);
				// }
				var deleteLastRow = false;
				if (pageSize > 0 && rowsCount > 0 && rowsCount % pageSize === 0) {
					if (pos.index >= $.table.data.length) {
						return;
					} else {
						getRowViewByRowIndex(rowsCount - 1).fireEvent("rowremoved", {
							bubbles : false
						});
						$.table.deleteRow(rowsCount - 1);
					}
				}

				// need to create new section for this row
				var section = createSection(pos.sectionTitle, pos.index);

				section.add(createRowView(rowModel, collection));
				var data = $.table.data.slice(0);
				data.splice(pos.index, 0, section);
				$.table.setData(data);
				// showNoDataIndicator(data.length);
				// $.table.insertRowBefore(pos.index, row);
			} else if (pos.insertBefore) {
				if (pos.index === -1) {
					if (pageSize > 0 && rowsCount % pageSize === 0) {
						return;
					}
					$.table.appendRow(createRowView(rowModel, collection));
				} else {
					if (pageSize > 0 && rowsCount > 0 && rowsCount % pageSize === 0) {
						getRowViewByRowIndex(rowsCount - 1).fireEvent("rowremoved", {
							bubbles : false
						});
						$.table.deleteRow(rowsCount - 1);
						rowsCount--;
					}
					if (pos.index >= rowsCount) {
						$.table.appendRow(createRowView(rowModel, collection));
					} else {
						$.table.insertRowBefore(pos.index, createRowView(rowModel, collection));
					}
				}
			} else {
				if (pos.index >= rowsCount - 1 && pageSize > 0 && rowsCount % pageSize === 0) {
					return;
				}
				$.table.insertRowAfter(pos.index, createRowView(rowModel, collection));
			}
		} else {
			if (pageSize > 0 && rowsCount % pageSize === 0) {
				return;
			}
			$.table.appendRow(createRowView(rowModel, collection));
		}
	} else {
		try {
			if (index >= rowsCount - 1 && pageSize > 0 && rowsCount % pageSize === 0) {
				return;
			}
			$.table.insertRowAfter(index, createRowView(rowModel, collection));
		} catch(e) {
			if (pageSize > 0 && rowsCount % pageSize === 0) {
				return;
			}
			$.table.appendRow(createRowView(rowModel, collection));
		}
	}
}

function addRow(rowModel, collection) {
	if ($.$attrs.refreshTableAfterServerSync === "true" && Alloy.Globals.Server.__isSyncing) {
		return;
	}

	if (collection.isFetching || collection.isFiltering) {
		return;
	}
	$.table.getSections()[0].appendRow(createRowView(rowModel, collection));
	//addRowToSection(rowModel, collection);
	showNoDataIndicator();
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

var sortedArray_sortByField = sortByField, sortedArray_sortReverse = sortReverse, sortedArray_groupByField = groupByField, currentPageNumber = 0;
exports.refreshTable = function() {
	$.fetchFirstPage();
};

function clearTable() {
	if(!$.table){
		return;
	}
	var sectionIndex = 0;
	while (sectionIndex < $.table.getSections()) {
		$.table.deleteSectionAt(sectionIndex);
		sectionIndex++;
	}
}

exports.fetchFirstPage = function() {
	// $.table.setData([]);
	clearTable();
	exports.fetchNextPage(0);
};

exports.fetchNextPage = function(tableRowsCount) {
	// var sortedArray = [];
// 
	// if (fetchingNextPage === false) {
		// fetchingNextPage = true;
	// } else {
		// return;
	// }
	// $.fetchNextPageButton.setText("加载中...");
// 
	// if (sortByField && (sortByField !== sortedArray_sortByField || sortReverse !== sortedArray_sortReverse || groupByField !== sortedArray_groupByField)) {
		// sortedArray_sortByField = sortByField;
		// sortedArray_sortReverse = sortReverse;
		// sortedArray_groupByField = groupByField;
		// // $.table.setData([]);
		// clearTable();
		// tableRowsCount = 0;
		// currentPageNumber = 0;
	// } else {
		// tableRowsCount = tableRowsCount || exports.getRowsCount();
	// }
// 
	// function doFetchNextPage() {
		// sortedArray = [];
		// for (var i = 0; i < collections.length; i++) {
			// if (collections[i] && collections[i].length > 0) {
				// collections[i].forEach(function(item) {
					// sortedArray.push({
						// record : item,
						// collection : collections[i]
					// });
				// });
			// }
		// }
// 
		// if (sortByField) {
			// sortedArray.sort(function(a, b) {
				// var va = a.record.xDeepGet(sortByField);
				// var vb = b.record.xDeepGet(sortByField);
				// if (va < vb) {
					// return sortedArray_sortReverse ? 1 : -1;
				// } else if (va > vb) {
					// return sortedArray_sortReverse ? -1 : 1;
				// }
				// return 0;
			// });
		// }
// 
		// var newRows = [], moreRowsLength = 0;
		// if (tableRowsCount < pageSize) {
			// moreRowsLength = pageSize - tableRowsCount;
		// } else {
			// moreRowsLength = tableRowsCount % pageSize || pageSize;
		// }
		// sortedArray.slice(tableRowsCount, tableRowsCount + moreRowsLength).forEach(function(item) {
			// newRows.push(createRowView(item.record, item.collection));
		// });
// 
		// if (newRows.length > 0) {
			// $.sort(null, null, null, true, newRows, null, null, function() {
				// //$.table.scrollToIndex(tableRowsCount-1);
				// _showNoDataIndicator();
			// });
		// } else {
			// _showNoDataIndicator();
		// }
	// }
// 
	// if ($.beforeFetchNextPage) {
		// $.beforeFetchNextPage(tableRowsCount, pageSize + 1, $.getOrderBy() + " " + $.getSortOrder(), doFetchNextPage, function(err) {
			// _showNoDataIndicator();
		// });
	// } else {
		// doFetchNextPage();
	// }
};

exports.getDataCount = function() {
	var count = 0;
	for (var i = 0; i < collections.length; i++) {
		if (collections[i] && collections[i].length > 0) {
			count += collections[i].length;
		}
	}
	return count;
};

exports.getRowsCount = function() {
	var sections = $.table.getSections();
	var sectionsSize = $.table.getSectionCount();
	var count = 0;
	for (var i = 0; i < sectionsSize; i++) {
		count += sections[i].getItems().length;
	}
	return count;
};

var templates = {};
exports.addRowTemplate = function(rowViewTemplateName, rowViewTemplate) {
	templates[rowViewTemplateName] = rowViewTemplate;
};

exports.addCollection = function(collection, rowViewTemplateName) {
	$.table = Ti.UI.createListView({
	    // Maps myTemplate dictionary to 'template' string
	    templates: templates,
	    id : "table",
	    top : 60,
	    left : 0,
		bottom : 50,
		backgroundColor : "#f5f5f5",
		separatorColor : "#e1e1e1"
	});
	$.__views.table = $.table;
	$.$view.add($.table);
	
	// if (rowView) {
		collection.__rowView = rowViewTemplateName;
	// }
	if (!collection.id) {
		collection.id = guid();
	}
	collections.push(collection);

	if (collection.length > 0) {
		// if (pageSize > 0) {
// 
		// } else {
			var newRows = [];
			collection.forEach(function(item) {
				newRows.push(createRowView(item, collection));
			});
			if (newRows.length > 0) {
				$.sort(null, null, null, true, newRows);
			}
		// }
	}
	// collection.on("add", addRow);
	// collection.on("reset", resetCollection);
	// collection.on("sync", refreshCollectionOnChange, collection);
// 
	// collection.on("xFetchEnd", refreshCollection);
	// collection.on("xSetFilterEnd", refreshCollection);

	showNoDataIndicator();
	$.hideActivityIndicator();
};

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
	// $.table.setData([]);
	clearTable();
	showNoDataIndicator(0);
};

exports.clearAllCollections = function() {
	clearCollections();
};

function refreshCollectionOnChange(model) {
	if ($.$attrs.refreshTableAfterServerSync === "true" && Alloy.Globals.Server.__isSyncing) {
		return;
	}

	if (this.__compareFilter(model)) {
		$.sort(null, null, null, true, null, null, showNoDataIndicator);
		// showNoDataIndicator();
	}
}

function refreshCollection(collection, appendRows, removedRows) {
	if ($.$attrs.refreshTableAfterServerSync === "true" && Alloy.Globals.Server.__isSyncing) {
		return;
	}

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
			$.sort(null, null, null, true, newRows, removedRows, collection.id, showNoDataIndicator);
		}
	}
	// showNoDataIndicator();
}

$.onWindowCloseDo(function() {
	clearCollections();
	if (OS_ANDROID) {
		$.table.removeEventListener("postlayout", _showNoDataIndicator);
	}
	if ($.$attrs.refreshTableAfterServerSync === "true") {
		Ti.App.removeEventListener("ServerSyncFinished", exports.refreshTable);
	}
});

exports.resetTable = function() {
	for (var i = 0; i < collections.length; i++) {
		collections[i].off("reset", resetCollection);
		collections[i].reset();
		collections[i].on("reset", resetCollection);
	}
	// $.table.setData([]);
	clearTable();
	showNoDataIndicator(0);
};

var resetCollection = function(collection, options) {
	if ($.$attrs.refreshTableAfterServerSync === "true" && Alloy.Globals.Server.__isSyncing) {
		return;
	}

	var data = $.table.data.slice(0);
	options.previousModels.forEach(function(model) {
		for (var i = 0; i < data.length; i++) {
			for (var r = 0; r < data[i].rows.length; r++) {
				var row = data[i].rows[r];
				if (row.id === model.xGet("id")) {
					data[i].rows[r].fireEvent("rowremoved", {
						bubbles : false
					});
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
	// $.table.setData(data);
	showNoDataIndicator(data.length);
};

exports.removeCollection = function(collection) {
	collection.off("add", addRow);
	collection.off("reset", exports.resetCollection);
	resetCollection(collection, {
		previousModels : collection.models
	});
	var index = _.indexOf(collections, collection);
	collections[index] = null;
	collections.splice(index, 1);
};

exports.getCollections = function() {
	return collections;
};

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
	// $.headerView = headerView;
	// if (OS_ANDROID) {
		// if (Ti.Platform.Android.API_LEVEL < 11) {
		$.$view.add(headerView);
		//$.table.setTop(60);
		// $.table.setBottom(50);
		// var scrolling = false;
		// $.table.addEventListener("scroll", function(e) {
		// if (e.firstVisibleItem === 0) {
		// if($.$view.getTop() !== 0 && scrolling === false){
		// var animation = Titanium.UI.createAnimation();
		// animation.top = 0;
		// animation.bottom = 50;
		// animation.duration = 1000;
		// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		// animation.addEventListener("complete", function(){
		// scrolling = false;
		// });
		// scrolling = true;
		// $.$view.animate(animation);
		// }
		// } else {
		// if($.$view.getTop() !== -60 && scrolling === false){
		// var animation = Titanium.UI.createAnimation();
		// animation.top = -60;
		// animation.bottom = 50;
		// animation.duration = 1000;
		// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		// animation.addEventListener("complete", function(){
		// scrolling = false;
		// });
		// scrolling = true;
		// $.$view.animate(animation);
		// }
		// }
		// });
	// } else {
		// $.table.setHeaderView(headerView);
	// }
};

exports.sort = function(fieldName, reverse, groupField, refresh, appendRows, removedRows, collectionId, finishCB) {
	if (!refresh) {
		if (groupField === groupByField && sortByField === fieldName && sortReverse === reverse) {
			return;
		}

		sortByField = fieldName;
		sortReverse = reverse;
		groupByField = groupField;
	}
	$.showActivityIndicator("正在排序...");

	// if(pageSize > 0){
	// var tableRowsCount = exports.getRowsCount();
	// if(tableRowsCount < exports.getDataCount()){
	// appendRows = $.fetchNextPage(tableRowsCount, true);
	// }
	// }

	var data = $.table.getSections();
	clearTable();
	// data = _.flatten(data, true);
	data = _.pluck(data, "items");
	data = _.flatten(data, true);
	if (appendRows && appendRows.length > 0) {
		appendRows.forEach(function(row) {
			data.push(row);
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
		data.sort(function(aRow, bRow) {
			var a = findObject(aRow.id);
			var b = findObject(bRow.id);
			if (!a || !b) {
				return -1;
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
			if (!item.id) {
				return "";
			}
			var model = findObject(item.id);
			return model && getSectionNameOfRowModel(model.xDeepGet(groupByField));
		});
		data = [];
		var sectionIndex = 0;
		for (var sectionTitle in sectionData) {
			if (sectionTitle !== undefined) {
				var section = createSection(sectionTitle, sectionIndex, sectionData[sectionTitle]);
				$.table.appendSection(section);
				sectionIndex++;
			}
		}
	}
	showNoDataIndicator();
	$.hideActivityIndicator();
	if (finishCB) {
		finishCB();
	}
};

function createSection(sectionTitle, sectionIndex, sectionItems) {
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

	var sectionHeader = Ti.UI.createView({
		height : 30,
		backgroundColor : "#e9f3f0"
	});

	var titleLabel = Ti.UI.createLabel({
		text : sectionTitle,
		color : "#2E8B57",
		left : 10
	});

	sectionHeader.add(titleLabel);

	section = Ti.UI.createListSection({
		items : sectionItems,
		headerTitle : sectionTitle
		//headerView : sectionHeader
		// footerView : sectionFooter
	});
	//
	// } else {
	// section = Ti.UI.createTableViewSection({
	// headerTitle : sectionTitle
	// });
	// }

	return section;
}

var fetchingNextPage = false;
if (pageSize > 0) {
	$.fetchNextPageButton.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		exports.fetchNextPage();
	});
}

var __noDataIndicator;
function _showNoDataIndicator() {
	var dataCount = $.getDataCount();
	if (dataCount > 0) {
		// if (OS_ANDROID) {
			$.fetchNextPageFooter.setTop(null);
			$.fetchNextPageFooter.setBottom(0);
		// }
		if (dataCount > $.getRowsCount()) {
			$.fetchNextPageButton.setText("更多...");
		} else {
			$.fetchNextPageButton.setText("无更多内容");
		}
	} else {
		// if (OS_ANDROID) {
			$.fetchNextPageFooter.setBottom(null);
			$.fetchNextPageFooter.setTop(60);
		// }
		$.fetchNextPageButton.setText("无内容");
	}
	fetchingNextPage = false;
}

function showNoDataIndicator() {
	//if (OS_IOS) {
	_showNoDataIndicator();
	//}
}

exports.getPageSize = function() {
	return pageSize;
};

exports.getOrderBy = function() {
	return sortByField;
};

exports.getSortOrder = function() {
	return sortReverse ? "DESC" : "ASC";
};

function cancelBubble(e) {
	e.cancelBubble = true;
}

// $.table.addEventListener("scroll", cancelBubble);

// var lastTotalItemCount = -1;
// $.table.addEventListener("scroll", function(e){
// if(e.firstVisibleItem + e.visibleItemCount >= e.totalItemCount && e.totalItemCount > lastTotalItemCount){
// lastTotalItemCount = e.totalItemCount;
// // exports.fetchNextPage();
// }
// });
// }
exports.autoFetchNextPage = function() {
	var autoHideAnimationId = 0;
	if (OS_ANDROID) {
		var lastFirstVisibleItem = 0, fetching = false;
		$.table.addEventListener("scroll", function(e) {
			e.cancelBubble = true;
			if (e.firstVisibleItem + e.visibleItemCount >= e.totalItemCount) {
				if (e.firstVisibleItem > lastFirstVisibleItem && !fetching) {
					fetching = true;
					$.fetchNextPage();
				} else if (fetching === true) {
					fetching = false;
				}
			}
			lastFirstVisibleItem = e.firstVisibleItem;
		});
	}

	if (OS_IOS) {
		var lastDistance, direction, lastDirection = false, fetching = false;
		$.table.addEventListener("scroll", function(e) {
			e.cancelBubble = true;
			var offset = e.contentOffset.y;
			var height = e.size.height;
			var total = offset + height;
			var theEnd = e.contentSize.height;
			var distance = theEnd - total;
			if (direction < 0 && lastDirection === false && offset > 0 && distance > 0) {
				lastDirection = true;
			} else if ((direction > 0 && lastDirection === true && distance > 0) || offset < 0) {
				lastDirection = false;
			} else if (distance < 0 && direction > 0 && lastDirection === true) {
				if (!fetching) {
					$.fetchNextPage();
					fetching = true;
				}
			}
			if (fetching && distance >= 0) {
				fetching = false;
			}
			direction = distance - lastDistance;
			lastDistance = distance;
		});
	}
};
exports.autoHideFooter = function(footer) {
	// if(OS_IOS){
	// $.table.setBottom(50);
	// return;
	// }

	// var autoHideAnimationId = 0;
	// if (OS_ANDROID) {
		// var lastY, lastTop, lastFirstVisibleItem = 0, fetching = false;
		// $.table.addEventListener("scroll", function(e) {
			// e.cancelBubble = true;
			// if (e.firstVisibleItem + e.visibleItemCount >= e.totalItemCount) {
				// if (e.firstVisibleItem > lastFirstVisibleItem && !fetching) {
					// fetching = true;
					// $.fetchNextPage();
				// } else if (fetching === true) {
					// fetching = false;
// 
				// }
			// }
			// lastFirstVisibleItem = e.firstVisibleItem;
		// });
		// $.table.addEventListener("touchend", function(e) {
			// lastY = undefined;
		// });
		// $.table.addEventListener("touchstart", function(e) {
			// lastY = undefined;
		// });
		// $.table.addEventListener("touchcancel", function(e) {
			// lastY = undefined;
		// });
		// $.table.addEventListener("touchmove", function(e) {
			// e.cancelBubble = true;
			// if (lastY === undefined) {
				// lastY = e.y;
				// // console.info("++ : " + lastY);
			// } else {
				// var delta = e.y - lastY;
				// // console.info(e.y + " --- " + delta);
				// if (Math.abs(delta) > 5) {
					// if (Math.abs(delta) < 100) {
						// if (delta < 0) {
							// // if (autoHideAnimationId) {
							// // clearTimeout(autoHideAnimationId);
							// // }
							// // autoHideAnimationId = setTimeout(function() {
							// footer.slideDown();
// 
							// // }, 1);
							// lastY = e.y + 5;
						// } else if (delta > 0) {
							// // if (autoHideAnimationId) {
							// // clearTimeout(autoHideAnimationId);
							// // }
							// // autoHideAnimationId = setTimeout(function() {
							// footer.slideUp();
							// // if($.headerView && $.headerView.getRect().top <= $.headerView.getRect().height){
							// // $.headerView.setTop($.headerView.getRect().top - delta);
							// // }
							// // }, 1);
							// lastY = e.y - 5;
						// }
					// } else {
						// lastY = e.y;
					// }
				// }
			// }
		// });
	// }
// 
	// if (OS_IOS) {
		// var lastDistance, direction, lastDirection = false, fetching = false;
		// // $.table.removeEventListener("scroll", cancelBubble);
		// $.table.addEventListener("scroll", function(e) {
			// e.cancelBubble = true;
			// // if (e.firstVisibleItem + e.visibleItemCount >= e.totalItemCount) {
			// // if(touchDirectionUp) { //(lastDirection === false && e.firstVisibleItem + e.visibleItemCount >= e.totalItemCount && e.visibleItemCount < e.totalItemCount) {
			// // footer.slideDown();
			// // lastDirection = true;
			// // } else { //if ((lastDirection === true && e.firstVisibleItem + e.visibleItemCount < e.totalItemCount && e.visibleItemCount < e.totalItemCount)) {
			// // footer.slideUp();
			// // lastDirection = false
			// // }
// 
			// // direction = e.firstVisibleItem - lastDistance;
			// // lastDistance = e.firstVisibleItem;
			// // } else {
			// var offset = e.contentOffset.y;
			// var height = e.size.height;
			// var total = offset + height;
			// var theEnd = e.contentSize.height;
			// var distance = theEnd - total;
			// // going down is the only time we dynamically load,
			// // going up we can safely ignore -- note here that
			// // the values will be negative so we do the opposite
// 
			// // adjust the % of rows scrolled before we decide to start fetching
			// // var nearEnd = theEnd * .9;
// 
			// if (direction < 0 && lastDirection === false && offset > 0 && distance > 0) {
				// clearTimeout(autoHideAnimationId);
				// autoHideAnimationId = setTimeout(function() {
					// footer.slideDown();
				// }, 50);
				// lastDirection = true;
			// } else if ((direction > 0 && lastDirection === true && distance > 0) || offset < 0) {
				// clearTimeout(autoHideAnimationId);
				// autoHideAnimationId = setTimeout(function() {
					// footer.slideUp();
				// }, 50);
				// lastDirection = false;
			// } else if (distance < 0 && direction > 0 && lastDirection === true) {
				// if (!fetching) {
					// $.fetchNextPage();
					// fetching = true;
				// }
			// }
			// if (fetching && distance >= 0) {
				// fetching = false;
			// }
			// direction = distance - lastDistance;
			// lastDistance = distance;
			// // var footerTop = footer.$view.getRect().bottom - footer.$view.getRect().top;
			// // if(offset > 0 && distance > 0 && direction && footerTop <= 42 && footerTop >= 0){
			// // var bottom = Number(footer.$view.getBottom()) + direction;
			// // footer.$view.setBottom(Math.min(Math.max(bottom, -42), 0));
			// // }
		// });
	// }
};

if ($.$attrs.refreshTableAfterServerSync === "true") {
	Ti.App.addEventListener("ServerSyncFinished", exports.refreshTable);
	$.onWindowCloseDo(function() {
		Ti.App.removeEventListener("ServerSyncFinished", exports.refreshTable);
	});
}
