'use strict';

!(function ($) {
  'use strict';

  var MdlTable = $.fn.mdlTable.Constructor;

  MdlTable.f_OnWindowResize = function () {
    var isToggle = false;
    if (window.innerWidth < 840) {
      if (!this.m_CardView) {
        this.m_CardView = true;
        this.f_InitCardView();
      }
    } else {
      if (this.m_CardView) {
        this.m_CardView = false;
        this.f_InitCardView();
      }
    }
  };

  MdlTable.prototype.f_GetChecked = function () {
    return this.options.checked || this.options.showActionSelected || this.options.showRemoveSelected;
  };

  MdlTable.prototype.f_GetTotals = function () {
    return this.options.totalFields !== undefined && this.options.totalFields.length > 0;
  };

  MdlTable.prototype.f_Init = function () {
    this.e_OnWindowResize = MdlTable.f_OnWindowResize.bind(this);
    //this.e_OnPopState = MdlTable.f_OnPopState.bind(this);
    window.removeEventListener('resize', this.e_OnWindowResize);
    //window.removeEventListener('popstate', this.e_OnPopState);
    window.addEventListener('resize', this.e_OnWindowResize);
    //window.addEventListener('popstate', this.e_OnPopState, true);

    this.m_IsLoaded = false;
    this.m_CardView = window.innerWidth < 768;
    this.f_InitLocale();
    this.f_InitContainer();
    this.f_InitLoader();
    this.f_InitTable();
    this.f_InitData(this.options.data);
    this.f_InitCardView();
    this.f_InitServer();
    this.f_InitRowsColors();
    this.f_InitSnackbar();
  };
  MdlTable.prototype.f_InitLocale = function () {
    if (this.options.locale) {
      var parts = this.options.locale.split(/-|_/);
      parts[0].toLowerCase();
      parts[1] && parts[1].toUpperCase();
      if ($.fn.mdlTable.locales[this.options.locale]) {
        $.extend(this.options, $.fn.mdlTable.locales[this.options.locale]);
      } else if ($.fn.mdlTable.locales[parts.join('-')]) {
        $.extend(this.options, $.fn.mdlTable.locales[parts.join('-')]);
      } else if ($.fn.mdlTable.locales[parts[0]]) {
        $.extend(this.options, $.fn.mdlTable.locales[parts[0]]);
      }
    }
  };
  MdlTable.prototype.f_InitContainer = function () {
    this.el_Container = document.createElement('form');
    this.el_Container.classList.add('mdl-table', 'mdl-color-text--grey-600');
    if (this.options.widthfill) {
      this.el_Container.classList.add('mdl-table-widthfill');
    }
    this.el_Container.setAttribute('onsubmit', 'return false;');
    //this.el_Container.setAttribute('onkeypress', 'if(event.keyCode === 13) return false;');
    this.el_Table.parentNode.insertBefore(this.el_Container, this.el_Table);
    this.el_Container.appendChild(this.el_Table);
    Cl_Core.f_AddClasses(this.el_Table, this.options.classes);
    this.$container = $(this.el_Container);
  };
  MdlTable.prototype.f_InitLoader = function () {
    this.el_CardViewLoader = document.createElement('div');
    this.el_CardViewLoader.classList.add('mdl-table_cardView-loader');
    this.el_CardViewLoader.innerHTML = ['<div class="mdl-spinner mdl-js-spinner is-active"></div>'];
    this.el_Container.appendChild(this.el_CardViewLoader);
  };
  MdlTable.prototype.f_InitTable = function () {
    var that = this,
        columns = [],
        data = [];
    this.$header = this.$el.find('>thead');
    if (!this.$header.length) {
      this.$header = $('<thead></thead>').appendTo(this.$el);
    }
    this.el_Header = this.$header[0];
    this.$header.find('tr').each(function () {
      var column = [];
      $(this).find('th').each(function () {
        column.push($.extend({}, {
          title: $(this).html(),
          'class': $(this).attr('class'),
          titleTooltip: $(this).attr('title'),
          rowspan: $(this).attr('rowspan') ? +$(this).attr('rowspan') : undefined,
          colspan: $(this).attr('colspan') ? +$(this).attr('colspan') : undefined
        }, $(this).data()));
      });
      columns.push(column);
    });
    if (!$.isArray(this.options.columns[0])) {
      this.options.columns = [this.options.columns];
    }
    this.options.columns = $.extend(true, [], columns, this.options.columns);
    this.columns = [];
    this.f_SetFieldIndex(this.options.columns);
    $.each(this.options.columns, function (i, columns) {
      $.each(columns, function (j, column) {
        column = $.extend({}, MdlTable.COLUMN_DEFAULTS, column);
        if (typeof column.fieldIndex !== 'undefined') {
          that.columns[column.fieldIndex] = column;
        }
        if (column.selectDataValue != null && typeof column.selectDataValue === 'string') {
          if (column.selectDataType === 'var') {
            column.selectData = Cl_Core.f_GetPropByString(window, column.selectDataValue);
          } else if (column.selectDataType === 'json') {
            column.selectData = JSON.parse(column.selectDataValue.replace(/'/g, '"'));
          } else if (column.selectDataType === 'url') {
            column.selectData = JSON.parse(column.selectDataValue.replace(/'/g, '"'));
          } else if (column.selectDataType === 'enum') {
            var dataObject = JSON.parse(column.selectDataValue.replace(/'/g, '"'));
            column.selectField = column.field;
            column.selectData = Object.keys(dataObject).map(function (x) {
              return dataObject[x];
            });
          } else {
            column.selectData = undefined;
          }
        }
        that.options.columns[i][j] = column;
      });
    });
    if (this.options.data == null || this.options.data.length) {
      return;
    }
    this.$el.find('>tbody>tr').each(function () {
      var row = {};
      row._id = $(this).attr('id');
      row._class = $(this).attr('class');
      row._data = Cl_Core.f_GetRealDataAttr($(this).data());
      $(this).find('td').each(function (i) {
        var field = that.columns[i].field;
        row[field] = $(this).html();
        row['_' + field + '_id'] = $(this).attr('id');
        row['_' + field + '_class'] = $(this).attr('class');
        row['_' + field + '_rowspan'] = $(this).attr('rowspan');
        row['_' + field + '_title'] = $(this).attr('title');
        row['_' + field + '_data'] = Cl_Core.f_GetRealDataAttr($(this).data());
      });
      data.push(row);
    });
    this.options.data = data;
  };
  MdlTable.prototype.f_InitHeader = function () {
    var that = this,
        visibleColumns = {},
        html = [],
        htmlTotals = [];
    this.header = {
      fields: [],
      styles: [],
      classes: [],
      formatters: [],
      events: [],
      sorters: [],
      sortNames: [],
      cellStyles: [],
      stateField: "selected"
    };
    $.each(this.options.columns, function (i, columns) {
      var clspan = columns.length;
      if (that.f_GetChecked()) clspan++;
      if (that.options.numbering) clspan++;
      if (that.options.detailSub || that.options.detailView) clspan++;
      if (that.options.showReview) clspan++;
      if (that.options.showClone) clspan++;
      if (that.options.showEdit) clspan++;
      if (that.options.showRemove) clspan++;
      html.push(Cl_Core.f_Sprintf('<tr class="headerButtons"><th colspan="%s" class="mdl-table-toolbar"><div class="mdl-table-toolbar-selectTitle"></div><div class="mdl-table-toolbar-buttons"></div></th></tr>', clspan));
      html.push(Cl_Core.f_Sprintf('<tr class="headerLoader"><th colspan="%s" class="mdl-table-loader"><div class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div></th></tr>', clspan));
      html.push('<tr class="headerCollumns">');
      if (that.f_GetTotals()) {
        htmlTotals.push('<tr class="headerTotals">');
      }
      if (that.f_GetChecked()) {
        if (!that.options.singleSelect) {
          html.push(Cl_Core.f_Sprintf('<th class="cbx"><label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="%s_chbxCheckAll">' + '<input name="bSelectAll" type="checkbox" id="%s_chbxCheckAll" class="mdl-checkbox__input mdl-checkbox__input-all"><span class="mdl-checkbox__label"></span></label></th>', that.m_ID, that.m_ID));
        } else {
          html.push('<th class="cbx"></th>');
        }
        htmlTotals.push('<th class="cbx"></th>');
      }
      if (that.options.numbering) {
        html.push('<th class="table_row_numbering">№</th>');
        htmlTotals.push('<th class="table_row_numbering">&nbsp</th>');
      }
      if (that.options.detailSub || that.options.detailView) {
        html.push('<th class="detail"></th>');
        htmlTotals.push('<th class="detail"></th>');
      }
      $.each(columns, function (j, column) {
        if (typeof column.fieldIndex !== 'undefined') {
          that.header.fields[column.fieldIndex] = column.field;
        }
        if (column.type === "array") {
          column.cardArea = 3;
        }
        if (column.type !== "button" && column.type !== "hidden") {
          var text = '',
              halign = '',
              align = '',
              style = '',
              class_ = Cl_Core.f_Sprintf(' class="%s"', column['class']),
              order = that.options.sortOrder || column.order,
              unitWidth = 'px',
              width = column.width;
          if (column.width !== undefined && !that.m_CardView) {
            if (typeof column.width === 'string') {
              if (column.width.indexOf('%') !== -1) {
                unitWidth = '%';
              }
            }
          }
          if (column.width && typeof column.width === 'string') {
            width = column.width.replace('%', '').replace('px', '');
          }
          halign = Cl_Core.f_Sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
          align = Cl_Core.f_Sprintf('text-align: %s; ', column.align);
          style = Cl_Core.f_Sprintf('vertical-align: %s; ', column.valign);
          style += Cl_Core.f_Sprintf('width: %s; min-width: %s; ', width ? width + unitWidth : undefined, width ? width + unitWidth : undefined);
          if (typeof column.fieldIndex !== 'undefined') {
            that.header.fields[column.fieldIndex] = column.field;
            if (that.m_CardView && !that.f_GetVisible(column)) {
              that.header.styles[column.fieldIndex] = align + style + 'display: none; ';
            } else {
              that.header.styles[column.fieldIndex] = align + style;
            }
            that.header.classes[column.fieldIndex] = class_;
            that.header.formatters[column.fieldIndex] = column.formatter;
            that.header.events[column.fieldIndex] = column.events;
            that.header.sorters[column.fieldIndex] = column.sorter;
            that.header.sortNames[column.fieldIndex] = column.sortName;
            that.header.cellStyles[column.fieldIndex] = column.cellStyle;
            if (that.m_CardView && !that.f_GetCardEnabled(column)) {
              return;
            }
            visibleColumns[column.field] = column;
          }
          if (!that.f_GetVisible(column)) style += 'display: none;';
          var htmlTh = ['<th' + Cl_Core.f_Sprintf(' title="%s"', column.titleTooltip), class_, Cl_Core.f_Sprintf(' style="%s"', halign + style), Cl_Core.f_Sprintf(' rowspan="%s"', column.rowspan), Cl_Core.f_Sprintf(' colspan="%s"', column.colspan), Cl_Core.f_Sprintf(' data-field="%s"', column.field), " tabindex='0'", '>'].join('');
          html.push(htmlTh);
          if (that.f_GetTotals()) {
            htmlTotals.push(htmlTh);
            var totalsFields = that.options.totalFields.split(',');
            for (var iTotal in totalsFields) {
              if (totalsFields[iTotal] === column.field) {
                htmlTotals.push('<span class="totalSumIcon">Ʃ </span><span class="totalSumVal" data-field="' + column.field + '">0</span>');
                break;
              }
            }
          }
          html.push(Cl_Core.f_Sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ? 'sortable both' : ''));
          if (that.options.sortable && column.sortable) html.push('<i class="material-icons"></i>');
          text = column.title;
          html.push(Cl_Core.f_Sprintf('<span class="firstWord">%s</span><span>%s%s</span>', text[0], text.substring(1, text.length), column.unit != null ? ', <br/>' + column.unit : ''));
          html.push('</div>');
          html.push('<div class="fht-cell"></div>');
          html.push('</div>');
          html.push('</th>');
          htmlTotals.push('</th>');
        }
      });
      if (that.f_IsVisibleButtons()) {
        html.push('<th class="btns btnsRows"></th>');
        htmlTotals.push('<th class="btns btnsRows"></th>');
      }
      html.push('</tr>');
      htmlTotals.push('</tr>');
    });
    if (that.f_GetTotals()) {
      this.$header.html(html.join('') + htmlTotals.join(''));
    } else {
      this.$header.html(html.join(''));
    }
    this.$header.find('th[data-field]').each(function (i) {
      $(this).data(visibleColumns[$(this).data('field')]);
    });
    this.$container.off('click', '.th-inner').on('click', '.th-inner', function (event) {
      if (that.options.sortable && $(this).parent().data().sortable) {
        that.f_OnSort(event);
      }
    });

    this.el_TableHeaderButtons = this.el_Table.querySelector('.headerButtons');
    this.el_TableHeaderCollumns = this.el_Table.querySelector('.headerCollumns');
    if (that.f_GetTotals()) {
      this.el_TableHeaderTotals = this.el_Table.querySelector('.headerTotals');
    }
    this.el_TableHeaderLoader = this.el_Table.querySelector('.headerLoader');
    this.f_HideLoading();

    this.el_Toolbar = this.el_TableHeaderButtons.querySelector('.mdl-table-toolbar');
    this.el_ToolbarButtons = this.el_Toolbar.querySelector('.mdl-table-toolbar-buttons');
    this.el_ToolbarSelectTitle = this.el_TableHeaderButtons.querySelector('.mdl-table-toolbar-selectTitle');

    this.$toolbar = $(this.el_Toolbar);
    this.$toolbarButtons = $(this.el_ToolbarButtons);
    this.$toolbarSelectTitle = $(this.el_ToolbarSelectTitle);

    if (!this.options.showHeader || this.m_CardView) {
      this.el_TableHeaderCollumns.classList.add('hidden');
      if (this.el_TableHeaderTotals !== undefined) {
        this.el_TableHeaderTotals.classList.add('hidden');
      }
      this.el_TableHeaderLoader.classList.add('hidden');
    } else {
      this.el_TableHeaderCollumns.classList.remove('hidden');
      if (this.el_TableHeaderTotals !== undefined) {
        this.el_TableHeaderTotals.classList.remove('hidden');
      }
      this.f_UpdateCaret();
    }

    componentHandler.upgradeElement(this.el_TableHeaderLoader.querySelector('.mdl-progress'), "MaterialProgress");

    this.$container.off('click', '[name="bSelectAll"]').on('click', '[name="bSelectAll"]', function () {
      var checked = $(this).prop('checked');
      that[checked ? 'f_CheckAll' : 'f_UncheckAll']();
      that.f_UpdateSelected();
      if (checked) {
        that.f_Trigger('check-change', that.data, $(this));
      } else {
        that.f_Trigger('check-change', null, $(this));
      }
    });

    this.f_InitToolbar();

    if (that.f_GetChecked() && !that.options.singleSelect) {
      var bSelectAll = this.$header.find('[name="bSelectAll"]').parent()[0];
      componentHandler.upgradeElement(bSelectAll, "MaterialCheckbox");
      this.ctrl_SelectAll = bSelectAll.MaterialCheckbox;
    }
  };
  MdlTable.prototype.f_InitData = function (a_Data, type) {
    var that = this;
    if (this.options.url || this.options.ajax || a_Data != null) {
      if (type === 'append') {
        this.data = this.data.concat(a_Data);
      } else if (type === 'prepend') {
        this.data = [].concat(a_Data).concat(this.data);
      } else {
        if (a_Data == null) this.data = [];else this.data = a_Data;
      }

      // Fix #839 Records deleted when adding new row on filtered table
      if (type === 'append') {
        this.options.data = this.options.data.concat(a_Data);
      } else if (type === 'prepend') {
        this.options.data = [].concat(a_Data).concat(this.options.data);
      } else {
        this.options.data = this.data;
      }
    } else {
      var data = [];
      data.total = 0;
      //this.$el.find('>tbody>tr').each(function () {
      //	data.total++;
      //	var item = new Object();
      //	$(this).find('td').each(function (i) {
      //		var field = that.columns[i].field;
      //		item[field] = $(this).html();
      //	});
      //	data.push(item);
      //});
      this.options.data = data;
      this.data = data;
    }
  };
  MdlTable.prototype.f_InitDataTotals = function (a_Data) {
    this.dataTotals = a_Data;
  };
  MdlTable.prototype.f_InitSnackbar = function () {
    if (this.options.visibleSnackbar) {
      var elSnackbar = document.getElementsByClassName('mdl-snackbar');
      if (elSnackbar !== undefined && elSnackbar.length > 0) {
        this.el_Snackbar = elSnackbar[0];
      } else {
        this.el_Snackbar = document.createElement("div");
        this.el_Snackbar.classList.add('mdl-snackbar');
        this.el_Snackbar.innerHTML = '<div class="mdl-snackbar__text"></div><button class="mdl-snackbar__action" type= "button" ></button>';
        this.el_Container.appendChild(this.el_Snackbar);
        componentHandler.upgradeElement(this.el_Snackbar, "MaterialSnackbar");
      }
    }
  };
  /*Событие сортировки*/
  MdlTable.prototype.f_OnSort = function (event) {
    var $this = event.type === "keypress" ? $(event.currentTarget) : $(event.currentTarget).parent(),
        $this_ = this.$header.find('th').eq($this.index());
    this.$header.add(this.$header_).find('span.order').remove();
    if (this.options.sortName === $this.data('field')) {
      this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.options.sortName = $this.data('field');
      this.options.sortOrder = 'asc';
    }
    this.f_Trigger('sort', this.options.sortName, this.options.sortOrder);
    $this.add($this_).data('order', this.options.sortOrder);
    this.f_UpdateCaret();
    this.options.pageNumber = 1;
    this.f_InitServer(this.options.silentSort);
  };

  MdlTable.prototype.f_OnError = function (a_Error) {
    this.f_Trigger('error', a_Error);
    if (this.options.errorEnabled) {
      if (this.options.errorAction !== undefined) {
        Cl_Core.f_CalculateObjectValue(null, this.options.errorAction, [this, a_Error], '');
      } else {
        if (a_Error.msg !== undefined) {
          alert(a_Error.msg);
        } else if (a_Error.errmsg !== undefined) {
          alert(a_Error.errmsg);
        } else alert(a_Error);
      }
    }
  };

  MdlTable.prototype.f_GetVisible = function (a_Column) {
    return !a_Column.hidden && a_Column.visible && !a_Column.addOnly && !a_Column.editOnly && a_Column.type !== "hidden";
  };

  MdlTable.prototype.f_GetCardEnabled = function (a_Column) {
    return a_Column.cardEnabled && !a_Column.addOnly && !a_Column.editOnly;
  };

  MdlTable.prototype.f_GetSwitchable = function (a_Column) {
    return a_Column.switchable && a_Column.type !== 'hidden' && !a_Column.addOnly && !a_Column.editOnly;
  };

  MdlTable.prototype.f_InitToolbar = function () {
    var that = this,
        html = [],
        timeoutId = 0,
        $keepOpen,
        switchableCount = 0;

    this.$toolbarButtons.html('');

    if (typeof this.options.icons === 'string') {
      this.options.icons = Cl_Core.f_CalculateObjectValue(null, this.options.icons);
    }
    if (that.options.showAdd) {
      html.push(this.f_GetBtnAdd());
    }
    if (this.options.showRemoveSelected) {
      html.push(this.f_GetBtnRemoveSelected());
    } else if (this.options.showActionSelected) {
      html.push(this.f_GetBtnActionSelected());
    }
    if (this.options.showRefresh) {
      html.push(this.f_GetBtnRefresh());
    }
    if (this.f_GetShowingColumns()) {
      html.push(Cl_Core.f_Sprintf('<div title="%s" class="columns">', this.options.formatColumns()), Cl_Core.f_Sprintf('<button id="%s_bcolumns" type="button" class="mdl-button mdl-js-button mdl-button--icon" title="%s">', this.m_ID, this.options.formatColumns()), Cl_Core.f_Sprintf('<i class="material-icons">%s</i>', that.options.icons.columns), '</button>', Cl_Core.f_Sprintf('<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="%s_bcolumns">', this.m_ID));

      $.each(this.columns, function (i, column) {
        if (that.f_GetSwitchable(column) && column.type !== "button") {
          var checked = that.f_GetVisible(column) ? ' checked="checked"' : '';
          var textCol = column.title;
          if (column.title.indexOf(",") > 0) textCol = textCol.substring(0, textCol.indexOf(","));
          html.push(Cl_Core.f_Sprintf('<li class="mdl-menu__item">' + '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="%s_chbx%s"><input type="checkbox" id="%s_chbx%s" class="mdl-checkbox__input" data-field="%s" value="%s"%s/><span class="mdl-checkbox__label">%s</span></label>' + '</li>', that.m_ID, i, that.m_ID, i, column.field, i, checked, textCol));
          switchableCount++;
        }
      });
      html.push('</ul>', '</div>');
    }

    if (this.options.toolbarExtraButtons != null && this.options.toolbarExtraButtons !== '') {
      $.each(this.options.toolbarExtraButtons, function (i, btn) {
        html.push('<div class="btnUser">' + btn + '</div>');
      });
    }

    if (this.options.showToolbar || html.length > 0) {
      this.$toolbarButtons.append(html.join(''));
      this.$toolbar.removeClass('hidden');
    } else {
      this.$toolbar.addClass('hidden');
    }

    if (this.options.showRefresh) {
      this.$toolbarBRefresh = this.$toolbarButtons.find('button[name="bRefresh"]');
      this.$toolbarBRefresh.off('click').on('click', $.proxy(this.f_Refresh, this));
    }
    if (this.options.showAdd) {
      this.$toolbarBAdd = this.$toolbarButtons.find('button[name="bAdd"]');
      this.$toolbarBAdd.off('click').on('click', $.proxy(this.f_Add, this));
    }
    if (this.options.showRemoveSelected) {
      this.$toolbarBActionSelected = this.$toolbarButtons.find('button[name="bRemoveSelected"]');
      this.$toolbarBActionSelected.off('click').on('click', $.proxy(this.f_RemoveSelected, this));
    }if (this.options.showActionSelected) {
      this.$toolbarBActionSelected = this.$toolbarButtons.find('button[name="bActionSelected"]');
      this.$toolbarBActionSelected.off('click').on('click', $.proxy(this.f_ActionSelected, this));
    }
    if (this.f_GetShowingColumns()) {
      if (switchableCount <= this.options.minimumCountColumns) {
        this.el_ToolbarButtons.querySelector('input').disabled = true;
        //this.$toolbarButtons.find('input').prop('disabled', true);
      }

      var f_OnChangeListCollumns = function f_OnChangeListCollumns() {
        setTimeout((function () {
          var input = this;
          that.f_ToggleColumn(that.f_GetFieldIndex(that.columns, input.getAttribute('data-field')), input.checked, false);
          that.f_Trigger('column-switch', input.getAttribute('data-field'), input.checked);
        }).bind(this), 500);
      };
      var f_OnClickMICollumns = function f_OnClickMICollumns() {
        if (event.srcElement.classList.contains('mdl-menu__item')) {
          var input = this.querySelector('input');
          input.checked = !input.checked;
          var e = document.createEvent("Event");
          e.initEvent("change", true, true);
          input.dispatchEvent(e);
        }
      };
      var items = this.el_ToolbarButtons.querySelectorAll('li.mdl-menu__item');
      [].forEach.call(items, function (li) {
        li.removeEventListener('click', f_OnClickMICollumns);
        li.addEventListener('click', f_OnClickMICollumns);
      });
      items = this.el_ToolbarButtons.querySelectorAll('li.mdl-menu__item input');
      [].forEach.call(items, function (li) {
        li.removeEventListener('change', f_OnChangeListCollumns);
        li.addEventListener('change', f_OnChangeListCollumns);
      });

      componentHandler.upgradeElement(this.$toolbarButtons.find('.mdl-menu')[0], "MaterialMenu");
      componentHandler.upgradeDom(this.$toolbar[0], "MaterialCheckbox");
    }
  };

  MdlTable.prototype.f_InitButtonsFromContent = function (a_Content$) {
    if (a_Content$ != null) {
      a_Content$.find('[name="bReview"]').off('click').on('click', $.proxy(this.f_Review, this));
      a_Content$.find('[name="bAdd"]').off('click').on('click', $.proxy(this.f_Add, this));
      a_Content$.find('[name="bClone"]').off('click').on('click', $.proxy(this.f_Clone, this));
      a_Content$.find('[name="bEdit"]').off('click').on('click', $.proxy(this.f_Edit, this));
      a_Content$.find('[name="bRemove"]').off('click').on('click', $.proxy(this.f_Remove, this));
      a_Content$.find('[name="bSubDetail"]').off('click').on('click', $.proxy(this.f_SubDetail, this));
      a_Content$.find('[name="bDetail"]').off('click').on('click', $.proxy(this.f_Detail, this));
      a_Content$.find('[name="bRefresh"]').off('click').on('click', $.proxy(this.f_Refresh, this));
    }
  };
  MdlTable.prototype.f_InitToolbarRows = function () {
    this.f_InitButtonsFromContent(this.$body);
  };
  MdlTable.prototype.f_InitRowsColors = function (a_Row$) {
    if (this.options.rowColors != null) {
      var that = this;
      var prmCss = 'color';
      if (that.m_CardView) {
        prmCss = 'border-left-color';
      } else if (this.options.rowColorsStyle === 'background') {
        prmCss = 'background-color';
      }
      var rows$;
      var i = 0;
      if (a_Row$ != null && a_Row$.hasClass('mdl-table_row')) {
        rows$ = a_Row$;
        i = a_Row$.attr('data-index');
      } else {
        rows$ = this.$body.find('> tr.mdl-table_row');
      }
      if (this.options.rowColorsType === 'var') {
        var colorField = this.options.rowColors;
        rows$.each(function () {
          var elRow$ = $(this);
          var elRowContent$;
          if (that.m_CardView) {
            elRowContent$ = $(this.children[0]);
          } else {
            elRowContent$ = elRow$;
          }
          var val = Cl_Core.f_GetPropByString(that.f_GetRowDataFromIndex(i), colorField);
          if (val !== undefined && val !== '') {
            var intToARGB = function intToARGB(i) {
              var hex = (i >> 24 & 0xFF).toString(16) + (i >> 16 & 0xFF).toString(16) + (i >> 8 & 0xFF).toString(16) + (i & 0xFF).toString(16);
              hex += '000000';
              return hex.substring(0, 6);
            };

            var krat = 10;

            val = parseInt(parseInt(val) / krat);
            if (val > 0) {
              val = 255 / val * 100000;
            }
            var valColor = '#' + intToARGB(val);
            elRowContent$.css(prmCss, valColor);
            elRow$.addClass('mdl-table_row_color');
            if (that.m_CardView) {
              $('.mdl-table-card_color', elRowContent$).css('color', valColor);
            }
          }
          i++;
        });
      } else if (this.options.rowColorsType === 'json') {
        var colors = JSON.parse(this.options.rowColors.replace(/'/g, '"'));
        rows$.each(function () {
          var isEdited = false;
          for (var prField in colors) {
            var val = Cl_Core.f_GetPropByString(that.f_GetRowDataFromIndex(i), prField);
            var elRow$ = $(this);
            var elRowContent$;
            if (that.m_CardView) {
              elRowContent$ = $(this.children[0]);
            } else {
              elRowContent$ = elRow$;
            }

            for (var prColorField in colors[prField]) {
              var prColorFields = prColorField.split(',');
              if (prColorFields.indexOf(val) > -1) {
                val = prColorField;
                break;
              }
            }

            if (colors[prField][val] != null) {
              var colorValue = colors[prField][val];
              if (that.m_CardView) {
                colorValue = colorValue.replace('0.', '1.');
              }
              elRowContent$.css(prmCss, colorValue);
              elRow$.addClass('mdl-table_row_color');
              isEdited = true;
              if (that.m_CardView) {
                $('.mdl-table-card_color', elRowContent$).css('color', colorValue);
              }
            } else if (!isEdited) {
              elRowContent$.css(prmCss, '');
              elRow$.removeClass('mdl-table_row_color');
              if (that.m_CardView) {
                $('.mdl-table-card_color', elRowContent$).css('color', '');
              }
            }
          }
          i++;
        });
      }
    }
  };
  MdlTable.prototype.f_InitButtonsRows = function (a_Content$, a_IndexRow, a_RowData) {
    var that = this;
    var content$ = a_Content$;
    if (content$ == null) content$ = this.$body;
    content$.find('[name="bAction"]').off('click').on('click', function () {
      var btn$ = $(this);
      var index = a_IndexRow;
      var rowData = a_RowData;
      if (index == null) {
        index = btn$.closest('tr.mdl-table_row').attr('data-index');
      }
      if (rowData == null) rowData = that.f_GetRowDataFromIndex(index);
      var rowAction = btn$.attr('data-action');
      if (rowAction != null && rowAction !== "") {
        Cl_Core.f_CalculateObjectValue(null, rowAction, [that, index, rowData], '');
      }
    });
    this.f_InitButtonsFromContent(content$);
  };

  MdlTable.prototype.onPageListChange = function (event) {
    var $this = $(event.currentTarget);

    $this.parent().addClass('active').siblings().removeClass('active');
    //this.options.pageSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ?
    //		this.options.formatAllRows() : +$this.text();
    //this.$toolbarButtons.find('.page-size').text(this.options.pageSize);
  };

  MdlTable.prototype.onPageFirst = function (event) {
    this.options.pageNumber = 1;
  };

  MdlTable.prototype.onPagePre = function (event) {
    this.options.pageNumber--;
  };

  MdlTable.prototype.onPageNext = function (event) {
    this.options.pageNumber++;
  };

  MdlTable.prototype.onPageLast = function (event) {
    this.options.pageNumber = this.totalPages;
  };

  MdlTable.prototype.onPageNumber = function (event) {
    if (this.options.pageNumber === +$(event.currentTarget).text()) {
      return;
    }
    this.options.pageNumber = +$(event.currentTarget).text();
  };

  MdlTable.prototype.f_InitChecked = function (a_Content$) {
    if (this.f_GetChecked()) {
      var that = this;
      var ctrl_SelectItems = [];
      var content$ = a_Content$;
      if (content$ == null) content$ = this.$body;
      content$.find(Cl_Core.f_Sprintf('input[name="%s"]', this.options.selectItemName)).each(function () {
        componentHandler.upgradeElement(this.parentNode, "MaterialCheckbox");
        ctrl_SelectItems.push(this.parentNode.MaterialCheckbox);
      }).off('change').on('change', function (e) {
        e.stopImmediatePropagation();
        var $input = $(this),
            index = $input.data('index'),
            row = that.data[index];
        row[that.header.stateField] = this.checked;
        if (that.options.singleSelect) {
          that.$selectItem.not(this).each(function () {
            row[that.header.stateField] = false;
          });
          that.$selectItem.filter(':checked').not(this).prop('checked', false);
        }
        that.f_UpdateSelected();
        that.f_Trigger('check-change', row, $input);
        that.f_Trigger(this.checked ? 'check' : 'uncheck', row, $input);
      });
      if (a_Content$ == null) that.ctrl_SelectItems = ctrl_SelectItems;else that.ctrl_SelectItems.push(ctrl_SelectItems);
      this.$selectItem = this.$body.find(Cl_Core.f_Sprintf('[name="%s"]', this.options.selectItemName));
    }
  };

  MdlTable.prototype.f_InitSelectColumns = function (a_Row$) {
    var that = this;
    var cols$ = null;
    var textPnlCard = '';
    if (this.m_CardView) {
      textPnlCard = '.mdl-table_row_panelCard';
    }
    if (a_Row$ == null) cols$ = this.$body.find('> tr[data-index] > td' + textPnlCard);else cols$ = a_Row$.find('> td' + textPnlCard);
    cols$.off('click dblclick').on('click dblclick', function (e) {
      var $td = $(this);
      var $tr = $td.parent(),
          indexRow = $tr.data('index'),
          item = that.data[indexRow],
          indexColumn = $td[0].cellIndex,
          field = that.header.fields[(that.options.detailSub || that.options.detailView || that.f_GetChecked() || that.options.numbering) && !that.m_CardView ? indexColumn - 1 : indexColumn],
          column = that.f_GetColumn(field),
          value = Cl_Core.f_GetItemField(item, field);

      if ($td.find('.detail-icon').length) {
        return;
      }
      if (that.m_CardView && that.options.cardReviewAuto && $(e.target).parents('[name="bAction"]').length === 0) that.f_Open(e);

      that.f_Trigger(e.type === 'click' ? 'click-cell' : 'dbl-click-cell', that, field, value, indexRow, item, $td);
      that.f_Trigger(e.type === 'click' ? 'click-row' : 'dbl-click-row', that, indexRow, item, $tr);

      // if click to select - then f_Trigger the checkbox/radio click
      if (e.type === 'click' && that.options.clickToSelect && column.clickToSelect) {
        var $selectItem = $tr.find(Cl_Core.f_Sprintf('[name="%s"]', that.options.selectItemName));
        if ($selectItem.length) {
          $selectItem[0].click(); // #144: .f_Trigger('click') bug
        }
      }
    });
  };

  MdlTable.prototype.f_InitDetail = function (a_ElRow$) {
    var that = this;
    var data = this.f_GetData();
    var els$;
    if (a_ElRow$ == null) {
      els$ = this.$body.find('> tr[data-index] > td > .detail-icon');
    } else {
      els$ = a_ElRow$.find('> td >.detail-icon');
    }
    els$.off('click').on('click', function () {
      var $this = $(this),
          $tr = $this.parent().parent(),
          index = $tr.data('index'),
          row = data[index]; // Fix #980 Detail view, when searching, returns wrong row
      $this.find('i').parents('td').attr('class', 'detail');
      // remove and update
      var i$ = null;
      if ($tr.next().is('tr.detail-view')) {
        i$ = $this.find('i');
        if (i$.attr('class') === 'material-icons ' + that.options.icons.detailOpen) {
          i$.attr('class', 'material-icons ' + that.options.icons.detailClose);
          $tr.next().css('display', 'table-row');
          that.f_Trigger('collapse-row', index, row);
        } else {
          i$.attr('class', 'material-icons ' + that.options.icons.detailOpen);
          $tr.next().css('display', 'none');
          that.f_Trigger('expand-row', index, row, $tr.next().find('td'));
        }
      } else if ($tr.is('tr.detail-sub')) {
        i$ = $this.find('i');
        var trSubIndex = $tr.attr('data-index');
        var trSub$ = $tr.next();
        var iSub = 0;
        if (i$.attr('class') === 'material-icons ' + that.options.icons.detailOpen) {
          i$.attr('class', 'material-icons ' + that.options.icons.detailClose);
          while (trSub$.attr('data-index') === trSubIndex + "_" + iSub) {
            trSub$.css('display', 'table-row');
            trSub$ = trSub$.next();
            iSub++;
          }
          that.f_Trigger('collapse-row', index, row);
        } else {
          i$.attr('class', 'material-icons ' + that.options.icons.detailOpen);
          while (trSub$.attr('data-index') === trSubIndex + "_" + iSub) {
            trSub$.css('display', 'none');
            trSub$ = trSub$.next();
            iSub++;
          }
          that.f_Trigger('expand-row', index, row, $tr.next().find('td'));
        }
      } else {
        var textBtns = '';
        if (that.options.detailShowOk && that.options.detailShowCancel) {
          textBtns = ['<div class="btns">', Cl_Core.f_Sprintf('<div class="btn"><button class="mdl-button mdl-js-button mdl-button--primary" type="button" name="bEdit">%s</button></div>', that.options.formatEdit()), '</div>'].join('');
        }
        $this.find('i').attr('class', 'material-icons ' + that.options.icons.detailClose);

        if (that.options.detailSub && row.p_SubData != null && row.p_SubData.length > 0) {
          for (var i = row.p_SubData.length - 1; i >= 0; i--) {
            var trNew$ = $(that.f_GetRowHtmlText(index, null, row.p_SubData, i));
            trNew$.addClass("detail-subItem");
            $tr.after(trNew$);
            $tr.addClass("detail-sub");
            that.f_InitButtonsRows(trNew$);
            that.f_InitRowsColors(trNew$);
          }
        } else {
          $tr.after(Cl_Core.f_Sprintf('<tr class="detail-view"><td colspan="%s">%s%s</td></tr>', $tr.find('td').length, Cl_Core.f_CalculateObjectValue(that.options, that.options.detailFormatter, [index, row], ''), textBtns));
          var $detailView = $tr.next();
          $detailView.find('button[name="bEdit"]').off('click').on('click', function () {
            if (f_Mdl_Dailog_Valid($detailView)) {
              Cl_Core.f_CalculateObjectValue(that.options, that.options.detailOkFunction, [index, row, $detailView], null);
            }
          });
        }

        that.f_Trigger('load-detail-view', index, row, $tr.next().find('td'));
      }
      that.f_ResetView();
    });
  };

  MdlTable.prototype.f_InitBody = function (fixedScroll) {
    var that = this,
        html = [],
        data = this.f_GetData();

    this.f_Trigger('pre-body', data);
    this.$body = this.$el.find('>tbody');
    if (!this.$body.length) {
      this.$body = $('<tbody></tbody>').appendTo(this.$el);
    }
    this.$tableFooter = this.$el.find('>tfoot');
    if (this.options.showFooter && !this.$tableFooter.length) {
      this.$tableFooter = $('<tfoot class="footerRow"></tfoot>').appendTo(this.$el);
    }
    this.el_TableBody = this.$body[0];
    this.pageFrom = 1;
    this.pageTo = data.length;
    for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
      html.push(this.f_GetRowHtmlText(i));
    }
    if (this.data == null || this.data.length === 0) {
      var emptyText = this.options.formatNoMatches();
      html.push('<tr class="no-records-found">', Cl_Core.f_Sprintf('<td colspan="%s">%s</td>', this.$header.find('th').length, emptyText), '</tr>');
    }
    this.$body.html(html.join(''));
    this.f_InitToolbarRows();
    this.f_InitButtonsRows();
    if (this.m_CardView && that.options.cardTemplate != null) {
      $('div.mdl-table_row_panelCard', html).each(function () {
        that.f_Trigger('reset-item-cards', that, $(this), data[$(this).parents('tr').attr('data-index')]);
      });
      this.f_Trigger('reset-cards', this);
    }
    if (!fixedScroll) {
      this.f_ScrollTo(0);
    }
    this.f_InitSelectColumns();
    this.f_InitDetail();
    this.f_InitChecked();
    this.f_InitRowsColors();
    $.each(this.header.events, function (i, events) {
      if (!events) {
        return;
      }
      // fix bug, if events is defined with namespace
      if (typeof events === 'string') {
        events = Cl_Core.f_CalculateObjectValue(null, events);
      }

      var field = that.header.fields[i],
          fieldIndex = $.inArray(field, that.getVisibleFields());

      if ((that.options.detailSub || that.options.detailView) && !that.m_CardView) {
        fieldIndex += 1;
      }

      for (var key in events) {
        that.$body.find('>tr:not(.no-records-found)').each(function () {
          var $tr = $(this),
              $td = $tr.find(that.m_CardView ? '.card-view' : 'td').eq(fieldIndex),
              index = key.indexOf(' '),
              name = key.substring(0, index),
              el = key.substring(index + 1),
              func = events[key];

          $td.find(el).off(name).on(name, function (e) {
            var index = $tr.data('index'),
                row = that.data[index],
                value = row[field];

            func.apply(this, [e, value, row, index]);
          });
        });
      }
    });

    this.f_UpdateSelected();
    this.f_ResetView();
    this.f_ResetTotals();

    this.f_Trigger('post-body');
  };

  MdlTable.prototype.f_InitServer = function (silent, query, callback) {
    var that = this,
        data = {},
        params = {
      pageSize: this.options.pageSize === this.options.formatAllRows() ? this.options.totalRows : this.options.pageSize,
      pageNumber: this.options.pageNumber,
      sortName: this.options.sortName,
      sortOrder: this.options.sortOrder
    },
        request;

    if (!this.options.url && !this.options.ajax) {
      return;
    }
    if (this.options.queryParamsType === 'limit') {
      params = {
        sort: params.sortName,
        order: params.sortOrder
      };
      params.limit = this.options.pageSize === this.options.formatAllRows() ? this.options.totalRows : this.options.pageSize;
      params.offset = this.options.pageSize === this.options.formatAllRows() ? 0 : this.options.pageSize * (this.options.pageNumber - 1);
    }
    if (!$.isEmptyObject(this.filterColumnsPartial)) {
      params['filter'] = JSON.stringify(this.filterColumnsPartial, null);
    }
    data = Cl_Core.f_CalculateObjectValue(this.options, this.options.queryParams, [params], data);
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
    request = $.extend({}, Cl_Core.f_CalculateObjectValue(null, this.options.ajaxOptions), {
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
          res = Cl_Core.f_CalculateObjectValue(that.options, that.options.responseHandler, [res], res);
          that.f_Load(res);
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
      Cl_Core.f_CalculateObjectValue(this, this.options.ajax, [request], null);
    } else {
      $.ajax(request);
    }
  };

  /*Изменение каретки сортировки*/
  MdlTable.prototype.f_UpdateCaret = function () {
    var that = this;
    $.each(this.$header.find('th'), function (i, th) {
      $(th).find('.sortable').removeClass('desc asc').addClass($(th).data('field') === that.options.sortName ? that.options.sortOrder : 'both');
    });
  };
  /*Обновление выделений строк*/
  MdlTable.prototype.f_UpdateSelected = function () {
    if (this.f_GetChecked()) {
      var checkingCount = this.$selectItem.filter(':enabled').filter(':checked').length;
      if (this.f_GetChecked() && !this.options.singleSelect) {
        var checkAll = this.$selectItem.filter(':enabled').length && this.$selectItem.filter(':enabled').length === checkingCount;
        if (checkAll) {
          this.ctrl_SelectAll.check();
        } else {
          this.ctrl_SelectAll.uncheck();
        }
      }
      this.$selectItem.each(function () {
        $(this).closest('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
        if ($(this).prop('checked')) {
          $(this).parent()[0].MaterialCheckbox.check();
        } else {
          $(this).parent()[0].MaterialCheckbox.uncheck();
        }
      });
      if (checkingCount > 0) {
        this.$toolbarSelectTitle.html(this.options.formatSelectRows() + ": " + checkingCount);
        if (this.options.showActionSelected || this.options.showRemoveSelected) {
          this.$toolbarBActionSelected.prop('disabled', false);
        }
      } else {
        this.$toolbarSelectTitle.html("");
        if (this.options.showActionSelected || this.options.showRemoveSelected) {
          this.$toolbarBActionSelected.prop('disabled', true);
        }
      }
      if (this.f_GetTotals() && this.options.totalIsChecked) {
        if (this.f_GetTotals() && this.f_GetChecked() && this.options.totalIsChecked) {
          this.f_ResetTotals();
        }
      }
    }
  };

  MdlTable.prototype.updateRows = function () {
    var that = this;
    this.$selectItem.each(function () {
      that.data[$(this).data('index')][that.header.stateField] = $(this).prop('checked');
    });
  };

  MdlTable.prototype.resetRows = function () {
    var that = this;
    $.each(this.data, function (i, row) {
      that.ctrl_SelectAll.uncheck();
      that.$selectItem.prop('checked', false);
      if (that.header.stateField) {
        row[that.header.stateField] = false;
      }
    });
  };

  MdlTable.prototype.f_ResetTotals = function () {
    if (this.f_GetTotals()) {
      if (this.options.methodTotals !== undefined) {
        Cl_Core.f_CalculateObjectValue(null, that.options.methodTotals, [that, this.dataTotals], '');
      } else {
        var isChecked = false;
        var rowsSelected = undefined;
        if (this.f_GetTotals() && this.f_GetChecked() && this.options.totalIsChecked) {
          isChecked = true;
          rowsSelected = this.f_GetSelections();
        }
        if (this.dataTotals !== undefined || isChecked) {
          var els = this.el_TableHeaderTotals.querySelectorAll('.totalSumVal');
          for (var i = 0; i < els.length; i++) {
            var field = els[i].getAttribute('data-field');
            if (field !== undefined && field !== null && field !== '') {
              var val = undefined;
              if (isChecked && rowsSelected !== undefined) {
                val = 0;
                for (var y = 0; y < rowsSelected.length; y++) {
                  var fldVal = parseFloat(this.f_GetValue(0, field, false, false, null, rowsSelected[y]).toString().replace(' ', ''));
                  if (fldVal !== undefined && fldVal !== rowsSelected[y]) {
                    val += fldVal;
                  }
                }
              } else if (this.dataTotals !== undefined) {
                val = this.dataTotals[field];
              }
              if (val !== undefined) {
                var column = this.f_GetColumnByField(field);
                if (column !== undefined) {
                  val = this.f_GetValueByType(column.type, val, true);
                }
                els[i].innerHTML = val;
              }
            }
          }
        }
      }
    }
  };

  MdlTable.prototype.f_ResetFooter = function () {
    if (!this.options.showFooter) {
      return;
    }
    var that = this,
        data = that.f_GetData(),
        textHtml = '';

    var isFixed = false;

    if (Cl_Core.f_IsElementInView(this.$el, true)) {
      this.$tableFooter.removeClass('fixed');
    } else {
      this.$tableFooter.addClass('fixed');
      isFixed = true;
    }

    if (this.options.footerFormatter != null) {
      textHtml = Cl_Core.f_Sprintf('<td colspan="%s">%s</td>', 255, Cl_Core.f_CalculateObjectValue(null, this.options.footerFormatter, [that, data], ''));
    } else if (!this.m_CardView) {
      var html = [];
      var firstRow$ = $('tr', this.$body);
      if (firstRow$.length > 0) {
        $('td', firstRow$[0]).each(function () {
          html.push('<td style="', isFixed ? 'width:' + this.offsetWidth + 'px;' : '', this.hidden || this.offsetWidth === 0 ? 'display: none;' : '', '">&nbsp;</td > ');
        });
      }

      //if (this.options.detailSub || this.options.detailView) {
      //  html.push('<td>&nbsp;</td>');
      //}
      //if (this.f_GetChecked()) {
      //  html.push('<td>&nbsp;</td>');
      //}
      //$.each(this.columns, function (i, column) {
      //  var falign = '',
      //    style = '',
      //    class_ = Cl_Core.f_Sprintf(' class="%s"', column['class']);
      //  if (!that.f_GetVisible(column)) {
      //    return;
      //  }
      //  if (column.type === "button") {
      //    return;
      //  }
      //  falign = Cl_Core.f_Sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
      //  style = Cl_Core.f_Sprintf('vertical-align: %s; ', column.valign);
      //  html.push('<td', class_, Cl_Core.f_Sprintf(' style="%s"', falign + style), '>');
      //  html.push('<div class="th-inner">');
      //  html.push(Cl_Core.f_CalculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');
      //  html.push('</div>');
      //  html.push('<div class="fht-cell"></div>');
      //  html.push('</div>');
      //  html.push('</td>');
      //});
      //if (that.f_IsVisibleButtons()) {
      //  html.push('<td class="btns btnsRow">');
      //}

      textHtml = html.join('');
    }
    this.$tableFooter.html(textHtml);
    clearTimeout(this.timeoutFooter_);
  };

  MdlTable.prototype.getVisibleFields = function () {
    var that = this,
        visibleFields = [];
    $.each(this.header.fields, function (j, field) {
      var column = that.f_GetColumn(field);
      if (!that.f_GetVisible(column)) {
        return;
      }
      visibleFields.push(field);
    });
    return visibleFields;
  };

  // PUBLIC FUNCTION DEFINITION
  // ==========================
  MdlTable.prototype.f_ResetView = function (params) {
    var padding = 0;
    if (this.f_GetChecked() && !this.options.singleSelect) {
      if (this.$selectItem.length > 0 && this.$selectItem.length === this.$selectItem.filter(':checked').length) this.ctrl_SelectAll.check();else this.ctrl_SelectAll.uncheck();
    }
    if (this.options.showFooter) {
      this.f_ResetFooter();
    }
    if (this.m_CardView) {
      this.$el.css('margin-top', '0');
      return;
    }
    this.f_UpdateCaret();
    this.f_Trigger('reset-view');
  };

  MdlTable.prototype.f_GetData = function (useCurrentPage) {
    return !$.isEmptyObject(this.filterColumns) || !$.isEmptyObject(this.filterColumnsPartial) ? useCurrentPage ? this.data.slice(this.pageFrom - 1, this.pageTo) : this.data : useCurrentPage ? this.options.data.slice(this.pageFrom - 1, this.pageTo) : this.options.data;
  };

  MdlTable.prototype.f_Load = function (a_Data) {
    var fixedScroll = false;
    this.options.totalRows = a_Data.total;
    fixedScroll = a_Data.fixedScroll;
    this.f_InitDataTotals(a_Data[this.options.dataTotalsField]);
    this.f_InitData(a_Data[this.options.dataField]);

    //this.f_InitCardView(fixedScroll);
    this.f_InitBody(fixedScroll);

    this.f_UpdateDialogActionContent();
    this.m_IsLoaded = true;
  };

  MdlTable.prototype.f_GetDialogActionContent = function (a_ActionName, a_RowIndex, a_ReadOnly, a_Row) {
    var that = this;
    var row = a_Row;

    var keyText = "";
    if (row == null && a_RowIndex != null) {
      row = this.f_GetRowDataFromIndex(a_RowIndex);
    }
    if (row != null) {
      keyText = ' data-key="' + row[this.options.key] + '"';
    }
    if (a_ReadOnly == null) a_ReadOnly = false;

    var dlgtext = Cl_Core.f_Sprintf('<div class="mdl-table mdl-table-dialog__content mdl-dialog__form"%s>', keyText);
    $.each(this.columns, function (i, column) {
      var validEditVisible = true;
      if (!a_ReadOnly && column.editingMethod !== undefined) {
        var editingMethod = column.editingMethod;
        validEditVisible = Cl_Core.f_CalculateObjectValue(null, column.editingMethod, [that, row], '');
      }
      if (column.dialogVisibleAlways || validEditVisible && column.dialogVisible && (!column.readOnly || a_ReadOnly) && (!column.addOnly || a_RowIndex == null) && (!column.editOnly || !a_ReadOnly) && column.type !== "button" && (!column.hidden || a_ReadOnly)) {
        if (column.editDialogContent !== undefined) {
          dlgtext += '<div id="elDlgColumn_' + column.field + '"></div>';
        } else {
          var valid = "";
          if (column.valRequired || column.type === "int" || column.type === "uint" || column.type === "money") {
            valid = " required";
          }
          if (column.valRegexPattern != null) {
            valid += ' pattern="' + column.valRegexPattern + '"';
            if (column.valRegexMsg != null) valid += ' patternmsg="' + column.valRegexMsg + '"';
          } else if (column.type === "int") {
            valid += ' pattern="-?[0-9]*(\.[0-9]+)?"';
          } else if (column.type === "uint") {
            valid += ' pattern="^\\d+$" min="0"';
          } else if (column.type === "money") {
            valid += ' pattern="^\\d+(,\\d{1,2})?$" min="0"';
          }
          if (column.min != null || column.max != null) {
            if (column.min != null) valid += ' minlength="' + column.min + '"';
            if (column.max != null) valid += ' maxlength="' + column.max + '"';
          }
          var mask = "";
          var maskTmp = that.f_GetFormatMask(column);
          mask = maskTmp !== "" ? ' data-mask="' + maskTmp + '" data-mask-clearifnotmatch="true"' : "";
          var readOnly = false;
          var readOnlyText = "";
          var fldAttr = "";
          var fldKeyAttr = "";
          if (column.readOnly || !that.options.showClone && !that.options.showEdit && that.options.editable && that.m_CardView && !column.editable || a_ReadOnly) {
            readOnly = true;
            if (column.type === "bool") readOnlyText = ' disabled';else readOnlyText = ' disabled';
          } else {
            readOnly = false;
            fldAttr = ' field="' + column.field + '"';
            if (column.selectData !== undefined && column.selectData !== null && column.selectField !== undefined) {
              fldKeyAttr = ' fieldKey="' + column.selectField + '"';
            }
          }
          var value = '';
          value = that.f_GetValue(a_RowIndex, column.field, readOnly, true, null, row);
          if (column.type === "money") {
            value = value.replace(/\s/g, '');
          }
          var id = Cl_Core.f_Sprintf('dlg%s_%s_IField%s_%s', a_ActionName, that.m_ID, a_RowIndex != null ? a_RowIndex : "-1", column.field);

          if (column.type === "hidden") {
            dlgtext += Cl_Core.f_Sprintf('<input type="hidden"%s id="%s" value="%s" />', fldAttr, id, value);
          } else if (column.type === "bool") {
            dlgtext += [Cl_Core.f_Sprintf('<div class="field cbx%s">', column.cardColspan != null ? ' width' + column.cardColspan : column.cardWidthfull ? ' full' : ''), Cl_Core.f_Sprintf('<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="%s">', id), Cl_Core.f_Sprintf('<input%s type="checkbox" id="%s" class="mdl-checkbox__input"%s%s />', fldAttr, id, value ? ' checked="checked"' : '', readOnlyText), Cl_Core.f_Sprintf('<span class="mdl-checkbox__label">%s</span>', Cl_Core.f_GetPropertyFromOther(that.columns, 'field', 'title', column.field)), '</label></div>'].join('');
          } else if ((column.type === "date" || column.type === "datetime") && !column.readOnly && !a_ReadOnly) {
            dlgtext += [Cl_Core.f_Sprintf('<div class="field date%s">', column.cardColspan != null ? ' width' + column.cardColspan : column.cardWidthfull ? ' full' : ''), Cl_Core.f_Sprintf('<div class="mdl-datefield mdl-js-datefield mdl-datefield--floating-label"><input%s data-time="%s" id="%s" class="%s mdl-datefield__input" value="%s"%s></input>', fldAttr, column.type === "datetime" ? "true" : "false", id, column.field, value, valid), Cl_Core.f_Sprintf('<label class="mdl-datefield__label" for="%s">%s</label>', id, Cl_Core.f_GetPropertyFromOther(that.columns, 'field', 'title', column.field)), '</div></div>'].join('');
          } else if (column.type === "select") {
            if (column.selectData !== undefined) {
              var itemsText = "";
              [].forEach.call(column.selectData, function (item, index) {
                var itemKey = '',
                    itemVal = '';
                if (column.selectDataType === 'enum') {
                  itemKey = index;
                  itemVal = item;
                } else {
                  itemKey = item[column.selectKey];
                  itemVal = item[column.selectValue];
                }
                itemsText += '<li class="mdl-menu__item" key="' + itemKey + '" value="' + itemVal + '">' + itemVal + '</li>';
              });
              dlgtext += [Cl_Core.f_Sprintf('<div class="field date%s">', column.colspan != null ? ' width' + column.colspan : column.cardWidthfull ? ' full' : ''), Cl_Core.f_Sprintf('<div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label"%s%s>', readOnlyText, column.selectReadOnly ? ' data-read-only="true"' : ''), Cl_Core.f_Sprintf('<input%s%s id="%s" type="text" class="mdl-selectfield__input"%s%s />', fldAttr, fldKeyAttr, id, row !== undefined ? ' key="' + Cl_Core.f_GetItemField(row, column.selectField) + '"' : '', valid), Cl_Core.f_Sprintf('<label class="mdl-selectfield__label" for="%s">%s</label>', id, Cl_Core.f_GetPropertyFromOther(that.columns, 'field', 'title', column.field)), Cl_Core.f_Sprintf('<ul for="%s">', id), itemsText, '</ul>', '</div></div>'].join('');
            }
          } else if (column.type === "color") {
            if (value === "-") {
              value = 'ffffff';
            }
            dlgtext += Cl_Core.f_Sprintf('<input%s value="%s" class="jscolor {refine:false}"/><span>%s</span>', fldAttr, value, Cl_Core.f_GetPropertyFromOther(that.columns, 'field', 'title', column.field));
          } else if (readOnly && (column.fieldLink !== undefined && column.fieldLink !== null && column.fieldLink !== "" || column.fieldLinkUrl !== undefined && column.fieldLinkUrl !== null && column.fieldLinkUrl !== "")) {
            var linkValue = column.fieldLink != null && column.fieldLink !== "" ? row[column.fieldLink] : that.f_GetTextFromTemplatyText(a_RowIndex, row, column.fieldLinkUrl);
            var textVal = '';
            if (linkValue !== "") {
              textVal = '<a target="_blank" href="' + linkValue + '">' + value + '</a>';
            } else {
              textVal = value;
            }
            dlgtext += [Cl_Core.f_Sprintf('<div class="field%s">', column.cardColspan != null ? ' width' + column.cardColspan : column.cardWidthfull ? ' full' : ''), '<div class="' + a_ActionName + ' mdl-textfield mdl-textfield--floating-label is-dirty is-upgraded">', Cl_Core.f_Sprintf('<div class="mdl-textfield__input value">%s</div>', textVal), Cl_Core.f_Sprintf('<label class="mdl-textfield__label" for="%s">%s</label>', id, Cl_Core.f_GetPropertyFromOther(that.columns, 'field', 'title', column.field)), '</div></div>'].join('');
          } else {
            var txtType = 'text',
                txtMin = '',
                txtMax = '',
                txtStep = '';
            if (column.type === "number" || column.type === "int" || column.type === "uint") {
              txtType = 'number';
              if (row != null && column.fieldMin != null) {
                var valueMin = row[column.fieldMin];
                txtMin = ' min="' + valueMin + '" minlength="' + valueMin + '"';
              } else if (column.min != null) txtMin = ' min="' + column.min + '" minlength="' + column.min + '"';
              if (row != null && column.fieldMax != null) {
                var valueMax = row[column.fieldMax];
                txtMax = ' max="' + valueMax + '" maxlength="' + valueMax + '"';
              } else if (column.max != null) txtMax = ' max="' + column.max + '" maxlength="' + column.max + '"';
              if (row != null && column.fieldStep != null) {
                var valueStep = row[column.fieldStep];
                txtStep = ' step="' + valueStep + '"';
              } else if (column.step != null) txtStep = ' step="' + column.step + '"';
            } else if (column.type === "password") {
              txtType = "password";
            } else if (column.type === "array") {
              fldAttr += ' field-type="array"';
            }
            dlgtext += [Cl_Core.f_Sprintf('<div class="field%s">', column.cardColspan != null ? ' width' + column.cardColspan : column.cardWidthfull ? ' full' : ''), '<div class="' + a_ActionName + ' mdl-textfield mdl-js-textfield mdl-textfield--floating-label">', column.cardArea == null ? Cl_Core.f_Sprintf('<input%s class="mdl-textfield__input value" type="%s"%s%s%s id="%s" value="%s"%s%s%s />', fldAttr, txtType, txtMin, txtMax, txtStep, id, value, valid, mask, readOnlyText) : Cl_Core.f_Sprintf('<textarea%s class="mdl-textfield__input value" type="text" id="%s" rows="%s"%s>%s</textarea>', fldAttr, id, column.cardArea, readOnlyText, value), Cl_Core.f_Sprintf('<label class="mdl-textfield__label" for="%s">%s</label>', id, Cl_Core.f_GetPropertyFromOther(that.columns, 'field', 'title', column.field)), column.valRegexMsg != null ? Cl_Core.f_Sprintf('<span class="mdl-textfield__error">%s</span>', column.valRegexMsg) : "", '</div></div>'].join('');
          }
        }
      }
    });
    dlgtext += '</div>';
    return dlgtext;
  };
  MdlTable.prototype.f_UpdateDialogActionContent = function () {
    var that = this;
    var dlg$ = $('.mdl-table__dialog_action_open_' + that.m_ID);
    var cnt$ = $('.mdl-dialog__content', dlg$);
    if (cnt$.length > 0) {
      var key = $('.mdl-table-dialog__content', cnt$).attr("data-key");
      var index = that.f_GetRowIndexFromKey(key);
      if (index != null) {
        cnt$.html(that.f_GetDialogActionContent('open', index, true));
        componentHandler.upgradeElements(cnt$[0]);
      } else {
        f_Mdl_Dailog_Hide(dlg$);
      }
    }
  };
  MdlTable.prototype.f_GetDialogData = function (a_Dlg, a_DataRow) {
    var that = this;
    var prms = a_Dlg.f_GetData();
    if (that.options.dataValues !== undefined && that.options.dataValues !== null) {
      $.each(that.options.dataValues, function (i, val) {
        prms[val.field] = val.value;
      });
    }
    if (that.options.dialogExtraFields !== null && a_DataRow !== undefined && a_DataRow !== null) {
      $.each(that.options.dialogExtraFields.split(','), function (i, field) {
        prms[field] = Cl_Core.f_GetItemField(a_DataRow, field);
      });
    }
    return prms;
  };
  MdlTable.prototype.f_Open = function (a_Params, a_Index, a_NoHistoring) {
    var that = this;
    var index = a_Index;
    if (index == null) {
      index = that.f_GetRowIndex(a_Params);
    }
    var row = this.f_GetRowDataFromIndex(index);
    var id = 'mdl-table__dialog_action_open_' + that.m_ID + '_' + index;
    var title = '';
    if (that.options.openTitleTemplate != null) {
      title = that.f_GetTextFromTemplatyText(index, row, that.options.openTitleTemplate);
    }
    if (title.length > 50) {
      title = title.substring(0, 50) + "...";
    }
    var btns$ = $(that.f_GetBtnClone(index) + that.f_GetBtnEdit(index) + that.f_GetBtnRemove(index) + that.f_GetBtnUsers(index) + that.f_GetBtnDetailView(index));
    var dlg = new MdlDialog({
      id: id,
      parentId: that.m_ID,
      classes: 'mdl-table__dialog mdl-table__dialog_' + that.m_ID + ' mdl-table__dialog_action_open_' + that.m_ID,
      title: title,
      isPage: true,
      pageButtons$: btns$,
      readonly: true,
      text: this.f_GetDialogActionContent('open', index, true, row),
      positive: {
        title: this.options.formatOk()
      }, onLoaded: function onLoaded() {
        that.f_InitButtonsFromContent(this.pageButtons$);
        that.f_InitButtonsRows(this.pageButtons$, index, row);
        $.applyDataMask('#' + id + ' ' + $.jMaskGlobals.dataMaskAttr);
      }
    });
  };
  MdlTable.prototype.f_Review = function (a_Params) {
    var that = this;
    var id = 'mdl-table__dialog_action_review_' + that.m_ID;
    var dlg = new MdlDialog({
      id: id,
      parentId: that.m_ID,
      classes: 'mdl-table__dialog mdl-table__dialog_' + that.m_ID,
      readonly: true,
      text: this.f_GetDialogActionContent('review', this.f_GetRowIndexBtn(a_Params), true),
      positive: {
        title: this.options.formatOk()
      },
      onLoaded: function onLoaded() {
        $.applyDataMask('#' + id + ' ' + $.jMaskGlobals.dataMaskAttr);
      }
    });
  };
  MdlTable.prototype.f_EditDialogContentInit = function (a_DataRow) {
    var that = this;
    $.each(that.columns, function (i, column) {
      if (column.editDialogContent !== undefined) {
        var elDlgColumn = document.getElementById('elDlgColumn_' + column.field);
        if (elDlgColumn !== undefined) {
          Cl_Core.f_CalculateObjectValue(null, column.editDialogContent, [that, elDlgColumn, a_DataRow], '');
        }
      }
    });
  };
  MdlTable.prototype.f_Add = function (a_Params) {
    if (this.options.addLink !== undefined) {
      window.open(this.options.addLink);
    } else {
      var that = this;
      var id = 'mdl-table__dialog_action_add_' + that.m_ID;

      var dlg = new MdlDialog({
        id: id,
        parentId: that.m_ID,
        classes: 'mdl-table__dialog mdl-table__dialog_' + that.m_ID,
        text: that.options.addDialogContent != null ? Cl_Core.f_CalculateObjectValue(null, that.options.addDialogContent, [that], '') : this.f_GetDialogActionContent('add'),
        negative: {
          title: this.options.formatCancel()
        },
        positive: {
          title: this.options.formatAdd(),
          onClick: function onClick(e) {
            var prms = null;
            if (that.options.addUrl !== undefined) {
              prms = that.f_GetDialogData(dlg);
            } else {
              prms = new Object();
              prms.cmd = '2';
              prms.object = that.f_GetDialogData(dlg);
            }
            if (that.options.addAction != null) {
              Cl_Core.f_CalculateObjectValue(null, that.options.addAction, [that, prms], '');
            } else {
              $.ajax({
                type: that.options.addMethod,
                url: that.options.addUrl !== undefined ? that.options.addUrl : that.options.url,
                data: prms,
                success: function success(data, textStatus) {
                  if (data.error !== undefined) {
                    that.f_OnError(data.error);
                  } else {
                    that.f_Refresh();
                  }
                }
              });
            }
          }
        },
        onLoaded: function onLoaded() {
          $.applyDataMask('#' + id + ' ' + $.jMaskGlobals.dataMaskAttr);
          jscolor.installByClassName("jscolor");
          that.f_EditDialogContentInit();
        }
      });
    }
  };
  MdlTable.prototype.f_Clone = function (a_Params) {
    var that = this;
    var index = this.f_GetRowIndexBtn(a_Params);
    var row = this.f_GetRowDataFromIndex(index);
    var id = 'mdl-table__dialog_action_clone_' + that.m_ID;
    var dlg = new MdlDialog({
      id: id,
      parentId: that.m_ID,
      classes: 'mdl-table__dialog mdl-table__dialog_' + that.m_ID,
      text: this.f_GetDialogActionContent('clone', index, false, row),
      negative: {
        title: this.options.formatCancel()
      },
      positive: {
        title: this.options.formatClone(),
        onClick: function onClick(e) {
          var prms = null;
          if (that.options.addUrl !== undefined) {
            prms = that.f_GetDialogData(dlg, row);
          } else {
            prms = new Object();
            prms.cmd = '2';
            prms.object = that.f_GetDialogData(dlg, row);
          }
          if (that.options.addAction != null) {
            Cl_Core.f_CalculateObjectValue(null, that.options.addAction, [that, prms], '');
          } else {
            $.ajax({
              type: that.options.addMethod,
              url: that.options.addUrl !== undefined ? that.options.addUrl : that.options.url,
              data: prms,
              success: function success(data, textStatus) {
                if (data.error !== undefined) {
                  that.f_OnError(data.error);
                } else {
                  that.f_Refresh();
                }
              }
            });
          }
        }
      },
      onLoaded: function onLoaded() {
        $.applyDataMask('#' + id + ' ' + $.jMaskGlobals.dataMaskAttr);
        jscolor.installByClassName("jscolor");
        that.f_EditDialogContentInit(row);
      }
    });
  };
  MdlTable.prototype.f_Edit = function (a_Params) {
    var that = this;
    var index = this.f_GetRowIndexBtn(a_Params);
    var row = this.f_GetRowDataFromIndex(index);
    var id = 'mdl-table__dialog_action_edit_' + that.m_ID;
    var dlg = new MdlDialog({
      id: id,
      parentId: that.m_ID,
      classes: 'mdl-table__dialog mdl-table__dialog_' + that.m_ID,
      text: this.f_GetDialogActionContent('edit', index, false, row),
      negative: {
        title: this.options.formatCancel()
      },
      positive: {
        title: this.options.formatEdit(),
        onClick: function onClick(e) {
          var prms = null;
          var row = that.f_GetRowDataBtn(a_Params);
          if (that.options.editUrl !== undefined) {
            prms = that.f_GetDialogData(dlg, row);
            prms[that.options.key] = row[that.options.key];
          } else {
            prms = new Object();
            prms.cmd = '3';
            prms.object = that.f_GetDialogData(dlg, row);
            prms.object[that.options.key] = row[that.options.key];
          }
          if (that.options.editAction != null) {
            Cl_Core.f_CalculateObjectValue(null, that.options.editAction, [that, prms], '');
          } else {
            $.ajax({
              type: that.options.editMethod,
              url: that.options.editUrl !== undefined ? that.options.editUrl : that.options.url,
              data: prms,
              success: function success(data, textStatus) {
                if (data.error !== undefined) {
                  that.f_OnError(data.error);
                } else {
                  if (that.options.editedUpdate) {
                    that.f_Refresh();
                  } else {
                    that.f_UpdateRow(index, data);
                  }
                }
              }
            });
          }
        }
      },
      onLoaded: function onLoaded() {
        $.applyDataMask('#' + id + ' ' + $.jMaskGlobals.dataMaskAttr);
        jscolor.installByClassName("jscolor");
        that.f_EditDialogContentInit(row);
        that.f_Trigger('dialog-edit-init', dlg);
      }
    });
  };
  MdlTable.prototype.f_Remove = function (a_Params) {
    var that = this;
    var index = this.f_GetRowIndexBtn(a_Params);
    var row = this.f_GetRowDataFromIndex(index);
    if (this.options.removeAction != null) {
      Cl_Core.f_CalculateObjectValue(null, this.options.removeAction, [this, row], '');
    } else {
      var msg = "";
      if (this.options.removeField != null) msg = this.options.formatConfirmRemoveWithField() + row[this.options.removeField];else msg = this.options.formatConfirmRemove();
      if (confirm(msg)) {
        var prms = new Object();
        prms.cmd = 4;
        var key = that.options.removeKey != null ? that.options.removeKey : that.options.key;
        if (that.options.removeUrl !== undefined) {
          prms[key] = row[key];
        } else {
          prms.keys = [];
          prms.keys.push(row[key]);
        }
        if (that.options.removeKeys != null) {
          var keys = that.options.removeKeys.split(',');
          for (var i = 0; i < keys.length; i++) {
            if (that.options.removeUrl !== undefined) {
              prms[keys[i]] = Cl_Core.f_GetItemField(row, keys[i]);
            } else {
              prms.keys.push(Cl_Core.f_GetItemField(row, keys[i]));
            }
          }
        }
        $.ajax({
          type: that.options.removeMethod,
          url: that.options.removeUrl !== undefined ? that.options.removeUrl : that.options.url,
          data: prms,
          success: function success(data, textStatus) {
            if (data.error !== undefined) {
              that.f_OnError(data.error);
            } else {
              if (that.options.removedUpdate) {
                that.f_Refresh();
              } else {
                that.f_DeleteRow(index);
                if (that.m_CardView) {
                  that.f_HideAllDialogs();
                }
              }
            }
          }
        });
      }
    }
  };

  MdlTable.prototype.f_ActionSelected = function (a_Params) {
    var that = this;
    var key = this.options.key;
    var rows = this.f_GetSelections();
    var keys = [];
    if (this.options.selectedArgumentIsKey) {
      for (var i = 0; i < rows.length; i++) {
        keys.push(rows[i][key]);
      }
    } else {
      for (var i = 0; i < rows.length; i++) {
        keys.push(rows[i]);
      }
    }
    if (this.options.selectConfirm != null && this.options.selectConfirm !== "") {
      if (!confirm(this.options.selectConfirm)) return;
    }
    if (this.options.selectedAction != null) {
      Cl_Core.f_CalculateObjectValue(null, this.options.selectedAction, [this, keys], '');
    } else {
      var prms = new Object();
      prms.keys = keys;
      $.ajax({
        type: that.options.selectedActionMethod,
        url: that.options.selectedActionUrl,
        data: prms,
        success: function success(data, textStatus) {
          if (data.error !== undefined) {
            that.f_OnError(data.error);
          } else {
            that.f_Refresh();
            if (that.options.selectedActionEnd != null) {
              Cl_Core.f_CalculateObjectValue(null, that.options.selectedActionEnd, [that, keys], '');
            }
          }
        }
      });
    }
  };
  MdlTable.prototype.f_RemoveSelected = function (a_Params) {
    var that = this;
    var confirming = false;
    if (this.options.removeSelectedAction != null) {
      confirming = true;
    } else {
      confirming = confirm(this.options.formatConfirmRemoves());
    }
    if (confirming) {
      var key = this.options.key;
      var rows = this.f_GetSelections();
      var keys = [];
      var indexes = [];
      for (var i = 0; i < rows.length; i++) {
        keys.push(rows[i][key]);
        indexes.push(that.f_GetRowIndexFromKey(rows[i][key]));
      }
      if (this.options.removeSelectedAction != null) {
        Cl_Core.f_CalculateObjectValue(null, this.options.removeSelectedAction, [this, keys], '');
      } else {
        var prms = new Object();
        prms.cmd = 4;
        prms.keys = keys;
        $.ajax({
          type: that.options.removeSelected_Method,
          url: that.options.removeSelected_Url !== undefined ? that.options.removeSelected_Url : that.options.url,
          data: prms,
          success: function success(data, textStatus) {
            if (data.error !== undefined) {
              that.f_OnError(data.error);
            } else {
              if (that.options.removedUpdate) {
                that.f_Refresh();
              } else {
                that.f_DeleteRows(indexes);
                if (that.m_CardView) {
                  that.f_HideAllDialogs();
                }
              }
            }
          }
        });
      }
    }
  };

  MdlTable.prototype.f_SubDetail = function (a_Params) {
    var index = this.f_GetRowIndexBtn(a_Params);
    var row = this.f_GetRowDataFromIndex(index);
    if (row.p_SubData != null && row.p_SubData.length > 0) {
      var that = this;
      var id = 'mdl-table__dialog_detail_sub_review' + that.m_ID;
      var textHtml = '<div class="mdl-table"><table class="mdl-data-table cardView detailSubTable"><tbody>';
      for (var i = 0; i < row.p_SubData.length; i++) {
        textHtml += that.f_GetRowHtmlText(index, null, row.p_SubData, i);
      }
      textHtml += '</tbody></table></div>';
      var dlg = new MdlDialog({
        id: id,
        parentId: that.m_ID,
        classes: 'mdl-table__dialog mdl-table__dialog_' + that.m_ID,
        text: textHtml,
        positive: {
          title: this.options.formatOk()
        },
        onLoaded: function onLoaded() {
          $('#' + id + ' .detailSubTable').find('tbody > tr[data-index] > td').off('click dblclick').on('click dblclick', function (e) {
            if (that.m_CardView && that.options.cardReviewAuto && $(e.target).parents('[name="bAction"]').length === 0) that.f_Open(e);
          });
          that.f_InitButtonsRows(dlg.m_dialog$);
        }
      });
    }
  };
  MdlTable.prototype.f_Detail = function (a_Params) {
    if (this.options.detailFormatter != null) {
      var that = this;
      var index = this.f_GetRowIndexBtn(a_Params);
      var row = this.f_GetRowDataFromIndex(index);
      var id = 'mdl-table__dialog_detail_' + that.m_ID + '_' + that.options.key + '_' + row[that.options.key];

      var dlgtext = '<div class="mdl-table mdl-table-dialog__content mdl-dialog__form mdl-dialog__detail">';
      dlgtext += Cl_Core.f_CalculateObjectValue(that.options, that.options.detailFormatter, [index, row], '');
      dlgtext += '</div>';

      var bOk = null;
      var bCancel = null;
      if (that.options.detailShowOk) {
        bOk = {
          title: that.options.formatOk(),
          onClick: function onClick() {
            Cl_Core.f_CalculateObjectValue(that.options, that.options.detailOkFunction, [index, row, $('#' + id + ' .mdl-table-dialog__content')], null);
          }
        };
      }
      if (that.options.detailShowCancel) bCancel = {
        title: that.options.formatCancel()
      };

      var dlg = new MdlDialog({
        id: id,
        classes: 'mdl-table__dialog mdl-table__dialog_' + that.m_ID + ' mdl-table__dialog_detail',
        text: dlgtext,
        positive: bOk,
        negative: bCancel,
        onLoaded: function onLoaded() {
          that.f_Trigger('load-detail-view', index, row, $('#' + id + ' .mdl-table-dialog__content'));
        }
      });
    }
  };
  MdlTable.prototype.f_HideAllDialogs = function () {
    f_Mdl_Dailog_Hide($('.mdl-table__dialog_' + this.m_ID));
  };

  MdlTable.prototype.f_AddRow = function (a_Row, a_Classes) {
    if (this.data != null) {
      var index = this.data.length;
      this.data.splice(index, 0, a_Row);
      var tbody = this.el_Table.querySelector('tbody');
      var elNewRow = document.createElement('tr');
      elNewRow.setAttribute("data-index", index);
      tbody.appendChild(elNewRow);
      elNewRow.outerHTML = this.f_GetRowHtmlText(index, a_Classes);
      this.f_InitToolbarRows();
      this.f_InitButtonsRows($(elNewRow), index, a_Row);
      this.$selectItem = this.$body.find(Cl_Core.f_Sprintf('[name="%s"]', this.options.selectItemName));
      return index;
    } else {
      return -1;
    }
  };
  MdlTable.prototype.f_AddNewRows = function (a_Count) {
    var elRow;
    var rowHeight = 0;

    var dataRow = {};
    [].forEach.call(this.header.fields, function (field) {
      dataRow[field] = "_";
    });
    //[].forEach.call(this.columns, function (column) {
    //  if (column.type !== 'hidden') {
    //    dataRow[column.field] = "_";
    //  }
    //});
    var index = -1;
    for (var i = 0; i < a_Count; i++) {
      var z = this.f_AddRow(dataRow, "mdl-table_empty");
      if (i === 0) {
        index = z;
        elRow = this.el_Table.querySelector('tbody tr:last-child');
        rowHeight = elRow.clientHeight;
      }
      elRow.style.height = rowHeight * (a_Count - i) + "px";
    }

    //elRow.style.height = "";
    return index;
  };
  MdlTable.prototype.f_UpdateColumn = function (a_IndexRow, a_Field, a_Value) {
    var row = this.data[a_IndexRow];
    row[a_Field] = a_Value;
    var elRow = this.el_Table.querySelector('tbody tr[data-index="' + a_IndexRow + '"]');
    var elColumn = null;
    if (this.m_CardView) {
      if (this.options.cardTemplate == null) {
        elColumn = elRow.querySelector('td[fld=' + a_Field + ']');
      } else {
        elColumn = elRow.querySelector('[fld=' + a_Field + ']');
      }
      elColumn.innerHTML = this.f_GetValue(a_IndexRow, a_Field, true, false, null, row);
    } else {
      var a = this.f_GetFieldIndex(this.columns, a_Field);
      if (this.options.detailSub || this.options.detailView) a++;
      if (this.f_GetChecked()) a++;
      elColumn = elRow.querySelector('td:nth-child(' + (a + 1) + ')');
      elColumn.innerHTML = this.f_GetValue(a_IndexRow, a_Field, true, false, null, row);
    }
  };
  MdlTable.prototype.f_UpdateRow = function (a_IndexRow, a_Row) {
    var that = this;
    this.f_Trigger('pre-update-row', a_Row);
    this.data[a_IndexRow] = a_Row;
    var elRow = this.el_Table.querySelector('tbody tr[data-index="' + a_IndexRow + '"]');
    var elColumns = null;
    var i = 0;
    if (this.m_CardView) {
      if (this.options.cardTemplate == null) {
        elColumns = elRow.querySelectorAll('td[fld]');
      } else {
        elColumns = elRow.querySelectorAll('[fld]');
      }
      for (i = 0; i < elColumns.length; i++) {
        var index = this.f_GetFieldIndex(this.columns, elColumns[i].getAttribute('fld'));
        if (index >= 0) {
          elColumns[i].innerHTML = this.f_GetValue(index, this.columns[index].field, true, false, null, a_Row);
        }
      }
      this.f_InitSelectColumns($(elRow));
    } else {
      elColumns = elRow.querySelectorAll('td');
      var a = 0;
      if (this.options.detailSub || this.options.detailView) a++;
      if (this.options.numbering) a++;
      if (this.f_GetChecked()) {
        a++;
        elColumns[0].innerHTML = this.f_GetColumnCheckedHtmlText(a_IndexRow, a_Row);
        this.f_InitChecked($(elRow));
      }
      var btnUserIndex = 0;
      for (i = 0; i < this.header.fields.length; i++) {
        var column = this.columns[i];
        if (column.type === "hidden") {
          a--;
        } else {
          if (column.type !== "button") {
            if (column.fieldLink != null && column.fieldLink !== "" || column.fieldLinkUrl != null && column.fieldLinkUrl !== "") {
              var linkValue = column.fieldLink != null && column.fieldLink !== "" ? this.f_GetValue(index, column.fieldLink, true, false, null, a_Row) : this.f_GetTextFromTemplatyText(index, a_Row, column.fieldLinkUrl);
              elColumns[i + a].innerHTML = Cl_Core.f_Sprintf('<a target="_blank" href="%s">%s</a>', linkValue, this.f_GetValue(a_IndexRow, column.field, true, false, null, a_Row));
            } else {
              elColumns[i + a].innerHTML = this.f_GetValue(a_IndexRow, column.field, true, false, null, a_Row);
            }
            var titleValue = '';
            if (column.fieldTitle !== null && column.fieldTitle !== "" || column.fieldTitleTemplaty != null && column.fieldTitleTemplaty !== "") {
              var titleValue = column.fieldTitle !== null && column.fieldTitle !== "" ? that.f_GetValue(index, column.fieldTitle, true, true, null, a_Row) : that.f_GetTextFromTemplatyText(index, a_Row, column.fieldTitleTemplaty);
              if (titleValue == null || titleValue === "-") {
                titleValue = '';
              }
            }
            if (titleValue !== '') {
              elColumns[i + a].title = titleValue;
            }
          } else {
            elColumns[elColumns.length - 1].children[btnUserIndex].innerHTML = this.f_GetValue(a_IndexRow, column.field, true, false, null, a_Row);
            btnUserIndex++;
          }
        }
      }
      var elBtns = elRow.querySelector('td.btnsRow');
      if (this.options.showClone) {
        elBtns.querySelector('.btnClone').outerHTML = this.f_GetBtnClone(a_IndexRow);
      }
      if (this.options.showEdit) {
        elBtns.querySelector('.btnEdit').outerHTML = this.f_GetBtnEdit(a_IndexRow);
      }
      if (this.options.showRemove) {
        elBtns.querySelector('.btnRemove').outerHTML = this.f_GetBtnRemove(a_IndexRow);
      }
      if (this.options.showReview) {
        var elbtnReview = elBtns.querySelector('.btnReview');
        if (elbtnReview !== undefined) {
          elBtns.querySelector('.btnReview').outerHTML = this.f_GetBtnReview(a_IndexRow);
        }
      }
    }
    var elRow$ = $(elRow);
    elRow$.removeClass('mdl-table_empty');
    this.f_InitDetail(elRow$);
    this.f_InitButtonsRows(elRow$, a_IndexRow, a_Row);
    this.f_InitRowsColors(elRow$);
    this.f_UpdateDialogActionContent();
    this.f_Trigger('update-row', this, a_IndexRow, elRow$, a_Row);
  };
  MdlTable.prototype.f_UpdateRows = function (a_Rows) {
    var that = this;
    if (a_Rows == null) {
      for (var i = 0; i < that.data.length; i++) {
        that.f_UpdateRow(i, that.data[i]);
      }
    } else {
      [].forEach.call(a_Rows, function (prmRow) {
        if (prmRow.hasOwnProperty('index') && prmRow.hasOwnProperty('row')) {
          that.f_UpdateRow(prmRow.index, prmRow.row);
        }
      });
    }
    that.f_ResetFooter();
  };
  MdlTable.prototype.f_DeleteRow = function (a_IndexRow) {
    var row = this.f_GetRowDataFromIndex(a_IndexRow);
    this.f_Trigger('pre-delete-row', row);
    this.data.splice(a_IndexRow, 1);
    var elRow = $('tbody tr[data-index="' + a_IndexRow + '"]', this.el_Table$);
    elRow.remove();
    this.f_ResetRowsIndexes();
  };
  MdlTable.prototype.f_DeleteRows = function (a_IndexesRows) {
    if (a_IndexesRows !== undefined) {
      var that = this;
      for (var i = a_IndexesRows.length - 1; i >= 0; i--) {
        that.f_DeleteRow(a_IndexesRows[i]);
      }
    }
  };

  MdlTable.prototype.f_ShowError = function (a_Msg) {
    if (this.options.showError) {
      alert(a_Msg);
    }
  };

  MdlTable.prototype.f_Destroy = function () {
    this.$el.insertBefore(this.$container);
    $(this.options.toolbar).insertBefore(this.$el);
    this.$container.next().remove();
    this.$container.remove();
    this.$el.html(this.$el_.html()).css('margin-top', '0').attr('class', this.$el_.attr('class') || ''); // reset the class
    window.removeEventListener('resize', this.e_OnWindowResize);
    //window.removeEventListener('popstate', this.e_OnPopState);
  };

  MdlTable.prototype.f_Refresh = function (params) {
    if (this.options.refreshAction != null) {
      var result = this.options.refreshAction.match(/\(.*?\)/i);
      var args = [this];
      if (result != null && result.length === 1) {
        var argsF = result[0].replace(/\s|\(|\)/g, '').split(',');
        for (var i = 0; i < argsF.length; i++) {
          if (argsF[i].length > 0) {
            args.push(argsF[i].replace(/'|"/g, ''));
          }
        }
      }
      Cl_Core.f_CalculateObjectValue(null, this.options.refreshAction.replace(/\(.*?\)/i, ''), args, '');
    } else if (params && params.url) {
      this.options.url = params.url;
    }
    this.options.pageNumber = 1;
    this.f_InitServer(params && params.silent, params && params.query);
  };
  MdlTable.prototype.f_ScrollTo = function (value) {
    if (typeof value === 'string') {
      value = value === 'bottom' ? this.el_Container.scrollHeight : 0;
    }
    if (typeof value === 'number') {
      this.el_Container.scrollTop = value;
    }
    if (typeof value === 'undefined') {
      return this.el_Container.scrollTop;
    }
  };

  MdlTable.prototype.f_InitCardView = function (fixedScroll) {
    var that = this;
    if (this.m_CardView) {
      this.el_Table.classList.add('cardView');
    } else {
      this.el_Table.classList.remove('cardView');
      this.f_HideAllDialogs();
    }
    this.f_InitHeader();
    this.f_InitBody(fixedScroll);
    if (this.m_CardView) {
      that.$body.find('[fld][data-hidding]').each(function () {
        var hidding = true;
        if (that.m_HiddingFields[this.getAttribute('fld')] == null) {
          that.m_HiddingFields[this.getAttribute('fld')] = this.getAttribute('data-hidding') === 'true';
        }
        hidding = that.m_HiddingFields[this.getAttribute('fld')];
        if (hidding) {
          this.style.display = 'none';
        } else {
          this.style.display = '';
        }
      });
    }
    this.f_Trigger('toggle', this.m_CardView);
  };

  MdlTable.prototype.expandRow_ = function (expand, index) {
    var $tr = this.$body.find(Cl_Core.f_Sprintf('> tr[data-index="%s"]', index));
    if ($tr.next().is('tr.detail-view') === (expand ? false : true)) {
      $tr.find('> td > .detail-icon').click();
    }
  };

  $(function () {
    $('.mdl-js-table').mdlTable();
  });
})(jQuery);

