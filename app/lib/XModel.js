( function() {
		guid = function() {
			function S4() {
				return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
			}

			return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
		};
		exports.XModel = {
			__xValidateCount : 0,
			initialize : function() {
				var self = this;
				if (this.isNew()) {
					this.attributes.id = guid();
					if (Alloy.Models.User) {
						this.xSet("ownerUser", Alloy.Models.User);
					}
					
					// need to clear all the hasMany filters on model destroy
					this.on("destroy", function(){
						for (var key in this.config.hasMany) {
							if(this.get(key)){
								this.get(key).xClearFilter();
							}
						}
					});
					
					this.on("sync fetch", this.__initializeExistingModel, this);
				} else {
					this.__initializeExistingModel();
				}
				this.on("sync", function() {
					for (var belongsTo in this.config.belongsTo) {
						//if (self.xGet(belongsTo) && self.xGet(belongsTo).xGet("id") !== self.xGet(belongsTo + "Id")) {
						this.attributes[belongsTo] = null;
						delete this.attributes[belongsTo];
						//}
					}
					
					this._previousAttributes = _.clone(this.attributes)
					this.changed = {};
				    this._silent = {};
				    this._pending = {};						
				}, this);
				
				// revert the belongsTo ID changes on error
				this.on("error", function() {
					for (var belongsTo in self.config.belongsTo) {
						var attr = belongsTo + "Id";
						if (self.hasChanged(attr)) {
							self.set(attr, self.previous(attr), {
								silent : true
							});
						}
					}
				});
			},
			__initializeExistingModel : function(model, resp, options) {
				if (this.isNew()) {
					return;
				}
				this.off(null, this.__initializeExistingModel);
				// keep the relations in sync
				var storeCollection = Alloy.Collections[this.config.adapter.collection_name];

				// Keep every model to its store collection
				console.info("putting new model into its store collection 2 " + storeCollection.config.adapter.collection_name + " " + this.id + " " + this.cid);
				if (this.collection !== storeCollection) {
					this.collection = storeCollection;
					options = options ? {syncFromServer : options.syncFromServer} : null;
					storeCollection.add(this, options);
				}

				for (var key in this.config.hasMany) {
					// need to also clear hasMany filter
					if(this.get(key)){
						this.get(key).xClearFilter();
					}
					
					this.attributes[key] = null;
					delete this.attributes[key];
				}
				
				// for (var belongsTo in this.config.belongsTo) {
					// //if (self.xGet(belongsTo) && self.xGet(belongsTo).xGet("id") !== self.xGet(belongsTo + "Id")) {
					// this.attributes[belongsTo] = null;
					// delete this.attributes[belongsTo];
					// //}
				// }
// 				
				// this._previousAttributes = _.clone(this.attributes)
				// this.changed = {};
			    // this._silent = {};
			    // this._pending = {};
			},
			_xSave : function(options) {
				options = _.extend({}, options, {
					wait : true,
					silent : true
				});
				
				for (var belongsTo in this.config.belongsTo) {
					var belongsToModel = this.xGet(belongsTo);
					if ((this.isNew() && belongsToModel !== undefined) || this.hasChanged(belongsTo)) {
						if (belongsToModel) {
							this.set(belongsTo + "Id", belongsToModel.xGet("id"), {
								silent : true
							});
						} else {
							this.set(belongsTo + "Id", null, {
								silent : true
							});
						}
					}
				}

				console.info("xValidation done with no errors ");
				//self.__cascadeUpdateBelongsTo(function() {
				//	self.__cascadeUpdateHasMany(function(){
				this.save(null, options);
				//	});
				//});
			},
			xSave : function(options) {
				var self = this;
				
				if (this.__xValidateCount) {
					throw Error("Model is still pending for xValidation to be completed! Can not call xSave again!!");
					return;
				}

				this.xValidate(function() {
					if (self.__xValidationErrorCount > 0) {
						console.info("xValidation done with errors " + self.__xValidationErrorCount);
						self.__xValidationError.__summary = {
							msg : "验证错误"
						};
						for (var e in self.__xValidationError) {
							console.info(e + " : " + self.__xValidationError[e].msg);
						}
						self.trigger("error", self, self.__xValidationError, options);
					} else {
						self._xSave(options);
					}
				});

				return this;
			},
			xValidateAttribute : function(key, xCallback) {
				var self = this;
				this.__xValidateCount++;
				setTimeout(function() {
					self.validators[key].call(self, function(error) {
						self.__xValidateCount--;
						if (error) {
							self.__xValidationErrorCount++;
							self.__xValidationError[key] = error;
						}
						console.info("xValidateAttribute : " + key + " " + self.__xValidateCount);
						if (self.__xValidateCount === 0) {
							xCallback();
						}
					});
				}, 1);
			},
			xValidate : function(xFinishCallback) {
				var self = this;
				this.__xValidationError = {};
				this.__xValidationErrorCount = 0;

				for (var column in this.config.columns) {
					if (column === "id")
						continue;

					var field = this.config.columns[column], fieldValue = this.xGet(column);

					console.info("validating column : " + column + "  " + fieldValue);
					if ( typeof fieldValue === "string") {
						fieldValue = Alloy.Globals.alloyString.trim(fieldValue);
					}
					// 检查不能为空
					if (field.contains("NOT NULL")) {
						if (this.config.belongsTo && this.config.belongsTo[column.slice(0, -2)]) {
							if (!this.xGet(column.slice(0, -2))) {
								console.info("validating column : " + column + "  " + this.xGet(column.slice(0, -2)));
								this.__xValidationErrorCount++;
								this.__xValidationError[column] = {
									msg : "不能为空"
								};
								continue;
							}
						} else if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
							this.__xValidationErrorCount++;
							this.__xValidationError[column] = {
								msg : "不能为空"
							};
							continue;
						}
					}
					// 检查数据类型
					if (field.contains("REAL") && fieldValue !== undefined && fieldValue !== null) {
						if (_.isNaN(Number(fieldValue))) {
							this.__xValidationErrorCount++;
							this.__xValidationError[column] = {
								msg : "请输入数字"
							};
							continue;
						}
					}
					if (field.contains("INTEGER") && fieldValue !== undefined && fieldValue !== null) {
						if (_.isNaN(Number(fieldValue)) || fieldValue.toString().contains(".")) {
							this.__xValidationErrorCount++;
							this.__xValidationError[column] = {
								msg : "请输入整数 "
							};
							continue;
						}
					}
					// 检查唯一性
					if (field.contains("UNIQUE")) {
						if (this.isNew() || this.hasChanged(column)) {
							var filter = {};
							filter[column] = fieldValue;
							if (Alloy.createCollection(this.config.adapter.collection_name).xSearchInDb(filter).length > 0) {
								console.info("Check UNIQUE : NO!!");
								this.__xValidationErrorCount++;
								this.__xValidationError[column] = {
									msg : "该名称已存在"
								};
								continue;
							}
						}
						console.info("Check UNIQUE : YES!!");
					}
				}

				// 检查下级不能作为上级
				for (var belongsTo in this.config.belongsTo) {
					if (this.config.belongsTo[belongsTo].type !== this.config.adapter.collection_name) {
						continue;
					}
					var error, reverseKey = self.config.belongsTo[belongsTo].attribute;

					if (self.has(belongsTo) && self.xGet(belongsTo) === self) {
						error = {
							msg : "不能选择自己作为上级"
						};
					} else if (self.has(belongsTo) && self.xGetDescendents(reverseKey).where({
						id : self.xGet(belongsTo).xGet("id")
					}).length) {
						error = {
							msg : "不能选择下级项目"
						};
					}
					if (error) {
						self.__xValidationErrorCount++;
						self.__xValidationError[belongsTo] = error;
					}
				}

				var count = 0;
				for (var key in this.validators) {
					count++;
					self.xValidateAttribute(key, xFinishCallback);
				}

				if (count === 0) {
					xFinishCallback();
				}
				return this;
			},
			xAddToSave : function(saveableController) {
				saveableController.addToSave(this);
				return this;
			},
			xSet : function(a, b, c) {
				var d;
				_.isObject(a) || null == a ? ( d = a, c = b) : ( d = {}, d[a] = b);
				c || ( c = {});
				c.silent = true;
				for(var attr in d){
					if(this.attributes[attr] === undefined){
						this.xGet(attr);
					}
				}
				this.set(d, c);
				return this;
			},
			xGetHasMany : function(attr) {
				var type = this.config.hasMany[attr].type, key = this.config.hasMany[attr].attribute, collection = Alloy.createCollection(type);
				if (this.isNew()) {
					this.set(attr, collection, {
						silent : true
					});
					return collection;
				}

				var filter = {};
				filter[key] = this;
				collection.xSetFilter(filter);

				console.info("xGet hasMany : " + type + collection.length);
				var idString;
				if (this.get('id')) {
					idString = " = '" + this.get('id') + "' ";
				} else {
					idString = " IS NULL ";
				}
				collection.xFetch({
					query : "SELECT main.* FROM " + type + " main WHERE main." + key + "Id " + idString
				});
				console.info("xGet hasMany : " + key + collection.length);

				this.attributes[attr] = collection;
				// this.set(attr, collection, {
					// silent : true
				// });

				this._previousAttributes[attr] = collection;
				return collection;
			},
			xGet : function(attr) {
				var value = this.get(attr);
				if (value !== undefined) {
					return value;
				} else if (this.config.hasMany && this.config.hasMany[attr]) {
					return this.xGetHasMany(attr);
				} else if (this.config.belongsTo && this.config.belongsTo[attr]) {
					var table = this.config.belongsTo[attr].type, fKey = attr + "Id", fId = this.get(fKey);
					console.info("xGet belongsTo " + fKey + " : " + fId);
					if (!fId){
						this.attributes[attr] = null;
						this._previousAttributes[attr] = null;
						return null;
					}
					
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
				return value;
			},
			xPrevious : function(f){
				if (this.hasChanged(f)) {
					return this.previous(f);
				}
				return this.xGet(f);
			},
			xDeepGet : function(fields) {
				function xGetRecursive(object, path) {
					if (path.length > 1) {
						var p = path.shift();
						object = object.xGet ? object.xGet(p) : object[p];
						return xGetRecursive(object, path);
					}
					return object.xGet ? object.xGet(path[0]) : object[path[0]];
				}

				return xGetRecursive(this, fields.split("."));
			},
			xGetDescendents : function(attribute) {
				var descendents = Alloy.createCollection(this.config.adapter.collection_name);

				function getDescendents(parents) {
					if (!parents)
						return;
					for (var i = 0; i < parents.length; i++) {
						descendents.push(parents.at(i));
						getDescendents(parents.at(i).xGet(attribute));
					}
				}

				getDescendents(this.xGet(attribute));
				return descendents;
			},
			xGetAncestors : function(attribute) {
				var ancestors = Alloy.createCollection(this.config.adapter.collection_name);

				function getAncestors(descendent) {
					if (!descendent)
						return;
					ancestors.push(descendent);
					getAncestors(descendent.xGet(attribute));
				}

				getAncestors(this.xGet(attribute));
				return ancestors;
			},
			xDelete : function(xFinishCallback, options) {
				this._xDelete(xFinishCallback, options);
			},
			_xDelete : function(xFinishCallback, options) {
				var error, cascadeDeletions = [];
				options = options || {};
				if(options.syncFromServer !== true){
					for (var hasMany in this.config.hasMany) {
						if (this.config.hasMany[hasMany]["cascadeDelete"] !== true && this.xPrevious(hasMany).length > 0) {
							error = {
								msg : "包含有相关联的子数据，删除失败"
							};
							break;
						} else {
							cascadeDeletions.push(hasMany)
						}
					}
				}
				if (!error) {
					options = options || {};
					options.wait = true;
					
					var outerTransaction = options.dbTrans;
					if(!outerTransaction){
						options.dbTrans = Alloy.Globals.DataStore.createTransaction();
						options.dbTrans.begin();
					}
					
					function delSuccess() {
						this.off("destroy", delSuccess);
						this.off("error", delFail);
						if (xFinishCallback) {
							xFinishCallback();
						}
					}

					function delFail(model, err) {
						error = err;
						this.off("destroy", delSuccess);
						this.off("error", delFail);
						if (xFinishCallback) {
							xFinishCallback(error.__summary);
						}
					}
					
					for(var i = 0; i < cascadeDeletions.length; i++){
						var hasMany = this.xPrevious(cascadeDeletions[i]).toArray();
						for(var j = 0; j < hasMany.length; j++){
							var item = hasMany[j];
							item.xDelete(function(err){
								if(err){
									error = err; 
									options.dbTrans.rollback();
									if(xFinishCallback){
										xFinishCallback(error);
									}
								}
							}, options);
							if(error){
								return;
							}
						}
					}
					
					if(!outerTransaction && options.dbTrans.xCommitCount === 0){
						// options.dbTrans.commit();
						options.commit = true;
					}	
					this.on("destroy", delSuccess);
					this.on("error", delFail);
					this.destroy(options);
					
				} else if (xFinishCallback) {
					xFinishCallback(error);
				}
				return !error;
			},
			xFindInDb : function(filter) {
				var table = this.config.adapter.collection_name, query = "SELECT main.* FROM " + table + " main WHERE ", filterStr = "";
				if ( typeof filter === "string") {
					filterStr = filter;
				} else {
					if (filter.id) {
						var record = Alloy.Collections[table].get(this.xGet("id"));
						if (record) {
							return record;
						}
					}
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

				var record = Alloy.Collections[table].get(this.xGet("id"));
				if (record) {
					return record;
				}
				return this;
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
				attributes.__dataType = this.config.adapter.collection_name;
				return attributes;
			},
			canEdit : function() {
				if (this.isNew()) {
					return true;
				} else if (this.xGet("project")) {
					if (this.xGet("project").xGet("ownerUser") !== Alloy.Models.User) {
						var type = this.config.adapter.collection_name;
						var projectShareAuthorization = this.xGet("project").xGet("projectShareAuthorizations").at(0);
						if (this.xGet("ownerUser") === Alloy.Models.User && projectShareAuthorization.xGet("projectShare" + type + "Edit")) {
							return true;
						} else {
							return false;
						}
					}
				}
				return this.xGet("ownerUser") === Alloy.Models.User;
			},
			canDelete : function() {
				if (this.xGet("project")) {
					if (this.xGet("project").xGet("ownerUser") === Alloy.Models.User) {
						return true;
					} else {
						var type = this.config.adapter.collection_name;
						var projectShareAuthorization = this.xGet("project").xGet("projectShareAuthorizations").at(0);
						if (this.xGet("ownerUser") === Alloy.Models.User && (!projectShareAuthorization || projectShareAuthorization.xGet("projectShare" + type + "Delete"))) {
							return true;
						} else {
							return false;
						}
					}
				} else {
					return this.xGet("project").xGet("ownerUser") === Alloy.Models.User;
				}
			},
			_syncAddNew : function(record, dbTrans) {
				this.xSet(record);
				delete this.id;
				this._syncUpdate(null, dbTrans);
				console.info("_syncAddNew : " + record.id);
			},
			syncAddNew : function(record, dbTrans) {
			},
			_syncUpdate : function(record, dbTrans) {
				//delete record.id;
				this.save(record, {
					dbTrans : dbTrans,
					syncFromServer : true,
					patch : true
				});
			},
			syncUpdate : function(record, dbTrans) {
			},
			_syncDelete : function(record, dbTrans, xFinishedCallback) {
				this.xDelete ? this.xDelete(xFinishedCallback, {
					dbTrans : dbTrans,
					syncFromServer : true
				}) : this._xDelete(xFinishedCallback, {
					dbTrans : dbTrans,
					syncFromServer : true
				});
			},
			syncDelete : function(record, dbTrans, xFinishedCallback) {
			},
			syncUpdateConflict : function(record, dbTrans) {
				// 如果该记录同時已被本地修改过，那我们比较两条记录在客户端的更新时间，取后更新的那一条
				if(this.xGet("lastClientUpdateTime") < record.lastClientUpdateTime){
					delete record.id;
					this._syncUpdate(record, dbTrans);
					
					var sql = "DELETE FROM ClientSyncTable WHERE recordId = ?";
					dbTrans.db.execute(sql, [this.xGet("id")]);
				}
				// 让本地修改覆盖服务器上的记录
			}
		}
	}());
