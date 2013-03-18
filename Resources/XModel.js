(function() {
    guid = function() {
        function S4() {
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
        }
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };
    exports.XModel = {
        __xValidateCount: 0,
        initialize: function() {
            if (this.isNew()) {
                this.attributes.id = guid();
                this.once("sync fetch", this.__initializeExistingModel.bind(this));
            } else this.__initializeExistingModel();
            var self = this;
            this.on("error", function() {
                for (var belongsTo in self.config.belongsTo) {
                    var attr = belongsTo + "Id";
                    self.hasChanged(attr) && self.set(attr, self.previous(attr), {
                        silent: !0
                    });
                }
            });
        },
        __initializeExistingModel: function() {
            var storeCollection = Alloy.Collections[this.config.adapter.collection_name];
            console.info("putting new model into its store collection 2 " + storeCollection.config.adapter.collection_name);
            if (this.collection !== storeCollection) {
                storeCollection.add(this);
                this.collection = storeCollection;
            }
            for (var key in this.config.hasMany) this.set(key, null, {
                silent: !0
            });
        },
        xSave: function(options) {
            var self = this;
            options = _.extend({}, options, {
                wait: !0
            });
            if (this.__xValidateCount) throw Error("Model is still pending for xValidation to be completed! Can not call xSave again!!");
            this.__xValidationError = {};
            this.__xValidationErrorCount = 0;
            self.xGet("ownerUser") || self.xSet("ownerUser", Alloy.Models.User);
            this.xValidate(function() {
                if (self.__xValidationErrorCount > 0) {
                    console.info("xValidation done with errors " + self.__xValidationErrorCount);
                    self.trigger("error", self, self.__xValidationError, options);
                } else {
                    for (var belongsTo in self.config.belongsTo) {
                        var belongsToModel = self.get(belongsTo);
                        belongsToModel && (self.isNew() || self.hasChanged(belongsTo)) && self.set(belongsTo + "Id", belongsToModel.get("id"), {
                            silent: !0
                        });
                    }
                    self.save(null, options);
                    self.__xValidationError = {};
                    self.__xValidationErrorCount = 0;
                }
            });
            return this;
        },
        xValidateAttribute: function(key, xCallback) {
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
                    self.__xValidateCount === 0 && xCallback();
                });
            }, 1);
        },
        xValidate: function(xFinishCallback) {
            var self = this;
            for (var column in this.config.columns) {
                if (column === "id") continue;
                var field = this.config.columns[column], fieldValue = this.xGet(column);
                typeof fieldValue == "string" && (fieldValue = Alloy.Globals.alloyString.trim(fieldValue));
                console.info("validating column : " + column + "  " + this.xGet(column));
                if (field.contains("NOT NULL")) if (this.config.belongsTo && this.config.belongsTo[column.slice(0, -2)]) {
                    if (!this.xGet(column.slice(0, -2))) {
                        this.__xValidationErrorCount++;
                        this.__xValidationError[column] = {
                            msg: "不能为空"
                        };
                        continue;
                    }
                } else if (!fieldValue) {
                    this.__xValidationErrorCount++;
                    this.__xValidationError[column] = {
                        msg: "不能为空"
                    };
                    continue;
                }
                if (field.contains("REAL") && fieldValue && _.isNaN(Number(fieldValue))) {
                    this.__xValidationErrorCount++;
                    this.__xValidationError[column] = {
                        msg: "请输入数字"
                    };
                    continue;
                }
                if (field.contains("INTEGER") && fieldValue) if (_.isNaN(Number(fieldValue)) || fieldValue.contains(".")) {
                    this.__xValidationErrorCount++;
                    this.__xValidationError[column] = {
                        msg: "请输入整数 "
                    };
                    continue;
                }
                if (field.contains("UNIQUE")) {
                    var filter = {};
                    filter[column] = fieldValue;
                    if (Alloy.createCollection(this.config.adapter.collection_name).xSearchInDb(filter).length > 0) {
                        console.info("Check UNIQUE : NO!!");
                        this.__xValidationErrorCount++;
                        this.__xValidationError[column] = {
                            msg: "该名称已存在"
                        };
                        continue;
                    }
                    console.info("Check UNIQUE : YES!!");
                }
            }
            for (var belongsTo in this.config.belongsTo) {
                if (this.config.belongsTo[belongsTo].type !== this.config.adapter.collection_name) continue;
                var error, reverseKey = self.config.belongsTo[belongsTo].attribute;
                self.has(belongsTo) && self.xGet(belongsTo) === self ? error = {
                    msg: "不能选择自己作为上级"
                } : self.has(belongsTo) && self.xGetDescendents(reverseKey).where({
                    id: self.xGet(belongsTo).xGet("id")
                }).length && (error = {
                    msg: "不能选择下级项目"
                });
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
            count === 0 && xFinishCallback();
            return this;
        },
        xAddToSave: function(saveableController) {
            saveableController.addToSave(this);
            return this;
        },
        xSet: function(a, b, c) {
            var d;
            _.isObject(a) || null == a ? (d = a, c = b) : (d = {}, d[a] = b);
            c || (c = {});
            c.silent = !0;
            this.set(d, c);
            return this;
        },
        xGet: function(attr) {
            if (this.get(attr)) return this.get(attr);
            if (this.config.hasMany && this.config.hasMany[attr]) {
                var type = this.config.hasMany[attr].type, key = this.config.hasMany[attr].attribute, collection = Alloy.createCollection(type);
                if (this.isNew()) return collection;
                console.info("xGet hasMany : " + type + collection.length);
                var idString;
                this.get("id") ? idString = " = '" + this.get("id") + "' " : idString = " IS NULL ";
                collection.xFetch({
                    query: "SELECT * FROM " + type + " WHERE " + key + "Id " + idString
                });
                console.info("xGet hasMany : " + key + collection.length);
                var filter = {};
                filter[key] = this;
                collection.xSetFilter(filter);
                this.set(attr, collection, {
                    silent: !0
                });
                return collection;
            }
            if (this.config.belongsTo && this.config.belongsTo[attr]) {
                var table = this.config.belongsTo[attr].type, fKey = attr + "Id", fId = this.get(fKey);
                if (!fId) return null;
                var m = Alloy.Collections[table].get(fId);
                if (!m) {
                    var idString = " = '" + fId + "' ";
                    m = Alloy.createModel(table).fetch({
                        query: "SELECT * FROM " + table + " WHERE id " + idString
                    });
                }
                this.set(attr, m, {
                    silent: !0
                });
                return m;
            }
            return null;
        },
        xGetDescendents: function(attribute) {
            function getDescendents(parents) {
                if (!parents) return;
                for (var i = 0; i < parents.length; i++) {
                    descendents.push(parents.at(i));
                    getDescendents(parents.at(i).xGet(attribute));
                }
            }
            var descendents = Alloy.createCollection(this.config.adapter.collection_name);
            getDescendents(this.xGet(attribute));
            return descendents;
        },
        xGetAncestors: function(attribute) {
            function getAncestors(descendent) {
                if (!descendent) return;
                ancestors.push(descendent);
                getAncestors(descendent.xGet(attribute));
            }
            var ancestors = Alloy.createCollection(this.config.adapter.collection_name);
            getAncestors(this.xGet(attribute));
            return ancestors;
        },
        _xDelete: function(xFinishCallback) {
            var error;
            for (var hasMany in this.config.hasMany) if (this.xGet(hasMany).length > 0) {
                error = {
                    msg: "包含有相关联的子数据，删除失败"
                };
                break;
            }
            error || this.destroy();
            xFinishCallback(error);
            return this;
        },
        xFindInDb: function(filter) {
            var table = this.config.adapter.collection_name, query = "SELECT * FROM " + table + " WHERE ", filterStr = "";
            for (var f in filter) {
                var value = filter[f];
                filterStr && (filterStr += " AND ");
                _.isNull(value) ? filterStr += f + " IS NULL " : _.isNumber(value) ? filterStr += f + " = " + value + " " : filterStr += f + " = '" + value + "' ";
            }
            this.fetch({
                query: query + filterStr
            });
            return this;
        }
    };
})();