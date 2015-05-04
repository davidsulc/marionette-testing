describe("HeaderApp.List", function(){
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

  describe("Header", function(){
    beforeEach(function(){
      this.header = new ContactManager.Entities.Header({
        name: "Contacts",
        url: "contacts",
        navigationTrigger: "contacts:list"
      });

      this.view = new ContactManager.HeaderApp.List.Header({
        el: this.$fixture,
        model: this.header
      });
    });

    afterEach(function(){
      delete this.header;
      delete this.view;
    });

    it("displays the header name in the navbar", function(){
      this.view.render();
      var linkText = $.trim(this.view.ui.link.text());
      expect(linkText).to.equal(this.header.get("name"));
    });

    it("adds an 'active' CSS class if and only if the header is selected", function(){
      this.header.deselect();
      this.view.render();
      expect(this.view.$el.hasClass("active")).to.be.false;

      this.header.select();
      this.view.render();
      expect(this.view.$el.hasClass("active")).to.be.true;
    });

    it("triggers a 'navigate' event when clicked, and provided the header model", sinon.test(function(){
      this.stub(this.view, "trigger");
      this.view.render();

      this.view.ui.link.click();
      expect(this.view.trigger).to.have.been.calledWith("navigate", this.header);
    }));
  });

  describe("Headers", function(){
    it("triggers an event when the brand is clicked", sinon.test(function(){
      var headers = ContactManager.Entities._initializeHeaders();
      var view = new ContactManager.HeaderApp.List.Headers({
        el: this.$fixture,
        collection: headers
      });
      this.stub(view, "trigger");
      view.render();

      view.ui.brand.click();
      expect(view.trigger).to.have.been.calledWith("brand:clicked");
    }));
  });
});
