using Astick.Core.Extensions;
using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astick.Web.Areas.Admin.Controllers {
	public class SessionsController : Cl_BaseAdminController {
		public SessionsController(Cl_AppDbContext a_ShopDbContext) {
			m_AppDbContext = a_ShopDbContext;
		}

		private Cl_AppDbContext m_AppDbContext;

		public ActionResult Index() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Sessions/Index.cshtml");
			else
				return View("~/Areas/Admin/Views/Sessions/Index.cshtml");
		}
		[Authorize(Roles = "admin")]
		public ActionResult Statistic() {
			if (Request.IsAjaxRequest())
				return PartialView("~/Areas/Admin/Views/Sessions/Statistic.cshtml");
			else
				return View("~/Areas/Admin/Views/Sessions/Statistic.cshtml");
		}

		private void f_SetSeatsForNewHall(Cl_Session a_Session, Cl_Seat.E_Type a_Type) {
			for (int i = 0; i < a_Session.p_Hall.f_GetRowsCount(a_Type); i++) {
				for (int y = 0; y < a_Session.p_Hall.f_GetRowNumbersCount(a_Type); y++) {
					m_AppDbContext.p_Seats.Add(new Cl_Seat() {
						p_SessionID = a_Session.p_ID,
						p_Type = a_Type,
						p_Row = i + 1,
						p_Number = y + 1,
						p_Price = a_Session.f_GetPrice(a_Type)
					});
				}
			}
		}

		[HttpPost]
		public async Task<ActionResult> TableSessions(Ctrl_Table.Cl_Params<Cl_Session> a_Grid) {
			if (a_Grid != null) {
				Cl_Seat[] seats = null;
				if (a_Grid.p_Action == Ctrl_Table.E_Actions.Edit) {
					seats = m_AppDbContext.p_Seats.Where(s => s.p_SessionID == a_Grid.p_Object.p_ID).ToArray();
					if (seats.Any(s => s.p_TypeEmployment == Cl_Seat.E_TypeEmployment.Purchased)) {
						throw new Cl_UserException("Нельзя изменить концерт, имеющий хотябы один проданный билет");
					}
				}
				var session = m_AppDbContext.p_Sessions.Include(s => s.p_Hall);
				ActionResult result = await a_Grid.f_Execute(m_AppDbContext, session);
				if (User.IsInRole("admin") && a_Grid.p_Action == Ctrl_Table.E_Actions.Add || a_Grid.p_Action == Ctrl_Table.E_Actions.Edit) {
					Cl_Hall hall = await m_AppDbContext.p_Halls.FirstOrDefaultAsync(h => h.p_ID == a_Grid.p_Object.p_HallID);
					if (hall != null) {
						a_Grid.p_Object.p_Hall = hall;
						if (a_Grid.p_Action == Ctrl_Table.E_Actions.Add) {
							foreach (Cl_Seat.E_Type type in Enum.GetValues(typeof(Cl_Seat.E_Type))) {
								f_SetSeatsForNewHall(a_Grid.p_Object, type);
							}
						} else if (a_Grid.p_Action == Ctrl_Table.E_Actions.Edit) {
							for (int i = 0; i < seats.Length; i++) {
								if (seats[i].p_TypeEmployment == Cl_Seat.E_TypeEmployment.Free) {
									seats[i].p_Price = a_Grid.p_Object.f_GetPrice(seats[i].p_Type);
								}
							}
						}
						await m_AppDbContext.SaveChangesAsync();
					} else {
						throw new Exception("Не найден зал");
					}
				}
				return result;
			}
			return new EmptyResult();
		}

		//private static PropertyInfo GetProperty(Type a_Type, string a_PropertName) {
		//	string[] names = a_PropertName.Split('.');
		//	PropertyInfo properInfo = a_Type.GetProperty(names[0]);
		//	if (properInfo == null)
		//		throw new ArgumentNullException(string.Format("Memory {0}, is not exists in object {1}", names[0], a_Type.ToString()));
		//	if (names.Length == 1) {
		//		return properInfo;
		//	} else
		//		return GetProperty(properInfo.PropertyType, names[1]);
		//}

		[HttpPost]
		[Authorize(Roles = "admin")]
		public ActionResult TableSessionStatistic(Ctrl_Table.Cl_Params<Cl_Session> a_Grid) {
			if (a_Grid.p_Action == Ctrl_Table.E_Actions.Read && a_Grid != null) {
				IQueryable<Cl_Seat> source = m_AppDbContext.p_Seats;

				var jsonSerializerSettings = new JsonSerializerSettings {
					ReferenceLoopHandling = ReferenceLoopHandling.Ignore
				};

				//if (source != null) {
				//	var seats = m_AppDbContext.p_Seats.Where(s => s.p_TypeEmployment == Cl_Seat.E_TypeEmployment.Purchased).Include(s => s.p_Session).Include(s => s.p_Session.p_Hall);
				//	if (a_Grid.p_Filter != null) {
				//		var tInfoSource = source.ElementType.GetTypeInfo();
				//		string query = "select * from T_SEATS";
				//		int i = 0;
				//		foreach (JProperty item in a_Grid.p_Filter) {
				//			string filter = item.Value.ToString().ToLower();

				//			//MemberInfo memInfo = f_GetMember(source.ElementType, item.Name);
				//			PropertyInfo propInfo = GetProperty(source.ElementType, item.Name);
				//			if (propInfo == null)
				//				return new EmptyResult();
				//			IEnumerable<ColumnAttribute> attrs = propInfo.GetCustomAttributes<ColumnAttribute>();
				//			ColumnAttribute attribute = attrs.FirstOrDefault();
				//			if (attribute != null) {
				//				if (i == 0) {
				//					query += " where ";
				//				} else {
				//					query += " or ";
				//				}
				//				query += string.Format("lower({0}) LIKE '%{1}%'", attribute.Name, filter);
				//				i++;
				//			}

				//			//var memberInfo = tInfoSource.GetMember(item.Name);
				//			//if (memberInfo == null) return new EmptyResult();
				//			//if (memberInfo.Length > 0) {
				//			//	IEnumerable<ColumnAttribute> attrs = memberInfo[0].GetCustomAttributes<ColumnAttribute>();
				//			//	ColumnAttribute attribute = attrs.FirstOrDefault();
				//			//	if (attribute != null) {
				//			//		if (i == 0) {
				//			//			query += " where ";
				//			//		} else {
				//			//			query += " or ";
				//			//		}
				//			//		query += string.Format("lower({0}) LIKE '%{1}%'", attribute.Name, filter);
				//			//		i++;
				//			//	}
				//			//}
				//		}
				//		int count = source.FromSql(query).Count();
				//		if (!string.IsNullOrWhiteSpace(a_Grid.p_SortColumn) && !string.IsNullOrWhiteSpace(a_Grid.p_Direction)) {
				//			query += string.Format(" order by {0} {1}", a_Grid.p_SortColumn, a_Grid.p_Direction);
				//		}
				//		var items = source.FromSql(query);
				//		if (items != null) {

				//			return new JsonResult(new { total = count, rows = items }, jsonSerializerSettings);
				//		} else {
				//			return new EmptyResult();
				//		}
				//	}
				//} else {
				//	return new EmptyResult();
				//}

				string fHallName = "";
				string fSessionName = "";
				if (a_Grid.p_Filter != null) {
					foreach (JProperty item in a_Grid.p_Filter.Children()) {
						string filter = item.Value.ToString().ToLower();
						if (item.Name == "p_Session.p_Hall.p_Name") {
							fHallName = filter;
						}
						if (item.Name == "p_Session.p_Name") {
							fSessionName = filter;
						}
					}
				}

				var seats = m_AppDbContext.p_Seats.Where(s => s.p_TypeEmployment == Cl_Seat.E_TypeEmployment.Purchased && s.p_Session.p_Hall.p_Name.Contains(fHallName) && s.p_Session.p_Name.Contains(fSessionName))
					.Include(s => s.p_Session).ThenInclude(s => s.p_Hall).GroupBy(s => s.p_Session).Select(g => new { p_Session = g.Key, p_TotalCount = g.Count(), p_TotalSum = g.Sum(p => p.p_Price) });
				if (!string.IsNullOrWhiteSpace(a_Grid.p_SortColumn) && !string.IsNullOrWhiteSpace(a_Grid.p_Direction)) {
					seats = seats.f_OrderBy(a_Grid.p_SortColumn, a_Grid.p_Direction);
				}

				return new JsonResult(new { total = seats.Count(), rows = seats }, jsonSerializerSettings);
			}
			return new EmptyResult();
		}

		[Route("/admin/sessions/{a_SessionID:guid}")]
		public ActionResult Session(Guid a_SessionID) {
			Cl_Session session = m_AppDbContext.p_Sessions.Include(s => s.p_Hall).Include(s => s.p_Seats).ThenInclude(s => s.p_PromoCode).FirstOrDefault(s => s.p_ID == a_SessionID);
			if (session != null) {
				if (Request.IsAjaxRequest())
					return PartialView("~/Areas/Admin/Views/Sessions/Session.cshtml", session);
				else
					return View("~/Areas/Admin/Views/Sessions/Session.cshtml", session);
			} else {
				throw new Exception("Сеанс не найден");
			}
		}

		[HttpPost]
		public async Task<ActionResult> f_ActionSeat(Guid[] a_SeatsID, string a_UserFIO, string a_Mobile, Guid? a_PromoCodeID, string a_Comment, Cl_Seat.E_TypeEmployment a_TypeEmployment) {
			List<Cl_Seat> seats = new List<Cl_Seat>();
			foreach (Guid seatID in a_SeatsID) {
				Cl_Seat seat = m_AppDbContext.p_Seats.Include(s => s.p_PromoCode).FirstOrDefault(s => s.p_ID == seatID);
				if (seat != null) {
					Cl_LogsHalls log = new Cl_LogsHalls();
					log.p_UserID = m_AppDbContext.p_Users.First(u => u.UserName == User.Identity.Name).p_ID;
					log.p_SeatID = seat.p_ID;
					log.p_Date = DateTime.Now;
					if (a_TypeEmployment == Cl_Seat.E_TypeEmployment.Free) {
						seat.p_UserFIO = "";
						seat.p_Mobile = "";
						seat.p_TypeEmployment = Cl_Seat.E_TypeEmployment.Free;
						seat.p_Comment = "";
					} else {
						seat.p_UserFIO = a_UserFIO;
						seat.p_Mobile = a_Mobile;
						seat.p_PromoCodeID = a_PromoCodeID;
						seat.p_TypeEmployment = a_TypeEmployment;
						seat.p_Comment = a_Comment;
					}
					log.p_TypeEmployment = seat.p_TypeEmployment;
					if (a_PromoCodeID != null) {
						Cl_PromoCode pcode = await m_AppDbContext.p_PromoCodes.FirstOrDefaultAsync(p => p.p_ID == a_PromoCodeID);
						if (pcode != null) {
							seat.p_PromoCode = pcode;
						}
					}
					log.p_PromoCodeID = seat.p_PromoCodeID;
					log.p_Price = seat.p_TotalPrice;

					seats.Add(seat);
					m_AppDbContext.p_LogsHalls.Add(log);
				}
			}
			await m_AppDbContext.SaveChangesAsync();
			m_AppDbContext.p_Seats.Include(s => s.p_PromoCode).Load();
			return Json(seats);
		}

		[HttpPost]
		public async Task<ActionResult> f_SetSeat(Cl_Seat a_Seat) {
			if (a_Seat != null && a_Seat.p_Row > 0 && a_Seat.p_Number > 0) {
				Cl_Session session = m_AppDbContext.p_Sessions.FirstOrDefault(s => s.p_ID == a_Seat.p_SessionID);
				if (session != null) {
					Cl_Seat seat = m_AppDbContext.p_Seats.FirstOrDefault(s => s.p_SessionID == session.p_ID && s.p_Row == a_Seat.p_Row && s.p_Number == a_Seat.p_Number);
					if (seat == null) {
						seat = a_Seat;
						m_AppDbContext.p_Seats.Add(seat);
					} else {
						seat.p_UserFIO = a_Seat.p_UserFIO;
						seat.p_Mobile = a_Seat.p_Mobile;
						seat.p_Price = a_Seat.p_Price;
						seat.p_TypeEmployment = a_Seat.p_TypeEmployment;
						seat.p_Comment = a_Seat.p_Comment;
					}
					await m_AppDbContext.SaveChangesAsync();
					return Json(seat);
				} else {
					throw new Exception("Сеанс не найден");
				}
			} else {
				throw new Exception("Место неопределено");
			}
		}

		[HttpPost]
		public async Task<ActionResult> f_RemoveSeats(Guid[] a_SeatsID) {
			List<Cl_Seat> seats = new List<Cl_Seat>();
			foreach (Guid seatID in a_SeatsID) {
				Cl_Seat seat = m_AppDbContext.p_Seats.Include(s => s.p_PromoCode).FirstOrDefault(s => s.p_ID == seatID);
				if (seat != null) {
					Cl_LogsHalls log = new Cl_LogsHalls();
					log.p_UserID = m_AppDbContext.p_Users.First(u => u.UserName == User.Identity.Name).p_ID;
					log.p_SeatID = seat.p_ID;
					log.p_Date = DateTime.Now;
					log.p_TypeEmployment = Cl_Seat.E_TypeEmployment.Free;
					log.p_PromoCodeID = seat.p_PromoCodeID;
					log.p_Price = seat.p_TotalPrice;

					seat.p_UserFIO = "";
					seat.p_Mobile = "";
					seat.p_PromoCodeID = null;
					seat.p_TypeEmployment = Cl_Seat.E_TypeEmployment.Free;
					seat.p_Comment = "";
					seats.Add(seat);
					
					m_AppDbContext.p_LogsHalls.Add(log);
				}
			}
			await m_AppDbContext.SaveChangesAsync();
			return Json(seats);
		}
	}
}
