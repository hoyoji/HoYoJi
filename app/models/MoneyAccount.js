exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			currencyId : "TEXT NOT NULL",
			currentBalance : "REAL NOT NULL",
			remark : "TEXT",
			sharingType : "TEXT NOT NULL",
			accountType : "TEXT NOT NULL",
			accountNumber : "TEXT",
			bankAddress : "TEXT",
			ownerUserId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER"
		},
		defaults : {
			currentBalance : 0
		},
		hasMany : {
			moneyExpenses : {
				type : "MoneyExpense",
				attribute : "moneyAccount"
			},
			moneyIncomes : {
				type : "MoneyIncome",
				attribute : "moneyAccount"
			},
			moneyBorrows : {
				type : "MoneyBorrow",
				attribute : "moneyAccount"
			},
			moneyLends : {
				type : "MoneyLend",
				attribute : "moneyAccount"
			},
			moneyPayback : {
				type : "MoneyPayback",
				attribute : "moneyAccount"
			},
			moneyReturns : {
				type : "MoneyReturn",
				attribute : "moneyAccount"
			}
		},
		belongsTo : {
			currency : {
				type : "Currency",
				attribute : "moneyAccounts"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyAccounts"
			}
		},
		rowView : "money/moneyAccount/moneyAccountRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				currency : function(xValidateComplete) {
					var error;
					if (!this.isNew() && this.previous("currency")) {
						if (this.xGet("currency") !== this.previous("currency")) {
							error = {
								msg : "账户币种不可以修改"
							};
						}
					}
					xValidateComplete(error);
				}
			},
			xDelete : function(xFinishCallback, options) {
				var error;
				if (Alloy.Models.User.xGet("activeMoneyAccount") === this) {
					error = {
						msg : "默认账户不能删除"
					};
				} 
				// else if (this.xGet("moneyExpenses") && this.xGet("moneyExpenses").length > 0) {
					// error = {
						// msg : "当前账户有相关支出，不能删除"
					// };
				// } else if (this.xGet("moneyIncomes") && this.xGet("moneyIncomes").length > 0) {
					// error = {
						// msg : "当前账户有相关收入，不能删除"
					// };
				// } else if (this.xGet("moneyBorrows") && this.xGet("moneyBorrows").length > 0) {
					// error = {
						// msg : "当前账户有相关借入，不能删除"
					// };
				// } else if (this.xGet("moneyLends") && this.xGet("moneyLends").length > 0) {
					// error = {
						// msg : "当前账户有相关借出，不能删除"
					// };
				// } else if (this.xGet("moneyPaybacks") && this.xGet("moneyPaybacks").length > 0 || this.xGet("moneyReturns").length > 0) {
					// error = {
						// msg : "当前账户有相关收款，不能删除"
					// };
				// } else if (this.xGet("moneyReturns") && this.xGet("moneyReturns").length > 0) {
					// error = {
						// msg : "当前账户有相关还款，不能删除"
					// };
				// } 
				else {
					this._xDelete(xFinishCallback, options);
					return;
				}
				xFinishCallback(error);
			},
			getAccountNameCurrency : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("name") + " (" + this.xGet("currency").xGet("symbol") + this.xGet("currentBalance").toUserCurrency() + ")";
				} else {
					return this.xGet("name") + " (" + this.xGet("currency").xGet("symbol") + ")";
				}
			},
			getCurrentBalance : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("currentBalance");
				}
			},
			syncUpdate : function(record, dbTrans){
				delete record.currentBalance; // 我们不能将帐户余额同步下来
				this._syncUpdate(record, dbTrans);
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

