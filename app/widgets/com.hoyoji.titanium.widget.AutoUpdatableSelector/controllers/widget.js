Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var items = $.$attrs.items.split("，");//从input widget获取items转为array
var values = items;
if($.$attrs.values){
	values = $.$attrs.values.split(",");//从input widget获取values转为array
} 
var data = [], selectedValue;
for (var i = 0; i < items.length; i++) {//根据items的长度动态创建rows
	data[i] = Ti.UI.createPickerRow({
		title : items[i]
	});
};
$.field.add(data);//把rows添加到picker

$.$view.addEventListener("singletap", function(e){
	$.getCurrentWindow().closeSoftKeyboard();
});

$.field.addEventListener("change", function(e){
	console.info("Selector selected value : " + values[e.rowIndex]);
	selectedValue = values[e.rowIndex];
});

$.getValue = function(e){
	if(e){
		return values[e.rowIndex];
	} else {
		return selectedValue;
	}
}

$.setValue = function(value) {
    _bindAttributeIsModel = value;
    $.$attrs.bindAttributeIsModel && value && ($.$attrs.bindAttributeIsModel.endsWith("()") ? value = _bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0, -2)]() : value = _bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel));
    var rowIndex = _.indexOf(values, value || "");
    if(rowIndex < 0){
		rowIndex = 0;
    } 
     $.field.setSelectedRow(0,rowIndex);
};