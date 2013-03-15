exports.definition = {
    config: {
        columns: {
            id: "TEXT NOT NULL PRIMARY KEY",
            nickName: "TEXT",
            remark: "TEXT",
            friendUserId: "TEXT NOT NULL",
            friendCategoryId: "TEXT NOT NULL"
        },
        belongsTo: {
            friendCategory: {
                type: "FriendCategory",
                attribute: "friends"
            },
            friendUser: {
                type: "User",
                attribute: null
            }
        },
        hasMany: {},
        rowView: "friend/friendRow",
        adapter: {
            collection_name: "Friend",
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

model = Alloy.M("Friend", exports.definition, []);

collection = Alloy.C("Friend", exports.definition, model);

exports.Model = model;

exports.Collection = collection;