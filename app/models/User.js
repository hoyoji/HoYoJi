exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			userName : "TEXT UNIQUE NOT NULL",
			nickName : "TEXT",
			password : "TEXT NOT NULL",
			activeProjectId : "TEXT NOT NULL",
			activeCurrencyId : "TEXT NOT NULL",
			activeMoneyAccountId : "TEXT NOT NULL",
			friendAuthorization : "TEXT NOT NULL",
			defaultFriendCategoryId : "TEXT NOT NULL",
			messageBoxId : "TEXT NOT NULL",
			age : "INTEGER NOT NULL",
			birthday : "TEXT NOT NULL"
		},
		defaults : {
			userName : "",
			friendAuthorization : "required"
		},
		hasMany : {
	    	projects : {type : "Project", attribute : "ownerUser" },
	    	friendCategories : { type : "FriendCategory", attribute : "ownerUser" },
	    	currencies : {type : "Currency", attribute : "ownerUser"},
	    	moneyAccounts : {type : "MoneyAccount", attribute : "ownerUser"},
	    	exchanges : {type : "Exchange", attribute : "ownerUser"},
	    	moneyIncomes : {type : "MoneyIncome", attribute : "ownerUser"},
	    	moneyExpenses : {type : "MoneyExpense", attribute : "ownerUser"},
	    	moneyTransfers : {type : "MoneyTransfer", attribute : "ownerUser"}
		},
		belongsTo : {
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
					if (!this.has("password") || this.get("password").length < 6) {
						error = {
							msg : "请输入至少六位数的密码"
						};
					}
					xValidateComplete(error);
				},
				password2 : function(xValidateComplete) {
					var error;
					if (this.get("password2") !== this.get("password")) {
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
