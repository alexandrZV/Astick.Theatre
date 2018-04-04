using Astick.Theatre.Entities;
using Astick.Theatre.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Astick.Theatre.Pages.Account.Manage {
	public partial class IndexModel : PageModel {
		private readonly UserManager<Cl_User> _userManager;
		private readonly SignInManager<Cl_User> _signInManager;
		private readonly IEmailSender _emailSender;

		public IndexModel(
				UserManager<Cl_User> userManager,
				SignInManager<Cl_User> signInManager,
				IEmailSender emailSender) {
			_userManager = userManager;
			_signInManager = signInManager;
			_emailSender = emailSender;
		}

		[Display(Name = "Логин")]
		public string Username { get; set; }

		public bool IsEmailConfirmed { get; set; }

		[TempData]
		public string StatusMessage { get; set; }

		[BindProperty]
		public InputModel Input { get; set; }

		public class InputModel {
			[Required]
			[EmailAddress]
			public string Email { get; set; }

			[Phone]
			[Display(Name = "Мобильный")]
			public string PhoneNumber { get; set; }
		}

		public async Task<IActionResult> OnGetAsync() {
			var user = await _userManager.GetUserAsync(User);
			if (user == null) {
				throw new ApplicationException($"Не удалось загрузить пользователя с ID '{_userManager.GetUserId(User)}'.");
			}

			Username = user.UserName;

			Input = new InputModel {
				Email = user.Email,
				PhoneNumber = user.PhoneNumber
			};

			IsEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);

			return Page();
		}

		public async Task<IActionResult> OnPostAsync() {
			if (!ModelState.IsValid) {
				return Page();
			}

			var user = await _userManager.GetUserAsync(User);
			if (user == null) {
				throw new ApplicationException($"Не удалось загрузить пользователя с ID '{_userManager.GetUserId(User)}'.");
			}

			if (Input.Email != user.Email) {
				var setEmailResult = await _userManager.SetEmailAsync(user, Input.Email);
				if (!setEmailResult.Succeeded) {
					throw new ApplicationException($"Произошла непредвиденная ошибка при настройке электронной почты для пользователя с ID '{user.Id}'.");
				}
			}

			if (Input.PhoneNumber != user.PhoneNumber) {
				var setPhoneResult = await _userManager.SetPhoneNumberAsync(user, Input.PhoneNumber);
				if (!setPhoneResult.Succeeded) {
					throw new ApplicationException($"Произошла непредвиденная ошибка, указав номер телефона для пользователя с ID '{user.Id}'.");
				}
			}

			StatusMessage = "Ваш профиль был обновлен";
			return RedirectToPage();
		}
		public async Task<IActionResult> OnPostSendVerificationEmailAsync() {
			if (!ModelState.IsValid) {
				return Page();
			}

			var user = await _userManager.GetUserAsync(User);
			if (user == null) {
				throw new ApplicationException($"Не удалось загрузить пользователя с ID '{_userManager.GetUserId(User)}'.");
			}

			var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
			var callbackUrl = Url.EmailConfirmationLink(user.Id.ToString(), code, Request.Scheme);
			await _emailSender.SendEmailConfirmationAsync(user.Email, callbackUrl);

			StatusMessage = "Отправлено электронное письмо с подтверждением. Пожалуйста, проверьте свой адрес электронной почты.";
			return RedirectToPage();
		}
	}
}
