( function() {
		exports.XCollection = {
			__filterCollection : null,
			__filter : null,
			initialize : function(options) {
				// options = options || {};
				// if (options.filterCollection) {
					// this.__filterCollection = options.filterCollection;
				// }
// 
				// if (options.filter) {
					// this.xSetFilter(options.filter);
				// }
			},
			xSum : function(field){
				var total = 0;
				this.forEach(function(item){
					total += item.xPrevious(field);
				});
				return total;
			},
			xCreateFilter : function(filter, winController) {
				var c = Alloy.createCollection(this.config.adapter.collection_name);
				c.__filterCollection = this;
				
				c.__xSetFilterOnCollection(winController);
				
				c.xSetFilter(filter);
				return c;
			},
			__xSetFilterOnCollection : function(winController){
				var self = this;
                this.__filterCollection.on("add", this.__addModel, this);
                this.__filterCollection.on("remove", this.__removeModel, this);
                this.__filterCollection.on("sync", this.__changeModel, this);
                this.__filterCollection.on("xrefresh", this.__changeModel, this);
                if(winController){
					winController.onWindowCloseDo(function(){
						self.xClearFilter();
					});		
                }
			},
			xClearFilter : function(){
				if (this.__filterCollection) {
					this.__filterCollection.off("add", this.__addModel, this);
					this.__filterCollection.off("remove", this.__removeModel, this);
					this.__filterCollection.off("sync", this.__changeModel, this);
					this.__filterCollection.off("xrefresh", this.__changeModel, this);
				}
			},			
			xFetch : function(options, _options) {
				_options = _options || {};
				//options.add = true;
				//options.update = true;
				//options.remove = false;

				var self = this, numberAdded = 0;
				
				this.trigger("xFetchStart");
				this.isFetching = true;
				xFetchMatchFilterAdded = [];
				if (this.__filterCollection) {
					this.__filterCollection.xFetch(options, _options);
				} else {
					var c = Alloy.createCollection(this.config.adapter.collection_name);

					c.fetch(_.extend(options, _options));
					if(this !== Alloy.Collections[this.config.adapter.collection_name]){
						c.map(function(m) {
							if(!self.get(model)){
								var model = Alloy.Collections[self.config.adapter.collection_name].get(m.xGet("id"));
								xFetchMatchFilterAdded.push(model);
								self.add(model);
							}
						});
					}
				}
				this.isFetching = false;
				this.trigger("xFetchEnd", this, xFetchMatchFilterAdded);
				return this;
			},
			xFetchMatchFilterAdded : [],
			isFetching : false,
			isFiltering : false,
			__addModel : function(model, collection, options) {
				var ret = this.__compareFilter(model, options);
				if (ret !== null && ret) {
					if(!this.get(model)){
						xFetchMatchFilterAdded.push(model);
						this.add(model);
					}
				}
			},
			__changeModel : function(model, collection, options) {
				var ret = this.__compareFilter(model, options);
				if (ret === null) return;
				if (this.__compareFilter(model, options)) {
					this.add(model);
				} else {
					this.remove(model);
				}
			},
			__removeModel : function(model, collection, options) {
				var ret = this.__compareFilter(model, options);
				if (ret !== null && !ret) {
					this.remove(model);
				}
			},
			xSetFilter : function(filter, winController) {
				var self = this;

				this.__filter = filter;
				if (!this.__filterCollection) {
					this.__filterCollection = Alloy.Collections[this.config.adapter.collection_name];
					this.__xSetFilterOnCollection(winController);
				}
				var filterAdded = [], filterRemoved = [];
				this.trigger("xSetFilterStart");
				this.isFiltering = true;
				this.__filterCollection.forEach(function(model) {
					var ret = self.__compareFilter(model);
					if(ret === null) return;
					if (ret) {
						if(!self.get(model)){
							self.add(model);
							filterAdded.push(model);
						}
					} else {
						if(self.get(model)){
							filterRemoved.push(model);
							self.remove(model);
						}
					}
				});
				this.isFiltering = false;
				this.trigger("xSetFilterEnd", this, filterAdded, filterRemoved);
				
				return this;
			},
			__compareFilter : function(model, options) {
				if (_.isFunction(this.__filter)) {
					return this.__filter(model, options);
				}
				for (var f in this.__filter) {
					var modelValue = model.xGet(f, options), filterValue = this.__filter[f];

					if (model.config.belongsTo[f]) {
						if (modelValue) {
							modelValue = model.xGet(f + "Id");
						}
						if (filterValue && filterValue.xGet) {
							filterValue = filterValue.xGet("id");
						}
					} else {
						if (model.hasChanged(f)) {
							modelValue = model.previous(f);
						}
					}

					if (modelValue !== filterValue) {
						return false;
					}
				}
				return true;
			},
			xSearchInDb : function(filter, sqlOptions) {
				var table = this.config.adapter.collection_name, query = "SELECT main.* FROM " + table + " main ", filterStr = "", sqlOptions = sqlOptions || {};
				if (_.isArray(filter)) {
					filterStr = "main.id IN ('" + filter.join("','") + "')";
				} else if(typeof filter === "string"){
					filterStr = filter;
				} 
				else {
					for (var f in filter) {
						var value = filter[f];
						if (filterStr) {
							filterStr += " AND ";
						}
						f = "main." + f;
						if (_.isNull(value) || value === undefined) {
							filterStr += f + " IS NULL ";
						} else if (_.isNumber(value)) {
							filterStr += f + " = " + value + " ";
						} else {
							filterStr += f + " = '" + value + "' ";
						}
					}
				}

				var limit = sqlOptions.limit ? " LIMIT " + sqlOptions.limit + " ": "";
				var offset = sqlOptions.offset ? " OFFSET " + sqlOptions.offset + " " : "";
				var orderBy = sqlOptions.orderBy ? " ORDER BY main." + sqlOptions.orderBy + " " : "";
				if(filterStr !== ""){
					filterStr = " WHERE " + filterStr;
				} 
				this.xFetch({
					query : query + filterStr + "qjkdasfllascordsdacmkludafouewqojmklvcxuioqew1234ewrokfjl;jklJLKJlkjlkjKNJKy	JKLKAS" + orderBy +  limit + offset
				}, sqlOptions);
				return this;
			}
		};
	}());
