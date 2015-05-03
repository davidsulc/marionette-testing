describe("ContactsApp.List", function(){
  before(function(){
    this.$fixture = $("<div>", { id: "fixture" });
    this.$container = $("#view-test-container");
  });

  after(function(){
    delete this.$fixture;
    this.$container.empty();
    delete this.$container;
  });

  beforeEach(function(){
    this.$fixture.empty().appendTo(this.$container);
  });

  describe("Layout", function(){
    beforeEach(function(){
      this.view = new ContactManager.ContactsApp.List.Layout();
    });

    afterEach(function(){
      delete this.view;
    });

    it("has a panel region", function(){
      expect(this.view.panelRegion).to.be.ok;
    });

    it("has a contacts region", function(){
      expect(this.view.contactsRegion).to.be.ok;
    });

    describe("'show' event", function(){
      beforeEach(function(){
        sinon.stub(this.view.panelRegion, "show");
        sinon.stub(this.view.contactsRegion, "show");
      });

      afterEach(function(){
        this.view.panelRegion.show.restore();
        this.view.contactsRegion.show.restore();
      });

      it("displays the 'panelView' in the 'panelRegion'", function(){
        var panel = {};
        this.view.panelView = panel;

        this.view.trigger("show");
        expect(this.view.panelRegion.show).to.have.been.calledWith(panel).once;
      });

      it("displays the 'contactsView' in the 'contactsRegion'", function(){
        var contactsView = {};
        this.view.contactsView = contactsView;

        this.view.trigger("show");
        expect(this.view.contactsRegion.show).to.have.been.calledWith(contactsView).once;
      });
    });
  });

  describe("Panel", function(){
    beforeEach(function(){
      this.view = new ContactManager.ContactsApp.List.Panel({
        el: this.$fixture
      });
      sinon.spy(this.view, "trigger");
      this.view.criterion = (function(view){
        return {
          value: function(){
            return view.ui.criterion.val.apply(view.ui.criterion, arguments);
          }
        };
      })(this.view);
    });

    afterEach(function(){
      delete this.view;
    });

    it("triggers 'contact:new' when the 'new' button is clicked", function(done){
      this.view.once("render", function(){
        this.$el.find(".js-new").click();
        expect(this.trigger).to.have.been.calledWith("contact:new").once;
        done();
      });
      this.view.render();
    });

    it("triggers 'contacts:filter' with the criterion when #filter-form is submitted", function(done){
      this.view.once("render", function(){
        this.criterion.value("abc");
        this.$el.find("#filter-form button[type=submit]").click();
        expect(this.trigger).to.have.been.calledWith("contacts:filter", "abc").once;
        done();
      });
      this.view.render();
    });

    it("updates the criterion in the filter form when the 'set:filter:criterion' method is triggered", function(done){
      this.view.once("render", function(){
        expect(this.criterion.value()).to.equal('');
        this.triggerMethod("set:filter:criterion", "xyz")
        expect(this.criterion.value()).to.equal("xyz");
        done();
      });
      this.view.render();
    });
  });

  describe("Contact item view", function(){
    beforeEach(function(){
      this.view = new ContactManager.ContactsApp.List.Contact({
        el: this.$fixture,
        model: new ContactManager.Entities.Contact({ id: 1 })
      });
    });

    afterEach(function(){
      delete this.view;
    });

    it("toggles highlighting when clicked", function(){
      this.view.isHighlighted = function(){ return this.$el.hasClass("warning"); };
      expect(this.view.isHighlighted()).to.be.false;
      this.view.$el.click();
      expect(this.view.isHighlighted()).to.be.true;
      this.view.$el.click();
      expect(this.view.isHighlighted()).to.be.false;
    });

    var testButton = function(action){
      return (function(){
        it("triggers 'contact:" + action + "' when the '" + action + "' button is clicked", sinon.test(function(done){
          this.spy(this.view, "trigger");
          this.view.once("render", function(){
            this.$el.find(".js-" + action).click();
            expect(this.trigger).to.have.been.calledWith("contact:" + action).once;
            done();
          });
          this.view.render();
        }));
      })();
    };

    describe("triggers", function(){
      testButton("show");
      testButton("edit");
      testButton("delete");
    });
  });

  describe("Contacts", function(){
    beforeEach(function(){
      this.collection = new ContactManager.Entities.ContactCollection([
        { id: 1, firstName: "AAA", lastName: "AAA" },
        { id: 2, firstName: "CCC", lastName: "CCC" },
        { id: 3, firstName: "BBB", lastName: "BBB" }
      ]);

      this.view = new ContactManager.ContactsApp.List.Contacts({
        el: this.$fixture,
        collection: this.collection
      });
    });

    afterEach(function(){
      delete this.collection;
      delete this.view;
    });

    it("displays a message indicating there are no contacts to display when collection is empty", function(done){
      var view = new ContactManager.ContactsApp.List.Contacts({
        el: this.$fixture,
        collection: new ContactManager.Entities.ContactCollection()
      });

      view.once("render", function(){
        expect(view.$el.text()).to.contain("No contacts to display.");
        done();
      });
      view.render();
    });

    describe("item view rendering order", function(){
      it("renders items in order on initial render", function(done){
        this.view.once("render", function(){
          var $a = $("tr:contains('AAA')").first();
          var $b = $("tr:contains('BBB')").first();
          var $c = $("tr:contains('CCC')").first();

          var dataRows = $("tr:has(td)");
          expect(dataRows.index($a)).to.equal(0);
          expect(dataRows.index($b)).to.equal(1);
          expect(dataRows.index($c)).to.equal(2);
          done();
        });
        this.view.render();
      });

      it("prepends new item views after initial render", function(done){
        this.view.once("render", function(){
          var newModel = new ContactManager.Entities.Contact({
            id: 4, firstName: "DDD", lastName: "DDD"
          });
          this.collection.add(newModel);
          var $a = $("tr:contains('AAA')").first();
          var $d = $("tr:contains('DDD')").first();

          var dataRows = $("tr:has(td)");
          expect(dataRows.index($d)).to.equal(0);
          expect(dataRows.index($a)).to.equal(1);
          done();
        });
        this.view.render();
      });
    });
  });

  describe("NewModal", function(){
    beforeEach(function(){
      this.model = new ContactManager.Entities.Contact();
      this.newView =  new ContactManager.ContactsApp.List.NewModal({
        model: this.model
      });
    });

    afterEach(function(){
      delete this.newView;
      delete this.model;
    });

    describe("successful save", function(){
      beforeEach(function(){
        sinon.stub(this.model, "save").returns(true);
        sinon.spy(this.newView, "trigger");
      });

      afterEach(function(){
        this.model.save.restore();
        this.newView.trigger.restore();
      });

      it("triggers 'dialog:close' on the view", sinon.test(function(){
        this.newView.trigger("form:submit", {});
        expect(this.newView.trigger).to.have.been.calledWith("dialog:close").once;
      }));

      it("triggers 'contact:created' on the view with the newly created model", sinon.test(function(){
        this.newView.trigger("form:submit", {});
        expect(this.newView.trigger).to.have.been.calledWith("contact:created", this.model).once;
      }));
    });

    describe("save failure", function(){
      it("triggers method 'form:data:invalid' on the view with the validation error", sinon.test(function(){
        var error = { error: "test error" };
        this.stub(this.model, "save", function(){
          this.validationError = error;
          return false;
        });
        this.stub(this.newView, "triggerMethod");

        this.newView.trigger("form:submit", {});
        expect(this.newView.triggerMethod).to.have.been.calledWith("form:data:invalid", error).once;

        delete this.model.validationError;
      }));
    });
  });

  describe("EditModal", function(){
    beforeEach(function(){
      this.model = new ContactManager.Entities.Contact();
      this.editView =  new ContactManager.ContactsApp.List.EditModal({
        model: this.model
      });
    });

    afterEach(function(){
      delete this.editView;
      delete this.model;
    });

    describe("successful save", function(){
      beforeEach(function(){
        sinon.stub(this.model, "save").returns(true);
        sinon.spy(this.editView, "trigger");
      });

      afterEach(function(){
        this.model.save.restore();
        this.editView.trigger.restore();
      });

      it("triggers 'dialog:close' on the view", sinon.test(function(){
        this.editView.trigger("form:submit", {});
        expect(this.editView.trigger).to.have.been.calledWith("dialog:close").once;
      }));

      it("triggers 'contact:updated' on the view with the updated model", sinon.test(function(){
        this.editView.trigger("form:submit", {});
        expect(this.editView.trigger).to.have.been.calledWith("contact:updated", this.model).once;
      }));
    });

    describe("save failure", function(){
      it("triggers method 'form:data:invalid' on the view with the validation error", sinon.test(function(){
        var error = { error: "test error" };
        this.stub(this.model, "save", function(){
          this.validationError = error;
          return false;
        });
        this.spy(this.editView, "triggerMethod");

        this.editView.trigger("form:submit", {});
        expect(this.editView.triggerMethod).to.have.been.calledWith("form:data:invalid", error).once;

        delete this.model.validationError;
      }));
    });
  });
});
