Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.$model.xSet("localCurrency", Alloy.Models.User.xGet("activeCurrency"));

$.localCurrency.UIInit($, $.getCurrentWindow());
$.foreignCurrency.UIInit($, $.getCurrentWindow());
$.rate.UIInit($, $.getCurrentWindow());
$.autoUpdate.UIInit($, $.getCurrentWindow());
