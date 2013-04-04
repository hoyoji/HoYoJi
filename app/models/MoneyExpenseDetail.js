exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			moneyExpenseId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		belongsTo : {
			moneyExpense : {
				type : "MoneyExpense",
				attribute : "moneyExpenseDetails"
			},
			ownerUser : {
				type : "User",
				attribute : null
			}
		},
		rowView : "money/moneyExpenseDetailRow",
		adapter : {
			type : "hyjSql",
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			// extended functions and properties go here
			xDelete : function(xFinishCallback) {
				if (this.xGet("moneyExpense").isNew()) {
					this.xGet("moneyExpense").trigger("xchange:amount", this.xGet("moneyExpense"));
					this.xGet("moneyExpense").xGet("moneyExpenseDetails").remove(this);
					xFinishCallback();
				} else {
					this._xDelete(function(error){
						if(!error){
							var amount = this.xGet("amount");
							
							var moneyAccount = this.xGet("moneyExpense").xGet("moneyAccount");
							moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + amount);
							moneyAccount._xSave();
							
							var expenseAmount = this.xGet("moneyExpense").xGet("amount");
							this.xGet("moneyExpense").xSet("amount", expenseAmount - amount);
							this.xGet("moneyExpense")._xSave();
						}
						xFinishCallback(error);
					});
				}
			},
			canEdit : function(){
				return this.xGet("moneyExpense").canEdit();				
			},
			canDelete : function(){
				return this.xGet("moneyExpense").canDelete();
			}
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});

		return Collection;
	}
}

