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
			pictureId : "TEXT",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		},
		hasMany : {
			pictures : {
				type : "Picture",
				attribute : "record",
				cascadeDelete : true
			}
		},
		belongsTo : {
			transferOut : {
				type : "MoneyAccount",
				attribute : "moneyTransferOuts"
			},
			transferIn : {
				type : "MoneyAccount",
				attribute : "moneyTransferIns"
			},
			project : {
				type : "Project",
				attribute : "moneyTransfers"
			},
			picture : {
				type : "Picture",
				attribute : null
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
				return transferOut.xGet("name") + "(" + transferOut.xGet("currency").xGet("code") + ")转出";
			},
			getTransferIn : function() {
				var transferIn = this.xGet("transferIn");
				return "转入" + transferIn.xGet("name") + "(" + transferIn.xGet("currency").xGet("code") + ")";
			},
			getTransferOutAmount : function() {
				return this.xGet("transferOut").xGet("currency").xGet("symbol") + this.xGet("transferOutAmount").toUserCurrency();
			},
			getTransferInAmount : function() {
				return this.xGet("transferIn").xGet("currency").xGet("symbol") + this.xGet("transferInAmount").toUserCurrency();
			},
			xDelete : function(xFinishCallback, options) {
				var transferOut = this.xGet("transferOut");
				var transferIn = this.xGet("transferIn");
				var transferOutAmount = this.xGet("transferOutAmount");
				var transferInAmount = this.xGet("transferInAmount");
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;
				transferOut.save({
					currentBalance : transferOut.xGet("currentBalance") + transferOutAmount
				}, saveOptions);
				transferIn.save({
					currentBalance : transferIn.xGet("currentBalance") - transferInAmount
				}, saveOptions);

				this._xDelete(xFinishCallback, options);
			},
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果账户也是新增的
				// 2. 账户已经存在

				if (record.ownerUserId === Alloy.Models.User.id) {
					var moneyAccountIn = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.transferInId
					});
					if (moneyAccountIn.id) {
						moneyAccountIn.save("currentBalance", moneyAccountIn.xGet("currentBalance") + record.transferInAmount, {
							dbTrans : dbTrans,
							patch : true
						});
					}

					var moneyAccountOut = Alloy.createModel("MoneyAccount").xFindInDb({
						id : record.transferOutId
					});
					if (moneyAccountOut.id) {
						moneyAccountOut.save("currentBalance", moneyAccountOut.xGet("currentBalance") - record.transferOutAmount, {
							dbTrans : dbTrans,
							patch : true
						});
					}
				}
			},
			syncUpdate : function(record, dbTrans) {
				if (record.ownerUserId === Alloy.Models.User.id) {
					var oldMoneyAccountIn = Alloy.createModel("MoneyAccount").xFindInDb({
						id : this.xGet("transferInId")
					});
					if (this.xGet("transferInId") === record.transferInId) {
						// if(oldMoneyAccountIn.id){
						oldMoneyAccountIn.save("currentBalance", oldMoneyAccountIn.xGet("currentBalance") - this.xGet("transferInAmount") + record.transferInAmount, {
							dbTrans : dbTrans,
							patch : true
						});
						// }
					} else {
						if (oldMoneyAccountIn.id) {
							oldMoneyAccountIn.save("currentBalance", oldMoneyAccountIn.xGet("currentBalance") - this.xGet("transferInAmount"), {
								dbTrans : dbTrans,
								patch : true
							});
						}

						var newMoneyAccountIn = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.transferInId
						});
						if (newMoneyAccountIn.id) {
							newMoneyAccountIn.save("currentBalance", newMoneyAccountIn.xGet("currentBalance") + record.transferInAmount, {
								dbTrans : dbTrans,
								patch : true
							});
						}
					}

					var oldMoneyAccountOut = Alloy.createModel("MoneyAccount").xFindInDb({
						id : this.xGet("transferOutId")
					});
					if (this.xGet("transferOutId") === record.transferOutId) {
						// if(oldMoneyAccountOut.id){
						oldMoneyAccountOut.save("currentBalance", oldMoneyAccountOut.xGet("currentBalance") + this.xGet("transferOutAmount") - record.transferOutAmount, {
							dbTrans : dbTrans,
							patch : true
						});
						// }
					} else {
						if (oldMoneyAccountOut.id) {
							oldMoneyAccountOut.save("currentBalance", oldMoneyAccountOut.xGet("currentBalance") + this.xGet("transferOutAmount"), {
								dbTrans : dbTrans,
								patch : true
							});
						}

						var newMoneyAccountOut = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.transferOutId
						});
						if (newMoneyAccountOut.id) {
							newMoneyAccountOut.save("currentBalance", newMoneyAccountOut.xGet("currentBalance") - record.transferOutAmount, {
								dbTrans : dbTrans,
								patch : true
							});
						}
					}
				}
			},
			syncUpdateConflict : function(record, dbTrans) {
				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if (this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime) {
					delete record.id;
					this.syncUpdate(record, dbTrans);
					this._syncUpdate(record, dbTrans);

					var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					dbTrans.db.execute(sql, [this.xGet("id")]);
				}
				// 让本地修改覆盖服务器上的记录
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

