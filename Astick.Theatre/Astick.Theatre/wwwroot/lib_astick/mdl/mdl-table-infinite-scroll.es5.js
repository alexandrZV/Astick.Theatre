'use strict';

!(function ($) {
  'use strict';

  $.extend($.fn.mdlTable.defaults, {
    infiniteScroll: true,
    pageFixedSize: false,
    pageSize: 15
  });

  var MdlTable = $.fn.mdlTable.Constructor,
      _init = MdlTable.prototype.f_Init,
      _initServer = MdlTable.prototype.f_InitServer,
      _refresh = MdlTable.prototype.f_Refresh;

  MdlTable.prototype.f_Init = function () {
    if (!this.options.infiniteScroll || !this.options.url && !this.options.ajax) {
      _init.apply(this, Array.prototype.slice.apply(arguments));
      return;
    }

    //this.options.showFooter = false;
    _init.apply(this, Array.prototype.slice.apply(arguments));

    var that = this;

    var offset = 0;
    var prevTop = 0;
    var sizeScroll = 0;
    var countInitScrol = 0;
    var prevTimeStamp = 0;
    var minCountOpenItems = this.options.pageSize;
    var rowHeight = 0;

    var scrollContent = document.querySelector('.mdl-layout__content');
    if (scrollContent === null || scrollContent === undefined) scrollContent = window;

    scrollContent.addEventListener('scroll', function (e) {
      var el = this;
      var scrollTop = el.scrollTop;
      if (el === window) {
        el = document.body;
        scrollTop = window.pageYOffset;
      }
      if (prevTop < scrollTop) {
        offset = Math.ceil(el.scrollHeight / 4);
        if (rowHeight > 0) {
          var _offset = rowHeight * that.options.pageSize;
          if (offset > _offset) offset = _offset;
        }
        //console.log("offset: " + offset);
        if (prevTimeStamp > e.timeStamp - 200) {
          sizeScroll += scrollTop - prevTop;
          countInitScrol++;
        } else {
          sizeScroll = 0;
          countInitScrol = 0;
        }

        if (el.scrollHeight - scrollTop <= el.clientHeight + offset) {
          if (that.data.length < that.options.totalRows) {
            var elRow = that.el_Table.querySelector('tbody tr');
            rowHeight = elRow.clientHeight;
            var countOpenItems = 0;
            var index = 0;
            if (that.options.pageFixedSize) {
              countOpenItems = that.options.pageSize;
              index = that.f_AddNewRows(countOpenItems) / that.options.pageSize;
            } else {
              var countItems = Math.ceil(sizeScroll / rowHeight);
              countOpenItems = Math.ceil(countItems / that.options.totalRows * that.options.pageSize + that.options.pageSize);
              if (countOpenItems < minCountOpenItems) countOpenItems = minCountOpenItems;
              if (that.data.length + countOpenItems > that.options.totalRows) {
                countOpenItems = that.options.totalRows - that.data.length;
              }
              index = that.f_AddNewRows(countOpenItems);
            }

            that.options.pageNumber++;
            that.f_InitServer(null, null, null, index, countOpenItems);
          }
        }
        prevTimeStamp = e.timeStamp;
      }
      prevTop = scrollTop;
    });
  };

  MdlTable.prototype.f_InitServer = function (silent, query, callback, a_Index, a_CountOpenItems) {
    if (!this.options.infiniteScroll) {
      _initServer.apply(this, Array.prototype.slice.apply(arguments));
      return;
    }
    if (!this.options.url && !this.options.ajax) {
      return;
    }
    var that = this,
        data = {},
        params = {
      sort: this.options.sortName,
      order: this.options.sortOrder
    },
        request;

    if (!that.options.pageFixedSize) {
      params.offset = a_Index !== undefined ? a_Index : 0;
      if (that.options.pageNumber === 1) params.limit = this.options.pageSize * 3;else params.limit = a_CountOpenItems !== undefined ? a_CountOpenItems : this.options.pageSize;
    } else {
      params.pageindex = a_Index !== undefined ? a_Index : 0;
      params.pagesize = this.options.pageSize;
    }
    if (!$.isEmptyObject(this.filterColumnsPartial)) {
      params['filter'] = JSON.stringify(this.filterColumnsPartial, null);
    }
    data = $.fn.mdlTable.utils.calculateObjectValue(this.options, this.options.queryParams, [params], data);
    data.cmd = 1;
    if (that.options.totalFields !== undefined) {
      data.total = that.options.totalFields;
    }
    $.extend(data, query || {});
    if (data === false) {
      return;
    }
    if (!silent) {
      this.f_ShowLoading();
    }
    request = $.extend({}, $.fn.mdlTable.utils.calculateObjectValue(null, this.options.ajaxOptions), {
      type: this.options.method,
      url: this.options.url,
      data: this.options.contentType === 'application/json' && this.options.method === 'post' ? JSON.stringify(data) : data,
      cache: this.options.cache,
      contentType: this.options.contentType,
      dataType: this.options.dataType,
      success: function success(res) {
        if (res.error !== undefined) {
          that.f_OnError(res.error);
          that.f_Trigger('load-error', res.status, res);
        } else {
          res = $.fn.mdlTable.utils.calculateObjectValue(that.options, that.options.responseHandler, [res], res);
          if ((res.total !== null || res.total !== undefined) && res.total > 0) {
            if (that.options.pageNumber === 1) that.f_Load(res);else {
              var rows = [];
              for (var i = 0; i < res.rows.length; i++) {
                var row = new Object();
                if (!that.options.pageFixedSize) {
                  row.index = params.offset + i;
                } else {
                  row.index = params.pageindex * params.pagesize + i;
                }
                row.row = res.rows[i];
                rows.push(row);
              }
              that.f_UpdateRows(rows);
            }
          } else {
            that.f_Load(res);
          }
          that.f_Trigger('load-success', res);
        }
      },
      error: function error(res) {
        var mes = res.responseText;
        if (mes !== "") {
          mes = "Ошибка запроса!";
          that.f_ShowError(mes);
        } else {
          that.f_ShowError(mes);
        }
        that.f_Trigger('load-error', res.status, res);
      },
      complete: function complete(res) {
        if (callback !== undefined && callback !== null) {
          callback(res);
        }
        that.f_HideLoading();
      }
    });
    if (this.options.ajax) {
      $.fn.mdlTable.utils.calculateObjectValue(this, this.options.ajax, [request], null);
    } else {
      $.ajax(request);
    }
  };

  MdlTable.prototype.f_Refresh = function (a_Params) {
    if (!this.options.infiniteScroll || !this.options.url && !this.options.ajax) {
      _refresh.apply(this, Array.prototype.slice.apply(arguments));
      return;
    }
    if (a_Params && a_Params.url) {
      this.options.url = a_Params.url;
    }
    this.options.pageNumber = 1;
    this.f_InitServer(a_Params && a_Params.silent, a_Params && a_Params.query, null);
  };
})(jQuery);

