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
      "iot.timetracking-worklist.controller.CreateEmployee",
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
          const oNewEmployee = this.getModel("viewModel").getProperty(
            "/newEntity"
          );

          oNewEmployee.projects = this.byId("projectsSelect")
            .getSelectedItems()
            .map(item => item.getBindingContext().getObject())
            .map(project => ({
              projectID: project.ID,
              title: project.title,
              description: project.description
            }));

          const oContext = this.getListBinding("Employees").create(
            oNewEmployee
          );

          oContext.created().then(() => this.getRouter().navTo("worklist"));
        },

        onPressCancel: function() {
          history.go(-1);
        }
      }
    );
  }
);
