exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    name: "TEXT NOT NULL",
		    dbVersion: "TEXT NOT NULL",
		    lastSyncTime : "TEXT",
			lastModifyTime : "TEXT"
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

