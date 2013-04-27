exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			friendId : "TEXT",
			friendAccountId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			localCurrencyId : "TEXT NOT NULL",
			exchangeRate : "REAL NOT NULL",
			interest : "REAL NOT　NULL",
			remark : "TEXT",
			moneyBorrowId : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER"
		},
		belongsTo : {
			friend : {
				type : "Friend",
				attribute : "moneyReturns"
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
			localCurrency : {
				type : "Currency",
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
							}
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
							}
						}
					}
					xValidateComplete(error);
				},
				interest : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("interest"))) {
						error = {
							msg : "金额只能为数字"
						};
					} else {
						if (this.xGet("interest") < 0) {
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
						currencySymbol = accountCurrency.xGet("symbol");
					}
				}
				return currencySymbol;
			},
			getOwnerUser : function() {
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
				return this.xGet("interest").toUserCurrency();
			},
			xDelete : function(xFinishCallback, options) {
				var moneyAccount = this.xGet("moneyAccount");
				var amount = this.xGet("amount");
				var returnRate = this.xGet("exchangeRate");
				var interest = this.xGet("interest");

				this._xDelete(function(error) {
					if (!error) {
						var saveOptions = _.extend({}, options);
						saveOptions.patch = true;
						moneyAccount.save({
							currentBalance : moneyAccount.xGet("currentBalance") + amount + interest
						}, saveOptions);

						if (this.xGet("moneyBorrow")) {
							var moneyBorrow = this.xGet("moneyBorrow");
							var borrowRate = moneyBorrow.xGet("exchangeRate");
							moneyBorrow.save({
								returnedAmount : moneyBorrow.xGet("returnedAmount") - amount * returnRate / borrowRate
							}, saveOptions);
						}
					}
					xFinishCallback(error);
				}, options);
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

