exports.definition = {
	config: {
		columns: {
		    "id": "TEXT NOT NULL PRIMARY KEY",
		    "name": "TEXT NOT NULL",
		    "currencyId": "TEXT NOT NULL",
		    "currentBalance" : "TEXT NOT NULL",
		    "sharingType" : "TEXT　NOT NULL",
		    "remark" : "TEXT",
		    "ownerUserId" : "TEXT NOT NULL"
		},
		belongsTo : {
			currency : {type : "Currency",attribute : "moneyAccounts"},
			ownerUser : {type : "User", attribute : "moneyAccounts" }
		},
		rowView : "setting/moneyAccount/moneyAccountRow",
		adapter: {
			collection_name: "MoneyAccount",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			xDelete : function(xFinishCallback){
				var error;
				if(Alloy.Models.User.xGet("activeMoneyAccount") === this){
					error = { msg : "默认账户不能删除。"};
				 } else {
					this._xDelete(xFinishCallback);
					return;
				}
				xFinishCallback(error);
			}
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

