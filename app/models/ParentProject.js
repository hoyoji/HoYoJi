exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    parentProjectId : "TEXT",
		    projectId : "TEXT",
			ownerUserId : "TEXT",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			project : {type : "Project", attribute : null},
			parentProject : {type : "Project", attribute : null},
			ownerUser : {type : "User", attribute : null}
		},
		adapter: {
			type: "hyjSql"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			// extended functions and properties go here
			// syncAddNew : function(record, dbTrans) {
				// dbTrans.newExchangesFromServer[record.projectId] = true;
// 				
				// var projectRemark = Alloy.createModel("ProjectRemark").xFindInDb({
					// projectId : record.projectId
				// });
				// if (projectRemark.id) {
					// // 该项目的备注名已经存在，我们更新存在的备注名
					// if(this.lastClientUpdateTime < record.lastClientUpdateTime){
						// // 将服务器上的删除
						// dbTrans.db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + record.id + "','ProjectRemark','delete','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
						// // 服務器上的记录较新，我们用服务器上的更新本地的
						// delete record.id;
						// projectRemark._syncUpdate(record, dbTrans);
						// return false; // tell the server not to add it as new
					// } else {
						// // 本地的较新，我们用服务器上的，把本地的删掉
						// projectRemark.xDelete(null, {
							// dbTrans : dbTrans,
							// wait : true
						// });
					// }
				// }
			// },
			// syncUpdate : function(record, dbTrans) {
				// var projectRemark = Alloy.createModel("ProjectRemark").xFindInDb({
					// projectId : record.projectId
				// });
				// if (projectRemark.id && projectRemark.id !== record.id) {
					// // 该项目的备注名已经存在，把本地的删掉
					// projectRemark.xDelete(null, {
						// dbTrans : dbTrans,
						// wait : true
					// });
				// }
				// if(projectRemark.xGet("remark") !== record.remark){
					// projectRemark.once("sync", function(){
						// projectRemark.xGet("project").xRefresh();
					// });
				// }
			// }
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, Alloy.Globals.XCollection,  {
			// extended functions and properties go here
		});

		return Collection;
	}
};