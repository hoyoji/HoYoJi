var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'com.hoyoji.titanium.widget.ScrollableViewTabBar/' + s : s.substring(0,index) + '/com.hoyoji.titanium.widget.ScrollableViewTabBar/' + s.substring(index+1);

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
{width:Ti.UI.FILL,height:"47",top:"0",backgroundColor:"#00000000",zIndex:"1",id:"widget",}
);
$.addTopLevelView($.__views.widget);$.__views.__alloyId0 = Ti.UI.createView(
{width:Ti.UI.FILL,height:Ti.UI.SIZE,backgroundColor:"white",top:"0",zIndex:"1",id:"__alloyId0",}
);
$.__views.widget.add($.__views.__alloyId0);
$.__views.hightlight = Ti.UI.createLabel(
{color:"#000",font:{fontSize:18,fontWeight:"bold",},height:"5",width:"20%",id:"hightlight",backgroundColor:"cyan",top:"0",}
);
$.__views.__alloyId0.add($.__views.hightlight);
$.__views.tabs = Ti.UI.createView(
{id:"tabs",width:Ti.UI.FILL,height:"42",top:"5",layout:"horizontal",backgroundColor:"black",zIndex:"0",}
);
$.__views.widget.add($.__views.tabs);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseUIController($,arguments[0]);var currentTab=0;var scrollableView=null;var isExpanded=true;var hideTimeoutId=null;var firstTimeOpen=true;function animateHideTabBar(){if(firstTimeOpen)firstTimeOpen=false;var animation=Titanium.UI.createAnimation();animation.top="-42";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;animation.addEventListener("complete",function(){$.widget.height="5";isExpanded=false});$.tabs.animate(animation)}function hideTabBar(timeout){hideTimeoutId=setTimeout(animateHideTabBar,timeout)}function hightLightTab(e){if(e.source!==scrollableView){return}if(e.currentPage>=0&&e.currentPage<=4){if(currentTab!==e.currentPage){$.tabs.getChildren()[currentTab].setBackgroundColor("white");$.tabs.getChildren()[e.currentPage].setBackgroundColor("cyan");currentTab=e.currentPage;hideTabBar(800)}else{if(firstTimeOpen){firstTimeOpen=false;hideTabBar(800)}else{hideTabBar(1)}}}}exports.init=function(scView){scrollableView=scView;var views=scrollableView.getViews();var tabWidth=1/views.length*100+"%";$.hightlight.setWidth(tabWidth);views.map(function(view){var label=Ti.UI.createLabel({backgroundColor:"white",color:"black",text:view.title,textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,width:tabWidth,top:0,height:42});$.tabs.add(label)});currentTab=scrollableView.getCurrentPage();$.tabs.getChildren()[currentTab].setBackgroundColor("cyan");$.hightlight.setLeft(currentTab/views.length*100+"%");scrollableView.addEventListener("scrollEnd",hightLightTab);scrollableView.addEventListener("scroll",function(e){if(e.source!==scrollableView){return}if(!isExpanded){isExpanded=true;$.widget.height="47";var animation=Titanium.UI.createAnimation();animation.top="5";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.tabs.animate(animation)}$.hightlight.setLeft(e.currentPageAsFloat*$.hightlight.getSize().width);clearTimeout(hideTimeoutId)});setTimeout(animateHideTabBar,1e3)}

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;