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
			moneyAccounts : { type : "MoneyAccount", attribute : "currency"},
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
			validators : {
				name : function(xValidateComplete){
					var error;
					if(Alloy.Models.User){
						var oldCurrency = Alloy.Models.User.xGet("currencies").xCreateFilter({
							name : this.get("name")
						});
						if (this.isNew()) {
							if (oldCurrency.length > 0) {
								error = {
									msg : "新增失败，币种已存在"
								};
							}
						} else {
							if (oldCurrency.length > 1) {
								error = {
									msg : "新增失败，币种已存在"
								};
							}
						}
						}
					xValidateComplete(error);
				
				}
			},
			xDelete : function(xFinishCallback){
				var error;
				var currencyPositive = Alloy.Models.User.xGet("exchanges").xCreateFilter({
					localCurrency : this
					});
				// var currencyNegative = Alloy.Models.User.xGet("exchanges").xCreateFilter({
					// foreignCurrency : this
					// });
// 				
				if(Alloy.Models.User.xGet("activeCurrency") === this){
					error = { msg : "删除本币失败。请先将其它币种设置成本币，再删除"};
				 } 
				else if(currencyPositive.length>0){
					error = { msg : "删除失败，请先删除相关汇率"};
				 } else {
					this._xDelete(xFinishCallback);
					return;
				}
				
				xFinishCallback(error);
			},
			getExchanges : function(){
				var currencyPositive = Alloy.Models.User.xGet("exchanges").xCreateFilter({localCurrency : this});
				// var currencyNegative = Alloy.Models.User.xGet("exchanges").xCreateFilter({foreignCurrency : this});
				// var collectionArray;
				// collectionArray.add(currencyPositive);
				// collectionArray.add(currencyNegative);
				return currencyPositive;
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

