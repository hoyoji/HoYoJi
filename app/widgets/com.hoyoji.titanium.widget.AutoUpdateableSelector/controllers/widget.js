var attrs = arguments[0] || {};
$.labelText.setText(attrs.labelText);//传入labelText的text

var items = attrs.items.split("，");//从input widget获取items转为array
var values = attrs.values.split(",");//从input widget获取values转为array
// console.info("+++++++++++" + items + "+++++++++" + values);

var data = [];
for (var i = 0, ilen = items.length; i < ilen; i++) {//根据items的长度动态创建columns
	data[i] = Ti.UI.createPickerRow({
		title : items[i],
		value : values[i]
	});
	// console.info("+++++++++++" + items[i] + "+++++++++" + values[i]);
};
$.picker.add(data);//把columns添加到picker

exports.bindModel = function(model, attribute) {
	model.on("change:" + attribute, function() {//绑定change事件  model的attribute改变时picker改变
		var attributeValue = model.get(attribute);
		$.picker.setValue(attributeValue);
	});

	$.picker.addEventListener("change", function(e) {//监听picker的column发生改变时model对应的attribute改变
		var pickerValue = e.selectedValue;
		// console.info("+++++++++++" +e.selectedValue + "+++++++++" );
		model.set(attribute, pickerValue, {silent : true});
		model.save();//保存数据，用于检验validate
	});
	model.on("error", function(model, error) {//绑定error，validate有错时return
		alert(error);
	})
}