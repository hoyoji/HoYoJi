exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			friendUserId : "TEXT",
			friendAccountId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			pictureId : "TEXT",
			localCurrencyId : "TEXT NOT NULL",
			exchangeRate : "REAL NOT NULL",
			returnDate : "TEXT",
			returnedAmount : "REAL NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		},
		hasMany : {
			pictures : {
				type : "Picture",
				attribute : "record",
				cascadeDelete : true
			},
			moneyReturns : {
				type : "MoneyReturn",
				attribute : "moneyBorrow"
			}
		},
		belongsTo : {
			friendUser : {
				type : "User",
				attribute : null
			},
			friendAccount : {
				type : "MoneyAccount",
				attribute : null
			},
			moneyAccount : {
				type : "MoneyAccount",
				attribute : "moneyBorrows"
			},
			project : {
				type : "Project",
				attribute : "moneyBorrows"
			},
			picture : {
				type : "Picture",
				attribute : null
			},
			localCurrency : {
				type : "Currency",
				attribute : null
			},
			ownerUser : {
				type : "User",
				attribute : "moneyBorrows"
			}
		},
		rowView : "money/moneyBorrowRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				date : function(xValidateComplete) {
					var error;
					for ( i = 0; i < this.xGet("moneyReturns").length; i++) {
						if (this.xGet("date") > this.xGet("moneyReturns").at(i).xGet("date")) {
							error = {
								msg : "借入时间不能大于明细的还款时间，请重新输入"
							};
						}
					}
					xValidateComplete(error);
				},
				amount : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("amount"))) {
						error = {
							msg : "请输入金额"
						};
					} else {
						if (this.xGet("amount") < 0) {
							error = {
								msg : "金额不能为负数"
							};
						} else if (this.xGet("amount") < this.xGet("returnedAmount")) {
							error = {
								msg : "借入金额小于已还款金额 ，请重新输入"
							}
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
								msg : "请选择与账户相同币种的债权人账户"
							};
						}
					}
					xValidateComplete(error);
				},
				returnDate : function(xValidateComplete) {
					var error;
					var returnDate = this.xGet("returnDate");
					var date = this.xGet("date");
					if (returnDate && returnDate < date) {
						error = {
							msg : "还款日期在借入日期之前，请重新选择"
						};
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
				}
			},
			getLocalAmount : function() {
				return this.xGet("localCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate")).toUserCurrency();
			},
			getProjectName : function() {
				return this.xGet("project").xGet("name");
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
					&& this.xGet("moneyReturns").length > 0) {
					xFinishCallback({
						msg : "当前借入的还款明细不为空，不能删除"
					})
				} else {
						var saveOptions = _.extend({}, options);
						saveOptions.patch = true;
					if(this.xGet("ownerUserId") === Alloy.Models.User.id){
						var moneyAccount = this.xGet("moneyAccount");
						var amount = this.xGet("amount");
						moneyAccount.save({
							currentBalance : moneyAccount.xGet("currentBalance") - amount
						}, saveOptions);
					}
					this._xDelete(xFinishCallback, options);
				}
			},
			// canMoneyReturnAddNew : function() {
			// if (this.xGet("ownerUser") !== Alloy.Models.User) {
			// var projectShareAuthorization = this.xGet("projectShareAuthorizations").at(0);
			// if (projectShareAuthorization.xGet("projectShareMoneyReturnAddNew")) {
			// return true;
			// } else {
			// return false;
			// }
			// }
			// return this.xGet("ownerUser") === Alloy.Models.User;
			// }
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 2. 如果账户也是新增的,我们不用更新账户余额，直接拿服务器上的余额即可
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

