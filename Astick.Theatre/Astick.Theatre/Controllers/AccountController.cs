using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Astick.Theatre.Controllers {
	[Route("[controller]/[action]")]
	public class AccountController : Controller {
		private readonly SignInManager<Cl_User> _signInManager;
		private readonly ILogger _logger;

		public AccountController(SignInManager<Cl_User> signInManager, ILogger<AccountController> logger) {
			_signInManager = signInManager;
			_logger = logger;
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> Logout() {
			await _signInManager.SignOutAsync();
			_logger.LogInformation("User logged out.");
			return RedirectToPage("/Index");
		}
	}
}
