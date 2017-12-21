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
		[Column("F_ROWS_COUNT")]
		public int p_RowsCount { get; set; }
		[Column("F_ROW_NUMBERS_COUNT")]
		public int p_RowNumbersCount { get; set; }
	}
}
