using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Astick.Web.Areas.Admin.Controllers {
	public class SessionsController : Cl_BaseAdminController
	{
		public SessionsController(Cl_AppDbContext a_ShopDbContext) {
			m_AppDbContext = a_ShopDbContext;
		}

		private Cl_AppDbContext m_AppDbContext;

		public ActionResult Index() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Cities/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/Cities/Index.cshtml");
		}

		[HttpPost]
		public async Task<ActionResult> TableCities(Ctrl_Table.Cl_Params<Cl_Session> a_Grid) {
			if (a_Grid != null) {
				return await a_Grid.f_Execute(m_AppDbContext, m_AppDbContext.p_Sessions);
			}
			return new EmptyResult();
		}
	}
}
