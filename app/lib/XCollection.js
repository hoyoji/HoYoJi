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
			xFetch : function(options) {
				options = options || {};
				//options.add = true;
				//options.update = true;
				//options.remove = false;

				var self = this, numberAdded = 0;
				
				this.trigger("xFetchStart");
				this.isFetching = true;
				xFetchMatchFilterAdded = [];
				if (this.__filterCollection) {
					this.__filterCollection.xFetch(options);
				} else {
					console.info("xFetch " + options.query);
					var c = Alloy.createCollection(this.config.adapter.collection_name);
					// self.map(function(m){
					// console.info("xFetch before merged : " + m.xGet("id"));
					// });

					c.fetch(options);
					if(this !== Alloy.Collections[this.config.adapter.collection_name]){
						c.forEach(function(m) {
							// console.info("xFetch " + m.xGet("id"));
							if(!self.get(model)){
								var model = Alloy.Collections[self.config.adapter.collection_name].get(m.xGet("id"));
								xFetchMatchFilterAdded.push(model);
								self.add(model);
							}
						});
					}
					//self.add(c);
					// self.map(function(m){
					// console.info("xFetch after merged : " + m.xGet("id"));
					// });

					//this.fetch(options);
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
					// console.info(this.cid + " XCollection pick up model from store : " + this.config.adapter.collection_name);
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
					// console.info(this.cid + " XCollection pick up model from store : " + this.config.adapter.collection_name);
					this.add(model);
				} else {
					// console.info(this.cid + " XCollection remove model from store : " + this.config.adapter.collection_name);
					this.remove(model);
				}
			},
			__removeModel : function(model, collection, options) {
				var ret = this.__compareFilter(model, options);
				if (ret !== null && !ret) {
					// console.info(this.cid + " XCollection remove model from store : " + this.config.adapter.collection_name);
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
				// console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.length);
				// console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length - " + this.__filterCollection.length);
				// self.map(function(m) {
					// console.info(" --------- " + m.xGet("id"));
				// });
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
						// console.info("__filter match, adding model to collection ");
					} else {
						if(self.get(model)){
							filterRemoved.push(model);
							self.remove(model);
						}
					}
				});
				this.isFiltering = false;
				this.trigger("xSetFilterEnd", this, filterAdded, filterRemoved);
				// console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.models.length);
				

				// this.on("destroy", function(){
				// self.__filterCollection.off("add", addModel);
				// self.__filterCollection.off("remove", removeModel);
				// self.__filterCollection.off("change", changeModel);
				// });
				return this;
			},
			__compareFilter : function(model, options) {
				if (_.isFunction(this.__filter)) {
					return this.__filter(model, options);
				}
				for (var f in this.__filter) {
					var modelValue = model.xGet(f), filterValue = this.__filter[f];

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

					// console.info(model.hasChanged(f) + " __compareFilter " + f + " :: " + modelValue + " " + filterValue);
					// if (filterValue === "NOT NULL") {
						// return modelValue !== null;
					// } else 
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

				// console.info("xSearchInDb " + query + filterStr);
				var limit = sqlOptions.limit ? " LIMIT " + sqlOptions.limit + " ": "";
				var offset = sqlOptions.offset ? " OFFSET " + sqlOptions.offset + " " : "";
				var orderBy = sqlOptions.orderBy ? " ORDER BY main." + sqlOptions.orderBy + " " : "";
				if(filterStr !== ""){
					filterStr = " WHERE " + filterStr;
				} 
				this.xFetch({
					query : query + filterStr + "qjkdasfllascordsdacmkludafouewqojmklvcxuioqew1234ewrokfjl;jklJLKJlkjlkjKNJKy	JKLKAS" + orderBy +  limit + offset
				});
				return this;
			}
		};
	}());
