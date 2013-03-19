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
			},
			displayName : function() {
				if (this.xGet("nickName")) {
					return this.xGet("nickName") + "(" + this.xGet("friendUser").xGet("userName") + ")";
				}
				return this.xGet("friendUser").xGet("userName");
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
