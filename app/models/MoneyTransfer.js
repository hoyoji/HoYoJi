exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			date : "TEXT NOT NULL",
			transferOutAmount : "REAL NOT NULL",
			transferOutId : "TEXT",
			transferOutUserId : "TEXT",
			transferOutLocalFriendId : "TEXT",
			transferInAmount : "REAL NOT NULL",
			transferInId : "TEXT",
			transferInUserId : "TEXT",
			transferInLocalFriendId : "TEXT",
			exchangeRate : "REAL NOT NULL",
			projectId : "TEXT NOT NULL",
			pictureId : "TEXT",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER",
			location : "TEXT",
			geoLon : "TEXT",
			geoLat : "TEXT",
			address : "TEXT"
		},
		hasMany : {
			pictures : {
				type : "Picture",
				attribute : "record",
				cascadeDelete : true
			}
		},
		belongsTo : {
			transferOutUser : {
				type : "User",
				attribute : null
			},
			transferInUser : {
				type : "User",
				attribute : null
			},
			transferOutLocalFriend : {
				type : "Friend",
				attribute : null
			},
			transferInLocalFriend : {
				type : "Firend",
				attribute : null
			},
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
					if (isNaN(this.xGet("transferOutAmount")) || this.xGet("amount") === null) {
						error = {
							msg : "转出金额只能为数字"
						};
					} else {
						if (this.xGet("transferOutAmount") < 0) {
							error = {
								msg : "转出金额不能为负数"
							};
						} else if (this.xGet("transferOutAmount") > 999999999) {
							error = {
								msg : "金额超出范围，请重新输入"
							};
						}
					}
					xValidateComplete(error);
				},
				transferInAmount : function(xValidateComplete) {
					var error;
					if (isNaN(this.xGet("transferInAmount")) || this.xGet("amount") === null) {
						error = {
							msg : "转入金额只能为数字"
						};
					} else {
						if (this.xGet("transferInAmount") < 0) {
							error = {
								msg : "转入金额不能为负数"
							};
						} else if (this.xGet("transferInAmount") > 999999999) {
							error = {
								msg : "金额超出范围，请重新输入"
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
					if(!this.xGet("transferOut") && !this.xGet("transferIn")){
						error = {
							msg : "请输入转出账户"
						};
					}
					else if (this.xGet("transferOut") && this.xGet("transferOut") === this.xGet("transferIn")) {
						error = {
							msg : "转出账户和转入账户不能相同"
						};
					}
					xValidateComplete(error);
				},
				transferIn : function(xValidateComplete) {
					var error;
					if(!this.xGet("transferOut") && !this.xGet("transferIn")){
						error = {
							msg : "请输入转入账户"
						};
					}
					else if (this.xGet("transferIn") && this.xGet("transferIn") === this.xGet("transferOut")) {
						error = {
							msg : "转入账户和转出账户不能相同"
						};
					}
					xValidateComplete(error);
				},
				transferOutUser : function(xValidateComplete) {
					var error;
					if ((this.xGet("transferOutUser") !== Alloy.Models.User) && (this.xGet("transferInUser") !== Alloy.Models.User)) {
						error = {
							msg : "转出人和转入人必须有一个自己"
						};
					}
					xValidateComplete(error);
				},
				transferInUser : function(xValidateComplete) {
					var error;
					if ((this.xGet("transferOutUser") !== Alloy.Models.User) && (this.xGet("transferInUser") !== Alloy.Models.User)) {
						error = {
							msg : "转出人和转入人必须有一个自己"
						};
					}
					xValidateComplete(error);
				}
			},
			getProjectName : function() {
				return this.xGet("project").getProjectName();
			},
			getTransferOut : function() {
				if (this.xGet("transferOut")) {
					return this.xGet("transferOut").xGet("name") + "(" + this.xGet("transferOut").xGet("currency").xGet("code") + ")转出";
				} else if (this.xGet("transferOutUser")) {
					return this.xGet("transferOutUser").getFriendDisplayName() + "转出";
				} else {
					return "无转出人";
				}
			},
			getTransferIn : function() {
				if (this.xGet("transferIn")) {
					return "转入" + this.xGet("transferIn").xGet("name") + "(" + this.xGet("transferIn").xGet("currency").xGet("code") + ")";
				} else if (this.xGet("transferInUser")) {
					return "转入" + this.xGet("transferInUser").getFriendDisplayName();
				} else {
					return "无转入人";
				}
			},
			getTransferOutAmount : function() {
				var exchange = null;
				var userCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
				if (this.xGet("transferOut")) {
					var transferOutCurrency = this.xGet("transferOut").xGet("currency");
					if (transferOutCurrency === userCurrency) {
						exchange = 1;
					} else {
						var exchanges = transferOutCurrency.getExchanges(userCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
					return userCurrency.xGet("symbol") + (this.xGet("transferOutAmount") * exchange).toUserCurrency();
				} else {
					if (this.xGet("transferIn")) {
						var transferInCurrency = this.xGet("transferIn").xGet("currency");
						if (transferInCurrency === userCurrency) {
							exchange = 1;
						} else {
							var exchanges = transferInCurrency.getExchanges(userCurrency);
							if (exchanges.length) {
								exchange = exchanges.at(0).xGet("rate");
							}
						}
						return userCurrency.xGet("symbol") + (this.xGet("transferInAmount") * exchange).toUserCurrency();
					}
				}
			},
			getTransferInAmount : function() {
				var exchange = null;
				var userCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
				if (this.xGet("transferIn")) {
					var transferInCurrency = this.xGet("transferIn").xGet("currency");
					if (transferInCurrency === userCurrency) {
						exchange = 1;
					} else {
						var exchanges = transferInCurrency.getExchanges(userCurrency);
						if (exchanges.length) {
							exchange = exchanges.at(0).xGet("rate");
						}
					}
					return userCurrency.xGet("symbol") + (this.xGet("transferInAmount") * exchange).toUserCurrency();
				} else {
					if (this.xGet("transferOut")) {
						var transferOutCurrency = this.xGet("transferOut").xGet("currency");
						if (transferOutCurrency === userCurrency) {
							exchange = 1;
						} else {
							var exchanges = transferOutCurrency.getExchanges(userCurrency);
							if (exchanges.length) {
								exchange = exchanges.at(0).xGet("rate");
							}
						}
						return userCurrency.xGet("symbol") + (this.xGet("transferOutAmount") * exchange).toUserCurrency();
					}
				}

			},
			getRemark : function() {
				var remark = this.xGet("remark") || "";
				if (!this.xGet("transferOutId") && (this.xGet("transferOutUserId") || this.xGet("transferOutLocalFriendId"))) {
					remark = remark + "［从" + (this.xGet("transferOutUser") || this.xGet("transferOutLocalFriend")).getDisplayName() + "转出］" + remark;
				} else if (!this.xGet("transferInId") && (this.xGet("transferInUserId") || this.xGet("transferLocalInFriendId"))) {
					remark = remark + "［转入到" + (this.xGet("transferInUser") || this.xGet("transferInLocalFriend")).getDisplayName() + "］" + remark;
				}
				if (!remark) {
					remark = "无备注";
				}
				return remark;
			},
			xDelete : function(xFinishCallback, options) {
				var transferOut = this.xGet("transferOut");
				var transferIn = this.xGet("transferIn");
				var transferOutAmount = this.xGet("transferOutAmount");
				var transferInAmount = this.xGet("transferInAmount");
				var saveOptions = _.extend({}, options);
				saveOptions.patch = true;
				if (transferOut) {
					transferOut.save({
						currentBalance : transferOut.xGet("currentBalance") + transferOutAmount
					}, saveOptions);
				}
				if (transferIn) {
					transferIn.save({
						currentBalance : transferIn.xGet("currentBalance") - transferInAmount
					}, saveOptions);
				}

				this._xDelete(xFinishCallback, options);
			},
			syncAddNew : function(record, dbTrans) {
				// 更新账户余额
				// 1. 如果账户也是新增的
				// 2. 账户已经存在

				if (record.ownerUserId === Alloy.Models.User.id) {
					if (record.transferInId) {
						var moneyAccountIn = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.transferInId
						});
						if (moneyAccountIn.id) {
							moneyAccountIn.__syncCurrentBalance = moneyAccountIn.__syncCurrentBalance ? moneyAccountIn.__syncCurrentBalance + record.transferInAmount : record.transferInAmount;
						} else {
							dbTrans.__syncData[record.transferInId] = dbTrans.__syncData[record.transferInId] || {};
							dbTrans.__syncData[record.transferInId].__syncCurrentBalance = dbTrans.__syncData[record.transferInId].__syncCurrentBalance ? dbTrans.__syncData[record.transferInId].__syncCurrentBalance + record.transferInAmount : record.transferInAmount;
						}
					}
					if (record.transferOutId) {
						var moneyAccountOut = Alloy.createModel("MoneyAccount").xFindInDb({
							id : record.transferOutId
						});
						if (moneyAccountOut.id) {
							moneyAccountOut.__syncCurrentBalance = moneyAccountOut.__syncCurrentBalance ? moneyAccountOut.__syncCurrentBalance - record.transferOutAmount : -record.transferOutAmount;
						} else {
							dbTrans.__syncData[record.transferOutId] = dbTrans.__syncData[record.transferOutId] || {};
							dbTrans.__syncData[record.transferOutId].__syncCurrentBalance = dbTrans.__syncData[record.transferOutId].__syncCurrentBalance ? dbTrans.__syncData[record.transferOutId].__syncCurrentBalance - record.transferOutAmount : -record.transferOutAmount;
						}
					}
				}
			},
			syncUpdate : function(record, dbTrans) {
				if (record.ownerUserId === Alloy.Models.User.id) {
					var oldMoneyAccountIn;
					if (this.xGet("transferInId")) {
						oldMoneyAccountIn = Alloy.createModel("MoneyAccount").xFindInDb({
							id : this.xGet("transferInId")
						});
					}
					if (oldMoneyAccountIn && this.xGet("transferInId") === record.transferInId) {
						oldMoneyAccountIn.__syncCurrentBalance = oldMoneyAccountIn.__syncCurrentBalance ? oldMoneyAccountIn.__syncCurrentBalance - this.xGet("transferInAmount") + record.transferInAmount : -this.xGet("transferInAmount") + record.transferInAmount;
					} else {
						if (oldMoneyAccountIn && oldMoneyAccountIn.id) {
							oldMoneyAccountIn.__syncCurrentBalance = oldMoneyAccountIn.__syncCurrentBalance ? oldMoneyAccountIn.__syncCurrentBalance - this.xGet("transferInAmount") : -this.xGet("transferInAmount");
						}
						var newMoneyAccountIn;
						if (record.transferInId) {
							newMoneyAccountIn = Alloy.createModel("MoneyAccount").xFindInDb({
								id : record.transferInId
							});
						}
						if (newMoneyAccountIn) {
							if (newMoneyAccountIn.id) {
								newMoneyAccountIn.__syncCurrentBalance = newMoneyAccountIn.__syncCurrentBalance ? newMoneyAccountIn.__syncCurrentBalance + record.transferInAmount : record.transferInAmount;
							} else {
								dbTrans.__syncData[record.transferInId] = dbTrans.__syncData[record.transferInId] || {};
								dbTrans.__syncData[record.transferInId].__syncCurrentBalance = dbTrans.__syncData[record.transferInId].__syncCurrentBalance ? dbTrans.__syncData[record.transferInId].__syncCurrentBalance + record.transferInAmount : record.transferInAmount;
							}
						}
					}

					var oldMoneyAccountOut;
					if (this.xGet("transferOutId")) {
						oldMoneyAccountOut = Alloy.createModel("MoneyAccount").xFindInDb({
							id : this.xGet("transferOutId")
						});
					}
					if (oldMoneyAccountOut && this.xGet("transferOutId") === record.transferOutId) {
						oldMoneyAccountOut.__syncCurrentBalance = oldMoneyAccountOut.__syncCurrentBalance ? oldMoneyAccountOut.__syncCurrentBalance + this.xGet("transferOutAmount") - record.transferOutAmount : this.xGet("transferOutAmount") - record.transferOutAmount;
					} else {
						if (oldMoneyAccountOut && oldMoneyAccountOut.id) {
							oldMoneyAccountOut.__syncCurrentBalance = oldMoneyAccountOut.__syncCurrentBalance ? oldMoneyAccountOut.__syncCurrentBalance + this.xGet("transferOutAmount") : this.xGet("transferOutAmount");
						}
						var newMoneyAccountOut;
						if (record.transferOutId) {
							newMoneyAccountOut = Alloy.createModel("MoneyAccount").xFindInDb({
								id : record.transferOutId
							});
						}
						if (newMoneyAccountOut) {
							if (newMoneyAccountOut.id) {
								newMoneyAccountOut.__syncCurrentBalance = newMoneyAccountOut.__syncCurrentBalance ? newMoneyAccountOut.__syncCurrentBalance - record.transferOutAmount : -record.transferOutAmount;
							} else {
								dbTrans.__syncData[record.transferOutId] = dbTrans.__syncData[record.transferOutId] || {};
								dbTrans.__syncData[record.transferOutId].__syncCurrentBalance = dbTrans.__syncData[record.transferOutId].__syncCurrentBalance ? dbTrans.__syncData[record.transferOutId].__syncCurrentBalance - record.transferOutAmount : -record.transferOutAmount;
							}
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
				} else {
					// 让本地修改覆盖服务器上的记录
					this._syncUpdate({
						lastServerUpdateTime : record.lastServerUpdateTime
					}, dbTrans);
				}
				// 让本地修改覆盖服务器上的记录
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
				if (this.xGet("ownerUserId") === Alloy.Models.User.id) {
					var transferOut = this.xGet("transferOut");
					var transferIn = this.xGet("transferIn");
					if (transferOut) {
						var transferOutAmount = this.xGet("transferOutAmount") || 0;
						transferOut.__syncCurrentBalance = transferOut.__syncCurrentBalance ? transferOut.__syncCurrentBalance + transferOutAmount : transferOutAmount;
					}
					if (transferIn) {
						var transferInAmount = this.xGet("transferInAmount") || 0;
						transferIn.__syncCurrentBalance = transferIn.__syncCurrentBalance ? transferIn.__syncCurrentBalance - transferInAmount : -transferInAmount;
					}
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
};

