Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	$.name.field.focus();
});

var selectedIncome = $.$attrs.selectedIncome;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncomeDetail", {
		moneyIncome : selectedIncome,
		ownerUser : Alloy.Models.User
	});
	$.setSaveableMode("add");
} else {
	$.setSaveableMode("edit");
}
var oldDetailAmount = $.$model.xGet("amount") || 0;

$.onSave = function(saveEndCB, saveErrorCB) {
	var incomeAmount = 0;
	var detailTotal = 0;
	var income = $.$model.xGet("moneyIncome");
	var oldIncomeAmount = income.xGet("amount");

	if (!$.$attrs.closeWithoutSave) {//从row打开时
		/*
		 //隐藏功能,使用明细金额作为收支金额
		 var moneyAccount = income.xGet("moneyAccount");
		 var newDetailAmount = $.$model.xGet("amount");
		 if (income.xGet("moneyIncomeDetails").length > 0) {
		 $.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").forEach(function(item) {
		 if (!item.__xDeleted) {
		 detailTotal = detailTotal + item.xGet("amount");
		 }
		 });
		 }
		 if (income.xGet("useDetailsTotal")) {
		 if (income.xGet("moneyIncomeDetails").length > 0) {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - oldDetailAmount + newDetailAmount);
		 } else {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - oldIncomeAmount + newDetailAmount);
		 }
		 income.xSet("amount", oldIncomeAmount - oldDetailAmount + $.$model.xGet("amount"));
		 // income.trigger("xchange:amount", income);
		 income.xAddToSave($);
		 moneyAccount.xAddToSave($);
		 $.saveModel(saveEndCB, function(e) {
		 income.xSet("amount", income.previous("amount"));
		 moneyAccount.xSet("currentBalance", moneyAccount.previous("currentBalance"));
		 // if (oldMoneyAccount) {
		 // oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		 // }
		 saveErrorCB(e);
		 });
		 } else {
		 Alloy.Globals.confirm("修改金额", "确定要修改并使用明细总和为收入金额？", function() {
		 $.$model.xGet("moneyIncome").xSet("useDetailsTotal", true);
		 incomeAmount = detailTotal;
		 if (income.xGet("moneyIncomeDetails").length > 0) {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - oldDetailAmount + newDetailAmount);
		 } else {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - oldIncomeAmount + newDetailAmount);
		 }
		 moneyAccount.xAddToSave($);
		 income.xSet("amount", incomeAmount - oldDetailAmount + $.$model.xGet("amount")).xAddToSave($);
		 // income.trigger("xchange:amount", income);
		 income.xAddToSave($);
		 $.saveModel(saveEndCB, function(e) {
		 income.xSet("amount", income.previous("amount"));
		 moneyAccount.xSet("currentBalance", moneyAccount.previous("currentBalance"));
		 // if (oldMoneyAccount) {
		 // oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		 // }
		 saveErrorCB(e);
		 });
		 },function(){
		 $.saveModel(saveEndCB, saveErrorCB);
		 });
		 }
		 */
		$.saveModel(saveEndCB, saveErrorCB);
	} else {
		$.$model.xValidate(function() {
			if ($.$model.__xValidationErrorCount > 0) {
				$.$model.__xValidationError.__summary = {
					msg : "验证错误"
				};
				$.$model.trigger("error", $.$model, $.$model.__xValidationError);
				saveErrorCB($.$model.__xValidationError.__summary.msg);
				return;
			}
			if (!oldIncomeAmount && oldIncomeAmount !== 0) {//去掉使用明细金额作为收支金额，在新增收支的form新增明细时检测form里没有amount，则使用明细总额为form的amount
				$.$model.xGet("moneyIncome").xSet("useDetailsTotal", true);
			}
			if (income.xGet("moneyIncomeDetails").length > 0) {
				incomeAmount = income.xGet("amount");
				$.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").forEach(function(item) {
					if (!item.__xDeleted) {
						detailTotal = detailTotal + item.xGet("amount");
					}
				});
			}
			if ($.$model.xGet("moneyIncome").xGet("useDetailsTotal") === true) {
				income.xSet("amount", incomeAmount - oldDetailAmount + $.$model.xGet("amount"));
			}
			/*
			 //隐藏功能,使用明细金额作为收支金额
			 else {
			 Alloy.Globals.confirm("修改金额", "确定要修改并使用明细总和为收入金额？", function() {
			 $.$model.xGet("moneyIncome").xSet("useDetailsTotal", true);
			 incomeAmount = detailTotal;
			 income.xSet("amount", incomeAmount - oldDetailAmount + $.$model.xGet("amount"));
			 //增改的时候计算amount
			 income.trigger("xchange:amount", income);
			 });
			 }
			 */
			$.$model.trigger("xchange:amount", $.$model);
			$.$model.trigger("xchange:name", $.$model);

			income.trigger("xchange:amount", income);
			// $.becameClean();
			income.xGet("moneyIncomeDetails").add($.$model);
			saveEndCB();
			$.getCurrentWindow().$view.close();
		});
	}
};

$.name.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());

