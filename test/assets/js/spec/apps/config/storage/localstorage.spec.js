describe("Entities.localstorage.configureStorage", function(){
  beforeEach(function(){
    this.urlValue = "testUrl";
    window._TestModel = Backbone.Model.extend({ urlRoot: this.urlValue });
  });

  afterEach(function(){
    delete window._TestModel;
    delete this.urlValue;
  });

  it("configures the constructor to add a localStorage attribute", function(){
    var model = new window._TestModel();
    expect(model.localStorage).to.not.be.ok;
    ContactManager.Entities.configureStorage("_TestModel");
    model = new window._TestModel();
    expect(model.localStorage).to.be.ok;
    expect(model.localStorage instanceof Backbone.LocalStorage).to.be.true;
  });

  it("uses the same localStorage instance for all instances of a given entity", function(){
    ContactManager.Entities.configureStorage("_TestModel");
    var modelA = new window._TestModel();
    var modelB = new window._TestModel();

    expect(modelA.localStorage).to.equal(modelB.localStorage);
  });

  describe("setting the localStorage key", function(){
    before(function(){
      this.collectionUrl = "collectionUrl";
      window._TestCollection = Backbone.Collection.extend({ url: this.collectionUrl });
      ContactManager.Entities.configureStorage("_TestCollection");
      this.collection = new window._TestCollection();
    });

    after(function(){
      delete window._TestCollection;
      delete this.collection;
      delete this.collectionUrl;
    });

    it("can use the model's `urlRoot` value", function(){
      ContactManager.Entities.configureStorage("_TestModel");
      var model = new window._TestModel();
      expect(model.localStorage.name).to.equal(this.urlValue);
    });

    it("can use a collection's `url` value", function(){
      expect(this.collection.localStorage.name).to.equal(this.collectionUrl);
    });
  });
});
