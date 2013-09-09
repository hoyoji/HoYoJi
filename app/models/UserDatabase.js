exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    userName: "TEXT NOT NULL COLLATE NOCASE",
		},
		adapter: {
			type : "sql",
			db_name : "hoyoji",
			idAttribute : "id",
			collection_name : "UserDatabase"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype,  {
			// extended functions and properties go here
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype,  {
			// extended functions and properties go here
		});
		
		return Collection;
	}
};

