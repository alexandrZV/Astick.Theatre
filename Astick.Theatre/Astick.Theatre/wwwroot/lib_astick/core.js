"use strict";
(function () {
  if (typeof window.CustomEvent === "function") return false;
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

function f_SetStoreSettings(name, val) {
  if (typeof (Storage) !== "undefined") {
    localStorage.setItem(name, val);
  } else {
    window.alert('Please use a modern browser to properly view this template!');
  }
}

function f_GetStoreSettings(name) {
  if (typeof (Storage) !== "undefined") {
    return localStorage.getItem(name);
  } else {
    window.alert('Please use a modern browser to properly view this template!');
  }
}

var Cl_Core = function () {

};
// it only does '%s', and return '' when arguments are undefined
Cl_Core.f_Sprintf = function (a_Str) {
  var args = arguments,
    flag = true,
    i = 1;
  a_Str = a_Str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? a_Str : '';
};
Cl_Core.f_GetFormatNumber = function (a_Value) {
  return a_Value.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};
Cl_Core.f_GetFormatMoney = function (a_Value) {
  if (a_Value == null || a_Value == undefined || a_Value == "")
    return "0,00";
  var price = a_Value.toString().replace(".", ",");
  var cIndex = price.indexOf(",");
  if (cIndex == -1) {
    price += ",00";
  } else if (price.length == cIndex + 2) {
    price += "0";
  }
  return this.f_GetFormatNumber(price);
};
Cl_Core.f_GetItemField = function (a_Item, a_Field) {
  var value = a_Item;

  if (typeof a_Field !== 'string' || a_Item.hasOwnProperty(a_Field)) {
    return a_Item[a_Field];
  }
  var props = a_Field.split('.');
  for (var p in props) {
    if (value !== undefined && value !== null) {
      value = value[props[p]];
    } else {
      value = '-';
    }
  }
  return value;
};

Cl_Core.f_CompareObjects = function (a_ObjectA, a_ObjectB, a_CompareLength) {
  // Create arrays of property names
  var objectAProperties = Object.getOwnPropertyNames(a_ObjectA),
    objectBProperties = Object.getOwnPropertyNames(a_ObjectB),
    propName = '';
  if (a_CompareLength) {
    // If number of properties is different, objects are not equivalent
    if (objectAProperties.length !== objectBProperties.length) {
      return false;
    }
  }
  for (var i = 0; i < objectAProperties.length; i++) {
    propName = objectAProperties[i];
    // If the property is not in the object B properties, continue with the next property
    if ($.inArray(propName, objectBProperties) > -1) {
      // If values of same property are not equal, objects are not equivalent
      if (a_ObjectA[propName] !== a_ObjectB[propName]) {
        return false;
      }
    }
  }
  // If we made it this far, objects are considered equivalent
  return true;
};

Cl_Core.f_ParseHTML = function (a_Html) {
  var tmpl = document.createElement('div');
  tmpl.innerHTML = a_Html;
  return tmpl.firstChild.cloneNode(true);
};

Cl_Core.f_AddClasses = function (a_El, a_Classes) {
  a_Classes = Array.prototype.slice.call(arguments, 1);
  for (var i = a_Classes.length; i--;) {
    a_Classes[i] = a_Classes[i].trim().split(/\s*,\s*|\s+/);
    for (var j = a_Classes[i].length; j--;)
      a_El.classList.add(a_Classes[i][j]);
  }
};

Cl_Core.f_RemoveClasses = function (a_El, a_Classes) {
  a_Classes = Array.prototype.slice.call(arguments, 1);
  for (var i = a_Classes.length; i--;) {
    a_Classes[i] = a_Classes[i].trim().split(/\s*,\s*|\s+/);
    for (var j = a_Classes[i].length; j--;)
      a_El.classList.remove(a_Classes[i][j]);
  }
};

Cl_Core.f_CalculateObjectValue = function (a_Self, a_Name, a_Args, a_DefaultValue) {
  if (a_Name != null) {
    var args = a_Args;
    var func = a_Name;
    var setArgs = function (a_Func) {
      var funcArgs = a_Func.match(/\(.*?\)/i);
      if (funcArgs != null && funcArgs.length === 1) {
        var argsF = funcArgs[0].replace(/\s|\(|\)/g, '').split(',');
        for (var i = 0; i < argsF.length; i++) {
          if (argsF[i].length > 0) {
            args.push(argsF[i].replace(/'|"/g, ''));
          }
        }
      }
    };
    if (typeof a_Name === 'string') {
      // support obj.func1.func2
      var names = a_Name.split('.');
      if (names.length > 1) {
        func = window;
        $.each(names, function (i, f) {
          setArgs(f);
          func = func[f.replace(/\(.*?\)/i, '')];
        });
      } else {
        setArgs(a_Name);
        func = window[a_Name.replace(/\(.*?\)/i, '')];
      }
    }
    if (typeof func === 'object') {
      return func;
    }
    if (typeof func === 'function') {
      return func.apply(a_Self, args);
    }
    if (!func && typeof a_Name === 'string' && Cl_Core.f_Sprintf.apply(this, [a_Name].concat(args))) {
      return Cl_Core.f_Sprintf.apply(this, [a_Name].concat(args));
    }
  }
  return a_DefaultValue;
};

Cl_Core.f_EscapeHTML = function (a_Text) {
  if (typeof a_Text === 'string') {
    return a_Text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  return a_Text;
};

Cl_Core.f_GetPropertyFromOther = function (a_List, a_From, a_To, a_Value) {
  var result = '';
  $.each(a_List, function (i, item) {
    if (item[a_From] === a_Value) {
      result = item[a_To];
      return false;
    }
    return true;
  });
  return result.replace('<br />', ' ').replace('<br>', ' ');
};

Cl_Core.f_GetPropByString = function (obj, propString) {
  if (!propString)
    return obj;
  var prop, props = propString.split('.');
  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];
    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
};

Cl_Core.f_GetRealDataAttr = function (a_DataAttr) {
  for (var attr in a_DataAttr) {
    var auxAttr = attr.split(/(?=[A-Z])/).join('-').toLowerCase();
    if (auxAttr !== attr) {
      a_DataAttr[auxAttr] = a_DataAttr[attr];
      delete a_DataAttr[attr];
    }
  }
  return a_DataAttr;
};


Cl_Core.f_IsElementInView = function (element, fullyInView) {
  var pageTop = $(window).scrollTop();
  var pageBottom = pageTop + $(window).height();
  var elementTop = $(element).offset().top;
  var elementBottom = elementTop + $(element).height();

  if (fullyInView === true) {
    return ((pageTop < elementTop) && (pageBottom > elementBottom));
  } else {
    return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
  }
};

