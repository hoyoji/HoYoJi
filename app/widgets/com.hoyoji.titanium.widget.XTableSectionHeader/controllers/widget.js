Alloy.Globals.extendsBaseUIController($, arguments[0]);

$.headerTitle.setText($.$attrs.headerTitle);

if($.$attrs.sectionIndex == 0){
	$.sectionFooter1.setVisible(false);
	$.sectionFooter2.setVisible(false);
	$.$view.setHeight(35);
}
