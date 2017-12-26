using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Astick.Theatre.Migrations
{
    public partial class hallRowTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "F_PRICE",
                table: "T_SESSION",
                newName: "F_PRICE_PARQUET");

            migrationBuilder.RenameColumn(
                name: "F_ROWS_COUNT",
                table: "T_HALL",
                newName: "F_ROWS_COUNT_PARQUET");

            migrationBuilder.RenameColumn(
                name: "F_ROW_NUMBERS_COUNT",
                table: "T_HALL",
                newName: "F_ROWS_COUNT_MEZZANINE");

            migrationBuilder.RenameColumn(
                name: "F_BALCONY_ROWS_COUNT",
                table: "T_HALL",
                newName: "F_ROWS_COUNT_LODGES");

            migrationBuilder.RenameColumn(
                name: "F_BALCONY_ROW_NUMBERS_COUNT",
                table: "T_HALL",
                newName: "F_ROWS_COUNT_Balcony");

            migrationBuilder.AddColumn<decimal>(
                name: "F_PRICE_AMPHITHEATER",
                table: "T_SESSION",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "F_PRICE_BALCONY",
                table: "T_SESSION",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "F_PRICE_LODGES",
                table: "T_SESSION",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "F_PRICE_MEZZANINE",
                table: "T_SESSION",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "F_TYPE",
                table: "T_SEATS",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "F_ROW_NUMBERS_COUNT_AMPHITHEATER",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "F_ROW_NUMBERS_COUNT_Balcony",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "F_ROW_NUMBERS_COUNT_LODGES",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "F_ROW_NUMBERS_COUNT_MEZZANINE",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "F_ROW_NUMBERS_COUNT_PARQUET",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "F_ROWS_COUNT_AMPHITHEATER",
                table: "T_HALL",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "F_PRICE_AMPHITHEATER",
                table: "T_SESSION");

            migrationBuilder.DropColumn(
                name: "F_PRICE_BALCONY",
                table: "T_SESSION");

            migrationBuilder.DropColumn(
                name: "F_PRICE_LODGES",
                table: "T_SESSION");

            migrationBuilder.DropColumn(
                name: "F_PRICE_MEZZANINE",
                table: "T_SESSION");

            migrationBuilder.DropColumn(
                name: "F_TYPE",
                table: "T_SEATS");

            migrationBuilder.DropColumn(
                name: "F_ROW_NUMBERS_COUNT_AMPHITHEATER",
                table: "T_HALL");

            migrationBuilder.DropColumn(
                name: "F_ROW_NUMBERS_COUNT_Balcony",
                table: "T_HALL");

            migrationBuilder.DropColumn(
                name: "F_ROW_NUMBERS_COUNT_LODGES",
                table: "T_HALL");

            migrationBuilder.DropColumn(
                name: "F_ROW_NUMBERS_COUNT_MEZZANINE",
                table: "T_HALL");

            migrationBuilder.DropColumn(
                name: "F_ROW_NUMBERS_COUNT_PARQUET",
                table: "T_HALL");

            migrationBuilder.DropColumn(
                name: "F_ROWS_COUNT_AMPHITHEATER",
                table: "T_HALL");

            migrationBuilder.RenameColumn(
                name: "F_PRICE_PARQUET",
                table: "T_SESSION",
                newName: "F_PRICE");

            migrationBuilder.RenameColumn(
                name: "F_ROWS_COUNT_PARQUET",
                table: "T_HALL",
                newName: "F_ROWS_COUNT");

            migrationBuilder.RenameColumn(
                name: "F_ROWS_COUNT_MEZZANINE",
                table: "T_HALL",
                newName: "F_ROW_NUMBERS_COUNT");

            migrationBuilder.RenameColumn(
                name: "F_ROWS_COUNT_LODGES",
                table: "T_HALL",
                newName: "F_BALCONY_ROWS_COUNT");

            migrationBuilder.RenameColumn(
                name: "F_ROWS_COUNT_Balcony",
                table: "T_HALL",
                newName: "F_BALCONY_ROW_NUMBERS_COUNT");
        }
    }
}
