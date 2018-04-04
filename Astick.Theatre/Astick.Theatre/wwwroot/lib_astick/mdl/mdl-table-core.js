!function ($) {
  'use strict';

  // MDL TABLE CLASS DEFINITION
  // =========================
  var MdlTable = function (a_El, a_Options) {
    var that = this;
    this.options = a_Options;
    this.el_Table = a_El;
    this.$el = this.el_Table$ = $(a_El);
    this.m_ID = a_El.id;
    this.$el_ = this.$el.clone();
    this.timeoutId_ = 0;
    this.timeoutFooter_ = 0;
    this.m_HiddingFields = new Object();

    if (this.el_Table.classList.contains('no-bordered')) {
      this.options.classes = this.options.classes.replace(' mdl-shadow--2dp', '');
    }

    this.f_Init();
  };

  MdlTable.LOCALES = [];
  MdlTable.DEFAULTS = {
    classes: 'mdl-data-table mdl-js-data-table mdl-shadow--2dp',
    align: 'left',
    widthfill: false,
    selected: false,
    undefinedText: '-',
    sortName: undefined,
    sortOrder: 'asc',
    columns: [[]],
    data: [],
    dataField: 'rows',
    dataTotalsField: 'totals',
    method: 'post',
    url: undefined,
    urlRemove: undefined,
    ajax: undefined,
    key: undefined,
    dataValues: null,
    dialogExtraFields: null,
    cache: true,
    locale: 'ru',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    dataType: '',
    ajaxOptions: {},
    queryParams: function (params) {
      return params;
    },
    queryParamsType: 'limit', // undefined
    responseHandler: function (res) {
      return res;
    },
    numbering: false,
    rowColors: undefined,
    rowColorsType: 'json',
    rowColorsStyle: 'color', //background
    totalRows: 0, // server side need to set
    pageNumber: 1,
    pageSize: 30,
    checked: false,
    showActionSelected: false,
    selectTitle: undefined,
    selectIcon: undefined,
    selectConfirm: undefined,
    selectedAction: undefined,
    selectedArgumentIsKey: true,
    selectedActionMethod: 'POST',
    selectedActionUrl: undefined,
    selectedActionEnd: undefined,
    selectingField: undefined,
    selectingInvert: false,
    selectItemName: 'btSelectItem',
    openTitleTemplate: undefined,
    showToolbar: undefined,
    toolbarExtraButtons: undefined,
    methodTotals: undefined,
    showHeader: true,
    showFooter: false,
    showColumns: false,
    showRefresh: false,
    refreshAction: undefined,
    showReview: false,
    showAdd: false,
    showClone: false,
    cloningField: undefined,
    cloningInvert: false,
    addAction: undefined,
    addDialogContent: undefined,
    addLink: undefined,
    addMethod: 'POST',
    addUrl: undefined,
    showEdit: false,
    editingField: undefined,
    editingInvert: false,
    editAction: undefined,
    editMethod: 'POST',
    editUrl: undefined,
    editedUpdate: false,
    showRemove: false,
    removeField: undefined,
    removingField: undefined,
    removingInvert: undefined,
    removeMethod: 'POST',
    removeUrl: undefined,
    removeAction: undefined,
    removeKey: undefined,
    removeKeys: undefined,
    removedUpdate: false,
    showRemoveSelected: false,
    removeSelectedAction: undefined,
    removeSelected_Method: 'POST',
    removeSelected_Url: undefined,
    showError: true,
    smartDisplay: true,
    minimumCountColumns: 1,
    idField: undefined,
    uniqueId: undefined,
    cardReviewAuto: true,
    cardTemplate: undefined,
    cardTemplateHidded: true,
    visibleSnackbar: true,
    detailSub: false,
    detailSubTitle: undefined,
    detailSubIcon: undefined,
    detailView: false,
    detailingField: undefined,
    detailingInvert: undefined,
    detailViewTitle: undefined,
    detailViewIcon: undefined,
    detailFormatter: function (index, row) {
      return '';
    },
    detailShowOk: true,
    detailShowCancel: false,
    detailOkFunction: function () {

    },
    clickToSelect: false,
    singleSelect: false,
    checkboxHeader: true,
    sortable: true,
    silentSort: true,
    maintainSelected: false,
    totalFields: undefined,
    totalIsChecked: true,
    errorEnabled: true,
    errorAction: undefined,
    iconSize: undefined,
    icons: {
      refresh: 'cached',
      open: 'info_outline',
      add: 'add_circle',
      clone: 'content_copy',
      edit: 'mode_edit',
      remove: 'delete',
      action: 'camera',
      columns: 'view_week',
      sub: 'storage',
      detail: 'directions',
      detailOpen: 'plus',
      detailClose: 'minus'
    },

    rowStyle: function (a_Row, a_Index) {
      return {};
    },

    rowAttributes: function (a_Row, a_Index) {
      return {};
    },
    onAll: function (a_Name, a_Args) {
      return false;
    },
    onClickCell: function (a_Field, a_Value, a_Row, $element) {
      return false;
    },
    onDblClickCell: function (a_Table, a_Field, a_Value, a_Index, a_Row, $element) {
      a_Table.f_CopyToBuffer($element.text());
      return false;
    },
    onClickRow: function (a_Item, $element) {
      return false;
    },
    onDblClickRow: function (a_Index, a_Row, $element) {
      return false;
    },
    f_OnSort: function (a_Name, a_Order) {
      return false;
    },
    f_OnCheck: function (a_Row) {
      return false;
    },
    f_OnUncheck: function (a_Row) {
      return false;
    },
    f_OnCheckChange: function (a_Row) {
      return false;
    },
    onCheckAll: function (a_Rows) {
      return false;
    },
    onUncheckAll: function (a_Rows) {
      return false;
    },
    onCheckSome: function (a_Rows) {
      return false;
    },
    onUncheckSome: function (a_Rows) {
      return false;
    },
    onLoadSuccess: function (a_Data) {
      return false;
    },
    onLoadError: function (a_Status) {
      return false;
    },
    onColumnSwitch: function (a_Field, a_Checked) {
      return false;
    },
    onPageChange: function (a_Number, a_Size) {
      return false;
    },
    f_OnToggle: function (a_CardView) {
      return false;
    },
    onPreBody: function (a_Data) {
      return false;
    },
    onPostBody: function () {
      return false;
    },
    onPostHeader: function () {
      return false;
    },
    onUpdateRow: function () {
      return false;
    },
    onPreUpdateRow: function () {
      return false;
    },
    onPreDeleteRow: function () {
      return false;
    },
    onExpandRow: function (a_Index, a_Row, $detail) {
      return false;
    },
    onCollapseRow: function (a_Index, a_Row) {
      return false;
    },
    onRefreshOptions: function (a_Options) {
      return false;
    },
    onResetView: function () {
      return false;
    },
    onResetItemCards: function () {
      return false;
    },
    onResetCards: function () {
      return false;
    },
    onInitDetailView: function () {
      return false;
    },
    f_OnInitDialogEdit: function () {

    },
    f_OnError: function () {
      return false;
    },
  };
  MdlTable.COLUMN_DEFAULTS = {
    checkboxEnabled: true,
    field: undefined,
    fieldLink: undefined,
    fieldLinkUrl: undefined,
    fieldLinkFormatter: undefined,
    title: undefined,
    titleTooltip: undefined,
    fieldTitle: null,
    fieldTitleTemplaty: null,
    'class': undefined,
    cellTemplate: null,
    align: "left", // left, right, center
    halign: "center", // left, right, center
    falign: undefined, // left, right, center
    valign: undefined, // top, middle, bottom
    width: undefined,
    sortable: false,
    order: 'asc', // asc, desc
    visible: true,
    switchable: true,
    clickToSelect: true,
    formatter: undefined,
    footerFormatter: undefined,
    events: undefined,
    sorter: undefined,
    sortName: undefined,
    wordWrap: false,
    wordWrapMinWidth: 250,
    wordWrapMaxWidth: 2000,
    cellStyle: undefined,
    editingMethod: undefined,
    readOnly: false,
    addOnly: false,
    editOnly: false,
    cardEnabled: true,
    cardTemplate: undefined,
    cardArea: undefined,
    cardWidthfull: false,
    cardColspan: null,
    cardCellStyle: null,
    editDialogContent: undefined,
    dialogVisible: true,
    dialogVisibleAlways: false,
    type: undefined,
    buttonAction: undefined,
    buttonTitle: '',
    buttonClass: '',
    buttonVisibleField: undefined,
    buttonVisibleInvert: false,
    buttonVisibleAction: undefined,
    selectField: undefined,
    selectDataType: 'json',
    selectDataValue: undefined,
    selectData: undefined,
    selectReadOnly: true,
    selectKey: "key",
    selectValue: "value",
    unit: undefined,
    mask: undefined,
    valRequired: false,
    valRegexPattern: undefined,
    valRegexMsg: undefined,
    min: null,
    max: null,
    step: null,
    fieldMin: null,
    fieldMax: null,
    fieldStep: null
  };
  MdlTable.EVENTS = {
    'all.mdl.table': 'onAll',
    'click-cell.mdl.table': 'onClickCell',
    'dbl-click-cell.mdl.table': 'onDblClickCell',
    'click-row.mdl.table': 'onClickRow',
    'dbl-click-row.mdl.table': 'onDblClickRow',
    'sort.mdl.table': 'f_OnSort',
    'check.mdl.table': 'f_OnCheck',
    'uncheck.mdl.table': 'f_OnUncheck',
    'check-change.mdl.table': 'f_OnCheckChange',
    'check-all.mdl.table': 'onCheckAll',
    'uncheck-all.mdl.table': 'onUncheckAll',
    'check-some.mdl.table': 'onCheckSome',
    'uncheck-some.mdl.table': 'onUncheckSome',
    'load-success.mdl.table': 'onLoadSuccess',
    'load-error.mdl.table': 'onLoadError',
    'column-switch.mdl.table': 'onColumnSwitch',
    'page-change.mdl.table': 'onPageChange',
    'toggle.mdl.table': 'f_OnToggle',
    'pre-body.mdl.table': 'onPreBody',
    'post-body.mdl.table': 'onPostBody',
    'update-row.mdl.table': 'onUpdateRow',
    'pre-update-row.mdl.table': 'onPreUpdateRow',
    'pre-delete-row.mdl.table': 'onPreDeleteRow',
    'post-header.mdl.table': 'onPostHeader',
    'expand-row.mdl.table': 'onExpandRow',
    'collapse-row.mdl.table': 'onCollapseRow',
    'refresh-options.mdl.table': 'onRefreshOptions',
    'reset-view.mdl.table': 'onResetView',
    'reset-item-cards.mdl.table': 'onResetItemCards',
    'reset-cards.mdl.table': 'onResetCards',
    'load-detail-view.mdl.table': 'onInitDetailView',
    'dialog-edit-init.mdl.table': 'f_OnInitDialogEdit',
    'error.mdl.table': 'f_OnError'
  };

  MdlTable.prototype.f_Init = function () { };

  MdlTable.prototype.f_Trigger = function (a_Name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var name = a_Name + '.mdl.table';

    var events = $._data(this.$el[0], "events");
    if (!(!!events && !!(events = events[a_Name]))) {
      this.options[MdlTable.EVENTS[name]].apply(this.options, args);
    }

    this.$el.trigger($.Event(name), args);
    this.options.onAll(name, args);
    this.$el.trigger($.Event('all.mdl.table'), [name, args]);
  };

  MdlTable.prototype.f_GetFormatMoney = function (a_Value) {
    if (a_Value == null || a_Value === undefined || a_Value === "")
      return "0,00";
    var price = a_Value.toString().replace(".", ",");
    var cIndex = price.indexOf(",");
    if (cIndex === -1) {
      price += ",00";
    } else if (price.length === cIndex + 2) {
      price += "0";
    }
    return price.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  };
  MdlTable.prototype.f_GetFormatDate = function (a_Value) {
    if (a_Value != null && a_Value !== "" && a_Value !== "-" && a_Value !== "_") {
      var date = moment(a_Value);
      if (date.isValid())
        return date.format("DD.MM.YYYY");
      else
        return a_Value;
    } else
      return "";
  };
  MdlTable.prototype.f_GetFormatDateTime = function (a_Value) {
    if (a_Value != null && a_Value !== "" && a_Value !== "-" && a_Value !== "_") {
      var date = moment(a_Value);
      if (date.isValid())
        return date.format("DD.MM.YYYY HH:mm:ss");
      else
        return a_Value;
    } else
      return "";
  };
  MdlTable.prototype.f_GetFormatMobile = function (a_Value) {
    if (a_Value.length === 10)
      return "(" + a_Value.substr(0, 3) + ") " + a_Value.substr(3, 3) + " " + a_Value.substr(6, 2) + " " + a_Value.substr(8, 2);
    else
      return "";
  };
  MdlTable.prototype.f_GetFormatBoolean = function (a_Value) {
    return '<input type="checkbox"' + ((a_Value) ? ' checked="checked" ' : '') + ' disabled="disabled">';
  };
  MdlTable.prototype.f_GetColumnByField = function (a_Field) {
    var column = undefined;
    $.each(this.columns, function (i, clmn) {
      if (clmn.field === a_Field) {
        column = clmn;
        return false;
      }
      return true;
    });
    return column;
  };
  MdlTable.prototype.f_GetFieldIndex = function (a_Columns, a_Field) {
    var index = -1;
    $.each(a_Columns, function (i, column) {
      if (column.field === a_Field) {
        index = i;
        return false;
      }
      return true;
    });
    return index;
  };
  MdlTable.prototype.f_SetFieldIndex = function (a_Columns) {
    var i, j, k, totalCol = 0, flag = [];
    for (i = 0; i < a_Columns[0].length; i++) {
      totalCol += a_Columns[0][i].colspan || 1;
    }
    for (i = 0; i < a_Columns.length; i++) {
      flag[i] = [];
      for (j = 0; j < totalCol; j++) {
        flag[i][j] = false;
      }
    }
    for (i = 0; i < a_Columns.length; i++) {
      for (j = 0; j < a_Columns[i].length; j++) {
        var r = a_Columns[i][j],
          rowspan = r.rowspan || 1,
          colspan = r.colspan || 1,
          index = $.inArray(false, flag[i]);
        if (colspan === 1) {
          r.fieldIndex = index;
          if (typeof r.field === 'undefined') {
            r.field = index;
          }
        }
        for (k = 0; k < rowspan; k++) {
          flag[i + k][index] = true;
        }
        for (k = 0; k < colspan; k++) {
          flag[i][index + k] = true;
        }
      }
    }
  };
  MdlTable.prototype.f_GetRowFromKey = function (a_Key) {
    if (this.options.key != null) {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i][this.options.key].toString() === a_Key.toString())
          return this.data[i];
      }
    }
    return null;
  };
  MdlTable.prototype.f_GetRowIndexFromKey = function (a_Key) {
    if (this.options.key != null) {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i][this.options.key].toString() === a_Key.toString())
          return i;
      }
    }
    return null;
  };
  MdlTable.prototype.f_GetRowIndex = function (a_Params) {
    return $(a_Params.currentTarget).parents('tr').attr('data-index');
  };
  MdlTable.prototype.f_GetRowDataIndexFromIndex = function (a_Index) {
    return parseInt(a_Index);
  };
  MdlTable.prototype.f_GetRowDataIndexSubFromIndex = function (a_Index) {
    if (a_Index != null) {
      var pos = a_Index.toString().indexOf('_');
      if (pos !== -1)
        return a_Index.substr(pos + 1, a_Index.length - pos - 1);
      else
        return -1;
    } else {
      return -1;
    }
  };
  MdlTable.prototype.f_GetRowDataIndex = function (a_Params) {
    return this.f_GetRowDataIndexFromIndex(this.f_GetRowIndex(a_Params));
  };
  MdlTable.prototype.f_GetRowDataIndexSub = function (a_Params) {
    return this.f_GetRowDataIndexSubFromIndex(this.f_GetRowIndex(a_Params));
  };
  MdlTable.prototype.f_GetRowDataFromIndex = function (a_Index) {
    var dataIndex = this.f_GetRowDataIndexFromIndex(a_Index);
    var dataIndexSub = this.f_GetRowDataIndexSubFromIndex(a_Index);
    var row = this.data[dataIndex];
    if (dataIndexSub !== -1 && row.p_SubData != null && row.p_SubData.length > 0) {
      return row.p_SubData[dataIndexSub];
    } else
      return row;
  };
  MdlTable.prototype.f_GetRowData = function (a_Params) {
    return this.f_GetRowDataFromIndex(this.f_GetRowIndex(a_Params));
  };
  MdlTable.prototype.f_GetRowIndexBtn = function (a_Params) {
    return this.f_GetRowIndexFromKey($(a_Params.currentTarget).parents('.btn').attr('data-key'));
  };
  MdlTable.prototype.f_GetRowDataIndexBtn = function (a_Params) {
    return this.f_GetRowDataIndexFromIndex(this.f_GetRowIndexBtn(a_Params));
  };
  MdlTable.prototype.f_GetRowDataIndexSubBtn = function (a_Params) {
    return this.f_GetRowDataIndexSubFromIndex(this.f_GetRowIndexBtn(a_Params));
  };
  MdlTable.prototype.f_GetRowDataBtn = function (a_Params) {
    return this.f_GetRowDataFromIndex(this.f_GetRowIndexBtn(a_Params));
  };
  MdlTable.prototype.f_GetFormatMask = function (a_Column) {
    if (a_Column === undefined || a_Column === null) return '';
    if (a_Column.mask != null) return a_Column.mask;
    else if (a_Column.type === "date") return this.options.formatMaskDate();
    else if (a_Column.type === "datetime") return this.options.formatMaskDateTime();
    else if (a_Column.type === "mobile") return this.options.formatMaskMobile();
    else return "";
  };
  MdlTable.prototype.f_GetTextFromTemplatyText = function (a_Index, a_DataRow, a_Text, a_IsSpan) {
    var text = a_Text;
    var isSpan = a_IsSpan === true;
    var tmpVals = text.match(/\[%.*?%\]/g);
    if (tmpVals != null) {
      for (var i = 0; i < tmpVals.length; i++) {
        var fld = tmpVals[i].replace(/\[%|%\]/g, '');
        var regex = new RegExp('\\[\%' + fld + '\%\]', "g");
        if (isSpan)
          text = text.replace(regex, Cl_Core.f_Sprintf('<span fld="%s">%s</span>', fld, this.f_GetValue(a_Index, fld, true, false, null, a_DataRow)));
        else
          text = text.replace(regex, this.f_GetValue(a_Index, fld, true, true, null, a_DataRow));
      }
    }
    return text;
  };

  MdlTable.prototype.f_IsVisibleButtons = function () {
    var that = this
    var showRowButtons = false;
    $.each(this.header.fields, function (j, field) {
      var column = that.f_GetColumn(field);
      if (column.type === 'button') {
        showRowButtons = true;
        return;
      }
    });
    return showRowButtons || this.options.showClone || this.options.showEdit || this.options.showRemove || this.options.showReview;
  }

  MdlTable.prototype.f_IsVisibleSelect = function (a_DataRow) {
    return (this.options.selectingField == null || (!this.options.selectingInvert && a_DataRow[this.options.selectingField]) || (this.options.selectingInvert && !a_DataRow[this.options.selectingField]));
  }
  MdlTable.prototype.f_IsVisibleClone = function (a_DataRow) {
    return (this.options.cloningField == null || (!this.options.cloningInvert && a_DataRow[this.options.cloningField]) || (this.options.cloningInvert && !a_DataRow[this.options.cloningField]));
  }
  MdlTable.prototype.f_IsVisibleEdit = function (a_DataRow) {
    return (this.options.editingField == null || (!this.options.editingInvert && a_DataRow[this.options.editingField]) || (this.options.editingInvert && !a_DataRow[this.options.editingField]));
  }
  MdlTable.prototype.f_IsVisibleRemove = function (a_DataRow) {
    return (this.options.removingField == null || (!this.options.removingInvert && a_DataRow[this.options.removingField]) || (this.options.removingInvert && !a_DataRow[this.options.removingField]));
  }
  MdlTable.prototype.f_IsVisibleDetail = function (a_DataRow) {
    return (this.options.detailingField == null || (!this.options.detailingInvert && a_DataRow[this.options.detailingField]) || (this.options.detailingInvert && !a_DataRow[this.options.detailingField]));
  }
  MdlTable.prototype.f_IsVisibleButton = function (a_DataRow, a_Column) {
    return (a_Column.buttonVisibleField === undefined || (!a_Column.buttonVisibleInvert && a_DataRow[a_Column.buttonVisibleField]) || (a_Column.buttonVisibleInvert && !a_DataRow[a_Column.buttonVisibleField])) &&
      (a_Column.buttonVisibleAction === undefined || (Cl_Core.f_CalculateObjectValue(null, a_Column.buttonVisibleAction, [this, a_DataRow], '')));
  }
  MdlTable.prototype.f_GetShowingColumns = function () {
    return (!this.m_CardView || this.options.cardTemplate === undefined) && this.options.showColumns;
  }

  MdlTable.prototype.f_GetBtnRefresh = function () {
    if (this.options.showRefresh)
      return ['<div class="btn btnRefresh">',
        '<button title="' + this.options.formatRefresh() + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bRefresh"><span class="material-icons">' + this.options.icons.refresh + '</span></button>',
        this.m_CardView ? '</div>' : '</div>'].join('');
    else return '';
  }
  MdlTable.prototype.f_GetBtnReview = function (a_RowIndex) {
    if (this.options.showReview)
      return ['<div class="btn btnReview" data-key="' + this.data[a_RowIndex][this.options.key] + '">',
      '<button title="' + this.options.formatReview() + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bReview"><i class="material-icons">' + this.options.icons.open + '</i></button>',
      this.m_CardView ? '</div>' : '</div>'].join('');
    else return '';
  }
  MdlTable.prototype.f_GetBtnAdd = function () {
    if (this.options.showAdd)
      return ['<div class="btn btnAdd">',
        '<button title="' + this.options.formatAdd() + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bAdd"><i class="material-icons">' + this.options.icons.add + '</i></button>',
        this.m_CardView ? '</div>' : '</div>'].join('');
    else return '';
  }
  MdlTable.prototype.f_GetBtnRemoveSelected = function () {
    if (this.options.showRemoveSelected)
      return ['<div class="btn btnRemoveSelected">',
        '<button title="' + this.options.formatRemoveSelected() + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bRemoveSelected"><i class="material-icons">' + this.options.icons.remove + '</i></button>',
        this.m_CardView ? '</div>' : '</div>'].join('');
    else return '';
  }
  MdlTable.prototype.f_GetBtnActionSelected = function () {
    if (this.options.showActionSelected)
      return Cl_Core.f_Sprintf('<div class="btn btnActionSelected" title="%s">', this.options.selectTitle != null ? this.options.selectTitle : this.options.formatActionSelected()) +
        '<button class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bActionSelected">' +
        Cl_Core.f_Sprintf('<i class="material-icons">%s</i>', this.options.selectIcon != null ? this.options.selectIcon : this.options.icons.action) +
        '</button></div>';
    else return '';
  }
  MdlTable.prototype.f_GetBtnClone = function (a_RowIndex, a_RowData) {
    if (this.options.showClone) {
      var data = a_RowData !== undefined ? a_RowData : this.data;
      var row = data[a_RowIndex];
      if (this.f_IsVisibleClone(row)) {
        return ['<div class="btn btnClone" data-key="' + row[this.options.key] + '">',
        '<button title="' + this.options.formatClone() + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bClone"><i class="material-icons">' + this.options.icons.clone + '</i></button>',
        this.m_CardView ? '</div>' : '</div>'].join('');
      } else return this.m_CardView ? '' : '<div class="btn btnClone"></div>';
    } else return '';
  }
  MdlTable.prototype.f_GetBtnEdit = function (a_RowIndex, a_RowData) {
    if (this.options.showEdit) {
      var data = a_RowData !== undefined ? a_RowData : this.data;
      var row = data[a_RowIndex];
      if (this.f_IsVisibleEdit(row)) {
        return ['<div class="btn btnEdit" data-key="' + row[this.options.key] + '">',
        '<button title="' + this.options.formatEdit() + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bEdit"><i class="material-icons">' + this.options.icons.edit + '</i></button>',
        this.m_CardView ? '</div>' : '</div>'].join('');
      } else return this.m_CardView ? '' : '<div class="btn btnEdit"></div>';
    } else return '';
  }
  MdlTable.prototype.f_GetBtnRemove = function (a_RowIndex, a_RowData) {
    if (this.options.showRemove) {
      var data = a_RowData !== undefined ? a_RowData : this.data;
      var row = data[a_RowIndex];
      if (this.f_IsVisibleRemove(row)) {
        return ['<div class="btn btnRemove" data-key="' + row[this.options.key] + '">',
        '<button title="' + this.options.formatRemove() + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bRemove"><i class="material-icons">' + this.options.icons.remove + '</i></button>',
        this.m_CardView ? '</div>' : '</div>'].join('');
      } else return this.m_CardView ? '' : '<div class="btn btnRemove"></div>';
    } else return '';
  }
  MdlTable.prototype.f_GetBtnUsers = function (a_RowIndex) {
    var that = this;
    var btns = '';
    $.each(this.columns, function (i, column) {
      if (column.type === "button") {
        var dataRow = that.f_GetRowDataFromIndex(a_RowIndex);
        if (that.f_IsVisibleButton(dataRow, column)) {
          btns += Cl_Core.f_Sprintf('<div class="btn btnUsers %s" data-key="%s"><button title="%s" class="mdl-button mdl-js-button mdl-button--icon" name="bAction"%s><i class="material-icons">%s</i></button></div>',
            column.buttonClass, dataRow[that.options.key], column.buttonTitle, column.buttonAction != null ? ' data-action="' + column.buttonAction + '"' : '', column.title);
        }
      }
    });
    return btns;
  }
  MdlTable.prototype.f_GetBtnDetailView = function (a_RowIndex) {
    var row = null;
    if (this.options.detailView) {
      var detailViewTitle = this.options.formatDetailView();
      var detailIcon = this.options.icons.detail;
      if (this.options.detailViewTitle != null)
        detailViewTitle = this.options.detailViewTitle;
      if (this.options.detailViewIcon != null)
        detailIcon = this.options.detailViewIcon;
      row = this.data[a_RowIndex];
      if (this.f_IsVisibleDetail(row)) {
        return [this.m_CardView ? '<div class="btn" data-key="' + row[this.options.key] + '">' : '<td class="btn" data-key="' + row[this.options.key] + '">',
        '<button title="' + detailViewTitle + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bDetail"><i class="material-icons">' + detailIcon + '</i></button>',
        this.m_CardView ? '</div>' : '</td>'].join('');
      } else return '';
    } else if (this.options.detailSub) {
      row = this.f_GetRowDataFromIndex(a_RowIndex);
      if (row.p_SubData != null && row.p_SubData.length > 0) {
        var subTitle = this.options.formatDetailSub();
        var subIcon = this.options.icons.sub;
        if (this.options.subDetailTitle != null)
          subTitle = this.options.subDetailTitle;
        if (this.options.subDetailIcon != null)
          subIcon = this.options.subDetailIcon;
        return [this.m_CardView ? '<div class="btn" data-key="' + this.data[a_RowIndex][this.options.key] + '">' : '<td class="btn" data-key="' + this.data[a_RowIndex][this.options.key] + '">',
        '<button title="' + subTitle + '" class="mdl-button mdl-js-button mdl-button--icon" type="button" name="bSubDetail"><i class="material-icons">' + subIcon + '</i></button>',
        this.m_CardView ? '</div>' : '</td>'].join('');
      }
    }
    else return '';
  }

  MdlTable.prototype.f_GetColumn = function (a_Field) {
    return this.columns[this.f_GetFieldIndex(this.columns, a_Field)];
  };
  MdlTable.prototype.f_GetColumnsVisible = function () {
    var clms = [];
    $.each(this.columns, function (i, column) {
      if (column.visible) {
        clms.push(column.field);
      }
    });
    return clms;
  }
  MdlTable.prototype.f_GetColumnsHidden = function () {
    return $.grep(this.columns, function (column) {
      return !this.f_GetVisible(column);
    });
  };
  MdlTable.prototype.f_ResetRowsIndexes = function () {
    [].forEach.call(this.el_TableBody.querySelectorAll('tr.mdl-table_row'), function (elRow, index) {
      elRow.setAttribute('data-index', index);
    });
  };
  MdlTable.prototype.f_ToggleColumn = function (a_Index, checked, needUpdate, a_Fld) {
    var that = this;
    if (a_Index === -1) {
      if (this.options.cardTemplate != null) {
        if (this.m_CardView) {
          [].forEach.call(this.el_TableBody.querySelectorAll(Cl_Core.f_Sprintf('tr td.mdl-table_row_panelCard [fld="%s"]', a_Fld)), function (tagHidding, index) {
            if (checked) {
              tagHidding.style.display = '';
            } else {
              tagHidding.style.display = 'none';
            }
          });
        }
        that.m_HiddingFields[a_Fld] = !checked;
        return;
      } else {
        return;
      }
    }
    var column = this.columns[a_Index];
    column.visible = checked;
    var i = a_Index;
    if (this.options.detailSub || this.options.detailView) i++;
    if (this.f_GetChecked()) i++;
    if (this.m_CardView) {
      if (this.options.cardTemplate === undefined) {
        [].forEach.call(this.el_TableBody.querySelectorAll(Cl_Core.f_Sprintf('tr td table', i)), function (item, y) {
          [].forEach.call(item.querySelectorAll(Cl_Core.f_Sprintf('tr:nth-child(%s)', i)), function (item, z) {
            if (checked) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }
    } else {
      if (this.options.numbering) i++;
      var elCol = this.el_TableHeaderCollumns.querySelector(Cl_Core.f_Sprintf('tr>th:nth-child(%s)', i + 1));
      if (checked) {
        elCol.style.display = '';
      } else {
        elCol.style.display = 'none';
      }
      [].forEach.call(this.el_TableBody.children, function (elRow, y) {
        if (elRow.children.length > i) {
          if (checked) {
            elRow.children[i].style.display = '';
          } else {
            elRow.children[i].style.display = 'none';
          }
        }
      });
    }
    if (this.f_GetShowingColumns()) {
      var $items = this.$toolbarButtons.find('.keep-open input').prop('disabled', false);
      if (needUpdate) {
        $items.filter(Cl_Core.f_Sprintf('[value="%s"]', a_Index)).prop('checked', checked);
      }
      if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
        $items.filter(':checked').prop('disabled', true);
      }
    }
  };
  MdlTable.prototype.f_ToggleRow = function (index, uniqueId, visible) {
    if (index === -1) {
      return;
    }
    this.$body.find(typeof index !== 'undefined' ? Cl_Core.f_Sprintf('tr[data-index="%s"]', index) : Cl_Core.f_Sprintf('tr[data-uniqueid="%s"]', uniqueId))[visible ? 'show' : 'hide']();
  };
  MdlTable.prototype.f_ShowColumn = function (field) {
    this.f_ToggleColumn(this.f_GetFieldIndex(this.columns, field), true, true, field);
  };
  MdlTable.prototype.f_HideColumn = function (field) {
    this.f_ToggleColumn(this.f_GetFieldIndex(this.columns, field), false, true, field);
  };
  MdlTable.prototype.f_HasHiddenColumn = function (field) {
    var column = this.f_GetColumn(field);
    if (column != null)
      return !this.f_GetVisible(column);
    else
      return true;
  };
  MdlTable.prototype.f_HasVisibleColumn = function (field) {
    var column = this.f_GetColumn(field);
    if (column != null)
      return this.f_GetVisible(column);
    else
      return false;
  };

  MdlTable.prototype.f_GetSelections = function () {
    var that = this;
    return $.grep(this.data, function (row) {
      return row[that.header.stateField];
    });
  };
  MdlTable.prototype.f_GetAllSelections = function () {
    var that = this;

    return $.grep(this.options.data, function (row) {
      return row[that.header.stateField];
    });
  };
  MdlTable.prototype.f_CheckAll = function () {
    this.f__CheckAll(true);
  };
  MdlTable.prototype.f_UncheckAll = function () {
    this.f__CheckAll(false);
  };
  MdlTable.prototype.f__CheckAll = function (checked) {
    var rows;
    if (!checked) {
      rows = this.f_GetSelections();
    }
    if (checked) this.ctrl_SelectAll.check(); else this.ctrl_SelectAll.uncheck();
    this.$selectItem.filter(':enabled').prop('checked', checked);
    this.updateRows();
    if (checked) {
      rows = this.f_GetSelections();
    }
    this.f_Trigger(checked ? 'check-all' : 'uncheck-all', rows);
  };
  MdlTable.prototype.f_Check = function (index) {
    this.f__Check(true, index);
  };
  MdlTable.prototype.f_Uncheck = function (index) {
    this.f__Check(false, index);
  };
  MdlTable.prototype.f__Check = function (checked, index) {
    var $el = this.$selectItem.filter(Cl_Core.f_Sprintf('[data-index="%s"]', index)).prop('checked', checked);
    this.data[index][this.header.stateField] = checked;
    this.f_UpdateSelected();
    this.f_Trigger(checked ? 'check' : 'uncheck', this.data[index], $el);
    this.f_Trigger('check-change', this.data[index], $el);
  };
  MdlTable.prototype.p__CheckBy = function (checked, obj) {
    if (!obj.hasOwnProperty('field') || !obj.hasOwnProperty('values')) {
      return;
    }
    var that = this,
      rows = [];
    $.each(this.options.data, function (index, row) {
      if (!row.hasOwnProperty(obj.field)) {
        return false;
      }
      if ($.inArray(row[obj.field], obj.values) !== -1) {
        var $el = that.$selectItem.filter(':enabled').filter(Cl_Core.f_Sprintf('[data-index="%s"]', index)).prop('checked', checked);
        row[that.header.stateField] = checked;
        rows.push(row);
        that.f_Trigger(checked ? 'check' : 'uncheck', row, $el);
      }
    });
    this.f_UpdateSelected();
    this.f_Trigger(checked ? 'check-some' : 'uncheck-some', rows);
  };

  MdlTable.prototype.f_ShowLoading = function (a_Index) {
    if (this.m_CardView) {
      this.el_CardViewLoader.classList.add('active');
    } else {
      if (a_Index != null) {
        var elRow = this.el_Table.querySelector('tbody tr[data-index="' + a_Index + '"]');
        var elLoader = document.createElement('tr');
        elLoader.classList.add('headerLoader');
        elLoader.innerHTML = this.el_TableHeaderLoader.innerHTML.replace('th', 'td');
        elRow.parentNode.insertBefore(elLoader, elRow.nextSibling).classList.remove('hidden');
      } else {
        this.el_TableHeaderLoader.classList.remove('hidden');
      }
    }
  };
  MdlTable.prototype.f_HideLoading = function (a_Index) {
    if (this.m_CardView) {
      this.el_CardViewLoader.classList.remove('active');
    } else {
      if (a_Index != null) {
        var elRow = this.el_Table.querySelector('tbody tr[data-index="' + a_Index + '"]');
        if (elRow.nextSibling != null)
          elRow.nextSibling.remove();
      } else {
        this.el_TableHeaderLoader.classList.add('hidden');
      }
    }
  };

  MdlTable.prototype.f_GetValueByType = function (a_Type, a_Value, a_IsUnit) {
    var val = '';
    if (a_Type === "money") {
      val = this.f_GetFormatMoney(a_Value);
      if (a_IsUnit) {
        val = val + " " + this.options.formatMoney();
      }
      return val;
    } else if (a_Type === "date") {
      return this.f_GetFormatDate(a_Value);
    } else if (a_Type === "datetime") {
      return this.f_GetFormatDateTime(a_Value);
    } else if (a_Type === "mobile") {
      return a_Value;
    } else if (a_Type === "bool") {
      return a_Value;
    } else if (a_Type === "button") {
      return a_Value;
    }
    else {
      return a_Value;
    }
  };
  MdlTable.prototype.f_GetValueByTypeRow = function (a_Type, a_Value, a_IsUnit, a_IsDialog) {
    var isDialog = a_IsDialog === true;
    var txtHtml = '';
    if (a_Type === "money") {
      txtHtml = this.f_GetFormatMoney(a_Value);
      if (a_IsUnit) {
        if (this.m_CardView || isDialog)
          txtHtml += " " + this.options.formatMoney();
        else
          txtHtml += " <span class='moneySymbol'>" + this.options.formatMoney() + "<span>";
      }
    } else if (a_Type === "bool" && !this.m_CardView && !isDialog) {
      txtHtml = this.f_GetFormatBoolean(a_Value);
    } else if (a_Type === "color" && !this.m_CardView && !isDialog) {
      txtHtml = '<span style="background-color:#' + a_Value + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
    } else {
      txtHtml = this.f_GetValueByType(a_Type, a_Value);
    }
    return txtHtml;
  }
  MdlTable.prototype.f_GetValue = function (a_Index, a_Field, a_IsUnit, a_IsDialog, a_DataRows, a_Item) {
    var item = a_Item;
    if (item == null)
      item = a_DataRows != null ? a_DataRows[a_Index] : this.f_GetRowDataFromIndex(a_Index);
    if (item == null)
      return '';
    var column = this.f_GetColumn(a_Field);
    var value = Cl_Core.f_GetItemField(item, a_Field);
    if (column != null) {
      if (!a_IsDialog && column.selectData !== undefined && column.selectData !== null) {
        var valSelect = Cl_Core.f_GetItemField(column.selectData, value);
        if (valSelect !== undefined && valSelect !== null && valSelect.length > 0) {
          value = valSelect;
        }
      } else if (column.type != null) {
        if (column.type === "array") {
          value = Cl_Core.f_CalculateObjectValue(column, this.header.formatters[column.fieldIndex], [value, item, a_Index], value);
          if (a_IsDialog) {
            value = value.join('\r\n');
          }
        } else if (column.type === "button") {
          if (this.f_IsVisibleButton(item, column))
            value = Cl_Core.f_Sprintf('<button name="bAction" class="mdl-button mdl-js-button mdl-button--icon %s"%s href="javascript:void(0)"%s><i class="material-icons">%s</i></button>', column.buttonClass, column.buttonTitle != null ? ' title="' + column.buttonTitle + '"' : '', column.buttonAction != null ? ' data-action="' + column.buttonAction + '"' : '', column.title);
          else
            value = '';
        } else {
          if (!a_IsDialog) {
            value = Cl_Core.f_CalculateObjectValue(column, this.header.formatters[column.fieldIndex], [value, item, a_Index], value);
          }
          value = this.f_GetValueByTypeRow(column.type, value, a_IsUnit, a_IsDialog);
        }
      } else {
        value = Cl_Core.f_CalculateObjectValue(column, this.header.formatters[column.fieldIndex], [value, item, a_Index], value);
      }
    }
    value = typeof value === 'undefined' || value == null ? this.options.undefinedText : value;
    return value;
  }
  MdlTable.prototype.f_GetCardTemplateHtmlText = function (item, a_Index, a_Column) {
    var that = this;
    var text = '';
    if (a_Column != null && a_Column.cardTemplate != null) {
      text = Cl_Core.f_CalculateObjectValue(a_Column, a_Column.cardTemplate, [that, item], '');
    } else {
      text = Cl_Core.f_CalculateObjectValue(that.options, that.options.cardTemplate, [that, item], '');
    }

    return this.f_GetTextFromTemplatyText(a_Index, item, text, true);
  }
  MdlTable.prototype.f_GetColumnCheckedHtmlText = function (a_RowIndex, a_RowData) {
    var html = '';
    if (this.f_GetChecked()) {
      if (this.f_IsVisibleSelect(a_RowData)) {
        var text = ['<td class="cbx mdl-table_row_cbx">',
          Cl_Core.f_Sprintf('<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="%s_chbxCheckRow%s"><input', this.m_ID, a_RowIndex) +
          Cl_Core.f_Sprintf(' id="%s_chbxCheckRow%s" class="mdl-checkbox__input"', this.m_ID, a_RowIndex) +
          Cl_Core.f_Sprintf(' data-index="%s"', a_RowIndex) +
          Cl_Core.f_Sprintf(' name="%s"', this.options.selectItemName) +
          Cl_Core.f_Sprintf(' type="%s"', 'checkbox') +
          Cl_Core.f_Sprintf(' value="%s"', a_RowData[this.options.idField]) +
          ' /><span class="mdl-checkbox__label"></span></label>',
          this.m_CardView ? '</div>' : '</td>'
        ].join('');
        html = text;
      } else {
        html = '<td class="cbx"></td>';
      }
    }
    return html;
  }
  MdlTable.prototype.f_CopyToBuffer = function (a_Text) {
    var bfText = a_Text;
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.value = bfText;
    document.body.appendChild(textArea);
    textArea.select();
    if (document.execCommand('copy')) {
      if (this.options.visibleSnackbar) {
        var data = { message: "Текст скопировался в буфер: " + bfText };
        this.el_Snackbar.MaterialSnackbar.showSnackbar(data);
      }
    }
    document.body.removeChild(textArea);
  }
  MdlTable.prototype.f_GetRowHtmlText = function (a_Index, a_Classes, a_DataRows, a_RowDataIndex) {
    var index = a_DataRows != null ? a_RowDataIndex : a_Index;
    var attrIndex = a_DataRows != null ? a_Index + "_" + a_RowDataIndex : a_Index;
    var data = a_DataRows !== undefined ? a_DataRows : this.data;

    var that = this,
      html = [],
      item = data[index],
      key,
      style = {},
      csses = [],
      data_ = '',
      attributes = {},
      htmlAttributes = [];
    style = Cl_Core.f_CalculateObjectValue(this.options, this.options.rowStyle, [item, index], style);
    if (style && style.css) {
      for (key in style.css) {
        csses.push(key + ': ' + style.css[key]);
      }
    }
    attributes = Cl_Core.f_CalculateObjectValue(this.options, this.options.rowAttributes, [item, index], attributes);
    if (attributes) {
      for (key in attributes) {
        htmlAttributes.push(Cl_Core.f_Sprintf('%s="%s"', key, Cl_Core.f_EscapeHTML(attributes[key])));
      }
    }
    if (item._data && !$.isEmptyObject(item._data)) {
      $.each(item._data, function (k, v) {
        if (k === 'onclick') { //Astick
          data_ += Cl_Core.f_Sprintf(' %s="%s"', k, v);
          return;
        }
        // ignore data-index
        if (k === 'index') {
          return;
        }
        data_ += Cl_Core.f_Sprintf(' data-%s="%s"', k, v);
      });
    }
    if (a_Classes != null) {
      if (style.classes != null)
        style.classes += "mdl-table_row " + a_Classes;
      else
        style.classes = "mdl-table_row " + a_Classes;
    } else {
      style.classes = "mdl-table_row";
    }
    if (!that.f_IsVisibleEdit(item)) {
      style.classes += " mdl-table_row_noediting";
    }
    html.push('<tr',
      Cl_Core.f_Sprintf(' %s', htmlAttributes.join(' ')),
      Cl_Core.f_Sprintf(' id="%s"', $.isArray(item) ? undefined : item._id),
      Cl_Core.f_Sprintf(' class="%s"', style.classes || ($.isArray(item) ? undefined : item._class)),
      Cl_Core.f_Sprintf(' data-index="%s"', attrIndex),
      Cl_Core.f_Sprintf(' data-uniqueid="%s"', item[this.options.uniqueId]),
      Cl_Core.f_Sprintf('%s', data_),
      '>'
    );
    html.push(this.f_GetColumnCheckedHtmlText(attrIndex, item));
    if (this.m_CardView) {
      html.push('<td class="mdl-table_row_panelCard">');
    }
    if (this.m_CardView && that.options.cardTemplate != null) {
      html.push(that.f_GetCardTemplateHtmlText(item, index));
    } else {
      if (!this.m_CardView) {
        if (this.options.numbering) {
          html.push('<td class="table_row_numbering">', index + 1, '.</td>');
        }
        if (this.options.detailView || this.options.detailSub) {
          if ((this.options.detailView && (this.f_IsVisibleDetail(item))) || (this.options.detailSub && item.p_SubData != null && item.p_SubData.length > 0)) {
            html.push('<td class="detail">',
              '<a class="detail-icon" href="javascript:">',
              Cl_Core.f_Sprintf('<i class="material-icons %s"></i>', this.options.icons.detailOpen),
              '</a>',
              '</td>');
          } else {
            html.push('<td class="detail"></td>');
          }
        }
      }
      if (that.m_CardView) {
        html.push('<table>');
      }
      var isFirstColumn = true;
      var textBtns = '';
      $.each(this.header.fields, function (j, field) {
        var text = '',
          type = '',
          cellStyle = {},
          id_ = '',
          class_ = that.header.classes[j],
          data_ = '',
          rowspan_ = '',
          title_ = '',
          column = that.f_GetColumn(field);
        if (column.type !== 'hidden') {
          var value = that.f_GetValue(index, field, true, false, a_DataRows);
          value = $.maskGetValue(that.f_GetFormatMask(column), value);

          style = Cl_Core.f_Sprintf('style="%s%s%s"', csses.concat(that.header.styles[j]).join('; '),
            !that.m_CardView && column.wordWrap ? 'word-wrap: break-word;min-width: ' + column.wordWrapMinWidth + 'px;max-width: ' + column.wordWrapMaxWidth + 'px;white-space:normal;' : '',
            that.f_GetVisible(column) ? '' : ' display: none');
          // handle td's id and class
          if (item['_' + field + '_id']) {
            id_ = Cl_Core.f_Sprintf(' id="%s"', item['_' + field + '_id']);
          }
          if (item['_' + field + '_class']) {
            class_ = Cl_Core.f_Sprintf(' class="%s"', item['_' + field + '_class']);
          }
          if (item['_' + field + '_rowspan']) {
            rowspan_ = Cl_Core.f_Sprintf(' rowspan="%s"', item['_' + field + '_rowspan']);
          }
          if ((column.fieldTitle !== null && column.fieldTitle !== "") || (column.fieldTitleTemplaty != null && column.fieldTitleTemplaty !== "")) {
            var titleValue = column.fieldTitle !== null && column.fieldTitle !== "" ? that.f_GetValue(index, column.fieldTitle, true, true, null, item) : that.f_GetTextFromTemplatyText(index, item, column.fieldTitleTemplaty);
            title_ = titleValue;
            if (title_ != null && title_ !== "-") {
              title_ = Cl_Core.f_Sprintf(' title="%s"', title_);
            } else {
              title_ = '';
            }
          } else if (item['_' + field + '_title']) {
            title_ = Cl_Core.f_Sprintf(' title="%s"', item['_' + field + '_title']);
          }
          cellStyle = Cl_Core.f_CalculateObjectValue(that.header, that.header.cellStyles[j], [value, item, a_Index], cellStyle);
          if (cellStyle.classes) {
            class_ = Cl_Core.f_Sprintf(' class="%s"', cellStyle.classes);
          }
          if (cellStyle.css) {
            var csses_ = [];
            for (var key in cellStyle.css) {
              csses_.push(key + ': ' + cellStyle.css[key]);
            }
            style = Cl_Core.f_Sprintf('style="%s"', csses_.concat(that.header.styles[j]).join('; '));
          }
          if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
            $.each(item['_' + field + '_data'], function (k, v) {
              // ignore data-index
              if (k === 'index') {
                return;
              }
              data_ += Cl_Core.f_Sprintf(' data-%s="%s"', k, v);
            });
          }
          var regex = null;
          var val = null;
          var fld = null;
          var txtTemp = null;
          if (that.m_CardView) {
            if (that.f_GetCardEnabled(column)) {
              var cardCellStyle = "";
              if (column.cardCellStyle != null) {
                cardCellStyle = ' style="' + column.cardCellStyle + '"';
              }
              if (column.type === "button" && (that.f_IsVisibleButton(item, column))) {
                //text = Cl_Core.f_Sprintf('<tr%s><td colspan="2" class="btn"><button name="bAction"%s class="mdl-button mdl-js-button mdl-button--icon %s" href="javascript:void(0)"%s><i class="material-icons">%s</i></button></td></tr>', cardCellStyle, column.buttonTitle != null ? ' title="' + column.buttonTitle + '"' : '', column.buttonClass, column.buttonAction != null ? ' data-action="' + column.buttonAction + '"' : '', column.title);
              } else {
                var fieldName = column.cardField != null ? column.cardField : Cl_Core.f_GetPropertyFromOther(that.columns, 'field', 'title', field);
                if (column.cardTemplate !== undefined && column.cardTemplate !== "") {
                  value = Cl_Core.f_CalculateObjectValue(column, column.cardTemplate, [that, item], '');
                  value = that.f_GetTextFromTemplatyText(a_Index, item, value, true);
                } else if (column.cellTemplate != undefined && column.cellTemplate !== "") {
                  value = Cl_Core.f_CalculateObjectValue(column, column.cellTemplate, [that, item], '');
                  value = that.f_GetTextFromTemplatyText(a_Index, item, value, true);
                } else if (column.type === "bool") {
                  value = Cl_Core.f_Sprintf('<input type="checkbox" disabled%s />', value ? ' checked' : '');
                }
                text = [Cl_Core.f_Sprintf('<td class="fieldText"%s>%s: </td>', cardCellStyle, fieldName), Cl_Core.f_Sprintf('<td class="fieldValue mdl-textfield__input%s" fld="%s">%s</td>', isFirstColumn ? ' firstColumn' : '', field, value)].join('');
                if (that.m_CardView && !that.f_GetVisible(column)) {
                  text = Cl_Core.f_Sprintf('<tr fld="%s" style="display:none;">%s</tr>', field, text);
                } else {
                  text = Cl_Core.f_Sprintf('<tr fld="%s">%s</tr>', field, text);
                }
              }
            }
          } else {
            if (column.type === "button") {
              var buttonText = '';
              if (that.f_IsVisibleButton(item, column)) {
                var buttonTitle = "", buttonAction;
                if (column.buttonTitle != null)
                  buttonTitle = ' title="' + column.buttonTitle + '"';
                if (column.buttonAction != null)
                  buttonAction = ' data-action="' + column.buttonAction + '"';
                buttonText = '<button name="bAction" class="mdl-button mdl-js-button mdl-button--icon ' + column.buttonClass + '" href="javascript:void(0)"' + buttonTitle + buttonAction + '><i class="material-icons">' + column.title + '</i></button>';
              }
              textBtns += [Cl_Core.f_Sprintf('<div%s %s %s %s %s %s>', id_, ' class="btn"', style, data_, rowspan_, title_), buttonText, '</div>'].join('');
            } else if (column.cellTemplate != null && column.cellTemplate !== "") {
              text = Cl_Core.f_Sprintf('<td%s %s %s %s %s %s>', id_, class_, style, data_, rowspan_, title_);
              txtTemp = Cl_Core.f_CalculateObjectValue(column, column.cellTemplate, [that, item], '');
              txtTemp = that.f_GetTextFromTemplatyText(a_Index, item, txtTemp, true);
              text += txtTemp;
              text += '</td>';
            } else if ((column.fieldLink !== undefined && column.fieldLink !== null && column.fieldLink !== "")
              || (column.fieldLinkUrl !== undefined && column.fieldLinkUrl !== null && column.fieldLinkUrl !== "")
              || (column.fieldLinkFormatter !== undefined && column.fieldLinkFormatter !== null && column.fieldLinkFormatter !== "")) {
              var linkValue = '';
              if (column.fieldLink !== undefined && column.fieldLink !== null && column.fieldLink !== "") {
                linkValue = that.f_GetValue(index, column.fieldLink, true, false, a_DataRows)
              } else if (column.fieldLinkUrl !== undefined && column.fieldLinkUrl !== null && column.fieldLinkUrl !== "") {
                linkValue = that.f_GetTextFromTemplatyText(index, item, column.fieldLinkUrl);
              } else if (column.fieldLinkFormatter !== undefined && column.fieldLinkFormatter !== null && column.fieldLinkFormatter !== "") {
                linkValue = Cl_Core.f_CalculateObjectValue(column, column.fieldLinkFormatter, [that, item], '');
              }
              var textVal = '';
              if (linkValue !== "") {
                textVal = '<a target="_blank" href="' + linkValue + '">' + value + '</a>';
              } else {
                textVal = value;
              }
              text = [Cl_Core.f_Sprintf('<td%s %s %s %s %s %s>', id_, class_, style, data_, rowspan_, title_), textVal, '</td>'].join('');
            } else {
              text = [Cl_Core.f_Sprintf('<td%s %s %s %s %s %s>', id_, class_, style, data_, rowspan_, title_), value, '</td>'].join('');
            }
          }
          if (that.f_GetVisible(column)) {
            isFirstColumn = false;
          }
          html.push(text);
        }
      });
      if (that.m_CardView) {
        html.push('</table>');
      } else {
        if (that.f_IsVisibleButtons()) {
          html.push('<td class="btns btnsRow">');
          html.push(textBtns);
          if (that.options.showClone) {
            html.push(that.f_GetBtnClone(index, data));
          }
          if (that.options.showEdit) {
            html.push(that.f_GetBtnEdit(index, data));
          }
          if (that.options.showRemove) {
            html.push(that.f_GetBtnRemove(index, data));
          }
          if (that.options.showReview) {
            html.push(that.f_GetBtnReview(index, data));
          }
          html.push('</td>');
        }
      }
    }
    if (this.m_CardView) {
      html.push('</td>');
    }
    html.push('</tr>');
    return html.join('');
  };


  // MDL TABLE PLUGIN DEFINITION
  // ==========================
  var allowedMethods = [
    'f_GetSelections', 'f_GetAllSelections', 'f_GetData',
    'f_Load', 'f_Open', 'f_Review', 'f_Add', 'f_Clone', 'f_Edit', 'f_Remove', 'f_RemoveSelected',
    'f_GetColumnsVisible', 'f_GetColumnsHidden',
    'f_CheckAll', 'f_UncheckAll',
    'f_Check', 'f_Uncheck',
    'f_Refresh', 'f_ResetView', 'f_Destroy',
    'f_ShowLoading', 'f_HideLoading',
    'f_ShowColumn', 'f_HideColumn',
    'f_ScrollTo',
    'f_InitCardView'
  ];

  $.fn.mdlTable = function (option) {
    var value, args = Array.prototype.slice.call(arguments, 1);
    this.each(function () {
      var $this = $(this),
        data = $this.data('mdl.table'),
        options = $.extend({}, MdlTable.DEFAULTS, $this.data(),
          typeof option === 'object' && option);
      if (typeof option === 'string') {
        if ($.inArray(option, allowedMethods) < 0) {
          throw new Error("Unknown method: " + option);
        }
        if (!data) {
          return;
        }
        value = data[option].apply(data, args);
        if (option === 'f_Destroy') {
          $this.removeData('mdl.table');
        }
      }
      if (!data) {
        $this.data('mdl.table', (data = new MdlTable(this, options)));
      }
    });

    return typeof value === 'undefined' ? this : value;
  };
  $.fn.mdlTable.Constructor = MdlTable;
  $.fn.mdlTable.defaults = MdlTable.DEFAULTS;
  $.fn.mdlTable.columnDefaults = MdlTable.COLUMN_DEFAULTS;
  $.fn.mdlTable.locales = MdlTable.LOCALES;
  $.fn.mdlTable.methods = allowedMethods;
  $.fn.mdlTable.utils = {
    f_Sprintf: Cl_Core.f_Sprintf,
    compareObjects: Cl_Core.f_CompareObjects,
    calculateObjectValue: Cl_Core.f_CalculateObjectValue
  };
}(jQuery);
