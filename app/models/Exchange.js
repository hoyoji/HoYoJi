exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			localCurrencyId : "TEXT NOT NULL",
			foreignCurrencyId : "TEXT NOT NULL",
			rate : "REAL NOT NULL",
			autoUpdate : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		belongsTo : {
			localCurrency : {
				type : "Currency",
				attribute : null
			},
			foreignCurrency : {
				type : "Currency",
				attribute : null
			},
			ownerUser : {
				type : "User",
				attribute : "exchanges"
			}
		},
		rowView : "setting/currency/exchangeRow",
		adapter : {
			collection_name : "Exchange",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				foreignCurrency : function(xValidateComplete) {
					var error;
					var localCurrency = this.get("localCurrency");
					var foreignCurrency = this.get("foreignCurrency");
					if (localCurrency.get("id") === foreignCurrency.get("id")) {
						error = {
							msg : "本币和外币不能相同，请重新选择！"
						};
					}

					var currencyPositive = Alloy.Models.User.xGet("exchanges").xCreateFilter({
						localCurrency : localCurrency,
						foreignCurrency : foreignCurrency
					});
					// var currencyNegative = Alloy.Models.User.xGet("exchanges").xCreateFilter({
					// localCurrency : foreignCurrency,
					// foreignCurrency : localCurrency
					// });
					// if(currencyPositive.length>0 || currencyNegative.length>0){
					if (this.isNew()) {
						if (currencyPositive.length > 0) {
							error = {
								msg : "新增失败，汇率已存在"
							};
						}
					} else {
							if(currencyPositive.length > 0 && this.xGet("id") !== currencyPositive.at(0).xGet("id")){
								error = {
									msg : "修改失败，币种已存在"
								};
							}
							else if(currencyPositive.length > 1 && this.xGet("id") === currencyPositive.at(0).xGet("id")){
								error = {
									msg : "修改失败，币种已存在"
								};
							}
						}
					xValidateComplete(error);
				},
				rate : function(xValidateComplete){
					var error;
					if(this.get("rate")===0){
						error = {
							msg : "汇率不能为0，请重新输入"
						}
					}
					else if(isNaN(this.get("rate"))){
						error = {
							msg : "请输入正确数字"
						}
					}
					xValidateComplete(error);
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
}

