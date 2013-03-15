exports.definition = {
    config: {
        columns: {
            id: "TEXT NOT NULL PRIMARY KEY",
            ownerUserId: "TEXT NOT NULL"
        },
        belongsTo: {
            ownerUser: {
                type: "User",
                attribute: null
            }
        },
        hasMany: {
            messages: {
                type: "Message",
                attribute: "messageBox"
            }
        },
        adapter: {
            collection_name: "MessageBox",
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

model = Alloy.M("MessageBox", exports.definition, []);

collection = Alloy.C("MessageBox", exports.definition, model);

exports.Model = model;

exports.Collection = collection;