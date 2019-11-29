sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function(BaseController, JSONModel, MessageToast) {
    "use strict";

    const INITIAL_DATA = {
      newRecord: {
        title: "",
        description: "",
        duration: 0
      }
    };

    return BaseController.extend(
      "iot.timetracking-worklist.controller.CreateRecord",
      {
        onInit: function() {
          const oViewModel = new JSONModel(this._deepClone(INITIAL_DATA));

          this.getView().setModel(oViewModel, "viewModel");

          this.getRouter()
            .getTargets()
            .getTarget("createRecord")
            .attachDisplay(this._onRouteMatched, this);
        },

        _onRouteMatched: function() {
          this.getModel("viewModel").setData(this._deepClone(INITIAL_DATA));
        },

        onPressSave: function() {
          const oNewRecord = this.getModel("viewModel").getProperty(
            "/newRecord"
          );
          const oContext = this.getListBinding("Records").create(oNewRecord);

          oContext.created()
            .then(oContext => {
              this.getListBinding("Employees", "/Employees").refresh();
              console.log(oContext);
            }).then(() => history.go(-1));
        },

        onPressCancel: function() {
          history.go(-1);
        }
      }
    );
  }
);
