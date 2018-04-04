using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Astick.Web.Areas.Admin.Controllers
{
	/// <summary>
	/// Базовый класс контроллера администрирования
	/// </summary>
	[Authorize(Roles = "admin,cashier")]
	[Area("Admin")]
	public abstract class Cl_BaseAdminController : Cl_BaseARMController
	{
		
	}
}