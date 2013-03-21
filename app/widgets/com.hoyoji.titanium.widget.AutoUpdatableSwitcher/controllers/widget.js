Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var items = [];
var values = [];
var labels = [];
exports.bindModel = function(model, attribute,item,value) {
	items = item.split(",");
	values = value.split(",");
	for (i=0;i<items.length ;i++){
		labels[i] = Ti.UI.createLabel({
			text :　items[i],
			borderWidth : 1,
			width : 50,
			height : 50,
			borderColor : "blue",
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		console.info("1"+model.get(attribute));
		console.info("2"+values[i]);
		if(model.get(attribute) === values[i]){
			console.info("1"+model.get(attribute));
			console.info("2"+values[i]);
			labels[i].setBackgroundColor("blue");
		}
		$.radioView.add(labels[i]);
	}
	model.on("change:" + attribute, function() {
		for (i=0;i<labels.length;i++){
			if(values[i] === model.get(attribute)){
				labels[i].setBackgroundColor("blue");
			}else{
				labels[i].setBackgroundColor("white");
			}
		}
	});
	$.radioView.addEventListener("click", function(e){
		var genderValue = "";
		for (i=0;i<items.length;i++){
			console.info(items[i]);
			if(items[i] === e.source.getText()){
				e.source.setBackgroundColor("blue");
				genderValue = values[i];
			}else{
				labels[i].setBackgroundColor("white");
			}
		}
		var o = {};
		o[attribute] = genderValue;
		model.set(o,{
			silent : true
		});
		$.genderValidateMsg.setText("");
		model.save();
	});
	model.on("error",function(model , error){
		$.genderValidateMsg.setText(error);
	});
}
