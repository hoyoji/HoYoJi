exports.definition = {
	config : {
		columns : {
			id : "TEXT NOT NULL PRIMARY KEY",
			name : "TEXT NOT NULL",
			ownerUserId : "TEXT NOT NULL",
			parentProjectId : "TEXT",
			defaultIncomeCategoryId : "TEXT",
			defaultExpenseCategoryId : "TEXT",
			projectSharedById : "TEXT"
		},
		// defaults : {
			// name : "",
		// },
		belongsTo : {
			ownerUser : { type : "User", attribute : "projects" },
			parentProject : { type : "Project", attribute : "subProjects" },
			defaultIncomeCategory : {type : "MoneyIncomeCategory", attribute : null},
			defaultExpenseCategory : {type : "MoneyExpenseCategory", attribute : null},
			projectSharedBy : {type : "ProjectShareAuthorization", attribute : null}
		},
		hasMany : {
			moneyExpenseCategories : { type : "MoneyExpenseCategory", attribute : "project"},
			moneyIncomeCategories : { type : "MoneyIncomeCategory", attribute : "project"},
			subProjects : { type : "Project", attribute : "parentProject" },
			projectShareAuthorizations : { type : "ProjectShareAuthorization", attribute : "project" }
		},
		rowView : "project/projectRow",
		adapter : {
			type : "hyjSql"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			validators : {
				// name : function(xValidateComplete){
					// var error;
					// if(!this.has("name") || this.get("name").length <= 0){
						// error = {msg : "请输入项目名称"};
					// }
					// xValidateComplete(error);
				// }
			},
			xGet : function(attr) {
				var projectSharedBy = Model.prototype.xGet.call(this, "projectSharedBy");
				if(projectSharedBy){
					return Model.prototype.xGet.call(projectSharedBy.xGet("project"), attr);
				} else {
					return Model.prototype.xGet.call(this, attr);
				}
			},
			xSave : function(options) {
				var projectSharedBy = Model.prototype.xGet.call(this, "projectSharedBy");
				if(projectSharedBy){
					return Model.prototype.xSave.call(projectSharedBy.xGet("project"), options);
				} else {
					return Model.prototype.xSave.call(this, options);
				}
			},
			xAddToSave : function(saveableController) {
				var projectSharedBy = Model.prototype.xGet.call(this, "projectSharedBy");
				if(projectSharedBy){
					return Model.prototype.xAddToSave.call(projectSharedBy.xGet("project"), saveableController);
				} else {
					return Model.prototype.xAddToSave.call(this, saveableController);
				}
			},
			xSet : function(a, b, c) {
				var projectSharedBy = Model.prototype.xGet.call(this, "projectSharedBy");
				if(projectSharedBy){
					return Model.prototype.xSet.call(projectSharedBy.xGet("project"), a, b, c);
				} else {
					return Model.prototype.xSet.call(this, a, b, c);
				}
			},			
			xGetDescendents : function(attribute) {
				var projectSharedBy = Model.prototype.xGet.call(this, "projectSharedBy");
				if(projectSharedBy){
					alert("we.should.not.use.this on shared project");
					return null;
					// return Model.prototype.xGetDescendents.call(projectSharedBy.xGet("project"), attribute);
				} else {
					return Model.prototype.xGetDescendents.call(this, attribute);
				}
			},
			xGetAncestors : function(attribute) {
				var projectSharedBy = Model.prototype.xGet.call(this, "projectSharedBy");
				if(projectSharedBy){
					alert("we.should.not.use.this on shared project");
					return null;
					// return Model.prototype.xGetAncestors.call(projectSharedBy.xGet("project"), attribute);
				} else {
					return Model.prototype.xGetAncestors.call(this, attribute);
				}
			},
			xDelete : function(xFinishCallback) {
				if(!this.xGet("projectSharedBy")){
					xFinishCallback({ msg : "不能移除共享来的项目"});
				}else if(this.xGet("projectShareAuthorizations").length > 0){
					xFinishCallback({ msg : "项目共享给好友,请移除共享再删除"});
				}else{
					this._xDelete(xFinishCallback);
				}
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});
		return Collection;
	}
}
