Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedExpense = $.$attrs.selectedExpense;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyExpenseDetail", {
		moneyExpense : selectedExpense,
		ownerUser : Alloy.Models.User
	});
	$.setSaveableMode("add");
} else {
	$.setSaveableMode("edit");
}
var oldDetailAmount = $.$model.xGet("amount") || 0;
//detail的旧值
$.onSave = function(saveEndCB, saveErrorCB) {
	var expenseAmount = 0;
	var detailTotal = 0;
	var expense = $.$model.xGet("moneyExpense");
	var oldExpenseAmount = expense.xGet("amount");

	if (!$.$attrs.closeWithoutSave) {//从row打开时
		/*
		 //隐藏功能,使用明细金额作为收支金额
		 var moneyAccount = expense.xGet("moneyAccount");
		 var newDetailAmount = $.$model.xGet("amount");
		 if (expense.xGet("moneyExpenseDetails").length > 0) {
		 $.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").forEach(function(item) {
		 if (!item.__xDeleted) {
		 detailTotal = detailTotal + item.xGet("amount");
		 }

		 });
		 }
		 if (expense.xGet("useDetailsTotal")) {
		 if (expense.xGet("moneyExpenseDetails").length > 0) {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + oldDetailAmount - newDetailAmount);
		 } else {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + oldExpenseAmount - newDetailAmount);
		 }
		 expense.xSet("amount", oldExpenseAmount - oldDetailAmount + $.$model.xGet("amount"));

		 expense.xAddToSave($);
		 moneyAccount.xAddToSave($);
		 $.saveModel(saveEndCB, function(e) {
		 expense.xSet("amount", expense.previous("amount"));
		 moneyAccount.xSet("currentBalance", moneyAccount.previous("currentBalance"));
		 // if (oldMoneyAccount) {
		 // oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		 // }
		 saveErrorCB(e);
		 });
		 } else {
		 Alloy.Globals.confirm("修改金额", "确定要修改并使用明细总和为支出金额？", function() {
		 $.$model.xGet("moneyExpense").xSet("useDetailsTotal", true);
		 expenseAmount = detailTotal;
		 if (expense.xGet("moneyExpenseDetails").length > 0) {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + oldDetailAmount - newDetailAmount);
		 } else {
		 moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + oldExpenseAmount - newDetailAmount);
		 }
		 moneyAccount.xAddToSave($);
		 expense.xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount")).xAddToSave($);
		 // expense.trigger("xchange:amount", expense);
		 expense.xAddToSave($);
		 $.saveModel(saveEndCB, function(e) {
		 expense.xSet("amount", expense.previous("amount"));
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

			//从form打开时，不自动保存，把amount传回expenseForm
			if (!oldExpenseAmount && oldExpenseAmount !== 0) {//去掉使用明细金额作为收支金额，在新增收支的form新增明细时检测form里没有amount，则使用明细总额为form的amount
				$.$model.xGet("moneyExpense").xSet("useDetailsTotal", true);
			}
			if (expense.xGet("moneyExpenseDetails").length > 0) {
				//获取moneyExpenseAmount，如果有amount就等于amount 没有的话设成0
				expenseAmount = expense.xGet("amount");
				$.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").forEach(function(item) {
					if (!item.__xDeleted) {
						detailTotal = detailTotal + item.xGet("amount");
					}
				});
			}

			if ($.$model.xGet("moneyExpense").xGet("useDetailsTotal") === true) {
				console.info("++useDetailTotal+++" + $.$model.xGet("moneyExpense").xGet("useDetailsTotal"));
				expense.xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
				//增改的时候计算amount
			}
			/*
			 //隐藏功能,使用明细金额作为收支金额
			 else {
			 Alloy.Globals.confirm("修改金额", "确定要修改并使用明细总和为支出金额？", function() {
			 $.$model.xGet("moneyExpense").xSet("useDetailsTotal", true);
			 expenseAmount = detailTotal;
			 expense.xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
			 expense.trigger("xchange:amount", expense);
			 //增改的时候计算amount
			 });
			 }
			 */

			$.$model.trigger("xchange:amount", $.$model);
			$.$model.trigger("xchange:name", $.$model);

			expense.trigger("xchange:amount", expense);
			// $.becameClean();
			expense.xGet("moneyExpenseDetails").add($.$model);
			saveEndCB();
			$.getCurrentWindow().close();
		});
	}
};

$.name.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());

