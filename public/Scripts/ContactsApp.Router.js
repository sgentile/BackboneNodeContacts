/******  ROUTER ******/
ViewSwitcherApp.Router = Backbone.Router.extend({
	routes: {
		"": "defaultRoute"
	},
	defaultRoute: function () {
		ViewSwitcherApp.Contacts.show();
	}
	//    ,
	//    addViewRoute : function () {
	//        ViewSwitcherApp.Contacts.show();
	//    },
	//	viewone: function () {
	//		ViewSwitcherApp.ViewOne.show();
	//	},
	//	viewtwo: function () {
	//		ViewSwitcherApp.ViewTwo.show();
	//	}
});

ViewSwitcherApp.showRoute = function (route) {
	ViewSwitcherApp.router.navigate(route, false);
};

ViewSwitcherApp.addInitializer(function () {
	ViewSwitcherApp.router = new ViewSwitcherApp.Router();
});