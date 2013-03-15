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
	Alloy.Globals.extendsBaseUIController($,arguments[0]);var collections=[];$.table.addEventListener("scroll",function(e){console.info("........... "+e.contentOffset.y);if(e.contentOffset.y<=0){e.cancelBubbles=true}});$.$view.addEventListener("click",function(e){if(e.deleterow===true){e.cancelBubble=true;$.table.deleteRow(e.index)}});function addRow(rowModel,collection){var rowView=Alloy.createController(rowModel.config.rowView,{$model:rowModel,$collection:collection});var row=Ti.UI.createTableViewRow();rowView.setParent(row);$.table.appendRow(row)}exports.addCollection=function(collection){console.info("xTableView adding collection "+collection.length);collections.push(collection);collection.map(function(row){addRow(row,collection)});collection.on("add",addRow)};var clearCollections=function(){for(var i=0;i<collections.length;i++){if(collections[i]){collections[i].off("add",addRow)}}collections=[]};$.onWindowCloseDo(clearCollections);exports.removeCollection=function(collection){collection.off("add",addRow);collections[_.indexOf(collections,collection)]=null};exports.close=function(){var animation=Titanium.UI.createAnimation();animation.top="100%";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;animation.addEventListener("complete",function(){clearCollections();$.parent.remove($.$view)});$.$view.animate(animation)};exports.open=function(top){if(top===undefined)top=42;function animate(){var animation=Titanium.UI.createAnimation();animation.top=top;animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.$view.animate(animation)}$.$view.setTop("99%");animate()};exports.createChildTable=function(theBackNavTitle,collections){$.detailsTable=Alloy.createWidget("com.hoyoji.titanium.widget.XTableView","widget",{top:"100%"});$.detailsTable.setParent($.$view);$.detailsTable.open(0);$.$view.fireEvent("navigatedown",{bubbles:true,childTableTitle:theBackNavTitle});$.detailsTable.backNavTitle=theBackNavTitle;$.detailsTable.previousBackNavTitle=$.backNavTitle;for(var i=0;i<collections.length;i++){$.detailsTable.addCollection(collections[i])}};exports.navigateUp=function(){var lastTable=$,parentTable;console.info("navigating up... from "+$.backNavTitle);while(lastTable.detailsTable){parentTable=lastTable;lastTable=lastTable.detailsTable;console.info("finding lastTable ...")}if(lastTable!==$){$.$view.fireEvent("navigateup",{bubbles:true,childTableTitle:lastTable.previousBackNavTitle});console.info("removing lastTable ..."+lastTable.backNavTitle+" from its parentTable "+parentTable.backNavTitle);parentTable.detailsTable=null;lastTable.close()}}

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;