describe("ContactManager", function(){
  describe("navigate", function(){
    beforeEach(function(){
      sinon.stub(Backbone.history, "navigate");
    });

    afterEach(function(){
     Backbone.history.navigate.restore();
    });

    it("proxies Backbone.history.navigate", function(){
      var options = { test: "value" };
      ContactManager.navigate("testRoute", options);
      expect(Backbone.history.navigate).to.have.been.calledWith("testRoute", options).once;
    });

    it("uses an empty object as the 'options' value if none is provided", function(){
      ContactManager.navigate("testRoute");
      expect(Backbone.history.navigate).to.have.been.calledWith("testRoute", {}).once;
    });
  });

  describe("getCurrentRoute", function(){
    beforeEach(function(){
      Backbone.history.start();
    });

    afterEach(function(){
      Backbone.history.navigate("");
      Backbone.history.stop();
    });

    it("returns the current history fragment", sinon.test(function(){
      Backbone.history.navigate("testFragment");

      var fragment = ContactManager.getCurrentRoute();
      expect(Backbone.history.fragment).to.be.ok;
      expect(fragment).to.equal(Backbone.history.fragment);
    }));
  });

  describe("RegionContainer", function(){
    beforeEach(function(){
      this.view = new ContactManager.RegionContainer();
    });

    afterEach(function(){
      delete this.view;
    });

    it("has a header region", function(){
      expect(this.view.getRegion('header')).to.be.ok;
    });

    it("has a main region", function(){
      expect(this.view.getRegion('main')).to.be.ok;
    });

    it("has a dialog region", function(){
      expect(this.view.getRegion('dialog')).to.be.ok;
    });
  });

  describe("events", function(){
    describe("before:start", function(){
      beforeEach(function(){
        this.view = new ContactManager.RegionContainer();
        sinon.stub(ContactManager, "RegionContainer").returns(this.view);
      });

      afterEach(function(){
        ContactManager.RegionContainer.restore();
        delete this.view;
      });

      it("assigns a region container to ContactManager.regions", sinon.test(function(){
        ContactManager.triggerMethod("before:start");
        expect(ContactManager.regions).to.equal(this.view);
      }));

      describe("onShow configuration", function(){
        beforeEach(function(){
          this._origEl = this.view.dialog.$el;
          this.view.dialog.$el = { dialog: sinon.stub() };
          ContactManager.triggerMethod("before:start");
        });

        afterEach(function(){
          this.view.dialog.$el = this._origEl;
          delete this._origEl;
        });

        it("configures an onShow function for the dialog region", function(){
          expect(ContactManager.regions.dialog.onShow).to.be.ok;
          expect(ContactManager.regions.dialog.onShow).to.not.equal(Marionette.LayoutView.prototype.onShow);
        });

        it("configures a listener for the 'dialog:close' event", sinon.test(function(){
          this.stub(this.view.dialog, "listenTo");
          var displayedView = new Marionette.View();

          ContactManager.regions.dialog.triggerMethod("show", displayedView);
          expect(this.view.dialog.listenTo).to.have.been.called.once;
          var listenerConfig = this.view.dialog.listenTo.firstCall.args;
          expect(listenerConfig[0]).to.equal(displayedView);
          expect(listenerConfig[1]).to.equal("dialog:close");
        }));

        it("executes the shown view's $el's `dialog` method", sinon.test(function(){
          var displayedView = new Marionette.View();

          ContactManager.regions.dialog.triggerMethod("show", displayedView);
          expect(this.view.dialog.$el.dialog).to.have.been.called.once;
        }));
      });
    });

    describe("start", function(){
      beforeEach(function(){
        sinon.stub(Backbone.history, "start");
      });

      afterEach(function(){
        Backbone.history.start.restore();
      });

      it("starts Backbone.history", sinon.test(function(){
        this.stub(ContactManager, "getCurrentRoute").returns("notEmpty");

        ContactManager.triggerMethod("start");
        expect(Backbone.history.start).to.have.been.called.once;
      }));

      it("triggers 'contacts:list' if the current URL fragment is empty", sinon.test(function(){
        this.stub(ContactManager, "getCurrentRoute").returns("");
        this.stub(ContactManager, "trigger");

        ContactManager.triggerMethod("start");
        expect(ContactManager.trigger).to.have.been.calledWith("contacts:list").once;
      }));
    });
  });
});
