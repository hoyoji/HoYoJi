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
			if (!Alloy.Globals.openingWindow[windowName]) {
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
					view.addEventListener("touchstart", function(e) {
						scView.fireEvent("touchstart", e);
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

		Number.prototype.toFixed2 = function() {
			return this.toFixed(2);
		}

		Number.prototype.toUserCurrency = function() {
			if (this) {
				return this.toFixed2();
			}
			return this;
		}
		Date.prototype.getUTCTimeOfDate = function() {
			return Date.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds());
		}

		Date.prototype.getUTCTimeOfDateStart = function() {
			return (new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0));
			// + hyj.timeZoneOffset;
		}

		Date.prototype.getUTCTimeOfDateEnd = function() {
			return (new Date(this.getFullYear(), this.getMonth(), this.getDate(), 24, 0, 0));
			// + hyj.timeZoneOffset;
		}

		Date.prototype.getUTCTimeOfWeekStart = function() {
			var first = this.getDate() - this.getDay();
			// First day is the day of the month - the day of the week
			var firstday = new Date(this.setDate(first));
			return (new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate(), 0, 0, 0));
			// + hyj.timeZoneOffset;
		}

		Date.prototype.getUTCTimeOfWeekEnd = function() {
			var first = this.getDate() - this.getDay();
			// First day is the day of the month - the day of the week
			var last = first + 6;
			// last day is the first day + 6
			var lastday = new Date(this.setDate(last));
			return (new Date(lastday.getFullYear(), lastday.getMonth(), lastday.getDate(), 24, 0, 0));
			// + hyj.timeZoneOffset;
		}

		Date.prototype.getUTCTimeOfMonthStart = function() {
			return (new Date(this.getFullYear(), this.getMonth(), 1, 0, 0, 0));
			// + hyj.timeZoneOffset;
		}

		Date.prototype.getUTCTimeOfMonthEnd = function() {
			return (new Date(this.getFullYear(), this.getMonth() + 1, 0, 24, 0, 0));
			// + hyj.timeZoneOffset;
		}
		Date.prototype.toUserDateString = function() {
			//return (new Date(this.getTime()-hyj.timeZoneOffset)).toISOString().replace(/(.+)T.+/i,"$1");
			//return this.toISOString().replace(/(.+)T.+/i,"$1");

			return this.getFullYear() + "-" + (this.getMonth() + 1).make2Digits() + "-" + this.getDate().make2Digits();
		}

		Date.prototype.toUserShortTimeString = function() {
			//return (new Date(this.getTime()-hyj.timeZoneOffset)).toISOString().replace(/.+T(.+)\..+$/i,"$1");
			//   return this.toISOString().replace(/.+T(.+)\..+$/i,"$1");

			return this.getHours().make2Digits() + ":" + this.getMinutes().make2Digits();
		}

		Date.prototype.toUserDateTimeString = function() {
			//return (new Date(this.getTime()-hyj.timeZoneOffset)).toISOString().replace(/(.+)T(.+)\..+$/i,"$1 $2");
			//return this.toISOString().replace(/(.+)T(.+)\..+$/i,"$1 $2");

			return this.getFullYear() + "-" + (this.getMonth() + 1).make2Digits() + "-" + this.getDate().make2Digits() + " " + this.getHours().make2Digits() + ":" + this.getMinutes().make2Digits() + ":" + this.getSeconds().make2Digits();
		}

		Date.prototype.toUserDateShortTimeString = function() {
			//return this.toISODateShortTimeString();
			return this.getFullYear() + "-" + (this.getMonth() + 1).make2Digits() + "-" + this.getDate().make2Digits() + " " + this.getHours().make2Digits() + ":" + this.getMinutes().make2Digits();
		}
		sqlOR = function() {
			var str = "(" + arguments[0];
			for (var i = 1; i < arguments.length; i++) {
				str += " OR " + arguments[i];
			}
			return str + ")";
		}
		sqlAND = function() {
			var str = "(" + arguments[0];
			for (var i = 1; i < arguments.length; i++) {
				str += " AND " + arguments[i];
			}
			return str + ")";
		}

		String.prototype.sqlNE = function(value) {
			if (value === null || value === undefined) {
				return this + " IS NOT NULL";
			} else if (_.isNumber(value)) {
				return this + " <> " + value;
			}
			return this + " <> '" + value + "'";
		}
		String.prototype.sqlEQ = function(value) {
			if (value === null || value === undefined) {
				return this + " IS NULL";
			} else if (_.isNumber(value)) {
				return this + " = " + value;
			}
			return this + " = '" + value + "'";
		}
		String.prototype.sqlLT = function(value) {
			if (_.isNumber(value)) {
				return this + " < " + value;
			}
			return this + " < '" + value + "'";
		}
		String.prototype.sqlLE = function(value) {
			if (_.isNumber(value)) {
				return this + " <= " + value;
			}
			return this + " <= '" + value + "'";
		}
		String.prototype.sqlGT = function(value) {
			if (_.isNumber(value)) {
				return this + " > " + value;
			}
			return this + " > '" + value + "'";
		}
		String.prototype.sqlGE = function(value) {
			if (_.isNumber(value)) {
				return this + " >= " + value;
			}
			return this + " >= '" + value + "'";
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
		}
		var splice = Array.prototype.splice;
		// _.extend(Backbone.Events.prototype, {
		// trigger : function(events) {
		// var event, node, calls, tail, args, all, rest;
		// if (!( calls = this._callbacks))
		// return this;
		// all = calls.all;
		// events = events.split(eventSplitter);
		// rest = slice.call(arguments, 1);
		//
		// while ( event = events.shift()) {
		// if ( node = calls[event]) {
		// tail = node.tail;
		// while (( node = node.next) !== tail) {
		// node.callback.apply(node.context || this, rest);
		// }
		// }
		// if ( node = all) {
		// tail = node.tail;
		// args = [event].concat(rest);
		// while (( node = node.next) !== tail) {
		// node.callback.apply(node.context || this, args);
		// }
		// }
		// }
		//
		// return this;
		// }
		// });
		var f = _, g = Backbone;
		_.extend(Backbone.Model.prototype, {
			save : function(a, b, c) {
			var d, e;
			f.isObject(a) || null == a ? ( d = a, c = b) : ( d = {}, d[a] = b);
			c = c ? f.clone(c) : {};
			if (c.wait) {
				if (!this._validate(d, c))
					return !1;
				e = f.clone(this.attributes)
			}
			a = f.extend({}, c, {
				silent : !0
			});
			if (d && !this.set(d, c.wait ? a : c))
				return !1;
			var h = this, i = c.success;
			c.success = function(a, b, e) {
				b = h.parse(a, e);
				if (c.wait) {
					delete c.wait;
					b = f.extend(d || {}, b)
				}
				if (!h.set(b, c))
					return false;
				i ? i(h, a) : h.trigger("sync", h, a, c)
			};
			c.error = g.wrapError(c.error, h, c);
			b = this.isNew() ? "create" : "update";
			b = (this.sync || g.sync).call(this, b, this, c);
			c.wait && this.set(e, a);
			return b
		}
		});

		_.extend(Backbone.Collection.prototype, {
			reset : function(models, options) {
				options || ( options = {});
				for (var i = 0, l = this.models.length; i < l; i++) {
					this._removeReference(this.models[i]);
				}
				options.previousModels = this.models;
				this._reset();
				this.add(models, _.extend({
					silent : true
				}, options));
				if (!options.silent)
					this.trigger('reset', this, options);
				return this;
			},
			// remove : function(models, options) {
			// var i, l, index, model;
			// options || ( options = {});
			// models = _.isArray(models) ? models.slice() : [models];
			// for ( i = 0, l = models.length; i < l; i++) {
			// model = this.getByCid(models[i]) || this.get(models[i]);
			// if (!model)
			// continue;
			// delete this._byId[model.id];
			// delete this._byCid[model.cid];
			// index = this.indexOf(model);
			// this.models.splice(index, 1);
			// this.length--;
			// if (!options.silent) {
			// options.index = index;
			// model.trigger('remove', model, this, options);
			// }
			// this._removeReference(model);
			// }
			// return this;
			// },
			// _onModelEvent : function(event, model, collection, options) {
			// if ((event == 'add' || event == 'remove') && collection != this)
			// return;
			// if (event == 'destroy') {
			// this.remove(model, options);
			// }
			// if (model && event === 'change:' + model.idAttribute) {
			// delete this._byId[model.previous(model.idAttribute)];
			// this._byId[model.id] = model;
			// }
			// this.trigger.apply(this, arguments);
			// }

				add : function(models, options) {
					var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
					options || ( options = {});
					models = _.isArray(models) ? models.slice() : [models];
					for ( i = 0, length = models.length; i < length; i++) {

						if (!( model = models[i] = this._prepareModel(models[i], options))) {
							throw new Error("Can't add an invalid model to a collection");
						}

						cid = model.cid;
						id = model.id;

						console.log("adding models check dups " + id);

						if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
							dups.push(i);
							continue;
						}
						cids[cid] = ids[id] = model;
					}

					console.log("adding models dups " + dups.length);

					i = dups.length;
					while (i--) {
						models.splice(dups[i], 1);
					}

					console.log("adding models " + models.length);

					for ( i = 0, length = models.length; i < length; i++) {
						( model = models[i]).on('all', this._onModelEvent, this);
						this._byCid[model.cid] = model;
						if (model.id != null)
							this._byId[model.id] = model;
					}
					this.length += length;
					index = options.at != null ? options.at : this.models.length;
					splice.apply(this.models, [index, 0].concat(models));
					if (this.comparator)
						this.sort({
							silent : true
						});
					if (options.silent)
						return this;
					for ( i = 0, length = this.models.length; i < length; i++) {
						if (!cids[( model = this.models[i]).cid])
							continue;
						options.index = i;
						model.trigger('add', model, this, options);
					}
					return this;
				}

		});

	}());
