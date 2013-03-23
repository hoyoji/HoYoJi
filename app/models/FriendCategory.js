exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			parentFriendCategoryId : "TEXT"
		},
		// defaults : {
			// name : "",
		// },
		belongsTo : {
			ownerUser : { type : "User", attribute : "friendCategories" },
			parentFriendCategory : { type : "FriendCategory", attribute : "subFriendCategories" }
		},
		hasMany : {
			subFriendCategories : { type : "FriendCategory", attribute : "parentFriendCategory" },
			friends : { type : "Friend", attribute : "friendCategory" }
		},
		rowView : "friend/friendCategoryRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			validators : {
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
