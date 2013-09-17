( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseViewController($, attrs);
			_.extend($, {
				__saveCollection : [],
				__deleteCollection : [],
				addToSave : function(model) {
					if (_.indexOf($.__saveCollection, model) === -1) {
						$.__saveCollection.push(model);
					}
				},
				addToDelete : function(model) {
					if (_.indexOf($.__deleteCollection, model) === -1) {
						$.__deleteCollection.push(model);
					}
				},
				setSaveableMode : function(saveableMode) {
					if ($.saveableMode !== saveableMode) {
						$.saveableMode = saveableMode;
						var views = $.getViews();
						for (var view in views) {
							if (views[view].setSaveableMode) {
								views[view].setSaveableMode($.saveableMode);
							} else if (views[view].setEditable) {
								views[view].setEditable($.saveableMode !== "read");
							}
						}
						if ($.titleBar && !$.titleBar.$attrs.saveableMode) {
							$.titleBar.setSaveableMode($.saveableMode);
						}
					}
				},
				saveCollection : function(xCompleteCallback, xErrorCallback, dbTrans, options) {
					var mydb, myDbTrans;
					if (!dbTrans) {
						var myDbTrans = Alloy.Globals.DataStore.createTransaction();
						myDbTrans.begin();
					} else {
						myDbTrans = dbTrans;
					}
					var i = 0, hasError;
					for ( i = 0; i < $.__saveCollection.length; i++) {
						if ($.__saveCollection[i].isNew() || $.__saveCollection[i].hasChanged()) {
							// $.__saveCollection[i].once("sync", function() {
							// $.saveCollection(xCompleteCallback, xErrorCallback, myDbTrans);
							// });

							$.__saveCollection[i]._xSave(_.extend({
								dbTrans : myDbTrans,
								error : function(model, error) {
									myDbTrans.rollback();
									$.__saveCollection = [];
									$.__deleteCollection = [];
									hasError = true;
									var errMsg;
									if (error.__summary) {
										errMsg = error.__summary.msg;
									}
									if (xErrorCallback) {
										xErrorCallback(errMsg);
									}
								}
							}, options));
						}
						if (hasError) {
							return;
						}
					}
					for ( i = 0; i < $.__deleteCollection.length; i++) {
						$.__deleteCollection[i]._xDelete(function(e) {
							if (e) {
								myDbTrans.rollback();
								$.__saveCollection = [];
								$.__deleteCollection = [];
								hasError = true;
								var errMsg;
								if (error.__summary) {
									errMsg = error.__summary.msg;
								}
								if (xErrorCallback) {
									xErrorCallback(errMsg);
								}
							}
						}, _.extend({
							dbTrans : myDbTrans
						}, options));
						if (hasError) {
							return;
						}
					}
					if (!dbTrans) {
						$.__saveCollection = [];
						$.__deleteCollection = [];
						myDbTrans.commit();
					}
					xCompleteCallback();
				},
				saveModel : function(saveEndCB, saveErrorCB, options) {
					if ($.$model) {
						$.$model.xValidate(function() {
							if ($.$model.__xValidationErrorCount > 0) {
								$.$model.__xValidationError.__summary = {
									msg : "验证错误"
								};
								$.$model.trigger("error", $.$model, $.$model.__xValidationError);
								$.__saveCollection = [];
								$.__deleteCollection = [];
								saveErrorCB($.$model.__xValidationError.__summary.msg);
								return;
							}

							var dbTrans = Alloy.Globals.DataStore.createTransaction();
							dbTrans.begin();

							// if (!$.$model.isNew()) {
							// if this is a addnew action, reset the id if there is any error during sync operation
							// var clearModelId = function() {
							// $.$model.xSet("id", null);
							// }
							// }
							var hasError;
							var successCB = function() {
								$.$model.off("sync", successCB);
								$.$model.off("error", errorCB);
								$.__saveCollection = [];
								$.__deleteCollection = [];
								if (saveEndCB) {
									saveEndCB();
								}
							};
							var errorCB = function(model, error) {
								hasError = true;
								$.$model.off("sync", successCB);
								$.$model.off("error", errorCB);
								var errMsg;
								if (error.__summary) {
									errMsg = error.__summary.msg;
								}
								dbTrans.rollback();
								$.__saveCollection = [];
								$.__deleteCollection = [];
								if (saveErrorCB) {
									saveErrorCB(errMsg);
								}
							};

							$.$model.on("sync", successCB);
							$.$model.on("error", errorCB);

							// try to catch the database error
							// try{

							// $.$model.xSave({dbTrans : dbTrans, commit : true});

							$.saveCollection(function() {
								$.$model._xSave(_.extend({
									dbTrans : dbTrans,
									commit : true
								}, options));
							}, saveErrorCB, dbTrans, options);

							// } catch (err) {
							// if (_.isFunction(clearModelId)) {
							// clearModelId();
							// }
							// throw Error("Error in saving model");
							// }
						});
					}
				}
			});

			if ($.$model) {
				var saveableMode = "read";
				if ($.$model.canEdit()) {
					if ($.$model.isNew()) {
						saveableMode = "add";
					} else {
						saveableMode = "edit";
					}
				}

				$.setSaveableMode($.$attrs.saveableMode || $.$view.saveableMode || saveableMode);
			}

			$.onWindowOpenDo(function() {
				$.$view.fireEvent("registersaveablecallback", {
					bubbles : true,
					onSaveCB : $.onSave,
					saveModelCB : $.saveModel,
					saveableModeChangeCB : $.setSaveableMode
				});
			});
			
			$._resetForm = function() {
				if (!$.getCurrentWindow().$attrs.closeWithoutSave) {
					if ($.$model) {
						$.$model.xReset();
					}
					if ($.__saveCollection.length > 0) {
						$.__saveCollection.forEach(function(model) {
							if (!model.isNew()) {
								model.xReset();
							}
						});
						$.__saveCollection = [];
					}
					if ($.__deleteCollection.length > 0) {
						$.__deleteCollection.forEach(function(model) {
							delete model.__xDeleted;
							delete model.__xDeletedHidden;
						});
						$.__deleteCollection = [];
					}
				}
			},
			$.onWindowCloseDo($._resetForm);
			$.$view.addEventListener("resolvesaveablemodel", function(e) {
				e.cancelBubble = true;
				e.callback($);
			});
		};
	}());
