var activeTextField;

exports.bindTextField = function(textField) {
	textField.addEventListener("focus", function() {
		var animation = Titanium.UI.createAnimation();
		animation.top = "0%"
		animation.duration = 1000;
		animation.zIndex = "900";
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		
		if ($.widget.visible === "false") {
			$.widget.animate(animation);
			$.widget.show();
		} else {
			$.widget.show();
		}

		activeTextField = textField;
		$.number.setValue(activeTextField.getValue());
	});
	textField.addEventListener("blur", function() {
		var animation = Titanium.UI.createAnimation();
		animation.top = "100%"
		animation.duration = 1000;
		animation.zIndex = "900";
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		
		if (activeTextField.visible === "true") {
			// $.widget.hide();
		} else {
			$.widget.animate(animation);
			$.widget.hide();
		}
		$.number.setValue(activeTextField.getValue());
	});

	$.widget.hide();
	activeTextField = textField;
	$.number.setValue(activeTextField.getValue());
}

$.widget.hide();

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
}

//退格键
function backspace() {
	var readout = $.number.getValue();
	var len = readout.length;
	if (len > 1) {
		var rout = readout.substr(0, len - 1);
		$.number.setValue(rout);
		activeTextField.setValue(rout);
	} else {
		$.number.setValue("0");
		activeTextField.setValue("0");
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
	$.widget.hide();
}

//提交
function submitValue() {
	$.widget.hide();
}

