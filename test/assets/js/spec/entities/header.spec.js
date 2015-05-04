describe("Header entity", function(){
  describe("Model", function(){
    beforeEach(function(){
      this.header = new ContactManager.Entities.Header();
    });

    afterEach(function(){
      delete this.header;
    });

    it("defines (de)selection functions", function(){
      expect(typeof(this.header.select)).to.equal("function");
      expect(typeof(this.header.deselect)).to.equal("function");
    });

    it("is selectable", function(){
      this.header.select();
      expect(this.header.selected).to.be.true;
      this.header.deselect();
      expect(this.header.selected).to.be.false;
    });

    it("is not 'selected' by default", function(){
      expect(this.header.selected).to.not.be.ok;
    });
  });

  describe("Collection", function(){
    before(function(){
      this.headers = ContactManager.Entities._initializeHeaders();
    });

    after(function(){
      delete this.headers;
    });

    it("is for Header models", function(){
      expect(this.headers.model).to.equal(ContactManager.Entities.Header);
    });

    it("contains one model per navigation menu item", function(){
      expect(this.headers).to.have.length(2);
      var entries = this.headers.pluck("name");
      expect(entries).to.contain("About");
      expect(entries).to.contain("Contacts");
    });

    it("is single selectable", function(){
      var countSelected = function(coll){
        return coll.reduce(function(memo, model){ return model.selected ? memo + 1 : memo; }, 0);
      };
      expect(countSelected(this.headers)).to.be.at.most(1);
      this.headers.first().select();
      this.headers.last().select();
      expect(countSelected(this.headers)).to.equal(1);
    });

    it("can be fetched with a 'header:entities' request", sinon.test(function(){
      var fakeCollection = {};
      this.stub(ContactManager.Entities, "_headersInitialized").returns(false);
      this.stub(ContactManager.Entities, "_initializeHeaders").returns(fakeCollection);

      var headers = ContactManager.request("header:entities");
      expect(headers).to.equal(fakeCollection);
    }));

    it("is a singleton when obtained by request", function(){
      var firstCall = ContactManager.request("header:entities"),
          secondCall = ContactManager.request("header:entities");

      expect(firstCall).to.equal(secondCall);
    });
  });
});
