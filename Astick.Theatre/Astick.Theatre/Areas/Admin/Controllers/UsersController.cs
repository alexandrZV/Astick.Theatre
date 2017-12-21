using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astick.Web.Areas.Admin.Controllers {
	public class UsersController : Cl_BaseAdminController
	{
		public UsersController(Cl_AppDbContext a_AppDbContext, UserManager<Cl_User> a_UserManager, RoleManager<Cl_Role> a_RoleManager, SignInManager<Cl_User> a_SignInManager) {
			m_AppDbContext = a_AppDbContext;
			m_UserManager = a_UserManager;
			m_RoleManager = a_RoleManager;
			m_SignInManager = a_SignInManager;
		}

		private readonly Cl_AppDbContext m_AppDbContext;
		private readonly UserManager<Cl_User> m_UserManager;
		private readonly RoleManager<Cl_Role> m_RoleManager;
		private readonly SignInManager<Cl_User> m_SignInManager;

		[HttpGet]
		public ActionResult Index() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Users/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/Users/Index.cshtml");
		}

		[HttpPost]
		public async Task<ActionResult> TableUsers(Ctrl_Table.Cl_Params<Cl_User> a_Grid) {
			if (a_Grid != null) {
				ActionResult result = await a_Grid.f_Execute(m_AppDbContext, m_UserManager.Users);
				return result;
			}
			return new EmptyResult();
		}

		[HttpPost]
		public async Task f_CreateUser(string p_UserName, string p_Password, string p_Name, string p_SurName, string p_LastName, string p_Email, string p_Mobile, string p_Comment, DateTime? p_Birthday, string p_Address, bool p_IsLockedOut = false, bool p_IsTax = false) {
			Cl_User user = new Cl_User {
				Email = p_Email, UserName = p_UserName, p_CreateDate = DateTime.Now, EmailConfirmed = true,
				p_SurName = p_SurName, p_Name = p_Name, p_LastName = p_LastName,
				p_Mobile = p_Mobile, p_Comment = p_Comment, p_Birthday = p_Birthday, p_Address = p_Address, p_IsLockedOut = p_IsLockedOut
			};
			var result = await m_UserManager.CreateAsync(user, p_Password);
			if (!result.Succeeded) {
				throw new Exception("Не удалось создать пользователя." + result.Errors.FirstOrDefault()?.Description);
			}
		}
		[HttpPost]
		public async Task f_UpdateUser(Guid p_ID, string p_Password, string p_UserName, string p_Name, string p_SurName, string p_LastName, string p_Email, string p_Mobile, string p_Comment, DateTime? p_Birthday, string p_Address, bool p_EmailConfirmed, bool p_IsLockedOut = false, bool p_IsTax = false) {
			Cl_User user = await m_UserManager.FindByIdAsync(p_ID.ToString());
			user.Email = p_Email;
			user.UserName = p_UserName;
			user.p_SurName = p_SurName;
			user.p_Name = p_Name;
			user.p_LastName = p_LastName;
			user.p_Mobile = p_Mobile;
			user.p_Comment = p_Comment;
			user.p_Birthday = p_Birthday;
			user.p_Address = p_Address;
			user.p_IsLockedOut = p_IsLockedOut;
			user.EmailConfirmed = p_EmailConfirmed;
			await m_UserManager.UpdateAsync(user);
			if (!string.IsNullOrWhiteSpace(p_Password) && User.Identity.Name == user.p_UserName) {
				var result = await m_SignInManager.PasswordSignInAsync(p_UserName, p_Password, isPersistent: false, lockoutOnFailure: false);
				if (!result.Succeeded) {
					throw new Exception("Не удалось изменить пользователя.");
				}
			}
		}
		[HttpPost]
		public async Task f_DeleteUser(string p_UserName) {
			var result = await m_UserManager.DeleteAsync(await m_UserManager.FindByNameAsync(p_UserName));
			if (!result.Succeeded) {
				throw new Exception("Не удалось удалить пользователя." + result.Errors.FirstOrDefault()?.Description);
			}
		}

		public class ListInRoles
		{
			public string p_RoleName { set; get; }
			public bool p_InRole { set; get; }
		}

		[HttpPost]
		public async Task<JsonResult> f_GetRolesForUser(string p_UserName) {
			Cl_User user = await m_UserManager.FindByNameAsync(p_UserName);
			IList<string> rolesUser = await m_UserManager.GetRolesAsync(user);
			List<ListInRoles> InRoles = new List<ListInRoles>();
			foreach (Cl_Role role in m_RoleManager.Roles) {
				ListInRoles inRole = new ListInRoles();
				inRole.p_RoleName = role.Name;
				foreach (string roleUser in rolesUser) {
					if (roleUser == role.Name) {
						inRole.p_InRole = true;
						break;
					}
				}
				InRoles.Add(inRole);
			}

			var data = InRoles.ToList().AsQueryable();
			var result = new {
				user = p_UserName,
				roles = (from host in data
								 select new {
									 roleName = host.p_RoleName,
									 inRole = host.p_InRole
								 }).ToArray()
			};
			return Json(result);
		}
		[HttpPost]
		public async Task f_SetRolesForUser(string a_UserName, Guid a_OfficeID, ListInRoles[] a_Roles) {
			if (string.IsNullOrWhiteSpace(a_UserName))
				throw new Exception("Имя пользователя пустое!");
			Cl_User user = await m_UserManager.FindByNameAsync(a_UserName);
			if (user != null) {
				IList<string> delRoles = await m_UserManager.GetRolesAsync(user);
				List<string> addRoles = new List<string>();
				foreach (ListInRoles role in a_Roles) {
					if (role.p_InRole)
						addRoles.Add(role.p_RoleName);
				}
				if (delRoles.Count > 0) {
					await m_UserManager.RemoveFromRolesAsync(user, delRoles);
				}
				if (addRoles.Count > 0) {
					await m_UserManager.AddToRolesAsync(user, addRoles);
				}
				await m_UserManager.UpdateAsync(user);
			} else {
				throw new Exception("Пользователь " + a_UserName + " не найден!");
			}
		}
	}
}
