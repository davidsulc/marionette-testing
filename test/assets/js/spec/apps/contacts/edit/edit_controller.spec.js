describe("ContactsApp.Edit.Controller", function(){
  before(function(){
    ContactManager._configureRegions();
    this.controller = ContactManager.ContactsApp.Edit.Controller;
  });

  after(function(){
    delete this.controller;
  });

  describe("editContact", function(){
    beforeEach(function(){
      sinon.stub(ContactManager.regions.main, "show");
    });

    afterEach(function(){
      ContactManager.regions.main.show.restore();
    });

    it("shows a loading view before loading a contact", sinon.test(function(){
      var view = {};
      this.stub(ContactManager.Common.Views, "Loading").returns(view);

      this.controller.editContact(1);
      expect(ContactManager.regions.main.show).to.have.been.calledWith(view).once;
    }));

    it("shows the missing contact view if the requested contact can't be found", sinon.test(function(){
      this.stub(ContactManager, "request").withArgs("contact:entity", 1).returns(undefined);
      var view = {};
      this.stub(ContactManager.ContactsApp.Show, "MissingContact").returns(view);

      this.controller.editContact(1);
      expect(ContactManager.regions.main.show).to.have.been.calledWith(view).once;
    }));

    describe("contact updating", function(){
      beforeEach(function(){
        this.model = new ContactManager.Entities.Contact({ id: 1, firstName: "John", lastName: "Doe" });
        sinon.stub(ContactManager, "request").withArgs("contact:entity", 1).returns(this.model);
        this.view = new ContactManager.ContactsApp.Edit.Contact({ model: this.model });
        sinon.stub(ContactManager.ContactsApp.Edit, "Contact").returns(this.view);
      });

      afterEach(function(){
        ContactManager.request.restore();
        ContactManager.ContactsApp.Edit.Contact.restore();

        delete this.model;
        delete this.view;
      });

      it("shows the contact view", function(){
        this.controller.editContact(1);
        expect(ContactManager.regions.main.show).to.have.been.calledWith(this.view).once;
      });

      it("triggers 'contact:show' with the same id if saving the modification was successful", sinon.test(function(){
        this.stub(ContactManager, "trigger");
        this.stub(this.model, "save").returns(true);

        this.controller.editContact(1);
        this.view.trigger("form:submit");
        expect(ContactManager.trigger).to.have.been.calledWith("contact:show", this.model.get("id")).once;
      }));

      it("triggers method 'onFormDataInvalid' if saving the modification was not successful", sinon.test(function(){
        this.stub(this.view, "onFormDataInvalid");
        this.stub(this.model, "save", function(){
          this.validationError = { firstName: "error message" };

          return false;
        });

        this.controller.editContact(1);
        this.view.trigger("form:submit");
        expect(this.view.onFormDataInvalid).to.have.been.calledWith(this.model.validationError).once;
      }));
    });
  });
});
