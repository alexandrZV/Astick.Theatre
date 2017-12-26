using Astick.Core.Web;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	[Table("T_HALL")]
	public class Cl_Hall : I_ModelBD {
		[Key]
		[Column("F_ID")]
		public Guid p_ID { get; set; }
		[Column("F_NAME")]
		public string p_Name { get; set; }
		[Column("F_ADDRESS")]
		public string p_Address { get; set; }
		[Column("F_DESC")]
		public string p_Description { get; set; }

		[Column("F_ROWS_COUNT_PARQUET")]
		public int p_RowsCountParquet { get; set; }
		[Column("F_ROW_NUMBERS_COUNT_PARQUET")]
		public int p_RowNumbersCountParquet { get; set; }
		[Column("F_ROWS_COUNT_AMPHITHEATER")]
		public int p_RowsCountAmphitheater { get; set; }
		[Column("F_ROW_NUMBERS_COUNT_AMPHITHEATER")]
		public int p_RowNumbersCountAmphitheater { get; set; }
		[Column("F_ROWS_COUNT_MEZZANINE")]
		public int p_RowsCountMezzanine { get; set; }
		[Column("F_ROW_NUMBERS_COUNT_MEZZANINE")]
		public int p_RowNumbersCountMezzanine { get; set; }
		[Column("F_ROWS_COUNT_Balcony")]
		public int p_RowsCountBalcony { get; set; }
		[Column("F_ROW_NUMBERS_COUNT_Balcony")]
		public int p_RowNumbersCountBalcony { get; set; }
		[Column("F_ROWS_COUNT_LODGES")]
		public int p_RowsCountLodges { get; set; }
		[Column("F_ROW_NUMBERS_COUNT_LODGES")]
		public int p_RowNumbersCountLodges { get; set; }

		public int f_GetRowsCount(Cl_Seat.E_Type a_Type) {
			if (a_Type == Cl_Seat.E_Type.Parquet)
				return p_RowsCountParquet;
			else if (a_Type == Cl_Seat.E_Type.Amphitheater)
				return p_RowsCountAmphitheater;
			else if (a_Type == Cl_Seat.E_Type.Mezzanine)
				return p_RowsCountMezzanine;
			else if (a_Type == Cl_Seat.E_Type.Balcony)
				return p_RowsCountBalcony;
			else if (a_Type == Cl_Seat.E_Type.Lodges)
				return p_RowsCountLodges;
			else
				throw new Exception("Неизвестный тип места");
		}

		public int f_GetRowNumbersCount(Cl_Seat.E_Type a_Type) {
			if (a_Type == Cl_Seat.E_Type.Parquet)
				return p_RowNumbersCountParquet;
			else if (a_Type == Cl_Seat.E_Type.Amphitheater)
				return p_RowNumbersCountAmphitheater;
			else if (a_Type == Cl_Seat.E_Type.Mezzanine)
				return p_RowNumbersCountMezzanine;
			else if (a_Type == Cl_Seat.E_Type.Balcony)
				return p_RowNumbersCountBalcony;
			else if (a_Type == Cl_Seat.E_Type.Lodges)
				return p_RowNumbersCountLodges;
			else
				throw new Exception("Неизвестный тип места");
		}
	}
}
