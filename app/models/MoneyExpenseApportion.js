exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			amount : "REAL NOT NULL",
			moneyExpenseId : "TEXT NOT NULL",
			friendUserId : "TEXT NOT NULL",
			apportionType : "TEXT NOT NULL", // fixed, average
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			moneyExpense : {
				type : "MoneyExpense",
				attribute : "moneyExpenseApportions"
			},
			ownerUser : {
				type : "User",
				attribute : null
			},
			friendUser : {
				type : "User",
				attribute : null
			}
		},
		rowView : "money/moneyExpenseApportionRow",
		adapter : {
			type : "hyjSql",
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
						} else if (this.xGet("amount") > 999999999) {
							error = {
								msg : "金额超出范围，请重新输入"
							};
						}
					}
					xValidateComplete(error);
				}
			},
			// getDisplayName : function() {
			// return this.xGet("friendUser").getUserDisplayName();
			// },
			getFriendDisplayName : function() {
				var friend = Alloy.createModel("Friend").xFindInDb({
					friendUserId : this.xGet("friendUser") ? this.xGet("friendUser").xGet("id") : this.xGet("friendUserId")
				});
				if (friend.id) {
					return friend.getDisplayName();
				}
				return this.xGet("friendUser").getUserDisplayName();
			},
			getAmount : function() {
				if (this.xGet("moneyExpense").xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("moneyExpense").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					var projectCurrency = this.xGet("moneyExpense").xGet("project").xGet("currency");
					var userCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
					var exchanges = userCurrency.getExchanges(projectCurrency);
					var exchange = 1;
					if (exchanges.length) {
						exchange = exchanges.at(0).xGet("rate");
					}
					return Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyExpense").xGet("exchangeRate") / exchange).toUserCurrency();
				}
			},
			getSharePercentage : function() {
				var projectShareAuthorizations = this.xGet("moneyExpense").xGet("project").xGet("projectShareAuthorizations");
				var self = this;
				var sharePercentage;
				projectShareAuthorizations.forEach(function(item) {
					if (self.xGet("friendUser") === item.xGet("friendUser")) {
						sharePercentage = item.xGet("sharePercentage");
						return;
					}
				});
				return sharePercentage;
			},
			getSharePercentageRow : function() {
				var projectShareAuthorizations = this.xGet("moneyExpense").xGet("project").xGet("projectShareAuthorizations");
				var self = this;
				var sharePercentage;
				projectShareAuthorizations.forEach(function(item) {
					if (self.xGet("friendUser") === item.xGet("friendUser")) {
						sharePercentage = item.xGet("sharePercentage");
						return;
					}
				});
				return "占股:" + sharePercentage + "%";
			},
			getApportionType : function() {
				if (this.xGet("apportionType") === "Fixed") {
					return "固定";
				} else if (this.xGet("apportionType") === "Average") {
					return "均摊";
				}
			},
			getMoneySymbol : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User || !this.xGet("ownerUser")) {
					return this.xGet("moneyExpense").xGet("moneyAccount").xGet("currency").xGet("symbol");
				} else {
					return "";
				}
			},
			xDelete : function(xFinishCallback, options) {
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;
				saveOptions.wait = true;
				var self = this;

				if (self.xGet("friendUser").xGet("id") !== Alloy.Models.User.xGet("id")) {
					var debtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
						accountType : "Debt",
						currencyId : self.xGet("moneyExpense").xGet("moneyAccount").xGet("currency").xGet("id"),
						friendId : self.xGet("friendUser").getFriend() ? self.xGet("friendUser").getFriend().id : null,
						ownerUserId : Alloy.Models.User.xGet("id")
					});
					if (debtAccount.id) {
						debtAccount.save({
							currentBalance : debtAccount.xGet("currentBalance") - self.xGet("amount")
						}, saveOptions);
					}
				}

				var projectShareAuthorizations = self.xGet("moneyExpense").xGet("project").xGet("projectShareAuthorizations");
				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === self.xGet("friendUser")) {
						var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
						// projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - self.xGet("amount") * self.xGet("moneyExpense").xGet("exchangeRate"));
						console.info("apportionedTotalExpense++++++++++" + apportionedTotalExpense - self.xGet("amount") * self.xGet("moneyExpense").xGet("exchangeRate"));
						projectShareAuthorization.save({
							apportionedTotalExpense : apportionedTotalExpense - Number((self.xGet("amount") * self.xGet("moneyExpense").xGet("exchangeRate")).toFixed(2))
						}, saveOptions);
					}
				});
				this._xDelete(xFinishCallback, options);
			},
			canEdit : function() {
				return this.xGet("moneyExpense").canEdit();
			},
			canDelete : function() {
				return this.xGet("moneyExpense").canDelete();
			},
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果支出也是新增的
				// 2. 支出已经存在

				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : record.projectId,
					friendUserId : record.friendUserId
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncApportionedTotalExpense = projectShareAuthorization.__syncApportionedTotalExpense ? projectShareAuthorization.__syncApportionedTotalExpense + Number((record.amount * record.exchangeRate).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2));
				}
				delete record.projectId;
				delete record.exchangeRate;
			},
			syncUpdate : function(record, dbTrans) {
				// if (record.ownerUserId === Alloy.Models.User.id) {
				var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
					id : record.moneyExpenseId
				});
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : moneyExpense.xGet("projectId"),
					friendUserId : record.friendUserId
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncApportionedTotalExpense = projectShareAuthorization.__syncApportionedTotalExpense ? projectShareAuthorization.__syncApportionedTotalExpense + Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * moneyExpense.xGet("exchangeRate")).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * moneyExpense.xGet("exchangeRate")).toFixed(2));
				}
				// }
				delete record.projectId;
				delete record.exchangeRate;
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				// var saveOptions = {dbTrans : dbTrans, patch : true, syncFromServer : true};
				// var self = this;
				// var projectShareAuthorizations = self.xGet("moneyExpense").xGet("project").xGet("projectShareAuthorizations");
				// projectShareAuthorizations.forEach(function(projectShareAuthorization) {
				// if (projectShareAuthorization.xGet("friendUser") === self.xGet("friendUser")) {
				// var apportionedTotalExpense = projectShareAuthorization.xGet("apportionedTotalExpense") || 0;
				// projectShareAuthorization.xSet("apportionedTotalExpense", apportionedTotalExpense - self.xGet("amount") * self.xGet("moneyExpense").xGet("exchangeRate"));
				// console.info("apportionedTotalExpense++++++++++" + apportionedTotalExpense - self.xGet("amount") * self.xGet("moneyExpense").xGet("exchangeRate"));
				// projectShareAuthorization.save({
				// apportionedTotalExpense : apportionedTotalExpense - Number((self.xGet("amount") * self.xGet("moneyExpense").xGet("exchangeRate")).toFixed(2))
				// }, saveOptions);
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : this.xGet("moneyExpense").xGet("projectId"),
					friendUserId : this.xGet("friendUserId")
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncApportionedTotalExpense = projectShareAuthorization.__syncApportionedTotalExpense ? projectShareAuthorization.__syncApportionedTotalExpense - Number((this.xGet("amount") * this.xGet("moneyExpense").xGet("exchangeRate")).toFixed(2)) : -Number((this.xGet("amount") * this.xGet("moneyExpense").xGet("exchangeRate")).toFixed(2));
				}
				// }
				// });
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

