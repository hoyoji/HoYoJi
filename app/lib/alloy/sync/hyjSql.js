function Migrator(config, transactionDb) {
	this.db = transactionDb;
	this.dbname = config.adapter.db_name;
	this.table = config.adapter.collection_name;
	this.idAttribute = config.adapter.idAttribute;
	this.column = function(name) {
		var parts = name.split(/\s+/), type = parts[0];
		switch (type.toLowerCase()) {
			case "string":
			case "varchar":
			case "date":
			case "datetime":
				Ti.API.warn("\"" + type + "\" is not a valid sqlite field, using TEXT instead");

			case "text":
				type = "TEXT COLLATE NOCASE";
				break;

			case "int":
			case "tinyint":
			case "smallint":
			case "bigint":
			case "boolean":
				Ti.API.warn("\"" + type + "\" is not a valid sqlite field, using INTEGER instead");

			case "integer":
				type = "INTEGER";
				break;
			case "double":
			case "float":
			case "decimal":
			case "number":
				Ti.API.warn("\"" + name + "\" is not a valid sqlite field, using REAL instead");

			case "real":
				type = "REAL";
				break;

			case "blob":
				type = "BLOB";
				break;

			case "null":
				type = "NULL";
				break;

			default:
				type = "TEXT";
		}
		parts[0] = type;
		return parts.join(" ");
	};
	this.createTable = function(config) {
		var columns = [], found = !1;
		for (var k in config.columns) {
			k === this.idAttribute && ( found = !0);
			columns.push(k + " " + this.column(config.columns[k]));
		}
		columns.push("_creatorId TEXT NOT NULL");
		!found && this.idAttribute === ALLOY_ID_DEFAULT && columns.push(ALLOY_ID_DEFAULT + " TEXT");
		var sql = "CREATE TABLE IF NOT EXISTS " + this.table + " ( " + columns.join(",") + ")";
		this.db.execute(sql);
	};
	this.dropTable = function(config) {
		this.db.execute("DROP TABLE IF EXISTS " + this.table);
	};
	this.insertRow = function(columnValues) {
		var columns = [], values = [], qs = [], found = !1;
		for (var key in columnValues) {
			key === this.idAttribute && ( found = !0);
			columns.push(key);
			values.push(columnValues[key]);
			qs.push("?");
		}
		if (!found && this.idAttribute === ALLOY_ID_DEFAULT) {
			columns.push(this.idAttribute);
			values.push(guid());
			qs.push("?");
		}
		this.db.execute("INSERT INTO " + this.table + " (" + columns.join(",") + ") VALUES (" + qs.join(",") + ");", values);
	};
	this.deleteRow = function(columns) {
		var sql = "DELETE FROM " + this.table, keys = _.keys(columns), len = keys.length, conditions = [], values = [];
		len && (sql += " WHERE ");
		for (var i = 0; i < len; i++) {
			conditions.push(keys[i] + " = ?");
			values.push(columns[keys[i]]);
		}
		sql += conditions.join(" AND ");
		this.db.execute(sql, values);
	};
}

var projectPermissionTables = ["Project", "ProjectDeposit", "ProjectDepositeReturn", "MoneyExpense", "MoneyExpenseCategory", "MoneyExpenseDetail", "MoneyExpenseApportion", "MoneyIncome", "MoneyIncomeCategory", "MoneyIncomeDetail", "MoneyIncomeApportion", "MoneyLend", "MoneyLendApportion", "MoneyPayback", "MoneyPaybackApportion", "MoneyBorrow", "MoneyBorrowApportion", "MoneyReturn", "MoneyReturnApportion" /*, "MoneyTransfer"*/];

function Sync(method, model, opts) {
	var table = model.config.adapter.collection_name, columns = model.config.columns, dbName = model.config.adapter.db_name || ALLOY_DB_DEFAULT, resp = null, db;
	var error;
	if (opts.dbTrans) {
		db = opts.dbTrans.db;
	}
	switch (method) {
		case "create":
			resp = function() {
				// if(!Alloy.Models.User &&
				// (model.config.adapter.collection_name !== "User" || model.config.adapter.collection_name !== "Login")){
				// model.trigger("error", { __summary : { msg : "请登录，再操作"}});
				// return;
				// }

				var attrObj = {};
				if (!model.id) {
					if (model.idAttribute === ALLOY_ID_DEFAULT) {
						model.id = guid();
						attrObj[model.idAttribute] = model.id;
						model.set(attrObj, {
							silent : !0
						});
					} else {
						var tmpM = model.get(model.idAttribute);
						model.id = tmpM !== null && typeof tmpM != "undefined" ? tmpM : null;
					}
				}
				if (model.config.columns["lastClientUpdateTime"]) {
					model.attributes.lastClientUpdateTime = (new Date()).getTimeStamp();
				}
				var names = [], values = [], q = [];
				for (var k in columns) {
					names.push(k);
					values.push(model.get(k));
					q.push("?");
				}
				var ownerUserId;
				var sqlCheckPermission;
				if (!opts.syncFromServer) {
					if (Alloy.Models.User) {
						ownerUserId = Alloy.Models.User.xGet("id");
						if (!model.xGet("ownerUserId")) {
							model.xSet("ownerUserId", ownerUserId);
						}
						if (_.indexOf(projectPermissionTables, table) > -1) {
							if (table === "Project") {
								// 检查上级项目的共享中有没有允许我添加子项目的权限
							} else{
								// if (table === "MoneyExpenseCategory" || table === "MoneyIncomeCategory") {
								// sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("project").xGet("id") + '" AND "' + model.xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShare' + table + 'AddNew = 1';
								// } else
								if (table === "MoneyIncomeDetail" && !model.xGet("moneyIncome").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyIncome").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyIncome").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyIncomeAddNew = 1';
								} else if (table === "MoneyExpenseDetail" && !model.xGet("moneyExpense").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyExpense").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyExpense").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyExpenseAddNew = 1';
								} else if (table === "MoneyIncomeApportion" && !model.xGet("moneyIncome").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyIncome").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyIncome").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyIncomeAddNew = 1';
								} else if (table === "MoneyExpenseApportion" && !model.xGet("moneyExpense").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyExpense").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyExpense").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyExpenseAddNew = 1';
								} else if (table === "MoneyLendApportion" && !model.xGet("moneyLend").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyLend").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyLend").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyLendAddNew = 1';
								} else if (table === "MoneyBorrowApportion" && !model.xGet("moneyBorrow").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyBorrow").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyBorrow").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyBorrowAddNew = 1';
								} else if (table === "MoneyPaybackApportion" && !model.xGet("moneyPayback").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyPayback").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyPayback").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyPaybackAddNew = 1';
								} else if (table === "MoneyReturnApportion" && !model.xGet("moneyReturn").xGet("project").isNew()) {
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyReturn").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyReturn").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyReturnAddNew = 1';
								} else if(!model.xGet("project").isNew()){
									sqlCheckPermission = 'SELECT p.id FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("project").xGet("id") + '" AND "' + model.xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShare' + table + 'AddNew = 1';
								}
							}
						}
					} else if (model.config.adapter.collection_name === "User") {
						ownerUserId = model.xGet("id");
					} else if (model.xGet("ownerUserId")) {
						ownerUserId = model.xGet("ownerUserId");
					} else {
						ownerUserId = "0";
					}
				}

				names.push("_creatorId");
				var _creatorId = Alloy.Models.User ? Alloy.Models.User.xGet("id") : '0';
				values.push(_creatorId);
				q.push("?");

				if (sqlCheckPermission) {
					console.info(sqlCheckPermission);
					var r = Alloy.Globals.DataStore.getReadDb().execute(sqlCheckPermission);
					if (r.rowCount === 0) {
						error = {
							__summary : {
								msg : "没有新增权限"
							}
						};
						delete model.id;
						delete opts.wait;
						return;
					}
					r.close();
					r = null;
				}

				var sqlInsert = "INSERT INTO " + table + " (" + names.join(",") + ") VALUES (" + q.join(",") + ");", sqlId = "SELECT last_insert_rowid();";
				if (!opts.dbTrans) {
					db = Alloy.Globals.DataStore.getWriteDb();
					// db = Ti.Database.open(dbName);
					// if (OS_ANDROID && Ti.Platform.Android.API_LEVEL >= 16){
					// db.execute("pragma journal_mode=WAL;");
					// }
					db.execute("BEGIN;");
				}
				db.execute(sqlInsert, values);
				if (!model.id) {
					var rs = db.execute(sqlId);
					if (rs.isValidRow()) {
						model.id = rs.field(0);
						attrObj[model.idAttribute] = model.id;
						model.set(attrObj, {
							silent : !0
						});
					} else
						Ti.API.warn("Unable to get ID from database for model: " + model.attributes);
				}

				// 只有本地创建的记录我们才在ClientSyncTable里添加新增记录， 本地创佳的记录 lastServerUpdateTime 都为空， 服务器获取下来的则不为空
				if (!opts.syncFromServer) {
					if (!model.xGet("lastServerUpdateTime") && _creatorId !== "0") {
						db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + model.id + "','" + model.config.adapter.collection_name + "','create','" + ownerUserId + "','" + _creatorId + "')");
					}
				}

				if (!opts.dbTrans) {
					db.execute("COMMIT;");
					//db.close();
				}
				return model.attributes;
			}();
			break;
		case "read":
			var sql = "SELECT main.* FROM " + table + " main";
			var qs = opts.query.split("qjkdasfllascordsdacmkludafouewqojmklvcxuioqew1234ewrokfjl;jklJLKJlkjlkjKNJKy	JKLKAS"), q, orderBy = "";
			if (qs.length > 0) {
				orderBy = qs[1] || "";
			}
			sql = qs[0];
			qs = qs[0].split("WHERE");
			if (_.indexOf(projectPermissionTables, table) > -1) {
				if (table === "Project") {
					qs[0] += " JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = 'Accept' AND main.id = joinedtable.projectId AND joinedtable.friendUserId = '" + Alloy.Models.User.xGet("id") + "'";
					//q = '(main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.id IN (SELECT projectId FROM ProjectShareAuthorization joinedtable WHERE joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '")) ';
				} else if (table === "MoneyExpenseCategory" || table === "MoneyIncomeCategory") {
					qs[0] += " LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = 'Accept' AND joinedtable.friendUserId = '" + Alloy.Models.User.xGet("id") + "' AND main.projectId = joinedtable.projectId ";
					//q = 'prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectId IS NOT NULL';
				} else if (table === "MoneyIncomeDetail") {
					qs[0] += ' JOIN MoneyIncome mi ON main.moneyIncomeId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					q = 'joinedtable.projectShare' + table + 'OwnerDataOnly = 0 OR (joinedtable.projectShare' + table + 'OwnerDataOnly = 1 AND main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '")';
				} else if (table === "MoneyExpenseDetail") {
					qs[0] += ' JOIN MoneyExpense mi ON main.moneyExpenseId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					q = 'joinedtable.projectShare' + table + 'OwnerDataOnly = 0 OR (joinedtable.projectShare' + table + 'OwnerDataOnly = 1 AND main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '")';
				} else if (table === "MoneyIncomeApportion") {
					qs[0] += ' JOIN MoneyIncome mi ON main.moneyIncomeId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					//q = 'joinedtable.projectShareMoneyIncomeDetailOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyIncomeDetailOwnerDataOnly = 1 AND main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '")';
					
            		q = 'joinedtable.projectShareMoneyIncomeDetailOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyIncomeDetailOwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.id IN (SELECT id FROM MoneyIncomeApportion WHERE moneyIncomeId = mi.id AND exists (SELECT miat.id FROM MoneyIncomeApportion miat JOIN MoneyIncome mit ON miat.moneyIncomeId = mit.id AND miat.friendUserId = "'+Alloy.Models.User.xGet("id")+'"))))';
				} else if (table === "MoneyExpenseApportion") {
					qs[0] += ' JOIN MoneyExpense mi ON main.moneyExpenseId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					//q = 'joinedtable.projectShareMoneyExpenseDetailOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyExpenseDetailOwnerDataOnly = 1 AND main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '")';
					
					q = 'joinedtable.projectShareMoneyExpenseDetailOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyExpenseDetailOwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.id IN (SELECT id FROM MoneyExpenseApportion WHERE moneyExpenseId = mi.id AND exists (SELECT miat.id FROM MoneyExpenseApportion miat JOIN MoneyExpense mit ON miat.moneyExpenseId = mit.id AND miat.friendUserId = "'+Alloy.Models.User.xGet("id")+'"))))';
				} else if (table === "MoneyLendApportion") {
					qs[0] += ' JOIN MoneyLend mi ON main.moneyLendId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					q = 'joinedtable.projectShareMoneyLendOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyLendOwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.id IN (SELECT id FROM MoneyLendApportion WHERE moneyLendId = mi.id AND exists (SELECT miat.id FROM MoneyLendApportion miat JOIN MoneyLend mit ON miat.moneyLendId = mit.id AND miat.friendUserId = "'+Alloy.Models.User.xGet("id")+'"))))';
				} else if (table === "MoneyBorrowApportion") {
					qs[0] += ' JOIN MoneyBorrow mi ON main.moneyBorrowId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					q = 'joinedtable.projectShareMoneyBorrowOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyBorrowOwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.id IN (SELECT id FROM MoneyBorrowApportion WHERE moneyBorrowId = mi.id AND exists (SELECT miat.id FROM MoneyBorrowApportion miat JOIN MoneyBorrow mit ON miat.moneyBorrowId = mit.id AND miat.friendUserId = "'+Alloy.Models.User.xGet("id")+'"))))';
				} else if (table === "MoneyPaybackApportion") {
					qs[0] += ' JOIN MoneyPayback mi ON main.moneyPaybackId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					q = 'joinedtable.projectShareMoneyPaybackOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyPaybackOwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.id IN (SELECT id FROM MoneyPaybackApportion WHERE moneyPaybackId = mi.id AND exists (SELECT miat.id FROM MoneyPaybackApportion miat JOIN MoneyPayback mit ON miat.moneyPaybackId = mit.id AND miat.friendUserId = "'+Alloy.Models.User.xGet("id")+'"))))';
				} else if (table === "MoneyReturnApportion") {
					qs[0] += ' JOIN MoneyReturn mi ON main.moneyReturnId = mi.id JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND mi.projectId = joinedtable.projectId ';
					q = 'joinedtable.projectShareMoneyReturnOwnerDataOnly = 0 OR (joinedtable.projectShareMoneyReturnOwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.id IN (SELECT id FROM MoneyReturnApportion WHERE moneyReturnId = mi.id AND exists (SELECT miat.id FROM MoneyReturnApportion miat JOIN MoneyReturn mit ON miat.moneyReturnId = mit.id AND miat.friendUserId = "'+Alloy.Models.User.xGet("id")+'"))))';
				} else {
					qs[0] += " JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = 'Accept' AND joinedtable.friendUserId = '" + Alloy.Models.User.xGet("id") + "' AND main.projectId = joinedtable.projectId ";
					//q = 'joinedtable.projectShare' + table + 'OwnerDataOnly = 0 OR (joinedtable.projectShare' + table + 'OwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '"))';
					
					q = 'joinedtable.projectShare' + table + 'OwnerDataOnly = 0 OR (joinedtable.projectShare' + table + 'OwnerDataOnly = 1 AND (main.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR main.friendUserId = "' + Alloy.Models.User.xGet("id") + '" OR exists (SELECT id FROM ' + table + 'Apportion WHERE ' + lcfirst(table) + 'Id = main.id AND friendUserId = "' + Alloy.Models.User.xGet("id") + '")))';
					
				}

				sql = qs[0];
				if (qs.length > 1) {
					if (q) {
						sql += " WHERE (" + qs[1] + ") AND (" + q + ")";
					} else {
						sql += " WHERE (" + qs[1] + ")";
					}
				} else if (q) {
					sql += " WHERE " + q;
				}
			} else if (table === "Currency") {

			} else if (table === "Picture") {

			} else if (table === "User") {

			} else if (table === "ProjectShareAuthorization") {
				q = "main.ownerUserId = '" + Alloy.Models.User.xGet("id") + "' OR EXISTS (SELECT id FROM ProjectShareAuthorization WHERE projectId = main.projectId AND friendUserId = '" + Alloy.Models.User.xGet("id") + "')";
				if (qs.length > 1) {
					sql = qs[0] + " WHERE (" + qs[1] + ") AND (" + q + ")";
				} else {
					sql = qs[0] + " WHERE " + q;
				}
			} else if (table === "MoneyAccount") {
				qs[0] = qs[0].replace(/main\.\*/ig, "main.id, main.name, main.currencyId, main.sharingType, main.ownerUserId, main.friendId, main.accountNumber, main.accountType, main.bankAddress, main.currentBalance, main.remark, main._creatorId, main.lastServerUpdateTime, main.serverRecordHash, main.lastClientUpdateTime");
				q = "main.ownerUserId = '" + Alloy.Models.User.xGet("id") + "'";
				if (qs.length > 1) {
					sql = qs[0] + " WHERE (" + qs[1] + ") AND (" + q + ")";
				} else {
					sql = qs[0] + " WHERE " + q;
				}

				var sql2, qs0 = "SELECT main.id, main.name, main.currencyId, main.sharingType, main.ownerUserId, main.friendId, main.accountNumber, main.accountType, main.bankAddress, null, null, null, main.lastServerUpdateTime, main.serverRecordHash, main.lastClientUpdateTime FROM MoneyAccount main ";
				q = "main.ownerUserId <> '" + Alloy.Models.User.xGet("id") + "' AND (main.sharingType = 'Public' OR (main.sharingType = 'Friend' AND EXISTS (SELECT id FROM Friend WHERE friendUserId = main.ownerUserId AND ownerUserId = '" + Alloy.Models.User.xGet("id") + "')))";
				if (qs.length > 1) {
					sql2 = qs0 + " WHERE (" + qs[1] + ") AND (" + q + ")";
				} else {
					sql2 = qs0 + " WHERE " + q;
				}
				sql += " UNION ALL " + sql2;
			} else {
				q = "main.ownerUserId = '" + Alloy.Models.User.xGet("id") + "'";
				if (qs.length > 1) {
					sql = qs[0] + " WHERE (" + qs[1] + ") AND (" + q + ")";
				} else {
					sql = qs[0] + " WHERE " + q;
				}
			}

			sql = sql + orderBy;

			// if (!opts.dbTrans) {
			// db = Ti.Database.open(dbName);
			// if (OS_ANDROID && Ti.Platform.Android.API_LEVEL >= 16){
			// db.execute("pragma journal_mode=WAL;");
			// }
			// }
			var rs = Alloy.Globals.DataStore.getReadDb().execute(sql), len = 0, values = [];
			while (rs.isValidRow()) {
				var o = {}, fc = 0;
				fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;
				_.times(fc, function(c) {
					var fn = rs.fieldName(c);
					o[fn] = rs.fieldByName(fn);
				});
				values.push(o);
				len++;
				rs.next();
			}
			rs.close();
			rs = null;
			// if (!opts.dbTrans) {
			// db.close();
			// }
			model.length = len;
			len === 1 ? resp = values[0] : resp = values;
			break;
		case "update":
			if (model.config.columns["lastClientUpdateTime"]) {
				model.attributes.lastClientUpdateTime = (new Date()).getTimeStamp();
			}
			var names = [], values = [], q = [];
			for (var k in columns) {
				// if(model.get(k) !== undefined){
				names.push(k + "=?");
				values.push(model.get(k));
				q.push("?");
				// }
			}

			var sql = "UPDATE " + table + " SET " + names.join(",") + " WHERE " + model.idAttribute + "=?";
			values.push(model.id);

			var sqlCheckPermission, sqlCheckPermission2;

			if (!opts.syncFromServer) {
				var ownerUserId = Alloy.Models.User.xGet("id");
				if (_.indexOf(projectPermissionTables, table) > -1 && table !== "Project") {
					// if(table === "Project"){
					// // 检查上级项目的共享中有没有允许我修改子项目的权限
					// } else
					if (table === "MoneyIncomeDetail") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyIncome mi ON mi.id = p.moneyIncomeId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShare' + table + 'Edit = 1)) ';
					} else if (table === "MoneyExpenseDetail") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyExpense mi ON mi.id = p.moneyExpenseId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShare' + table + 'Edit = 1)) ';
					} else if (table === "MoneyIncomeApportion") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyIncome mi ON mi.id = p.moneyIncomeId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShareMoneyIncomeDetailEdit = 1)) ';
					} else if (table === "MoneyExpenseApportion") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyExpense mi ON mi.id = p.moneyExpenseId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShareMoneyExpenseDetailEdit = 1)) ';
					} else if (table === "MoneyLendApportion") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyLend mi ON mi.id = p.moneyLendId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShareMoneyLendEdit = 1)) ';
					} else if (table === "MoneyBorrowApportion") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyBorrow mi ON mi.id = p.moneyBorrowId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShareMoneyBorrowEdit = 1)) ';
					} else if (table === "MoneyPaybackApportion") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyPayback mi ON mi.id = p.moneyPaybackId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShareMoneyPaybackEdit = 1)) ';
					} else if (table === "MoneyReturnApportion") {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN MoneyReturn mi ON mi.id = p.moneyReturnId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + ownerUserId + '" ' + 'AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShareMoneyReturnEdit = 1)) ';
					} else {
						sqlCheckPermission = 'SELECT p.id FROM ' + table + ' p JOIN Project prj ON prj.id = p.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + ownerUserId + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + 'AND (p.ownerUserId = "' + ownerUserId + '" ' + ' AND (prj.ownerUserId = "' + ownerUserId + '" OR joinedtable.projectShare' + table + 'Edit = 1)) ';
					}

					// if (model.hasChanged("projectId")) {
						// if (table === "Project") {
							// // 检查上级项目的共享中有没有允许我添加子项目的权限
						// } else {
							// // if (table === "MoneyExpenseCategory" || table === "MoneyIncomeCategory") {
							// // sqlCheckPermission2 = "SELECT main.id FROM Project main LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = 'Accept' AND joinedtable.friendUserId = '" + Alloy.Models.User.xGet("id") + "' AND main.projectId = joinedtable.projectId AND main.id = '" + model.xGet("projectId") + "'";
							// // } else
							// if (table === "MoneyIncomeDetail") {
								// sqlCheckPermission2 = 'SELECT p.* FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyIncome").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyIncome").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyIncomeAddNew = 1';
							// } else if (table === "MoneyExpenseDetail") {
								// sqlCheckPermission2 = 'SELECT p.* FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyExpense").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyExpense").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyExpenseAddNew = 1';
							// } else if (table === "MoneyIncomeApportion") {
								// sqlCheckPermission2 = 'SELECT p.* FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyIncome").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyIncome").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyIncomeAddNew = 1';
							// } else if (table === "MoneyExpenseApportion") {
								// sqlCheckPermission2 = 'SELECT p.* FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("moneyExpense").xGet("project").xGet("id") + '" AND "' + model.xGet("moneyExpense").xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShareMoneyExpenseAddNew = 1';
							// } else {
								// sqlCheckPermission2 = 'SELECT p.* FROM Project p LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND p.id = joinedtable.projectId AND joinedtable.friendUserId = "' + ownerUserId + '" ' + 'WHERE p.id = "' + model.xGet("project").xGet("id") + '" AND "' + model.xGet("ownerUser").xGet("id") + '" = "' + ownerUserId + '" AND joinedtable.projectShare' + table + 'AddNew = 1';
							// }
						// }
					// }
				} else if (table === "User") {

				} else if (table === "ProjectShareAuthorization") {
					// sql += ' AND (friendUserId = "' + ownerUserId + '" OR ownerUserId = "' + ownerUserId + '")';
				} else {
					sql += ' AND ownerUserId = "' + ownerUserId + '"';
				}
			}

			if (sqlCheckPermission) {
				var r = Alloy.Globals.DataStore.getReadDb().execute(sqlCheckPermission);
				if (r.rowCount === 0) {
					error = {
						__summary : {
							msg : "没有修改权限"
						}
					};
					delete opts.wait;
					r.close();
					r = null;
					break;
				}
				r.close();
				r = null;
			}

			if (sqlCheckPermission2) {
				var r = Alloy.Globals.DataStore.getReadDb().execute(sqlCheckPermission2);
				if (r.rowCount === 0) {
					error = {
						__summary : {
							msg : "没有修改权限"
						}
					};
					delete opts.wait;
					r.close();
					r = null;
					break;
				}
				r.close();
				r = null;
			}
			if (!opts.dbTrans) {
				db = Alloy.Globals.DataStore.getWriteDb();
				db.execute("BEGIN;");
			}
			db.execute(sql, values);
			if (db.rowsAffected === 0) {
				error = {
					__summary : {
						msg : "没有修改权限"
					}
				};
				delete opts.wait;
			} else {
				if (!opts.syncFromServer) {
					var r = Alloy.Globals.DataStore.getReadDb().execute("SELECT * FROM ClientSyncTable WHERE recordId = '" + model.id + "'");
					if (r.rowCount === 0) {
						db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + model.id + "','" + model.config.adapter.collection_name + "','update','" + ownerUserId + "','" + ownerUserId + "')");
					}
					r.close();
					r = null;
				}
				resp = model.attributes;
			}
			if (!opts.dbTrans) {
				db.execute("COMMIT;");
				//db.close();
			}
			break;
		case "delete":
			var sql = "DELETE FROM " + table + " WHERE " + model.idAttribute + "=?";

			if (!opts.syncFromServer) {
				if (_.indexOf(projectPermissionTables, table) > -1 && table !== "Project") {
					if (table === "MoneyIncomeDetail") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyIncome mi ON mi.id = p.moneyIncomeId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShare' + table + 'Edit = 1 OR joinedtable.projectShare' + table + 'Delete = 1)))';
					} else if (table === "MoneyExpenseDetail") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyExpense mi ON mi.id = p.moneyExpenseId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShare' + table + 'Edit = 1 OR joinedtable.projectShare' + table + 'Delete = 1)))';
					} else if (table === "MoneyIncomeApportion") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyIncome mi ON mi.id = p.moneyIncomeId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShareMoneyIncomeDetailEdit = 1 OR joinedtable.projectShareMoneyIncomeDetailDelete = 1)))';
					} else if (table === "MoneyExpenseApportion") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyExpense mi ON mi.id = p.moneyExpenseId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShareMoneyExpenseDetailEdit = 1 OR joinedtable.projectShareMoneyExpenseDetailDelete = 1)))';
					} else if (table === "MoneyLendApportion") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyLend mi ON mi.id = p.moneyLendId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShareMoneyLendEdit = 1 OR joinedtable.projectShareMoneyLendDelete = 1)))';
					} else if (table === "MoneyBorrowApportion") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyBorrow mi ON mi.id = p.moneyBorrowId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShareMoneyBorrowEdit = 1 OR joinedtable.projectShareMoneyBorrowDelete = 1)))';
					} else if (table === "MoneyPaybackApportion") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyPayback mi ON mi.id = p.moneyPaybackId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShareMoneyPaybackEdit = 1 OR joinedtable.projectShareMoneyPaybackDelete = 1)))';
					} else if (table === "MoneyReturnApportion") {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN MoneyReturn mi ON mi.id = p.moneyReturnId JOIN Project prj ON prj.id = mi.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShareMoneyReturnEdit = 1 OR joinedtable.projectShareMoneyReturnDelete = 1)))';
					} else {
						sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN Project prj ON prj.id = p.projectId LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '" AND prj.id = joinedtable.projectId ' + 'WHERE p.id = "' + model.id + '" ' + ' AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' + 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShare' + table + 'Delete = 1))) ';
					}

					// sql += ' AND id = (SELECT p.id FROM ' + table + ' p JOIN Project prj ON p.projectId = prj.id LEFT JOIN ProjectShareAuthorization joinedtable ON joinedtable.state = "Accept" AND joinedtable.friendUserId = "' + Alloy.Models.User.xGet("id") + '") joinedtable ON prj.id = joinedtable.projectId ' +
					// 'WHERE p.id = "' + model.id + '" ' +
					// 'AND (p.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" ' +
					// 'AND (prj.ownerUserId = "' + Alloy.Models.User.xGet("id") + '" OR joinedtable.projectShare' + table + 'Delete = 1))) ';
				} else {
					sql += ' AND ownerUserId = "' + Alloy.Models.User.xGet("id") + '"';
				}
			}
			if (!opts.dbTrans) {
				db = Alloy.Globals.DataStore.getWriteDb();
				db.execute("BEGIN;");
			}
			db.execute(sql, model.id);
			if (db.rowsAffected === 0) {
				if (!opts.dbTrans) {
					db.execute("ROLLBACK;");
				}
				error = {
					__summary : {
						msg : "没有删除权限"
					}
				};
			} else {
				if (!opts.syncFromServer) {
					var r = Alloy.Globals.DataStore.getReadDb().execute("SELECT * FROM ClientSyncTable WHERE operation = 'create' AND recordId = '" + model.id + "'");
					if (r.rowCount > 0) {
						db.execute("DELETE FROM ClientSyncTable WHERE recordId = '" + model.id + "'");
					} else {
						r.close();
						r = null;
						r = Alloy.Globals.DataStore.getReadDb().execute("SELECT * FROM ClientSyncTable WHERE operation = 'update' AND recordId = '" + model.id + "'");
						if (r.rowCount > 0) {
							db.execute("Update ClientSyncTable SET operation = 'delete' WHERE recordId = '" + model.id + "'");
						} else {
							r.close();
							r = null;
							r = Alloy.Globals.DataStore.getReadDb().execute("SELECT * FROM ClientSyncTable WHERE operation = 'delete' AND recordId = '" + model.id + "'");
							if (r.rowCount === 0) {
								db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + model.id + "','" + model.config.adapter.collection_name + "','delete','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
							}
						}
					}
					r.close();
					r = null;
				}
				// backbonejs needs this id to remove the model from collection
				// model.id = null;
				resp = model.attributes;
				if (!opts.dbTrans) {
					db.execute("COMMIT;");
				}
			}
		// if (!opts.dbTrans) {
		// db.close();
		// }
	}
	if (resp) {
		if (method !== "read") {
			resp = resp.lastClientUpdateTime ? {
				lastClientUpdateTime : resp.lastClientUpdateTime
			} : null;
		}
		if (opts.dbTrans) {
			if (opts.commit === true) {
				opts.dbTrans.commit();
				_.isFunction(opts.success) && opts.success(resp);
				if (method === "read") {
					model.trigger("fetch", model);
				}
			} else {
				function commitTrans() {
					opts.dbTrans.off("commit", commitTrans);
					opts.dbTrans.off("rollback", rollbackTrans);
					_.isFunction(opts.success) && opts.success(resp);
					if (method === "read") {
						model.trigger("fetch", model);
					}
				}

				function rollbackTrans() {
					opts.dbTrans.off("commit", commitTrans);
					opts.dbTrans.off("rollback", rollbackTrans);
					_.isFunction(opts.error) && opts.error(model, {
						__summary : {
							msg : "出错了，操作失败。"
						}
					});
				}


				opts.dbTrans.on("commit", commitTrans);
				opts.dbTrans.on("rollback", rollbackTrans);
			}
		} else {
			_.isFunction(opts.success) && opts.success(resp);
			if (method === "read") {
				model.trigger("fetch", model);
			} else {
				Ti.App.fireEvent("updateSyncCount");
			}
		}
	} else {
		_.isFunction(opts.error) && opts.error(model, error);
	}
}

function lcfirst(table) {
	return "m" + table.substring(1);
}

function GetMigrationFor(dbname, table) {
	var mid = null, db = Ti.Database.open(dbname);
	db.execute("CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT);");
	var rs = db.execute("SELECT latest FROM migrations where model = ?;", table);
	if (rs.isValidRow())
		var mid = rs.field(0) + "";
	rs.close();
	db.close();
	return mid;
}

function Migrate(Model) {
	var migrations = Model.migrations || [], lastMigration = {};
	migrations.length && migrations[migrations.length - 1](lastMigration);
	var config = Model.prototype.config;
	config.adapter.db_name || (config.adapter.db_name = ALLOY_DB_DEFAULT);
	var migrator = new Migrator(config), targetNumber = typeof config.adapter.migration == "undefined" || config.adapter.migration === null ? lastMigration.id : config.adapter.migration;
	if ( typeof targetNumber == "undefined" || targetNumber === null) {
		var tmpDb = Ti.Database.open(config.adapter.db_name);
		migrator.db = tmpDb;
		migrator.createTable(config);
		tmpDb.close();
		return;
	}
	targetNumber += "";
	var currentNumber = GetMigrationFor(config.adapter.db_name, config.adapter.collection_name), direction;
	if (currentNumber === targetNumber)
		return;
	if (currentNumber && currentNumber > targetNumber) {
		direction = 0;
		migrations.reverse();
	} else
		direction = 1;
	db = Ti.Database.open(config.adapter.db_name);
	migrator.db = db;
	db.execute("BEGIN;");
	if (migrations.length)
		for (var i = 0; i < migrations.length; i++) {
			var migration = migrations[i], context = {};
			migration(context);
			if (direction) {
				if (context.id > targetNumber)
					break;
				if (context.id <= currentNumber)
					continue;
			} else {
				if (context.id <= targetNumber)
					break;
				if (context.id > currentNumber)
					continue;
			}
			var funcName = direction ? "up" : "down";
			_.isFunction(context[funcName]) && context[funcName](migrator);
		}
	else
		migrator.createTable(config);
	db.execute("DELETE FROM migrations where model = ?", config.adapter.collection_name);
	db.execute("INSERT INTO migrations VALUES (?,?)", targetNumber, config.adapter.collection_name);
	db.execute("COMMIT;");
	db.close();
	migrator.db = null;
}

function installDatabase(config) {
	var dbFile = config.adapter.db_file, table = config.adapter.collection_name, rx = /^([\/]{0,1})([^\/]+)\.[^\/]+$/, match = dbFile.match(rx);
	if (match === null)
		throw "Invalid sql database filename \"" + dbFile + "\"";
	var dbName = config.adapter.db_name = match[2];
	Ti.API.debug("Installing sql database \"" + dbFile + "\" with name \"" + dbName + "\"");
	var db = Ti.Database.install(dbFile, dbName);
	var db = Ti.Database.install(dbFile, dbName);
	if (false === config.adapter.remoteBackup && false) {
		Ti.API.debug('iCloud "do not backup" flag set for database "' + dbFile + '"');
		db.file.setRemoteBackup(false);
	}
	var rs = db.execute("pragma table_info(\"" + table + "\");"), columns = {};
	while (rs.isValidRow()) {
		var cName = rs.fieldByName("name"), cType = rs.fieldByName("type");
		columns[cName] = cType;
		cName === ALLOY_ID_DEFAULT && !config.adapter.idAttribute && (config.adapter.idAttribute = ALLOY_ID_DEFAULT);
		rs.next();
	}
	config.columns = columns;
	rs.close();
	if (config.adapter.idAttribute) {
		if (!_.contains(_.keys(config.columns), config.adapter.idAttribute))
			throw "config.adapter.idAttribute \"" + config.adapter.idAttribute + "\" not found in list of columns for table \"" + table + "\"\n" + "columns: [" + _.keys(config.columns).join(",") + "]";
	} else {
		Ti.API.info("No config.adapter.idAttribute specified for table \"" + table + "\"");
		Ti.API.info("Adding \"" + ALLOY_ID_DEFAULT + "\" to uniquely identify rows");
		var fullStrings = [], colStrings = [];
		_.each(config.columns, function(type, name) {
			colStrings.push(name);
			fullStrings.push(name + " " + type);
		});
		var colsString = colStrings.join(",");
		db.execute("ALTER TABLE " + table + " RENAME TO " + table + "_temp;");
		db.execute("CREATE TABLE " + table + "(" + fullStrings.join(",") + "," + ALLOY_ID_DEFAULT + " TEXT UNIQUE);");
		db.execute("INSERT INTO " + table + "(" + colsString + "," + ALLOY_ID_DEFAULT + ") SELECT " + colsString + ",CAST(_ROWID_ AS TEXT) FROM " + table + "_temp;");
		db.execute("DROP TABLE " + table + "_temp;");
		config.columns[ALLOY_ID_DEFAULT] = "TEXT UNIQUE";
		config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	}
	db.close();
}

var _ = require("alloy/underscore")._, ALLOY_DB_DEFAULT = "_alloy_", ALLOY_ID_DEFAULT = "alloy_id", cache = {
	config : {},
	Model : {}
};

module.exports.beforeModelCreate = function(config, name) {
	if (cache.config[name]) {
		if (cache.config[name].db_name === Alloy.Globals.DataStore.getDbName()) {
			return cache.config[name];
		} else {
			config.adapter.db_name = Alloy.Globals.currentUserDatabaseName;
			cache.Model[name] = null;
			delete cache.Model[name];
		}
	}
	if (Ti.Platform.osname === "mobileweb" || typeof Ti.Database == "undefined")
		throw "No support for Titanium.Database in MobileWeb environment.";
	config.adapter.idAttribute = "id";
	if (!config.adapter.db_name) {
		config.adapter.db_name = Alloy.Globals.DataStore.getDbName();
	}
	config.adapter.collection_name = name;
	config.adapter.db_file && installDatabase(config);
	// if (!config.adapter.idAttribute) {
	// Ti.API.info("No config.adapter.idAttribute specified for table \"" + config.adapter.collection_name + "\"");
	// Ti.API.info("Adding \"" + ALLOY_ID_DEFAULT + "\" to uniquely identify rows");
	// config.columns[ALLOY_ID_DEFAULT] = "TEXT UNIQUE";
	// config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	// }
	cache.config[name] = config;
	return config;
};

module.exports.afterModelCreate = function(Model, name) {
	if (cache.Model[name])
		return cache.Model[name];
	Model || ( Model = {});
	Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
	// _.extend(Model.prototype, XModel);
	Migrate(Model);
	cache.Model[name] = Model;
	return Model;
};

// module.exports.afterCollectionCreate = function(Collection) {
// if (cache.Collection[Collection.prototype.config.adapter.collection_name])
// return cache.Collection[Collection.prototype.config.adapter.collection_name];
// Collection || ( Collection = {});
// // _.extend(Collection.prototype, XCollection);
// cache.Collection[Collection.prototype.config.adapter.collection_name] = Collection;
// return Collection;
// }

module.exports.sync = Sync;
