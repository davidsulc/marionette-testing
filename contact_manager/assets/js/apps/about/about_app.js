ContactManager.module("AboutApp", function(AboutApp, ContactManager, Backbone, Marionette, $, _){
  AboutApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "about" : "showAbout"
    }
  });

  AboutApp._API = {
    showAbout: function(){
      AboutApp.Show.Controller.showAbout();
      ContactManager.execute("set:active:header", "about");
    }
  };

  ContactManager.on("about:show", function(){
    ContactManager.navigate("about");
    AboutApp._API.showAbout();
  });

  AboutApp.onStart = function(){
    new AboutApp.Router({
      controller: AboutApp._API
    });
  };
});
