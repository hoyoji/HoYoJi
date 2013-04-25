exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			transferOutAmount : "REAL NOT NULL",
			transferOutId : "TEXT NOT NULL",
			transferInAmount : "REAL NOT NULL",
			transferInId : "TEXT NOT NULL",
			exchangeRate : "REAL NOT NULL",
			projectId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER"
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
		rowView : "money/moneyTransferOutRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			validators : {
				transferOutAmount : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("transferOutAmount"))) {
						error = {
							msg : "转出金额只能为数字"
						};
					} else {
						if (this.xGet("transferOutAmount") < 0) {
							error = {
								msg : "转出金额不能为负数"
							};
						}
					}
					xValidateComplete(error);
				},
				transferInAmount : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("transferInAmount"))) {
						error = {
							msg : "转入金额只能为数字"
						};
					} else {
						if (this.xGet("transferInAmount") < 0) {
							error = {
								msg : "转入金额不能为负数"
							};
						}
					}
					xValidateComplete(error);
				},
				exchangeRate : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("exchangeRate"))) {
						error = {
							msg : "汇率只能为数字"
						};
					} else {
						if (this.xGet("exchangeRate") < 0) {
							error = {
								msg : "汇率不能为负数"
							};
						} else if (this.xGet("exchangeRate") === 0) {
							error = {
								msg : "汇率不能为0"
							};
						}
					}
					xValidateComplete(error);
				},
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
			getProjectName : function() {
				return this.xGet("project").xGet("name");
			},
			getTransferOut : function() {
				var transferOut = this.xGet("transferOut");
				return transferOut.xGet("name");
			},
			getTransferIn : function() {
				var transferIn = this.xGet("transferIn");
				return transferIn.xGet("name");
			},
			getTransferOutAmount : function() {
				return this.xGet("transferOut").xGet("currency").xGet("symbol") + this.xGet("transferOutAmount").toUserCurrency();
			},
			getTransferInAmount : function() {
				return this.xGet("transferIn").xGet("currency").xGet("symbol") + this.xGet("transferInAmount").toUserCurrency();
			},
			xDelete : function(xFinishCallback) {
				var transferOutOwnerUser = this.xGet("transferOutOwnerUser");
				var transferInOwnerUser = this.xGet("transferInOwnerUser");
				var transferOut = this.xGet("transferOut");
				var transferIn = this.xGet("transferIn");
				var transferOutAmount = this.xGet("transferOutAmount");
				var transferInAmount = this.xGet("transferInAmount");
				this._xDelete(xFinishCallback);
				if (!transferOutOwnerUser) {
					transferOut.xSet("currentBalance", transferOut.xGet("currentBalance") + transferOutAmount);
					transferOut.xSave();
				}
				if (!transferInOwnerUser) {
					transferIn.xSet("currentBalance", transferIn.xGet("currentBalance") - transferInAmount);
					transferIn.xSave();
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

