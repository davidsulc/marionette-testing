describe("ContactsApp.Edit.Contact", function(){
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

    this.view = new ContactManager.ContactsApp.Edit.Contact({
      el: this.$fixture,
      model: new ContactManager.Entities.Contact({
        firstName: "John",
        lastName: "Doe"
      })
    });
  });

  afterEach(function(){
    delete this.view;
  });

  it("inherits from ContactsApp.Common.Views.Form", function(){
    expect(this.view instanceof ContactManager.ContactsApp.Common.Views.Form).to.be.true;
  });

  it("sets the submit button text to 'Update contact'", function(done){
    this.view.once("render", function(){
      expect(this.$el.find(".js-submit").text()).to.equal("Update contact");
      done();
    });
    this.view.render();
  });

  it("sets the 'title' attribute according to the contact's name", function(){
    var firstName = this.view.model.get("firstName"),
        lastName = this.view.model.get("lastName");
    expect(this.view.title).to.equal("Edit " + firstName + " " + lastName);
  });

  it("creates an H1 title if options.generateTitle is true", function(done){
    var firstRender = $.Deferred(),
        secondRender = $.Deferred();
    this.view.once("render", function(){
      expect(this.$el.find("h1").first().text()).to.equal('');
      firstRender.resolve();
    });
    this.view.render();

    this.view.options.generateTitle = true;
    this.view.once("render", function(){
      var firstName = this.model.get("firstName"),
          lastName = this.model.get("lastName");
      expect(this.$el.find("h1").first().text()).to.equal("Edit " + firstName + " " + lastName);
      secondRender.resolve();
    });
    this.view.render();
    $.when(firstRender, secondRender).done(done);
  });
});
