exports.definition = {
    config: {
        columns: {
            id: "TEXT NOT NULL PRIMARY KEY",
            name: "TEXT NOT NULL",
            symbol: "TEXT NOT NULL",
            code: "TEXT NOT NULL",
            ownerUserId: "TEXT NOT NULL"
        },
        belongsTo: {
            ownerUser: {
                type: "User",
                attribute: "currencies"
            }
        },
        rowView: "setting/currency/currencyRow",
        adapter: {
            collection_name: "Currency",
            idAttribute: "id",
            type: "sql",
            db_name: "hoyoji"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, Alloy.Globals.XModel, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, Alloy.Globals.XCollection, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("Currency", exports.definition, []);

collection = Alloy.C("Currency", exports.definition, model);

exports.Model = model;

exports.Collection = collection;