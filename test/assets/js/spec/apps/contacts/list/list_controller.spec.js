describe("ContactsApp.List.Controller", function(){
  before(function(){
    ContactManager._configureRegions();
    this.controller = ContactManager.ContactsApp.List.Controller;
  });

  after(function(){
    delete this.controller;
  });

  beforeEach(function(){
    sinon.stub(ContactManager.regions.main, "show");
  });

  afterEach(function(){
    ContactManager.regions.main.show.restore();
  });

  describe("listContacts", function(){
    it("shows a loading view before loading the contacts", sinon.test(function(){
      var view = {};
      this.stub(ContactManager.Common.Views, "Loading").returns(view);

      this.controller.listContacts();
      expect(ContactManager.regions.main.show).to.have.been.calledWith(view).once;
    }));

    describe("main layout", function(){
      it("is shown in the main region", sinon.test(function(){
        var layout = new ContactManager.ContactsApp.List.Layout();
        this.stub(ContactManager.ContactsApp.List, "Layout").returns(layout);

        this.controller.listContacts();
        expect(ContactManager.regions.main.show).to.have.been.calledWith(layout).once;
      }));

      it("gets instantiated with sub-views (panel and list)", sinon.test(function(){
        var panelView = new Marionette.Object(),
            listView = new Marionette.Object();
        this.stub(ContactManager.ContactsApp.List, "Panel").returns(panelView);
        this.stub(ContactManager.ContactsApp.List, "Contacts").returns(listView);
        this.stub(ContactManager.ContactsApp.List, "Layout");

        this.controller.listContacts();
        var layoutOptions = {
          panelView: panelView,
          contactsView:listView
        }
        expect(ContactManager.ContactsApp.List.Layout).to.have.been.calledWith(layoutOptions).once;
      }));
    });

    describe("sub-view behavior", function(){
      describe("Panel", function(){
        beforeEach(function(){
          this.panel = new Marionette.Object();
          this.panel.collection = { filter: sinon.stub() };
          sinon.stub(ContactManager.ContactsApp.List, "Panel").returns(this.panel);
          this.list = new Marionette.Object();
          sinon.stub(ContactManager.ContactsApp.List, "Contacts").returns(this.list);
        });

        afterEach(function(){
          delete this.panel;
          ContactManager.ContactsApp.List.Panel.restore();
          ContactManager.ContactsApp.List.Contacts.restore();
        });

        describe("if a criterion is provided", function(){
          it("filters the collection", function(){
            this.controller.listContacts("abc");
            expect(this.panel.collection.filter).to.have.been.calledWith("abc").once;
          });

          it("triggers method 'set:filter:criterion' (with criterion) on show", sinon.test(function(){
            this.stub(this.panel, "triggerMethod");

            this.controller.listContacts("abc");
            this.panel.trigger("show");
            expect(this.panel.triggerMethod).to.have.been.calledWith("set:filter:criterion", "abc").once;
          }));
        });

        describe("events", function(){
          describe("contacts:filter", function(){
            it("filters contacts", function(){
              this.controller.listContacts();
              this.panel.trigger("contacts:filter", "xyz");
              expect(this.panel.collection.filter).to.have.been.calledWith("xyz").once;
            });

            it("triggers 'contacts:filter on the main app, forwarding the criterion", sinon.test(function(){
              this.stub(ContactManager, "trigger");
              this.controller.listContacts();
              this.panel.trigger("contacts:filter", "xyz");
              expect(ContactManager.trigger).to.have.been.calledWith("contacts:filter", "xyz").once;
            }));
          });

          describe("contact:new", function(){
            beforeEach(function(){
              this.newModel = { save: sinon.stub() };
              this.newView = _.extend({ model: this.newModel }, Backbone.Events);
              sinon.stub(ContactManager.ContactsApp.List, "NewModal").returns(this.newView);
              sinon.stub(ContactManager.regions.dialog, "show");
            });

            afterEach(function(){
              ContactManager.ContactsApp.List.NewModal.restore();
              ContactManager.regions.dialog.show.restore();
              delete this.newView;
              delete this.newModel;
            });

            it("displays a new contact view in the dialog region", function(){
              this.controller.listContacts();
              this.panel.trigger("contact:new");
              expect(ContactManager.regions.dialog.show).to.have.been.calledWith(this.newView).once;
            });

            describe("successful save of new contact", function(){
              beforeEach(function(){
                this.newChildViewStub = { flash: sinon.stub() };
                this.list.children = { findByModel: sinon.stub() };
                this.list.children.findByModel.returns(this.newChildViewStub);
                this.newModel.save.returns(true);
                sinon.stub(ContactManager.Entities, "Contact").returns(this.newModel);
              });

              afterEach(function(){
                delete this.newChildViewStub;
                delete this.list.children;
                ContactManager.Entities.Contact.restore();
              });

              it("adds the new contact to the contact collection", sinon.test(function(){
                var collection = new Backbone.Collection();
                this.stub(collection, "add");
                this.stub(ContactManager, "request").withArgs("contact:entities").returns(collection);

                this.controller.listContacts();
                this.panel.trigger("contact:new");
                this.newView.trigger("contact:created", this.newModel);
                expect(collection.add).to.have.been.calledWith(this.newModel).once;
              }));

              it("executes the new model's item view's 'flash' method if it is currently displayed", function(){
                this.controller.listContacts();
                this.panel.trigger("contact:new");
                this.newView.trigger("contact:created", this.newModel);
                expect(this.newChildViewStub.flash).to.have.been.calledWith("success").once;
              });
            });
          });
        });
      });

      describe("Contacts", function(){
        describe("events", function(){
          beforeEach(function(){
            this.model = new ContactManager.Entities.Contact({ id: 3 });
            this.view = new ContactManager.ContactsApp.List.Contacts({ collection: new ContactManager.Entities.ContactCollection() });
            sinon.stub(ContactManager.ContactsApp.List, "Contacts").returns(this.view);
          });

          afterEach(function(){
            delete this.view;
            delete this.model;
            ContactManager.ContactsApp.List.Contacts.restore();
          });

          describe("childview:contact:show", function(){
            it("triggers 'contact:show' with the proper id", sinon.test(function(){
              this.stub(ContactManager, "trigger");

              this.controller.listContacts();
              this.view.trigger("childview:contact:show", null, { model: this.model });
              expect(ContactManager.trigger).to.have.been.calledWith("contact:show", this.model.get("id")).once;
            }));
          });

          describe("childview:contact:delete", function(){
            it("destroys the provided model", sinon.test(function(){
              this.stub(this.model, "destroy");

              this.controller.listContacts();
              this.view.trigger("childview:contact:delete", null, { model: this.model });

              expect(this.model.destroy).to.have.been.called.once;
            }));
          });

          describe("childview:contact:edit", function(){
            beforeEach(function(){
              this.editView = new Marionette.Object();
              sinon.stub(ContactManager.ContactsApp.Edit, "Contact").returns(this.editView);
              sinon.stub(ContactManager.regions.dialog, "show");
            });

            afterEach(function(){
              ContactManager.ContactsApp.Edit.Contact.restore();
              ContactManager.regions.dialog.show.restore();
            });

            it("displays an edit view (in the dialog region) for the provided model", function(){
              this.controller.listContacts();
              var options = { model: this.model };
              this.view.trigger("childview:contact:edit", null, options);
              expect(ContactManager.ContactsApp.Edit.Contact).to.have.been.calledWith(options).once;
              expect(ContactManager.regions.dialog.show).to.have.been.calledWith(this.editView).once;
            });

            describe("saving the updated contact", function(){
              describe("success", function(){
                beforeEach(function(){
                  this.childView = {
                    render: sinon.stub(),
                    flash: sinon.stub()
                  };
                  sinon.stub(this.model, "save").returns(true);

                  this.controller.listContacts();
                  this.view.trigger("childview:contact:edit", this.childView, { model: this.model });
                });

                afterEach(function(){
                  delete this.childView;
                  this.model.save.restore();
                });

                it("rerenders the childview", function(){
                  this.editView.trigger("form:submit", {});
                  expect(this.childView.render).to.have.been.called.once;
                });

                it("calls the childview's flash method", function(){
                  this.editView.trigger("form:submit", {});
                  expect(this.childView.flash).to.have.been.called.once;
                });

                it("triggers 'dialog:close' on the edit view", sinon.test(function(){
                  this.spy(this.editView, "trigger");
                  this.editView.trigger("form:submit", {});
                  expect(this.editView.trigger).to.have.been.calledWith("dialog:close").once;
                }));
              });

              describe("failure", function(){
                beforeEach(function(){
                  var error = { error: "test error" };
                  this.error = error;
                  sinon.stub(this.model, "save", function(){
                    this.validationError = error;
                    return false;
                  });

                  this.controller.listContacts();
                  this.view.trigger("childview:contact:edit", this.childView, { model: this.model });
                });

                afterEach(function(){
                  delete this.error;
                  this.model.save.restore();
                });

                it("calls the 'form:data:invalid' trigger method on the edit view, sending the errors", sinon.test(function(){
                  this.stub(this.editView, "triggerMethod");
                  this.editView.trigger("form:submit", {});
                  expect(this.editView.triggerMethod).to.have.been.calledWith("form:data:invalid", this.error).once;
                }));
              });
            });
          });
        });
      });
    });
  });
});
