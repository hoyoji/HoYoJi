exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    moneyAccountId: "TEXT NOT NULL",
		    amount: "REAL NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			ownerUser : {
				type : "User",
				attribute : null
			},
			moneyAccount : {
				type : "MoneyAccount",
				attribute : "moneyAccountBalanceAdjustments"
			}
		},
		adapter: {
			type : "hyjSql"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype,  Alloy.Globals.XModel,  {
			// extended functions and properties go here
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 2. 如果账户也是新增的,我们不用更新账户余额，直接拿服务器上的余额即可
				// 3. 如果账户已经存在本地，我们更新该余额

				var moneyAccount = Alloy.createModel("MoneyAccount").xFindInDb({
					id : record.moneyAccountId
				});
				if (moneyAccount.id) {
					// 3. 如果账户已经存在本地，我们更新该余额
					// moneyAccount.save("currentBalance", moneyAccount.xGet("currentBalance") + record.amount, {
						// dbTrans : dbTrans,
						// patch : true
					// });
					moneyAccount.__syncCurrentBalance = moneyAccount.__syncCurrentBalance ? moneyAccount.__syncCurrentBalance + record.amount : record.amount;
				}
			}			
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype,  Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});
		
		return Collection;
	}
};

