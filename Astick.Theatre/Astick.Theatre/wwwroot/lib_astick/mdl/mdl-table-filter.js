!function ($) {
  'use strict';
  var f_Sprintf = $.fn.mdlTable.utils.f_Sprintf;
  var getCurrentHeader = function (a_That) {
    var header = a_That.$header;
    if (a_That.options.height) {
      header = $(a_That.el_TableHeaderCollumns);
    }
    return header;
  };
  var getCurrentSearchControls = function (a_That) {
    var searchControls = '.headerCollumns select, .headerCollumns input';
    if (a_That.options.height) {
      searchControls = 'table .headerCollumns select, table .headerCollumns input';
    }
    return searchControls;
  };
  var copyValues = function (a_That) {
    var header = getCurrentHeader(a_That), searchControls = getCurrentSearchControls(a_That);
    a_That.m_FilterValues = [];
    header.find(searchControls).each(function () {
      var fieldName = $(this).parents('th').data('field');
      if (fieldName != null && fieldName != "") {
        a_That.m_FilterValues.push(
          {
            field: fieldName,
            value: $(this).val()
          });
      }
    });
  };
  var setValues = function (a_That) {
    var field = null,
      result = [],
      header = getCurrentHeader(a_That),
      searchControls = getCurrentSearchControls(a_That);
    if (a_That.m_FilterValues.length > 0) {
      header.find(searchControls).each(function (index, ele) {
        field = $(this).parents('th').data('field');
        result = $.grep(a_That.m_FilterValues, function (valueObj) {
          return valueObj.field === field;
        });
        if (result.length > 0) {
          $(this).val(result[0].value);
        }
      });
    }
  };
  var m_SelectControlsValues = [];
  var f_CreateControls = function (a_That, elHeader) {
    var addedFilterControl = false,
      isVisible,
      html,
      timeoutId = 0;
    $.each(a_That.columns, function (i, column) {
      isVisible = 'hidden';
      column.field_sys = column.field.replace(/\./, '_');
      if (column.filterFieldItemKey === undefined) {
        if (column.selectKey !== undefined) {
          column.filterFieldItemKey = column.selectKey;
        } else {
          column.filterFieldItemKey = 'key';
        }
      }
      if (column.filterFieldItemValue === undefined) {
        if (column.selectValue !== undefined) {
          column.filterFieldItemValue = column.selectValue;
        } else {
          column.filterFieldItemValue = 'value';
        }
      }
      html = [];
      if (!column.filterControl) {
        //html.push('<div style="height: 28px;"></div>');
      } else {
        html.push(f_Sprintf('<div style="margin: 0px 2px 2px 2px;" class="filterControl" type="%s">', column.filterControl.toLowerCase()));
        if (column.filterControl) {
          addedFilterControl = true;
          isVisible = 'visible'
        }
        var value = '';
        if (a_That.filterColumnsPartial !== undefined) {
          if (column.filterFieldKey !== undefined)
            value = a_That.filterColumnsPartial[column.filterFieldKey];
          else
            value = a_That.filterColumnsPartial[column.field];
          if (value == null) {
            value = '';
          }
        } else if (column.filterValue !== undefined) {
          value = column.filterValue;
          //column.filterValue = undefined;
          //a_That.f_ColumnSearch(column.field, value);
        }
        switch (column.filterControl.toLowerCase()) {
          case 'input':
            html.push(f_Sprintf('<div class="mdl-textfield filter-keydown" style="width:80%;overflow:hidden;visibility: %s">', isVisible) +
              f_Sprintf('<input class="mdl-textfield__input" type="text" style="width:100%" id="%s_filter_%s" value="%s" />', a_That.m_ID, column.field_sys, value) +
              f_Sprintf('<label class="mdl-textfield__label" for="%s_filter_%s"></label>', a_That.m_ID, column.field_sys) +
              '</div>');
            break;
          case 'select':
            if (column.filterFieldKey === undefined) {
              column.filterFieldKey = column.filterFieldItemKey;
            }
            html.push(f_Sprintf('<div class="mdl-selectfield filter-select %s" data-field-item-key="%s" data-field-item-value="%s"><input id="%s_filter_select_%s" class="mdl-selectfield__input" data-read-only="true" />',
              column.field_sys, column.filterFieldItemKey, column.filterFieldItemValue, a_That.m_ID, column.field_sys) +
              f_Sprintf('<label class="mdl-selectfield__label" for="%s_filter_select_%s"></label>', a_That.m_ID, column.field_sys) +
              f_Sprintf('<ul for="%s_filter_select_%s"></ul></div>', a_That.m_ID, column.field_sys));
            break;
          case 'datepicker':
            html.push(f_Sprintf('<div class="mdl-datefield filter-date"><input id="%s_filter_date_%s" class="%s mdl-datefield__input" style="width: 100%; visibility: %s" value="%s"></input>',
              a_That.m_ID, column.field_sys, column.field_sys, isVisible, value) +
              f_Sprintf('<label class="mdl-datefield__label" for="%s_filter_date_%s"></label>', a_That.m_ID, column.field_sys) +
              '</div>');
            break;
        }
      }
      [].forEach.call(elHeader.children, function (th) {
        if (th.getAttribute("data-field") === column.field) {
          var elFht = th.querySelector('.fht-cell');
          if (elFht != null)
            th.querySelector('.fht-cell').innerHTML = html.join('');
          if (column.filterControl) {
            switch (column.filterControl.toLowerCase()) {
              case 'input':
                var el = th.querySelector('.mdl-textfield');
                componentHandler.upgradeElement(th.querySelector('.mdl-textfield'), "MaterialTextfield");
                break;
              case 'select':
                var el = th.querySelector('.mdl-selectfield');
                componentHandler.upgradeElement(el, "MaterialSelectfield");
                break;
              case 'datepicker':
                var el = th.querySelector('.mdl-datefield');
                componentHandler.upgradeElement(th.querySelector('.mdl-datefield'), "MaterialDatefield");
                break;
            }
          }
          return false;
        }
      });
      if (column.filterData === undefined && column.selectDataValue !== undefined) {
        if (column.selectDataType === 'var' || column.selectDataType === 'url') {
          column.filterData = column.selectDataType + "=" + column.selectDataValue;
        }
      }
      if (column.selectDataType === 'enum' || (column.filterData !== undefined && column.filterData.toLowerCase() !== 'column')) {
        var mdlSelect = a_That.el_Table.querySelector('.' + column.field_sys);
        if (mdlSelect !== null) {
          mdlSelect = mdlSelect.MaterialSelectfield;
          if (column.filterReadOnly) {
            mdlSelect.options.readOnly = true;
          }
          if (column.selectDataType === 'enum') {
            var itemEnum = new Object();
            itemEnum.key = -1;
            itemEnum.value = a_That.options.formatAllRows();
            var dataEnum = [itemEnum];
            for (var i in column.selectData) {
              itemEnum = new Object();
              itemEnum.key = i;
              itemEnum.value = column.selectData[i];
              dataEnum.push(itemEnum);
            }
            //dataEnum = dataEnum.concat(column.selectData);
            mdlSelect.f_SetData(dataEnum);
            mdlSelect.options.searchMinLength = 1;
            mdlSelect.options.searchMethod = 'local';
            mdlSelect.f_SetKey(value);
          } else {
            var filterDataType = column.filterData.substring(0, 3);
            var filterDataSource = column.filterData.substring(4, column.filterData.length);
            if (column.filterFieldKey !== undefined) {
              mdlSelect.m_FieldKey = column.filterFieldKey;
            }
            if (column.filterFieldValue !== undefined) {
              mdlSelect.m_FieldValue = column.filterFieldValue;
            }
            switch (filterDataType) {
              case 'url':
                var isInitValues = false;
                for (var i in m_SelectControlsValues) {
                  if (m_SelectControlsValues[i][0] == column.field) {
                    mdlSelect.f_SetData(m_SelectControlsValues[i][1]);
                    isInitValues = true;
                    break;
                  }
                }
                if (!isInitValues) {
                  $.ajax({
                    url: filterDataSource,
                    dataType: 'json',
                    success: function (data) {
                      var empty = new Object();
                      empty.value = "";
                      data.splice(0, 0, empty);
                      mdlSelect.f_SetData(data);
                      m_SelectControlsValues.push([column.field, data]);
                    }
                  });
                }
                break;
              case 'var':
                var variableValues = window[filterDataSource];
                mdlSelect.f_SetData(variableValues);
                mdlSelect.options.searchMinLength = 1;
                mdlSelect.options.searchMethod = 'local';
                break;
            }
            if (mdlSelect != null) {
              mdlSelect.f_SetKey(value);
            }
          }
        }
      }
    });
    var $header = $(elHeader);
    if (addedFilterControl) {
      $header.off('keydown', '.filter-keydown input').on('keydown', '.filter-keydown input', function (event) {
        if (!a_That.options.filterSubmit || event.keyCode == null) {
          if (event.keyCode == "13") {
            event.preventDefault();
          } else {
            if (event.keyCode === 8 || event.keyCode === 32 || (event.keyCode >= 45 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 111) || (event.keyCode >= 186 && event.keyCode <= 192)) {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(function () {
                a_That.f_OnColumnSearch(event);
              }, a_That.options.searchTimeOut);
            }
          }
        } else {
          if (event.keyCode == "13") {
            a_That.f_OnColumnSearch(event);
            event.preventDefault();
          }
        }
      });
      $header.find('.filter-select input').off('change').on('change', function (event) {
        if (!a_That.options.filterSubmit) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(function () {
            a_That.f_OnColumnSearch(event);
          }, a_That.options.searchTimeOut);
        } else {
          a_That.f_OnColumnSearch(event);
        }
      });
      $header.find('.filter-date .mdl-datefield__input').off('afterChange').on('afterChange', function (event, date) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          a_That.f_OnColumnSearch(event);
        }, a_That.options.searchTimeOut);
      });
      //$.each(a_That.columns, function (i, column) {
      //  if (column.filterControl !== undefined && column.filterControl.toLowerCase() === 'datepicker') {
      //    $header.find('.mdl-datefield input.' + column.field).off('change').on('change', function (event) {
      //      $(event.currentTarget).keydown();
      //    });
      //  }
      //});
    } else {
      $header.find('.filterControl').hide();
    }
  };

  $.extend($.fn.mdlTable.defaults, {
    filterControl: false,
    filterSubmit: false,
    searchTimeOut: 500,
    f_OnColumnSearch: function (a_Field, a_Text) {
      return false;
    },
    showFilterClear: false,
    filterIcons: {
      clear: 'flash_off'
    }
  });

  $.extend($.fn.mdlTable.COLUMN_DEFAULTS, {
    filterControl: undefined,
    filterReadOnly: false,
    filterValue: undefined,
    filterFieldKey: undefined,
    filterFieldName: undefined,
    filterFieldValue: undefined,
    filterFieldValueTemplate: undefined,
    filterFieldItemKey: undefined,
    filterFieldItemValue: undefined,
    filterFieldItemValueTemplate: undefined
  });

  $.extend($.fn.mdlTable.Constructor.EVENTS, {
    'column-search.mdl.table': 'f_OnColumnSearch'
  });

  var MdlTable = $.fn.mdlTable.Constructor,
    f__Init = MdlTable.prototype.f_Init,
    f__InitToolbar = MdlTable.prototype.f_InitToolbar,
    f__InitHeader = MdlTable.prototype.f_InitHeader,
    f__InitBody = MdlTable.prototype.f_InitBody,
    f__InitSearch = MdlTable.prototype.f_InitSearch;

  MdlTable.prototype.f_Init = function () {
    if (this.options.filterControl) {
      var that = this;
      this.m_FilterValues = [];
      this.$el.on('reset-view.mdl.table', function () {
        if (!that.options.height) {
          return;
        }
        if (that.el_TableHeaderCollumns.querySelectorAll('select').length > 0 || that.el_TableHeaderCollumns.querySelectorAll('input').length > 0) {
          return;
        }
        f_CreateControls(that, that.el_TableHeaderCollumns);
      }).on('post-header.mdl.table', function () {
        setValues(that);
      }).on('column-switch.mdl.table', function (field, checked) {
        setValues(that);
      });
    }
    f__Init.apply(this, Array.prototype.slice.apply(arguments));
  };

  MdlTable.prototype.f_InitToolbar = function () {
    if ((!this.showToolbar) && (this.options.filterControl)) {
      this.showToolbar = this.options.filterControl;
    }
    f__InitToolbar.apply(this, Array.prototype.slice.apply(arguments));
    if (this.options.filterControl && this.options.showFilterClear) {
      var elBtnUser$ = this.$toolbarButtons.find('.btnUser');
      var $btnClear = $([f_Sprintf('<div title="%s">', this.options.formatFilterClear()),
        '<button class="mdl-button mdl-js-button mdl-button--icon" type="button" name="filterclear">',
      f_Sprintf('<i class="material-icons">%s</i>', this.options.filterIcons.clear),
        '</button></div>'].join(''));
      if (elBtnUser$.length > 0) {
        elBtnUser$.before($btnClear);
      } else {
        $btnClear.appendTo(this.$toolbarButtons);
      }
      $btnClear.off('click').on('click', $.proxy(this.f_ClearFilterControl, this));
    }
  };

  MdlTable.prototype.f_InitHeader = function () {
    var that = this;
    componentHandler.downgradeElements(this.el_Header.querySelectorAll('tr .fht-cell .mdl-textfield, tr .fht-cell .mdl-selectfield, tr .fht-cell .mdl-datefield'));
    f__InitHeader.apply(this, Array.prototype.slice.apply(arguments));
    if (!this.options.filterControl) {
      return;
    }
    f_CreateControls(this, this.el_TableHeaderCollumns);
    copyValues(this);
    this.filterColumnsPartial = {};
    $.each(this.m_FilterValues, function (i, item) {
      if (item.field !== undefined && item.field !== null && item.field !== '' && item.value !== undefined && item.value !== null && item.value !== '') {
        that.filterColumnsPartial[item.field] = item.value;
      }
    });
  };

  MdlTable.prototype.f_InitBody = function () {
    f__InitBody.apply(this, Array.prototype.slice.apply(arguments));
    var that = this,
      data = this.options.data,
      pageTo = this.pageTo < this.options.data.length ? this.options.data.length : this.pageTo;
    for (var i = this.pageFrom - 1; i < pageTo; i++) {
      var item = data[i];
      $.each(this.header.fields, function (j, field) {
        var value = item[field], column = that.columns[that.f_GetFieldIndex(that.columns, field)];
        value = $.fn.mdlTable.utils.calculateObjectValue(that.header, that.header.formatters[j], [value, item, i], value);
        if ((!column.checkbox) || (!column.radio)) {
          if (column.filterControl !== undefined && column.filterControl.toLowerCase() === 'select') {
            if (column.filterData === undefined || column.filterData.toLowerCase() === 'column') {
              var selectControl = $('.' + column.field);
              if (selectControl !== undefined && selectControl.length > 0) {
                var options = selectControl.get(selectControl.length - 1).options;
                if (options !== undefined) {
                  if (options.length === 0) {
                    addOptionToSelectControl(selectControl, '', '');
                  }
                  addOptionToSelectControl(selectControl, value, value);
                }
              }
            }
          }
        }
      });
    }
  };

  MdlTable.prototype.f_ColumnSearch = function (a_Field, a_Value, a_Callback) {
    if (a_Field !== undefined && a_Field !== null) {
      var that = this;
      copyValues(this);
      var text = '';
      if (a_Value !== undefined && a_Value !== null) {
        text = a_Value;
      }
      if ($.isEmptyObject(this.filterColumnsPartial)) {
        this.filterColumnsPartial = {};
      }
      if (text !== undefined && text !== null && text !== '') {
        this.filterColumnsPartial[a_Field] = text;
      } else {
        delete this.filterColumnsPartial[a_Field];
      }
      this.options.pageNumber = 1;
      this.f_InitServer(null, null, function () {
        if (a_Callback !== undefined) {
          a_Callback();
        }
        that.f_Trigger('column-search', a_Field, text);
      });
    }
  };

  MdlTable.prototype.f_OnColumnSearch = function (event, a_Callback) {
    var text = event.target.getAttribute("key");
    if (text === null) {
      text = event.target.value;
    } else if (text === "undefined") {
      text = "";
    }
    var val = text;
    if (event.target.getAttribute("type") === 'number' && val !== "") {
      val = parseInt(text);
      if (val === NaN) {
        val = text;
      }
    }
    var field = undefined;
    var filterFieldKey = $(event.currentTarget).parents('th').data('filterFieldKey');
    if (filterFieldKey !== undefined)
      field = filterFieldKey;
    else
      field = $(event.currentTarget).parents('th').data('field');
    this.f_ColumnSearch(field, val, a_Callback);
  };

  MdlTable.prototype.f_ClearFilterControl = function () {
    if (this.options.filterControl && this.options.showFilterClear) {
      var that = this;
      $.each(this.m_FilterValues, function (i, item) {
        item.value = '';
      });
      setValues(this);
      var controls = getCurrentHeader(this).find(getCurrentSearchControls(this)), timeoutId = 0;
      if (controls.length > 0) {
        this.filterColumnsPartial = {};
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          that.options.pageNumber = 1;
          that.f_InitServer();
          //$(controls[0]).f_Trigger(controls[0].tagName === 'INPUT' ? 'keyup' : 'change');
        }, this.options.searchTimeOut);
      }
    }
  };
}(jQuery);
