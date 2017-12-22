using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Astick.Theatre.Models;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Astick.Theatre.Data {
	public class Cl_AppDbContext : IdentityDbContext<Cl_User, Cl_Role, Guid> {
		public Cl_AppDbContext(DbContextOptions<Cl_AppDbContext> options)
			: base(options) {

		}

		public DbSet<Cl_User> p_Users { get; set; }
		public DbSet<Cl_Hall> p_Halls { get; set; }
		public DbSet<Cl_Session> p_Sessions { get; set; }
		public DbSet<Cl_Seat> p_Seats { get; set; }

		protected override void OnModelCreating(ModelBuilder builder) {
			base.OnModelCreating(builder);
		}

		public async Task f_SeedAsync(IServiceProvider a_ServiceProvider) {
			UserManager<Cl_User> userManager = a_ServiceProvider.GetRequiredService<UserManager<Cl_User>>();
			RoleManager<Cl_Role> roleManager = a_ServiceProvider.GetRequiredService<RoleManager<Cl_Role>>();

			string adminLogin = "admin";
			string adminEmail = "admin@astick.ru";
			string adminPassword = "Qq1!738hdQ";
			if (await roleManager.FindByNameAsync("admin") == null) {
				await roleManager.CreateAsync(new Cl_Role("admin"));
			}
			if (await userManager.FindByNameAsync(adminLogin) == null) {
				Cl_User admin = new Cl_User {
					p_Email = adminEmail,
					p_UserName = adminEmail,
					p_CreateDate = DateTime.Now,
					p_SurName = adminLogin,
					p_Name = adminLogin,
					p_LastName = adminLogin,
					p_EmailConfirmed = true
				};
				IdentityResult result = await userManager.CreateAsync(admin, adminPassword);
				if (result.Succeeded) {
					await userManager.AddToRoleAsync(admin, "admin");
				}
			}
		}
	}
}
