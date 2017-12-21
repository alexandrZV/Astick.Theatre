using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Astick.Theatre.Models;
using Astick.Theatre.Entities;

namespace Astick.Theatre.Data {
	public class Cl_AppDbContext : IdentityDbContext<Cl_User, Cl_Role, Guid> {
		public Cl_AppDbContext(DbContextOptions<Cl_AppDbContext> options)
			: base(options) {

		}

		public DbSet<Cl_User> p_Users { get; set; }
		public DbSet<Cl_Hall> p_Halls { get; set; }
		public DbSet<Cl_Session> p_Sessions { get; set; }

		protected override void OnModelCreating(ModelBuilder builder) {
			base.OnModelCreating(builder);
		}
	}
}
