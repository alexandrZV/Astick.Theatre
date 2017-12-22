using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	[Table("T_SEATS")]
	public class Cl_Seat {
		/// <summary>Тип занятости места</summary>
		public enum E_TypeEmployment {
			/// <summary>Свободно</summary>
			Free,
			/// <summary>Забронирован</summary>
			Booked,
			/// <summary>Приобретен</summary>
			Purchased
		}
		[Key]
		[Column("F_ID")]
		public Guid p_ID { get; set; }
		[Column("F_SESSION_ID")]
		[ForeignKey("p_Session")]
		public Guid p_SessionID { get; set; }
		public Cl_Session p_Session { get; set; }
		[Column("F_ROW")]
		public int p_Row { get; set; }
		[Column("F_NUMBER")]
		public int p_Number { get; set; }
		[Column("F_USER_FIO")]
		public string p_UserFIO { get; set; }
		[Column("F_MOBILE")]
		public string p_Mobile { get; set; }
		[Column("F_PRICE")]
		public decimal p_Price { get; set; }
		[Column("F_TYPE_EMPLOYMENT")]
		public E_TypeEmployment p_TypeEmployment { get; set;}
		[Column("F_COMMENT")] 
		public string p_Comment { get; set; }
	}
}
