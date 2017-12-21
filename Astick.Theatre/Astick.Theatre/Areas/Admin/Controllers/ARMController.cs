using Astick.Theatre;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Astick.Web.Areas.Admin.Controllers {
	public class ARMController : Cl_ARMController {
		public ARMController(Cl_Settings a_Settings, Cl_AppDbContext a_AppDbContext)
			: base(a_Settings, a_AppDbContext) {
		}

		public async Task<ActionResult> f_GetUser() {
			IQueryable<Cl_User> users = m_AppDbContext.p_Users;
			Cl_User user = await users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
			if (user != null) {
				return Json(new { p_Name = user.f_GetInitials(), p_Mobile = user.p_Mobile, p_Email = user.p_Email });
			} else {
				return Json(new { error = "Пользователь не найден!" });
			}
		}
	}
}