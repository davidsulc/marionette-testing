describe("AboutApp.Show.Message", function(){
  before(function(){
    this.$container = $("#view-test-container");
    this.$fixture = $("<div>", { id: "fixture" });
  });

  after(function(){
    delete this.$fixture;
    this.$container.empty();
    delete this.$container;
  });

  it("displays the 'about' message", function(done){
    this.$fixture.empty().appendTo(this.$container);

    var view = new ContactManager.AboutApp.Show.Message({
      el: this.$fixture
    });

    view.once("render", function(){
      expect(view.$el.text()).to.contain("About this application");
      done();
    });
    view.render();
  });
});
