describe("ContactsApp.Show", function(){
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

  describe("MissingContact", function(){
    it("indicates the contact is missing", function(done){
      var view = new ContactManager.ContactsApp.Show.MissingContact();
      view.once("render", function(){
        expect(this.$el.find(".alert-error").text()).to.equal("This contact doesn't exist !");
        done();
      });
      view.render();
    });
  });

  describe("Contact", function(){
    it("triggers 'contact:edit' with the same model when the edit button is clicked", sinon.test(function(done){
      var model = new ContactManager.Entities.Contact({ id: 1, firstName: "John", lastName: "Doe" });
      var view = new ContactManager.ContactsApp.Show.Contact({ model: model });
      this.spy(view, "trigger");

      view.once("render", function(){
        this.$el.find(".js-edit").click();
        expect(this.trigger).to.have.been.calledWith("contact:edit", model).once;
        done();
      });
      view.render();
    }));
  });
});
