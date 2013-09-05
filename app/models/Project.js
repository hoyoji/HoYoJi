exports.definition = {
	config : {
		columns : {
			id : "TEXT UNIQUE NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			parentProjectId : "TEXT",
			currencyId : "TEXT NOT NULL",
			defaultIncomeCategoryId : "TEXT",
			defaultExpenseCategoryId : "TEXT",
			depositeIncomeCategoryId : "TEXT",
			depositeExpenseCategoryId : "TEXT",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "INTEGER",
			lastClientUpdateTime : "INTEGER"
		},
		// defaults : {
		// name : "",
		// },
		belongsTo : {
			ownerUser : {
				type : "User",
				attribute : "projects"
			},
			parentProject : {
				type : "Project",
				attribute : "subProjects"
			},
			currency : {
				type : "Currency",
				attribute : null
			},
			defaultIncomeCategory : {
				type : "MoneyIncomeCategory",
				attribute : null
			},
			defaultExpenseCategory : {
				type : "MoneyExpenseCategory",
				attribute : null
			},
			depositeIncomeCategory : {
				type : "MoneyIncomeCategory",
				attribute : null
			},
			depositeExpenseCategory : {
				type : "MoneyExpenseCategory",
				attribute : null
			}
		},
		hasMany : {
			moneyExpenseCategories : {
				type : "MoneyExpenseCategory",
				attribute : "project"
			},
			moneyIncomeCategories : {
				type : "MoneyIncomeCategory",
				attribute : "project"
			},
			subProjects : {
				type : "Project",
				attribute : "parentProject"
			},
			projectShareAuthorizations : {
				type : "ProjectShareAuthorization",
				attribute : "project"
			},
			moneyExpenses : {
				type : "MoneyExpense",
				attribute : "project"
			},
			moneyIncomes : {
				type : "MoneyIncome",
				attribute : "project"
			},
			moneyTransfers : {
				type : "MoneyTransfer",
				attribute : "project"
			},
			moneyBorrows : {
				type : "MoneyBorrow",
				attribute : "project"
			},
			moneyReturns : {
				type : "MoneyReturn",
				attribute : "project"
			},
			moneyLends : {
				type : "MoneyLend",
				attribute : "project"
			},
			moneyPaybacks : {
				type : "MoneyPayback",
				attribute : "project"
			}
		},
		rowView : "project/projectRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
				// name : function(xValidateComplete){
				// var error;
				// if(!this.has("name") || this.xGet("name").length <= 0){
				// error = {msg : "请输入项目名称"};
				// }
				// xValidateComplete(error);
				// }
				parentProject : function(xValidateComplete) {
					var error;
					if (this.xGet("parentProject") && (this.xGet("parentProject").xGet("ownerUserId") !== Alloy.Models.User.id)) {
						error = {
							msg : "共享项目不能作为本地项目的上级"
						};
					}
					xValidateComplete(error);
				}
			},
			getActualTotalMoney : function() {
				var actualTotalExpense = 0;
				var actualTotalIncome = 0;
				this.xGet("projectShareAuthorizations").forEach(function(item) {
					if (item.xGet("state") === "Accept") {
						actualTotalExpense = actualTotalExpense + item.xGet("actualTotalExpense");
						actualTotalIncome = actualTotalIncome + item.xGet("actualTotalIncome");
					}
				});
				this._actualTotalMoney = actualTotalExpense - actualTotalIncome;
				var actualTotalMoney = Math.abs(this._actualTotalMoney);
				// if (actualTotalMoney < 0) {
				// actualTotalMoney = -actualTotalMoney;
				// }

				var projectCurrency = this.xGet("currency");
				var userCurrency = Alloy.Models.User.xGet("activeCurrency");
				var exchanges = userCurrency.getExchanges(projectCurrency);
				var exchange = 1;
				if (exchanges.length) {
					exchange = exchanges.at(0).xGet("rate");
				}
				return Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + (actualTotalMoney / exchange).toFixed(2);
			},
			getActualTotalMoneyType : function(cached) {
				var actualTotalMoney;
				if (this._actualTotalMoney && cached) {
					actualTotalMoney = this._actualTotalMoney;
				} else {
					var actualTotalExpense = 0;
					var actualTotalIncome = 0;
					this.xGet("projectShareAuthorizations").forEach(function(item) {
						if (item.xGet("state") === "Accept") {
							actualTotalExpense = actualTotalExpense + item.xGet("actualTotalExpense");
							actualTotalIncome = actualTotalIncome + item.xGet("actualTotalIncome");
						}
					});

					actualTotalMoney = actualTotalExpense - actualTotalIncome;
				}
				if (actualTotalMoney > 0) {
					return false;
				} else {
					return true;
				}
			},
			getProjectNameCurrency : function() {
				return this.xGet("name") + "(" + this.xGet("currency").xGet("code") + ")";
			},
			xDelete : function(xFinishCallback, options) {
				if (Alloy.Models.User.xGet("activeProjectId") === this.xGet("id")) {
					xFinishCallback({
						msg : "不能删除当前激活的项目"
					});
				} else if (this.xGet("moneyExpenses").length > 0) {
					xFinishCallback({
						msg : "项目中的支出不为空，不能删除"
					});
				} else if (this.xGet("moneyIncomes").length > 0) {
					xFinishCallback({
						msg : "项目中的收入不为空，不能删除"
					});
				} else if (this.xGet("moneyTransfers").length > 0) {
					xFinishCallback({
						msg : "项目中的转账不为空，不能删除"
					});
				} else if (this.xGet("moneyBorrows").length > 0) {
					xFinishCallback({
						msg : "项目中的借出不为空，不能删除"
					});
				} else if (this.xGet("moneyReturns").length > 0) {
					xFinishCallback({
						msg : "项目中的还款不为空，不能删除"
					});
				} else if (this.xGet("moneyLends").length > 0) {
					xFinishCallback({
						msg : "项目中的借出不为空，不能删除"
					});
				} else if (this.xGet("moneyPaybacks").length > 0) {
					xFinishCallback({
						msg : "项目中的收款不为空，不能删除"
					});
				} else if (this.xGet("moneyExpenseCategories").length > 1) {
					xFinishCallback({
						msg : "项目中的支出分类不为空，不能删除"
					});
				} else if (this.xGet("moneyIncomeCategories").length > 1) {
					xFinishCallback({
						msg : "项目中的收入分类不为空，不能删除"
					});
				} else {
					var acceptProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
						projectId : this.xGet("id"),
						state : "Accept"
					});
					var waitProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
						projectId : this.xGet("id"),
						state : "Wait"
					});
					if (acceptProjectShareAuthorizations.length > 1 || waitProjectShareAuthorizations.length > 0) {
						xFinishCallback({
							msg : "项目中的共享好友不为空，不能删除"
						});
					} else {
						var self = this;
						function deleteProjectShareAuthorization(successCB, errorCB) {
							var projectShareAuthorizations = self.xGet("projectShareAuthorizations");
							var projectShareAuthorizationsCount = 0;
							if (projectShareAuthorizations.length > 0) {
								var delError = false;
								for (var i = 0; i < projectShareAuthorizations.length; i++) {
									var projectShareAuthorization = projectShareAuthorizations.at(i);
									projectShareAuthorization._xDelete(function(err) {
										if (err) {
											delError = true;
										}
									}, options);
									if (delError) {
										break;
									} else {
										projectShareAuthorizationsCount++;
									}
								}
								if (projectShareAuthorizationsCount === projectShareAuthorizations.length) {
									projectShareAuthorizations.reset();
									successCB();
								} else {
									errorCB({
										__summary : {
											msg : "删除子数据项目共享时出错"
										}
									});
								}

							} else {
								successCB();
							}
						}

						deleteProjectShareAuthorization(function(e) {
							if (Alloy.Models.User.xGet("activeProjectId") === self.xGet("id")) {
								Alloy.Models.User.xSet("activeProject", null);
								Alloy.Models.User.save("activeProjectId", null, options);
							}
							var depositeExpenseCategory = Alloy.createModel("MoneyExpenseCategory").xFindInDb({
								id : self.xGet("depositeExpenseCategoryId")
							});
							var depositeIncomeCategory = Alloy.createModel("MoneyIncomeCategory").xFindInDb({
								id : self.xGet("depositeIncomeCategoryId")
							});
							// self.xSet("depositeIncomeCategoryId", null);
							// self.xSet("depositeExpenseCategoryId", null);
							// self.save();

							if (depositeExpenseCategory.id) {
								depositeExpenseCategory._xDelete(function() {
								}, options);
							}
							if (depositeIncomeCategory.id) {
								depositeIncomeCategory._xDelete(function() {
								}, options);
							}
							self.xGet("moneyExpenseCategories").remove(depositeExpenseCategory, {
								silent : true
							});
							self.xGet("moneyIncomeCategories").remove(depositeIncomeCategory, {
								silent : true
							});
							self._xDelete(xFinishCallback, options);
						}, function(e) {
							xFinishCallback(e);
							return;
						});

					}
				}
			},
			// getSharedWithHerSubProjects : function(){
			// if(!this.__getSharedWIthHerSubProjectsFilter){
			// this.__getSharedWIthHerSubProjectsFilter = this.xGet("subProjects").xCreateFilter({
			// // ....
			// });
			// }
			// return this.__getSharedWIthHerSubProjectsFilter;
			// },
			getSharedWithHerFriends : function() {
				if (!this.__getSharedWithHerFriendsFilter) {
					this.__getSharedWithHerFriendsFilter = this.xGet("projectShareAuthorizations").xCreateFilter(function(model) {
						return model.xPrevious("state") === "Wait" || model.xPrevious("state") === "Accept";
					});
				}
				return this.__getSharedWithHerFriendsFilter;
			},
			setDefaultExpenseCategory : function(expenseCategory) {
				if (this.xGet("ownerUser") === Alloy.Models.User && this.xGet("defaultExpenseCategory") !== expenseCategory) {
					this.xSet("defaultExpenseCategory", expenseCategory);
					this.save({
						defaultExpenseCategoryId : expenseCategory.xGet("id")
					}, {
						wait : true,
						patch : true
					});
				}
			},
			setDefaultIncomeCategory : function(incomeCategory) {
				if (this.xGet("ownerUser") === Alloy.Models.User && this.xGet("defaultIncomeCategory") !== incomeCategory) {
					this.xSet("defaultIncomeCategory", incomeCategory);
					this.save({
						defaultIncomeCategoryId : incomeCategory.xGet("id")
					}, {
						wait : true,
						patch : true
					});
				}
			},
			canEdit : function() {
				if (this.isNew()) {
					return true;
				} else if (this.xGet("ownerUser") === Alloy.Models.User) {
					return true;
				}
				return false;
			},
			canDelete : function() {
				return this.xGet("ownerUser") === Alloy.Models.User;
			},
			canExpenseCategoryAddNew : function() {
				if (this.xGet("ownerUser") !== Alloy.Models.User) {
					var projectShareAuthorization = this.xGet("projectShareAuthorizations").at(0);
					if (projectShareAuthorization.xGet("projectShareMoneyExpenseCategoryAddNew")) {
						return true;
					} else {
						return false;
					}
				}
				return this.xGet("ownerUser") === Alloy.Models.User;
			},
			canIncomeCategoryAddNew : function() {
				if (this.xGet("ownerUser") !== Alloy.Models.User) {
					var projectShareAuthorization = this.xGet("projectShareAuthorizations").at(0);
					if (projectShareAuthorization.xGet("projectShareMoneyIncomeCategoryAddNew")) {
						return true;
					} else {
						return false;
					}
				}
				return this.xGet("ownerUser") === Alloy.Models.User;
			}//,
			// syncAddNew : function(record, dbTrans) {
				// if (record.ownerUserId !== Alloy.Models.User.id) {
					// var currency = Alloy.createModel("Currency").xFindInDb({
						// id : record.currencyId
					// });
					// if (!currency.id) {
						// dbTrans.xCommitStart();
						// Alloy.Globals.Server.getData([{
							// __dataType : "CurrencyAll",
							// id : record.currencyId
						// }], function(data) {
							// var currencyData = data[0][0];
							// var id = currencyData.id;
							// delete currencyData.id;
							// try {
								// currencyData.symbol = Ti.Locale.getCurrencySymbol(currencyData.code);
							// } catch (e) {
								// currencyData.symbol = currencyData.code;
							// }
							// currency = Alloy.createModel("Currency", currencyData);
							// currency.attributes["id"] = id;
// 
							// currency.xSet("ownerUser", Alloy.Models.User);
							// currency.xSet("ownerUserId", Alloy.Models.User.id);
							// currency.save(null, {
								// dbTrans : dbTrans
							// });
							// dbTrans.xCommitEnd();
							// fetchExchange(id);
// 
						// }, function(e) {
							// dbTrans.rollback("无法获取币种");
						// });
					// } else {
						// fetchExchange(currency.id);
					// }
// 
					// function fetchExchange(currencyId) {
						// var exchange = Alloy.createModel("Exchange").xFindInDb({
							// localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
							// foreignCurrencyId : currencyId
						// });
						// if (!exchange.id) {
							// dbTrans.xCommitStart();
							// Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("activeCurrencyId"), currencyId, function(rate) {
								// exchange = Alloy.createModel("Exchange", {
									// localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
									// foreignCurrencyId : currencyId,
									// rate : rate
								// });
								// exchange.xSet("ownerUser", Alloy.Models.User);
								// exchange.xSet("ownerUserId", Alloy.Models.User.id);
								// exchange.save(null, {
									// dbTrans : dbTrans
								// });
								// dbTrans.xCommitEnd();
							// }, function(e) {
								// dbTrans.rollback("无法获取汇率");
							// });
						// } else {
							// dbTrans.xCommitEnd();
						// }
					// }
// 
				// }
			// }
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});
		return Collection;
	}
};
