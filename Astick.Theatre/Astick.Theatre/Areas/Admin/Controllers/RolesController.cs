using Astick.Core.Extensions;
using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Astick.Web.Areas.Admin.Controllers {
	public class RolesController : Cl_BaseAdminController
	{
		public RolesController(Cl_AppDbContext a_AppDbContext, RoleManager<Cl_Role> a_RoleManager) {
			m_AppDbContext = a_AppDbContext;
			m_RoleManager = a_RoleManager;
		}

		private readonly Cl_AppDbContext m_AppDbContext;
		private readonly RoleManager<Cl_Role> m_RoleManager;

		[HttpGet]
		public ActionResult Index() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Roles/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/Roles/Index.cshtml");
		}

		[HttpPost]
		public async Task<ActionResult> TableRoles(Ctrl_Table.Cl_Params<Cl_Role> a_Grid) {
			if (a_Grid != null) {
				ActionResult result = await a_Grid.f_Execute(m_AppDbContext, m_RoleManager.Roles);
				return result;
			}
			return new EmptyResult();
		}

		[HttpPost]
		public async Task<ActionResult> f_CreateRole(Cl_Role a_Role) {
			var result = await m_RoleManager.CreateAsync(a_Role);
			if (!result.Succeeded) {
				throw new Exception("Не удалось создать роль." + result.Errors.FirstOrDefault()?.Description);
			}
			Cl_Role role = await m_RoleManager.FindByNameAsync(a_Role.p_Name);
			return Json(role);
		}
		[HttpPost]
		public async Task<ActionResult> f_UpdateRole(Cl_Role a_Role) {
			Cl_Role role = await m_RoleManager.FindByIdAsync(a_Role.p_ID.ToString());
			role.p_Name = a_Role.p_Name;
			role.p_Description = a_Role.p_Description;
			var result = await m_RoleManager.UpdateAsync(role);
			if (!result.Succeeded) {
				throw new Exception("Не удалось изменить роль." + result.Errors.FirstOrDefault()?.Description);
			}
			return Json(role);
		}
		[HttpPost]
		public async Task f_DeleteRole(string p_Name) {
			Cl_Role role = await m_RoleManager.FindByNameAsync(p_Name);
			var result = await m_RoleManager.DeleteAsync(role);
			if (!result.Succeeded) {
				throw new Exception("Не удалось удалить роль." + result.Errors.FirstOrDefault()?.Description);
			}
		}
	}
}
