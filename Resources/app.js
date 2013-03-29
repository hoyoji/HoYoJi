var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.MenuSections = [];

Alloy.Globals.openingWindow = {};

_.extend(Alloy.Globals, require("utils").Utils);

Alloy.Globals.XModel = require("XModel").XModel;

Alloy.Globals.XCollection = require("XCollection").XCollection;

Alloy.Globals.Server = require("Server").Server;

Alloy.Globals.DataStore = require("DataStore").DataStore;

Alloy.Globals.extendsBaseUIController = require("BaseUIController").extends;

Alloy.Globals.extendsBaseAutoUpdateController = require("BaseAutoUpdateController").extends;

Alloy.Globals.extendsBaseViewController = require("BaseViewController").extends;

Alloy.Globals.extendsBaseRowController = require("BaseRowController").extends;

Alloy.Globals.extendsBaseFormController = require("BaseFormController").extends;

Alloy.Globals.extendsBaseWindowController = require("BaseWindowController").extends;

Alloy.createController("index");