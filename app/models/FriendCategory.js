exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			parentFriendCategoryId : "TEXT",
		    lastSyncTime : "TEXT",
			lastModifyTime : "TEXT"
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
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			validators : {
				parentFriendCategory : function(xValidateComplete) {
					var error;
					if (!this.isNew() && this.xGet("id") === Alloy.Models.User.xGet("defaultFriendCategoryId")) {
						error = {
							msg : "默认好友分类不能有上级分类"
						};
					}
					xValidateComplete(error);
				}
			},
			xDelete : function(xFinishCallback) {
				if(Alloy.Models.User.xGet("defaultFriendCategoryId") === this.xGet("id")){
					xFinishCallback({ msg :"不能删除系统默认好友分类"});
				}else if(this.xGet("friends").length > 0){
					xFinishCallback({ msg :"分类中有好友，不能删除"});
				}else if(this.xGet("subFriendCategories").length > 0){
					xFinishCallback({ msg :"分类中有下级分类，不能删除"});
				}else{
					this._xDelete(xFinishCallback);
				}
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
