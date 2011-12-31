/******  ROUTER ******/
ViewSwitcherApp.Router = Backbone.Router.extend({
	routes: {
		"": "defaultRoute",
        "contacts": "contacts",
        "details/:id": "details"
	},
    contacts : function(){
        ViewSwitcherApp.Contacts.show();
    },
	defaultRoute: function () {
        ViewSwitcherApp.Home.show();
	},
	details : function(id){
		ViewSwitcherApp.Contacts.show(id);
	}
});

ViewSwitcherApp.showRoute = function (route) {
	ViewSwitcherApp.router.navigate(route, false);
};

ViewSwitcherApp.addInitializer(function () {
	ViewSwitcherApp.router = new ViewSwitcherApp.Router();
});