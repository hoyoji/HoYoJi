exports.definition = {
    config: {
        columns: {
            id: "TEXT NOT NULL PRIMARY KEY",
            userName: "TEXT UNIQUE NOT NULL",
            nickName: "TEXT",
            password: "TEXT NOT NULL",
            activeProjectId: "TEXT NOT NULL",
            activeCurrencyId: "TEXT NOT NULL",
            activeMoneyAccountId: "TEXT NOT NULL",
            friendAuthorization: "TEXT NOT NULL",
            defaultFriendCategoryId: "TEXT NOT NULL",
            messageBoxId: "TEXT NOT NULL"
        },
        defaults: {
            userName: "",
            friendAuthorization: "required"
        },
        hasMany: {
            projects: {
                type: "Project",
                attribute: "ownerUser"
            },
            friendCategories: {
                type: "FriendCategory",
                attribute: "ownerUser"
            },
            currencies: {
                type: "Currency",
                attribute: "ownerUser"
            },
            moneyAccounts: {
                type: "MoneyAccount",
                attribute: "ownerUser"
            },
            exchanges: {
                type: "Exchange",
                attribute: "ownerUser"
            }
        },
        belongsTo: {
            activeProject: {
                type: "Project",
                attribute: null
            },
            activeCurrency: {
                type: "Currency",
                attribute: null
            },
            activeMoneyAccount: {
                type: "MoneyAccount",
                attribute: null
            },
            defaultFriendCategory: {
                type: "FriendCategory",
                attribute: null
            },
            messageBox: {
                type: "MessageBox",
                attribute: null
            }
        },
        rowView: "user/userRow",
        adapter: {
            collection_name: "User",
            idAttribute: "id",
            type: "sql",
            db_name: "hoyoji"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, Alloy.Globals.XModel, {
            validators: {
                userName: function(xValidateComplete) {
                    this.isNew() || this.hasChanged("userName") && xValidateComplete({
                        msg: "用户名不能被修改"
                    });
                    xValidateComplete();
                },
                password: function(xValidateComplete) {
                    var error;
                    if (!this.has("password") || this.get("password").length < 6) error = {
                        msg: "请输入至少六位数的密码"
                    };
                    xValidateComplete(error);
                },
                password2: function(xValidateComplete) {
                    var error;
                    !this.has("password2") || this.get("password2").length < 6 ? error = {
                        msg: "请输入至少六位数的密码"
                    } : this.get("password2") !== this.get("password") && (error = {
                        msg: "两次输入的密码不一样"
                    });
                    xValidateComplete(error);
                }
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, Alloy.Globals.XCollection, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("User", exports.definition, []);

collection = Alloy.C("User", exports.definition, model);

exports.Model = model;

exports.Collection = collection;