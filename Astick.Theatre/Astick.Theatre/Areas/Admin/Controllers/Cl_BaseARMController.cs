using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Astick.Web.Areas.Admin.Controllers
{
	/// <summary>
	/// Базовый класс контроллера АРМ
	/// </summary>
	public abstract class Cl_BaseARMController : Cl_ControllerBase
	{
		public override void OnActionExecuted(ActionExecutedContext context) {
			if (context.Exception != null) {
				JsonResult res = new JsonResult(new { error = string.Format("{0} {1} {2}", context.Exception.Message, context.Exception.InnerException != null ? context.Exception.InnerException.Message : "", context.Exception.StackTrace) });
				context.Result = res;
				context.ExceptionHandled = true;
			}
			base.OnActionExecuted(context);
		}

		/// <summary>Возвращает пустой результат</summary>
		protected ActionResult f_GetTableResultEmpty() {
			return Json(Ctrl_Table.f_GetTableResultEmpty());
		}
	}
}