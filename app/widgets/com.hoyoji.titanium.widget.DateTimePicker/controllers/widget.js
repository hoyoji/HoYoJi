// problems (by BenYiu): 共个问题， 最大的问题是软键盘遮住widget
// problem#10 widget opacity="0.5" 会把真个虚化，要将其背景设成半透明颜色，比如 backgroundColor="#40000000"
// problem#11 focus一个textfield后，软键盘还会被打开。应该在绑定是将该textfield设成 editable="false"。
// problem#12 将widget初始值 top="100%", 动画才有效果


// problem#3 可将 $.textField 定义称本地变量
// var activeTextField;
exports.bindTextField = function(textField) {//绑定textField
	textField.addEventListener("focus", function() {//焦点在textField上时显示datePicker
		var showDatePicker = Titanium.UI.createAnimation(); //打开时动画
		showDatePicker.top = "0%";
		showDatePicker.duration = 1000;
		showDatePicker.zIndex = 900; // problem#4 showDatePicker 是个动画，不用在这里设 zIndex
		showDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;

		$.widget.animate(showDatePicker);
		
		// problem#5 addEventListener 要在调用 animate() 之前设，要不的话这个listener可能不会被调用，因为动画已经完成了
		showDatePicker.addEventListener("complete", function() {
			$.widget.show();	// problem#8 先动画再显示，动画将会看不见。处理方法应该和隐藏时调换。
		});
		
		// problem#3 $.textField 可用本定变量：var textField, 看上面
		// activeTextField = textField;
		$.textField = textField;//textField 本地化，用于setValue
	}) // problem#6 没有分号
	textField.addEventListener("blur", function() {//textField失去焦点时隐藏datePicker
		var hideDatePicker = Titanium.UI.createAnimation();//关闭时动画
		hideDatePicker.top = "100%";
		hideDatePicker.duration = 1000;
		hideDatePicker.zIndex = 900; // problem#4 同上
		hideDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;

		$.widget.hide(); // problem#7 先隐藏，在动画。动画将会看不见。处理方法和显示时调换。
		$.widget.animate(hideDatePicker);

	});

}

function buttonClick() {//设置日期
	var date;
	var time;
	date = String.formatDate($.datePicker.getValue(), ["medium"]);
	time = String.formatTime($.timePicker.getValue(), ["medium"]);
	$.textField.setValue(date + " " + time);
}

// problem#2 $.sub 这个变量命不好，很难猜。而且这个定义在 View 里， 读你的代码的人还好去View找半天。用 "submitButton"
$.sub.addEventListener("click", buttonClick);//绑定button的click事件

if (OS_ANDROID && Ti.Platform.Android.API_LEVEL > 0.8) {//安卓系统时widget的打开方式
	$.datePicker.setUseSpinner(true);
	$.timePicker.setUseSpinner(true);

} else { //problem#1 去掉这个else
}

// problem#9 可以在View里加 visible="false", 这样widget在创建事就是隐藏的。这里就不用调用 hide()。
// 这样可能可以提高widget的打开速度，而不是先创建个显示的，然后马上又将其隐藏。
$.widget.hide();//一打开widget设为hide
