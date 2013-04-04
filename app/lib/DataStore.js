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
Alloy.Collections.instance("MoneyExpenseDetail");
Alloy.Collections.instance("MoneyIncomeDetail");
Alloy.Collections.instance("MoneyTransfer");
Alloy.Collections.instance("MoneyLoanBorrow");
Alloy.Collections.instance("MoneyLoanReturn");
Alloy.Collections.instance("MoneyLoanLend");
Alloy.Collections.instance("MoneyLoanPayback");

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

var currencies = [
					["CNY", "人民币", "¥", "CNY", "0", "0"],
					["USD", "美金", "$", "USD", "0", "0"],
					["EUR", "欧元", "¢", "EUR", "0", "0"],
					["HKD", "港币", "$", "HKD", "0", "0"]
				 ];
				 
var insertSql = "INSERT INTO Currency (id, name, symbol, code, ownerUserId, _creatorId) VALUES (?,?,?,?,?,?)";
var db = Ti.Database.open("hoyoji");
db.execute("BEGIN;");

var rs = db.execute("SELECT * FROM Currency");
if(rs.rowCount === 0){
	for(var i=0; i < currencies.length; i++){
		db.execute(insertSql, currencies[i]);
	}
}
rs.close();
rs = null;
db.execute("COMMIT;");
db.close();
db = null;
}());
