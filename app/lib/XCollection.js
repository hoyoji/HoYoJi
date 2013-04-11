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
			xCreateFilter : function(filter) {
				var c = Alloy.createCollection(this.config.adapter.collection_name);
				c.__filterCollection = this;

                c.__filterCollection.on("add", this.__addModel.bind(c));
                c.__filterCollection.on("remove", this.__removeModel.bind(c));
                c.__filterCollection.on("sync", this.__changeModel.bind(c));
            				
				c.xSetFilter(filter);
				return c;
			},
			xFetch : function(options) {
				options = options || {};
				//options.add = true;
				//options.update = true;
				//options.remove = false;

				var self = this;
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
						c.map(function(m) {
							console.info("xFetch " + m.xGet("id"));
							self.add(m);
						});
					}
					//self.add(c);
					// self.map(function(m){
					// console.info("xFetch after merged : " + m.xGet("id"));
					// });

					//this.fetch(options);
				}
				return this;
			},
			__addModel : function(model) {
				if (this.__compareFilter(model)) {
					console.info("XCollection pick up model from store : " + this.config.adapter.collection_name);
					this.add(model);
				}
			},
			__changeModel : function(model) {
				if (this.__compareFilter(model)) {
					console.info("XCollection pick up model from store : " + this.config.adapter.collection_name);
					this.add(model);
				} else {
					console.info("XCollection remove model from store : " + this.config.adapter.collection_name);
					this.remove(model);
				}
			},
			__removeModel : function(model) {
				if (!this.__compareFilter(model)) {
					console.info("XCollection remove model from store : " + this.config.adapter.collection_name);
					this.remove(model);
				}
			},
			xSetFilter : function(filter) {
				var self = this;

				this.__filter = filter;
				if (!this.__filterCollection) {
					this.__filterCollection = Alloy.Collections[this.config.adapter.collection_name];
					this.__filterCollection.on("add", this.__addModel.bind(this));
					this.__filterCollection.on("remove", this.__removeModel.bind(this));
					this.__filterCollection.on("sync", this.__changeModel.bind(this));
				}
				console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.length);
				// console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length - " + this.__filterCollection.length);
				// self.map(function(m) {
					// console.info(" --------- " + m.xGet("id"));
				// });
				this.__filterCollection.map(function(model) {
					if (self.__compareFilter(model)) {
						self.add(model);
						console.info("__filter match, adding model to collection ");
					} else {
						self.remove(model);
					}
				});
				console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.models.length);
				

				// this.on("destroy", function(){
				// self.__filterCollection.off("add", addModel);
				// self.__filterCollection.off("remove", removeModel);
				// self.__filterCollection.off("change", changeModel);
				// });
				return this;
			},
			__compareFilter : function(model) {
				if (_.isFunction(this.__filter)) {
					return this.__filter(model);
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

					console.info(model.hasChanged(f) + " __compareFilter " + f + " :: " + modelValue + " " + filterValue);
					// if (filterValue === "NOT NULL") {
						// return modelValue !== null;
					// } else 
					if (modelValue !== filterValue) {
						return false;
					}
				}
				return true;
			},
			xSearchInDb : function(filter) {
				var table = this.config.adapter.collection_name, query = "SELECT main.* FROM " + table + " main WHERE ", filterStr = "";
				if (_.isArray(filter)) {
					filterStr = "main.id IN ('" + filter.join("','") + "')";
				} else if(typeof filter === "string"){
					filterStr = filter;
				} 
				else {
					for (var f in filter) {
						var value = filter[f]
						if (filterStr) {
							filterStr += " AND "
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

				console.info("xSearchInDb " + query + filterStr);
				this.xFetch({
					query : query + filterStr
				});
				return this;
			}
		}
	}());
