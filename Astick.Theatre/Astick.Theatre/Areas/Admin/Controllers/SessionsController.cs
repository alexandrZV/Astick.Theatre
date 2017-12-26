using Astick.Core.Web;
using Astick.Core.Web.Controls;
using Astick.Theatre.Data;
using Astick.Theatre.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
		public async Task<ActionResult> TableOffices(Ctrl_Table.Cl_Params<Cl_Session> a_Grid) {
			if (a_Grid != null) {
				var session = m_AppDbContext.p_Sessions.Include(s => s.p_Hall);
				ActionResult result = await a_Grid.f_Execute(m_AppDbContext, session);

				if (a_Grid.p_Action == Ctrl_Table.E_Actions.Add || a_Grid.p_Action == Ctrl_Table.E_Actions.Edit) {
					Cl_Hall hall = await m_AppDbContext.p_Halls.FirstOrDefaultAsync(h => h.p_ID == a_Grid.p_Object.p_HallID);
					if (hall != null) {
						a_Grid.p_Object.p_Hall = hall;
						if (a_Grid.p_Action == Ctrl_Table.E_Actions.Add) {
							foreach (Cl_Seat.E_Type type in Enum.GetValues(typeof(Cl_Seat.E_Type))) {
								f_SetSeatsForNewHall(a_Grid.p_Object, type);
							}
						} else if (a_Grid.p_Action == Ctrl_Table.E_Actions.Edit) {
							Cl_Seat[] seats = m_AppDbContext.p_Seats.Where(s => s.p_SessionID == a_Grid.p_Object.p_ID).ToArray();
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

		[Route("/admin/sessions/{a_SessionID:guid}")]
		public ActionResult Session(Guid a_SessionID) {
			Cl_Session session = m_AppDbContext.p_Sessions.Include(s => s.p_Hall).Include(s => s.p_Seats).FirstOrDefault(s => s.p_ID == a_SessionID);
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
		public async Task<ActionResult> f_ActionSeat(Guid[] a_SeatsID, string a_UserFIO, string a_Mobile, string a_Promo, string a_Comment, Cl_Seat.E_TypeEmployment a_TypeEmployment) {
			List<Cl_Seat> seats = new List<Cl_Seat>();
			foreach (Guid seatID in a_SeatsID) {
				Cl_Seat seat = m_AppDbContext.p_Seats.FirstOrDefault(s => s.p_ID == seatID);
				if (seat != null) {
					if (a_TypeEmployment == Cl_Seat.E_TypeEmployment.Free) {
						seat.p_UserFIO = "";
						seat.p_Mobile = "";
						seat.p_TypeEmployment = Cl_Seat.E_TypeEmployment.Free;
						seat.p_Comment = "";
					} else {
						seat.p_UserFIO = a_UserFIO;
						seat.p_Mobile = a_Mobile;
						seat.p_Promo = a_Promo;
						seat.p_TypeEmployment = a_TypeEmployment;
						seat.p_Comment = a_Comment;
					}
					seats.Add(seat);
				}
			}
			await m_AppDbContext.SaveChangesAsync();
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
				Cl_Seat seat = m_AppDbContext.p_Seats.FirstOrDefault(s => s.p_ID == seatID);
				if (seat != null) {
					seat.p_UserFIO = "";
					seat.p_Mobile = "";
					seat.p_Promo = "";
					seat.p_TypeEmployment = Cl_Seat.E_TypeEmployment.Free;
					seat.p_Comment = "";
					seats.Add(seat);
				}
			}
			await m_AppDbContext.SaveChangesAsync();
			return Json(seats);
		}
	}
}
