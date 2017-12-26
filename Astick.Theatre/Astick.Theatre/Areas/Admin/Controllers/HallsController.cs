using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Astick.Web.Areas.Admin.Controllers {
	public class HallsController : Cl_BaseAdminController {
		public HallsController(Cl_AppDbContext a_ShopDbContext) {
			m_AppDbContext = a_ShopDbContext;
		}

		private Cl_AppDbContext m_AppDbContext;

		public ActionResult Index() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Halls/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/Halls/Index.cshtml");
		}

		[HttpPost]
		public async Task<ActionResult> TableHalls(Ctrl_Table.Cl_Params<Cl_Hall> a_Grid) {
			if (a_Grid != null) {
				if (a_Grid.p_Action == Ctrl_Table.E_Actions.Edit) {
					if (m_AppDbContext.p_Sessions.Any(s => s.p_HallID == a_Grid.p_Object.p_ID)) {
						throw new Exception("Нельзя изменить зал, имеющий хотябы один концерт");
					}
				}
				return await a_Grid.f_Execute(m_AppDbContext, m_AppDbContext.p_Halls);
			}
			return new EmptyResult();
		}
	}
}
