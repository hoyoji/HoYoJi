exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			expenseType : "TEXT NOT NULL",
			friendUserId : "TEXT",
			friendAccountId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			pictureId : "TEXT",
			moneyExpenseCategoryId : "TEXT NOT NULL",
			exchangeRate : "REAL NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER",
			useDetailsTotal : "INTEGER NOT NULL"
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
			moneyExpenseDetails : {
				type : "MoneyExpenseDetail",
				attribute : "moneyExpense"
			},
			moneyExpenseApportions : {
				type : "MoneyExpenseApportion",
				attribute : "moneyExpense",
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
				attribute : "moneyExpenses"
			},
			project : {
				type : "Project",
				attribute : "moneyExpenses"
			},
			picture : {
				type : "Picture",
				attribute : null
			},
			moneyExpenseCategory : {
				type : "MoneyExpenseCategory",
				attribute : "moneyExpenses"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyExpenses"
			}
		},
		rowView : "money/moneyExpenseRow",
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
					} else if (this.xGet("expenseType") !== "Deposite") {
						var apportionAmount = 0;
						this.xGet("moneyExpenseApportions").forEach(function(item) {
							if (!item.__xDeleted && !item.__xDeletedHidden) {
								apportionAmount = apportionAmount + Number(item.xGet("amount").toFixed(2));
								console.info("++++++amount++++" + item.xGet("amount"));
							}
						});
						if (apportionAmount > 0 && this.xGet("amount") !== apportionAmount) {
							error = {
								msg : "分摊总额与支出金额不相等，请修正"
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
				moneyExpenseCategory : function(xValidateComplete) {
					var error;
					var moneyExpenseCategory = this.xGet("moneyExpenseCategory");
					if (!moneyExpenseCategory) {
						error = {
							msg : "分类不能为空"
						};
					}
					xValidateComplete(error);
				}
			},
			getLocalAmount : function() {
				var exchange;
				var projectCurrency = this.xGet("project").xGet("currency");
				var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				var exchanges = userCurrency.getExchanges(projectCurrency);
				if (exchanges.length) {
					exchange = exchanges.at(0).xGet("rate");
				} else {
					throw new Error("找不到汇率");
				}
				return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate") / exchange).toUserCurrency();
			},
			getProjectName : function() {
				return this.xGet("project").xGet("name");
			},
			getMoneyExpenseCategoryName : function() {
				return this.xGet("moneyExpenseCategory").xGet("name");
			},
			getAccountCurrency : function() {
				var currencySymbol = null;
				if (this.xGet("ownerUserId") === Alloy.Models.User.xGet("id")) {
					var accountCurrency = this.xGet("moneyAccount").xGet("currency");
					var localCurrency = Alloy.Models.User.xGet("activeCurrency");
					if (accountCurrency === localCurrency) {
						currencySymbol = null;
					} else {
						currencySymbol = accountCurrency.xGet("code") + " " + accountCurrency.xGet("symbol") + this.xGet("amount").toUserCurrency();
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
							friendUserId : this.xGet("ownerUserId"),
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
			// if(this.xGet("moneyExpenseDetails").length > 0){
			// amount = 0;
			// this.xGet("moneyExpenseDetails").map(function(item){
			// amount += item.xGet("amount");
			// })
			// }
			// this.xSet("amount", amount);
			// },
			generateExpenseApportions : function() {
				var self = this;
				var moneyExpenseApportionsArray = [];
				this.xGet("moneyExpenseApportions").forEach(function(item) {
					if (!item.__xDeletedHidden) {
						moneyExpenseApportionsArray.push(item);
					}
				});
				if (moneyExpenseApportionsArray.length === 0) {// 生成分摊
					var amountTotal = 0, moneyExpenseApportion, amount;
					if (this.xGet("project").xGet("projectShareAuthorizations").length === 1) {
						moneyExpenseApportion = Alloy.createModel("MoneyExpenseApportion", {
							moneyExpense : self,
							friendUser : self.xGet("ownerUser"),
							amount : Number(self.xGet("amount")) || 0,
							apportionType : "Average"
						});
						self.xGet("moneyExpenseApportions").add(moneyExpenseApportion);
					} else {
						this.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
							if (projectShareAuthorization.xGet("state") === "Accept") {
								amount = Number(((self.xGet("amount") || 0) * (projectShareAuthorization.xGet("sharePercentage") / 100)).toFixed(2));
								moneyExpenseApportion = Alloy.createModel("MoneyExpenseApportion", {
									moneyExpense : self,
									friendUser : projectShareAuthorization.xGet("friendUser"),
									amount : amount,
									apportionType : "Fixed"
								});
								self.xGet("moneyExpenseApportions").add(moneyExpenseApportion);
								amountTotal += amount;
							}
						});
						if (amountTotal !== self.xGet("amount")) {
							moneyExpenseApportion.xSet("amount", amount + (self.xGet("amount") - amountTotal));
						}
					}
					this.hasAddedApportions = true;
				}
			},
			xDelete : function(xFinishCallback, options) {
				if (options.syncFromServer !== true && this.xGet("moneyExpenseDetails").length > 0) {
					xFinishCallback && xFinishCallback({
						msg : "当前支出的明细不为空，不能删除"
					});
				} else {
					// if (this.xGet("moneyExpenseApportions").length === 1) {
					// this.xGet("moneyExpenseApportions").forEach(function(item) {
					// item._xDelete();
					// });
					// }
					var self = this;
					var saveOptions = _.extend({}, options);
					saveOptions.patch = true;
					var moneyAccount = this.xGet("moneyAccount");
					var amount = this.xGet("amount");
					moneyAccount.save({
						currentBalance : moneyAccount.xGet("currentBalance") + amount
					}, saveOptions);

					var projectShareAuthorizations = self.xGet("project").xGet("projectShareAuthorizations");
					projectShareAuthorizations.forEach(function(item) {
						if (item.xGet("friendUser") === self.xGet("ownerUser")) {
							var actualTotalExpense = item.xGet("actualTotalExpense") - self.getProjectCurrencyAmount();
							item.xSet("actualTotalExpense", actualTotalExpense);
							item.save({
								actualTotalExpense : actualTotalExpense
							}, saveOptions);
						}
					});

					this._xDelete(xFinishCallback, options);
				}
			},
			canAddNew : function() {
				if (this.xGet("project")) {
					if (this.xGet("project").xGet("ownerUser") !== Alloy.Models.User) {
						var projectShareAuthorization = this.xGet("project").xGet("projectShareAuthorizations").at(0);
						if (this.xGet("ownerUser") === Alloy.Models.User && projectShareAuthorization.xGet("projectShareMoneyExpenseDetailAddNew")) {
							return true;
						} else {
							return false;
						}
					}
				}
				return this.xGet("ownerUser") === Alloy.Models.User;
			},
			syncAddNew : function(record, dbTrans) {
				// 该记录在本地没有，服务器上有。我们需要更新账户余额
				// 2. 如果账户也是新增的, 我们不用更新账户余额，直接拿服务器上的余额即可
				// 3. 如果账户已经存在本地，我们更新该余额
				if (record.ownerUserId === Alloy.Models.User.id) {
					var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.moneyAccountId
					});
					if (moneyAccount.id) {
						// 3. 如果账户已经存在本地，我们更新该余额
						moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") - record.amount, {
							dbTrans : dbTrans,
							patch : true
							// wait : true  // 注意：我们不用wait=true, 这样才能使对currentBalance的更新即时生效并且使该值能用为下一条支出的值。
						});
					}
				}
			},
			syncUpdate : function(record, dbTrans) {
				// 该记录同时存在服务器上和在本地。在服务器上被改变，但是在本地未被改变
				// 如果本地的支出已经有明细，我们不用服务器上的支出金额覆盖，而是等同步服务器上的支出明细时再更新本地支出金额
				// 如果本地的支出没有明细，我们直接使用服务器上的支出金额
				// __syncAmount 是临时变量。当支出的金额不能直接使用服务器上的支出金额时（比如要通过支出明细来更新支出金额），我们把更新的支出金额保存到这个临时变量。
				if (record.useDetailsTotal && this.__syncAmount !== undefined) {
					record.amount = this.__syncAmount + this.xGet("moneyExpenseDetails").xSum("amount");
				}
				delete this.__syncAmount;

				if (record.ownerUserId === Alloy.Models.User.id) {
					// 先更新老账户余额
					var oldMoneyAccountBalance;
					var oldMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : this.xGet("moneyAccountId")
					});
					if (this.xGet("moneyAccountId") === record.moneyAccountId) {
						// 账户没有改变
						oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount") - record.amount;
						oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
							dbTrans : dbTrans,
							patch : true
						});
					} else {
						// 帐户改变了
						if (oldMoneyAccount.id) {
							oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount");
							oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
								dbTrans : dbTrans,
								patch : true
							});
						}

						// 如果新老账户不一样（服务器上修改了账户），我们更新新账户的余额
						var newMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.moneyAccountId
						});
						if (newMoneyAccount.id) {
							newMoneyAccount.save("currentBalance", newMoneyAccount.xGet("currentBalance") - record.amount, {
								dbTrans : dbTrans,
								patch : true
							});
						}
					}
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				// 该记录在服务器上和本地都同时被修改过了
				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条

				delete record.id;
				var localUpdated = false;
				if (this.__syncAmount !== undefined) {
					// 支出明细被合并了，我们先更新本地支出的金额
					localUpdated = true;
					this.syncUpdate(record, dbTrans);
					if (this.xGet("lastClientUpdateTime") >= record.lastClientUpdateTime) {
						this._syncUpdate({
							amount : record.amount
						}, dbTrans);
					}
				}

				// 服务器上的记录比较新，我们用服务器上的记录更新本地记录
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					this._syncUpdate(record, dbTrans);
					if (!localUpdated) {
						// 如果同步时该支出的金额没有被再次改变，我们不需要将本地修改同步上服务器，因为我们已经使用了服务器上的记录。
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

