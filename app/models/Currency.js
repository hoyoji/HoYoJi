exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			symbol : "TEXT NOT NULL",
			code : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		hasMany : {
			moneyAccounts : {
				type : "MoneyAccount",
				attribute : "currency"
			},
		},
		belongsTo : {
			ownerUser : {
				type : "User",
				attribute : "currencies"
			}
		},
		rowView : "money/currency/currencyRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			// validators : {
			// name : function(xValidateComplete) {
			// var error;
			// if (Alloy.Models.User) {
			// var oldCurrencys = Alloy.Models.User.xGet("currencies").xCreateFilter({
			// name : this.xGet("name")
			// }, $);
			// if (this.isNew()) {
			// if (oldCurrencys.length > 0) {
			// error = {
			// msg : "新增失败，币种已存在"
			// };
			// }
			// } else {
			// if (oldCurrencys.length > 0 && this.xGet("id") !== oldCurrencys.at(0).xGet("id")) {
			// error = {
			// msg : "修改失败，币种已存在"
			// };
			// } else if (oldCurrencys.length > 1 && this.xGet("id") === oldCurrencys.at(0).xGet("id")) {
			// error = {
			// msg : "修改失败，币种已存在"
			// };
			// }
			// }
			// }
			// xValidateComplete(error);
			//
			// }
			// },
			// xDelete : function(xFinishCallback, options){
			// var error;
			// var currencyPositive = Alloy.Models.User.xGet("exchanges").xCreateFilter({
			// localCurrency : this
			// });
			// // var currencyNegative = Alloy.Models.User.xGet("exchanges").xCreateFilter({
			// // foreignCurrency : this
			// // });
			// if(options.syncFromServer !== true
			// && Alloy.Models.User.xGet("activeCurrency") === this){
			// error = { msg : "删除本币失败。请先将其它币种设置成本币，再删除"};
			//  }
			// else if(options.syncFromServer !== true
			// && currencyPositive.length>0){
			// error = { msg : "删除失败，请先删除相关汇率"};
			//  } else {
			// this._xDelete(xFinishCallback, options);
			// return;
			// }
			//
			// xFinishCallback(error);
			// },
			getExchanges : function(foreignCurrency) {
				var exchanges = Alloy.createCollection("Exchange");
				if (foreignCurrency) {
					exchanges.xSearchInDb({
						ownerUserId : Alloy.Models.User.xGet("id"),
						localCurrencyId : this.xGet("id"),
						foreignCurrencyId : foreignCurrency.xGet("id")
					});
				} else {
					exchanges.xSearchInDb({
						ownerUserId : Alloy.Models.User.xGet("id"),
						localCurrencyId : this.xGet("id")
					});
				}
				return exchanges;
			},
			canEdit : function() {
				return false;
			},
			canDelete : function() {
				return false;
			},
			syncAddNew : function(record, dbTrans) {
				dbTrans.newCurrenciesFromServer[record.id] = true;
				if (!record.symbol) {
					try {
						record.symbol = Ti.Locale.getCurrencySymbol(record.code);
					} catch (e) {
						record.symbol = record.code;
					}
				}
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
};

