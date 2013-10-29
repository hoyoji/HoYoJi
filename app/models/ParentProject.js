exports.definition = {
	config: {
		columns: {
		    id: "TEXT UNIQUE NOT NULL PRIMARY KEY",
		    parentProjectId : "TEXT",
		    subProjectId : "TEXT",
			ownerUserId : "TEXT",
			serverRecordHash : "TEXT",
			lastServerUpdateTime : "TEXT",
			lastClientUpdateTime : "INTEGER"
		},
		belongsTo : {
			parentProject : {type : "Project", attribute : "parentProject"},
			subProject : {type : "Project", attribute : "subProject"},
			ownerUser : {type : "User", attribute : "parentProjects"}
		},
		adapter: {
			type: "hyjSql"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, Alloy.Globals.XModel,  {
			// extended functions and properties go here
			syncAddNew : function(record, dbTrans) {
				var parentProject = Alloy.createModel("ParentProject").xFindInDb({
					subProjectId : record.subProjectId,
					parentProjectId : record.parentprojectId
				});
				if (parentProject.id) {
					// 该项目的备注名已经存在，我们更新存在的备注名
					if(this.lastClientUpdateTime < record.lastClientUpdateTime){
						// 将服务器上的删除
						dbTrans.db.execute("INSERT INTO ClientSyncTable(id, recordId, tableName, operation, ownerUserId, _creatorId) VALUES('" + guid() + "','" + record.id + "','ParentProject','delete','" + Alloy.Models.User.xGet("id") + "','" + Alloy.Models.User.xGet("id") + "')");
						// 服務器上的记录较新，我们用服务器上的更新本地的
						delete record.id;
						parentProject._syncUpdate(record, dbTrans);
						return false; // tell the server not to add it as new
					} else {
						// 本地的较新，我们用服务器上的，把本地的删掉
						parentProject.xDelete(null, {
							dbTrans : dbTrans,
							wait : true
						});
					}
				}
			},
			syncUpdate : function(record, dbTrans) {
				var parentProject = Alloy.createModel("ParentProject").xFindInDb({
					subProjectId : record.subProjectId,
					parentProjectId : record.parentprojectId
				});
				if (parentProject.id && parentProject.id !== record.id) {
					// 该项目的备注名已经存在，把本地的删掉
					parentProject.xDelete(null, {
						dbTrans : dbTrans,
						wait : true
					});
				}
			}
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