﻿using Astick.Core.Web.Services;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Astick.Theatre.ErrorsDescribers;
using Astick.Theatre.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.WebEncoders;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Globalization;
using System.Text.Encodings.Web;
using System.Text.Unicode;

namespace Astick.Theatre {
	public class Startup {
		public Startup(IHostingEnvironment env) {
			var builder = new ConfigurationBuilder()
					.SetBasePath(env.ContentRootPath)
					.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
					.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

			if (env.IsDevelopment()) {
				// For more details on using the user secret store see https://go.microsoft.com/fwlink/?LinkID=532709
				builder.AddUserSecrets<Startup>();
			}

			builder.AddEnvironmentVariables();
			m_AppConfiguration = builder.Build();

			var settings = new JsonSerializerSettings();
			settings.TypeNameHandling = TypeNameHandling.Auto;
			m_Settings = m_AppConfiguration.Get<Cl_Settings>();
			m_Settings.p_AppPath = env.ContentRootPath;

			m_DefaultConnection = m_AppConfiguration.GetConnectionString("DefaultConnection");
		}

		private Cl_Settings m_Settings;
		public IConfigurationRoot m_AppConfiguration { get; }
		public string m_DefaultConnection { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services) {
			services.AddSingleton(m_Settings);
			services.AddDbContext<Cl_AppDbContext>(options => options.UseSqlServer(m_DefaultConnection));

			services.Configure<RequestLocalizationOptions>(
						options => {
							var supportedCultures = new[] { new CultureInfo("ru-Ru"), new CultureInfo("en-US") };
							options.DefaultRequestCulture = new RequestCulture(culture: "ru-Ru", uiCulture: "ru-Ru");
							options.SupportedCultures = supportedCultures;
							options.SupportedUICultures = supportedCultures;
						});

			services.AddTransient<IdentityErrorDescriber, Cl_IdentityErrorDescriberRu>();
			services.AddIdentity<Cl_User, Cl_Role>()
				.AddEntityFrameworkStores<Cl_AppDbContext>()
				.AddDefaultTokenProviders();

			services.Configure<IdentityOptions>(options => {
				// Password settings
				options.Password.RequireDigit = false;  // требуются ли цифры
				options.Password.RequiredLength = 6;  // минимальная длина
				options.Password.RequireNonAlphanumeric = false;  // требуются ли не алфавитно-цифровые символы
				options.Password.RequireUppercase = false;  // требуются ли символы в верхнем регистре
				options.Password.RequireLowercase = false;  // требуются ли символы в нижнем регистре

				// Lockout settings
				options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
				options.Lockout.MaxFailedAccessAttempts = 10;

				// User settings
				options.User.RequireUniqueEmail = true;
			});


			services.Configure<WebEncoderOptions>(options => {
				options.TextEncoderSettings = new TextEncoderSettings(UnicodeRanges.All);
			});

			services.AddSession(options => {
				options.Cookie.Name = ".app.Session";
				options.IdleTimeout = TimeSpan.FromSeconds(3600);
			});

			services.AddMvc(config => {
				config.RespectBrowserAcceptHeader = false;
			}).AddJsonOptions(
				options => {
					options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
					//options.SerializerSettings.Formatting = Formatting.None;
					options.SerializerSettings.ContractResolver = new DefaultContractResolver();
				}
			);
			services.AddAntiforgery(o => o.HeaderName = "XSRF-TOKEN");

			services.AddScoped<I_ServiceViewRender, Cl_ServiceViewRender>();

			// Add application services.
			services.AddTransient<IEmailSender, EmailSender>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, Cl_AppDbContext db) {
			loggerFactory.AddConsole(m_AppConfiguration.GetSection("Logging"));
			loggerFactory.AddDebug();

			var logger = loggerFactory.CreateLogger<Startup>();

			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
				app.UseBrowserLink();
			} else {
				app.UseExceptionHandler("/Home/Error");
			}

			try {
				db.Database.Migrate();
				db.f_Seed(app);
			} catch (Exception ex) {
				logger.LogError(new EventId(0), ex, "Database initialization error");
				throw;
			}

			app.UseStaticFiles();
			app.UseSession();
			app.UseAuthentication();

			app.UseMvc(routes => {
				routes.MapRoute(
						name: "default",
						template: "{controller=Home}/{action=Index}/{id?}");
				routes.MapRoute(
						name: "areas",
						template: "{area:exists}/{controller=Users}/{action=Index}");
			});

		}
	}
}
