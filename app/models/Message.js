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
			lastServerUpdateTime : "TEXT"
		},
		belongsTo : {
			messageBox : { type : "MessageBox", attribute : "messages" },
			fromUser : { type : "User", attribute : null },
			toUser : { type : "User", attribute : null },
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
