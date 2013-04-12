var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'com.hoyoji.titanium.widget.NumericKeyboard/' + s : s.substring(0,index) + '/com.hoyoji.titanium.widget.NumericKeyboard/' + s.substring(index+1);

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
{zIndex:"900",width:Ti.UI.FILL,top:"100%",height:"176",id:"widget",}
);
$.addTopLevelView($.__views.widget);$.__views.__alloyId2 = Ti.UI.createView(
{backgroundColor:"white",opacity:"0.5",height:Ti.UI.FILL,width:Ti.UI.FILL,id:"__alloyId2",}
);
$.__views.widget.add($.__views.__alloyId2);
$.__views.__alloyId3 = Ti.UI.createView(
{top:"0",height:Ti.UI.SIZE,layout:"horizontal",visible:"false",id:"__alloyId3",}
);
$.__views.widget.add($.__views.__alloyId3);
$.__views.label = Ti.UI.createLabel(
{color:"#000",font:{fontSize:18,fontWeight:"bold",},height:Ti.UI.SIZE,width:"40%",text:'金额',id:"label",}
);
$.__views.__alloyId3.add($.__views.label);
$.__views.number = Ti.UI.createTextField(
{id:"number",width:"60%",value:"0",}
);
$.__views.__alloyId3.add($.__views.number);
$.__views.__alloyId4 = Ti.UI.createView(
{top:"0",height:Ti.UI.SIZE,layout:"horizontal",id:"__alloyId4",}
);
$.__views.widget.add($.__views.__alloyId4);
$.__views.__alloyId5 = Ti.UI.createButton(
{width:"20%",title:"7",id:"__alloyId5",}
);
$.__views.__alloyId4.add($.__views.__alloyId5);
numPress?$.__views.__alloyId5.addEventListener('singletap',numPress):__defers['$.__views.__alloyId5!singletap!numPress']=true;$.__views.__alloyId6 = Ti.UI.createButton(
{width:"20%",title:"8",id:"__alloyId6",}
);
$.__views.__alloyId4.add($.__views.__alloyId6);
numPress?$.__views.__alloyId6.addEventListener('singletap',numPress):__defers['$.__views.__alloyId6!singletap!numPress']=true;$.__views.__alloyId7 = Ti.UI.createButton(
{width:"20%",title:"9",id:"__alloyId7",}
);
$.__views.__alloyId4.add($.__views.__alloyId7);
numPress?$.__views.__alloyId7.addEventListener('singletap',numPress):__defers['$.__views.__alloyId7!singletap!numPress']=true;$.__views.__alloyId8 = Ti.UI.createButton(
{width:"20%",title:"÷",id:"__alloyId8",}
);
$.__views.__alloyId4.add($.__views.__alloyId8);
operation?$.__views.__alloyId8.addEventListener('singletap',operation):__defers['$.__views.__alloyId8!singletap!operation']=true;$.__views.__alloyId9 = Ti.UI.createButton(
{width:"20%",title:"C",id:"__alloyId9",}
);
$.__views.__alloyId4.add($.__views.__alloyId9);
clear?$.__views.__alloyId9.addEventListener('singletap',clear):__defers['$.__views.__alloyId9!singletap!clear']=true;$.__views.__alloyId10 = Ti.UI.createView(
{top:"44",height:Ti.UI.SIZE,layout:"horizontal",id:"__alloyId10",}
);
$.__views.widget.add($.__views.__alloyId10);
$.__views.__alloyId11 = Ti.UI.createButton(
{width:"20%",title:"4",id:"__alloyId11",}
);
$.__views.__alloyId10.add($.__views.__alloyId11);
numPress?$.__views.__alloyId11.addEventListener('singletap',numPress):__defers['$.__views.__alloyId11!singletap!numPress']=true;$.__views.__alloyId12 = Ti.UI.createButton(
{width:"20%",title:"5",id:"__alloyId12",}
);
$.__views.__alloyId10.add($.__views.__alloyId12);
numPress?$.__views.__alloyId12.addEventListener('singletap',numPress):__defers['$.__views.__alloyId12!singletap!numPress']=true;$.__views.__alloyId13 = Ti.UI.createButton(
{width:"20%",title:"6",id:"__alloyId13",}
);
$.__views.__alloyId10.add($.__views.__alloyId13);
numPress?$.__views.__alloyId13.addEventListener('singletap',numPress):__defers['$.__views.__alloyId13!singletap!numPress']=true;$.__views.__alloyId14 = Ti.UI.createButton(
{width:"20%",title:"×",id:"__alloyId14",}
);
$.__views.__alloyId10.add($.__views.__alloyId14);
operation?$.__views.__alloyId14.addEventListener('singletap',operation):__defers['$.__views.__alloyId14!singletap!operation']=true;$.__views.__alloyId15 = Ti.UI.createButton(
{width:"20%",title:"←",id:"__alloyId15",}
);
$.__views.__alloyId10.add($.__views.__alloyId15);
backspace?$.__views.__alloyId15.addEventListener('singletap',backspace):__defers['$.__views.__alloyId15!singletap!backspace']=true;$.__views.__alloyId16 = Ti.UI.createView(
{top:"88",height:Ti.UI.SIZE,layout:"horizontal",id:"__alloyId16",}
);
$.__views.widget.add($.__views.__alloyId16);
$.__views.__alloyId17 = Ti.UI.createButton(
{width:"20%",title:"1",id:"__alloyId17",}
);
$.__views.__alloyId16.add($.__views.__alloyId17);
numPress?$.__views.__alloyId17.addEventListener('singletap',numPress):__defers['$.__views.__alloyId17!singletap!numPress']=true;$.__views.__alloyId18 = Ti.UI.createButton(
{width:"20%",title:"2",id:"__alloyId18",}
);
$.__views.__alloyId16.add($.__views.__alloyId18);
numPress?$.__views.__alloyId18.addEventListener('singletap',numPress):__defers['$.__views.__alloyId18!singletap!numPress']=true;$.__views.__alloyId19 = Ti.UI.createButton(
{width:"20%",title:"3",id:"__alloyId19",}
);
$.__views.__alloyId16.add($.__views.__alloyId19);
numPress?$.__views.__alloyId19.addEventListener('singletap',numPress):__defers['$.__views.__alloyId19!singletap!numPress']=true;$.__views.__alloyId20 = Ti.UI.createButton(
{width:"20%",title:"-",id:"__alloyId20",}
);
$.__views.__alloyId16.add($.__views.__alloyId20);
operation?$.__views.__alloyId20.addEventListener('singletap',operation):__defers['$.__views.__alloyId20!singletap!operation']=true;$.__views.__alloyId21 = Ti.UI.createButton(
{width:"20%",title:"取消",id:"__alloyId21",}
);
$.__views.__alloyId16.add($.__views.__alloyId21);
close?$.__views.__alloyId21.addEventListener('singletap',close):__defers['$.__views.__alloyId21!singletap!close']=true;$.__views.__alloyId22 = Ti.UI.createView(
{top:"132",height:Ti.UI.SIZE,layout:"horizontal",id:"__alloyId22",}
);
$.__views.widget.add($.__views.__alloyId22);
$.__views.__alloyId23 = Ti.UI.createButton(
{width:"20%",title:".",id:"__alloyId23",}
);
$.__views.__alloyId22.add($.__views.__alloyId23);
decimal?$.__views.__alloyId23.addEventListener('singletap',decimal):__defers['$.__views.__alloyId23!singletap!decimal']=true;$.__views.__alloyId24 = Ti.UI.createButton(
{width:"20%",title:"0",id:"__alloyId24",}
);
$.__views.__alloyId22.add($.__views.__alloyId24);
numPress?$.__views.__alloyId24.addEventListener('singletap',numPress):__defers['$.__views.__alloyId24!singletap!numPress']=true;$.__views.__alloyId25 = Ti.UI.createButton(
{width:"20%",title:"=",id:"__alloyId25",}
);
$.__views.__alloyId22.add($.__views.__alloyId25);
operation?$.__views.__alloyId25.addEventListener('singletap',operation):__defers['$.__views.__alloyId25!singletap!operation']=true;$.__views.__alloyId26 = Ti.UI.createButton(
{width:"20%",title:"+",id:"__alloyId26",}
);
$.__views.__alloyId22.add($.__views.__alloyId26);
operation?$.__views.__alloyId26.addEventListener('singletap',operation):__defers['$.__views.__alloyId26!singletap!operation']=true;$.__views.submitButton = Ti.UI.createButton(
{width:"20%",id:"submitButton",title:"确定",}
);
$.__views.__alloyId22.add($.__views.submitButton);
submitValue?$.__views.submitButton.addEventListener('singletap',submitValue):__defers['$.__views.submitButton!singletap!submitValue']=true;exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	var activeTextField,oldValue=0;exports.close=function(){if(!activeTextField)return;activeTextField=null;var animation=Titanium.UI.createAnimation();animation.top="100%";animation.duration=300;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.widget.animate(animation)};exports.open=function(textField){if(!activeTextField){$.number.focus();$.number.blur();var animation=Titanium.UI.createAnimation();animation.top=$.parent.getSize().height-176;animation.duration=300;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.widget.animate(animation)}activeTextField=textField;oldValue=activeTextField.getValue();$.number.setValue(activeTextField.getValue())};var accum=0;var flagNewNum=false;var pendingOp="";var numSubmit=0;function numPress(e){if(flagNewNum){$.number.setValue(e.source.getTitle());activeTextField.setValue(e.source.getTitle());flagNewNum=false}else{if($.number.getValue()==="0"){$.number.setValue(e.source.getTitle());activeTextField.setValue(e.source.getTitle())}else{var thisNum=$.number.getValue()+e.source.getTitle();$.number.setValue(thisNum);activeTextField.setValue(thisNum)}}activeTextField.fireEvent("change")}function operation(e){var readout=$.number.getValue();var pendOp=pendingOp;if(flagNewNum&&pendOp!=="=");else{flagNewNum=true;if("+"===pendOp){accum+=parseFloat(readout)}else if("-"===pendOp){if(readout.indexOf(".")!==-1){var num=readout.length-readout.indexOf(".")-1;accum=(accum-parseFloat(readout)).toFixed(num)-0}else{accum=accum-parseFloat(readout)}}else if("÷"===pendOp){if(parseFloat(readout)===0){readout=0}else{accum/=parseFloat(readout)}}else if("×"===pendOp){accum*=parseFloat(readout)}else{accum=parseFloat(readout)}accum=parseFloat(accum).toFixed(2)/1;$.number.setValue(accum+"");activeTextField.setValue(accum+"");activeTextField.fireEvent("change");pendingOp=e.source.getTitle()}}function decimal(){var curReadOut=$.number.getValue();if(flagNewNum){curReadOut="0.";flagNewNum=false}else{if(curReadOut.indexOf(".")==-1){curReadOut+="."}}$.number.setValue(curReadOut);activeTextField.setValue(curReadOut);activeTextField.fireEvent("change")}function backspace(){var readout=$.number.getValue();var len=readout.length;if(len>1){if(parseFloat(readout)<0&&len===2){$.number.setValue("0");activeTextField.setValue("0")}else{var rout=readout.substr(0,len-1);$.number.setValue(rout);activeTextField.setValue(rout)}}else{$.number.setValue("0");activeTextField.setValue("0");activeTextField.fireEvent("change")}}function clear(e){accum=0;pendingOp="";$.number.setValue("0");activeTextField.setValue("0");flagNewNum=true}function close(){activeTextField.setValue(oldValue);exports.close()}function submitValue(){oldValue=$.number.getValue();exports.close()}

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	__defers['$.__views.__alloyId5!singletap!numPress'] && $.__views.__alloyId5.addEventListener('singletap',numPress);__defers['$.__views.__alloyId6!singletap!numPress'] && $.__views.__alloyId6.addEventListener('singletap',numPress);__defers['$.__views.__alloyId7!singletap!numPress'] && $.__views.__alloyId7.addEventListener('singletap',numPress);__defers['$.__views.__alloyId8!singletap!operation'] && $.__views.__alloyId8.addEventListener('singletap',operation);__defers['$.__views.__alloyId9!singletap!clear'] && $.__views.__alloyId9.addEventListener('singletap',clear);__defers['$.__views.__alloyId11!singletap!numPress'] && $.__views.__alloyId11.addEventListener('singletap',numPress);__defers['$.__views.__alloyId12!singletap!numPress'] && $.__views.__alloyId12.addEventListener('singletap',numPress);__defers['$.__views.__alloyId13!singletap!numPress'] && $.__views.__alloyId13.addEventListener('singletap',numPress);__defers['$.__views.__alloyId14!singletap!operation'] && $.__views.__alloyId14.addEventListener('singletap',operation);__defers['$.__views.__alloyId15!singletap!backspace'] && $.__views.__alloyId15.addEventListener('singletap',backspace);__defers['$.__views.__alloyId17!singletap!numPress'] && $.__views.__alloyId17.addEventListener('singletap',numPress);__defers['$.__views.__alloyId18!singletap!numPress'] && $.__views.__alloyId18.addEventListener('singletap',numPress);__defers['$.__views.__alloyId19!singletap!numPress'] && $.__views.__alloyId19.addEventListener('singletap',numPress);__defers['$.__views.__alloyId20!singletap!operation'] && $.__views.__alloyId20.addEventListener('singletap',operation);__defers['$.__views.__alloyId21!singletap!close'] && $.__views.__alloyId21.addEventListener('singletap',close);__defers['$.__views.__alloyId23!singletap!decimal'] && $.__views.__alloyId23.addEventListener('singletap',decimal);__defers['$.__views.__alloyId24!singletap!numPress'] && $.__views.__alloyId24.addEventListener('singletap',numPress);__defers['$.__views.__alloyId25!singletap!operation'] && $.__views.__alloyId25.addEventListener('singletap',operation);__defers['$.__views.__alloyId26!singletap!operation'] && $.__views.__alloyId26.addEventListener('singletap',operation);__defers['$.__views.submitButton!singletap!submitValue'] && $.__views.submitButton.addEventListener('singletap',submitValue);

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;