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
			paybackDate : "TEXT",
			paybackedAmount : "REAL NOT NULL",
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
			moneyPaybacks : {
				type : "MoneyPayback",
				attribute : "moneyLend"
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
				attribute : "moneyLends"
			},
			project : {
				type : "Project",
				attribute : "moneyLends"
			},
			picture : {
				type : "Picture",
				attribute : null
			},
			ownerUser : {
				type : "User",
				attribute : "moneyLends"
			}
		},
		rowView : "money/moneyLendRow",
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
					for ( i = 0; i < this.xGet("moneyPaybacks").length; i++) {
						if (this.xGet("date") > this.xGet("moneyPaybacks").at(i).xGet("date")) {
							error = {
								msg : "借出时间不能大于明细的收款时间，请重新输入"
							};
						}
					}
					xValidateComplete(error);
				},
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
						} else if (this.xGet("amount") < (this.xGet("paybackedAmount") / this.xGet("exchangeRate"))) {
							error = {
								msg : "借出金额小于已收款金额 ，请重新输入"
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
								msg : "请选择与账户相同币种的债务人账户"
							};
						}
					}
					xValidateComplete(error);
				},
				paybackDate : function(xValidateComplete) {
					var error;
					var paybackDate = this.xGet("paybackDate");
					var date = this.xGet("date");
					if (paybackDate && paybackDate < date) {
						error = {
							msg : "收款日期在借出日期之前，请重新选择"
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
			getPaybackedAmount : function() {
				return this.xGet("project").xGet("currency").xGet("symbol") + this.xGet("paybackedAmount").toUserCurrency();
			},
			getRemark : function() {
				var remark = this.xGet("remark");
				if (!remark) {
					remark = "无备注";
				}
				return remark;
			},
			xDelete : function(xFinishCallback, options) {
				if (this.xGet("moneyPaybacks").length > 0) {
					xFinishCallback({
						msg : "当前借出的收款明细不为空，不能删除"
					});
				} else {
					var saveOptions = _.extend({}, options);
					saveOptions.patch = true;

					var moneyAccount = this.xGet("moneyAccount");
					var amount = this.xGet("amount");
					moneyAccount.save({
						currentBalance : moneyAccount.xGet("currentBalance") + amount
					}, saveOptions);

					this._xDelete(xFinishCallback, options);
				}
			},
			// canMoneyPaybackAddNew : function(){
			// if(this.xGet("ownerUser") !== Alloy.Models.User){
			// var projectShareAuthorization = this.xGet("projectShareAuthorizations").at(0);
			// if(projectShareAuthorization.xGet("projectShareMoneyPaybackAddNew")){
			// return true;
			// } else {
			// return false;
			// }
			// }
			// return this.xGet("ownerUser") === Alloy.Models.User;
			// }
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果账户也是新增的
				// 2. 账户已经存在

				if (record.ownerUserId === Alloy.Models.User.id) {
					var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.moneyAccountId
					});
					if (moneyAccount.id) {
						// moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") - record.amount, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance - record.amount : -record.amount;
					}
				}
			},
			// _syncUpdate : function(record, dbTrans) {
			// this.save(record, {
			// dbTrans : dbTrans,
			// // syncFromServer : true,
			// patch : true,
			// wait : true
			// });
			// },
			syncUpdate : function(record, dbTrans) {
				if (record.ownerUserId === Alloy.Models.User.id) {
					record.paybackedAmount = (this.__syncPaybackedAmount || 0) + this.xGet("paybackedAmount");
					delete this.__syncPaybackedAmount;

					var oldMoneyAccountBalance;
					var oldMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						id : this.xGet("moneyAccountId")
					});
					if (this.xGet("moneyAccountId") === record.moneyAccountId) {
						// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount") - record.amount;
						// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
						// dbTrans : dbTrans,
						// patch : true
						// });
						oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance + this.xGet("amount") - record.amount : this.xGet("amount") - record.amount;

					} else {
						if (oldMoneyAccount.id) {
							// oldMoneyAccountBalance = oldMoneyAccount.xGet("currentBalance") + this.xGet("amount");
							// oldMoneyAccount.save("currentBalance", oldMoneyAccountBalance, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							oldMoneyAccount.__syncCurrentBalance = oldMoneyAccount.__syncCurrentBalance ? oldMoneyAccount.__syncCurrentBalance + this.xGet("amount") : this.xGet("amount");
						}
						var newMoneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.moneyAccountId
						});
						if (newMoneyAccount.id) {
							// newMoneyAccount.save("currentBalance", newMoneyAccount.xGet("currentBalance") - record.amount, {
							// dbTrans : dbTrans,
							// patch : true
							// });
							newMoneyAccount.__syncCurrentBalance = newMoneyAccount.__syncCurrentBalance ? newMoneyAccount.__syncCurrentBalance - record.amount : -record.amount;
						}
					}
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				this.syncUpdate(record, dbTrans);
				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					delete record.id;
					this._syncUpdate(record, dbTrans);

					// var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					// dbTrans.db.execute(sql, [this.xGet("id")]);
				} else {
					this._syncUpdate({
						paybackedAmount : record.paybackedAmount
					}, dbTrans);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				// var saveOptions = {dbTrans : dbTrans, patch : true, syncFromServer : true};
				if (this.xGet("ownerUserId") === Alloy.Models.User.id) {
					var moneyAccount = this.xGet("moneyAccount");
					// var amount = this.xGet("amount");
					// moneyAccount.save({
					// currentBalance : moneyAccount.xGet("currentBalance") + amount
					// }, saveOptions);
					moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance + this.xGet("amount") : this.xGet("amount");
				}
			},
			syncRollback : function() {
				delete this.__syncPaybackedAmount;
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

