sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function(BaseController, JSONModel, MessageToast) {
    "use strict";

    const INITIAL_DATA = {};

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
                return this._createRecord();
              }
            })
            .then(path => this._bindView(path));
        },

        _createRecord: function() {
          const dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "yyyy-MM-dd"
          });
          const dateFormatted = dateFormat.format(new Date());
          const oContext = this.getListBinding("Records").create({
            date: dateFormatted,
            status_ID: "c567cd98-e988-4d05-9116-c62dbf4b76df"
          });

          return oContext.created().then(() => oContext.getPath());
        }
      }
    );
  }
);
