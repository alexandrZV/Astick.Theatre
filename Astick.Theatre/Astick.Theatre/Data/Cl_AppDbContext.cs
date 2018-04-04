using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Astick.Theatre.Data {
	public class Cl_AppDbContext : IdentityDbContext<Cl_User, Cl_Role, Guid> {
		public Cl_AppDbContext(DbContextOptions<Cl_AppDbContext> options)
			: base(options) {

		}

		public DbSet<Cl_User> p_Users { get; set; }
		public DbSet<Cl_Role> p_Roles { get; set; }
		public DbSet<Cl_Hall> p_Halls { get; set; }
		public DbSet<Cl_Session> p_Sessions { get; set; }
		public DbSet<Cl_Seat> p_Seats { get; set; }
		public DbSet<Cl_PromoCode> p_PromoCodes { get; set; }
		public DbSet<Cl_LogsHalls> p_LogsHalls { get; set; }

		protected override void OnModelCreating(ModelBuilder builder) {
			base.OnModelCreating(builder);
		}

		public void f_Seed(IApplicationBuilder applicationBuilder) {
		if (applicationBuilder != null) {
				var scopeFactory = applicationBuilder.ApplicationServices.GetRequiredService<IServiceScopeFactory>();
				if (scopeFactory != null) {
					using (var serviceScope = scopeFactory.CreateScope()) {
						Cl_AppDbContext context = serviceScope.ServiceProvider.GetService<Cl_AppDbContext>();
						UserManager<Cl_User> userManager = serviceScope.ServiceProvider.GetService<UserManager<Cl_User>>();
						RoleManager<Cl_Role> roleManager = serviceScope.ServiceProvider.GetService<RoleManager<Cl_Role>>();
						IdentityResult result;

						string adminLogin = "admin";
						string adminEmail = "admin@astick.ru";
						string adminPassword = "Qq1!738hdQ";
						if (roleManager != null) {
							if (!roleManager.RoleExistsAsync("admin").Result) {
								result = roleManager.CreateAsync(new Cl_Role("admin") { p_Description = "Администратор" }).Result;
							}
						}
						if (userManager != null && userManager.FindByNameAsync(adminLogin).Result == null) {
							Cl_User admin = new Cl_User {
								p_Email = adminEmail,
								p_UserName = adminEmail,
								p_CreateDate = DateTime.Now,
								p_SurName = adminLogin,
								p_Name = adminLogin,
								p_LastName = adminLogin,
								p_EmailConfirmed = true
							};
							result = userManager.CreateAsync(admin, adminPassword).Result;
							if (result.Succeeded) {
								result = userManager.AddToRoleAsync(admin, "admin").Result;
							}
						}
					}
				}
			}
		}
	}
}
