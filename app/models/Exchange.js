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
					sql = "SELECT * FROM ClientSyncTable WHERE recordId = ? AND operation = ?";
					rs = dbTrans.db.execute(sql, [exchange.id, "update"]);
					if (rs.rowCount > 0) {
						// 该记录同时在本地和服务器被修改过
						// 1. 如果该记录同時已被本地删除，那我们什么也不做，让其将服务器上的该记录也被删除
						// 2. 如果该记录同時已被本地修改过，那我们也什么不做，让本地修改覆盖服务器上的记录
						exchange.syncUpdateConflict(record, dbTrans);
					} else {
						delete record.id;
						exchange._syncUpdate(record, dbTrans);
					}
					rs.close()
					rs = null;
					return false; // tell the server not to add it as new
				}
			},
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

