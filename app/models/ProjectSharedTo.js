exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			sharedType : "TEXT",
        	remark : "TEXT",
			
			shareAllSubProjects : "INTEGER NOT NULL",
			
			projectShareExpenseOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareExpenseAddNew : "INTEGER NOT NULL",
	        projectShareExpenseEdit : "INTEGER NOT NULL",
	        projectShareExpenseDelete : "INTEGER NOT NULL",
	        
	        projectShareExpenseDetailOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareExpenseDetailAddNew : "INTEGER NOT NULL",
	        projectShareExpenseDetailEdit : "INTEGER NOT NULL",
	        projectShareExpenseDetailDelete : "INTEGER NOT NULL",
	        
	        projectShareIncomeOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareIncomeAddNew : "INTEGER NOT NULL",
	        projectShareIncomeEdit : "INTEGER NOT NULL",
	        projectShareIncomeDelete : "INTEGER NOT NULL",
	        
	        projectShareIncomeDetailOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareIncomeDetailAddNew : "INTEGER NOT NULL",
	        projectShareIncomeDetailEdit : "INTEGER NOT NULL",
	        projectShareIncomeDetailDelete : "INTEGER NOT NULL",
	        
	        projectShareExpenseCategoryAddNew : "INTEGER NOT NULL",
	        projectShareExpenseCategoryEdit : "INTEGER NOT NULL",
	        projectShareExpenseCategoryDelete : "INTEGER NOT NULL",
	        
	        projectShareIncomeCategoryAddNew : "INTEGER NOT NULL",
	        projectShareIncomeCategoryEdit : "INTEGER NOT NULL",
	        projectShareIncomeCategoryDelete : "INTEGER NOT NULL",
	        
	        projectShareMoneyTransferOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareMoneyTransferAddNew : "INTEGER NOT NULL",
	        projectShareMoneyTransferEdit : "INTEGER NOT NULL",
	        projectShareMoneyTransferDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanLendOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanLendAddNew : "INTEGER NOT NULL",
	        projectShareLoanLendEdit : "INTEGER NOT NULL",
	        projectShareLoanLendDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanBorrowOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanBorrowAddNew : "INTEGER NOT NULL",
	        projectShareLoanBorrowEdit : "INTEGER NOT NULL",
	        projectShareLoanBorrowDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanPaybackOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanPaybackAddNew : "INTEGER NOT NULL",
	        projectShareLoanPaybackEdit : "INTEGER NOT NULL",
	        projectShareLoanPaybackDelete : "INTEGER NOT NULL",
	        
	        projectShareLoanReturnOwnerDataOnly : "INTEGER NOT NULL",
	        projectShareLoanReturnAddNew : "INTEGER NOT NULL",
	        projectShareLoanReturnEdit : "INTEGER NOT NULL",
	        projectShareLoanReturnDelete : "INTEGER NOT NULL",
	        
	        sharedToUserId : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			friendId : "TEXT NOT NULL",
	        projectId : "TEXT NOT NULL"
		},
		defaults : {
			shareAllSubProjects : 0,
			
			projectShareExpenseOwnerDataOnly : 0,
	        projectShareExpenseAddNew : 1,
	        projectShareExpenseEdit : 1,
	        projectShareExpenseDelete : 1,
	        
	        projectShareExpenseDetailOwnerDataOnly : 0,
	        projectShareExpenseDetailAddNew : 1,
	        projectShareExpenseDetailEdit : 1,
	        projectShareExpenseDetailDelete : 1,
	        
	        projectShareIncomeOwnerDataOnly : 0,
	        projectShareIncomeAddNew : 1,
	        projectShareIncomeEdit : 1,
	        projectShareIncomeDelete : 1,
	        
	        projectShareIncomeDetailOwnerDataOnly : 0,
	        projectShareIncomeDetailAddNew : 1,
	        projectShareIncomeDetailEdit : 1,
	        projectShareIncomeDetailDelete : 1,
	        
	        projectShareExpenseCategoryAddNew : 1,
	        projectShareExpenseCategoryEdit : 1,
	        projectShareExpenseCategoryDelete : 1,
	        
	        projectShareIncomeCategoryAddNew : 1,
	        projectShareIncomeCategoryEdit : 1,
	        projectShareIncomeCategoryDelete : 1,
	        
	        projectShareMoneyTransferOwnerDataOnly : 0,
	        projectShareMoneyTransferAddNew : 1,
	        projectShareMoneyTransferEdit : 1,
	        projectShareMoneyTransferDelete : 1,
	        
	        projectShareLoanLendOwnerDataOnly : 0,
	        projectShareLoanLendAddNew : 1,
	        projectShareLoanLendEdit : 1,
	        projectShareLoanLendDelete : 1,
	        
	        projectShareLoanBorrowOwnerDataOnly : 0,
	        projectShareLoanBorrowAddNew : 1,
	        projectShareLoanBorrowEdit : 1,
	        projectShareLoanBorrowDelete : 1,
	        
	        projectShareLoanPaybackOwnerDataOnly : 0,
	        projectShareLoanPaybackAddNew : 1,
	        projectShareLoanPaybackEdit : 1,
	        projectShareLoanPaybackDelete : 1,
	        
	        projectShareLoanReturnOwnerDataOnly : 0,
	        projectShareLoanReturnAddNew : 1,
	        projectShareLoanReturnEdit : 1,
	        projectShareLoanReturnDelete : 1
		},
		belongsTo : {
			ownerUser : { type : "User", attribute : null },
			friend : { type : "Friend", attribute : "projectSharedToes" },
			project : { type : "Project", attribute : "projectSharedToes" }
		},
		hasMany : {
		},
		rowView : "project/projectSharedToRow",
		adapter : {
			collection_name : "ProjectSharedTo",
			idAttribute : "id",
			type : "sql",
			db_name : "hoyoji"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel, {
			validators : {
			}	
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection, {
			// extended functions and properties go here
		});
		return Collection;
	}
}
