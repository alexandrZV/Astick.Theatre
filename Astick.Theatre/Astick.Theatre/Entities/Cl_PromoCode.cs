using Astick.Core.Web;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	[Table("T_PROMO_CODES")]
	public class Cl_PromoCode : I_ModelBD {
		[Key]
		[Column("F_ID")]
		public Guid p_ID { get; set; }
		[Required]
		[Column("F_NAME")]
		public string p_Name { get; set; }
		[Column("F_DATE_START", TypeName = "date")]
		public DateTime p_DateStart { get; set; }
		[Column("F_DATE_END", TypeName = "date")]
		public DateTime p_DateEnd { get; set; }
		[Required]
		[MaxLength(50)]
		[Column("F_CODE")]
		public string p_Code { get; set; }
		[Column("F_DISCOUNT", TypeName= "decimal(17,14)")]
		public decimal p_Discount { get; set; }
		[Column("F_DESC")]
		public string p_Description { get; set; }
	}
}
