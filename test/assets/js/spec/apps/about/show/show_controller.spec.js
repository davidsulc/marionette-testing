describe("AboutApp.Show.Controller", function(){
  describe("showAbout", function(){
    it("displays the 'about' view in the main region", sinon.test(function(){
      var controller = ContactManager.AboutApp.Show.Controller;
      var view = {};
      this.stub(ContactManager.AboutApp.Show, "Message").returns(view);
      ContactManager._configureRegions();
      this.stub(ContactManager.regions.main, "show");

      controller.showAbout();
      expect(ContactManager.regions.main.show).to.have.been.calledWith(view).once;
    }));
  });
});
