Alloy.Globals.extendsBaseUIController($, arguments[0]);

$.headerTitle.setText($.$attrs.headerTitle);

if($.$attrs.sectionIndex === 0){
	$.sectionFooter.setVisible(false);
	$.sectionFooter.setHeight(0);
	$.$view.setHeight(25);
} else {
	$.sectionFooter.setVisible(true);
	$.sectionFooter.setHeight(10);
	$.$view.setHeight(45);
}
