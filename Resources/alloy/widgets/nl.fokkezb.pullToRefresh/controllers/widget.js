var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'nl.fokkezb.pullToRefresh/' + s : s.substring(0,index) + '/nl.fokkezb.pullToRefresh/' + s.substring(index+1);

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
	$.__views.headerPullView = Ti.UI.createView(
{backgroundColor:"#e2e7ed",top:0,right:0,left:0,height:60,id:"headerPullView",}
);
$.addTopLevelView($.__views.headerPullView);$.__views.arrow = Ti.UI.createImageView(
{left:20,bottom:10,width:23,height:60,image:WPATH('images/whiteArrow.png'),id:"arrow",}
);
$.__views.headerPullView.add($.__views.arrow);
$.__views.activityIndicator = Ti.UI.createActivityIndicator(
{left:20,bottom:13,width:30,height:30,id:"activityIndicator",}
);
$.__views.headerPullView.add($.__views.activityIndicator);
$.__views.status = Ti.UI.createLabel(
{color:"#576c89",font:{fontSize:13,fontWeight:"bold",},text:'Pull down to refresh',textAlign:"center",left:55,bottom:30,width:200,id:"status",}
);
$.__views.headerPullView.add($.__views.status);
$.__views.updated = Ti.UI.createLabel(
{color:"#576c89",font:{fontSize:12,},textAlign:"center",left:55,bottom:15,width:200,id:"updated",}
);
$.__views.headerPullView.add($.__views.updated);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	var args=arguments[0]||{};var options=null;var initted=false;var pulling=false;var pulled=false;var loading=false;var offset=0;function doShow(msg){if(pulled){return false}pulled=true;$.status.text=msg||options.msgUpdating;$.arrow.hide();$.activityIndicator.show();options.table.setContentInsets({top:80},{animated:true});return true}function doHide(){if(!pulled){return false}options.table.setContentInsets({top:0},{animated:true});$.activityIndicator.hide();$.arrow.transform=Ti.UI.create2DMatrix();$.arrow.show();$.status.text=options.msgPull;pulled=false}function setDate(date){if(date===false){$.updated.hide()}else{$.updated.show();if(date!==true){$.updated.text=String.format(options.msgUpdated,String.formatDate(date,"short"),String.formatTime(date,"short"))}}}function doTrigger(){if(loading){return false}loading=true;doShow();options.loader(finishLoading)}function finishLoading(success){if(success){setDate(new Date)}doHide();loading=false}function scrollListener(e){offset=e.contentOffset.y;if(pulled){return}if(pulling&&!loading&&offset>-80&&offset<0){pulling=false;var unrotate=Ti.UI.create2DMatrix();$.arrow.animate({transform:unrotate,duration:180});$.status.text=options.msgPull}else if(!pulling&&!loading&&offset<-80){pulling=true;var rotate=Ti.UI.create2DMatrix().rotate(180);$.arrow.animate({transform:rotate,duration:180});$.status.text=options.msgRelease}}function dragEndListener(e){if(!pulled&&pulling&&!loading&&offset<-80){pulling=false;doTrigger()}}function doInit(args){if(initted){return false}options=_.defaults(args,{msgPull:"Pull down to refresh...",msgRelease:"Release to refresh...",msgUpdating:"Updating...",msgUpdated:"Last Updated: %s %s"});options.table.setHeaderPullView($.headerPullView);options.table.addEventListener("scroll",scrollListener);options.table.addEventListener("dragEnd",dragEndListener)}function doRemove(){if(!initted){return false}options.table.setHeaderPullView(null);options.table.removeEventListener("scroll",scrollListener);options.table.removeEventListener("dragEnd",dragEndListener);options=null;initted=false;pulling=false;loading=false;shown=false;offset=0}if(args.table&&args.loader){doInit(args)}exports.init=doInit;exports.show=doShow;exports.hide=doHide;exports.date=setDate;exports.trigger=doTrigger;exports.remove=doRemove

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;