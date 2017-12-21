using Astick.Theatre;
using Astick.Theatre.Data;
using Microsoft.AspNetCore.Authorization;

namespace Astick.Web.Areas.Admin.Controllers {
	[Authorize]
	public class Cl_ARMController : Cl_BaseARMController {
		public Cl_ARMController(Cl_Settings a_Settings, Cl_AppDbContext a_AppDbContext) {
			m_Settings = a_Settings;
			m_AppDbContext = a_AppDbContext;
		}

		protected readonly Cl_Settings m_Settings;
		protected Cl_AppDbContext m_AppDbContext;
	}
}