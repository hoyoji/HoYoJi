Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if($.$attrs.color){
	$.field.setColor($.$attrs.color);
}

if ($.$attrs.font) {
	$.field.setFont($.$attrs.font);
}

if($.$attrs.textAlign){
	if($.$attrs.textAlign === "Ti.UI.TEXT_ALIGNMENT_LEFT"){
		$.field.setTextAlign(Ti.UI.TEXT_ALIGNMENT_LEFT);
	} else if($.$attrs.textAlign === "Ti.UI.TEXT_ALIGNMENT_CENTER"){
		$.field.setTextAlign(Ti.UI.TEXT_ALIGNMENT_CENTER);
	} else if($.$attrs.textAlign === "Ti.UI.TEXT_ALIGNMENT_RIGHT"){
		$.field.setTextAlign(Ti.UI.TEXT_ALIGNMENT_RIGHT);
	}
}


var backgroundColors = ["white", "cyan"];
var currentItemIndex = 0;
var items = $.$attrs.items.split(",");
var values = items;
if($.$attrs.values){
	values = $.$attrs.values.split(",");
} 

// $.$view.addEventListener("singletap", function(e){
	// $.getCurrentWindow().closeSoftKeyboard();
// });

$.field.addEventListener("singletap", function(e){
	 if(currentItemIndex){
	 	currentItemIndex --;
	 } else {
	 	currentItemIndex++;
	 }
     $.field.setText(items[currentItemIndex]);
	if($.$attrs.hightLight !== "false"){
		    $.field.setBackgroundColor(backgroundColors[currentItemIndex]);
	}	
   	 $.field.fireEvent("change");
});

$.getValue = function(e){
	return values[currentItemIndex];
};

$.setValue = function(value) {
    $.__bindAttributeIsModel = value;
    $.$attrs.bindAttributeIsModel && value && ($.$attrs.bindAttributeIsModel.endsWith("()") ? value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0, -2)]() : value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel));
    
     	currentItemIndex = _.indexOf(values, value === null || value === undefined ? "" : value.toString());
     	if(currentItemIndex < 0){
     		currentItemIndex = 0;
     	}
     	$.field.setText(items[currentItemIndex]);
     	if($.$attrs.hightLight !== "false"){
		    $.field.setBackgroundColor(backgroundColors[currentItemIndex]);
     	}
};
