describe("Common.Views.Loading", function(){
  it("displays a spinner in the '#spinner' node", sinon.test(function(){
    var origJQuery = Backbone.$;
    var spinnerEl = this.stub({ spin: function(){} });
    this.stub(Backbone, "$", function(){
      if(arguments[0] === "#spinner"){
        return spinnerEl;
      }
      else{
        return origJQuery.apply(arguments);
      }
    });

    var view = new ContactManager.Common.Views.Loading();
    view.onShow();
    expect(Backbone.$).to.have.been.calledWith("#spinner").once;
    expect(spinnerEl.spin).to.have.been.called.once;
  }));

  describe("serializeData", function(){
    it("serializes default options properly", function(){
      var view = new ContactManager.Common.Views.Loading();
      var serializedData = view.serializeData();
      expect(serializedData.title).to.equal("Loading Data");
      expect(serializedData.message).to.equal("Please wait, data is loading.");
    });

    it("serializes provided options properly", function(){
      var options = {
        title: "Test title",
        message: "Test message"
      };
      var view = new ContactManager.Common.Views.Loading(options);
      var serializedData = view.serializeData();
      expect(serializedData.title).to.equal(options.title);
      expect(serializedData.message).to.equal(options.message);
    });
  });
});
