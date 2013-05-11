exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    title : "TEXT",
		    path : "TEXT",
		    recordId : "TEXT NOT NULL",
		    recordType : "TEXT NOT NULL",
		    serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			ownerUserId : "TEXT NOT NULL",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			ownerUser : {type : "User", attribute : "pictures"}
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

