(function() {
    exports.XCollection = {
        __filterCollection: null,
        __filter: null,
        initialize: function(options) {
            options = options || {};
            options.filterCollection && (this.__filterCollection = options.filterCollection);
            options.filter && this.xSetFilter(options.filter);
        },
        xCreateFilter: function(filter) {
            var c = Alloy.createCollection(this.config.adapter.collection_name);
            c.__filterCollection = this;
            c.xSetFilter(filter);
            return c;
        },
        xFetch: function(options) {
            options = options || {};
            var self = this;
            if (this.__filterCollections) this.__filterCollections.xFetch(options); else {
                console.info("xFetch " + options.query);
                var c = Alloy.createCollection(this.config.adapter.collection_name);
                c.fetch(options);
                c.map(function(m) {
                    console.info("xFetch " + m.get("id"));
                    self.add(m);
                });
            }
            return this;
        },
        xSetFilter: function(filter) {
            var self = this;
            this.__filterCollection || (this.__filterCollection = Alloy.Collections[this.config.adapter.collection_name]);
            this.__filter = filter;
            console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.length);
            console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length - " + this.__filterCollection.length);
            self.map(function(m) {
                console.info(" --------- " + m.get("id"));
            });
            this.__filterCollection.map(function(model) {
                if (self.__compareFilter(model)) {
                    self.add(model);
                    console.info("__filter match, adding model to collection ");
                } else self.remove(model);
            });
            console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.models.length);
            var addModel = function(model) {
                if (self.__compareFilter(model)) {
                    console.info("XCollection pick up model from store : " + self.config.adapter.collection_name);
                    self.add(model);
                }
            }, changeModel = function(model) {
                if (self.__compareFilter(model)) {
                    console.info("XCollection pick up model from store : " + self.config.adapter.collection_name);
                    self.add(model);
                } else {
                    console.info("XCollection remove model from store : " + self.config.adapter.collection_name);
                    self.remove(model);
                }
            }, removeModel = function(model) {
                if (!self.__compareFilter(model)) {
                    console.info("XCollection pick up model from store : " + self.config.adapter.collection_name);
                    self.remove(model);
                }
            };
            this.__filterCollection.on("add", addModel);
            this.__filterCollection.on("remove", removeModel);
            this.__filterCollection.on("change", changeModel);
            return this;
        },
        __compareFilter: function(model) {
            for (var f in this.__filter) {
                var modelValue = model.xGet(f), filterValue = this.__filter[f];
                if (model.config.belongsTo[f]) {
                    modelValue && (modelValue = model.get(f + "Id"));
                    filterValue && (filterValue = filterValue.get("id"));
                } else model.hasChanged(f) && (modelValue = model.previous(f));
                console.info(model.hasChanged(f) + " __compareFilter " + f + " :: " + modelValue + " " + filterValue);
                if (modelValue !== filterValue) return !1;
            }
            return !0;
        },
        xSearchInDb: function(filter) {
            var table = this.config.adapter.collection_name, query = "SELECT * FROM " + table + " WHERE ", filterStr = "";
            for (var f in filter) {
                var value = filter[f];
                filterStr && (filterStr += " AND ");
                _.isNull(value) ? filterStr += f + " IS NULL " : _.isNumber(value) ? filterStr += f + " = " + value + " " : filterStr += f + " = '" + value + "' ";
            }
            console.info("xSearchInDb " + query + filterStr);
            this.fetch({
                query: query + filterStr
            });
            return this;
        }
    };
})();