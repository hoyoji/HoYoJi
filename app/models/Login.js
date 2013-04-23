exports.definition = {
	config: {
		columns: {
		    id: "TEXT NOT NULL PRIMARY KEY",
		    date : "TEXT NOT NULL",
		    userName: "TEXT NOT NULL",
		    password: "TEXT NOT NULL",
		    lastSyncTime : "TEXT",
			lastModifyTime : "TEXT",
			ownerUserId : "TEXT"
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

