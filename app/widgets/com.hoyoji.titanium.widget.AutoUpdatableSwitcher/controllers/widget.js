Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var items = null;
var values = null;
var labels = [];
var currentItemIndex = -1;

	items = $.$attrs.items.split(",");
	values = items;
	if($.$attrs.values){
		values = $.$attrs.values.split(",");
	} 
	var labelWidth = (1 / items.length * 100) + "%"
	for (i=0;i<items.length ;i++){
		labels.push(Ti.UI.createLabel({
			text :　items[i],
			borderWidth : 1,
			width : labelWidth,
			height : Ti.UI.FILL,
			borderColor : "blue",
			backgroundColor : "white",
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		}));
		
		$.field.add(labels[i]);
	}

$.$view.addEventListener("singletap", function(e){
	$.getCurrentWindow().closeSoftKeyboard();
});

$.field.addEventListener("singletap", function(e){
	if(e.source === $.field){
		return;
	}
	
	 if(currentItemIndex >= 0){
	    labels[currentItemIndex].setBackgroundColor("white");
	 }
	 console.info(currentItemIndex + " current index : " + e.source.getText());
     currentItemIndex = _.indexOf(labels, e.source);
	e.source.setBackgroundColor("cyan");
    
	$.field.fireEvent("change");
});

$.getValue = function(e){
	return values[currentItemIndex];
}

$.setValue = function(value) {
    $.__bindAttributeIsModel = value;
    $.$attrs.bindAttributeIsModel && value && ($.$attrs.bindAttributeIsModel.endsWith("()") ? value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0, -2)]() : value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel));
    
     if(currentItemIndex >= 0){
	    labels[currentItemIndex].setBackgroundColor("white");
	 }
     currentItemIndex = _.indexOf(values, value);
     if(currentItemIndex >= 0){
		 labels[currentItemIndex].setBackgroundColor("cyan");
     }
};
