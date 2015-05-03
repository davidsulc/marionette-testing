describe("ContactsApp.Common.Views.Form", function(){
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

  it("triggers 'form:submit' with the form data when the submit button is clicked", function(done){
    var modelData = {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "888-12345"
    };
    var view = new ContactManager.ContactsApp.Common.Views.Form({
      el: this.$fixture,
      model: new ContactManager.Entities.Contact(modelData)
    });

    var submitSpy = sinon.spy();
    view.on("form:submit", submitSpy);

    view.once("render", function(){
      expect(submitSpy.called).to.be.false;
      modelData.lastName = "Dunn";

      $("#contact-lastName").val(modelData.lastName);
      view.ui.submitButton.click();
      expect(submitSpy.calledOnce).to.be.true;
      expect(submitSpy.firstCall.args[0]).to.deep.equal(modelData);
      done();
    });
    view.render();
  });

  describe("error display", function(){
    beforeEach(function(){
      this.view = new ContactManager.ContactsApp.Common.Views.Form({
        el: this.$fixture,
        model: new ContactManager.Entities.Contact()
      });

      this.getErrorText = function(attribute){ return this.view.$el.find("#contact-" + attribute).next(".error").text(); };
    });

    it("displays form errors on 'form:data:invalid' event", function(done){
      var self = this;
      this.view.once("render", function(){
        expect(self.getErrorText("firstName")).to.equal('');
        this.triggerMethod("form:data:invalid", { firstName: "first name error message" });
        expect(self.getErrorText("firstName")).to.equal("first name error message");
        done();
      });
      this.view.render();
    });

    it("clears the displayed errors before displaying new error messages", function(done){
      var self = this;
      this.view.once("render", function(){
        this.triggerMethod("form:data:invalid", {
          firstName: "first name error message",
          lastName: "last name error message" });
        expect(self.getErrorText("firstName")).to.equal("first name error message");
        expect(self.getErrorText("lastName")).to.equal("last name error message");

        this.triggerMethod("form:data:invalid", { lastName: "problem with last name" });
        expect(self.getErrorText("firstName")).to.equal('');
        expect(self.getErrorText("lastName")).to.equal("problem with last name");
        done();
      });
      this.view.render();
    });

    afterEach(function(){
      this.view = null;
      this.getErrorText = null;
    });
  });
});
