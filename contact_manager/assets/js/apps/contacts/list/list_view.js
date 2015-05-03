ContactManager.module("ContactsApp.List", function(List, ContactManager, Backbone, Marionette, $, _){
  List.Layout = Marionette.LayoutView.extend({
    template: "#contact-list-layout",

    initialize: function(options){
      this.on("show", function(){
        this.panelRegion.show(this.getOption("panelView"));
        this.contactsRegion.show(this.getOption("contactsView"));
      });
    },

    regions: {
      panelRegion: "#panel-region",
      contactsRegion: "#contacts-region"
    }
  });

  List.Panel = Marionette.ItemView.extend({
    template: "#contact-list-panel",

    ui: {
      criterion: "input.js-filter-criterion",
      filterForm: "#filter-form",
      filterFormSubmitButton: "#filter-form button[type=submit]",
      newButton: "button.js-new"
    },

    triggers: {
      "click @ui.newButton": "contact:new"
    },

    events: {
      "submit @ui.filterForm": "filterContacts"
    },

    filterContacts: function(e){
      e.preventDefault();
      this.trigger("contacts:filter", this.ui.criterion.val());
    },

    onSetFilterCriterion: function(criterion){
      this.ui.criterion.val(criterion);
    }
  });

  List.Contact = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#contact-list-item",

    ui: {
      deleteButton: "td button.js-delete",
      editButton: "td a.js-edit",
      showButton: "td a.js-show"
    },

    triggers: {
      "click @ui.showButton": "contact:show",
      "click @ui.editButton": "contact:edit",
      "click @ui.deleteButton": "contact:delete"
    },

    events: {
      "click": "highlightName"
    },

    flash: function(cssClass){
      var $view = this.$el;
      $view.hide().toggleClass(cssClass).fadeIn(800, function(){
        setTimeout(function(){
          $view.toggleClass(cssClass)
        }, 500);
      });
    },

    highlightName: function(e){
      this.$el.toggleClass("warning");
    },

    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  var NoContactsView = Marionette.ItemView.extend({
    template: "#contact-list-none",
    tagName: "tr",
    className: "alert"
  });

  List.Contacts = Marionette.CompositeView.extend({
    tagName: "table",
    className: "table table-hover",
    template: "#contact-list",
    emptyView: NoContactsView,
    childView: List.Contact,
    childViewContainer: "tbody",

    initialize: function(){
      this.listenTo(this.collection, "reset", function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.append(childView.el);
        }
      });
    },

    onRenderCollection: function(){
      this.attachHtml = function(collectionView, childView, index){
        collectionView.$el.prepend(childView.el);
      }
    }
  });

  var processFormSubmit = function(data, triggerName){
    if(this.model.save(data)){
      this.trigger("dialog:close");
      this.trigger(triggerName, this.model);
    }
    else{
      this.triggerMethod("form:data:invalid", this.model.validationError);
    }
  };

  List.NewModal = ContactManager.ContactsApp.New.Contact.extend({
    initialize: function(options){
      this.on("form:submit", function(data){
        processFormSubmit.call(this, data, "contact:created");
      });
    }
  });

  List.EditModal = ContactManager.ContactsApp.Edit.Contact.extend({
    initialize: function(options){
      var parentInitializer = ContactManager.ContactsApp.Edit.Contact.prototype.initialize;
      if(parentInitializer){
        parentInitializer.call(this);
      }

      this.on("form:submit", function(data){
        processFormSubmit.call(this, data, "contact:updated");
      });
    }
  });
});
