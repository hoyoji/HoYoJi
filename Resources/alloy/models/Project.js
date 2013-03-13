exports.definition = {
    config: {
        columns: {
            id: "TEXT NOT NULL PRIMARY KEY",
            name: "TEXT NOT NULL",
            ownerUserId: "TEXT NOT NULL",
            parentProjectId: "TEXT"
        },
        belongsTo: {
            ownerUser: {
                type: "User",
                attribute: "projects"
            },
            parentProject: {
                type: "Project",
                attribute: "subProjects"
            }
        },
        hasMany: {
            moneyExpenseCategories: {
                type: "MoneyExpenseCategory",
                attribute: "project"
            },
            subProjects: {
                type: "Project",
                attribute: "parentProject"
            }
        },
        rowView: "project/projectRow",
        adapter: {
            collection_name: "Project",
            idAttribute: "id",
            type: "sql",
            db_name: "hoyoji"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, Alloy.Globals.XModel, {
            validators: {}
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, Alloy.Globals.XCollection, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("Project", exports.definition, []);

collection = Alloy.C("Project", exports.definition, model);

exports.Model = model;

exports.Collection = collection;