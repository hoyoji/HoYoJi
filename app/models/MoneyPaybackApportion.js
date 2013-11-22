exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			amount : "REAL NOT NULL",
			moneyPaybackId : "TEXT NOT NULL",
			friendUserId : "TEXT NOT NULL",
			apportionType : "TEXT NOT NULL", // fixed, average
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			moneyPayback : {
				type : "MoneyPayback",
				attribute : "moneyPaybackApportions"
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
		rowView : "money/moneyPaybackApportionRow",
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
					friendUserId : this.xGet("friendUser").id
				});
				if (friend.id) {
					return friend.getDisplayName();
				}
				return this.xGet("friendUser").xGet("userName");
			},
			getAmount : function() {
				if (this.xGet("moneyPayback").xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("moneyPayback").xGet("moneyAccount").xGet("currency").xGet("symbol") + this.xGet("amount").toUserCurrency();
				} else {
					var projectCurrency = this.xGet("moneyPayback").xGet("project").xGet("currency");
					var userCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
					var exchanges = userCurrency.getExchanges(projectCurrency);
					var exchange = 1;
					if (exchanges.length) {
						exchange = exchanges.at(0).xGet("rate");
					}
					return Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + (this.xGet("amount") * this.xGet("moneyPayback").xGet("exchangeRate") / exchange).toUserCurrency();
				}
			},
			getSharePercentage : function() {
				var projectShareAuthorizations = this.xGet("moneyPayback").xGet("project").xGet("projectShareAuthorizations");
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
				var projectShareAuthorizations = this.xGet("moneyPayback").xGet("project").xGet("projectShareAuthorizations");
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
					return this.xGet("moneyPayback").xGet("moneyAccount").xGet("currency").xGet("symbol");
				} else {
					return "";
				}
			},
			xDelete : function(xFinishCallback, options) {
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;
				saveOptions.wait = true;
				var self = this;
				var projectShareAuthorizations = self.xGet("moneyPayback").xGet("project").xGet("projectShareAuthorizations");
				projectShareAuthorizations.forEach(function(projectShareAuthorization) {
					if (projectShareAuthorization.xGet("friendUser") === self.xGet("friendUser")) {
						var apportionedTotalPayback = projectShareAuthorization.xGet("apportionedTotalPayback") || 0;
						// projectShareAuthorization.xSet("apportionedTotalPayback", apportionedTotalPayback - self.xGet("amount") * self.xGet("moneyPayback").xGet("exchangeRate"));
						console.info("apportionedTotalPayback++++++++++" + apportionedTotalPayback - self.xGet("amount") * self.xGet("moneyPayback").xGet("exchangeRate"));
						projectShareAuthorization.save({
							apportionedTotalPayback : apportionedTotalPayback - Number((self.xGet("amount") * self.xGet("moneyPayback").xGet("exchangeRate")).toFixed(2))
						}, saveOptions);
					}
				});
				this._xDelete(xFinishCallback, options);
			},
			canEdit : function() {
				return this.xGet("moneyPayback").canEdit();
			},
			canDelete : function() {
				return this.xGet("moneyPayback").canDelete();
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
					projectShareAuthorization.__syncApportionedTotalPayback = projectShareAuthorization.__syncApportionedTotalPayback ? projectShareAuthorization.__syncApportionedTotalPayback + Number((record.amount * record.exchangeRate).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2));
				}
				delete record.projectId;
				delete record.exchangeRate;
			},
			syncUpdate : function(record, dbTrans) {
				// if (record.ownerUserId === Alloy.Models.User.id) {
				var moneyPayback = Alloy.createModel("MoneyPayback").xFindInDb({
					id : record.moneyPaybackId
				});
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : moneyPayback.xGet("projectId"),
					friendUserId : record.friendUserId
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncApportionedTotalPayback = projectShareAuthorization.__syncApportionedTotalPayback ? projectShareAuthorization.__syncApportionedTotalPayback + Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * moneyPayback.xGet("exchangeRate")).toFixed(2)) : Number((record.amount * record.exchangeRate).toFixed(2)) - Number((this.xGet("amount") * moneyPayback.xGet("exchangeRate")).toFixed(2));
				}
				// }
				delete record.projectId;
				delete record.exchangeRate;
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				// var saveOptions = {dbTrans : dbTrans, patch : true, syncFromServer : true};
				// var self = this;
				// var projectShareAuthorizations = self.xGet("moneyPayback").xGet("project").xGet("projectShareAuthorizations");
				// projectShareAuthorizations.forEach(function(projectShareAuthorization) {
				// if (projectShareAuthorization.xGet("friendUser") === self.xGet("friendUser")) {
				// var apportionedTotalPayback = projectShareAuthorization.xGet("apportionedTotalPayback") || 0;
				// projectShareAuthorization.xSet("apportionedTotalPayback", apportionedTotalPayback - self.xGet("amount") * self.xGet("moneyPayback").xGet("exchangeRate"));
				// console.info("apportionedTotalPayback++++++++++" + apportionedTotalPayback - self.xGet("amount") * self.xGet("moneyPayback").xGet("exchangeRate"));
				// projectShareAuthorization.save({
				// apportionedTotalPayback : apportionedTotalPayback - Number((self.xGet("amount") * self.xGet("moneyPayback").xGet("exchangeRate")).toFixed(2))
				// }, saveOptions);
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : this.xGet("moneyPayback").xGet("projectId"),
					friendUserId : this.xGet("friendUserId")
				});
				if (projectShareAuthorization.id) {
					projectShareAuthorization.__syncApportionedTotalPayback = projectShareAuthorization.__syncApportionedTotalPayback ? projectShareAuthorization.__syncApportionedTotalPayback - Number((this.xGet("amount") * this.xGet("moneyPayback").xGet("exchangeRate")).toFixed(2)) : -Number((this.xGet("amount") * this.xGet("moneyPayback").xGet("exchangeRate")).toFixed(2));
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

