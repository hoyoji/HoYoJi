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
			moneyLendId : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
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
				attribute : "moneyPaybacks"
			},
			project : {
				type : "Project",
				attribute : "moneyPaybacks"
			},
			picture : {
				type : "Picture",
				attribute : null
			},
			moneyLend : {
				type : "MoneyLend",
				attribute : "moneyPaybacks"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyPaybacks"
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
					if (this.xGet("moneyLend")) {
						var moneyLend = this.xGet("moneyLend");
						if (this.xGet("date") < moneyLend.xGet("date")) {
							error = {
								msg : "收款日不能在借出日之前（" + moneyLend.xGet("date") + "）"
							};
						}
					}
					xValidateComplete(error);
				},

				amount : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("amount")) || this.xGet("amount") === null) {
						error = {
							msg : "请输入金额"
						};
					} else {
						if (this.xGet("amount") < 0) {
							error = {
								msg : "金额不能为负数"
							};
						} else if (this.xGet("amount") > 999999999) {
							error = {
								msg : "金额超出范围，请重新输入"
							};
						}
					}
					if (this.xGet("moneyLend")) {
						var paybackRequireAmount;
						var lendRate = this.xGet("moneyLend").xGet("exchangeRate");
						var paybackRate = this.xGet("exchangeRate");
						if (this.isNew()) {
							paybackRequireAmount = this.xGet("moneyLend").xGet("amount") * lendRate - this.xGet("moneyLend").previous("paybackedAmount");
						} else {
							paybackRequireAmount = this.xGet("moneyLend").xGet("amount") * lendRate - this.xGet("moneyLend").previous("paybackedAmount") + this.xPrevious("amount") * this.xPrevious("exchangeRate");
						}
						if (this.xGet("amount") * paybackRate > paybackRequireAmount) {
							error = {
								msg : "收款金额不能大于当前借出的应收款金额（" + paybackRequireAmount + "）"
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
								msg : "请选择与账户相同币种的债务人账户"
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
				var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					var accountCurrency = this.xGet("moneyAccount").xGet("currency");
					if (accountCurrency === userCurrency) {
						exchange = 1;
					}else{
						var exchanges = userCurrency.getExchanges(accountCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
					return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") / exchange).toUserCurrency();
				} else {
					var projectCurrency = this.xGet("project").xGet("currency");
					if (projectCurrency === userCurrency) {
						exchange = 1;
					} else {
						var exchanges = userCurrency.getExchanges(projectCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
					return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate") / exchange).toUserCurrency();
				}
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
				return this.xGet("project").xGet("currency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2);
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
					if (friend && friend.id) {
						ownerUserSymbol = friend.getDisplayName();
					} else {
						ownerUserSymbol = this.xGet("ownerUser").xGet("userName");
					}
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
				if (!remark) {
					remark = "无备注";
				}
				return remark;
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				var amount = this.xGet("amount");
				var paybackRate = this.xGet("exchangeRate");
				var interest = this.xGet("interest");
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;

				var moneyAccount = this.xGet("moneyAccount");
				moneyAccount.save({
					currentBalance : moneyAccount.xGet("currentBalance") - amount - interest
				}, saveOptions);

				if (self.xGet("moneyLend")) {
					var moneyLend = self.xGet("moneyLend");
					var lendRate = moneyLend.xGet("exchangeRate");
					moneyLend.save({
						paybackedAmount : moneyLend.xGet("paybackedAmount") - Number((amount * paybackRate).toFixed(2))
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
						// moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") + record.amount + record.interest, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance + record.amount + record.interest : record.amount + record.interest;
					}
				}
				if (record.moneyLendId) {
					var moneyLend = Alloy.createModel("MoneyLend").xFindInDb({
						id : record.moneyLendId
					});
					if (moneyLend.id) {
						// moneyLend.save("paybackedAmount", moneyLend.xGet("paybackedAmount") + Number((record.amount * record.exchangeRate).toFixed(2)), {
						// //syncFromServer : true,
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyLend.__syncPaybackedAmount = moneyLend.__syncPaybackedAmount ? moneyLend.__syncPaybackedAmount + Number((record.amount * record.exchangeRate).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2));
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
						// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") - this.xGet("amount") - this.xGet("interest") + record.amount + record.interest;
						// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance - this.xGet("amount") - this.xGet("interest") + record.amount + record.interest : -this.xGet("amount") - this.xGet("interest") + record.amount + record.interest;
					} else {
						if (oldMoneyAccount.id) {
							// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") - this.xGet("amount") - this.xGet("interest");
							// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance - this.xGet("amount") - this.xGet("interest") : -this.xGet("amount") - this.xGet("interest");
						}
						var newMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.moneyAccountId
						});
						if (newMoneyAccount.id) {
							// newMoneyAccount.save("currentBalance", newMoneyAccount.xGet("currentBalance") + record.amount + record.interest, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							newMoneyAccount.__syncCurrentBalance = newMoneyAccount.__syncCurrentBalance ? newMoneyAccount.__syncCurrentBalance + record.amount + record.interest : +record.amount + record.interest;
						}
					}
				}
				if (record.moneyLendId) {
					var moneyLend = Alloy.createModel("MoneyLend").xFindInDb({
						id : record.moneyLendId
					});
					if (moneyLend.id) {
						// moneyLend.save("paybackedAmount", moneyLend.xGet("paybackedAmount") - Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2)) + Number((record.amount * record.exchangeRate).toFixed(2)), {
						// //syncFromServer : true,
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyLend.__syncPaybackedAmount = moneyLend.__syncPaybackedAmount ? moneyLend.__syncPaybackedAmount - Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2)) + Number((record.amount * record.exchangeRate).toFixed(2)) : -Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2)) + Number((record.amount * record.exchangeRate).toFixed(2));
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
				} else {
					// 让本地修改覆盖服务器上的记录
					this._syncUpdate({lastServerUpdateTime : record.lastServerUpdateTime}, dbTrans);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				var self = this;
				var amount = this.xGet("amount");
				var interest = this.xGet("interest");
				// var saveOptions = {dbTrans : dbTrans, patch : true, syncFromServer : true};

				if (this.xGet("ownerUserId") === Alloy.Models.User.id) {
					var moneyAccount = this.xGet("moneyAccount");
					// moneyAccount.save({
					// currentBalance : moneyAccount.xGet("currentBalance") - amount - interest
					// }, saveOptions);
					moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance - amount - interest : -amount - interest;
				}
				if (self.xGet("moneyLend")) {
					var paybackRate = self.xGet("exchangeRate");
					var moneyLend = self.xGet("moneyLend");
					// var lendRate = moneyLend.xGet("exchangeRate");
					// moneyLend.save({
					// paybackedAmount : moneyLend.xGet("paybackedAmount") - Number((amount * paybackRate).toFixed(2))
					// }, saveOptions);
					moneyLend.__syncPaybackedAmount = moneyLend.__syncPaybackedAmount ? moneyLend.__syncPaybackedAmount - Number((amount * paybackRate).toFixed(2)) : -Number((amount * paybackRate).toFixed(2));
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

