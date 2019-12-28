sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/UIComponent"
  ],
  function(Controller, Fragment, UIComponent) {
    "use strict";

    return Controller.extend(
      "iot.timetracking-worklist.controller.BaseController",
      {
        getListBinding: function(sName, sEntity) {
          const oListBinding = this.getOwnerComponent()._oListBindings[sName];

          if (!oListBinding) {
            return this.getModel().bindList(sEntity);
          }

          return oListBinding;
        },

        setListBinding: function(sName, oListBinding) {
          this.getOwnerComponent()._oListBindings[sName] = oListBinding;
        },

        _deepClone: function(object) {
          return JSON.parse(JSON.stringify(object));
        },

        getRouter: function() {
          return UIComponent.getRouterFor(this);
        },

        getModel: function(sName) {
          return (
            this.getView().getModel(sName) ||
            this.getOwnerComponent().getModel(sName)
          );
        },

        setModel: function(oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function() {
          return this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
        },

        _getFragment: function(sFragmentName) {
          const sVariableName = "_o" + sFragmentName + "Fragment";
          const oFragment = this[sVariableName];
          const oAncestorView = this.getView();

          if (oFragment) {
            return Promise.resolve(oFragment);
          } else {
            return Fragment.load({
              id: sFragmentName,
              name: "iot.timetracking-worklist.view.dialogs." + sFragmentName,
              controller: this
            }).then(oLoadedFragment => {
              this[sVariableName] = oLoadedFragment;
              oAncestorView.addDependent(oLoadedFragment);

              return oLoadedFragment;
            });
          }
        },

        closeDialog: function(oEvent) {
          const oDialog = oEvent.getSource().getParent();
          oDialog.close();
        },

        onPressCancel: function() {
          history.go(-1);
        },

        _bindView: function(sObjectPath) {
          const oView = this.getView();

          this.getView().bindElement({
            path: sObjectPath,
            events: {
              change: this._onBindingChange.bind(this),
              dataRequested: () => oView.setBusy(true),
              dataReceived: () => oView.setBusy(false)
            }
          });
        },

        _onBindingChange: function() {
          const oView = this.getView();
          const oElementBinding = oView.getElementBinding();

          // No data for the binding
          if (!oElementBinding.getBoundContext()) {
            return this.getRouter()
              .getTargets()
              .display("objectNotFound");
          }

          oView
            .getBindingContext()
            .requestObject()
            .then(() => oView.setBusy(false));
        }
      }
    );
  }
);
