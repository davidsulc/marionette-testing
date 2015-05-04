describe("HeaderApp", function(){
  it("lists the headers when started", sinon.test(function(){
    this.stub(ContactManager.HeaderApp.List.Controller, "listHeader");
    expect(ContactManager.HeaderApp.List.Controller.listHeader).to.not.have.been.called;
    ContactManager.HeaderApp.start();
    expect(ContactManager.HeaderApp.List.Controller.listHeader).to.have.been.called.once;
  }));

  it("sets a command handler for 'set:active:header'", sinon.test(function(){
    this.stub(ContactManager.HeaderApp.List.Controller, "setActiveHeader");
    expect(ContactManager.HeaderApp.List.Controller.setActiveHeader).to.not.have.been.called;
    ContactManager.execute("set:active:header", "test");
    expect(ContactManager.HeaderApp.List.Controller.setActiveHeader).to.have.been.calledWith("test").once;
  }));
});
