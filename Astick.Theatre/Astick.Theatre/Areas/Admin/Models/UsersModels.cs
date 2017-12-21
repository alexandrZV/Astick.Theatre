using System;

namespace Astick.Web.Areas.Admin.Models {
	/// <summary>Класс пользователя.</summary>
	public class Cl_ModelUser {
		/// <summary>ID пользователя.</summary>
		public Guid p_UserID { get; set; }
		/// <summary>Логин.</summary>
		public string p_UserName { get; set; }
		/// <summary>Пароль.</summary>
		public string p_Password { get; set; }
		/// <summary>Имя.</summary>
		public string p_Name { get; set; }
		/// <summary>Фамилия.</summary>
		public string p_Surname { get; set; }
		/// <summary>Отчество.</summary>
		public string p_Lastname { get; set; }
		/// <summary>Email.</summary>
		public string p_Email { get; set; }
		/// <summary>Мобильный.</summary>
		public string p_Mobile { get; set; }
		/// <summary>Время регистрации.</summary>
		public DateTime p_CreateDate { get; set; }
		/// <summary>Время последней авторизации.</summary>
		public DateTime p_LastLoginDate { get; set; }
		/// <summary>Время последней активности.</summary>
		public DateTime p_LastActivityDate { get; set; }
		/// <summary>Время блокировки.</summary>
		public DateTime p_LastLockoutDate { get; set; }
		/// <summary>Признак, показывающий, можно ли проверить подлинность пользователя.</summary>
		public Boolean p_IsApproved { get; set; }
		/// <summary>Время, когда пользователь был заблокирован.</summary>
		public Boolean p_IsLockedOut { get; set; }
		/// <summary>Признак пользователя в сети.</summary>
		public Boolean p_IsOnline { get; set; }
		/// <summary>Комментарий к пользователю.</summary>
		public string p_Comment { get; set; }
		/// <summary>День рождения.</summary>
		public DateTime? p_Birthday { get; set; }
		/// <summary>Адрес проживания.</summary>
		public string p_Address { get; set; }
	}
}

