exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			transferOutId : "TEXT NOT NULL",
			transferInId : "TEXT NOT NULL",
			foreignCurrencyAmount : "TEXT NOT NULL",
			projectId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		belongsTo : {
			transferOut : {
				type : "MoneyAccount",
				attribute : null
			},
			transferIn : {
				type : "MoneyAccount",
				attribute : null
			},
			project : {
				type : "Project",
				attribute : "moneyTransfers"
			},
			ownerUser : {
				type : "User",
				attribute : "moneyTransfers"
			}
		},
		rowView : "money/moneyTransferRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
}

