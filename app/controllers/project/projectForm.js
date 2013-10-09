Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	$.name.field.focus();
});

if ($.$model.isNew()) {
	$.$model.xSet("currencyId", Alloy.Models.User.xGet("activeCurrencyId"));
	$.$model.xGet("currency");
	$.$model.xSet("autoApportion", 0);
	$.$model.xGet("autoApportion");
}

$.onSave = function(saveEndCB, saveErrorCB) {
	function createIncomeCategoryModel(categoryName) {
		var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
			name : categoryName,
			project : $.$model,
			ownerUser : Alloy.Models.User
		}).xAddToSave($);
		if (categoryName === "工资") {
			$.$model.xSet("defaultIncomeCategory", defaultIncomeCategory);
		}
	}

	function createExpenseCategoryModel(parentCategory, subCategories) {
		if (subCategories) {
			for (var i = 0; i < subCategories.length; i++) {
				var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
					name : subCategories[i],
					project : $.$model,
					ownerUser : Alloy.Models.User,
					parentExpenseCategory : parentCategory
				}).xAddToSave($);
				if (subCategories[i] === "早餐") {
					$.$model.xSet("defaultExpenseCategory", defaultExpenseCategory);
				}
			}
		} else if (parentCategory) {
			var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
				name : parentCategory,
				project : $.$model,
				ownerUser : Alloy.Models.User,
			}).xAddToSave($);
			return defaultExpenseCategory;
		}
	}

	if ($.$model.isNew()) {
		if ($.autoAddCategory.getValue() === "Yes") {
			var incomeCategoryNameCollection = ["工资", "加班费", "补贴", "奖金", "报销", "租金", "兼职", "礼金", "投资收入", "利息收入"];
			for (var i = 0; i < incomeCategoryNameCollection.length; i++) {
				createIncomeCategoryModel(incomeCategoryNameCollection[i]);
			}

			var parentCategory = [];
			var expenseParentCategoryNameCollection = ["餐饮", "行车交通", "购物", "休闲娱乐", "医教服务", "生活居家", "金融投资", "人情往来"];
			for (var i = 0; i < expenseParentCategoryNameCollection.length; i++) {
				parentCategory.push(createExpenseCategoryModel(expenseParentCategoryNameCollection[i]));
			}
			var expenseSubCategoryNameCollection = [["早餐", "午餐", "晚餐", "夜宵", "饮料", "水果零食", "自煮买菜", "油盐酱醋", "餐饮其他"], ["打的", "公交地铁", "大巴", "航空", "火车", "船舶", "自行车", "加油", "停车费", "过路过桥", "维修保养", "车贷车险", "罚款赔偿", "行车交通其他"], ["日用百货", "衣服鞋帽", "首饰", "化妆品", "保健品", "婴幼用品", "数码产品", "茶烟酒", "家电家具", "玩具", "报刊书籍", "摄影文印", "购物其他"], ["卡拉OK", "腐败聚会", "电影电视", "网游电玩", "运动健身", "美容美发", "洗浴足浴", "旅游度假", "休闲娱乐其他"], ["医药费", "学杂费", "教材费", "家教补习", "培训考试", "家政服务", "快递服务", "医教服务其他"], ["水电燃气", "住宿房租", "手机电话", "宽带", "放宽房贷", "物业", "维修保养", "材料建材", "生活居家其他"], ["证券期货", "保险", "外汇", "黄金实物", "书画艺术", "投资贷款", "利息支出", "金融投资其他"], ["孝敬长辈", "礼金实物", "请客吃饭", "慈善捐款", "代付款", "人情往来其他"]];
			for (var i = 0; i < parentCategory.length; i++) {
				createExpenseCategoryModel(parentCategory[i], expenseSubCategoryNameCollection[i]);
			}
		} else {
			var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
				name : "日常收入",
				project : $.$model,
				ownerUser : Alloy.Models.User
			}).xAddToSave($);
			$.$model.xSet("defaultIncomeCategory", defaultIncomeCategory);

			var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
				name : "日常支出",
				project : $.$model,
				ownerUser : Alloy.Models.User
			}).xAddToSave($);
			$.$model.xSet("defaultExpenseCategory", defaultExpenseCategory);
		}
		//创建项目时默认创建充值收入分类
		var depositeIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
			name : "充值收入",
			project : $.$model,
			ownerUser : Alloy.Models.User
		}).xAddToSave($);
		$.$model.xSet("depositeIncomeCategory", depositeIncomeCategory);

		//创建项目时默认创建充值支出分类
		var depositeExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
			name : "充值支出",
			project : $.$model,
			ownerUser : Alloy.Models.User
		}).xAddToSave($);
		$.$model.xSet("depositeExpenseCategory", depositeExpenseCategory);

		//创建项目的时候同时创建共享给自己的ProjectShareAuthorization
		Alloy.createModel("ProjectShareAuthorization", {
			project : $.$model,
			state : "Accept",
			friendUser : Alloy.Models.User,
			sharePercentage : 100,

			actualTotalIncome : 0,
			actualTotalExpense : 0,
			apportionedTotalIncome : 0,
			apportionedTotalExpense : 0,
			sharedTotalIncome : 0,
			sharedTotalExpense : 0,
			sharePercentageType : "Average",

			shareAllSubProjects : 1,
			ownerUser : Alloy.Models.User,

			projectShareMoneyExpenseOwnerDataOnly : 0,
			projectShareMoneyExpenseAddNew : 1,
			projectShareMoneyExpenseEdit : 1,
			projectShareMoneyExpenseDelete : 1,

			projectShareMoneyExpenseDetailOwnerDataOnly : 0,
			projectShareMoneyExpenseDetailAddNew : 1,
			projectShareMoneyExpenseDetailEdit : 1,
			projectShareMoneyExpenseDetailDelete : 1,

			projectShareMoneyIncomeOwnerDataOnly : 0,
			projectShareMoneyIncomeAddNew : 1,
			projectShareMoneyIncomeEdit : 1,
			projectShareMoneyIncomeDelete : 1,

			projectShareMoneyIncomeDetailOwnerDataOnly : 0,
			projectShareMoneyIncomeDetailAddNew : 1,
			projectShareMoneyIncomeDetailEdit : 1,
			projectShareMoneyIncomeDetailDelete : 1,

			projectShareMoneyExpenseCategoryAddNew : 1,
			projectShareMoneyExpenseCategoryEdit : 1,
			projectShareMoneyExpenseCategoryDelete : 1,

			projectShareMoneyIncomeCategoryAddNew : 1,
			projectShareMoneyIncomeCategoryEdit : 1,
			projectShareMoneyIncomeCategoryDelete : 1,

			projectShareMoneyTransferOwnerDataOnly : 0,
			projectShareMoneyTransferAddNew : 1,
			projectShareMoneyTransferEdit : 1,
			projectShareMoneyTransferDelete : 1,

			projectShareMoneyLendOwnerDataOnly : 0,
			projectShareMoneyLendAddNew : 1,
			projectShareMoneyLendEdit : 1,
			projectShareMoneyLendDelete : 1,

			projectShareMoneyBorrowOwnerDataOnly : 0,
			projectShareMoneyBorrowAddNew : 1,
			projectShareMoneyBorrowEdit : 1,
			projectShareMoneyBorrowDelete : 1,

			projectShareMoneyPaybackOwnerDataOnly : 0,
			projectShareMoneyPaybackAddNew : 1,
			projectShareMoneyPaybackEdit : 1,
			projectShareMoneyPaybackDelete : 1,

			projectShareMoneyReturnOwnerDataOnly : 0,
			projectShareMoneyReturnAddNew : 1,
			projectShareMoneyReturnEdit : 1,
			projectShareMoneyReturnDelete : 1
		}).xAddToSave($);
	}

	$.saveModel(saveEndCB, saveErrorCB);
};

$.onWindowOpenDo(function() {
	if ($.$model.isNew()) {
		$.autoAddCategory.setValue("No");
	} else {
		$.autoAddCategoryView.setHeight(0);
	}
});

$.parentProject.UIInit($, $.getCurrentWindow());
$.name.UIInit($, $.getCurrentWindow());
$.currency.UIInit($, $.getCurrentWindow());
$.autoAddCategory.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
$.autoApportion.UIInit($, $.getCurrentWindow());
