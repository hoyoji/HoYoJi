exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			friendId : "TEXT",
			moneyAccountId : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			localCurrencyId : "TEXT NOT NULL",
			exchangeCurrencyRate : "REAL NOT NULL",
			interest : "REAL NOT　NULL",
			remark : "TEXT",
			moneyBorrowId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL"
		},
		belongsTo : {
			friend : {
				type : "Friend",
				attribute : null
			},
			moneyAccount : {
				type : "MoneyAccount",
				attribute : null
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
			getLocalAmount : function() {
				return (this.xGet("amount") * this.xGet("exchangeCurrencyRate")).toUserCurrency();
			},
			getInterest : function() {
				return this.xGet("interest").toUserCurrency();
			},
			xDelete : function(xFinishCallback) {
				var moneyAccount = this.xGet("moneyAccount");
				var amount = this.xGet("amount");
				var moneyBorrow = this.xGet("moneyBorrow");
				var borrowRate = moneyBorrow.xGet("exchangeCurrencyRate");
				var returnRate = this.xGet("exchangeCurrencyRate");

				this._xDelete(xFinishCallback);
				moneyBorrow.xSet("returnedAmount", moneyBorrow.xGet("returnedAmount") - amount * returnRate / borrowRate);
				moneyBorrow.xSave();
				moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + amount);
				moneyAccount.xSave();
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

