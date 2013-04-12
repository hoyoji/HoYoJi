Alloy.Globals.extendsBaseUIController($, arguments[0]);

var activeTextField, oldValue=0, confirmCB = null, openBottom = 0;

exports.close = function() {
	console.info("close NumericKeyboard");
	if (!activeTextField)
		return;
	activeTextField.$view.removeEventListener("touchstart", cancelTouchStart);
	activeTextField = null;
	var animation = Titanium.UI.createAnimation();
	animation.bottom = -168;
	animation.duration = 300;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	$.widget.animate(animation);
}

var cancelTouchStart = function(e){
		e.cancelBubble = true;
}

exports.open = function(textField, saveCB, bottom) {
	confirmCB = saveCB;
	if(confirmCB){
		$.submitButton.setTitle("保存");
	} else {
		$.submitButton.setTitle("确认");
	}
	openBottom = bottom ? bottom : 0;
	
	if (!activeTextField) {
		activeTextField = textField;
		activeTextField.$view.fireEvent("touchstart"); // close other pickers
		activeTextField.$view.addEventListener("touchstart", cancelTouchStart);
		
		function animateOpen(){
			// $.widget.removeEventListener("postlayout", animateOpen);
			var animation = Titanium.UI.createAnimation();
			animation.bottom = openBottom;
			animation.duration = 300;
			animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
			$.widget.animate(animation);	
		}
		// $.widget.addEventListener("postlayout", animateOpen);
		animateOpen();
	} else if (activeTextField !== textField){
		activeTextField.$view.removeEventListener("touchstart", cancelTouchStart);
		activeTextField = textField;
		activeTextField.$view.addEventListener("touchstart", cancelTouchStart);
	} else {
		return;
	}
	
	oldValue = activeTextField.getValue();
}

$.onWindowOpenDo(function(){
	$.$view.addEventListener("touchstart", function(e){
		e.cancelBubble = true;
	});
	$.getCurrentWindow().$view.addEventListener("touchstart", function(e){
		if(activeTextField && e.source !== activeTextField.$view){
			exports.close();
		}
	});
});

var accum = 0;
var flagNewNum = false;
var pendingOp = "";
var numSubmit = 0;
var latestClickOp ="";
//输入数字操作
function numPress(e) {
	if (flagNewNum) {
		activeTextField.setValue(e.source.getTitle());
		flagNewNum = false;
	} else {
		if (activeTextField.getValue() === "0" || !activeTextField.getValue()) {
			activeTextField.setValue(e.source.getTitle());
		} else {
			var thisNum = activeTextField.getValue() + e.source.getTitle();
			activeTextField.setValue(thisNum);
		}
	}
	setOPColor();
	activeTextField.field.fireEvent("change");
}

//+-*/操作
function operation(e) {
	var readout = activeTextField.getValue();
	if(activeTextField.getValue()===""){
		readout = 0;
	}
	var pendOp = pendingOp;
	if (flagNewNum && pendOp !== "=");
	else {
		flagNewNum = true;
		if ('+' === pendOp) {
			accum += parseFloat(readout);
		} else if ('-' === pendOp) {
			if (readout.indexOf(".") !== -1) {
				var num = readout.length - readout.indexOf(".") - 1;
				accum = (accum - parseFloat(readout)).toFixed(num) - 0.0;
			} else {
				accum = accum - parseFloat(readout);
			}
		} else if ('÷' === pendOp) {
			if (parseFloat(readout) === 0) {
				readout = 0;
			} else {
				accum /= parseFloat(readout);
			}
		} else if ('×' === pendOp) {
			accum *= parseFloat(readout);
		} else {
			accum = parseFloat(readout);
		}
		accum = parseFloat(accum).toFixed(2) / 1;
		activeTextField.setValue(accum + "");
		
		activeTextField.field.fireEvent("change");
		pendingOp = e.source.getTitle();
	}
	if(latestClickOp === ""){
		e.source.setColor("blue");
	}else if(latestClickOp !== e.source){
		latestClickOp.setColor("black");
		e.source.setColor("blue");
	}
	latestClickOp = e.source;
}

//小数点
function decimal() {
	var curReadOut = activeTextField.getValue();
	if (flagNewNum) {
		curReadOut = "0.";
		flagNewNum = false;
	} else {
		if (curReadOut.indexOf(".") == -1) {
			curReadOut += ".";
		}
	}
	activeTextField.setValue(curReadOut);
	activeTextField.field.fireEvent("change");
	setOPColor();
}

//退格键
function backspace() {
	var readout = activeTextField.getValue();
	var len = readout.length;
	if (len > 1) {
		if (parseFloat(readout) < 0 && len === 2) {
			activeTextField.setValue("0");
		} else {
			var rout = readout.substr(0, len - 1);
			activeTextField.setValue(rout);
		}
	} else {
		activeTextField.setValue("0");
	}
	activeTextField.field.fireEvent("change");
	setOPColor();
}

//清除
function clear(e) {
	accum = 0;
	pendingOp = "";
	activeTextField.setValue("0");
	flagNewNum = true;
	setOPColor();
}

function setOPColor(){
	if(latestClickOp !== ""){
		latestClickOp.setColor("black");
		latestClickOp = "";
	}
}
//提交
function submitValue() {
	// oldValue = $.number.getValue();
	exports.close();
	if(confirmCB){
		confirmCB();
	}
}

