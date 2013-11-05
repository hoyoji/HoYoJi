exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			title : "TEXT",
			path : "TEXT",
			pictureType : "TEXT",
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
						var fName = self.xGet("id"), f, imageType = self.xGet("pictureType");
						f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "." + imageType);
						f.deleteFile();
						f = null;
						f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fName + "_icon." + imageType);
						f.deleteFile();
						f = null;
					}
					if (xFinishCallback) {
						xFinishCallback(error);
					}
				}, options);
			},
			syncAddNew : function(record, dbTrans) {
				record.toBeDownloaded = 1;
				record.toBeUploaded = 0;
				var filePath;
				if (OS_ANDROID) {
					filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/";
				} else {
					filePath = Ti.Filesystem.applicationDataDirectory;
				}
				if (record.base64PictureIcon) {
					var f0 = Ti.Filesystem.getFile(filePath, record.id + "_icon." + record.pictureType);
					f0.write(Ti.Utils.base64decode(record.base64PictureIcon));
					f0 = null;
				}
				delete record.base64PictureIcon;
				if (record.base64Picture) {
					var f1 = Ti.Filesystem.getFile(filePath, record.id + "." + record.pictureType);
					f1.write(Ti.Utils.base64decode(record.base64Picture));
					f1 = null;
				}
				delete record.base64Picture;
			},
			toJSON : function(options) {
				var attributes = _.clone(this.attributes);
				for (var obj in attributes) {
					if (this.config.belongsTo && this.config.belongsTo[obj]) {
						if (attributes[obj]) {
							attributes[obj + "Id"] = attributes[obj].xGet("id");
						} else if (attributes[obj] === null) {
							attributes[obj + "Id"] = null;
						}
						delete attributes[obj];
					} else if (this.config.hasMany && this.config.hasMany[obj]) {
						delete attributes[obj];
					} else if (!this.config.columns[obj]) {
						delete attributes[obj];
					}
				}
				if (attributes.lastServerUpdateTime) {
					attributes.lastServerUpdateTime = Number(attributes.lastServerUpdateTime);
				}
				attributes.__dataType = this.config.adapter.collection_name;

				var imgDir;
				if(this.isNew()){
					imgDir = Alloy.Globals.getTempDirectory();
				} else {
					imgDir = Alloy.Globals.getApplicationDataDirectory();
				}
				var f = Ti.Filesystem.getFile(imgDir, attributes.id + "." + attributes.pictureType);
				var blob1;
				if (f.exists()) {
					blob1 = f.read();
					attributes.base64Picture = Ti.Utils.base64encode(blob1).toString();
				}
				
				var f1 = Ti.Filesystem.getFile(imgDir, attributes.id + "_icon." + attributes.pictureType);
				var blob0;
				if (f1.exists()) {
					blob0 = f1.read();
					attributes.base64PictureIcon = Ti.Utils.base64encode(blob0).toString();
					blob0 = null;
				} else if(blob1){
					blob0 = Alloy.Globals.creatImageThumbnail(blob1, 56);;
					attributes.base64PictureIcon = Ti.Utils.base64encode(blob0).toString();
					blob0 = null;				
				}
				f1 = null;
				blob1 = null;
				f = null;
				return attributes;
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

