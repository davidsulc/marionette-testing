describe("ContactsApp.New.Contact", function(){
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

    this.view = new ContactManager.ContactsApp.New.Contact({
      el: this.$fixture,
      model: new ContactManager.Entities.Contact()
    });
  });

  afterEach(function(){
    delete this.view;
  });

  it("inherits from ContactsApp.Common.Views.Form", function(){
    expect(this.view instanceof ContactManager.ContactsApp.Common.Views.Form).to.be.true;
  });

  it("sets the 'title' attribute to 'New Contact'", function(){
    expect(this.view.title).to.equal("New Contact");
  });

  it("sets the submit button text to 'Create contact'", function(){
    this.view.once("render", function(){
      expect(this.$el.find(".js-submit").text()).to.equal("Create contact");
    });
    this.view.render();
  });
});
