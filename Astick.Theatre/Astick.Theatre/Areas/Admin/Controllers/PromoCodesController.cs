using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Astick.Web.Areas.Admin.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Astick.Theatre.Areas.Admin.Controllers {
	public class PromoCodesController : Cl_BaseAdminController {
		public PromoCodesController(Cl_AppDbContext a_ShopDbContext) {
			m_AppDbContext = a_ShopDbContext;
		}

		private Cl_AppDbContext m_AppDbContext;

		public ActionResult Index() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/PromoCodes/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/PromoCodes/Index.cshtml");
		}

		[HttpPost]
		public async Task<ActionResult> TablePromoCodes(Ctrl_Table.Cl_Params<Cl_PromoCode> a_Grid) {
			if (a_Grid != null) {
				if (a_Grid.p_Action == Ctrl_Table.E_Actions.Edit || a_Grid.p_Action == Ctrl_Table.E_Actions.Add) {
					if (a_Grid.p_Object.p_DateStart > a_Grid.p_Object.p_DateEnd) {
						throw new Exception("Дата начало действия промо-кода больше его завершения");
					}
				}
				return await a_Grid.f_Execute(m_AppDbContext, m_AppDbContext.p_PromoCodes);
			}
			return new EmptyResult();
		}

		[HttpGet]
		public async Task<ActionResult> SelectPromoCodes(Ctrl_Select.Cl_Params<Cl_PromoCode> a_Select) {
			return await a_Select.f_ExecuteAsync(m_AppDbContext.p_PromoCodes, new string[] { "F_CODE" }, "F_DATE_START <= CONVERT(date, GETDATE()) and F_DATE_END >= CONVERT(date, GETDATE())");
		}
	}
}
