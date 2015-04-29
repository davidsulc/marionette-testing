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

    triggers: {
      "click button.js-new": "contact:new"
    },

    events: {
      "submit #filter-form": "filterContacts"
    },

    ui: {
      criterion: "input.js-filter-criterion"
    },

    filterContacts: function(e){
      e.preventDefault();
      var criterion = this.$(".js-filter-criterion").val();
      this.trigger("contacts:filter", criterion);
    },

    onSetFilterCriterion: function(criterion){
      this.ui.criterion.val(criterion);
    }
  });

  List.Contact = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#contact-list-item",

    triggers: {
      "click td a.js-show": "contact:show",
      "click td a.js-edit": "contact:edit",
      "click button.js-delete": "contact:delete"
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
