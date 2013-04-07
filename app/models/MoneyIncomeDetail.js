exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			amount : "REAL NOT NULL",
			moneyIncomeId : "TEXT NOT NULL",
			remark : "TEXT",
			ownerUserId : "TEXT NOT NULL"
		},
		belongsTo : {
			moneyIncome : {
				type : "MoneyIncome",
				attribute : "moneyIncomeDetails"
			},
			ownerUser : {
				type : "User",
				attribute : null
			}
		},
		rowView : "money/moneyIncomeDetailRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			// extended functions and properties go here
			xDelete : function(xFinishCallback) {
				if (this.xGet("moneyIncome").isNew()) {
					this.xGet("moneyIncome").trigger("xchange:amount", this.xGet("moneyIncome"));
					this.xGet("moneyIncome").xGet("moneyIncomeDetails").remove(this);
					xFinishCallback();
				} else {
					this._xDelete(function(error){
						if(!error){
							var amount = this.xGet("amount");
							var moneyAccount = this.xGet("moneyIncome").xGet("moneyAccount");
							moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - amount);
							moneyAccount._xSave();
							
							var incomeAmount = this.xGet("moneyIncome").xGet("amount");
							this.xGet("moneyIncome").xSet("amount", incomeAmount - amount);
							this.xGet("moneyIncome")._xSave();
									
						}
					});
				}
			},
			canEdit : function(){
				return this.xGet("moneyIncome").canEdit();				
			},
			canDelete : function(){
				return this.xGet("moneyIncome").canDelete();
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

