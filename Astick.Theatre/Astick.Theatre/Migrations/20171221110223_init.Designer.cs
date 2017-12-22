using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Astick.Theatre.Data;

namespace Astick.Theatre.Migrations
{
    [DbContext(typeof(Cl_AppDbContext))]
    [Migration("20171221110223_init")]
    partial class init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Astick.Theatre.Entities.Cl_Hall", b =>
                {
                    b.Property<Guid>("p_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("F_ID");

                    b.Property<string>("p_Address")
                        .HasColumnName("F_ADDRESS");

                    b.Property<string>("p_Description")
                        .HasColumnName("F_DESC");

                    b.Property<string>("p_Name")
                        .HasColumnName("F_NAME");

                    b.Property<int>("p_RowNumbersCount")
                        .HasColumnName("F_ROW_NUMBERS_COUNT");

                    b.Property<int>("p_RowsCount")
                        .HasColumnName("F_ROWS_COUNT");

                    b.HasKey("p_ID");

                    b.ToTable("T_HALL");
                });

            modelBuilder.Entity("Astick.Theatre.Entities.Cl_Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.Property<string>("p_Description")
                        .HasColumnName("F_DESCRIPTION");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Astick.Theatre.Entities.Cl_Seat", b =>
                {
                    b.Property<Guid>("p_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("F_ID");

                    b.Property<string>("p_Comment")
                        .HasColumnName("F_COMMENT");

                    b.Property<string>("p_Mobile")
                        .HasColumnName("F_MOBILE");

                    b.Property<string>("p_Number")
                        .HasColumnName("F_NUMBER");

                    b.Property<string>("p_Row")
                        .HasColumnName("F_ROW");

                    b.Property<Guid>("p_SessionID")
                        .HasColumnName("F_SESSION_ID");

                    b.Property<string>("p_UserFIO")
                        .HasColumnName("F_USER_FIO");

                    b.HasKey("p_ID");

                    b.HasIndex("p_SessionID");

                    b.ToTable("T_SEATS");
                });

            modelBuilder.Entity("Astick.Theatre.Entities.Cl_Session", b =>
                {
                    b.Property<Guid>("p_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("F_ID");

                    b.Property<DateTime>("p_Date")
                        .HasColumnName("F_DATE");

                    b.Property<string>("p_Description")
                        .HasColumnName("F_DESC");

                    b.Property<Guid>("p_HallID")
                        .HasColumnName("F_HALL_ID");

                    b.Property<string>("p_Name")
                        .HasColumnName("F_NAME");

                    b.HasKey("p_ID");

                    b.HasIndex("p_HallID");

                    b.ToTable("T_SESSION");
                });

            modelBuilder.Entity("Astick.Theatre.Entities.Cl_User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.Property<string>("p_Address")
                        .HasColumnName("F_ADDRESS");

                    b.Property<DateTime?>("p_Birthday")
                        .HasColumnName("F_BIRTHDAY");

                    b.Property<string>("p_Comment")
                        .HasColumnName("F_COMMENT");

                    b.Property<DateTime>("p_CreateDate")
                        .HasColumnName("F_DATE_CREATE");

                    b.Property<bool>("p_IsLockedOut");

                    b.Property<string>("p_LastName")
                        .HasColumnName("F_LASTNAME");

                    b.Property<string>("p_Mobile")
                        .HasColumnName("F_MOBILE");

                    b.Property<string>("p_Name")
                        .HasColumnName("F_NAME");

                    b.Property<string>("p_SurName")
                        .HasColumnName("F_SURNAME");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<Guid>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<Guid>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<Guid>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<Guid>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("Astick.Theatre.Entities.Cl_Seat", b =>
                {
                    b.HasOne("Astick.Theatre.Entities.Cl_Session", "p_Session")
                        .WithMany("p_Seats")
                        .HasForeignKey("p_SessionID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Astick.Theatre.Entities.Cl_Session", b =>
                {
                    b.HasOne("Astick.Theatre.Entities.Cl_Hall", "p_Hall")
                        .WithMany()
                        .HasForeignKey("p_HallID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.HasOne("Astick.Theatre.Entities.Cl_Role")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<System.Guid>", b =>
                {
                    b.HasOne("Astick.Theatre.Entities.Cl_User")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<System.Guid>", b =>
                {
                    b.HasOne("Astick.Theatre.Entities.Cl_User")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<System.Guid>", b =>
                {
                    b.HasOne("Astick.Theatre.Entities.Cl_Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Astick.Theatre.Entities.Cl_User")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
