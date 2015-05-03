ContactManager.module("ContactsApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){
  Show.MissingContact = Marionette.ItemView.extend({
    template: "#missing-contact-view"
  });

  Show.Contact = Marionette.ItemView.extend({
    template: "#contact-view",

    ui: {
      editButton: "a.js-edit"
    },

    events: {
      "click @ui.editButton": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("contact:edit", this.model);
    }
  });
});
