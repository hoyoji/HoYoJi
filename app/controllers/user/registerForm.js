Alloy.Globals.extendsBaseFormController($, arguments[0]);

var activeProject = Alloy.createModel("Project", {name : "我的收支", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeProject", activeProject);

var defaultFriendCategory = Alloy.createModel("FriendCategory", {name : "我的好友", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("defaultFriendCategory", defaultFriendCategory);

var messageBox = Alloy.createModel("MessageBox", {ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("messageBox", messageBox);

var activeCurrency = Alloy.createModel("Currency", {name : "人民币", symbol : "￥", code : "CNY", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeCurrency", activeCurrency);

var activeMoneyAccount = Alloy.createModel("MoneyAccount", {name : "现金", currency : $.$model.xGet("activeCurrency"), currentBalance : 0, sharingType : "person", ownerUser : $.$model}).xAddToSave($);
$.$model.xSet("activeMoneyAccount", activeMoneyAccount);

var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory",{name : "日常收入", project:$.$model.xGet("activeProject"), ownerUser : $.$model}).xAddToSave($);
$.$model.xGet("activeProject").xSet("defaultIncomeCategory",defaultIncomeCategory);

var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory",{name : "日常支出", project:$.$model.xGet("activeProject"), ownerUser : $.$model}).xAddToSave($);
$.$model.xGet("activeProject").xSet("defaultExpenseCategory",defaultExpenseCategory);

$.onSave = function(saveEndCB, saveErrorCB){
	$.$model.xValidate(function() {
		if ($.$model.__xValidationErrorCount > 0) {
			$.$model.__xValidationError.__summury = {
				msg : "验证错误"
			};
			for (var e in $.$model.__xValidationError) {
				console.info(e + " : " + $.$model.__xValidationError[e].msg);
			}
			$.$model.trigger("error", $.$model, $.$model.__xValidationError);
			saveErrorCB();
		} else {
			var userData = $.$model.toJSON();
			userData.password = Ti.Utils.sha1($.$model.xGet("password"));
			userData.password2 = Ti.Utils.sha1($.$model.xGet("password2"));
			var data = [userData];
			for (var i = 0; i < $.__saveCollection.length; i++) {
				data.push($.__saveCollection[i].toJSON());
			}
			Alloy.Globals.Server.createData(data,function(){
				$.saveModel(saveEndCB, saveErrorCB);
			}, function(e){
				alert("连接服务器出错, 不过你的注册依然成功，因为我们还在测试 :P");
				$.saveModel(saveEndCB, saveErrorCB);
			});		
		}
	});
}

$.onWindowCloseDo(function(){
	Alloy.Globals.DataStore.initStore();
})
