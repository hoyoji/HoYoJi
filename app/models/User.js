exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			userName : "TEXT UNIQUE NOT NULL",
			nickName : "TEXT",
			password : "TEXT NOT NULL",
			activeProjectId : "TEXT NOT NULL"
		},
		defaults : {
			userName : ""
		},
		hasMany : {
	    	projects : {type : "Project", attribute : "ownerUser" },
	    	friendCategories : { type : "FriendCategory", attribute : "ownerUser" }
		},
		belongsTo : {
			activeProject : {type : "Project", attribute : null}
		},
		rowView : "user/userRow",
		adapter : {
			collection_name : "User",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
				userName : function(xValidateComplete) {
					if(!this.isNew()){
						if(this.get("userName") !== this.previous("userName")){
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
					if (!this.has("password2") || this.get("password2").length < 6) {
						error = {
							msg : "请输入至少六位数的密码"
						};
					} else if (this.get("password2") !== this.get("password")) {
						error = {
							msg : "两次输入的密码不一样"
						};
					}
					xValidateComplete(error);
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
