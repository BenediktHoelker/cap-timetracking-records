sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter"
  ],
  function(BaseController, JSONModel, History, formatter) {
    "use strict";

    return BaseController.extend(
      "iot.timetracking-worklist.controller.Object",
      {
        formatter: formatter,

        onInit: function() {
          var oViewModel = new JSONModel({
            busy: true,
            delay: 0
          });
          this.getRouter()
            .getRoute("object")
            .attachPatternMatched(this._onObjectMatched, this);
          this.setModel(oViewModel, "objectView");
        },

        onPressEditRecord: function(oEvent) {
          const sPath = oEvent
            .getSource()
            .getBindingContext()
            .getPath();

          this.getRouter().navTo("createRecord", {
            objectId: sPath.split('/records')[1]
          });
        },

        onPressDeleteRecord: function(oEvent) {
          const oTable = this.byId("recordsTable");
          const aSelectedContexts = oTable.getSelectedContexts();
          aSelectedContexts.forEach(oContext => oContext.delete());
        },

        onPressAddRecord: function() {
          const oEmployee = this.getView()
            .getBindingContext()
            .getObject();

          this.getRouter().navTo("createRecord", { employee: oEmployee.ID });
        },

        onPressEditEmployee: function(oEvent) {
          const sPath = oEvent
            .getSource()
            .getBindingContext()
            .getPath();

          this.getRouter().navTo("createEmployee", {
            objectId: sPath.slice("/Employees".length)
          });
        },

        onNavBack: function() {
          var sPreviousHash = History.getInstance().getPreviousHash();
          if (sPreviousHash !== undefined) {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
          } else {
            this.getRouter().navTo("worklist", {}, true);
          }
        },

        _onObjectMatched: function(oEvent) {
          const sObjectId = oEvent.getParameter("arguments").objectId;

          this.setListBinding(
            "Records",
            this.byId("recordsTable").getBinding("items")
          );

          this._bindView("/Employees" + sObjectId);
        }
      }
    );
  }
);
