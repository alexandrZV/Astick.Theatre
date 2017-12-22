"use strict";

p_Title = "Админ";

function Cl_Admin() {
	Cl_ARM.apply(this, arguments);
	this.p_ARMTitle = 'Админ';

	var that = this;

	this.f_Init = function () {
		that.f_MenuInit();
		that.f_SetTitle();
		document.addEventListener('changedPageContent', function (e) {
			that.f_SetTitle();
		});
	};

	this.f_MenuInit = function () {
		var menu = document.querySelector('.leftMenu .mdl-navigation');
		componentHandler.downgradeElements(menu);
		componentHandler.upgradeElement(menu, "MaterialNavigation");
	};
}
Cl_Admin.prototype = Object.create(Cl_ARM.prototype);
Cl_Admin.prototype.constructor = Cl_Admin;

var m_Admin = new Cl_Admin();

document.addEventListener("DOMContentLoaded", function (event) {
	m_Admin.f_Init();
});

