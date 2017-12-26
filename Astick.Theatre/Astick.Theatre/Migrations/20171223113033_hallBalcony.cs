using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Astick.Theatre.Migrations
{
    public partial class hallBalcony : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "F_BALCONY_ROW_NUMBERS_COUNT",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "F_BALCONY_ROWS_COUNT",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "F_BALCONY_ROW_NUMBERS_COUNT",
                table: "T_HALL");

            migrationBuilder.DropColumn(
                name: "F_BALCONY_ROWS_COUNT",
                table: "T_HALL");
        }
    }
}
