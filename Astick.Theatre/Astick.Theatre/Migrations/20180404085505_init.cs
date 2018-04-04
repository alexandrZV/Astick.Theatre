using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Astick.Theatre.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    F_DESCRIPTION = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    SecurityStamp = table.Column<string>(nullable: true),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    F_ADDRESS = table.Column<string>(nullable: true),
                    F_BIRTHDAY = table.Column<DateTime>(nullable: true),
                    F_COMMENT = table.Column<string>(nullable: true),
                    F_DATE_CREATE = table.Column<DateTime>(nullable: false),
                    p_IsLockedOut = table.Column<bool>(nullable: false),
                    F_LASTNAME = table.Column<string>(nullable: true),
                    F_MOBILE = table.Column<string>(nullable: true),
                    F_NAME = table.Column<string>(nullable: true),
                    F_SURNAME = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_HALL",
                columns: table => new
                {
                    F_ID = table.Column<Guid>(nullable: false),
                    F_ADDRESS = table.Column<string>(nullable: true),
                    F_DESC = table.Column<string>(nullable: true),
                    F_NAME = table.Column<string>(nullable: true),
                    F_ROW_NUMBERS_COUNT_AMPHITHEATER = table.Column<int>(nullable: false),
                    F_ROW_NUMBERS_COUNT_Balcony = table.Column<int>(nullable: false),
                    F_ROW_NUMBERS_COUNT_LODGES = table.Column<int>(nullable: false),
                    F_ROW_NUMBERS_COUNT_MEZZANINE = table.Column<int>(nullable: false),
                    F_ROW_NUMBERS_COUNT_PARQUET = table.Column<int>(nullable: false),
                    F_ROWS_COUNT_AMPHITHEATER = table.Column<int>(nullable: false),
                    F_ROWS_COUNT_Balcony = table.Column<int>(nullable: false),
                    F_ROWS_COUNT_LODGES = table.Column<int>(nullable: false),
                    F_ROWS_COUNT_MEZZANINE = table.Column<int>(nullable: false),
                    F_ROWS_COUNT_PARQUET = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_HALL", x => x.F_ID);
                });

            migrationBuilder.CreateTable(
                name: "T_PROMO_CODES",
                columns: table => new
                {
                    F_ID = table.Column<Guid>(nullable: false),
                    F_CODE = table.Column<string>(maxLength: 50, nullable: false),
                    F_DATE_END = table.Column<DateTime>(type: "date", nullable: false),
                    F_DATE_START = table.Column<DateTime>(type: "date", nullable: false),
                    F_DESC = table.Column<string>(nullable: true),
                    F_DISCOUNT = table.Column<decimal>(type: "decimal(17,14)", nullable: false),
                    F_NAME = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_PROMO_CODES", x => x.F_ID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    RoleId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_SESSION",
                columns: table => new
                {
                    F_ID = table.Column<Guid>(nullable: false),
                    F_DATE = table.Column<DateTime>(nullable: false),
                    F_DESC = table.Column<string>(nullable: true),
                    F_HALL_ID = table.Column<Guid>(nullable: false),
                    F_NAME = table.Column<string>(nullable: true),
                    F_PRICE_AMPHITHEATER = table.Column<decimal>(nullable: false),
                    F_PRICE_BALCONY = table.Column<decimal>(nullable: false),
                    F_PRICE_LODGES = table.Column<decimal>(nullable: false),
                    F_PRICE_MEZZANINE = table.Column<decimal>(nullable: false),
                    F_PRICE_PARQUET = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_SESSION", x => x.F_ID);
                    table.ForeignKey(
                        name: "FK_T_SESSION_T_HALL_F_HALL_ID",
                        column: x => x.F_HALL_ID,
                        principalTable: "T_HALL",
                        principalColumn: "F_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_SEATS",
                columns: table => new
                {
                    F_ID = table.Column<Guid>(nullable: false),
                    F_COMMENT = table.Column<string>(nullable: true),
                    F_MOBILE = table.Column<string>(nullable: true),
                    F_NUMBER = table.Column<int>(nullable: false),
                    F_PRICE = table.Column<decimal>(nullable: false),
                    F_PROMO_CODE_ID = table.Column<Guid>(nullable: true),
                    F_ROW = table.Column<int>(nullable: false),
                    F_SESSION_ID = table.Column<Guid>(nullable: false),
                    F_TOTALPRICE = table.Column<decimal>(nullable: false),
                    F_TYPE = table.Column<int>(nullable: false),
                    F_TYPE_EMPLOYMENT = table.Column<int>(nullable: false),
                    F_USER_FIO = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_SEATS", x => x.F_ID);
                    table.ForeignKey(
                        name: "FK_T_SEATS_T_PROMO_CODES_F_PROMO_CODE_ID",
                        column: x => x.F_PROMO_CODE_ID,
                        principalTable: "T_PROMO_CODES",
                        principalColumn: "F_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_T_SEATS_T_SESSION_F_SESSION_ID",
                        column: x => x.F_SESSION_ID,
                        principalTable: "T_SESSION",
                        principalColumn: "F_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_LOGS_HALLS",
                columns: table => new
                {
                    F_ID = table.Column<Guid>(nullable: false),
                    F_DATE = table.Column<DateTime>(nullable: false),
                    F_PRICE = table.Column<decimal>(nullable: false),
                    F_PROMO_CODE_ID = table.Column<Guid>(nullable: true),
                    F_SEAT_ID = table.Column<Guid>(nullable: false),
                    F_TYPE_EMPLOYMENT = table.Column<int>(nullable: false),
                    F_USER_ID = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_LOGS_HALLS", x => x.F_ID);
                    table.ForeignKey(
                        name: "FK_T_LOGS_HALLS_T_PROMO_CODES_F_PROMO_CODE_ID",
                        column: x => x.F_PROMO_CODE_ID,
                        principalTable: "T_PROMO_CODES",
                        principalColumn: "F_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_T_LOGS_HALLS_T_SEATS_F_SEAT_ID",
                        column: x => x.F_SEAT_ID,
                        principalTable: "T_SEATS",
                        principalColumn: "F_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_LOGS_HALLS_AspNetUsers_F_USER_ID",
                        column: x => x.F_USER_ID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_T_LOGS_HALLS_F_PROMO_CODE_ID",
                table: "T_LOGS_HALLS",
                column: "F_PROMO_CODE_ID");

            migrationBuilder.CreateIndex(
                name: "IX_T_LOGS_HALLS_F_SEAT_ID",
                table: "T_LOGS_HALLS",
                column: "F_SEAT_ID");

            migrationBuilder.CreateIndex(
                name: "IX_T_LOGS_HALLS_F_USER_ID",
                table: "T_LOGS_HALLS",
                column: "F_USER_ID");

            migrationBuilder.CreateIndex(
                name: "IX_T_SEATS_F_PROMO_CODE_ID",
                table: "T_SEATS",
                column: "F_PROMO_CODE_ID");

            migrationBuilder.CreateIndex(
                name: "IX_T_SEATS_F_SESSION_ID",
                table: "T_SEATS",
                column: "F_SESSION_ID");

            migrationBuilder.CreateIndex(
                name: "IX_T_SESSION_F_HALL_ID",
                table: "T_SESSION",
                column: "F_HALL_ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "T_LOGS_HALLS");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "T_SEATS");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "T_PROMO_CODES");

            migrationBuilder.DropTable(
                name: "T_SESSION");

            migrationBuilder.DropTable(
                name: "T_HALL");
        }
    }
}
