exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			incomeType : "TEXT NOT NULL",
			friendId : "TEXT",
			friendAccountId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			moneyIncomeCategoryId : "TEXT NOT NULL",
			localCurrencyId : "TEXT NOT NULL",
			exchangeCurrencyRate : "REAL NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
		    lastSyncTime : "TEXT",
			lastModifyTime : "TEXT"
		},
		hasMany : {
			moneyIncomeDetails : {
				type : "MoneyIncomeDetail",
				attribute : "moneyIncome"
			}
		},
		belongsTo : {
			friend : {
				type : "Friend",
				attribute : null
			},
			friendAccount : {
				type : "MoneyAccount",
				attribute : null
			},
			moneyAccount : {
				type : "MoneyAccount",
				attribute : null
			},
			project : {
				type : "Project",
				attribute : "moneyIncomes"
			},
			moneyIncomeCategory : {
				type : "MoneyIncomeCategory",
				attribute : "moneyIncomes"
			},
			localCurrency : {
				type : "Currency",
				attribute : null
			},
			ownerUser : {
				type : "User",
				attribute : "moneyIncomes"
			}
		},
		rowView : "money/moneyIncomeRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				amount : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("amount"))) {
						error = {
							msg : "金额只能为数字"
						};
					} else {
						if (this.xGet("amount") < 0) {
							error = {
								msg : "金额不能为负数"
							};
						}
					}
					xValidateComplete(error);
				},
				exchangeCurrencyRate : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("exchangeCurrencyRate"))) {
						error = {
							msg : "汇率只能为数字"
						};
					} else {
						if (this.xGet("exchangeCurrencyRate") < 0) {
							error = {
								msg : "汇率不能为负数"
							};
						} else if (this.xGet("exchangeCurrencyRate") === 0) {
							error = {
								msg : "汇率不能为0"
							};
						}
					}
					xValidateComplete(error);
				},
				friendAccount : function(xValidateComplete) {
					var error;
					var friendAccount = this.xGet("friendAccount");
					if (friendAccount) {
						var moneyAccount = this.xGet("moneyAccount");
						if (friendAccount.xGet("currency") !== moneyAccount.xGet("currency")) {
							error = {
								msg : "请选择与账户相同币种的商家账户"
							};
						}
					}
					xValidateComplete(error);
				}
			},
			getLocalAmount : function() {
				return (this.xGet("amount") * this.xGet("exchangeCurrencyRate")).toUserCurrency();
			},
			getProjectName : function() {
				return this.xGet("project").xGet("name");
			},
			getMoneyIncomeCategoryName : function(){
				return this.xGet("moneyIncomeCategory").xGet("name");
			},
			xDelete : function(xFinishCallback) {
				var moneyAccount = this.xGet("moneyAccount");
				var amount = this.xGet("amount");
				this._xDelete(xFinishCallback);
				moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - amount);
				moneyAccount.xSave();
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});

		return Collection;
	}
}

