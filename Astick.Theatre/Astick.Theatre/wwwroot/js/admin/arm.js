"use strict";

var p_Title = "ASTICK";

var el_ARMTitle;
var ARMTitleBase;
var el_ARMPageContent;
var el_ARMHeaderLeftMenu;

function Cl_ARM() {
  this.p_ARMTitle = '';
  this.p_IsDateStart = this.p_IsDateStart === true;

	Cl_BaseEvents.call(this);

	this.p_ARMDateStart = null;

	this.p_IsInit = false;
  this.e_Init = this.f_AddEvent('e_Init');
  this.e_ChangeARMDateStart = this.f_AddEvent('e_ChangeARMDateStart');
	var that = this

  if (this.p_IsDateStart) {
    this.p_ARMDateStart = $.cookie('m_ARMDateStart');
    if (this.p_ARMDateStart == null) {
      this.p_ARMDateStart = moment().subtract(14, 'days').format('DD.MM.YYYY');
      $.cookie('m_ARMDateStart', this.p_ARMDateStart);
    }
  }
}
Cl_ARM.prototype.f_Init = function () {
  if (this.p_IsDateStart) {
    var that = this
    var elMenuDateStart = document.getElementById('menu_dateStart');
    elMenuDateStart.classList.remove('hidden');
    this.elMdlMenuDateStart = elMenuDateStart.querySelector('.mdl-datefield');
    componentHandler.upgradeElement(this.elMdlMenuDateStart, "MaterialDatefield");
    this.elMdlMenuDateStart = this.elMdlMenuDateStart.MaterialDatefield;
    this.elMdlMenuDateStart.element.onchange = function () {
      that.f_SetARMDateStart(this.value);
    };
    this.elMdlMenuDateStart.f_SetDate(this.p_ARMDateStart);
  }
	this.p_IsInit = true;
	this.e_Init();
}
Cl_ARM.prototype.f_SetARMDateStart = function (a_Value) {
	if (a_Value != null && moment(a_Value, 'DD MMM YYYY').isValid()) {
    $.cookie('m_ARMDateStart', a_Value);
    this.p_ARMDateStart = a_Value;
    if (this.elMdlMenuDateStart.element.value !== a_Value) {
      this.elMdlMenuDateStart.f_SetDate(a_Value);
    }
    this.e_ChangeARMDateStart();
		return true;
	} else {
		return false;
	}
}
Cl_ARM.prototype.f_SetTitle = function (a_Title) {
	var title = a_Title;
	if (title == null || title == '') {
		title = document.querySelector(".pageTitle").outerText
	}
	if (this.p_ARMTitle != null && this.p_ARMTitle != '') {
		if (window.m_MailCounters !== undefined) {
			document.title = this.p_ARMTitle + "(" + m_MailCounters + "). " + title;
		} else {
			document.title = this.p_ARMTitle + ". " + title;
		}
		el_ARMTitle.innerText = this.p_ARMTitle + ". " + title;
	} else {
		f_SetTitle(title);
		el_ARMTitle.innerText = title;
	}
}

function f_SetTitle(a_Title) {
	var title = a_Title;
	if (title == null || title == '') {
		title = document.querySelector(".pageTitle").outerText;
	}
	document.title = p_Title + " - " + title;
}

function f_ChangeContent(a_Html) {
	var e_ChangingPageContent = new CustomEvent("changingPageContent", { bubbles: true, cancelable: true, detail: { a_Element: el_ARMPageContent, a_NewContent: a_Html } });
	document.documentElement.dispatchEvent(e_ChangingPageContent);
	var $cnt = $(el_ARMPageContent).html(a_Html);
	componentHandler.upgradeElements($cnt[0]);
	var e_ChangedPageContent = new CustomEvent("changedPageContent", { bubbles: true, cancelable: true, detail: { a_Element: el_ARMPageContent } });
	document.documentElement.dispatchEvent(e_ChangedPageContent);
	f_SetTitle();
}

function f_AJAXLoadHref() {
	f_ShowLoading();
	$.ajax({
		headers: {
			"X-Requested-With": "XMLHttpRequest"
		},
		type: "GET",
		url: window.location.href,
		contentType: 'application/json; charset=utf-8',
		success: function (data, textStatus) {
			f_HideLoading();
			if (this.dataTypes[1] != "script") {
				f_ChangeContent(data);
			}
		}
	});
}

function f_IsMobile() {
	return $(window).width() <= 839;
}

function f_ShowLoading(a_Selector) {
	if (f_IsMobile()) {
		$('.lMobileMain').addClass('active');
	} else {
		var sel;
		if (a_Selector != null) {
			sel = a_Selector;
		} else {
			sel = '#arm-content';
		}
		$(sel).waitMe();
	}
}

function f_HideLoading(a_Selector) {
	$('.lMobileMain').removeClass('active');
	var sel;
	if (a_Selector != null) {
		sel = a_Selector;
	} else {
		sel = '#arm-content';
	}
	$(sel).waitMe('hide');
}

function f_GoLink(a_Url, a_Params) {
	f_ShowLoading();
	$.ajax({
		method: 'GET',
		url: a_Url,
		data: a_Params,
		cache: false,
		success: function (data) {
			var $cnt = $(el_ARMPageContent).html(data);
			componentHandler.upgradeElements($cnt[0]);
			var url = document.querySelector(".pageUrl").outerText.replace(/&amp;/g, "&");
			if (history.pushState) window.history.pushState("ajax", document.title, url);
			f_SetTitle();
			var e_ChangedPageContent = new CustomEvent("changedPageContent", { bubbles: true, cancelable: true, detail: { a_Element: el_ARMPageContent, a_Content: data } });
			document.documentElement.dispatchEvent(e_ChangedPageContent);
			f_HideLoading();
			f_TopMenuClose();
		}
	});
}

function f_MenuSelectItem(item) {
	var url = item.getAttribute("data-url");
	if (item.getAttribute("data-target") == "blank") {
		window.open(url, '_blank');
	} else {
		f_GoLink(url);
	}
}

function f_TopMenuInitUser() {
  el_ARMHeaderLeftMenu.querySelector('.userName').innerText = m_User.p_Name;
  el_ARMHeaderLeftMenu.querySelector('.userMobile').innerText = m_User.p_Mobile;
  el_ARMHeaderLeftMenu.querySelector('.userEmail').innerText = m_User.p_Email;
  el_ARMHeaderLeftMenu.querySelector('.userOffice').innerHTML = m_User.p_OfficeName;
}

function f_TopMenuRefresh() {
  $.post('/arm/f_GetUser', function (user) {
    if (user.error === undefined) {
      m_User = user;
      f_TopMenuInitUser();
    } else {
      alert(user.error);
    }
  });
}

function f_TopMenuClose() {
	var matLayout = document.getElementById('topmenu').MaterialLayout;
	f_Mdl_LayoutMenuClose(matLayout);
}

function f_ChangeSkin(a_Skin) {
	document.body.className = "";
	document.body.classList.add(a_Skin);
	$.cookie('skin', a_Skin);
	return false;
}

document.addEventListener("DOMContentLoaded", function (event) {
	el_ARMTitle = document.querySelector('#arm-title');
	ARMTitleBase = el_ARMTitle.outerText;
	el_ARMPageContent = document.querySelector('#arm-content');
	el_ARMHeaderLeftMenu = document.querySelector('.leftMenu_header');
  f_TopMenuInitUser();

	var el_RightMenu = document.querySelector('.rightMenu');
	el_RightMenu.addEventListener('click', function (e) {
		e.stopPropagation();
	});

	var el_RightTabs = el_RightMenu.querySelector('.mdl-tabs');
	var tabs = el_RightMenu.querySelectorAll('.mdl-tabs__tab');
	[].forEach.call(tabs, function (tab) {
		tab.addEventListener('click', function (e) {
			var ctx = el_RightTabs.MaterialTabs;
			var href = tab.href.split('#')[1];
			var panel = ctx.element_.querySelector('#' + href);
			ctx.resetTabState_();
			ctx.resetPanelState_();
			tab.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
			panel.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
			el_RightMenu.MaterialMenu.show();
		});
	});

	el_ARMTitle.innerText = document.querySelector('.pageTitle').outerText;
	document.addEventListener('changedPageContent', function (e) {
		el_ARMTitle.innerText = document.querySelector('.pageTitle').outerText;
	});

	window.addEventListener('popstate', function (e) {
		if (window.history.m_Blocking != true) {
			if (e.state == "ajax") {
				f_AJAXLoadHref();
			} else if (e.state == null || e.state == "") {
				window.history.replaceState("ajax", document.title, window.location.href);
			}
		}
		e.preventDefault();
	}, false);
	f_SetTitle();

	f_ChangeSkin($.cookie('skin'));
	var list = document.querySelectorAll('[data-skin]');
	[].forEach.call(list, function (skin) {
		skin.addEventListener('click', function (e) {
			e.preventDefault();
			f_ChangeSkin(this.getAttribute('data-skin'));
		});
	});
});
