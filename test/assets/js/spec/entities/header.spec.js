describe("Header entity", function(){
  describe("Model", function(){
    it("defines selection functions", function(){
      var header = new ContactManager.Entities.Header();
      expect(typeof(header.select)).to.equal("function");
      expect(typeof(header.deselect)).to.equal("function");
    });
    it("is selectable");
    it("is not 'selected' by default");
  });
});
