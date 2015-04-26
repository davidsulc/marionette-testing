describe("ContactsApp", function(){
  beforeEach(function(){
    this.API = ContactManager.ContactsApp._API;
  });

  afterEach(function(){
    delete this.API;
  });

  it("instantiates a router when started", sinon.test(function(){
    this.stub(ContactManager.ContactsApp, "Router");

    ContactManager.ContactsApp.start();
    expect(ContactManager.ContactsApp.Router).to.have.been.calledWithNew.once;

    ContactManager.ContactsApp.stop();
  }));

  describe("routing", function(){
    describe("API", function(){
      beforeEach(function(){
        sinon.stub(ContactManager, "execute");
      });

      afterEach(function(){
        ContactManager.execute.restore();
      });

      var testController = function(controllerName, action, argument){
        return (function(){
          describe(action, function(){
            var controller = eval(controllerName);
            before(function(){
              sinon.stub(controller, action);
            });

            after(function(){
              controller[action].restore();
            });

            it("executes " + controllerName + "." + action + " and forwards the argument", sinon.test(function(){
              this.API[action](argument);
              expect(controller[action]).to.have.been.calledWith(argument).once;
            }));

            it("sets the 'contacts' header as active", function(){
              this.API[action](argument);
              expect(ContactManager.execute).to.have.been.calledWith("set:active:header", "contacts").once;
            });
          });
        }());
      };

      testController("ContactManager.ContactsApp.List.Controller", "listContacts", "test");
      testController("ContactManager.ContactsApp.Show.Controller", "showContact", 3);
      testController("ContactManager.ContactsApp.Edit.Controller", "editContact", 3);
    });

    describe("routes", function(){
      beforeEach(function(){
        this.sandbox = sinon.sandbox.create();
        (function(sb, API){
          sb.stub(API, "listContacts");
          sb.stub(API, "showContact");
          sb.stub(API, "editContact");
        }(this.sandbox, this.API));
        ContactManager.ContactsApp.start();
        Backbone.history.start();
      });

      afterEach(function(){
        this.sandbox.restore();
        Backbone.history.navigate("");
        Backbone.history.stop();
        ContactManager.ContactsApp.stop();
      });

      it("executes the listContacts API method for the 'contacts' fragment", function(){
        ContactManager.navigate("contacts", { trigger: true });
        expect(this.API.listContacts).to.have.been.called.once;
      });

      it("executes the listContacts API method and forwards the criterion value for the 'contacts/filter/criterion::criterion' fragment", function(){
        ContactManager.navigate("contacts/filter/criterion:test", { trigger: true });
        expect(this.API.listContacts).to.have.been.calledWith("test").once;
      });

      it("executes the showContact API method and forwards the id value for the 'contacts/:id' fragment", function(){
        ContactManager.navigate("contacts/3", { trigger: true });
        expect(this.API.showContact).to.have.been.calledWith("3").once;
      });

      it("executes the editContact API method and forwards the id value for the 'contacts/:id/edit' fragment", function(){
        ContactManager.navigate("contacts/3/edit", { trigger: true });
        expect(this.API.editContact).to.have.been.calledWith("3").once;
      });
    });
  });

  describe("triggers", function(){
    beforeEach(function(){
      this.sandbox = sinon.sandbox.create();
      (function(sb, API){
        sb.stub(ContactManager, "navigate");
        sb.stub(API, "listContacts");
        sb.stub(API, "showContact");
        sb.stub(API, "editContact");
      }(this.sandbox, this.API));
    });

    afterEach(function(){
      this.sandbox.restore();
    });

    describe("contacts:list", function(){
      it("navigates to the 'contacts' fragment", function(){
        ContactManager.trigger("contacts:list");
        expect(ContactManager.navigate).to.have.been.calledWith("contacts").once;
      });

      it("executes the 'listContacts' API method", function(){
        ContactManager.trigger("contacts:list");
        expect(this.API.listContacts).to.have.been.called.once;
      });
    });

    describe("contacts:filter", function(){
      it("navigates to the 'contacts/filter/criterion::criterion' fragment if a criterion is provided", function(){
        ContactManager.trigger("contacts:filter", "ab");
        expect(ContactManager.navigate).to.have.been.calledWith("contacts/filter/criterion:ab").once;
      });

      it("navigates to the 'contacts' fragment if no criterion is provided", function(){
        ContactManager.trigger("contacts:filter");
        expect(ContactManager.navigate).to.have.been.calledWith("contacts").once;
      });
    });

    describe("contact:show", function(){
      it("navigates to the 'contacts/:id' fragment", function(){
        ContactManager.trigger("contact:show", 3);
        expect(ContactManager.navigate).to.have.been.calledWith("contacts/3").once;
      });

      it("executes the 'showContact' API method", function(){
        ContactManager.trigger("contact:show", 3);
        expect(this.API.showContact).to.have.been.calledWith(3).once;
      });
    });

    describe("contact:edit", function(){
      it("navigates to the 'contacts/:id/edit' fragment", function(){
        ContactManager.trigger("contact:edit", 3);
        expect(ContactManager.navigate).to.have.been.calledWith("contacts/3/edit").once;
      });

      it("executes the 'editContact' API method", function(){
        ContactManager.trigger("contact:edit", 3);
        expect(this.API.editContact).to.have.been.calledWith(3).once;
      });
    });
  });
});
