(function () {
  'use strict';

  var f_ParseHTML = function (html) {
    var tmpl = document.createElement('div');
    tmpl.innerHTML = html;
    return tmpl.firstChild.cloneNode(true);
  };

  var MaterialSelectfield = function MaterialSelectfield(element) {
    this.el_Element = element;
    this.el_Element$ = $(this.el_Element);
    this.m_Disabled = false;
    this.options = {}
    var opt = this.el_Element$.data();
    if (opt.searchMinLength === undefined && opt.searchMethod === 'local') {
      opt.searchMinLength = 0;
    }
    this.options = $.fn.extend(this.options, MaterialSelectfield.DEFAULTS, opt);
    this.m_EnabledHiddensElements = true;
    if (this.options.fieldKey !== undefined && this.options.fieldName !== undefined) {
      this.m_FieldKey = this.options.fieldKey;
      this.m_FieldName = this.options.fieldName;
    } else {
      if (this.options.fieldKey === undefined) {
        if (this.options.fieldItemKey !== undefined) {
          this.m_FieldKey = this.options.fieldKey = this.options.fieldItemKey;
        } else {
          this.m_FieldKey = 'key';
        }
      }
      if (this.options.fieldName === undefined) {
        if (this.options.fieldItemValue !== undefined) {
          this.m_FieldName = this.options.fieldName = this.options.fieldItemValue;
        } else {
          this.m_FieldName = 'value';
        }
      }
      this.m_EnabledHiddensElements = false;
    }
    if (this.options.fieldValue === undefined) {
      if (this.options.fieldItemValue !== undefined) {
        this.options.fieldValue = this.options.fieldItemValue;
      } else {
        this.options.fieldValue = this.m_FieldName;
      }
    }
    if (this.options.fieldItemKey !== undefined) {
      this.m_FieldItemKey = this.options.fieldItemKey;
    } else {
      this.m_FieldItemKey = this.m_FieldKey;
    }
    if (this.options.fieldItemValue !== undefined) {
      this.m_FieldItemValue = this.options.fieldItemValue;
    } else {
      this.m_FieldItemValue = this.m_FieldName;
    }
    this.f_Init();
  };
  window['MaterialSelectfield'] = MaterialSelectfield;

  MaterialSelectfield.DEFAULTS = {
    minWidth: 50,
    sortName: '',
    sortOrder: 'asc',
    searchUrl: undefined,
    searchMinLength: 3,
    searchLimit: 15,
    searchMethod: 'get', //post, local
    searchCache: true,
    readOnly: false,
    fieldKey: undefined,
    fieldName: undefined,
    fieldValue: undefined,
    fieldValueTemplate: undefined,
    fieldItemKey: undefined,
    fieldItemValue: undefined,
    fieldItemValueTemplate: undefined,
    showError: true,
    source: undefined
  }

  MaterialSelectfield.prototype.Constant_ = {
  };

  MaterialSelectfield.prototype.m_FieldKey = 'id';
  MaterialSelectfield.prototype.m_FieldName = 'name';
  MaterialSelectfield.prototype.m_FieldItemKey = 'key';
  MaterialSelectfield.prototype.m_FieldItemValue = 'value';

  MaterialSelectfield.prototype.CssClasses_ = {
    LABEL: 'mdl-selectfield__label',
    INPUT: 'mdl-selectfield__input',
    IS_DIRTY: 'is-dirty',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_INVALID: 'is-invalid',
    IS_UPGRADED: 'is-upgraded',
    IS_MENU_HIDE: 'is-menu_hide',
    MENU_ITEM: 'mdl-menu__item',
    MENU_SELECT: 'mdl-menu__item_active'
  };


  MaterialSelectfield.prototype.f_GetTextFromTemplatyText = function (a_DataRow, a_Text, a_IsSpan) {
    var text = a_Text;
    var isSpan = a_IsSpan === true;
    var tmpVals = text.match(/\[%.*?%\]/g);
    if (tmpVals != null) {
      for (var i = 0; i < tmpVals.length; i++) {
        var fld = tmpVals[i].replace(/\[%|%\]/g, '');
        var regex = new RegExp('\\[\%' + fld + '\%\]', "g");
        if (isSpan)
          text = text.replace(regex, Cl_Core.f_Sprintf('<span fld="%s">%s</span>', fld, Cl_Core.f_GetItemField(a_DataRow, fld)));
        else
          text = text.replace(regex, Cl_Core.f_GetItemField(a_DataRow, fld));
      }
    }
    return text;
  };

  MaterialSelectfield.prototype.f_IsSearch = function () {
    return !this.options.readOnly && (this.options.searchUrl !== undefined || (this.options.searchMethod === 'local' && this.p_Data !== undefined && this.p_Data !== null && this.p_Data.length > 0));
  }

  MaterialSelectfield.prototype.f_GetItemValue = function (a_Item) {
    if (this.options.fieldItemValueTemplate !== undefined) {
      return this.f_GetTextFromTemplatyText(a_Item, this.options.fieldItemValueTemplate, false);
    } else {
      return Cl_Core.f_GetItemField(a_Item, this.m_FieldItemValue);
    }
  };

  MaterialSelectfield.prototype.f_GetKey = function (a_Index) {
    if (this.el_Element) {
      if (this.p_Data == null || this.p_Data.length == 0) {
        return null;
      } else if (a_Index == null || a_Index < 0 || a_Index >= this.p_Data.length) {
        return this.el_Input.getAttribute("key");
      } else {
        return Cl_Core.f_GetItemField(this.p_Data[a_Index], this.m_FieldItemKey);
      }
    }
  };

  MaterialSelectfield.prototype.f_GetValue = function (a_Item) {
    if (this.options.fieldValueTemplate !== undefined) {
      return this.f_GetTextFromTemplatyText(a_Item, this.options.fieldValueTemplate, false);
    } else if (a_Item === undefined) {
      return this.el_Input.value;
    } else {
      return Cl_Core.f_GetItemField(a_Item, this.options.fieldValue);
    }
  };

  MaterialSelectfield.prototype.f_GetValueFromIndex = function (a_Index) {
    if (this.el_Element) {
      if (this.p_Data == null || this.p_Data.length == 0) {
        return null;
      } else if (a_Index == null || a_Index < 0 || a_Index >= this.p_Data.length) {
        return this.el_Input.value;
      } else {
        return this.f_GetValue(this.p_Data[a_Index]);
      }
    }
  };

  MaterialSelectfield.prototype.f_SetData = function (a_Data) {
    var data = a_Data;
    if (data == null)
      data = [];
    this.f_ClearItems();
    if (data.total !== undefined && data.rows !== undefined) {
      this.m_TotalRows = data.total;
      this.p_Data = data.rows;
    } else {
      this.p_Data = data;
    }
    if (data.length === 0 || !this.f_IsSearch()) {
      this.f_SetValue();
    } else {
      this.el_Input.setAttribute("key", "");
    }
    this.f_InitMenu();
  };

  MaterialSelectfield.prototype.f_GetSelectedKey = function () {
    if (this.p_Data !== undefined && this.p_Data !== null && this.p_Data.length > 0) {
      var item;
      var key = this.el_Input.getAttribute('key');
      for (var i = 0; i < this.p_Data.length; i++) {
        if (Cl_Core.f_GetItemField(this.p_Data[i], this.m_FieldItemKey) == key) {
          item = this.p_Data[i];
          break;
        }
      }
      if (item === undefined) {
        return null;
      } else {
        return key;
      }
    } else {
      return null;
    }
  };

  MaterialSelectfield.prototype.f_SetKey = function (a_Key) {
    if (this.el_Element) {
      var item = null;
      if (a_Key === null || a_Key === undefined || a_Key === "") {
        this.el_Input.value = '';
        if (this.el_ElementKey !== undefined) {
          this.el_ElementKey.value = '';
        }
      } else if (this.p_Data != null) {
        var given = false;
        for (var i = 0; i < this.p_Data.length; i++) {
          item = this.p_Data[i];
          if (Cl_Core.f_GetItemField(item, this.m_FieldItemKey) == a_Key) {
            this.el_Input.value = this.f_GetValue(item);
            var valKey = Cl_Core.f_GetItemField(item, this.m_FieldItemKey);
            this.el_Input.setAttribute("key", valKey);
            this.el_Input.setAttribute("name", this.m_FieldName);
            if (this.el_ElementKey !== undefined) {
              this.el_ElementKey.setAttribute("name", this.m_FieldKey);
              this.el_ElementKey.value = valKey;
            }
            given = true;
            break;
          }
        }
        if (!given) {
          var index = parseInt(a_Key);
          if (index !== NaN && this.p_Data.length > index) {
            item = this.p_Data[index];
            this.el_Input.value = item.toString();
            var valKey = index;
            this.el_Input.setAttribute("key", valKey);
            this.el_Input.setAttribute("name", this.m_FieldName);
            if (this.el_ElementKey !== undefined) {
              this.el_ElementKey.setAttribute("name", this.m_FieldKey);
              this.el_ElementKey.value = valKey;
            }
            given = true;
          }
        }

        if (this.el_Input.value != "") {
          this.el_Element.classList.add(this.CssClasses_.IS_DIRTY);
        } else {
          this.el_Element.classList.remove(this.CssClasses_.IS_DIRTY);
        }
        if (!this.m_Disabled) {
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            this.el_Element.dispatchEvent(evt);
            this.el_Input.dispatchEvent(evt);
          } else {
            this.el_Element.fireEvent("onchange");
            this.el_Input.fireEvent("onchange");
          }
          this.f_CheckValidity();
        }
        if (this.f_IsSearch()) {
          if (item === null) {
            if (this.options.searchMethod === 'local') {
              this.f_ClearItems();
            } else {
              this.f_SetData();
            }
          } else {
            this.m_TotalRows = 1;
            this.m_SearchText = this.el_Input.value;
            if (this.options.searchMethod === 'local') {
              this.f_InitMenu([item]);
            } else {
              this.f_SetData([item]);
            }
            this.el_Input.setAttribute("key", a_Key);
            if (this.m_EnabledHiddensElements) {
              this.el_ElementKey.value = a_Key;
            }
          }
        }
      }
      this.f_CheckValidity();
    }
  };

  MaterialSelectfield.prototype.f_SetIndex = function (a_Index) {
    if (this.el_Element) {
      if (this.p_Data == null || a_Index == null || a_Index < 0 || a_Index >= this.p_Data.length) {
        this.el_Input.value = "";
        this.f_SetKey();
      } else {
        this.f_SetKey(Cl_Core.f_GetItemField(this.p_Data[a_Index], this.m_FieldItemKey));
      }
    }
  };

  MaterialSelectfield.prototype.f_SetValue = function (a_Value) {
    if (this.el_Element) {
      var that = this;
      if (a_Value !== undefined && a_Value !== null) {
        if (this.f_IsSearch()) {
          if (a_Value.length >= this.options.searchMinLength) {
            if (this.options.searchMethod === 'local') {
              var data = [];
              that.m_SearchText = that.el_Input.value.toLowerCase();
              [].forEach.call(that.p_Data, function (item, index) {
                var itemValue = that.f_GetItemValue(item).toLowerCase();
                var index = itemValue.indexOf(that.m_SearchText);
                if (index > -1) {
                  data.push(item);
                }
              });
              this.m_TotalRows = data.length;
              this.f_InitMenu(data);
              this.f_MenuShow();
            } else {
              $.ajax({
                type: this.options.searchMethod,
                url: this.options.searchUrl,
                data: { limit: this.options.searchLimit, sort: this.options.sortName, order: this.options.sortOrder, query: this.el_Input.value },
                cache: this.options.searchCache,
                success: function (res) {
                  if (res.rows !== undefined) {
                    if (res.rows.length > 0) {
                      that.m_SearchText = that.el_Input.value;
                      that.f_SetData(res);
                      if (res.rows.length == 1) {
                        that.f_SetIndex(0);
                        that.f_MenuHide();
                      } else {
                        that.f_MenuShow();
                      }
                    } else {
                      that.f_ClearItems();
                      that.p_Data = [];
                    }
                  } else {
                    that.f_ShowError("Ошибка запроса!");
                  }
                },
                error: function (res) {
                  var mes = res.responseText;
                  if (mes === "") {
                    mes = "Ошибка запроса!";
                    that.f_ShowError(mes);
                  }
                  else {
                    that.f_ShowError(mes);
                  }
                },
                complete: function () {

                }
              });
            }
          } else {
            this.f_ClearItems();
          }
        } else if (this.p_Data !== undefined && this.p_Data !== null) {
          for (var i = 0; i < this.p_Data.length; i++) {
            if (this.f_GetValue(this.p_Data[i]) === a_Value) {
              var valKey = Cl_Core.f_GetItemField(this.p_Data[i], this.m_FieldItemKey);
              this.f_SetKey(valKey);
              break;
            }
          }
        }
      } else {
        this.f_SetKey();
      }
    }
  };

  MaterialSelectfield.prototype.f_MenuHide = function () {
    if (this.el_MenuContainer != null) {
      this.el_MenuContainer.classList.add(this.CssClasses_.IS_MENU_HIDE);
    }
    this.el_Menu.MaterialMenu.hide();
  }

  MaterialSelectfield.prototype.f_MenuShow = function () {
    if (this.el_MenuContainer != null) {
      this.el_MenuContainer.classList.remove(this.CssClasses_.IS_MENU_HIDE);
    }
    this.el_Menu.MaterialMenu.show();
  }

  MaterialSelectfield.prototype.f_OnInputFocus = function () {
    this.el_Element.classList.add(this.CssClasses_.IS_FOCUSED);
  }

  MaterialSelectfield.prototype.f_OnInputBlur = function (e) {
    this.el_Element.classList.remove(this.CssClasses_.IS_FOCUSED);
    if (this.p_Data === undefined || this.p_Data === null || this.p_Data.length === 0) {
      this.f_SetValue();
    } else {
      if (this.f_GetSelectedKey() === null) {
        if (this.f_IsSearch()) {
          this.m_SearchText = "";
          if (this.options.searchMethod !== 'local') {
            this.f_SetData();
          } else {
            this.f_SetValue();
            this.f_InitMenu();
          }
        } else {
          this.f_SetValue();
        }
      }
    }
    this.f_MenuHide();
  }

  MaterialSelectfield.prototype.f_OnInputClick = function (e) {
    if (this.el_MenuContainer != null) {
      if (!this.m_Disabled && this.el_MenuContainer.classList.contains(this.CssClasses_.IS_MENU_HIDE) && this.p_Data !== undefined && this.p_Data !== null && this.p_Data.length > 0) {
        this.f_MenuShow();
      } else {
        this.f_MenuHide();
      }
    }
  }

  MaterialSelectfield.prototype.f_OnInputKey = function (e) {
    var that = this;
    if (e.keyCode === 38) {
      if (!this.f_SelectItem(-1) && !this.el_MenuContainer.classList.contains(this.CssClasses_.IS_MENU_HIDE)) {
        this.f_MenuHide();
      }
      e.preventDefault();
    } else if (e.keyCode === 40) {
      if (this.el_MenuContainer.classList.contains(this.CssClasses_.IS_MENU_HIDE)) {
        if (this.f_SelectItem(1)) {
          this.f_MenuShow();
        }
      } else {
        this.f_SelectItem(1);
      }
      e.preventDefault();
    } else if (e.keyCode === 13) {
      var menuItems = this.el_Menu.querySelectorAll('.' + this.CssClasses_.MENU_ITEM);
      [].forEach.call(menuItems, function (li, i) {
        if (li.classList.contains(that.CssClasses_.MENU_SELECT)) {
          li.classList.remove(that.CssClasses_.MENU_SELECT);
          that.f_SetKey(li.getAttribute('key'));
          return false;
        }
      });
      this.f_MenuHide();
      e.preventDefault();
    } else if (e.keyCode === 27) {
      that.el_Input.blur();
    } else if (this.options.readOnly) {
      e.preventDefault();
    }
  }

  MaterialSelectfield.prototype.f_OnInputKeyUp = function (e) {
    if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13 && this.f_IsSearch()) {
      this.f_SetValue(this.el_Input.value);
    }
  }

  MaterialSelectfield.prototype.f_Init = function () {
    if (this.el_Element) {
      var that = this;
      this.el_Label = this.el_Element.querySelector('.' + this.CssClasses_.LABEL);
      this.el_Input = this.el_Element.querySelector('.' + this.CssClasses_.INPUT);
      this.el_Input$ = $(this.el_Input);
      this.el_Input$.attr("autocomplete", "off");
      this.el_Menu = this.el_Element.querySelector('ul');
      if (this.el_Label == null || this.el_Input == null || this.el_Menu == null)
        return;
      if (this.el_Element.classList.contains(this.CssClasses_.IS_DISABLED)) {
        this.f_SetDisabled(true);
      }
      if (this.el_Element.classList.contains('mdl-selectfield--icon')) {
        var lbl = document.createElement('label');
        lbl.innerHTML = '<label for="' + this.el_Input.id + '"><i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i></label>';
        this.el_Element.insertBefore(lbl, this.el_Label);
      }
      if (this.m_EnabledHiddensElements) {
        this.el_ElementKey = document.createElement('input');
        this.el_ElementKey.setAttribute('type', 'hidden');
        this.el_Element.insertBefore(this.el_ElementKey, this.el_Input);
      }
      this.el_Element.classList.add('mdl-textfield', 'mdl-js-textfield');
      if (this.el_Element.classList.contains('mdl-selectfield--floating-label'))
        this.el_Element.classList.add('mdl-textfield--floating-label');
      this.el_Label.classList.add('mdl-textfield__label');
      this.el_Input.classList.add('mdl-textfield__input');
      this.el_Menu.classList.add('mdl-menu', 'mdl-menu--bottom-left');
      if (that.el_Element.hasAttribute('disabled')) {
        this.f_SetDisabled(true);
      }
      if (!that.el_Element.hasAttribute('readonly')) {
        componentHandler.upgradeElement(this.el_Menu, "MaterialMenu");
      }
      if (this.el_Menu.clientWidth !== undefined && this.el_Menu.clientWidth > 10) {
        this.el_Element.style.width = this.el_Menu.clientWidth + (this.el_Menu.clientWidth < this.el_Menu.scrollWidth ? 17 : 0) + 'px';
      } else {
        this.el_Element.style.width = this.options.minWidth + 'px';
      }
      this.el_MenuContainer = this.el_Element.querySelector('.mdl-menu__container');
      if (this.el_MenuContainer != null)
        this.el_MenuContainer.classList.add(this.CssClasses_.IS_MENU_HIDE);
      this.e_InputFocus = this.f_OnInputFocus.bind(this);
      this.e_InputBlur = this.f_OnInputBlur.bind(this);
      this.e_InputClick = this.f_OnInputClick.bind(this);
      this.e_InputKey = this.f_OnInputKey.bind(this);
      this.e_InputKeyUp = this.f_OnInputKeyUp.bind(this);
      this.e_InputPaste = this.f_OnInputKey.bind(this);
      this.el_Input.addEventListener('focus', this.e_InputFocus);
      this.el_Input.addEventListener('blur', this.e_InputBlur);
      this.el_Input.addEventListener('click', this.e_InputClick);
      this.el_Input.addEventListener('keydown', this.e_InputKey);
      this.el_Input.addEventListener('keyup', this.e_InputKeyUp);
      this.el_Input.addEventListener('paste', this.e_InputKey);

      this.p_Data = [];
      if (this.options.source !== undefined) {
        var sourceDataType = this.options.source.substring(0, 3);
        var sourceDataSource = this.options.source.substring(4, this.options.source.length);
        switch (sourceDataType) {
          case 'url':
            $.ajax({
              url: sourceDataSource,
              dataType: 'json',
              success: function (data) {
                var empty = new Object();
                empty.value = "";
                data.splice(0, 0, empty);
                that.p_Data = data;
              }
            });
            break;
          case 'var':
            var variableValues = window[sourceDataSource];
            that.p_Data = variableValues;
            break;
        }
      } else {
        var list = this.el_Element.querySelectorAll('li');
        [].forEach.call(list, function (li) {
          var item = new Object();
          item[that.m_FieldItemKey] = li.getAttribute("key");
          item[that.m_FieldItemValue] = li.textContent;
          if (li.hasAttribute('onclick')) {
            item["attr_onclick"] = li.getAttribute('onclick');
          }
          that.p_Data.push(item);
        });
      }
      var key;
      if (this.el_Input.hasAttribute("key")) {
        key = this.el_Input.getAttribute("key");
      }
      this.f_InitMenu(this.p_Data);
      if (key !== undefined) {
        this.el_Input.setAttribute("key", key);
        if (this.m_EnabledHiddensElements) {
          this.el_ElementKey.value = key;
        }
      }
      this.m_TotalRows = this.p_Data.length;

      if (this.el_Input.hasAttribute(MaterialSelectfield.prototype.m_FieldItemKey) && this.el_Input.getAttribute(MaterialSelectfield.prototype.m_FieldItemKey) !== '') {
        this.f_SetKey(this.el_Input.getAttribute(MaterialSelectfield.prototype.m_FieldItemKey));
      } else if (this.el_Input.value != "") {
        this.f_SetValue(this.el_Input.value);
      }
      this.f_CheckValidity();
    }
  };

  MaterialSelectfield.prototype.f_CheckValidity = function () {
    if (this.el_Input.validity) {
      if (this.el_Input.validity.valid) {
        this.el_Element.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.el_Element.classList.add(this.CssClasses_.IS_INVALID);
      }
    }
  };

  MaterialSelectfield.prototype.f_SelectItem = function (a_Offset) {
    var that = this;
    var menuItems = this.el_Menu.querySelectorAll('.' + this.CssClasses_.MENU_ITEM);
    var offset = 0;
    [].forEach.call(menuItems, function (li, index) {
      if (li.classList.contains(that.CssClasses_.MENU_SELECT)) {
        li.classList.remove(that.CssClasses_.MENU_SELECT);
        if (a_Offset !== undefined) {
          offset = index + a_Offset;
          return false;
        }
      }
    });
    if (a_Offset !== undefined) {
      if (menuItems.length == offset) {
        offset -= 1;
      }
      if (offset >= 0 && menuItems.length > offset) {
        var menuItem = menuItems[offset];
        if (menuItem !== undefined && menuItem !== null) {
          menuItem.classList.add(this.CssClasses_.MENU_SELECT);
          return true;
        }
      }
    }
    return false;
  }

  MaterialSelectfield.prototype.f_AddItem = function (a_Index, a_Item) {
    var itemValue = this.f_GetItemValue(a_Item);
    var val, key;
    if (itemValue === undefined) {
      itemValue = a_Item;
      val = key = a_Index;
    } else {
      val = this.f_GetValue(a_Item);
      key = Cl_Core.f_GetItemField(a_Item, this.m_FieldItemKey);
    }
    var attr = '';
    if (a_Item["attr_onclick"] !== undefined) {
      attr = ' onclick="' + a_Item["attr_onclick"] + '"';
    }
    var textHtml = '<li class="' + this.CssClasses_.MENU_ITEM + '" key="' + key + '" value="' + val + '"' + attr + '>';
    if (this.m_SearchText !== undefined && this.m_SearchText !== null && this.m_SearchText !== '') {
      var index = itemValue.toLowerCase().indexOf(this.m_SearchText.toLowerCase());
      if (index > -1) {
        textHtml += itemValue.substring(0, index);
        textHtml += '<span class="mdl-menu__item_selectValue">' + itemValue.substring(index, index + this.m_SearchText.length) + '</span>' + itemValue.substring(index + this.m_SearchText.length);
      } else {
        textHtml += itemValue;
      }
    } else {
      textHtml += itemValue;
    }
    textHtml += '</li>';
    this.el_Menu.appendChild(f_ParseHTML(textHtml));
  };

  MaterialSelectfield.prototype.f_ClearItems = function (a_Hidded) {
    if (a_Hidded === undefined || !a_Hidded) {
      this.el_Menu.innerHTML = "";
    } else {
      var list = this.el_Element.querySelectorAll('li');
      [].forEach.call(list, function (li) {
        li.classList.add("hidden");
      });
    }
    this.el_Input.setAttribute("key", "");
  };

  MaterialSelectfield.prototype.f_ShowItems = function (a_Items) {
    var that = this;
    var list = this.el_Element.querySelectorAll('li');
    [].forEach.call(list, function (li) {
      if (a_Items !== undefined) {
        var key = li.getAttribute("key");
        [].forEach.call(a_Items, function (item) {
          if (key === Cl_Core.f_GetItemField(item, that.m_FieldItemKey).toString()) {
            li.classList.remove("hidden");
          }
        });
      } else {
        li.classList.remove("hidden");
      }
    });
  };

  MaterialSelectfield.prototype.f_InitMenu = function (a_Data) {
    var that = this;
    if (that.el_MenuContainer != null)
      that.el_MenuContainer.classList.remove(that.CssClasses_.IS_MENU_HIDE);
    var f_OnMouseDownMI = function (e) {
      var rightclick;
      if (!e) var e = window.event;
      if (e.which) rightclick = (e.which == 3);
      else if (e.button) rightclick = (e.button == 2);
      if (!rightclick) {
        var key = this.getAttribute('key');
        that.f_SetKey(key);
        if (this.hasAttribute('onclick')) {
          Cl_Core.f_CalculateObjectValue(null, this.getAttribute('onclick'), [key], '');
        }
        e.preventDefault();
      }
    };

    var f_OnClickMI = function (e) {
      that.f_MenuHide();
      e.preventDefault();
    };
    this.el_Input.setAttribute("key", "");
    if (this.m_EnabledHiddensElements) {
      this.el_ElementKey.value = "";
    }
    var data = a_Data;
    if (data === undefined) {
      data = that.p_Data;
    }
    if (data === undefined || data === null) {
      that.p_Data = [];
    } else {
      if (this.f_IsSearch() && this.m_TotalRows !== undefined) {
        this.el_Menu.appendChild(f_ParseHTML('<li class="' + this.CssClasses_.MENU_ITEM + ' mdl-menu__item_title">Найдено: ' + this.m_TotalRows + '</li>'));
      }
      that.f_ClearItems();
      [].forEach.call(data, function (item, index) {
        that.f_AddItem(index, item);
      });
      if (data.length > 0) {
        this.el_Element.style.width = this.el_Menu.clientWidth + (this.el_Menu.clientWidth < this.el_Menu.scrollHeight ? 17 : 0) + 'px';
      } else if (this.el_Input.clientWidth !== undefined && this.el_Input.clientWidth > 10) {
        this.el_Element.style.width = this.el_Input.clientWidth + (this.el_Menu.clientWidth < this.el_Menu.scrollHeight ? 17 : 0) + 'px';
      } else {
        this.el_Element.style.width = this.options.minWidth + 'px';
      }
      this.f_MenuHide();
      if (this.options.readOnly) {
        this.f_SetValue();
      }
    }
    var list = this.el_Element.querySelectorAll('li');
    [].forEach.call(list, function (li) {
      li.removeEventListener('mousedown', f_OnMouseDownMI);
      li.addEventListener('mousedown', f_OnMouseDownMI, false);
      li.removeEventListener('click', f_OnClickMI);
      li.addEventListener('click', f_OnClickMI, false);
    });
    if (that.el_MenuContainer != null)
      that.el_MenuContainer.classList.add(that.CssClasses_.IS_MENU_HIDE);
  };

  MaterialSelectfield.prototype.f_SetDisabled = function (a_Disabled) {
    if (a_Disabled && !this.m_Disabled) {
      this.el_Element.classList.add(this.CssClasses_.IS_DISABLED);
      if (!this.el_Element.hasAttribute('disabled'))
        this.el_Element.setAttribute('disabled', true);
      if (!this.el_Input.hasAttribute('disabled'))
        this.el_Input.setAttribute('disabled', true);
      this.m_Disabled = true;
    } else if (!a_Disabled && this.m_Disabled) {
      this.el_Element.classList.remove(this.CssClasses_.IS_DISABLED);
      if (this.el_Element.hasAttribute('disabled'))
        this.el_Element.removeAttribute('disabled');
      if (this.el_Input.hasAttribute('disabled'))
        this.el_Input.removeAttribute('disabled');
      this.m_Disabled = false;
    }
  };

  MaterialSelectfield.prototype.f_ShowError = function (a_Msg) {
    if (this.options.showError) {
      alert(a_Msg);
    }
  };

  MaterialSelectfield.prototype.mdlDowngrade_ = function () {
    this.el_Input.removeEventListener('focus', this.e_InputFocus);
    this.el_Input.removeEventListener('blur', this.e_InputBlur);
    this.el_Input.removeEventListener('click', this.e_InputClick);
    this.el_Input.removeEventListener('keydown', this.e_InputKey);
    this.el_Input.removeEventListener('keyup', this.e_InputKeyUp);
    this.el_Input.removeEventListener('paste', this.e_InputKey);
    componentHandler.downgradeElements(this.el_Menu);
  };

  MaterialSelectfield.prototype.mdlDowngrade = MaterialSelectfield.prototype.mdlDowngrade_;
  MaterialSelectfield.prototype['mdlDowngrade'] = MaterialSelectfield.prototype.mdlDowngrade;
  componentHandler.register({
    constructor: MaterialSelectfield,
    classAsString: 'MaterialSelectfield',
    cssClass: 'mdl-js-selectfield',
    widget: true
  });
})();
