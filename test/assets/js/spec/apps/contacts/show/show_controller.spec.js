describe("ContactsApp.Show.Controller", function(){
  before(function(){
    ContactManager._configureRegions();
    this.controller = ContactManager.ContactsApp.Show.Controller;
  });

  after(function(){
    delete this.controller;
  });

  beforeEach(function(){
    sinon.stub(ContactManager.regions.main, "show");
  });

  afterEach(function(){
    ContactManager.regions.main.show.restore();
  });

  describe("showContact", function(){
    it("shows a loading view before loading a contact", sinon.test(function(){
      var view = {};
      this.stub(ContactManager.Common.Views, "Loading").returns(view);

      this.controller.showContact(1);
      expect(ContactManager.regions.main.show).to.have.been.calledWith(view).once;
    }));

    it("shows the missing contact view if the requested contact can't be found", sinon.test(function(){
      this.stub(ContactManager, "request").withArgs("contact:entity", 1).returns(undefined);
      var view = {};
      this.stub(ContactManager.ContactsApp.Show, "MissingContact").returns(view);

      this.controller.showContact(1);
      expect(ContactManager.request).to.have.been.calledWith("contact:entity", 1).once;
      expect(ContactManager.regions.main.show).to.have.been.calledWith(view).once;
    }));

    it("shows the contact view", sinon.test(function(){
      this.stub(ContactManager, "request").withArgs("contact:entity", 1).returns({});
      var view = _.extend({}, Backbone.Events);
      this.stub(ContactManager.ContactsApp.Show, "Contact").returns(view);

      this.controller.showContact(1);
      expect(ContactManager.request).to.have.been.calledWith("contact:entity", 1).once;
      expect(ContactManager.regions.main.show).to.have.been.calledWith(view).once;
    }));

    it("proxies 'contact:edit' when it is triggered on the show view", sinon.test(function(){
      var model = new ContactManager.Entities.Contact({ id: 1, firstName: "John", lastName: "Doe" });
      this.stub(ContactManager, "request").withArgs("contact:entity", 1).returns(model);
      this.stub(ContactManager, "trigger");
      var view = this.controller.showContact(1);

      view.trigger("contact:edit", model);
      expect(ContactManager.trigger).to.have.been.calledWith("contact:edit", model.get("id")).once;
    }));
  });
});
