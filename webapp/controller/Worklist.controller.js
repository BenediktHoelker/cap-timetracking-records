sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend(
      "iot.timetracking-worklist.controller.Worklist",
      {
        formatter: formatter,

        onInit: function() {
          this._aTableSearchState = [];

          const oViewModel = new JSONModel({
            worklistTableTitle: this.getResourceBundle().getText(
              "worklistTableTitle"
            )
          });

          this.setModel(oViewModel, "worklistView");
        },

        onAfterRendering: function() {
          const oItemsBinding = this.byId("table").getBinding("items");
          this.getModel().refresh();
          this.setListBinding("Employees", oItemsBinding);
        },

        onPressDelete: function(oEvent) {
          const oTable = this.byId("table");
          const aSelectedContexts = oTable.getSelectedContexts();
          aSelectedContexts.forEach(oContext => oContext.delete());
        },

        onUpdateFinished: function(oEvent) {
          let sTitle = this.getResourceBundle().getText("worklistTableTitle");
          const oTable = oEvent.getSource();
          const iTotalItems = oEvent.getParameter("total");

          if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
            sTitle = this.getResourceBundle().getText(
              "worklistTableTitleCount",
              [iTotalItems]
            );
          }

          this.getModel("worklistView").setProperty(
            "/worklistTableTitle",
            sTitle
          );
        },

        onPress: function(oEvent) {
          this._showObject(oEvent.getSource());
        },

        onNavBack: function() {
          // eslint-disable-next-line sap-no-history-manipulation
          history.go(-1);
        },

        onPressAdd: function() {
          this.getRouter().navTo("createRecord");
        },

        onSearch: function(oEvent) {
          if (oEvent.getParameters().refreshButtonPressed) {
            this.onRefresh();
          } else {
            var aTableSearchState = [];
            var sQuery = oEvent.getParameter("query");

            if (sQuery && sQuery.length > 0) {
              aTableSearchState = [
                new Filter("surname", FilterOperator.Contains, sQuery)
              ];
            }
            this._applySearch(aTableSearchState);
          }
        },

        onRefresh: function() {
          this.byId("table")
            .getBinding("items")
            .refresh();
        },

        _showObject: function(oItem) {
          oItem
            .getBindingContext()
            .requestCanonicalPath()
            .then(sObjectPath =>
              this.getRouter().navTo("object", {
                objectId_Old: oItem.getBindingContext().getProperty("ID"),
                objectId: sObjectPath.slice("/Employees".length)
              })
            );
        },

        _applySearch: function(aTableSearchState) {
          const oTable = this.byId("table");
          const oViewModel = this.getModel("worklistView");

          oTable.getBinding("items").filter(aTableSearchState, "Application");

          if (aTableSearchState.length !== 0) {
            oViewModel.setProperty(
              "/tableNoDataText",
              this.getResourceBundle().getText("worklistNoDataWithSearchText")
            );
          }
        }
      }
    );
  }
);
