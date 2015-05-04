ContactManager.module("HeaderApp.List", function(List, ContactManager, Backbone, Marionette, $, _){
  List.Header = Marionette.ItemView.extend({
    template: "#header-link",
    tagName: "li",

    ui: {
      link: "a"
    },

    events: {
      "click @ui.link": "navigate"
    },

    navigate: function(e){
      e.preventDefault();
      this.trigger("navigate", this.model);
    },

    onRender: function(){
      if(this.model.selected){
        // add class so Bootstrap will highlight the active entry in the navbar
        this.$el.addClass("active");
      };
    }
  });

  List.Headers = Marionette.CompositeView.extend({
    template: "#header-template",
    className: "navbar navbar-inverse navbar-fixed-top",
    childView: List.Header,
    childViewContainer: "ul",

    ui: {
      brand: "a.brand"
    },

    triggers: {
      "click @ui.brand": "brand:clicked"
    }
  });
});
