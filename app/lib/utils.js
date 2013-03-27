( function() {
		exports.Utils = {};
		exports.Utils.alloyAnimation = require('alloy/animation');
		exports.Utils.alloyString = require('alloy/string');

		exports.Utils.alert = function(message) {
			alert(message);
		}

		exports.Utils.confirm = function(title, msg, confirmCB, cancelCB) {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['确认', '取消'],
				message : msg,
				title : title
			});

			dialog.addEventListener('click', function(e) {
				if (e.index !== e.source.cancel) {
					confirmCB();
				} else if (cancelCB) {
					cancelCB();
				}
			});

			dialog.show();
		}
		// exports.defaultModelTransformFunction = function(model) {
		// var transform = model.toJSON();
		// transform.$model = model;
		// return transform;
		// }

		exports.Utils.openWindow = function(windowName, options) {
			if(!Alloy.Globals.openingWindow[windowName]){
				Alloy.Globals.openingWindow[windowName] = true;
				var win = Alloy.createController("window");
				win.openWin(windowName, options);
			}
		}

		exports.Utils.patchScrollableViewOnAndroid = function(scView) {
			if (OS_ANDROID) {
				scView.getViews().map(function(view) {
					view.addEventListener("longpress", function(e) {
						if (!e.firstScrollableView) {
							e.firstScrollableView = scView;
							scView.setScrollingEnabled(false);
						}
						scView.fireEvent("longpress", e);
					});
					view.addEventListener("becamedirty", function(e) {
						scView.fireEvent("becamedirty", e);
					});
					view.addEventListener("becameclean", function(e) {
						scView.fireEvent("becameclean", e);
					});
					view.addEventListener("closewin", function(e) {
						scView.fireEvent("closewin", e);
					});
					view.addEventListener("opencontextmenu", function(e) {
						if (!e.firstScrollableView) {
							e.firstScrollableView = scView;
							scView.setScrollingEnabled(false);
						}
						scView.fireEvent("opencontextmenu", e);
					});
					view.addEventListener("save", function(e) {
						scView.fireEvent("save", e);
					});
					view.addEventListener("registerwindowevent", function(e) {
						scView.fireEvent("registerwindowevent", e);
					});
					view.addEventListener("registersaveablecallback", function(e) {
						scView.fireEvent("registersaveablecallback", e);
					});
					view.addEventListener("registerdirtycallback", function(e) {
						scView.fireEvent("registerdirtycallback", e);
					});
					view.addEventListener("textfieldfocused", function(e) {
						scView.fireEvent("textfieldfocused", e);
					});
				})
			}
		}

		String.prototype.contains = function(it) {
			return this.indexOf(it) != -1;
		};

		String.prototype.startsWith = function(str) {
			return this.substr(0, str.length) === str;
		};

		String.prototype.endsWith = function(str) {
			var thisLen = this.length;
			var strLen = str.length;
			if (thisLen >= strLen) {
				var start = thisLen - strLen;
				return this.slice(start) === str;
			}
			return false;
		};

    Number.prototype.toFixed2 = function(){
        return this.toFixed(2);
    }
    
    Number.prototype.toUserCurrency = function(){
        if(this){
            return this.toFixed2();
        }
        return this;
    }
    
	// IOS doesn't support bind
		if (!Function.prototype.bind) {
			Function.prototype.bind = function(obj) {
				if ( typeof this !== 'function')
					throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")

				var slice = Array.prototype.slice, args = slice.call(arguments, 1), self = this, nop = function() {
				}, bound = function() {
					if (nop.prototype && this instanceof nop) {
						var result = self.apply(new nop, args.concat(slice.call(arguments)))
						return (Object(result) === result) ? result : self
					} else {
						return self.apply(obj, args.concat(slice.call(arguments)))
					};
				};

				nop.prototype = self.prototype;
				bound.prototype = new nop();
				return bound;
			};
		}

		// Current version of Alloy Backbone does not support event once
		if (!Backbone.Model.prototype.once) {
			var eventSplitter = /\s+/;
			var eventsApi = function(obj, action, name, rest) {
				if (!name)
					return true;
				if ( typeof name === 'object') {
					for (var key in name) {
						obj[action].apply(obj, [key, name[key]].concat(rest));
					}
				} else if (eventSplitter.test(name)) {
					var names = name.split(eventSplitter);
					for (var i = 0, l = names.length; i < l; i++) {
						obj[action].apply(obj, [names[i]].concat(rest));
					}
				} else {
					return true;
				}
			};
			_.extend(Backbone.Model.prototype, {
				once : function(name, callback, context) {
					if (!(eventsApi(this, 'once', name, [callback, context]) && callback))
						return this;
					var self = this;
					var once = _.once(function() {
						self.off(name, once);
						callback.apply(this, arguments);
					});
					once._callback = callback;
					this.on(name, once, context);
					return this;
				}
			});


			// var splice = Array.prototype.splice;
// 
			// _.extend(Backbone.Collection.prototype, {
				// add : function(models, options) {
					// var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
					// options || ( options = {});
					// models = _.isArray(models) ? models.slice() : [models];
					// for ( i = 0, length = models.length; i < length; i++) {
// 
						// if (!( model = models[i] = this._prepareModel(models[i], options))) {
							// throw new Error("Can't add an invalid model to a collection");
						// }
// 
						// cid = model.cid;
						// id = model.id;
// 
						// console.log("adding models check dups " + id);
// 
						// if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
							// dups.push(i);
							// continue;
						// }
						// cids[cid] = ids[id] = model;
					// }
// 
					// console.log("adding models dups " + dups.length);
// 
					// i = dups.length;
					// while (i--) {
						// models.splice(dups[i], 1);
					// }
// 
					// console.log("adding models " + models.length);
// 
					// for ( i = 0, length = models.length; i < length; i++) {
						// ( model = models[i]).on('all', this._onModelEvent, this);
						// this._byCid[model.cid] = model;
						// if (model.id != null)
							// this._byId[model.id] = model;
					// }
					// this.length += length;
					// index = options.at != null ? options.at : this.models.length;
					// splice.apply(this.models, [index, 0].concat(models));
					// if (this.comparator)
						// this.sort({
							// silent : true
						// });
					// if (options.silent)
						// return this;
					// for ( i = 0, length = this.models.length; i < length; i++) {
						// if (!cids[( model = this.models[i]).cid])
							// continue;
						// options.index = i;
						// model.trigger('add', model, this, options);
					// }
					// return this;
				// }
			// }); 

		}
	}());
