exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			currencyId : "TEXT NOT NULL",
			currentBalance : "REAL NOT NULL",
			remark : "TEXT",
			sharingType : "TEXT NOT NULL",
			accountType : "TEXT NOT NULL",
			accountNumber : "TEXT",
			bankAddress : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
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
			},
			moneyTransferOuts : {
				type : "MoneyTransfer",
				attribute : "transferOut"
			},
			moneyTransferIns : {
				type : "MoneyTransfer",
				attribute : "transferIn"
			}
			// ,
			// moneyAccountBalanceAdjustments : {
				// type : "MoneyAccountBalanceAdjustment",
				// attribute : "moneyAccount",
				// cascadeDelete : true
			// }
		},
		belongsTo : {
			currency : {
				type : "Currency",
				attribute : "moneyAccounts"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyAccounts"
			}
		},
		rowView : "money/moneyAccount/moneyAccountRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				currency : function(xValidateComplete) {
					var error;
					if (!this.isNew() && this.hasChanged("currency")) {
						error = {
							msg : "账户币种不可以修改"
						};
					}
					xValidateComplete(error);
				}
			},
			xDelete : function(xFinishCallback, options) {
				var error;
				// 如果 onSyncUpdate !== true 表示这个删除是服务器同步的删除，这时我们连默认账户也删除
				if (Alloy.Models.User.xGet("userData").xGet("activeMoneyAccount") === this) {
					error = {
						msg : "默认账户不能删除"
					};
				} else {
					this._xDelete(xFinishCallback, options);
					return;
				}
				xFinishCallback(error);
			},
			getAccountType : function(){
				// items="现金账户,金融账户,信用卡账户,虚拟账户,借贷账户"
				// values="Cash,Deposit,Credit,Online,Debt"
				switch(this.xGet("accountType")){
					case "Cash" : return "现金账户";
					case "Deposit" : return "金融账户";
					case "Credit" : return "信用卡账户";
					case "Online" : return "虚拟账户";
					case "Debt" : return "借贷账户";
					default : return this.xGet("accountType");
				}
			},
			getSectionSortName : function(){
				// items="现金账户,金融账户,信用卡账户,虚拟账户,借贷账户"
				// values="Cash,Deposit,Credit,Online,Debt"
				switch(this.xGet("accountType")){
					case "Cash" : return "1" + this.xGet("name");
					case "Deposit" : return "2" ;
					case "Credit" : return "3" + this.xGet("name");
					case "Online" : return "4" + this.xGet("name");
					case "Debt" : return "5" + this.xGet("name");
					default : return "6" + this.xGet("name");
				}
			},
			getAccountNameCurrency : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("name") + " (" + this.xGet("currency").xGet("symbol") + this.xGet("currentBalance").toUserCurrency() + ")";
				} else {
					return this.xGet("name") + " (" + this.xGet("currency").xGet("symbol") + ")";
				}
			},
			getCurrentBalance : function() {
				if (this.xGet("ownerUser") === Alloy.Models.User) {
					return this.xGet("currentBalance").toFixed(2);
				}
			},
			getLocalCurrentBalance : function() {
				var exchange = null;
				var userCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
				var accountCurrency = this.xGet("currency");
				if (accountCurrency === userCurrency) {
					exchange = 1;
				} else {
					var exchanges = accountCurrency.getExchanges(userCurrency);
					if (exchanges.length) {
						exchange = exchanges.at(0).xGet("rate");
					}
				}
				return Number((this.xGet("currentBalance") * exchange).toFixed(2));
			},
			syncAddNew : function(record, dbTrans) {
				var serverCurrentBalance = record.currentBalance;
				//if (!record.currentBalance) {
				record.currentBalance = 0;
				//}
				if (dbTrans.__syncData[record.id]) {
					record.currentBalance = Number(((dbTrans.__syncData[record.id].__syncCurrentBalance || 0) + this.xGet("currentBalance")).toFixed(2));
					delete this.__syncCurrentBalance;
				}
				if (serverCurrentBalance !== record.currentBalance) {
					dbTrans.db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + record.id + "','MoneyAccount','update','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
				}
			},
			_syncAddNew : function(record, dbTrans) {
				this.xSet(record);
				delete this.id;
				this.save(null, {
					dbTrans : dbTrans,
					syncFromServer : true,
					patch : true,
					wait : true
				});
			},
			_syncUpdate : function(record, dbTrans) {
				this.save(record, {
					dbTrans : dbTrans,
					// syncFromServer : true,
					patch : true,
					wait : true
				});
			},
			syncUpdate : function(record, dbTrans) {
				// 我们不能将帐户余额同步下来, 但是其他帐户资料都可同步
				if (this.xGet("ownerUserId") === Alloy.Models.User.id) {
					record.currentBalance = Number(((this.__syncCurrentBalance || 0) + this.xGet("currentBalance")).toFixed(2));
					delete this.__syncCurrentBalance;
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				this.syncUpdate(record, dbTrans);
				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					delete record.id;
					this._syncUpdate(record, dbTrans);

					// var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					// dbTrans.db.execute(sql, [this.xGet("id")]);
				} else {
					this._syncUpdate({
						lastServerUpdateTime : record.lastServerUpdateTime,
						currentBalance : record.currentBalance
					}, dbTrans);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncRollback : function() {
				delete this.__syncCurrentBalance;
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

