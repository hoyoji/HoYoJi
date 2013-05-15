exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			userName : "TEXT UNIQUE NOT NULL",
			nickName : "TEXT",
			password : "TEXT NOT NULL",
			activeProjectId : "TEXT",
			activeCurrencyId : "TEXT NOT NULL",
			activeMoneyAccountId : "TEXT NOT NULL",
			newFriendAuthentication : "TEXT NOT NULL",
			defaultFriendCategoryId : "TEXT NOT NULL",
			messageBoxId : "TEXT NOT NULL",
		    isMerchant : "INTEGER NOT NULL",
			age : "INTEGER NOT NULL",
			birthday : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
		    lastServerUpdateTime : "INTEGER",
		    lastSyncTime : "INTEGER",
		    defaultTransactionDisplayType : "TEXT NOT NULL",
			lastClientUpdateTime : "INTEGER",
			pictureId : "TEXT"
		},
		defaults : {
			newFriendAuthentication : "required",
			defaultTransactionDisplayType : "Project",
			isMerchant : 0
		},
		hasMany : {
			pictures : {type : "Picture", attribute : "ownerUser",cascadeDelete : true},
	    	projects : {type : "Project", attribute : "ownerUser" },
	    	friendCategories : { type : "FriendCategory", attribute : "ownerUser" },
	    	currencies : {type : "Currency", attribute : "ownerUser"},
	    	moneyAccounts : {type : "MoneyAccount", attribute : "ownerUser"},
	    	exchanges : {type : "Exchange", attribute : "ownerUser"},
	    	moneyIncomes : {type : "MoneyIncome", attribute : "ownerUser"},
	    	moneyExpenses : {type : "MoneyExpense", attribute : "ownerUser"},
	    	moneyTransfers : {type : "MoneyTransfer", attribute : "ownerUser"},
	    	moneyBorrows : {type : "MoneyBorrow", attribute : "ownerUser"},
	    	moneyReturns : {type : "MoneyReturn", attribute : "ownerUser"},
	    	moneyLends : {type : "MoneyLend", attribute : "ownerUser"},
			moneyPaybacks : {type : "MoneyPayback", attribute : "ownerUser"},
			logins : {type : "Login", attribute : "ownerUser"}
		},
		belongsTo : {
			picture : {type : "Picture", attribute : null},
			activeProject : {type : "Project", attribute : null},
			activeCurrency : {type : "Currency", attribute : null},
			activeMoneyAccount : {type : "MoneyAccount", attribute : null},
			defaultFriendCategory : {type : "FriendCategory", attribute : null},
			messageBox : {type : "MessageBox", attribute : null}
		},
		rowView : "user/userRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			validators : {
				userName : function(xValidateComplete) {
					if(!this.isNew()){
						if(this.hasChanged("userName")){
							xValidateComplete({ msg : "用户名不能被修改" });
						} 
					}
					xValidateComplete();
				},
				password : function(xValidateComplete) {
					var error;
					if (!this.has("password") || this.xGet("password").length < 6) {
						error = {
							msg : "请输入至少六位数的密码"
						};
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
				}
			},
			_xSave : function(options){
				this.xSet("password", Ti.Utils.sha1(this.xGet("password")));
				Alloy.Globals.XModel._xSave.call(this, options);
			},
			xGetHasMany : function(attr){
				var type = this.config.hasMany[attr].type, key = this.config.hasMany[attr].attribute, collection = Alloy.createCollection(type);
				if (this.isNew()) {
					this.set(attr, collection, {
						silent : true
					});
					return collection;
				}

				var filter = {};
				//filter[key] = this;
				collection.xSetFilter(filter);

				console.info("xGet hasMany : " + type + collection.length);
				var idString;
				if (this.get('id')) {
					idString = " = '" + this.get('id') + "' ";
				} else {
					idString = " IS NULL ";
				}
				if(key === "ownerUser"){
					collection.xFetch({
						query : "SELECT main.* FROM " + type + " main "
					});
				} else {
					collection.xFetch({
						query : "SELECT main.* FROM " + type + " main WHERE main." + key + "Id " + idString
					});
				}
				console.info("xGet hasMany gg : " + type + " " + key + " " +  collection.length);

				this.attributes[attr] = collection;
				// this.set(attr, collection, {
					// silent : true
				// });

				this._previousAttributes[attr] = collection;
				return collection;				
			},
			syncUpdate : function(record, dbTrans){
				// last sync time 在每台手机上都不一样，所以我们不将其同步下来
				delete record.lastSyncTime;
			},
			getLocalCurrencySymbol : function() {
				return this.xGet("activeCurrency").xGet("symbol");
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});
		return Collection;
	}
}
