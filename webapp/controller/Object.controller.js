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

        onPressDeleteRecord: function(oEvent) {
          const oTable = this.byId("recordsTable");
          const aSelectedContexts = oTable.getSelectedContexts();
          aSelectedContexts.forEach(oContext => oContext.delete());
        },

        onPressAddRecord: function() {
          const oEmployee = this.getView().getBindingContext().getObject();

          this.getRouter().getTargets().display("createRecord", {employee: oEmployee.ID});
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
          var sObjectId = oEvent.getParameter("arguments").objectId;

          this._bindView("/Employees" + sObjectId);
        },

        _bindView: function(sObjectPath) {
          var oViewModel = this.getModel("objectView");

          this.setListBinding(
            "Records",
            this.byId("recordsTable").getBinding("items")
          );

          this.getView().bindElement({
            path: sObjectPath,
            events: {
              change: this._onBindingChange.bind(this),
              dataRequested: function() {
                oViewModel.setProperty("/busy", true);
              },
              dataReceived: function() {
                oViewModel.setProperty("/busy", false);
              }
            }
          });
        },

        _onBindingChange: function() {
          var oView = this.getView(),
            oViewModel = this.getModel("objectView"),
            oElementBinding = oView.getElementBinding();

          // No data for the binding
          if (!oElementBinding.getBoundContext()) {
            this.getRouter()
              .getTargets()
              .display("objectNotFound");
            return;
          }

          oView
            .getBindingContext()
            .requestObject()
            .then(() => oViewModel.setProperty("/busy", false);
            ));
        }
      }
    );
  }
);
