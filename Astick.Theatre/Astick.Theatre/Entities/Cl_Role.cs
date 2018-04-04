using Astick.Core.Web;
using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	/// <summary>
	/// Класс роли пользователя
	/// </summary>
	public class Cl_Role : IdentityRole<Guid>, I_ModelBD {
		public Cl_Role() { Id = Guid.NewGuid(); }
		public Cl_Role(string a_Name) : this() { Name = a_Name; }
		/// <summary>Получает ID роли пользователей</summary>
		public Guid p_ID { get { return Id; } }
		/// <summary>Получает или задает имя роли пользователей</summary>
		[NotMapped]
		public string p_Name { get { return Name; } set { Name = value; } }
		/// <summary>Получает или задает описание роли пользователей</summary>
		[Column("F_DESCRIPTION")]
		public string p_Description { get; set; }
	}
}
