using Astick.Core.Web;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	[Table("T_SESSION")]
	public class Cl_Session : I_ModelBD {
		public Cl_Session() {
			p_Seats = new List<Cl_Seat>();
		}
		[Key]
		[Column("F_ID")]
		public Guid p_ID { get; set; }
		[Column("F_NAME")]
		public string p_Name { get; set; }
		[Column("F_HALL_ID")]
		[ForeignKey("p_Hall")]
		public Guid p_HallID { get; set; }
		public Cl_Hall p_Hall { get; set; }
		[Column("F_DATE")]
		public DateTime p_Date { get; set; }
		[Column("F_PRICE_PARQUET")]
		public decimal p_PriceParquet { get; set; }
		[Column("F_PRICE_AMPHITHEATER")]
		public decimal p_PriceAmphitheater { get; set; }
		[Column("F_PRICE_MEZZANINE")]
		public decimal p_PriceMezzanine { get; set; }
		[Column("F_PRICE_BALCONY")]
		public decimal p_PriceBalcony { get; set; }
		[Column("F_PRICE_LODGES")]
		public decimal p_PriceLodges { get; set; }
		[Column("F_DESC")]
		public string p_Description { get; set; }
		public List<Cl_Seat> p_Seats { get; set; }

		public decimal f_GetPrice(Cl_Seat.E_Type a_Type) {
			if (a_Type == Cl_Seat.E_Type.Parquet)
				return p_PriceParquet;
			else if (a_Type == Cl_Seat.E_Type.Amphitheater)
				return p_PriceAmphitheater;
			else if (a_Type == Cl_Seat.E_Type.Mezzanine)
				return p_PriceMezzanine;
			else if (a_Type == Cl_Seat.E_Type.Balcony)
				return p_PriceBalcony;
			else if (a_Type == Cl_Seat.E_Type.Lodges)
				return p_PriceLodges;
			else
				throw new Exception("Неизвестный тип места");
		}
	}
}
