ContactManager.module("ContactsApp.New", function(New, ContactManager, Backbone, Marionette, $, _){
  New.Contact = ContactManager.ContactsApp.Common.Views.Form.extend({
    title: "New Contact",

    ui: {
      createButton: ".js-submit"
    },

    events: {
      "click @ui.createButton": "submitClicked"
    },

    onRender: function(){
      this.ui.createButton.text("Create contact");
    }
  });
});
