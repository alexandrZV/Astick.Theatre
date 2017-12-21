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
		public int p_HallID { get; set; }
		public Cl_Hall p_Hall { get; set; }
		[Column("F_DATE")]
		public DateTime p_Date { get; set; }
		[Column("F_DESC")]
		public string p_Description { get; set; }
		public List<Cl_Seat> p_Seats { get; set; }
	}
}
