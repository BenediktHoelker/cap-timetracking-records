sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function(BaseController, JSONModel, MessageToast) {
    "use strict";

    const INITIAL_DATA = {
      newRecord: {
        title: "",
        description: "",
        time: 0
      }
    };

    return BaseController.extend(
      "iot.timetracking-worklist.controller.CreateRecord",
      {
        onInit: function() {
          const oViewModel = new JSONModel(INITIAL_DATA);

          this.getView().setModel(oViewModel, "viewModel");

          this.getRouter()
            .getRoute("createRecord")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
          const oViewModel = this.getModel("viewModel");
          const sObjectId = oEvent.getParameter("arguments").objectId;

          let sPath = "/Records" + sObjectId;

          Promise.resolve()
            .then(() => {
              if (sObjectId) {
                return sPath;
              } else {
                const oContext = this.getListBinding("Records").create();
                return oContext.created().then(() => oContext.getPath());
              }
            })
            .then(path => this._bindView(path));
        }
      }
    );
  }
);
