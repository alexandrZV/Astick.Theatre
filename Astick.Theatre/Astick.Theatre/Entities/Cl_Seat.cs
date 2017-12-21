using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Astick.Theatre.Entities {
	[Table("T_SEATS")]
	public class Cl_Seat {
		[Key]
		[Column("F_ID")]
		public Guid p_ID { get; set; }
		[Column("F_SESSION_ID")]
		[ForeignKey("p_Session")]
		public int p_SessionID { get; set; }
		public Cl_Session p_Session { get; set; }
		[Column("F_ROW")]
		public string p_Row { get; set; }
		[Column("F_NUMBER")]
		public string p_Number { get; set; }
		[Column("F_USER_FIO")]
		public string p_UserFIO { get; set; }
		[Column("F_MOBILE")]
		public string p_Mobile { get; set; }
		[Column("F_COMMENT")]
		public string p_Comment { get; set; }
	}
}
