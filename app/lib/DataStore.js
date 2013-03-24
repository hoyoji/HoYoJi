( function() {

// Creating all the collection singletons, they will be use as store
Alloy.Collections.instance("User");
Alloy.Collections.instance("Project");
Alloy.Collections.instance("ProjectShareAuthorization");
Alloy.Collections.instance("MoneyExpenseCategory");
Alloy.Collections.instance("MoneyIncomeCategory");
Alloy.Collections.instance("FriendCategory");
Alloy.Collections.instance("Currency");
Alloy.Collections.instance("Exchange");
Alloy.Collections.instance("MoneyAccount");
Alloy.Collections.instance("Friend");
Alloy.Collections.instance("Message");
Alloy.Collections.instance("MessageBox");
Alloy.Collections.instance("MoneyExpense");
Alloy.Collections.instance("MoneyIncome");

exports.DataStore = {
	initStore : function(){
		for(var c in Alloy.Collections){
			if(c === "instance") continue;
			Alloy.Collections[c] = null;
			delete Alloy.Collections[c];
			Alloy.Collections.instance(c)
		}
		for(var m in Alloy.Models){
			if(m === "instance") continue;
			Alloy.Models[m] = null;
			delete Alloy.Models[m];
			//Alloy.Models.instance(m)
		}
	}
}

}());
