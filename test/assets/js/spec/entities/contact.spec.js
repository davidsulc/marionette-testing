describe("Contact entity", function(){
  describe("Model", function(){
    describe("Default values", function(){
      before(function(){
        this.contact = new ContactManager.Entities.Contact();
      });

      after(function(){
        delete this.contact;
      });

      it("sets a default value of '' for firstName", function(){
        expect(this.contact.get("firstName")).to.equal("");
      });

      it("sets a default value of '' for lastName", function(){
        expect(this.contact.get("lastName")).to.equal("");
      });

      it("sets a default value of '' for phoneNumber", function(){
        expect(this.contact.get("phoneNumber")).to.equal("");
      });
    });

    describe("Validations", function(){
      beforeEach(function(){
        this.contact = new ContactManager.Entities.Contact({
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "123-456"
        });
      });

      afterEach(function(){
        delete this.contact;
      });

      it("accepts models with valid data", function(){
        expect(this.contact.isValid()).to.be.true;
      });

      it("refuses blank first names", function(){
        this.contact.set("firstName", "");
        expect(this.contact.isValid()).to.be.false;
      });

      it("refuses blank last names", function(){
        this.contact.set("lastName", "");
        expect(this.contact.isValid()).to.be.false;
      });

      it("refuses last names shorter than 2 characters", function(){
        this.contact.set("lastName", "a");
        expect(this.contact.isValid()).to.be.false;
      });
    });

    describe("contact:entity request", function(){
      before(function(){
        this.clock = sinon.useFakeTimers();
        this.contact = new ContactManager.Entities.Contact();
        var self = this;
        sinon.stub(this.contact, "fetch", function(options){
          return options.success(self.contact);
        });
        sinon.stub(ContactManager.Entities, "Contact").returns(this.contact);
      });

      after(function(){
        delete this.contact;
        ContactManager.Entities.Contact.restore();
        this.clock.restore();
      });

      it("fetches the requested model by id", function(){
        var requestedId = 2;
        var promise = ContactManager.request("contact:entity", requestedId);
        expect(ContactManager.Entities.Contact).to.have.been.calledWith({ id: requestedId }).once;
        this.clock.tick(2000);
        expect(this.contact.fetch).to.have.been.called.once;
        var self = this;
        $.when(promise).done(function(fetchedContact){
          expect(fetchedContact).to.equal(self.contact);
        });
      });

      it("has a 2 second delay", function(){
        var promise = ContactManager.request("contact:entity", 2);
        this.clock.tick(1999);
        expect(promise.state()).to.equal("pending");
        this.clock.tick(1);
        expect(promise.state()).to.equal("resolved");
      });
    });

    it("is configured for localstorage", function(){
      var contact = new ContactManager.Entities.Contact();
      expect(contact.localStorage instanceof Backbone.LocalStorage).to.be.true;
    });
  });

  describe("Collection", function(){
    before(function(){
      this.contacts = new ContactManager.Entities.ContactCollection();
    });

    after(function(){
      delete this.contacts;
    });

    it("is for Contact models", function(){
      expect(this.contacts.model).to.equal(ContactManager.Entities.Contact);
    });

    it("sorts models by first name", function(){
      expect(this.contacts.comparator).to.equal("firstName");
    });

    describe("contact:entities request", function(){
      beforeEach(function(){
        var contact = new ContactManager.Entities.Contact();
        this.contactArray = [contact];
        sinon.stub(ContactManager.Entities, "ContactCollection").returns(this.contacts);
      });

      afterEach(function(){
        delete this.contactArray;
        ContactManager.Entities.ContactCollection.restore();
      });

      it("fetches the collection of existing models", sinon.test(function(done){
        var self = this;
        this.stub(this.contacts, "fetch", function(options){
          return options.success(self.contactArray);
        });

        var fetchingContacts = ContactManager.request("contact:entities");
        $.when(fetchingContacts).done(function(fetchedContacts){
          expect(self.contacts.fetch).to.have.been.called.once;
          expect(fetchedContacts).to.equal(self.contactArray);
          done();
        });
      }));

      it("creates new models if none exist, then returns them", sinon.test(function(done){
        this.stub(this.contacts, "fetch", function(options){
          return options.success([]);
        });
        this.stub(ContactManager.Entities, "_initializeContacts").returns(this.contactArray);
        this.spy(this.contacts, "reset");

        var fetchingContacts = ContactManager.request("contact:entities");
        var self = this;
        $.when(fetchingContacts).done(function(fetchedContacts){
          expect(ContactManager.Entities._initializeContacts).to.have.been.called.once;
          expect(self.contacts.reset).to.have.been.calledWith(self.contactArray);
          done();
        });
      }));
    });

    it("is configured for localstorage", function(){
      var contacts = new ContactManager.Entities.ContactCollection();
      expect(contacts.localStorage instanceof Backbone.LocalStorage).to.be.true;
    });
  });
});
