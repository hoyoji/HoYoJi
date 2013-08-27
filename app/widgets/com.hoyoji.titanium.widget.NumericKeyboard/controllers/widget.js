Alloy.Globals.extendsBaseUIController($, arguments[0]);

var activeTextField, confirmCB = null, openBottom = 0;

exports.close = function() {
	console.info("close NumericKeyboard");
	if (!activeTextField)
		return;
	// $.$view.removeEventListener("touchstart", exports.close);
	// $.keyboard.removeEventListener("touchstart", cancelBubbleTouchStart);
	
	activeTextField = null;
	var animation = Titanium.UI.createAnimation();
	animation.bottom = -252;
	animation.duration = 300;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	animation.addEventListener("complete", function(){
		// $.widget.setVisible(false);
		$.widget.hide();
	});
	$.keyboard.animate(animation);
};

function cancelBubbleTouchStart(e){
		e.cancelBubble = true;
}

$.$view.addEventListener("touchstart", exports.close);
$.keyboard.addEventListener("touchstart", cancelBubbleTouchStart);


exports.open = function(textField, saveCB, bottom) {
	confirmCB = saveCB;
	// if(confirmCB){
		// $.submitButton.setTitle("保存");
	// } else {
		// $.submitButton.setTitle("确认");
	// }
	openBottom = bottom ? bottom : 0;
	
	if (activeTextField !== textField){	
		activeTextField = textField;
			// $.display.setText($.display.getText());
			var animation = Titanium.UI.createAnimation();
			animation.bottom = 0;
			animation.duration = 300;
			animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
			$.widget.setBottom(openBottom);
			$.widget.setVisible(true);
			$.keyboard.animate(animation);	
			$.display.setText(activeTextField.getValue());
	} else {
		return;
	}
};

var accum = 0;
var flagNewNum = false;
var pendingOp = "";
var numSubmit = 0;
var latestClickOp ="";
//输入数字操作
function numPress(e) {
	
	if (flagNewNum) {
		// activeTextField.setValue(e.source.getTitle());
		$.display.setText(e.source.getTitle());
		flagNewNum = false;
	} else {
		var readout = $.display.getText() || "0";
		// if(!readout){
			// readout = 0;
		// }else{
			// readout = readout + "";
		// }
		if (readout === "0" || readout === "") {
			// activeTextField.setValue(e.source.getTitle());
			$.display.setText(e.source.getTitle());
		} else {
			var thisNum = readout + e.source.getTitle();
			// activeTextField.setValue(thisNum);
			$.display.setText(thisNum);
		}
	}
	// activeTextField.field.fireEvent("change");
	setOPColor();
}

function doubleClickNumPress(e){
	numPress(e);
	numPress(e);
}

//+-*/操作
function operation(e) {
	var readout = $.display.getText() || "0";
	// if(!readout){
		// readout = "0";
	// }else{
		// readout = readout + "";
	// }
	// if($.display.getText()===""){
		// readout = 0;
	// }
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
		// accum = parseFloat(accum).toFixed(2) / 1;
		// activeTextField.setValue(accum + "");
		$.display.setText(accum + "");
		
		// activeTextField.field.fireEvent("change");
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
	var curReadOut = $.display.getText() || "0";
	// if(!curReadOut){
		// curReadOut = "0";
	// }else{
		// curReadOut = curReadOut + "";
	// }
	if (flagNewNum) {
		curReadOut = "0.";
		flagNewNum = false;
	} else {
		if (curReadOut.indexOf(".") == -1) {
			curReadOut += ".";
			// oldValue = ".";
		}else{
			// oldValue = "";
		}
	}
	// activeTextField.setValue(curReadOut);
	$.display.setText(curReadOut);
	// activeTextField.field.fireEvent("change");
	setOPColor();
}

//退格键
function backspace() {
	var readout = $.display.getText();
	// if(!readout){
		// readout = "0";
	// }else{
		// readout = readout + "";
	// }
	var len = readout.length;
	if (len > 1) {
		if (parseFloat(readout) < 0 && len === 2) {
			// activeTextField.setValue("");
			$.display.setText("");
		} else {
			var rout = readout.substr(0, len - 1);
			// activeTextField.setValue(rout);
			$.display.setText(rout);
		}
	} else {
		// activeTextField.setValue("");
		$.display.setText("");
	}
	// activeTextField.field.fireEvent("change");
	setOPColor();
}

function doubleClickBackspace(e){
	backspace(e);
	backspace(e);
}

//清除
function clear() {
	accum = 0;
	pendingOp = "";
	// activeTextField.setValue("");
	$.display.setText("");
	flagNewNum = true;
	// activeTextField.field.fireEvent("change");
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
	equalToValue();
	// exports.close();
	if(confirmCB){
		confirmCB();
	}
}

//取消
function cancel() {
	exports.close();
	clear();
}

//提交触发=操作
function equalToValue() {
	if(pendingOp !== "=" && pendingOp !== ""){
		var readout = $.display.getText();
		// if(!readout){
			// readout = "0";
		// }else{
			// readout = readout + "";
		// }
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
			$.display.setText(accum + "");
			// activeTextField.setValue($.display.getText());
			// activeTextField.field.fireEvent("change");
			pendingOp = "=";
		}
	}
	activeTextField.setValue($.display.getText());
	activeTextField.field.fireEvent("change");
	exports.close();
	clear();
}
