using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Astick.Theatre.Migrations
{
    public partial class seatprice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "F_PRICE",
                table: "T_SESSION",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "F_PRICE",
                table: "T_SEATS",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "F_TYPE_EMPLOYMENT",
                table: "T_SEATS",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "F_PRICE",
                table: "T_SESSION");

            migrationBuilder.DropColumn(
                name: "F_PRICE",
                table: "T_SEATS");

            migrationBuilder.DropColumn(
                name: "F_TYPE_EMPLOYMENT",
                table: "T_SEATS");
        }
    }
}
