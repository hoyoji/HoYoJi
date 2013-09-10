exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			incomeType : "TEXT NOT NULL",
			friendUserId : "TEXT",
			friendAccountId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			pictureId : "TEXT",
			moneyIncomeCategoryId : "TEXT NOT NULL",
			exchangeRate : "REAL NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER",
			useDetailsTotal : "INTEGER NOT NULL",
			depositeId : "TEXT"
		},
		defaults : {
			useDetailsTotal : 0
		},
		hasMany : {
			pictures : {
				type : "Picture",
				attribute : "record",
				cascadeDelete : 1
			},
			moneyIncomeDetails : {
				type : "MoneyIncomeDetail",
				attribute : "moneyIncome"
			},
			moneyIncomeApportions : {
				type : "MoneyIncomeApportion",
				attribute : "moneyIncome",
				cascadeDelete : 1
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
					} else if (this.xGet("amount") < 0) {
						error = {
							msg : "金额不能为负数"
						};
					} else if (this.xGet("incomeType") !== "Deposite") {
						var apportionAmount = 0;
						this.xGet("moneyIncomeApportions").forEach(function(item) {
							if (!item.__xDeleted && !item.__xDeletedHidden) {
								apportionAmount = apportionAmount + Number(item.xGet("amount").toFixed(2));
							}
						});
						if (this.xGet("amount") !== apportionAmount) {
							error = {
								msg : "分摊总额与收入金额不相等，请修正"
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
				// var exchange;
				// var projectCurrency = this.xGet("project").xGet("currency");
				// var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				// if (projectCurrency === userCurrency) {
				// exchange = 1;
				// } else {
				// var exchanges = userCurrency.getExchanges(projectCurrency);
				// if (exchanges.length) {
				// exchange = exchanges.at(0).xGet("rate");
				// } else {
				// throw new Error("找不到汇率");
				// }
				// }
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
				return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate") / exchange).toFixed(2);
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
				return this.xGet("project").xGet("currency").xGet("symbol") + Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2));
			},
			getProjectCurrencyAmount : function() {
				return Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2));
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
			// setAmount : function(amount){
			// amount = amount || 0;
			// if(this.xGet("moneyIncomeDetails").length > 0){
			// amount = 0;
			// this.xGet("moneyIncomeDetails").map(function(item){
			// amount += item.xGet("amount");
			// })
			// }
			// this.xSet("amount", amount);
			// },
			generateIncomeApportions : function(saveMode) {
				var self = this;
				var moneyIncomeApportionsArray = [];
				this.xGet("moneyIncomeApportions").forEach(function(item) {
					if (saveMode) {
						if (!item.__xDeletedHidden && !item.__xDeleted) {
							moneyIncomeApportionsArray.push(item);
						}
					} else {
						if (!item.__xDeletedHidden) {
							moneyIncomeApportionsArray.push(item);
						}
					}
				});
				if (moneyIncomeApportionsArray.length === 0) {// 生成分摊
					var amountTotal = 0, moneyIncomeApportion, amount;
					if (this.xGet("project").xGet("projectShareAuthorizations").length === 1) {
						moneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
							moneyIncome : self,
							friendUser : self.xGet("ownerUser"),
							amount : Number(self.xGet("amount")) || 0,
							apportionType : "Average"
						});
						self.xGet("moneyIncomeApportions").add(moneyIncomeApportion);
					} else {
						this.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
							if (projectShareAuthorization.xGet("state") === "Accept") {
								amount = Number(((self.xGet("amount") || 0) * (projectShareAuthorization.xGet("sharePercentage") / 100)).toFixed(2));
								moneyIncomeApportion = Alloy.createModel("MoneyIncomeApportion", {
									moneyIncome : self,
									friendUser : projectShareAuthorization.xGet("friendUser"),
									amount : amount,
									apportionType : "Fixed"
								});
								self.xGet("moneyIncomeApportions").add(moneyIncomeApportion);
								amountTotal += amount;
							}
						});
						if (amountTotal !== self.xGet("amount")) {
							moneyIncomeApportion.xSet("amount", amount + (self.xGet("amount") - amountTotal));
						}
					}
					this.hasAddedApportions = true;
				}
			},
			getRemark : function() {
				var remark = this.xGet("remark");
				if (!remark) {
					remark = "无备注";
				}
				return remark;
			},
			xDelete : function(xFinishCallback, options) {
				if (this.xGet("moneyIncomeDetails").length > 0) {
					xFinishCallback({
						msg : "当前收入的明细不为空，不能删除"
					});
				} else {
					// if (this.xGet("moneyIncomeApportions").length === 1) {
					// this.xGet("moneyIncomeApportions").forEach(function(item) {
					// item._xDelete();
					// });
					// }
					var self = this;
					var saveOptions = _.extend({}, options);
					saveOptions.patch = true;
					saveOptions.wait = true;
					var moneyAccount = this.xGet("moneyAccount");
					var amount = this.xGet("amount");
					moneyAccount.save({
						currentBalance : moneyAccount.xGet("currentBalance") - amount
					}, saveOptions);

					var myProjectShareAuthorization;
					self.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("friendUser") === self.xGet("ownerUser")) {
							var actualTotalIncome = item.xGet("actualTotalIncome") - self.getProjectCurrencyAmount();
							item.xSet("actualTotalIncome", actualTotalIncome);
							myProjectShareAuthorization = item;
							// item.save({
							// actualTotalIncome : actualTotalIncome
							// }, saveOptions);
						}
					});

					this._xDelete(function(e) {
						if (e) {
							myProjectShareAuthorization.xSet("actualTotalIncome", myProjectShareAuthorization.xPrevious("actualTotalIncome"));
						}
						xFinishCallback(e);
					}, options);
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

				if (record.ownerUserId === Alloy.Models.User.id) {
					var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.moneyAccountId
					});
					if (moneyAccount.id) {
						// moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") + record.amount, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance + record.amount : record.amount;
					} else {
						dbTrans.__syncData[moneyAccount.id] = dbTrans.__syncData[moneyAccount.id] || {};
						dbTrans.__syncData[moneyAccount.id].__syncCurrentBalance = dbTrans.__syncData[moneyAccount.id].__syncCurrentBalance ? dbTrans.__syncData[moneyAccount.id].__syncCurrentBalance + record.amount : record.amount;
					}
				}
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : record.projectId,
					friendUserId : record.ownerUserId
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncActualTotalIncome = projectShareAuthorization.__syncActualTotalIncome ? projectShareAuthorization.__syncActualTotalIncome + Number((record.amount * record.exchangeRate).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2));
				}
			},
			syncUpdate : function(record, dbTrans) {
				// 如果本地的支出已经有明细，我们不用服务器上的支出金额覆盖，而是等同步服务器上的支出明细时再更新本地支出金额
				// 如果本地的支出没有明细，我们直接使用服务器上的支出金额

				if (record.useDetailsTotal && this.__syncAmount !== undefined) {
					record.amount = this.__syncAmount + this.xGet("moneyIncomeDetails").xSum("amount");
				}
				delete this.__syncAmount;

				if (record.ownerUserId === Alloy.Models.User.id) {
					// 先更新老账户余额
					var oldMoneyAccountBalance;
					var oldMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : this.xGet("moneyAccountId")
					});
					if (this.xGet("moneyAccountId") === record.moneyAccountId) {
						// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") - this.xGet("amount") + record.amount;
						// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance - this.xGet("amount") + record.amount : -this.xGet("amount") + record.amount;
					} else {
						if (oldMoneyAccount.id) {
							// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") - this.xGet("amount");
							// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance - this.xGet("amount") : -this.xGet("amount");
						} else {
							dbTrans.__syncData[oldMoneyAccount.id] = dbTrans.__syncData[oldMoneyAccount.id] || {};
							dbTrans.__syncData[oldMoneyAccount.id].__syncCurrentBalance = dbTrans.__syncData[oldMoneyAccount.id].__syncCurrentBalance ? dbTrans.__syncData[oldMoneyAccount.id].__syncCurrentBalance - this.xGet("amount") : -this.xGet("amount");
						}

						var newMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.moneyAccountId
						});
						if (newMoneyAccount.id) {
							// newMoneyAccount.save("currentBalance", newMoneyAccount.xGet("currentBalance") + record.amount, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							newMoneyAccount.__syncCurrentBalance = newMoneyAccount.__syncCurrentBalance ? newMoneyAccount.__syncCurrentBalance + record.amount : record.amount;
						} else {
							dbTrans.__syncData[newMoneyAccount.id] = dbTrans.__syncData[newMoneyAccount.id] || {};
							dbTrans.__syncData[newMoneyAccount.id].__syncCurrentBalance = dbTrans.__syncData[newMoneyAccount.id].__syncCurrentBalance ? dbTrans.__syncData[newMoneyAccount.id].__syncCurrentBalance + record.amount : record.amount;
						}
					}

					var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
						projectId : record.projectId,
						friendUserId : record.ownerUserId
					});
					if (projectShareAuthorization.id) {
						projectShareAuthorization.__syncActualTotalIncome = projectShareAuthorization.__syncActualTotalIncome ? projectShareAuthorization.__syncActualTotalIncome + Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2));
					}
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				delete record.id;
				var localUpdated = false;
				if (this.__syncAmount !== undefined) {
					localUpdated = true;
					this.syncUpdate(record, dbTrans);
					if (this.xGet("lastClientUpdateTime") >= record.lastClientUpdateTime) {
						this._syncUpdate({
							amount : record.amount
						}, dbTrans);
					}
				}

				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					if (!localUpdated) {
						this.syncUpdate(record, dbTrans);
						var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
						dbTrans.db.execute(sql, [this.xGet("id")]);
					}
					this._syncUpdate(record, dbTrans);
				}
				// 让本地修改覆盖服务器上的记录

			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				var self = this;
				// var saveOptions = {dbTrans : dbTrans, patch : true, syncFromServer : true};
				var moneyAccount = this.xGet("moneyAccount");
				// var amount = this.xGet("amount");
				// moneyAccount.save({
				// currentBalance : moneyAccount.xGet("currentBalance") - amount
				// }, saveOptions);
				moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance - this.xGet("amount") : -this.xGet("amount");

				self.xGet("project").xGet("projectShareAuthorizations").forEach(function(item) {
					if (item.xGet("friendUser") === self.xGet("ownerUser")) {
						// var actualTotalIncome = item.xGet("actualTotalIncome") - self.getProjectCurrencyAmount();
						// item.save({
						// actualTotalIncome : actualTotalIncome
						// }, saveOptions);
						item.__syncActualTotalIncome = item.__syncActualTotalIncome ? item.__syncActualTotalIncome - self.getProjectCurrencyAmount() : -self.getProjectCurrencyAmount();
						;

					}
				});
			},
			syncRollback : function() {
				delete this.__syncAmount;
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
};

