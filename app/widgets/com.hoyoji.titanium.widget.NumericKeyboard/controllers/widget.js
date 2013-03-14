var activeTextField, oldValue=0;

exports.close = function() {
	if (!activeTextField)
		return;
	activeTextField = null;
	var animation = Titanium.UI.createAnimation();
	animation.top = "100%"
	animation.duration = 300;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	$.widget.animate(animation);
}

exports.open = function(textField) {
	if (!activeTextField) {
		$.number.focus();
		$.number.blur(); // to hide the soft keyboard
	
		var animation = Titanium.UI.createAnimation();
		animation.top = $.parent.getSize().height - 176;
		animation.duration = 300;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		$.widget.animate(animation);
	}
	activeTextField = textField;
	oldValue = activeTextField.getValue();
	$.number.setValue(activeTextField.getValue());
}
var accum = 0;
var flagNewNum = false;
var pendingOp = "";
var numSubmit = 0;
//输入数字操作
function numPress(e) {
	if (flagNewNum) {
		$.number.setValue(e.source.getTitle());
		activeTextField.setValue(e.source.getTitle());
		flagNewNum = false;
	} else {
		if ($.number.getValue() === "0") {
			$.number.setValue(e.source.getTitle());
			activeTextField.setValue(e.source.getTitle());
		} else {
			var thisNum = $.number.getValue() + e.source.getTitle();
			$.number.setValue(thisNum);
			activeTextField.setValue(thisNum);
		}
	}
	activeTextField.fireEvent("change");
}

//+-*/操作
function operation(e) {
	var readout = $.number.getValue();
	var pendOp = pendingOp;
	if (flagNewNum && pendOp !== "=")
		;
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
		$.number.setValue(accum + "");
		activeTextField.setValue(accum + "");
		activeTextField.fireEvent("change");
		pendingOp = e.source.getTitle();
	}
}

//小数点
function decimal() {
	var curReadOut = $.number.getValue();
	if (flagNewNum) {
		curReadOut = "0.";
		flagNewNum = false;
	} else {
		if (curReadOut.indexOf(".") == -1) {
			curReadOut += ".";
		}
	}
	$.number.setValue(curReadOut);
	activeTextField.setValue(curReadOut);
		activeTextField.fireEvent("change");
}

//退格键
function backspace() {
	var readout = $.number.getValue();
	var len = readout.length;
	if (len > 1) {
		if (parseFloat(readout) < 0 && len === 2) {
			$.number.setValue("0");
			activeTextField.setValue("0");
		} else {
			var rout = readout.substr(0, len - 1);
			$.number.setValue(rout);
			activeTextField.setValue(rout);
		}
	} else {
		$.number.setValue("0");
		activeTextField.setValue("0");
		activeTextField.fireEvent("change");
	}
}

//清除
function clear(e) {
	accum = 0;
	pendingOp = "";
	$.number.setValue("0");
	activeTextField.setValue("0");
	flagNewNum = true;
}

//关闭
function close() {
	activeTextField.setValue(oldValue);
	exports.close();
}

//提交
function submitValue() {
	oldValue = $.number.getValue();
	exports.close();
}

