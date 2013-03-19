exports.definition = {
	config: {
		columns: {
		    "id": "TEXT NOT NULL PRIMARY KEY",
		    "name": "TEXT NOT NULL",
		    "symbol": "TEXT NOT NULL",
		    "code" : "TEXT NOT NULL",
		    "ownerUserId" : "TEXT NOT NULL"
		},
		hasMany : {
			moneyAccounts : { type : "MoneyAccounts", attribute : "currency"},
			subProjects : { type : "Project", attribute : "parentProject" }
		},
		belongsTo : {
			ownerUser : { type : "User", attribute : "currencies" }
		},
		rowView : "setting/currency/currencyRow",
		adapter: {
			collection_name: "Currency",
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
				if(Alloy.Models.User.xGet("activeCurrency") === this){
					error = { msg : "删除本币失败。请先将其它币种设置成本币，再删除。"};
				 } else {
					this._xDelete(xFinishCallback);
					return;
				}
				xFinishCallback(error);
			},
			getExchanges : function(){
				var currencyPositive = Alloy.Models.User.xGet("exchanges").xCreateFilter({localCurrency : this});
				var currencyNegative = Alloy.Models.User.xGet("exchanges").xCreateFilter({foreignCurrency : this});
				var collectionArray;
				collectionArray.add(currencyPositive);
				collectionArray.add(currencyNegative);
				return collectionArray;
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

