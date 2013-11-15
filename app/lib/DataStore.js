( function() {
		exports.DataStore = {
			_writeDbs : {},
			_readDbs : {},
			getDbName : function(){
				return Alloy.Globals.currentUserDatabaseName || "hoyoji";
			},
			getWriteDb : function(dbName){
				dbName = dbName || this.getDbName();
				if(!this._writeDbs[dbName]){
					this._writeDbs[dbName] =  Ti.Database.open(dbName);
					if (OS_ANDROID && Ti.Platform.Android.API_LEVEL >= 16){
						this._writeDbs[dbName].execute("pragma journal_mode=WAL;");
					}
				}
				return this._writeDbs[dbName];
			},
			getReadDb : function(dbName){
				dbName = dbName || this.getDbName();
				if(!this._readDbs[dbName]){
					this._readDbs[dbName] =  Ti.Database.open(dbName);
				}
				return this._readDbs[dbName];
			},
			initStore : function() {
				var collections = ["Login","User","Picture","Project","ParentProject","ProjectShareAuthorization","MoneyExpenseCategory","MoneyIncomeCategory","FriendCategory","Currency","Exchange","MoneyAccount","MoneyAccountBalanceAdjustment","Friend","Message","MessageBox","MoneyExpense","MoneyIncome","MoneyExpenseDetail","MoneyIncomeDetail","MoneyExpenseApportion","MoneyIncomeApportion","MoneyTransfer","MoneyBorrow","MoneyReturn","MoneyLend","MoneyPayback","MoneyBorrowApportion","MoneyLendApportion","MoneyReturnApportion","MoneyPaybackApportion","ClientSyncTable", "ProjectRemark"];
				collections.forEach(function(c){
					Alloy.Collections[c] = null;
					delete Alloy.Collections[c];
					var model = require("alloy/models/" + c);
					if(model.definition.config.adapter.db_name !== Alloy.Globals.currentUserDatabaseName){
						Alloy.M(c, model.definition, []);
					}
					Alloy.Collections.instance(c);
				});
				
				for (var m in Alloy.Models) {
					if (m === "instance")
						continue;
					Alloy.Models[m] = null;
					delete Alloy.Models[m];
					//Alloy.Models.instance(m)
				}
			},
			createTransaction : function() {
					var db = Ti.Database.open(this.getDbName());
					if (OS_ANDROID && Ti.Platform.Android.API_LEVEL >= 16){
						db.execute("pragma journal_mode=WAL;");
					}
					var dbTrans = {
					db : db,
					xCommitCount : 0,
					xCommitStart : function() {
						this.xCommitCount++;
					},
					xCommitEnd : function() {
						this.xCommitCount--;
						if (this.xCommitCount < 0) {
							alert("xCommitEnd < 0");
							throw new Error("xCommitEnd < 0");
						} else {
							return this._commit();
						}
					},
					begin : function() {
						this.xCommitCount++;
						this.db.execute("BEGIN;");
					},
					_commit : function() {
						if (this.xCommitCount === 0 && this.db) {
							this.db.execute("COMMIT;");
							this.db.close();
							this.db = null;
							this.trigger("commit");
							Ti.App.fireEvent("updateSyncCount");
							return true;
						}
						return false;
					},
					commit : function() {
						this.xCommitCount--;
						return this._commit();
					},
					rollback : function() {
						if (this.db) {
							this.db.execute("ROLLBACK;");
							this.db.close();
							this.db = null;
							this.trigger("rollback");
						}
					}
				};
				_.extend(dbTrans, Backbone.Events);
				// function updateSyncCount() {
				// dbTrans.off("commit", updateSyncCount);
				// Ti.App.fireEvent("updateSyncCount");
				// }
				//
				//
				// dbTrans.on("commit", updateSyncCount);
				return dbTrans;
			}
		};

		// var currencies = [["CNY", "人民币", "¥", "CNY", "0", "0"], ["USD", "美元", "$", "USD", "0", "0"], ["EUR", "欧元", "€", "EUR", "0", "0"], ["HKD", "港币", "$", "HKD", "0", "0"], ["GBP", "英镑", "£", "GBP", "0", "0"], ["AUD", "澳大利亚元", "$", "AUD", "0", "0"], ["BRL", "巴西雷亚尔", "R$", "BRL", "0", "0"], ["CAD", "加拿大元", "$", "CAD", "0", "0"], ["DKK", "丹麦克朗", "kr", "DKK", "0", "0"], ["CHF", "瑞士法郎", "$", "CHF", "0", "0"], ["JPY", "日元", "¥", "JPY", "0", "0"], ["KRW", "韩圆", "₩", "KRW", "0", "0"], ["KPW", "朝鲜圆", "₩", "KPW", "0", "0"], ["MOP", "澳门元", "$", "MOP", "0", "0"], ["MYR", "马拉西亚林吉特", "RM", "MYR", "0", "0"], ["NZD", "新西兰元", "$", "NZD", "0", "0"], ["NOK", "挪威克朗", "kr", "NOK", "0", "0"], ["PHP", "菲律宾比索", "₱", "PHP", "0", "0"], ["SEK", "瑞典克朗", "kr", "SEK", "0", "0"], ["SGD", "新加坡元", "$", "SGD", "0", "0"], ["TWD", "新台币", "NT", "TWD", "0", "0"], ["THB", "泰铢", "฿", "THB", "0", "0"], ["LKR", "斯里兰卡卢比", "$", "LKR", "0", "0"], ["RUB", "俄罗斯卢布", "руб", "RUB", "0", "0"], ["UZS", "乌兹别克斯苏姆", "$", "UZS", "0", "0"], ["INR", "印度卢比", "$", "INR", "0", "0"], ["YER", "也门里亚尔", "$", "YER", "0", "0"], ["KWD", "科威特第纳尔", "$", "KWD", "0", "0"], ["KZT", "哈萨克斯坦坚戈", "$", "KZT", "0", "0"], ["HUF", "匈牙利福林", "Ft", "HUF", "0", "0"], ["MUR", "毛里求斯卢比", "$", "MUR", "0", "0"], ["SCR", "塞舌尔卢比", "$", "SCR", "0", "0"], ["BGN", "保加利亚新列弗", "$", "BGN", "0", "0"], ["PYG", "巴拉圭瓜拉尼", "₲", "PYG", "0", "0"], ["COP", "哥伦比亚比索", "$", "COP", "0", "0"], ["UYU", "乌拉圭比索", "$", "UYU", "0", "0"], ["TTD", "特立尼达和多巴哥元", "$", "TTD", "0", "0"], ["LVL", "拉脱维亚拉特", "$", "LVL", "0", "0"], ["VND", "越南盾", "₫", "VND", "0", "0"], ["NGN", "尼日利亚奈拉", "₦", "NGN", "0", "0"], ["RSD", "塞尔维亚第纳尔", "$", "RSD", "0", "0"], ["EGP", "埃及镑", "£", "EGP", "0", "0"], ["CRC", "哥斯达黎加科朗", "₡", "CRC", "0", "0"], ["AED", "阿联酋迪拉姆", "$", "AED", "0", "0"], ["UGX", "乌干达先令", "$", "UGX", "0", "0"], ["EEK", "爱沙尼亚克朗", "kr", "EEK", "0", "0"], ["LAK", "老挝基普", "₭", "LAK", "0", "0"], ["MMK", "缅甸缅元", "K", "MMK", "0", "0"], ["KHR", "柬埔寨瑞尔", "៛ ", "KHR", "0", "0"], ["BYR", "白俄罗斯卢布", "Br", "BYR", "0", "0"], ["BZD", "伯利兹元", "$", "BZD", "0", "0"], ["ETB", "埃塞俄比亚比尔", "$", "ETB", "0", "0"], ["GDQ", "危地马拉格查尔", "Q", "GDQ", "0", "0"], ["IQD", "伊拉克第纳尔", "$", "IQD", "0", "0"], ["IRR", "伊朗里尔斯", "$", "IRR", "0", "0"], ["HRK", "克罗地亚库纳", "$", "HRK", "0", "0"], ["UAH", "乌克兰格里夫尼亚", "₴", "UAH", "0", "0"], ["ZAR", "南非兰特", "R", "ZAR", "0", "0"], ["PGK", "巴布亚新几内亚基那", "$", "PGK", "0", "0"], ["CLP", "智利比索", "$", "CLP", "0", "0"], ["MAD", "摩洛哥迪拉姆", "$", "MAD", "0", "0"], ["SVC", "萨尔瓦多科朗", "₡", "SVC", "0", "0"], ["PLN", "波兰兹罗提", "zł", "PLN", "0", "0"], ["SYP", "叙利亚镑", "£", "SYP", "0", "0"], ["LBP", "黎巴嫩镑", "£", "LBP", "0", "0"], ["ANG", "荷兰安替兰盾", "$", "ANG", "0", "0"], ["TND", "突尼斯第纳尔", "$", "TND", "0", "0"], ["XOF", "非洲金融共同体法郎", "$", "XOF", "0", "0"], ["JOD", "约旦第纳尔", "$", "JOD", "0", "0"], ["IDR", "印度尼西亚盾", "Rp", "IDR", "0", "0"], ["KES", "肯尼亚先令", "$", "KES", "0", "0"], ["MDL", "摩尔多瓦列伊", "$", "MDL", "0", "0"], ["QAR", "卡塔尔里亚尔", "$", "QAR", "0", "0"], ["PKR", "巴基斯坦卢比", "$", "PKR", "0", "0"], ["RON", "罗马尼亚列伊", "$", "RON", "0", "0"], ["SKK", "斯洛伐克克朗", "Sk", "SKK", "0", "0"], ["HNL", "洪都拉斯拉伦皮拉", "$", "HNL", "0", "0"], ["VEF", "委内瑞拉强势玻利瓦", "Bs", "VEF", "0", "0"], ["BHD", "巴林第纳尔", "$", "BHD", "0", "0"], ["NPR", "尼泊尔卢比", "$", "NPR", "0", "0"], ["JMD", "牙买加元", "$", "JMD", "0", "0"], ["ILS", "以色列新谢克尔", "₪", "ILS", "0", "0"], ["OMR", "阿曼里亚尔", "$", "OMR", "0", "0"], ["NAD", "纳米比亚元", "$", "NAD", "0", "0"], ["DZD", "阿尔及利亚第纳尔", "$", "DZD", "0", "0"], ["ISK", "冰岛克朗", "kr", "ISK", "0", "0"], ["BDT", "孟加拉塔卡", "$", "BDT", "0", "0"], ["BOB", "玻利维亚诺", "Bs", "BOB", "0", "0"], ["BND", "文莱元", "$", "BND", "0", "0"], ["ARS", "阿根廷比索", "$", "ARS", "0", "0"], ["NIO", "尼加拉瓜金科多巴", "$", "NIO", "0", "0"], ["KYD", "开曼元", "$", "KYD", "0", "0"], ["FJD", "斐济元", "$", "FJD", "0", "0"], ["MVR", "马尔代夫拉菲亚", "$", "MVR", "0", "0"], ["SAR", "沙特里亚尔", "$", "SAR", "0", "0"], ["LTL", "立陶宛立特", "$", "LTL", "0", "0"], ["TRY", "新土耳其里拉", "₤", "TRY", "0", "0"], ["SLL", "塞拉利昂利昂", "$", "SLL", "0", "0"], ["MKD", "马其顿戴代纳尔", "$", "MKD", "0", "0"], ["BWP", "博茨瓦纳普拉", "P", "BWP", "0", "0"], ["MXN", "墨西哥比索", "$", "MXN", "0", "0"], ["PEN", "秘鲁新索尔", "S/.", "PEN", "0", "0"], ["DOP", "多米尼加比索", "$", "DOP", "0", "0"], ["TZS", "坦桑尼亚先令", "$", "TZS", "0", "0"], ["ZMK", "赞比亚克瓦查", "$", "ZMK", "0", "0"]];
		//
		// var insertSql = "INSERT INTO Currency (id, name, symbol, code, ownerUserId, _creatorId) VALUES (?,?,?,?,?,?)";
		// var db = Ti.Database.open("hoyoji");
		// db.execute("BEGIN;");
		//
		// var rs = db.execute("SELECT * FROM Currency");
		// if (rs.rowCount === 0) {
		// for (var i = 0; i < currencies.length; i++) {
		// db.execute(insertSql, currencies[i]);
		// }
		// }
		// rs.close();
		// rs = null;
		// db.execute("COMMIT;");
		// db.close();
		// db = null;
	}());

