describe("AboutApp", function(){
  it("instantiates a router when started", sinon.test(function(){
    this.stub(ContactManager.AboutApp, "Router");

    ContactManager.AboutApp.start();
    expect(ContactManager.AboutApp.Router).to.have.been.calledWithNew.once;

    ContactManager.AboutApp.stop();
  }));

  describe("API", function(){
    describe("showAbout", function(){
      beforeEach(function(){
        sinon.stub(ContactManager.AboutApp.Show.Controller, "showAbout");
        sinon.stub(ContactManager, "execute");

        ContactManager.AboutApp._API.showAbout();
      });

      afterEach(function(){
        ContactManager.AboutApp.Show.Controller.showAbout.restore();
        ContactManager.execute.restore();
      });

      it("executes AboutApp.Show.Controller.showAbout", function(){
        expect(ContactManager.AboutApp.Show.Controller.showAbout).to.have.been.called.once;
      });

      it("sets the 'about' header as active", function(){
        expect(ContactManager.execute).to.have.been.calledWith("set:active:header", "about").once;
      });
    });
  });

  describe("routing", function(){
    beforeEach(function(){
      sinon.stub(ContactManager.AboutApp._API, "showAbout");
      ContactManager.AboutApp.start();
      Backbone.history.start();
    });

    afterEach(function(){
      ContactManager.AboutApp.stop();
      ContactManager.AboutApp._API.showAbout.restore();
      Backbone.history.navigate("");
      Backbone.history.stop();
    });

    it("executes the API's showAbout", function(){
      ContactManager.navigate("about", { trigger: true });
      expect(ContactManager.AboutApp._API.showAbout).to.have.been.called.once;
    });
  });

  describe("triggers", function(){
    beforeEach(function(){
      ContactManager.AboutApp.start();
      sinon.stub(ContactManager, "navigate");
    });

    afterEach(function(){
      ContactManager.AboutApp.stop();
      ContactManager.navigate.restore();
    });

    describe("'about:show'", function(){
      beforeEach(function(){
        sinon.stub(ContactManager.AboutApp._API, "showAbout");

        ContactManager.trigger("about:show");
      });

      afterEach(function(){
        ContactManager.AboutApp._API.showAbout.restore();
      });

      it("navigates to 'about' fragment", sinon.test(function(){
        expect(ContactManager.navigate).to.have.been.calledWith("about").once;
      }));

      it("executes the API's showAbout", function(){
        expect(ContactManager.AboutApp._API.showAbout).to.have.been.called.once;
      });
    });
  });
});
