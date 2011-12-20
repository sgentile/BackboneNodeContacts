/// <reference path="Thirdparty/backbone.js" />
/// <reference path="Thirdparty/backbone.marionette.js" />
/// <reference path="Thirdparty/backbone.modelbinding.js" />
/// <reference path="Thirdparty/jquery-ui-1.8.16.js" />

/******  APP ******/
var ViewSwitcherApp = {};

Backbone.View.prototype.render = function() {
	var html = $(this.template).tmpl();
	$(this.el).html(html);
};

ViewSwitcherApp = new Backbone.Marionette.Application();

ViewSwitcherApp.addRegions({
	contactsRegion: "#contactsRegion",
	mainRegion: "#mainRegion",
	editContactsModalRegion: "#editContactsModalRegion"
});

ViewSwitcherApp.bind("initialize:after", function () {
	if (Backbone.history) {
		Backbone.history.start();
	}
});





/******  START THE APP! ******/

$(function() {
	ViewSwitcherApp.start();
}); 