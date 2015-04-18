describe("Common entity behavior", function(){
  describe("Filtered collection", function(){
    before(function(){
      this.collection = new ContactManager.Entities.ContactCollection();
      this.collection.add(new ContactManager.Entities.Contact({ firstName: "Mark", lastName: "Merten" }));
      this.collection.add(new ContactManager.Entities.Contact({ firstName: "Nancy", lastName: "Ning" }));
      this.collection.add(new ContactManager.Entities.Contact({ firstName: "Oscar", lastName: "Owen" }));
      this.collection.add(new ContactManager.Entities.Contact({ firstName: "Pat", lastName: "Petten" }));

      this.filteredCollection = ContactManager.Entities.FilteredCollection({
        collection: this.collection,
        filterFunction: function(filterCriterion){
          var criterion = filterCriterion.toLowerCase();
          return function(contact){
            if(contact.get("firstName").toLowerCase().indexOf(criterion) !== -1
              || contact.get("lastName").toLowerCase().indexOf(criterion) !== -1
              || contact.get("phoneNumber").toLowerCase().indexOf(criterion) !== -1){
                return contact;
            }
          };
        }
      });
    });

    after(function(){
      delete this.collection;
      delete this.filteredCollection;
    });

    beforeEach(function(){
      this.filteredCollection.reset(this.collection.models);
    });

    it("can filter the collection with #filter", function(){
      this.filteredCollection.filter("e");
      expect(this.filteredCollection).to.have.length(3);
      expect(_.filter(this.filteredCollection.models, function(model){ return model.get("firstName") === "Nancy"; })).to.be.empty;
    });

    it("can filter the collection with #where", function(){
      this.filteredCollection.where({ firstName: "Mark" });
      expect(this.filteredCollection).to.have.length(1);
      expect(this.filteredCollection.first().get("lastName")).to.equal("Merten");
    });

    it("clears the filter with ''", function(){
      var originalLength = this.filteredCollection.models.length;
      this.filteredCollection.filter("e");
      expect(this.filteredCollection).to.have.length(3);
      expect(this.filteredCollection.length).to.not.equal(originalLength);
      this.filteredCollection.filter("");
      expect(this.filteredCollection.length).to.equal(originalLength);
    });

    it("refilters itself when the original collection is reset", function(){
      var harold = new ContactManager.Entities.Contact({ firstName: "Harold", lastName: "Halley" });
      var ingrid = new ContactManager.Entities.Contact({ firstName: "Ingrid", lastName: "Ippan" });

      this.filteredCollection.filter("e");
      this.collection.reset([harold, ingrid]);

      expect(this.filteredCollection).to.have.length(1);
      expect(this.filteredCollection.first().get("firstName")).to.equal("Harold");
    });

    it("filters models added to the original collection", function(){
      var harold = new ContactManager.Entities.Contact({ firstName: "Harold", lastName: "Halley" });
      var ingrid = new ContactManager.Entities.Contact({ firstName: "Ingrid", lastName: "Ippan" });

      this.filteredCollection.filter("e");
      var length = this.filteredCollection.models.length;
      this.collection.add([harold, ingrid]);
      expect(this.filteredCollection.models).to.have.length(length + 1);
      expect(_.filter(this.filteredCollection.models, function(model){ return model.get("firstName") === "Harold"; })).to.not.be.empty;
      expect(_.filter(this.filteredCollection.models, function(model){ return model.get("firstName") === "Ingrid"; })).to.be.empty;
    });
  });
});
