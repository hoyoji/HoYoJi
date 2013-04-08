( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseViewController($, attrs);
			_.extend($, {
				__saveCollection : [],
				addToSave : function(model) {
					$.__saveCollection.push(model);
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
				saveCollection : function(xCompleteCallback, xErrorCallback, dbTrans) {
					var mydb, myDbTrans;
					if(!dbTrans){
						mydb = Ti.Database.open("hoyoji");
						mydb.execute("BEGIN;");
						
						myDbTrans = {db : mydb};
						_.extend(myDbTrans, Backbone.Events);
					} else {
						myDbTrans = dbTrans;
						mydb = dbTrans.db;
					}
					var i = 0, hasError;
					for (i = 0; i < $.__saveCollection.length; i++) {
						if ($.__saveCollection[i].isNew() || $.__saveCollection[i].hasChanged()) {
							// $.__saveCollection[i].once("sync", function() {
								// $.saveCollection(xCompleteCallback, xErrorCallback, myDbTrans);
							// });

							$.__saveCollection[i]._xSave({
								dbTrans : myDbTrans,
								error : function(model, error) {
									$.__saveCollection = [];
									// if(!dbTrans){
										mydb.execute("ROLLBACK;");
										mydb.close();
										myDbTrans.trigger("rollback");
									// }
									hasError = true;
									var errMsg;
									if (error.__summury) {
										errMsg = error.__summury.msg;
									}
									xErrorCallback(errMsg);
								}
							});
						}
						if(hasError) return;
					}
					$.__saveCollection = [];
					if(!dbTrans){
						mydb.execute("COMMIT;");
						mydb.close();
						myDbTrans.trigger("commit");
					}
					xCompleteCallback();
				},
				saveModel : function(saveEndCB, saveErrorCB) {
					if ($.$model) {
						
						var db = Ti.Database.open("hoyoji");
						var dbTrans = {db : db};
						_.extend(dbTrans, Backbone.Events);
						
						db.execute("BEGIN;");
						
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
							saveEndCB();
						}
						var errorCB = function(model, error) {
							hasError = true;
							$.$model.off("sync", successCB);
							$.$model.off("error", errorCB);
							var errMsg;
							if (error.__summury) {
								errMsg = error.__summury.msg;
							}
							db.execute("ROLLBACK;");
							db.close();
							dbTrans.trigger("rollback");
							saveErrorCB(errMsg);
						}

						$.$model.on("sync", successCB);
						$.$model.on("error", errorCB);

						// try to catch the database error
						// try{

						$.saveCollection(function() {
							$.$model.xSave({dbTrans : dbTrans, commit : true});
							// if(!hasError){
								// db.execute("COMMIT;");
								// db.close();
								// dbTrans.trigger("commit");
							// }
						}, saveErrorCB, dbTrans);

						// } catch (err) {
						// if (_.isFunction(clearModelId)) {
						// clearModelId();
						// }
						// throw Error("Error in saving model");
						// }
					}
				}
			});
			
			if($.$model) {
				var saveableMode = "read";
				if($.$model.canEdit()){
					if($.$model.isNew()){
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
			$.$view.addEventListener("resolvesaveablemodel", function(e) {
				e.cancelBubble = true;
				e.callback($);
			});
		}
	}());
