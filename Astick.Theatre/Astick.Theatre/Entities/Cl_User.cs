using Astick.Core.Web;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	public class Cl_User : IdentityUser<Guid>, I_ModelBD {
		public Cl_User() { Id = Guid.NewGuid(); p_CreateDate = DateTime.Now; }
		public Cl_User(string a_Name) : this() { UserName = a_Name; p_CreateDate = DateTime.Now; }
		/// <summary>Получает или задает ID пользователя членства.</summary>
		public Guid p_ID { get { return Id; } }
		/// <summary>Получает или задает имя для пользователя членства.</summary>
		[Column("F_NAME")]
		public string p_Name { get; set; }
		/// <summary>Получает или задает фамилию для пользователя членства.</summary>
		[Column("F_SURNAME")]
		public string p_SurName { get; set; }
		/// <summary>Получает или задает отчество для пользователя членства.</summary>
		[Column("F_LASTNAME")]
		public string p_LastName { get; set; }
		/// <summary>Получает или задает сведения о приложении для пользователя членства.</summary>
		[Column("F_COMMENT")]
		public string p_Comment { get; set; }
		/// <summary>Время регистрации.</summary>
		[Column("F_DATE_CREATE")]
		public DateTime p_CreateDate { get; set; }
		/// <summary>Получает или задает адрес электронной почты для пользователя членства.</summary>
		[NotMapped]
		public string p_Email { get { return Email; } set { Email = value; } }
		/// <summary>Получает или задает мобильный для пользователя членства.</summary>
		[Column("F_MOBILE")]
		public string p_Mobile { get; set; }
		/// <summary>День рождения.</summary>
		[Column("F_BIRTHDAY")]
		public DateTime? p_Birthday { get; set; }
		/// <summary>Адрес проживания.</summary>
		[Column("F_ADDRESS")]
		public string p_Address { get; set; }
		/// <summary>Возвращает значение, указывающее подтверждение Email пользователя.</summary>
		[NotMapped]
		public bool p_EmailConfirmed { get { return EmailConfirmed; } set { EmailConfirmed = value; } }
		/// <summary>Возвращает значение, указывающее является ли пользователь членства заблокированным и недоступным для проверки.</summary>
		public bool p_IsLockedOut { get; set; }
		/// <summary>Время.</summary>
		public DateTime? p_LockoutEnd { get { if (LockoutEnd == null) return null; else return ((DateTimeOffset)LockoutEnd).LocalDateTime; } }
		/// <summary>Возвращает имя входа пользователя членства.</summary>
		[NotMapped]
		public string p_UserName { get { return UserName; } set { UserName = value; } }
		[NotMapped]
		public string p_FIO { get { return f_GetInitials(); } }
		/// <summary>Возвращает инициалы пользователя</summary>
		public string f_GetInitials() {
			return string.Format("{0} {1} {2}", p_SurName, string.IsNullOrWhiteSpace(p_Name) ? "" : p_Name[0].ToString() + ".", string.IsNullOrWhiteSpace(p_LastName) ? "" : p_LastName[0].ToString() + ".");
		}
	}
}
