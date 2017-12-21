using Astick.Core.Extensions;
using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Astick.Web.Areas.Admin.Controllers {
	public class RolesController : Cl_BaseAdminController
	{
		public RolesController(RoleManager<Cl_Role> a_RoleManager) {
			m_RoleManager = a_RoleManager;
		}

		private readonly RoleManager<Cl_Role> m_RoleManager;

		[HttpGet]
		public ActionResult Index()
		{
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Roles/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/Roles/Index.cshtml");
		}

		public async Task<ActionResult> f_GetRoles(Ctrl_Table.Cl_Settings a_Grid)
		{
			var result = new object();
			await Task.Run(() => {
				IQueryable<Cl_Role> roles = m_RoleManager.Roles;
				roles = roles.f_OrderBy(a_Grid.p_SortColumn, a_Grid.p_Direction);
				var count = roles.Count();
				var data = roles.Skip(a_Grid.p_PageIndex * a_Grid.p_PageSize).Take(a_Grid.p_PageSize).ToArray();
				result = new {
					total = (int)Math.Ceiling((double)count / a_Grid.p_PageSize),
					page = a_Grid.p_PageIndex,
					records = count,
					rows = data
				};
			});
			return Json(result);
		}

		[HttpPost]
		public async Task f_CreateRole(Cl_Role a_Role)
		{
			var result = await m_RoleManager.CreateAsync(a_Role);
			if (!result.Succeeded) {
				throw new Exception("Не удалось создать роль." + result.Errors.FirstOrDefault()?.Description);
			}
		}
		[HttpPost]
		public async Task f_UpdateRole(Cl_Role a_Role)
		{
			Cl_Role role = await m_RoleManager.FindByIdAsync(a_Role.p_ID.ToString());
			role.p_Name = a_Role.p_Name;
			role.p_Description = a_Role.p_Description;
			var result = await m_RoleManager.UpdateAsync(role);
			if (!result.Succeeded) {
				throw new Exception("Не удалось изменить роль." + result.Errors.FirstOrDefault()?.Description);
			}
		}
		[HttpPost]
		public async Task f_DeleteRole(string p_Name)
		{
			Cl_Role role = await m_RoleManager.FindByNameAsync(p_Name);
			var result = await m_RoleManager.DeleteAsync(role);
			if (!result.Succeeded) {
				throw new Exception("Не удалось удалить роль." + result.Errors.FirstOrDefault()?.Description);
			}
		}
  }
}
