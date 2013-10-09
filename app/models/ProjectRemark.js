exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    remark : "TEXT",
		    projectId : "TEXT",
			ownerUserId : "TEXT",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			project : {type : "Project", attribute : null},
			ownerUser : {type : "User", attribute : null}
		},
		adapter: {
			type: "hyjSql"
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
};