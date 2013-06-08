Alloy.Globals.extendsBaseViewController($, arguments[0]);
	
var selectedValue;
	
function close() {
	$.getCurrentWindow().close();
}

function confirm() {
	$.getCurrentWindow().$attrs.selectorCallback(selectedValue);
	$.getCurrentWindow().close();
}

$.confirm.addEventListener("singletap", confirm);
$.close.addEventListener("singletap", close);

$.onWindowOpenDo(function() {
	var data = [];
	
	if($.getCurrentWindow().$attrs.title){
		$.title.setText("请选择"+ $.getCurrentWindow().$attrs.title);
	}
	
	var items = $.getCurrentWindow().$attrs.items,
		values = $.getCurrentWindow().$attrs.values;
	
	for (var i = 0; i < items.length; i++) {//根据items的长度动态创建rows
			var row = Ti.UI.createPickerRow({
				title : items[i] + "                                    "
			});
			data[i] = row;
	}		
		
	if(OS_ANDROID){
		$.field = Ti.UI.createPicker({
		  id : "field",
		  visibleItems : 7,
		  useSpinner : true
		});
		//把rows添加到picker
		$.field.add(data);
		$.fieldContainer.add($.field);
	} else {
		$.field.add(data);
	}
	
	$.field.addEventListener("change", function(e) {
		selectedValue = values[e.rowIndex];
		$.selectedOption.setText(items[e.rowIndex]);
	});

	var rowIndex = _.indexOf(values, $.getCurrentWindow().$attrs.field.getValue() || "");
	if (rowIndex < 0) {
		rowIndex = 0;
	}
	selectedValue = values[rowIndex];
	$.selectedOption.setText(items[rowIndex]);
	$.field.setSelectedRow(0, rowIndex);
	
	$.selectedOption.addEventListener("singletap", confirm);
});


