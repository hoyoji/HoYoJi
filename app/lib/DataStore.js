( function() {

// Creating all the collection singletons, they will be use as store
Alloy.Collections.instance("Login");
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
Alloy.Collections.instance("MoneyBorrow");
Alloy.Collections.instance("MoneyReturn");
Alloy.Collections.instance("MoneyLend");
Alloy.Collections.instance("MoneyPayback");
Alloy.Collections.instance("ClientSyncTable");

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
					["USD", "美元", "$", "USD", "0", "0"],
					["EUR", "欧元", "¢", "EUR", "0", "0"],
					["HKD", "港币", "$", "HKD", "0", "0"]
					/*
					["GBP", "英镑", "$", "GBP", "0", "0"],
					["AUD", "澳大利亚元", "$", "AUD", "0", "0"],
					["CAD", "加拿大元", "$", "CAD", "0", "0"],
					["DKK", "丹麦克朗", "$", "DKK", "0", "0"],
					["GHF", "瑞士法郎", "$", "GHF", "0", "0"],
					["JPY", "日元", "$", "JPY", "0", "0"],
					["KRW", "韩圆", "$", "KRW", "0", "0"],
					["MOP", "澳门元", "$", "MOP", "0", "0"],
					["MYR", "马拉西亚林吉特", "$", "MYR", "0", "0"],
					["NZD", "新西兰元", "$", "NZD", "0", "0"],
					["NOK", "挪威克朗", "$", "NOK", "0", "0"],
					["PHP", "菲律宾比索", "$", "PHP", "0", "0"],
					["SEK", "瑞典克朗", "$", "SEK", "0", "0"],
					["SGD", "新加坡元", "$", "SGD", "0", "0"],
					["TWD", "新台币", "$", "TWD", "0", "0"],
					["THB", "泰铢", "$", "THB", "0", "0"],
					["LKR", "斯里兰卡卢比", "$", "LKR", "0", "0"],
					["RUB", "俄罗斯卢布", "$", "RUB", "0", "0"],
					["UZS", "乌兹别克斯苏姆", "$", "UZS", "0", "0"],
					["INR", "印度卢比", "$", "INR", "0", "0"],
					["YER", "也门里亚尔", "$", "YER", "0", "0"],
					["KWD", "科威特第纳尔", "$", "KWD", "0", "0"],
					["KZT", "哈萨克斯坦坚戈", "$", "KZT", "0", "0"],
					["HUF", "匈牙利福林", "$", "HUF", "0", "0"],
					["MUR", "毛里求斯卢比", "$", "MUR", "0", "0"],
					["SCR", "塞舌尔卢比", "$", "SCR", "0", "0"],
					["BGN", "保加利亚新列弗", "$", "BGN", "0", "0"],
					["PYG", "巴拉圭瓜拉尼", "$", "PYG", "0", "0"],
					["COP", "哥伦比亚比索", "$", "COP", "0", "0"],
					["UYU", "乌拉圭比索", "$", "UYU", "0", "0"],
					["TTD", "特立尼达和多巴哥元", "$", "TTD", "0", "0"],
					["LVL", "拉脱维亚拉特", "$", "LVL", "0", "0"],
					["VND", "越南盾", "$", "VND", "0", "0"],
					["NGN", "尼日利亚奈拉", "$", "NGN", "0", "0"],
					["RSD", "塞尔维亚第纳尔", "$", "RSD", "0", "0"],
					["EGP", "埃及镑", "$", "EGP", "0", "0"],
					["CRC", "哥斯达黎加科朗", "$", "CRC", "0", "0"],
					["AED", "阿联酋迪拉姆", "$", "AED", "0", "0"],
					["UGX", "乌干达先令", "$", "UGX", "0", "0"],
					["EEK", "爱沙尼亚克朗", "$", "EEK", "0", "0"],
					["LAK", "老挝基普", "$", "LAK", "0", "0"],
					["MMK", "缅甸缅元", "$", "MMK", "0", "0"],
					["KHR", "柬埔寨瑞尔", "$", "KHR", "0", "0"],
					["BYR", "白俄罗斯卢布", "$", "BYR", "0", "0"],
					["BZD", "伯利兹元", "$", "BZD", "0", "0"],
					["ETB", "埃塞俄比亚比尔", "$", "ETB", "0", "0"],
					["GDQ", "危地马拉格查尔", "$", "GDQ", "0", "0"],
					["IQD", "伊拉克第纳尔", "$", "IQD", "0", "0"],
					["IRR", "伊朗里尔斯", "$", "IRR", "0", "0"],
					["HRK", "克罗地亚库纳", "$", "HRK", "0", "0"],
					["UAH", "乌克兰格里夫尼亚", "$", "UAH", "0", "0"],
					["ZAR", "南非兰特", "$", "ZAR", "0", "0"],
					["PGK", "巴布亚新几内亚基那", "$", "PGK", "0", "0"],
					["CLP", "智利比索", "$", "CLP", "0", "0"],
					["MAD", "摩洛哥迪拉姆", "$", "MAD", "0", "0"],
					["SVC", "萨尔瓦多科朗", "$", "SVC", "0", "0"],
					["PLN", "波兰兹罗提", "$", "PLN", "0", "0"],
					["SYP", "叙利亚镑", "$", "SYP", "0", "0"],
					["LBP", "黎巴嫩镑", "$", "LBP", "0", "0"],
					["ANG", "荷兰安替兰盾", "$", "ANG", "0", "0"],
					["TND", "突尼斯第纳尔", "$", "TND", "0", "0"],
					["XOF", "非洲金融共同体法郎", "$", "XOF", "0", "0"],
					["JOD", "约旦第纳尔", "$", "JOD", "0", "0"],
					["IDR", "印度尼西亚盾", "$", "IDR", "0", "0"],
					["KES", "肯尼亚先令", "$", "KES", "0", "0"] */
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

