exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			friendUserId : "TEXT",
			localFriendId : "TEXT",
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
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER",
			location : "TEXT",
			geoLon : "TEXT",
			geoLat : "TEXT",
			address : "TEXT"
		},
		hasMany : {
			pictures : {
				type : "Picture",
				attribute : "record",
				cascadeDelete : true
			},
			moneyReturnApportions : {
				type : "MoneyReturnApportion",
				attribute : "moneyReturn",
				cascadeDelete : 1
			}
		},
		belongsTo : {
			friendUser : {
				type : "User",
				attribute : null
			},
			localFriend : {
				type : "Friend",
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
					if (isNaN(this.xGet("amount")) || this.xGet("amount") === null) {
						error = {
							msg : "请输入金额"
						};
					} else {
						if (this.xGet("amount") < 0) {
							error = {
								msg : "金额不能小于0"
							};
						} else if (this.xGet("amount") > 999999999) {
							error = {
								msg : "金额超出范围，请重新输入"
							};
						}
					}

					if (this.xGet("moneyBorrow")) {
						var returnRequireAmount;
						var borrowRate = this.xGet("moneyBorrow").xGet("exchangeRate");
						var returnRate = this.xGet("exchangeRate");
						if (this.isNew()) {
							returnRequireAmount = this.xGet("moneyBorrow").xGet("amount") * borrowRate - this.xGet("moneyBorrow").previous("returnedAmount");
						} else {
							returnRequireAmount = this.xGet("moneyBorrow").xGet("amount") * borrowRate - this.xGet("moneyBorrow").previous("returnedAmount") + this.xPrevious("amount") * this.xPrevious("exchangeRate");
						}
						if (this.xGet("amount") * returnRate > returnRequireAmount) {
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
				var userCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					var accountCurrency = this.xGet("moneyAccount").xGet("currency");
					if (accountCurrency === userCurrency) {
						exchange = 1;
					} else {
						var exchanges = accountCurrency.getExchanges(userCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
					return Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * exchange).toUserCurrency();
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
					return Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("exchangeRate") / exchange).toUserCurrency();
				}
			},
			getProjectName : function() {
				return this.xGet("project").getProjectName();
			},
			getAccountCurrency : function() {
				var currencySymbol = null;
				if (this.xGet("ownerUserId") === Alloy.Models.User.xGet("id")) {
					var accountCurrency = this.xGet("moneyAccount").xGet("currency");
					var localCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
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
				return Number(((this.xGet("amount") + this.xGet("interest")) * this.xGet("exchangeRate")).toFixed(2));
			},
			getFriendUser : function() {
				var ownerUserSymbol;
				if (!this.xGet("ownerUserId") || this.xGet("ownerUserId") === Alloy.Models.User.xGet("id")) {
					ownerUserSymbol = null;
				} else {
					// if (!this.__friends) {
						// var friends = Alloy.createCollection("Friend");
						// friends.xSetFilter({
							// friendUser : this.xGet("ownerUser"),
							// ownerUser : Alloy.Models.User
						// });
						// friends.xSearchInDb({
							// friendUserId : this.xGet("ownerUser").xGet("id"),
							// ownerUserId : Alloy.Models.User.xGet("id")
						// });
						// this.__friends = friends;
					// }
					// var friend = this.__friends.at(0);
					var friend = Alloy.createModel("Friend").xFindInDb({
						friendUserId : this.xGet("ownerUser").xGet("id"),
						ownerUserId : Alloy.Models.User.xGet("id")
					});
					if (friend.id) {
						ownerUserSymbol = friend.getDisplayName();
					} else {
						ownerUserSymbol = this.xGet("ownerUser").getDisplayName();
					}
				}

				return ownerUserSymbol;
			},
			getInterest : function() {
				var exchange = null;
				if (this.xGet("ownerUser") === Alloy.Models.User && this.xGet("moneyAccount").xGet("currency") === Alloy.Models.User.xGet("userData").xGet("activeCurrency")) {
					exchange = this.xGet("exchangeRate");
				} else {
					var projectCurrency = this.xGet("project").xGet("currency");
					var userCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
					if (projectCurrency === userCurrency) {
						exchange = 1;
					} else {
						var exchanges = userCurrency.getExchanges(projectCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
				}
				return Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + (this.xGet("interest") * this.xGet("exchangeRate") / exchange).toUserCurrency();
			},
			generateReturnApportions : function(saveMode) {
				var self = this;
				var moneyReturnApportionsArray = [];
				this.xGet("moneyReturnApportions").forEach(function(item) {
					if (saveMode) {//分摊全删以后 保存时重新生成分摊
						if (!item.__xDeletedHidden && !item.__xDeleted) {
							moneyReturnApportionsArray.push(item);
						}
					} else {
						if (!item.__xDeletedHidden) {
							moneyReturnApportionsArray.push(item);
						}
					}
				});
				if (moneyReturnApportionsArray.length === 0) {// 生成分摊
					// var amountTotal = 0, moneyReturnApportion, amount;
					// if (this.xGet("project").xGet("projectShareAuthorizations").length === 1 || this.xGet("project").xGet("autoApportion") === 0) {
						var moneyReturnApportion = Alloy.createModel("MoneyReturnApportion", {
							moneyReturn : self,
							friendUser : self.xGet("ownerUser"),
							amount : Number(self.xGet("amount") + self.xGet("interest")) || 0,
							apportionType : "Average"
						});
						self.xGet("moneyReturnApportions").add(moneyReturnApportion);
					// } else {
						// this.xGet("project").xGet("projectShareAuthorizations").forEach(function(projectShareAuthorization) {
							// if (projectShareAuthorization.xGet("state") === "Accept") {
								// amount = Number((((self.xGet("amount") + self.xGet("interest")) || 0) * (projectShareAuthorization.xGet("sharePercentage") / 100)).toFixed(2));
								// moneyReturnApportion = Alloy.createModel("MoneyReturnApportion", {
									// moneyReturn : self,
									// friendUser : projectShareAuthorization.xGet("friendUser"),
									// amount : amount,
									// apportionType : "Fixed"
								// });
								// self.xGet("moneyReturnApportions").add(moneyReturnApportion);
								// amountTotal += amount;
							// }
						// });
						// if (amountTotal !== (self.xGet("amount") + self.xGet("interest"))) {
							// moneyReturnApportion.xSet("amount", amount + ((self.xGet("amount") + self.xGet("interest")) - amountTotal));
						// }
					// }
					// this.hasAddedApportions = true;
				}
			},
			getRemark : function() {
				var remark = this.xGet("remark") || "";
				if (this.xGet("localFriendId")) {
					remark = "[向" + this.xGet("localFriend").getDisplayName() + "还款]" + remark;
				} else if (this.xGet("friendUserId")) {
					remark = "[向" + this.xGet("friendUser").getFriendDisplayName() + "还款]" + remark;
				}

				if (!remark) {
					remark = "无备注";
				}
				return remark;
			},
			getFriend : function() {
				if (this.xGet("friendUser")) {
					var friend = Alloy.createModel("Friend").xFindInDb({
						friendUserId : this.xGet("friendUser").xGet("id")
					});
					if (friend.id) {
						return friend;
					}
				} else if (this.xGet("localFriend")) {
					return this.xGet("localFriend");
				} else {
					return null;
				}
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				var amount = this.xGet("amount");
				var returnRate = this.xGet("exchangeRate");
				var interest = this.xGet("interest");
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;
				saveOptions.wait = true;

				var moneyAccount = this.xGet("moneyAccount");
				moneyAccount.save({
					currentBalance : moneyAccount.xGet("currentBalance") + amount + interest
				}, saveOptions);
 
				if (self.xGet("moneyBorrow")) {
					var moneyBorrow = self.xGet("moneyBorrow");
					var borrowRate = moneyBorrow.xGet("exchangeRate");
					moneyBorrow.save({
						returnedAmount : moneyBorrow.xGet("returnedAmount") - Number((amount * returnRate).toFixed(2))
					}, saveOptions);
				}

				var friend = this.getFriend(this.xGet("friendUser"));
				var debtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
					accountType : "Debt",
					currencyId : moneyAccount.xGet("currency").xGet("id"),
					friendId : friend ? friend.xGet("id") : null,
					ownerUserId : Alloy.Models.User.xGet("id")
				});
				if (debtAccount.id) {
					debtAccount.save({
						currentBalance : debtAccount.xGet("currentBalance") - amount
					}, saveOptions);
				}

				var projectShareAuthorizations = self.xGet("project").xGet("projectShareAuthorizations");
				var myProjectShareAuthorization;
				projectShareAuthorizations.forEach(function(item) {
					if (item.xGet("friendUser") === self.xGet("ownerUser")) {
						var actualTotalReturn = item.xGet("actualTotalReturn") - self.getProjectCurrencyAmount();
						item.xSet("actualTotalReturn", actualTotalReturn);
						myProjectShareAuthorization = item;
						// item.save({
						// actualTotalReturn : actualTotalReturn
						// }, saveOptions);
					}
				});
				this._xDelete(function(e) {
					if (e) {
						myProjectShareAuthorization.xSet("actualTotalReturn", myProjectShareAuthorization.xPrevious("actualTotalReturn"));
					}
					xFinishCallback(e);
				}, options);
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
				// 更新账户余额
				// 1. 如果账户也是新增的
				// 2. 账户已经存在

				if (record.ownerUserId === Alloy.Models.User.id) {
					var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.moneyAccountId
					});
					if (moneyAccount.id) {
						// moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") - record.amount - record.interest, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance - record.amount - record.interest : -record.amount - record.interest;
					} else {
						dbTrans.__syncData[record.moneyAccountId] = dbTrans.__syncData[record.moneyAccountId] || {};
						dbTrans.__syncData[record.moneyAccountId].__syncCurrentBalance = dbTrans.__syncData[record.moneyAccountId].__syncCurrentBalance ? dbTrans.__syncData[record.moneyAccountId].__syncCurrentBalance - record.amount : -record.amount;
					}
				}
				if (record.moneyBorrowId) {
					var moneyBorrow = Alloy.createModel("moneyBorrow").xFindInDb({
						id : record.moneyBorrowId
					});
					if (moneyBorrow.id) {
						// moneyBorrow.save("returnedAmount", moneyBorrow.xGet("returnedAmount") + record.amount, {
						// //syncFromServer : true,
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyBorrow.__syncReturnedAmount = moneyBorrow.__syncReturnedAmount ? moneyBorrow.__syncReturnedAmount + record.amount : +record.amount;
					}
				}

				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : record.projectId,
					friendUserId : record.ownerUserId
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncActualTotalReturn = projectShareAuthorization.__syncActualTotalReturn ? projectShareAuthorization.__syncActualTotalReturn + Number(((record.amount + record.interest) * record.exchangeRate).toFixed(2)) : Number(((record.amount + record.interest) * record.exchangeRate).toFixed(2));
				}
			},
			syncUpdate : function(record, dbTrans) {
				if (record.ownerUserId === Alloy.Models.User.id) {
					var oldMoneyAccountBalance;
					var oldMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : this.xGet("moneyAccountId")
					});
					if (this.xGet("moneyAccountId") === record.moneyAccountId) {
						// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount") + this.xGet("interest") - record.amount - record.interest;
						// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance + this.xGet("amount") + this.xGet("interest") - record.amount - record.interest : this.xGet("amount") + this.xGet("interest") - record.amount - record.interest;
					} else {
						if (oldMoneyAccount.id) {
							// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount") + this.xGet("interest");
							// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance + this.xGet("amount") + this.xGet("interest") : this.xGet("amount") + this.xGet("interest");
						}
						var newMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.moneyAccountId
						});
						if (newMoneyAccount.id) {
							// newMoneyAccount.save("currentBalance", newMoneyAccount.xGet("currentBalance") - record.amount - record.interest, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							newMoneyAccount.__syncCurrentBalance = newMoneyAccount.__syncCurrentBalance ? newMoneyAccount.__syncCurrentBalance - record.amount - record.interest : -record.amount - record.interest;
						} else {
							dbTrans.__syncData[record.moneyAccountId] = dbTrans.__syncData[record.moneyAccountId] || {};
							dbTrans.__syncData[record.moneyAccountId].__syncCurrentBalance = dbTrans.__syncData[record.moneyAccountId].__syncCurrentBalance ? dbTrans.__syncData[record.moneyAccountId].__syncCurrentBalance - record.amount : -record.amount;
						}
					}
				}
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : record.projectId,
					friendUserId : record.ownerUserId
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncActualTotalReturn = projectShareAuthorization.__syncActualTotalReturn ? projectShareAuthorization.__syncActualTotalReturn + Number(((record.amount + record.interest) * record.exchangeRate).toFixed(2)) - Number(((this.xGet("amount") + this.xGet("interest")) * this.xGet("exchangeRate")).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2));
				}
				if (record.moneyBorrowId) {
					var moneyBorrow = Alloy.createModel("moneyBorrow").xFindInDb({
						id : record.moneyBorrowId
					});
					if (moneyBorrow.id) {
						// moneyBorrow.save("returnedAmount", moneyBorrow.xGet("returnedAmount") - Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2)) + Number((record.amount * record.exchangeRate).toFixed(2)), {
						// //syncFromServer : true,
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyBorrow.__syncReturnedAmount = moneyBorrow.__syncReturnedAmount ? moneyBorrow.__syncReturnedAmount - Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2)) + Number((record.amount * record.exchangeRate).toFixed(2)) : -Number((this.xGet("amount") * this.xGet("exchangeRate")).toFixed(2)) + Number((record.amount * record.exchangeRate).toFixed(2));
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
					this._syncUpdate({
						lastServerUpdateTime : record.lastServerUpdateTime
					}, dbTrans);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				var self = this;
				var amount = this.xGet("amount");
				var interest = this.xGet("interest");
				// var saveOptions = {dbTrans : dbTrans, patch : true};
				if (this.xGet("ownerUserId") === Alloy.Models.User.id) {
					var moneyAccount = this.xGet("moneyAccount");
					// moneyAccount.save({
					// currentBalance : moneyAccount.xGet("currentBalance") + amount + interest
					// }, saveOptions);
					moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance + amount + interest : amount + interest;
				}
				if (self.xGet("moneyBorrow")) {
					var returnRate = this.xGet("exchangeRate");
					var moneyBorrow = self.xGet("moneyBorrow");
					// var borrowRate = moneyBorrow.xGet("exchangeRate");
					// moneyBorrow.save({
					// returnedAmount : moneyBorrow.xGet("returnedAmount") - Number((amount * returnRate).toFixed(2))
					// }, saveOptions);
					moneyBorrow.__syncReturnedAmount = moneyBorrow.__syncReturnedAmount ? moneyBorrow.__syncReturnedAmount - Number((amount * returnRate).toFixed(2)) : -Number((amount * returnRate).toFixed(2));
				}
				var projectShareAuthorizations = self.xGet("project").xGet("projectShareAuthorizations");
				projectShareAuthorizations.forEach(function(item) {
					if (item.xGet("friendUser") === self.xGet("ownerUser")) {
						// var actualTotalReturn = item.xGet("actualTotalReturn") - self.getProjectCurrencyAmount();
						// item.save({
						// actualTotalReturn : actualTotalReturn
						// }, saveOptions);
						item.__syncActualTotalReturn = item.__syncActualTotalReturn ? item.__syncActualTotalReturn - self.getProjectCurrencyAmount() : -self.getProjectCurrencyAmount();
					}
				});
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

