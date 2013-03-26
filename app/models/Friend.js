exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			nickName : "TEXT",
			remark : "TEXT",
			friendUserId : "TEXT NOT NULL",
			friendCategoryId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL"
		},
		belongsTo : {
			friendCategory : { type : "FriendCategory", attribute : "friends" },
			friendUser : { type : "User", attribute : null },
			ownerUser : { type : "User", attribute : null }
		},
		hasMany : {
			projectShareAuthorizations : { type : "ProjectShareAuthorization", attribute : "friend" }
		},
		rowView : "friend/friendRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			validators : {
				friendCategory : function(xValidateComplete) {
					var error;
					if (!this.xGet("friendCategory")) {
						error = {
							msg : "好友分类不能为空"
							};
						}
					xValidateComplete(error);
					}
				},
				getDisplayName : function() {
					if(!this.xGet("nickName")){
						return this.xGet("friendUser").xGet("userName");
					}else{
						return this.xGet("nickName") + "(" + this.xGet("friendUser").xGet("userName") + ")";
					}
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
