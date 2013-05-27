exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			incomeType : "TEXT NOT NULL",
			friendId : "TEXT",
			friendAccountId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			pictureId : "TEXT",
			moneyIncomeCategoryId : "TEXT NOT NULL",
			localCurrencyId : "TEXT NOT NULL",
			exchangeRate : "REAL NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER",
			useDetailsTotal : "TEXT"
		},
		hasMany : {
			pictures : {
				type : "Picture",
				attribute : "record",
				cascadeDelete : true
			},
			moneyIncomeDetails : {
				type : "MoneyIncomeDetail",
				attribute : "moneyIncome"
			}
		},
		belongsTo : {
			friend : {
				type : "Friend",
				attribute : "moneyIncomes"
			},
			friendAccount : {
				type : "MoneyAccount",
				attribute : null
			},
			moneyAccount : {
				type : "MoneyAccount",
				attribute : "moneyIncomes"
			},
			project : {
				type : "Project",
				attribute : "moneyIncomes"
			},
			picture : {
				type : "Picture",
				attribute : null
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
				exchangeRate : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("exchangeRate"))) {
						error = {
							msg : "汇率只能为数字"
						};
					} else {
						if (this.xGet("exchangeRate") < 0) {
							error = {
								msg : "汇率不能为负数"
							};
						} else if (this.xGet("exchangeRate") === 0) {
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
				},
				project : function(xValidateComplete) {
					var error;
					var project = this.xGet("project");
					if (!project) {
						error = {
							msg : "项目不能为空"
						};
					}
					xValidateComplete(error);
				},
				moneyIncomeCategory : function(xValidateComplete) {
					var error;
					var moneyIncomeCategory = this.xGet("moneyIncomeCategory");
					if (!moneyIncomeCategory) {
						error = {
							msg : "分类不能为空"
						};
					}
					xValidateComplete(error);
				}
			},
			getLocalAmount : function() {
				return this.xGet("localCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate")).toUserCurrency();
			},
			getProjectName : function() {
				return this.xGet("project").xGet("name");
			},
			getMoneyIncomeCategoryName : function() {
				return this.xGet("moneyIncomeCategory").xGet("name");
			},
			getAccountCurrency : function() {
				var currencySymbol = null;
				if (this.xGet("ownerUserId") === Alloy.Models.User.xGet("id")) {
					var accountCurrency = this.xGet("moneyAccount").xGet("currency");
					var localCurrency = this.xGet("localCurrency");
					if (accountCurrency === localCurrency) {
						currencySymbol = null;
					} else {
						currencySymbol = accountCurrency.xGet("code");
					}
				}
				return currencySymbol;
			},
			getFriendUser : function() {
				var ownerUserSymbol;
				if (!this.xGet("ownerUserId") || this.xGet("ownerUserId") === Alloy.Models.User.xGet("id")) {
					ownerUserSymbol = null;
				} else {
					if (!this.__friends) {
						var friends = Alloy.createCollection("Friend");
						friends.xSetFilter({
							friendUser : this.xGet("ownerUser"),
							ownerUser : Alloy.Models.User
						});
						friends.xSearchInDb({
							friendUserId : this.xGet("ownerUser").xGet("id"),
							ownerUserId : Alloy.Models.User.xGet("id")
						});
						this.__friends = friends;
					}
					var friend = this.__friends.at(0);
					ownerUserSymbol = friend.getDisplayName();
				}

				return ownerUserSymbol;
			},
			xDelete : function(xFinishCallback, options) {
				if (options.syncFromServer !== true 
					&& this.xGet("moneyIncomeDetails").length > 0) {
					xFinishCallback({
						msg : "当前收入的明细不为空，不能删除"
					})
				} else {
					var moneyAccount = this.xGet("moneyAccount");
					var amount = this.xGet("amount");
					var saveOptions = _.extend({}, options);
					saveOptions.patch = true;
					moneyAccount.save({
						currentBalance : moneyAccount.xGet("currentBalance") - amount
					}, saveOptions);
					this._xDelete(xFinishCallback, options);
				}
			},
			canAddNew : function() {
				if (this.xGet("project")) {
					if (this.xGet("project").xGet("ownerUser") !== Alloy.Models.User) {
						var projectShareAuthorization = this.xGet("project").xGet("projectShareAuthorizations").at(0);
						if (this.xGet("ownerUser") === Alloy.Models.User && projectShareAuthorization.xGet("projectShareMoneyIncomeDetailAddNew")) {
							return true;
						} else {
							return false;
						}
					}
				}
				return this.xGet("ownerUser") === Alloy.Models.User;
			},
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果账户也是新增的
				// 2. 账户已经存在

				var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
					id : record.moneyAccountId
				});
				if (moneyAccount.id) {
					moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") + record.amount, {
						dbTrans : dbTrans,
						patch : true
					});
				}
			},
			syncUpdate : function(record, dbTrans) {
				// 如果本地的支出已经有明细，我们不用服务器上的支出金额覆盖，而是等同步服务器上的支出明细时再更新本地支出金额
				// 如果本地的支出没有明细，我们直接使用服务器上的支出金额
				if(this.__syncAmount !== undefined){
					record.amount = this.__syncAmount;
					delete this.__syncAmount;
				}
				// 先更新老账户余额				
				var oldMoneyAccountBalance;
				var oldMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
					id : this.xGet("moneyAccountId")
				});
				if (this.xGet("moneyAccountId") === record.moneyAccountId) {
					oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") - this.xGet("amount") + record.amount;	
					oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
						dbTrans : dbTrans,
						patch : true
					});
				} else {
					if(oldMoneyAccount.id){
						oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") - this.xGet("amount");	
						oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
							dbTrans : dbTrans,
							patch : true
						});
					}
					
					var newMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.moneyAccountId
					});
					if (newMoneyAccount.id) {
						newMoneyAccount.save("currentBalance", newMoneyAccount.xGet("currentBalance") + record.amount, {
							dbTrans : dbTrans,
							patch : true
						});
					}
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				delete record.id;
				var localUpdated = false;
				if(this.__syncAmount !== undefined){
					localUpdated = true;
					this.syncUpdate(record, dbTrans);
					if(this.xGet("lastClientUpdateTime") >= record.lastClientUpdateTime){
						this._syncUpdate({amount : record.amount}, dbTrans);
					}
				}
				
				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if(this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime){
					this._syncUpdate(record, dbTrans);
					if(!localUpdated){
						var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
						dbTrans.db.execute(sql, [this.xGet("id")]);
					}
				} 
				// 让本地修改覆盖服务器上的记录
				
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

