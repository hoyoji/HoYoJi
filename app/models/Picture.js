exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			title : "TEXT",
			path : "TEXT",
			recordId : "TEXT NOT NULL",
			recordType : "TEXT NOT NULL",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			ownerUserId : "TEXT NOT NULL",
			lastClientUpdateTime : "INTEGER",
			toBeUploaded : "INTEGER",
			toBeDownloaded : "INTEGER"
		},
		defaults : {
			toBeUploaded : 1,
			toBeDownloaded : 0
		},
		belongsTo : {
			record : {
				type : "XModel",
				attribute : "pictures"
			},
			ownerUser : {
				type : "User",
				attribute : "pictures"
			}
		},
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			// extended functions and properties go here
			xGet : function(attr) {
				var value = this.get(attr);
				if (value !== undefined) {
					return value;
				} else if (this.config.hasMany && this.config.hasMany[attr]) {
					return this.xGetHasMany(attr);
				} else if (this.config.belongsTo && this.config.belongsTo[attr]) {
					var table = this.xGet("recordType"), fKey = attr + "Id", fId = this.get(fKey);
					console.info("xGet belongsTo " + fKey + " : " + fId);
					if (!fId)
						return null;

					var m = Alloy.Collections[table].get(fId);
					if (!m) {
						var idString = " = '" + fId + "' ";
						console.info("xGet fetch belongsTo from DB " + table + " : " + idString);
						m = Alloy.createCollection(table);
						m.fetch({
							query : "SELECT main.* FROM " + table + " main WHERE main.id " + idString
						});
						// console.info("xGet fetch belongsTo from DB " + m.length);
						// if(m.length === 0){
						// m = null;
						// } else {
						// m = m.at(0);
						// }
						m = Alloy.Collections[table].get(fId);
						console.info("--------" + m);
					}
					this.attributes[attr] = m;
					// this.set(attr, m, {
					// silent : true
					// });
					this._previousAttributes[attr] = m;
					return m;
				}
			},
			xDelete : function(xFinishCallback, options) {
				var self = this;
				this._xDelete(function(error) {
					if (!error) {
						// delete picture and its icon from file system
						var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, self.xGet("id") + ".png");
						if (file.exists()) {
							file.deleteFile();
						}
						file = null;
						file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, self.xGet("id") + "_icon.png");
						if (file.exists()) {
							file.deleteFile();
						}
					}
					if(xFinishCallback){
						xFinishCallback(error);
					}
				}, options);
			},
			syncAddNew : function(record, dbTrans) {
				record.toBeDownloaded = 1;
				record.toBeUploaded = 0;
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
};

