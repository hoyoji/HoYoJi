exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			localCurrencyId : "TEXT NOT NULL",
			foreignCurrencyId : "TEXT NOT NULL",
			rate : "REAL NOT NULL",
			autoUpdate : "TEXT",
			ownerUserId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
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
		rowView : "money/currency/exchangeRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				foreignCurrency : function(xValidateComplete) {
					var error;
					var localCurrency = this.xGet("localCurrency");
					var foreignCurrency = this.xGet("foreignCurrency");
					if (!foreignCurrency) {
						error = {
							msg : "外币不能为空"
						}
					} else {
						if (localCurrency.xGet("id") === foreignCurrency.xGet("id")) {
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
							if (currencyPositive.length > 0 && this.xGet("id") !== currencyPositive.at(0).xGet("id")) {
								error = {
									msg : "修改失败，币种已存在"
								};
							} else if (currencyPositive.length > 1 && this.xGet("id") === currencyPositive.at(0).xGet("id")) {
								error = {
									msg : "修改失败，币种已存在"
								};
							}
						}
					}
					xValidateComplete(error);
				},
				rate : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("rate"))) {
						error = {
							msg : "汇率只能为数字"
						};
					} else {
						if (this.xGet("rate") < 0) {
							error = {
								msg : "汇率不能为负数"
							};
						} else if (this.xGet("rate") === 0) {
							error = {
								msg : "汇率不能为0"
							};
						}
					}
					xValidateComplete(error);
				}
			},
			getForeignCurrency : function() {
				return this.xGet("foreignCurrency").xGet("name");
			},
			syncAddNew : function(record, dbTrans) {
				var exchange = Alloy.createModel("Exchange").xFindInDb({
					localCurrencyId : record.localCurrencyId,
					foreignCurrencyId : record.foreignCurrencyId
				});
				if (exchange.id) {
					// 该币种组合的汇率已经存在，我们更新存在的汇率
					if(this.lastClientUpdateTime < record.lastClientUpdateTime){
						// 服務器上的记录较新，我们用服务器上的更新本地的，然后将服务器上的删除
						delete record.id;
						exchange._syncUpdate(record, dbTrans);
						dbTrans.db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + record.id + "','Exchange','delete','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
						return false; // tell the server not to add it as new
					} else {
						// 本地的较新，我们用服务器上的，把本地的删掉
						exchange.xDelete(null, {
							dbTrans : dbTrans,
							wait : true
						});
					}
				}
			},
			syncUpdate : function(record, dbTrans) {
				var exchange = Alloy.createModel("Exchange").xFindInDb({
					localCurrencyId : record.localCurrencyId,
					foreignCurrencyId : record.foreignCurrencyId
				});
				if (exchange.id) {
					// 该币种组合的汇率已经存在，把本地的删掉
					exchange.xDelete(null, {
						dbTrans : dbTrans,
						wait : true
					});
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

