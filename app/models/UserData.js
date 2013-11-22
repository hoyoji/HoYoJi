exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			userId : "TEXT NOT NULL",
			//userName : "TEXT NOT NULL",
			//nickName : "TEXT",
			password : "TEXT NOT NULL",
			email : "TEXT",
			emailVerified : "INTEGER NOT NULL",
			phone : "TEXT",
			phoneVerified : "INTEGER NOT NULL",
			activeProjectId : "TEXT",
			activeCurrencyId : "TEXT NOT NULL",
			activeMoneyAccountId : "TEXT NOT NULL",
			newFriendAuthentication : "TEXT NOT NULL",
			defaultFriendCategoryId : "TEXT NOT NULL",
			messageBoxId : "TEXT NOT NULL",
			//isMerchant : "INTEGER NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastSyncTime : "TEXT",
			defaultTransactionDisplayType : "TEXT NOT NULL",
			lastClientUpdateTime : "INTEGER",
			//pictureId : "TEXT",
			location : "TEXT",
			geoLon : "TEXT",
			geoLat : "TEXT",
			address : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		defaults : {
			newFriendAuthentication : "required",
			defaultTransactionDisplayType : "Project",
			//isMerchant : 0,
			emailVerified : 0,
			phoneVerified : 0
		},
		belongsTo : {
			user : {
				type : "User",
				attribute : null
			},
			activeProject : {
				type : "Project",
				attribute : null
			},
			activeCurrency : {
				type : "Currency",
				attribute : null
			},
			activeMoneyAccount : {
				type : "MoneyAccount",
				attribute : null
			},
			defaultFriendCategory : {
				type : "FriendCategory",
				attribute : null
			},
			messageBox : {
				type : "MessageBox",
				attribute : null
			}
		},
		rowView : "user/huserRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
				password : function(xValidateComplete) {
					var error;
					var psw = this.xGet("password");
					var passwordValidation = /^.{6,18}$/;

					if (!psw || !passwordValidation.test(psw)) {
						error = {
							msg : "请输入至少六位数的密码"
						};

					} else {
						var repeat = true;
						var series = true;
						var first = psw.charAt(0);
						for (var i = 1; i < psw.length; i++) {
							repeat = repeat && psw.charAt(i) === first;
							series = series && psw.charCodeAt(i) === psw.charCodeAt(i - 1) + 1;
						}
						if (repeat || series) {
							error = {
								msg : "密码过于简单，请重新输入"
							};
						}
					}
					xValidateComplete(error);
				},
				password2 : function(xValidateComplete) {
					var error;
					if (this.xGet("password2") !== this.xGet("password")) {
						error = {
							msg : "两次输入的密码不一样"
						};
					}
					xValidateComplete(error);
				},
				email : function(xValidateComplete){
					var error;
					var email = this.xGet("email");
					if (email) {
						var emailValidation = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$/;
						if (!emailValidation.test(email)) {
							error = {
								msg : "email不合法"
							};
						}
					}
					xValidateComplete(error);
				}
			},
			// _xSave : function(options){
			// // this.xSet("password", Ti.Utils.sha1(this.xGet("password")));
			// Alloy.Globals.XModel._xSave.call(this, options);
			// },
			
			getActiveCurrencyNameOrCode : function() {
				if(this.xGet("activeCurrency").xGet("id")) {
					return this.xGet("activeCurrency").xGet("name");
				}else {
					return this.xGet("activeCurrencyId");
				}
			},
			syncAddNew : function(record, dbTrans) {
				// last sync time 在每台手机上都不一样，所以我们不将其同步下来
				delete record.lastSyncTime;
			},
			syncUpdate : function(record, dbTrans) {
				// last sync time 在每台手机上都不一样，所以我们不将其同步下来
				delete record.lastSyncTime;
			},
			syncUpdateConflict : function(record, dbTrans) {
				// last sync time 在每台手机上都不一样，所以我们不将其同步下来
				delete record.lastSyncTime;
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
			},
			getLocalCurrencySymbol : function() {
				return this.xGet("activeCurrency").xGet("symbol");
			}, 
			canEdit : function(){
				return this === Alloy.Models.User || !Alloy.Models.User;
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
