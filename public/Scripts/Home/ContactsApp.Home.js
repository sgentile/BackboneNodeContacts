/**
 * Created by JetBrains WebStorm.
 * User: stevegentile
 * Date: 12/24/11
 * Time: 3:46 PM
 * To change this template use File | Settings | File Templates.
 */
ViewSwitcherApp.Home = (function(ViewSwitcherApp, Backbone){
    var Home = {};
    Home.HomeView = Backbone.View.extend({
        template:"#home-template"
    });
    Home.show = function(){
        ViewSwitcherApp.mainRegion.show(new Home.HomeView());
        ViewSwitcherApp.showRoute("");
    };
    return Home;
})(ViewSwitcherApp, Backbone);
