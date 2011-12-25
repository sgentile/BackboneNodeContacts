/******  ROUTER ******/
ViewSwitcherApp.Router = Backbone.Router.extend({
	routes: {
		"": "defaultRoute",
        "contacts": "contacts"
	},
    contacts : function(){
        ViewSwitcherApp.Contacts.show();
    },
	defaultRoute: function () {
        ViewSwitcherApp.Home.show();
	}
});

ViewSwitcherApp.showRoute = function (route) {
	ViewSwitcherApp.router.navigate(route, false);
};

ViewSwitcherApp.addInitializer(function () {
	ViewSwitcherApp.router = new ViewSwitcherApp.Router();
});