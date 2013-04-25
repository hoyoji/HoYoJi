exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    date : "TEXT NOT NULL",
		    userName: "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			ownerUserId : "TEXT"
		},
		belongsTo : {
			ownerUser : {type : "User", attribute : "logins"}
		},
		adapter: {
			type : "hyjSql"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			// extended functions and properties go here
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

