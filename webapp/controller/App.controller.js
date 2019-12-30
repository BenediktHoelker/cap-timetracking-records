sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("iot.timetracking-worklist.controller.App", {

		onInit : function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});