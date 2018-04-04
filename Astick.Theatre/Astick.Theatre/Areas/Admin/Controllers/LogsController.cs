using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Astick.Web.Areas.Admin.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Astick.Theatre.Areas.Admin.Controllers {
	public class LogsController : Cl_BaseAdminController {
		public LogsController(Cl_AppDbContext a_ShopDbContext) {
			m_AppDbContext = a_ShopDbContext;
		}

		private Cl_AppDbContext m_AppDbContext;

		public ActionResult Index() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Logs/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/Logs/Index.cshtml");
		}

		[HttpPost]
		public async Task<ActionResult> TableLogsHalls(Ctrl_Table.Cl_Params<Cl_LogsHalls> a_Grid) {
			if (a_Grid != null && a_Grid.p_Action == Ctrl_Table.E_Actions.Read) {
				DateTime dateStart = DateTime.Now.AddDays(-7);
				DateTime dateEnd = DateTime.Now;
				if (Request.Cookies["m_LogsDateStart"] != null) {
					DateTime.TryParse(Request.Cookies["m_LogsDateStart"], out dateStart);
				}
				if (Request.Cookies["m_LogsDateEnd"] != null) {
					DateTime.TryParse(Request.Cookies["m_LogsDateEnd"], out dateEnd);
				}
				dateStart = dateStart.Date;
				dateEnd = dateEnd.AddDays(1).Date;

				IQueryable<Cl_LogsHalls> logs = m_AppDbContext.p_LogsHalls.Include(l => l.p_User).Include(l => l.p_Seat).ThenInclude(s => s.p_Session).ThenInclude(s => s.p_Hall).Include(l => l.p_PromoCode)
					.Where(l => l.p_Date >= dateStart && l.p_Date <= dateEnd);

				return await a_Grid.f_Execute(m_AppDbContext, logs);
			}
			return new EmptyResult();
		}
	}
}
