exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			messageState : "TEXT NOT NULL", //new, read, closed
        	date : "TEXT NOT NULL",
        	messageTitle : "TEXT",
        	detail : "TEXT",
        	type : "TEXT NOT NULL",
        	messageData : "TEXT",
			fromUserId : "TEXT",
			toUserId : "TEXT NOT NULL",
			messageBoxId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			messageBox : { type : "MessageBox", attribute : "messages" },
			fromUser : { type : "User", attribute : null },
			toUser : { type : "User", attribute : null },
			friend : { type : "Friend", attribute : null },
			ownerUser : {
				type : "User",
				attribute : "moneyIncomes"
			}
		},
		hasMany : {
		},
		rowView : "message/messageRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			validators : {
			},
			// syncAddNew : function(record, dbTrans) {
				// var self = this;
				// var fromUser = Alloy.createModel("User").xFindInDb({id : record.fromUserId});
				// if(!fromUser.id){
					// Alloy.Globals.Server.loadData("User", [record.fromUserId], function(collection) {
						// if (collection.length > 0) {
// 							
						// }
					// });
				// }
			// },
			getFriendUserName : function(){
				if (this.xGet("toUserId") === Alloy.Models.User.id) {
					return this.xGet("fromUser").getFriendDisplayName();
				}else{
					return this.xGet("toUser").getFriendDisplayName();
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
};
