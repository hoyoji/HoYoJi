exports.definition = {
	config: {
		columns: {
		    "id": "TEXT NOT NULL PRIMARY KEY",
		    "name": "TEXT NOT NULL",
		    "currencyId": "TEXT NOT NULL",
		    "currentBalance" : "TEXT NOT NULL",
		    "sharingType" : "TEXT　NOT NULL",
		    "remark" : "remark",
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

