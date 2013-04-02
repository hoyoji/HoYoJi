exports.definition = {
	config: {
		columns: {
		    id : "TEXT NOT NULL PRIMARY KEY",
		    name : "TEXT NOT NULL",
		    currencyId : "TEXT NOT NULL",
		    currentBalance : "REAL NOT NULL",
		    sharingType : "TEXT　NOT NULL",
		    remark : "TEXT",
		    ownerUserId : "TEXT NOT NULL"
		},
		defaults : {
			currentBalance : 0
		},
		belongsTo : {
			currency : {type : "Currency",attribute : "moneyAccounts"},
			ownerUser : {type : "User", attribute : "moneyAccounts" }
		},
		rowView : "setting/moneyAccount/moneyAccountRow",
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
					 } else {
						this._xDelete(xFinishCallback);
						return;
					}
					xFinishCallback(error);
				},
            getAccountNameCurrency : function() {
				return this.xGet("name") + " (" + this.xGet("currency").xGet("symbol") + ")";
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

