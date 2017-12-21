using System;

namespace Astick.Web.Areas.Admin.Models {
	/// <summary>Класс роли пользователя.</summary>
	public class Cl_ModelRole {
		/// <summary>ID роли.</summary>
		public Guid p_RoleID { get; set; }
		/// <summary>Наименование роли.</summary>
		public string p_RoleName { get; set; }
		/// <summary>Описание роли.</summary>
		public string p_Description { get; set; }
	}
}

