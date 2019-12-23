sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function(BaseController, JSONModel, MessageToast) {
    "use strict";

    const INITIAL_DATA = {
      projectToAdd: ""
    };

    return BaseController.extend(
      "iot.timetracking-worklist.controller.CreateEmployee",
      {
        onInit: function() {
          const oViewModel = new JSONModel(INITIAL_DATA);

          this.getView().setModel(oViewModel, "viewModel");

          this.getRouter()
            .getRoute("createEmployee")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
          const oViewModel = this.getModel("viewModel");
          const sObjectId = oEvent.getParameter("arguments").objectId;
          let sPath = "/Employees" + sObjectId;

          if (!sObjectId) {
            sPath = this.getListBinding("Employees").create();
          }

          oViewModel.setData(INITIAL_DATA);

          this._bindView(sPath);
        },

        onPressDeleteProject: function() {
          const oTable = this.byId("projectsList");
          const aSelectedContexts = oTable.getSelectedContexts();

          aSelectedContexts.forEach(oContext => oContext.delete());
        },

        onPressAddProject: function() {
          this._getFragment("AddProjectDialog").then(oDialog => oDialog.open());
        },

        addProject: function(oEvent) {
          const oEmployee = this.getView()
            .getBindingContext()
            .getObject();

          const sProjectToAdd = this.getModel("viewModel").getProperty(
            "/projectToAdd"
          );

          this.byId("projectsList")
            .getBinding("items")
            .create({
              project_ID: sProjectToAdd,
              employee_ID: oEmployee.ID
            });
        }
      }
    );
  }
);
