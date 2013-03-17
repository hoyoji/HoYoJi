var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'com.hoyoji.titanium.widget.XTableView/' + s : s.substring(0,index) + '/com.hoyoji.titanium.widget.XTableView/' + s.substring(index+1);

	// TODO: http://jira.appcelerator.org/browse/ALOY-296
	return OS_ANDROID && path.indexOf('/') !== 0 ? '/' + path : path;
}

function Controller() {
	require('alloy/controllers/' + 'BaseController').apply(this, Array.prototype.slice.call(arguments));
	
	$model = arguments[0] ? arguments[0]['$model'] : null;
	var $ = this;
	var exports = {};
	var __defers = {};
	
	// Generated code that must be executed before all UI and/or
	// controller code. One example is all model and collection 
	// declarations from markup.
	

	// Generated UI code
	$.__views.widget = Ti.UI.createView(
{backgroundColor:"white",height:Ti.UI.FILL,width:Ti.UI.FILL,id:"widget",}
);
$.addTopLevelView($.__views.widget);$.__views.table = Ti.UI.createTableView(
{id:"table",height:Ti.UI.FILL,width:Ti.UI.FILL,borderWidth:"1",borderColor:"red",allowSelection:"false",}
);
$.__views.widget.add($.__views.table);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseUIController($,arguments[0]);var collections=[],collapsibleSections={};$.$view.addEventListener("click",function(e){e.cancelBubble=true;if(e.deleteRow===true){$.table.deleteRow(e.index)}else if(e.expandSection===true){exports.expandSection(e.index,e.sectionRowId)}else if(e.collapseSection===true){exports.collapseSection(e.index,e.sectionRowId)}});function addRow(rowModel,collection){var rowViewController=Alloy.createController(rowModel.config.rowView,{$model:rowModel,$collection:collection});var row=Ti.UI.createTableViewRow();rowViewController.setParent(row);if(rowViewController.$attrs.hasDetail||rowViewController.$view.hasDetail){collapsibleSections[rowModel.xGet("id")]={parentRowController:rowViewController,rows:[]}}$.table.appendRow(row)}exports.expandSection=function(rowIndex,sectionRowId){var index=rowIndex;var sectionRows=collapsibleSections[sectionRowId].rows;var parentController=collapsibleSections[sectionRowId].parentRowController;var collections=parentController.getDetailCollections();for(var i=0;i<collections.length;i++){for(var j=0;j<collections[i].length;j++){var rowModel=collections[i].at(j);var rowViewController=Alloy.createController(rowModel.config.rowView,{$model:rowModel,$collection:collections[i]});var row=Ti.UI.createTableViewRow();rowViewController.setParent(row);sectionRows.push(row);$.table.insertRowAfter(index,row);index++}}};exports.collapseSection=function(rowIndex,sectionRowId){var index=rowIndex+1;var sectionRows=collapsibleSections[sectionRowId].rows;for(var i=0;i<sectionRows.length;i++){$.table.deleteRow(index)}collapsibleSections[sectionRowId].rows=[]};exports.addCollection=function(collection){console.info("xTableView adding collection "+collection.length);collections.push(collection);collection.map(function(row){addRow(row,collection)});collection.on("add",addRow)};var clearCollections=function(){for(var i=0;i<collections.length;i++){if(collections[i]){collections[i].off("add",addRow)}}collections=[]};$.onWindowCloseDo(clearCollections);exports.removeCollection=function(collection){collection.off("add",addRow);collections[_.indexOf(collections,collection)]=null};exports.close=function(){var animation=Titanium.UI.createAnimation();animation.top="100%";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;animation.addEventListener("complete",function(){clearCollections();$.parent.remove($.$view)});$.$view.animate(animation)};exports.open=function(top){if(top===undefined)top=42;function animate(){var animation=Titanium.UI.createAnimation();animation.top=top;animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.$view.animate(animation)}$.$view.setTop("99%");animate()};exports.createChildTable=function(theBackNavTitle,collections){$.detailsTable=Alloy.createWidget("com.hoyoji.titanium.widget.XTableView","widget",{top:"100%"});$.detailsTable.setParent($.$view);$.detailsTable.open(0);$.$view.fireEvent("navigatedown",{bubbles:true,childTableTitle:theBackNavTitle});$.detailsTable.backNavTitle=theBackNavTitle;$.detailsTable.previousBackNavTitle=$.backNavTitle;for(var i=0;i<collections.length;i++){$.detailsTable.addCollection(collections[i])}};exports.navigateUp=function(){var lastTable=$,parentTable;console.info("navigating up... from "+$.backNavTitle);while(lastTable.detailsTable){parentTable=lastTable;lastTable=lastTable.detailsTable;console.info("finding lastTable ...")}if(lastTable!==$){$.$view.fireEvent("navigateup",{bubbles:true,childTableTitle:lastTable.previousBackNavTitle});console.info("removing lastTable ..."+lastTable.backNavTitle+" from its parentTable "+parentTable.backNavTitle);parentTable.detailsTable=null;lastTable.close()}}

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;