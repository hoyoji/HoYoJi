exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			transferOutAmount : "REAL NOT NULL",
			transferOutOwnerUserId : "TEXT",
			transferOutId : "TEXT NOT NULL",
			transferInAmount : "REAL NOT NULL",
			transferInOwnerUserId : "TEXT",
			transferInId : "TEXT NOT NULL",
			exchangeCurrencyRate : "REAL NOT NULL",
			projectId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		belongsTo : {
			transferOutOwnerUser : {
				type : "Friend",
				attribute : null
			},
			transferOut : {
				type : "MoneyAccount",
				attribute : null
			},
			transferInOwnerUser : {
				type : "Friend",
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
		rowView : "money/moneyTransferOutRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			validators : {
				transferOut : function(xValidateComplete) {
					var error;
					if (this.xGet("transferOut") && this.xGet("transferOut") === this.xGet("transferIn")) {
						error = {
							msg : "转出账户和转入账户不能相同"
						}
					}
					xValidateComplete(error);
				},
				transferIn : function(xValidateComplete) {
					var error;
					if (this.xGet("transferIn") && this.xGet("transferIn") === this.xGet("transferOut")) {
						error = {
							msg : "转入账户和转出账户不能相同"
						}
					}
					xValidateComplete(error);
				}
			},
			getTransferOut : function() {
				var transferOut = this.xGet("transferOut");
				return transferOut.xGet("name");
			},
			getTransferIn : function() {
				var transferIn = this.xGet("transferIn");
				return transferIn.xGet("name");
			}
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

