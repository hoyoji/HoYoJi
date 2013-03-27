( function() {
		exports.XCollection = {
			__filterCollection : null,
			__filter : null,
			initialize : function(options) {
				options = options || {};
				if(options.filterCollection){
					this.__filterCollection = options.filterCollection;
				}
				
				if(options.filter){
					this.xSetFilter(options.filter);
				}
			},
			xCreateFilter : function(filter) {
				var c = Alloy.createCollection(this.config.adapter.collection_name);
				c.__filterCollection = this;
				c.xSetFilter(filter);
				return c;
			},
			xFetch : function(options){
				options = options || {};
				//options.add = true;
				//options.update = true;
				//options.remove = false;
				
				var self = this;
				if(this.__filterCollections){
					this.__filterCollections.xFetch(options);	
				} else {
					console.info("xFetch " + options.query);
					var c = Alloy.createCollection(this.config.adapter.collection_name);
					// self.map(function(m){
						// console.info("xFetch before merged : " + m.get("id"));
					// });
					
					c.fetch(options);
					c.map(function(m){
						console.info("xFetch " + m.get("id"));
						self.add(m);
					});
					//self.add(c);
					// self.map(function(m){
						// console.info("xFetch after merged : " + m.get("id"));
					// });
					
					//this.fetch(options);
				}
				return this;
			},
			xSetFilter : function(filter){
				var self = this;
				
				if(!this.__filterCollection){
					this.__filterCollection = Alloy.Collections[this.config.adapter.collection_name];
				}
				
				this.__filter = filter;
				console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.length);
				console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length - " + this.__filterCollection.length);
				self.map(function(m){
					console.info(" --------- " + m.get("id"));
				});
				this.__filterCollection.map(function(model){
					if(self.__compareFilter(model)){
						self.add(model);
						console.info("__filter match, adding model to collection ");
					} else {
						self.remove(model);
					}
				});
				console.info(this.__filterCollection.config.adapter.collection_name + " xSetFilter collection length " + self.models.length);
				
				var addModel = function(model) {
					if (self.__compareFilter(model)) {
						console.info("XCollection pick up model from store : " + self.config.adapter.collection_name);
						self.add(model);
					}
				};
				var changeModel = function(model) {
					if (self.__compareFilter(model)) {
						console.info("XCollection pick up model from store : " + self.config.adapter.collection_name);
						self.add(model);
					} else {
						console.info("XCollection remove model from store : " + self.config.adapter.collection_name);
						self.remove(model);
					}
				};
				var removeModel = function(model) {
					if (!self.__compareFilter(model)) {
						console.info("XCollection pick up model from store : " +  self.config.adapter.collection_name);
						self.remove(model);
					}
				};

				this.__filterCollection.on("add", addModel);
				this.__filterCollection.on("remove", removeModel);
				this.__filterCollection.on("sync", changeModel);
				
				// this.on("destroy", function(){
					// self.__filterCollection.off("add", addModel);
					// self.__filterCollection.off("remove", removeModel);
					// self.__filterCollection.off("change", changeModel);
				// });
				return this;
			},
			__compareFilter : function(model){
				for(var f in this.__filter){
					var modelValue = model.xGet(f),
						filterValue = this.__filter[f];
					
					if(model.config.belongsTo[f]){
						if(modelValue){
							modelValue = model.get(f+"Id");
						}
						if(filterValue && filterValue.xGet){
							filterValue = filterValue.get("id");
						}
					} else {
						if(model.hasChanged(f)){
							modelValue = model.previous(f);
						}
					}
					
		 			console.info(model.hasChanged(f) + " __compareFilter " + f + " :: " + modelValue + " " + filterValue);
					if(filterValue === "NOT NULL"){
						return modelValue !== null;
					} else if(modelValue !== filterValue){
						return false;
					}
				}
				return true;
			},
			xSearchInDb : function(filter){
				var table = this.config.adapter.collection_name,
					query = "SELECT main.* FROM " + table + " main WHERE ",
					filterStr = "";
				
				for(var f in filter){
					var value = filter[f]
					if(filterStr){
						filterStr += " AND "
					}
					f = "main." + f;
					if(_.isNull(value)){
						filterStr += f + " IS NULL ";
					} else if(_.isNumber(value)){
						filterStr += f + " = " + value + " ";
					} else {
						filterStr += f + " = '" + value + "' ";
					}
				}
				console.info("xSearchInDb " + query + filterStr);
				this.fetch({query : query + filterStr});
				return this;
			}
		}
	}()); 