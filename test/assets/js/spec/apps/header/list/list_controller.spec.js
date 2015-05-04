describe("HeaderApp.List.Controller", function(){
  before(function(){
    ContactManager._configureRegions();
    this.controller = ContactManager.HeaderApp.List.Controller;
  });

  after(function(){
    delete this.controller;
  });

  beforeEach(function(){
    sinon.stub(ContactManager.regions.header, "show");
  });

  afterEach(function(){
    ContactManager.regions.header.show.restore();
  });

  describe("listHeader", function(){
    beforeEach(function(){
      this.headerView = _.extend({}, Backbone.Events);
      sinon.stub(ContactManager.HeaderApp.List, "Headers").returns(this.headerView);
    });

    afterEach(function(){
      delete this.headerView;
      ContactManager.HeaderApp.List.Headers.restore();
    });

    it("displays the headers in the header region", function(){
      this.controller.listHeader();
      expect(ContactManager.regions.header.show).to.have.been.calledWith(this.headerView).once;
    });

    describe("triggers", function(){
      beforeEach(function(){
        sinon.stub(ContactManager, "trigger");
      });

      afterEach(function(){
        ContactManager.trigger.restore();
      });

      it("triggers 'contacts:list' when the view triggers 'brand:clicked'", function(){
        this.controller.listHeader();
        expect(ContactManager.trigger).to.not.have.been.called;
        this.headerView.trigger("brand:clicked");
        expect(ContactManager.trigger).to.have.been.calledWith("contacts:list");
      });

      it("triggers the model's navigation trigger when the view triggers 'childview:navigate'", function(){
        var header = new Backbone.Model({ navigationTrigger: "nav:trig" });

        this.controller.listHeader();
        expect(ContactManager.trigger).to.not.have.been.called;
        this.headerView.trigger("childview:navigate", undefined, header);
        expect(ContactManager.trigger).to.have.been.calledWith(header.get("navigationTrigger"));
      });
    });
  });

  describe("setActiveHeader", function(){
    it("sets the active header according to its URL", sinon.test(function(){
      var headers = ContactManager.Entities._initializeHeaders();
      var getSelectedModel = function(){
        return (headers.filter(function(m){ return m.selected == true; }))[0];
      };
      this.stub(ContactManager, "request").withArgs("header:entities").returns(headers);
      var firstModel = headers.first(),
          lastModel = headers.last();

      this.controller.setActiveHeader(firstModel.get("url"));
      expect(getSelectedModel()).to.equal(firstModel);
      this.controller.setActiveHeader(lastModel.get("url"));
      expect(getSelectedModel()).to.equal(lastModel);
    }));
  });
});
