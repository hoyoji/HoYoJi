var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

_.extend(Alloy.Globals, require("utils").Utils);

Alloy.Globals.extendsBaseUIController = require("BaseUIController").extends;

Alloy.Globals.extendsBaseAutoUpdateController = require("BaseAutoUpdateController").extends;

Alloy.Globals.extendsBaseViewController = require("BaseViewController").extends;

Alloy.Globals.extendsBaseRowController = require("BaseRowController").extends;

Alloy.Globals.extendsBaseFormController = require("BaseFormController").extends;

Alloy.Globals.extendsBaseWindowController = require("BaseWindowController").extends;

Alloy.Globals.XModel = require("XModel").XModel;

Alloy.Globals.XCollection = require("XCollection").XCollection;

Alloy.Globals.initStore = function() {
    for (var c in Alloy.Collections) {
        if (c === "instance") continue;
        Alloy.Collections[c] = null;
        delete Alloy.Collections[c];
        Alloy.Collections.instance(c);
    }
    for (var m in Alloy.Models) {
        if (m === "instance") continue;
        Alloy.Models[m] = null;
        delete Alloy.Models[m];
        Alloy.Models.instance(m);
    }
};

Alloy.Collections.instance("User");

Alloy.Collections.instance("Project");

Alloy.Collections.instance("MoneyExpenseCategory");

Alloy.Collections.instance("MoneyIncomeCategory");

Alloy.Collections.instance("FriendCategory");
<<<<<<< HEAD

Alloy.Collections.instance("Currency");
=======
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26

Alloy.createController("index");