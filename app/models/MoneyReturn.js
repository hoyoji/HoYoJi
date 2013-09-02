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
			exchangeRate : "REAL NOT NULL",
			interest : "REAL NOT　NULL",
			remark : "TEXT",
			moneyBorrowId : "TEXT",
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
				attribute : "moneyReturns"
			},
			project : {
				type : "Project",
				attribute : "moneyReturns"
			},
			picture : {
				type : "Picture",
				attribute : null
			},
			moneyBorrow : {
				type : "MoneyBorrow",
				attribute : "moneyReturns"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyReturns"
			}
		},

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
					if (this.xGet("moneyBorrow")) {
						var moneyBorrow = this.xGet("moneyBorrow");
						if (this.xGet("date") < moneyBorrow.xGet("date")) {
							error = {
								msg : "还款日不能在借入日之前（" + moneyBorrow.xGet("date") + "）"
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
								msg : "金额不能小于0"
							};
						}
					}

					if (this.xGet("moneyBorrow")) {
						var returnRequireAmount;
						var borrowRate = this.xGet("moneyBorrow").xGet("exchangeRate");
						var returnRate = this.xGet("exchangeRate");
						if (this.isNew()) {
							returnRequireAmount = this.xGet("moneyBorrow").xGet("amount") - this.xGet("moneyBorrow").previous("returnedAmount");
						} else {
							returnRequireAmount = this.xGet("moneyBorrow").xGet("amount") - this.xGet("moneyBorrow").previous("returnedAmount") + this.previous("amount");
						}
						if (this.xGet("amount") * returnRate / borrowRate > returnRequireAmount) {
							error = {
								msg : "还款金额不能大于当前借入的应还款金额（" + returnRequireAmount + "）"
							};
						}
					}
					xValidateComplete(error);
				},
				interest : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("interest")) || this.xGet("interest") === null) {
						error = {
							msg : "请输入利息"
						};
					} else {
						if (this.xGet("interest") < 0) {
							error = {
								msg : "利息不能小于0"
							};
						}
					}
					xValidateComplete(error);
				},
				exchangeRate : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("exchangeRate"))) {
						error = {
							msg : "请输入汇率"
						};
					} else {
						if (this.xGet("exchangeRate") < 0 || this.xGet("exchangeRate") === 0) {
							error = {
								msg : "汇率不能小于或等于0"
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
				var exchange = null;
				if (this.xGet("ownerUser") === Alloy.Models.User && this.xGet("moneyAccount").xGet("currency") === Alloy.Models.User.xGet("activeCurrency")) {
					exchange = this.xGet("exchangeRate");
				} else {
					var projectCurrency = this.xGet("project").xGet("currency");
					var userCurrency = Alloy.Models.User.xGet("activeCurrency");
					if (projectCurrency === userCurrency) {
						exchange = 1;
					} else {
						var exchanges = userCurrency.getExchanges(projectCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
				}
				return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate") / exchange).toUserCurrency();
			},
			getProjectName : function() {
				return this.xGet("project").xGet("name");
			},
			getAccountCurrency : function() {
				var currencySymbol = null;
				if (this.xGet("ownerUserId") === Alloy.Models.User.xGet("id")) {
					var accountCurrency = this.xGet("moneyAccount").xGet("currency");
					var localCurrency = Alloy.Models.User.xGet("activeCurrency");
					if (accountCurrency === localCurrency) {
						currencySymbol = null;
					} else {
						currencySymbol = accountCurrency.xGet("symbol") + this.xGet("amount").toUserCurrency();
					}
				}
				// else{
				// currencySymbol = this.xGet("project").xGet("currency").xGet("code") + " " + this.xGet("amount")*this.xGet("exchangeRate");
				// }
				return currencySymbol;
			},
			getProjectAmount : function() {
				return this.xGet("project").xGet("currency").xGet("symbol") + this.xGet("amount") * this.xGet("exchangeRate");
			},
			getProjectCurrencyAmount : function() {
				return this.xGet("amount") * this.xGet("exchangeRate");
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
			getInterest : function() {
				var exchange = null;
				if (this.xGet("ownerUser") === Alloy.Models.User && this.xGet("moneyAccount").xGet("currency") === Alloy.Models.User.xGet("activeCurrency")) {
					exchange = this.xGet("exchangeRate");
				} else {
					var projectCurrency = this.xGet("project").xGet("currency");
					var userCurrency = Alloy.Models.User.xGet("activeCurrency");
					if (projectCurrency === userCurrency) {
						exchange = 1;
					} else {
						var exchanges = userCurrency.getExchanges(projectCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
				}
				return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("interest") * this.xGet("exchangeRate") / exchange).toUserCurrency();
			},
			getRemark : function() {
				var remark = this.xGet("remark");
				if(!remark) {
					remark = "无备注";
				}
				return remark;
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				var amount = this.xGet("amount");
				var returnRate = this.xGet("exchangeRate");
				var interest = this.xGet("interest");
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;

				var moneyAccount = this.xGet("moneyAccount");
				moneyAccount.save({
					currentBalance : moneyAccount.xGet("currentBalance") + amount + interest
				}, saveOptions);

				if (self.xGet("moneyBorrow")) {
					var moneyBorrow = self.xGet("moneyBorrow");
					var borrowRate = moneyBorrow.xGet("exchangeRate");
					moneyBorrow.save({
						returnedAmount : moneyBorrow.xGet("returnedAmount") - amount * returnRate / borrowRate
					}, saveOptions);
				}

				this._xDelete(xFinishCallback, options);
			},
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果账户也是新增的
				// 2. 账户已经存在

				if (record.ownerUserId === Alloy.Models.User.id) {
					var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.moneyAccountId
					});
					if (moneyAccount.id) {
						moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") - record.amount - record.interest, {
							dbTrans : dbTrans,
							patch : true
						});
					}
				}
				if (record.moneyBorrowId) {
					var moneyBorrow = Alloy.createModel("moneyBorrow").xFindInDb({
						id : record.moneyBorrowId
					});
					if (moneyBorrow.id) {
						moneyBorrow.save("returnedAmount", moneyBorrow.xGet("returnedAmount") - record.amount, {
							//syncFromServer : true,
							dbTrans : dbTrans,
							patch : true
						});
					}
				}
			},
			syncUpdate : function(record, dbTrans) {
				if (record.ownerUserId === Alloy.Models.User.id) {
					var oldMoneyAccountBalance;
					var oldMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : this.xGet("moneyAccountId")
					});
					if (this.xGet("moneyAccountId") === record.moneyAccountId) {
						oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount") + this.xGet("interest") - record.amount - record.interest;
						oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
							dbTrans : dbTrans,
							patch : true
						});
					} else {
						if (oldMoneyAccount.id) {
							oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount") + this.xGet("interest");
							oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
								dbTrans : dbTrans,
								patch : true
							});
						}
						var newMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.moneyAccountId
						});
						if (newMoneyAccount.id) {
							newMoneyAccount.save("currentBalance", newMoneyAccount.xGet("currentBalance") - record.amount - record.interest, {
								dbTrans : dbTrans,
								patch : true
							});
						}
					}
				}
				if (record.moneyBorrowId) {
					var moneyBorrow = Alloy.createModel("moneyBorrow").xFindInDb({
						id : record.moneyBorrowId
					});
					if (moneyBorrow.id) {
						moneyBorrow.save("returnedAmount", moneyBorrow.xGet("returnedAmount") + this.xGet("amount") - record.amount, {
							//syncFromServer : true,
							dbTrans : dbTrans,
							patch : true
						});
					}
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					delete record.id;
					this.syncUpdate(record, dbTrans);
					this._syncUpdate(record, dbTrans);
					var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					dbTrans.db.execute(sql, [this.xGet("id")]);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				var self = this;
				var amount = this.xGet("amount");
				var returnRate = this.xGet("exchangeRate");
				var interest = this.xGet("interest");
				var saveOptions = {dbTrans : dbTrans, patch : true, syncFromServer : true};
 
				var moneyAccount = this.xGet("moneyAccount");
				moneyAccount.save({
					currentBalance : moneyAccount.xGet("currentBalance") + amount + interest
				}, saveOptions);

				if (self.xGet("moneyBorrow")) {
					var moneyBorrow = self.xGet("moneyBorrow");
					var borrowRate = moneyBorrow.xGet("exchangeRate");
					moneyBorrow.save({
						returnedAmount : moneyBorrow.xGet("returnedAmount") - amount * returnRate / borrowRate
					}, saveOptions);
				}
			},			
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});

		return Collection;
	}
};

