using Astick.Core.Web;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	[Table("T_LOGS_HALLS")]
	public class Cl_LogsHalls : I_ModelBD {
		[Key]
		[Column("F_ID")]
		public Guid p_ID { get; set; }
		[Column("F_USER_ID")]
		[ForeignKey("p_User")]
		public Guid p_UserID { get; set; }
		public Cl_User p_User { get; set; }
		[Column("F_DATE")]
		public DateTime p_Date { get; set; }

		[Column("F_SEAT_ID")]
		[ForeignKey("p_Seat")]
		public Guid p_SeatID { get; set; }
		public Cl_Seat p_Seat { get; set; }
		[Column("F_TYPE_EMPLOYMENT")]
		public Cl_Seat.E_TypeEmployment p_TypeEmployment { get; set; }
		[Column("F_PRICE")]
		public decimal p_Price { get; set; }
		[Column("F_PROMO_CODE_ID")]
		[ForeignKey("p_PromoCode")]
		public Guid? p_PromoCodeID { get; set; }
		public Cl_PromoCode p_PromoCode { get; set; }
		public string p_Description {
			get {
				string desc = string.Format("Зал {0}, концерт {1}. {2}", p_Seat.p_Session.p_Hall.p_Name, p_Seat.p_Session.p_Name, p_User.p_FIO);
				if (p_TypeEmployment == Cl_Seat.E_TypeEmployment.Booked) {
					desc += " забронировал";
				} else if (p_TypeEmployment == Cl_Seat.E_TypeEmployment.Purchased) {
					desc += " продал";
				} else {
					desc += " освободил";
				}
				desc += string.Format(" место {1} ряда {0} за {2} руб.", p_Seat.f_GetRowNumberReal(), p_Seat.p_Number, p_Price);
				if (p_PromoCode != null) {
					desc += string.Format(" по промо-коду {0} со скидкой {1}%.", p_PromoCode.p_Code, p_PromoCode.p_Discount);
				}
				return desc;
			}
		}
	}
}
