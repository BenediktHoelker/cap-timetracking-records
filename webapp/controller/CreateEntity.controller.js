sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function(BaseController, JSONModel, MessageToast) {
    "use strict";

    const INITIAL_DATA = {
      newEntity: {
        name: ""
      }
    };

    return BaseController.extend(
      "iot.timetracking-worklist.controller.CreateEntity",
      {
        onInit: function() {
          const oViewModel = new JSONModel(this._deepClone(INITIAL_DATA));

          this.getView().setModel(oViewModel, "viewModel");

          this.getRouter()
            .getRoute("create")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function() {
          this.getModel("viewModel").setData(this._deepClone(INITIAL_DATA));
        },

        onPressSave: function() {
          const oNewEntity = this.getModel("viewModel").getProperty(
            "/newEntity"
          );
          const oContext = this.getListBinding().create(oNewEntity);

          oContext.created().then(() => this.getRouter().navTo("worklist"));
        }
      }
    );
  }
);
