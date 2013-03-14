exports.definition = {
    config: {
        columns: {
            id: "TEXT NOT NULL PRIMARY KEY",
            name: "TEXT NOT NULL",
            ownerUserId: "TEXT NOT NULL",
            parentFriendCategoryId: "TEXT"
        },
        belongsTo: {
            ownerUser: {
                type: "User",
                attribute: "friendCategories"
            },
            parentFriendCategory: {
                type: "FriendCategory",
                attribute: "subFriendCategories"
            }
        },
        hasMany: {
            subFriendCategories: {
                type: "FriendCategory",
                attribute: "parentFriendCategory"
            }
        },
        rowView: "friend/friendCategoryRow",
        adapter: {
            collection_name: "FriendCategory",
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

model = Alloy.M("FriendCategory", exports.definition, []);

collection = Alloy.C("FriendCategory", exports.definition, model);

exports.Model = model;

exports.Collection = collection;