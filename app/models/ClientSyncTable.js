exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    recordId: "TEXT UNIQUE NOT NULL",
		    tableName: "TEXT NOT NULL",
		    operation : "TEXT",
		    ownerUserId : "TEXT NOT NULL"
		},
		adapter: {
			type : "hyjSql"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, {
			// extended functions and properties go here
			xFindInDb : function(filter) {
				var table = this.config.adapter.collection_name, query = "SELECT main.* FROM " + table + " main WHERE ", filterStr = "";
				if ( typeof filter === "string") {
					filterStr = filter;
				} else {
					for (var f in filter) {
						var value = filter[f]
						if (filterStr) {
							filterStr += " AND "
						}
						f = "main." + f;
						if (_.isNull(value) || value === undefined) {
							filterStr += f + " IS NULL ";
							// } else if (value === "NOT NULL") {
							// filterStr += f + " IS NOT NULL ";
						} else if (_.isNumber(value)) {
							filterStr += f + " = " + value + " ";
						} else {
							filterStr += f + " = '" + value + "' ";
						}
					}
				}
				this.fetch({
					query : query + filterStr
				});
				return this;
			}
			
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

