exports.definition = {
	config: {
		columns: {
		    id : "TEXT NOT NULL PRIMARY KEY",
		    name : "TEXT NOT NULL",
		    currencyId : "TEXT NOT NULL",
		    currentBalance : "REAL NOT NULL",
		    remark : "TEXT",
  		    sharingType : "TEXT　NOT NULL",
  		    accountType : "TEXT NOT NULL",
  		    accountNumber : "TEXT",
  		    bankAddress : "TEXT",
		    ownerUserId : "TEXT NOT NULL",
		    lastSyncTime : "TEXT",
			lastModifyTime : "TEXT"
		},
		defaults : {
			currentBalance : 0
		},
		hasMany : {
			moneyExpenses : {
				type : "MoneyExpense",
				attribute : "moneyAccount"
			},
			moneyIncomes : {
				type : "MoneyIncome",
				attribute : "moneyAccount"
			},
			moneyBorrows : {
				type : "MoneyBorrow",
				attribute : "moneyAccount"
			},
			moneyLends : {
				type : "MoneyLend",
				attribute : "moneyAccount"
			},
			moneyPayback : {
				type : "MoneyPayback",
				attribute : "moneyAccount"
			},
			moneyReturns : {
				type : "MoneyReturn",
				attribute : "moneyAccount"
			}
		},
		belongsTo : {
			currency : {type : "Currency",attribute : "moneyAccounts"},
			ownerUser : {type : "User", attribute : "moneyAccounts" }
		},
		rowView : "money/moneyAccount/moneyAccountRow",
		adapter: {
			type : "hyjSql"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			// extended functions and properties go here
			xDelete : function(xFinishCallback){
				var error;
				if(Alloy.Models.User.xGet("activeMoneyAccount") === this){
					error = { msg : "默认账户不能删除"};
				} 
				else if(this.xGet("moneyExpenses").length > 0 || this.xGet("moneyIncomes").length > 0 || this.xGet("moneyBorrows").length > 0 || this.xGet("moneyLends").length > 0 || this.xGet("moneyPaybacks").length > 0 || this.xGet("moneyReturns").length > 0 ){
						xFinishCallback({
						msg : "账务中有数据与当前账户有关，不能删除"
					});
				}
				else {
						this._xDelete(xFinishCallback);
						return;
				}
				xFinishCallback(error);
			},
            getAccountNameCurrency : function() {
            	if(this.xGet("ownerUser") === Alloy.Models.User){
					return this.xGet("name") + " (" + this.xGet("currency").xGet("symbol") + this.xGet("currentBalance").toUserCurrency() + ")";
            	} else {
					return this.xGet("name") + " (" + this.xGet("currency").xGet("symbol") + ")";
            	}
			},
			getCurrentBalance : function(){
				if(this.xGet("ownerUser") === Alloy.Models.User){
				return this.xGet("currentBalance").toUserCurrency();
				}
			}
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

