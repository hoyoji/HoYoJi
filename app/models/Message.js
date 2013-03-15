exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			messageState : "TEXT NOT NULL", //new, read, closed
        	date : "TEXT NOT NULL",
        	messageTitle : "TEXT",
        	detail : "TEXT",
        	type : "TEXT NOT NULL",
        	messageData : "TEXT",
			fromUserId : "TEXT",
			toUserId : "TEXT NOT NULL",
			messageBoxId : "TEXT NOT NULL"
		},
		belongsTo : {
			messageBox : { type : "MessageBox", attribute : "messages" },
			fromUser : { type : "User", attribute : null },
			toUser : { type : "User", attribute : null }
		},
		hasMany : {
		},
		adapter : {
			collection_name : "Message",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
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
