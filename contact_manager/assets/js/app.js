var ContactManager = new Marionette.Application();

ContactManager.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

ContactManager.getCurrentRoute = function(){
  return Backbone.history.fragment
};

ContactManager.RegionContainer = Marionette.LayoutView.extend({
  el: "#app-container",

  regions: {
    header: "#header-region",
    main: "#main-region",
    dialog: "#dialog-region"
  }
});

ContactManager._configureRegions = function(){
  this.regions = new ContactManager.RegionContainer();
};

ContactManager.on("before:start", function(){
  ContactManager._configureRegions();
  ContactManager.regions.dialog.onShow = function(view){
    var self = this;
    var closeDialog = function(){
      self.stopListening();
      self.empty();
      self.$el.dialog("destroy");
    };

    this.listenTo(view, "dialog:close", closeDialog);

    this.$el.dialog({
      modal: true,
      title: view.title,
      width: "auto",
      close: function(e, ui){
        closeDialog();
      }
    });
  };
});

ContactManager.on("start", function(){
  if(Backbone.history){
    Backbone.history.start();

    if(this.getCurrentRoute() === ""){
      ContactManager.trigger("contacts:list");
    }
  }
});
