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
			projectSharedToes : { type : "ProjectSharedTo", attribute : "friend" }
		},
		rowView : "friend/friendRow",
		adapter : {
			collection_name : "Friend",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
				friendCategory : function(xValidateComplete) {
					var error;
					if (!this.has("friendCategory")) {
						error = {
							msg : "好友分类不能为空"
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
