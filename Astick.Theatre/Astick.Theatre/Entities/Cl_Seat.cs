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
		/// <summary>Тип занятости места</summary>
		public enum E_Type {
			/// <summary>Партер - это места в зоне зрительного зала, которые находятся ближе всего к сцене.</summary>
			Parquet,
			/// <summary>Амфитеатр - пространство сразу за партером. Обычно зона амфитеатра чуть выше партера.</summary>
			Amphitheater,
			/// <summary>Места в бельэтаже - еще выше.</summary>
			Mezzanine,
			/// <summary>Балкон - На самом вверху.</summary>
			Balcony,
			/// <summary>Ложи - По обеим сторонам от партера находятся ложи - это небольшие пространства с отдельным входом.</summary>
			Lodges
		}
		[Key]
		[Column("F_ID")]
		public Guid p_ID { get; set; }
		[Column("F_SESSION_ID")]
		[ForeignKey("p_Session")]
		public Guid p_SessionID { get; set; }
		public Cl_Session p_Session { get; set; }
		[Column("F_TYPE")]
		public E_Type p_Type { get; set; }
		[Column("F_ROW")]
		public int p_Row { get; set; }
		[Column("F_NUMBER")]
		public int p_Number { get; set; }
		[Column("F_USER_FIO")]
		public string p_UserFIO { get; set; }
		[Column("F_MOBILE")]
		public string p_Mobile { get; set; }
		[Column("F_PROMO")]
		public string p_Promo { get; set; }
		[Column("F_PRICE")]
		public decimal p_Price { get; set; }
		[Column("F_TYPE_EMPLOYMENT")]
		public E_TypeEmployment p_TypeEmployment { get; set;}
		[Column("F_COMMENT")] 
		public string p_Comment { get; set; }
	}
}
