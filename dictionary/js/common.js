/* 2014-03-15 01:27:36 */
(function(k) {
  var m = window, l = document, n = navigator.userAgent.toLowerCase(), t, r = [], w = /([\-+]=)?([\.\-+\d]+)([%a-z]*)/i, p = {"inline-block":{"margin-left":1, "margin-right":1, "padding-left":1, "padding-right":1, width:1}, block:{"margin-top":1, "margin-bottom":1, "padding-top":1, "padding-bottom":1, height:1}}, x = function(a, b) {
    var c = null, c = a.currentStyle || a.style, d = c.top;
    a.style.top = c[b];
    c = a.style.pixelTop;
    a.style.top = d;
    return c
  }, h = function(a, b) {
    var c = [];
    a = (a || "").replace(/(\[|\::|\+|\>|\:|\$|\=|\~|\^|\*|\|)/g, function(a) {
      return" " + a
    }).replace(/\[.*\]|\(.*\)/g, function(a) {
      return a.replace(/\s(\::|\+|\>|\:|\$|\=|\~|\^|\*|\|)/g, function(a) {
        return a.replace(/^\s/, "")
      })
    }).replace(/(\>|\+|\~|\:|\::\.|\#)\s+/g, function(a) {
      return a.replace(/\s+$/g, "")
    }).replace(/\s+(\.)/g, function(a) {
      return a.replace(/^\s+/g, " *")
    }).replace(/^\s+|\s+$/g, "").replace(/^(\.|\::|\:)/g, function(a) {
      return"* " + a
    });
    for(var d = a.split(","), e = 0, g = d.length;e < g;) {
      for(var y = [], v = d[e].split(/\s+/), k = 0, m = v.length;k < m;) {
        y = h.query(v[k++].replace(/^\s+/, ""), y)
      }
      c = f.merge(y, c);
      e++
    }
    return f.unique(c)
  };
  h.all = l.getElementsByTagName("*");
  h.anchors = l.getElementsByTagName("a");
  h.inputs = l.getElementsByTagName("input");
  h.selectboxes = l.getElementsByTagName("select");
  h.textareas = l.getElementsByTagName("textarea");
  h.buttons = l.getElementsByTagName("button");
  h.getAllElements = function() {
    for(var a = [], b = h.all, c = 0, d = b.length;c < d;) {
      var e = b[c++];
      1 == e.nodeType && a.push(e)
    }
    return a
  };
  h.getAllInputs = function() {
    return f.merge(h.inputs, h.selectboxes, h.textareas)
  };
  h.query = function(a, b) {
    var c = a.match(/(\>|\~|\+)*(\*|\w*)(>|:|~|\.|#|\+|\^|=|,|\*|\$\||\(|\))*(.*)/), d = c[1], e = c[2], g = c[3], c = c[4];
    d ? b = h.filters[d](e, b) : e && (b = "*" == e ? h.filters["*"](e, b) : h.filters.tag(e, b));
    c && (b = h.filters[g || "attr"](c, b));
    return b
  };
  h.filters = {"*":function(a, b) {
    b = b && b.length ? b : [document];
    for(var c = [], d = 0, e = b.length;d < e;) {
      for(var g = b[d++].getElementsByTagName("*"), f = 0, v = g.length;f < v;) {
        var h = g[f++];
        1 == h.nodeType && c.push(h)
      }
    }
    return c
  }, ":":function(a, b) {
    var c = a.match(/(\S+)\s*\((.*)\)/) || [];
    c.shift();
    return h.filters.sudos[c[0] || a](b, c[1])
  }, ".":function(a, b) {
    b = b && b.length ? b : h.getAllElements();
    for(var c = [], d = 0, e = b.length;d < e;) {
      var g = b[d++];
      -1 != (" " + g.className + " ").indexOf(" " + a + " ") && c.push(g)
    }
    return c
  }, "#":function(a, b) {
    if(!b || !b.length) {
      var c = l.getElementById(a);
      return c ? [c] : []
    }
    for(var d = 0, e = b.length;d < e;) {
      if(c = b[d++], c.id = a) {
        return[c]
      }
    }
    return[]
  }, ">":function(a, b) {
    var c = [];
    a = a.toUpperCase();
    b = b && b.length ? b : [document];
    for(var d = 0, e = b.length;d < e;) {
      for(var g = b[d++].children || [], f = 0, h = g.length;f < h;) {
        var k = g[f++];
        k.tagName == a && c.push(k)
      }
    }
    return c
  }, "+":function(a, b) {
    var c = [];
    a = a.toUpperCase();
    b = b && b.length ? b : h.getAllElements();
    for(var d = 0, e = b.length;d < e;) {
      for(var g = b[d++];g && (!(g = g.nextSibling) || 1 != g.nodeType);) {
      }
      g && g.tagName == a && c.push(g)
    }
    return c
  }, "~":function(a, b) {
    var c = [];
    a = a.toUpperCase();
    b = b && b.length ? b : h.getAllElements();
    for(var d = 0, e = b.length;d < e;) {
      for(var g = b[d++];g;) {
        (g = g.nextSibling) && 1 == g.nodeType && g.tagName == a && c.push(g)
      }
    }
    return c
  }, attr:function(a, b) {
    var c = a.replace(/\]\s+\[/, "").split(/\]\[|\[/);
    c.shift();
    for(var d = 0, e = c.length;d < e;) {
      var g = c[d++].replace(/\[|\]/g, "").match(/(\w+)([^a-z0-9\s]*)(.*)/i);
      b = h.filters.attrs(g[1], b, g[2], g[3])
    }
    return b
  }, tag:function(a, b) {
    b = b && b.length ? b : [document];
    for(var c = [], d = 0, e = b.length;d < e;) {
      f.merge(b[d++].getElementsByTagName(a), c)
    }
    return c
  }};
  h.filters.attrs = function(a, b, c, d) {
    b = b && b.length ? b : h.getAllElements();
    var e = [], g = 0, f = b.length;
    d = {"=":"^" + d + "$", "$=":d + "$", "^=":"^" + d, "*=":d, "~=":"^" + d + " | " + d + " |^" + d + "$| " + d + "$", "|=":"^" + d + "|^" + d + "$|-" + d}[c];
    if(c) {
      for(;g < f;) {
        c = b[g++];
        var k = c.getAttribute(a);
        k && k.match(d) && e.push(c)
      }
    }else {
      for(;g < f;) {
        c = b[g++], c.hasAttribute(a) && e.push(c)
      }
    }
    return e
  };
  h.filters.sudos = {root:function() {
  }, "nth-child":function(a, b) {
    var c = [], d = 0, e = a.length;
    if(isNaN(b)) {
      if(b && "n" != b && "1n" != b) {
        "odd" == b ? b = "2n+1" : "even" == b && (b = "2n")
      }else {
        return a
      }
      var g = b.match(/(\d*)(n{0,1})(\+|\-*)(\d*)/);
      g.shift();
      for(var f = Number(g[0]), g = Number(g[2] + g[3]);d < e;) {
        for(var h = a[d], k = h.parentNode.children, m = 0, l = k.length, q = 0;q < l;) {
          q = f * m + g;
          if(k[q - 1] == h) {
            c.push(h);
            break
          }
          m++
        }
        d++
      }
    }else {
      for(;d < e;) {
        h = a[d++], h.parentNode.childNodes[b] == h && c.push(h)
      }
    }
    return c
  }, "nth-last-child":function() {
  }, "nth-of-type":function() {
  }, "nth-last-of-type":function() {
  }, "first-child":function(a) {
    a = a && a.length ? a : h.getAllElements();
    for(var b = [], c = 0, d = a.length;c < d;) {
      var e = a[c++];
      e.parentNode.children[0] === e && b.push(e)
    }
    return b
  }, "last-child":function(a) {
    a = a && a.length ? a : h.getAllElements();
    for(var b = [], c = 0, d = a.length;c < d;) {
      var e = a[c++], g = e.parentNode.children;
      g[g.length - 1] === e && b.push(e)
    }
    return b
  }, "first-of-type":function() {
  }, "only-child":function(a) {
    a = a && a.length ? a : h.getAllElements();
    for(var b = [], c = 0, d = a.length;c < d;) {
      var e = a[c++], g = e.parentNode.children;
      1 == g.length && g[0] === e && b.push(e)
    }
    return b
  }, "only-of-type":function() {
  }, empty:function(a) {
    a = a && a.length ? a : h.getAllElements();
    for(var b = [], c = 0, d = a.length;c < d;) {
      var e = a[c++];
      e.hasChildNodes() || b.push(e)
    }
    return b
  }, link:function() {
    el = el && el.length ? el : h.anchors;
    return filter.filters.attrs("href", el, "!=", null)
  }, visited:function() {
  }, active:function() {
  }, hover:function() {
  }, focus:function() {
  }, lang:function(a, b) {
    return filter.filters.attrs("lang", a, "=", b)
  }, enabled:function(a) {
    a = a && a.length ? a : h.getAllInputs();
    return filter.filters.attrs("disabled", a, "!=", "disabled")
  }, disabled:function(a) {
    a = a && a.length ? a : h.getAllInputs();
    return filter.filters.attrs("disabled", a, "", "disabled")
  }, checked:function(a) {
    a = a && a.length ? a : h.inputs;
    return filter.filters.attrs("checked", a, "", "checked")
  }, not:function(a, b) {
    var c = [], d = h.query(b);
    f.filter(a, function(a) {
      -1 == f.search(d, a) && c.push(a)
    }, d);
    return c
  }};
  var s = function(a, b) {
    this.length = 0;
    b = (b && b.charAt ? f.trim(b) : b) || m._doc;
    this.selector = a = (a = a && a.charAt ? f.trim(a) : a) ? a : document;
    this.context = b;
    if(a.charAt && "<" == a.charAt(0)) {
      var c = 0, d = l.createDocumentFragment(), e = a.match(/^(<tbody|<thead|<tfoot)/i) ? "table" : "body", e = a.match(/^(<tr)/i) ? "tbody" : e, e = a.match(/^(<td)/i) ? "tr" : e, e = l.createElement(e), g;
      for(e.innerHTML = a;g = e.firstChild;) {
        this[c++] = g, d.appendChild(g)
      }
      this.length = c
    }else {
      if(a.appendChild || typeof a == typeof l || typeof a == typeof m) {
        this[0] = a, this.length = 1
      }else {
        if(a.xMagic) {
          return a
        }
        "function" === typeof a ? f.ready(a) : (this.elements = h(a, b), f.makeArray(this.elements, this))
      }
    }
  };
  s.prototype = {addClass:function(a) {
    if(a && "string" === typeof a) {
      for(var b = (a || "").split(/\s+/), c = 0, d = this.length;c < d;) {
        var e = this[c++];
        if(1 === e.nodeType) {
          if(e.className) {
            for(var g = " " + e.className + " ", h = e.className, k = 0, m = b.length;k < m;) {
              0 > g.indexOf(" " + b[k] + " ") && (h += " " + b[k]), k++
            }
            e.className = f.trim(h)
          }else {
            e.className = a
          }
        }
      }
    }
    return this
  }, animate:function(a, b, c, d) {
    var e, g;
    for(g in a) {
      if(p["inline-block"][g]) {
        e = "inline-block";
        break
      }
    }
    for(g in a) {
      if(p.block[g]) {
        e = "block";
        break
      }
    }
    this.each(function(a) {
      var b = f(a).css("display");
      "none" != b && e && "block" != b && b != e && (a.style.display = e)
    });
    for(var h in a) {
      f.fx(this, h, a[h], b, d)
    }
    return this
  }, append:function(a) {
    a = f(a);
    this.each(function(b) {
      a.each(function(a) {
        b.appendChild(a)
      })
    });
    return this
  }, appendTo:function(a, b) {
    var c = f(a, b);
    this.each(function(a) {
      c.append(a)
    });
    return this
  }, css:function(a, b) {
    var c = l.defaultView || {};
    if("string" === typeof a) {
      var d = f.camelCase(a);
      if(void 0 === b) {
        return c.getComputedStyle ? c.getComputedStyle(this[0], null).getPropertyValue(a) : p["inline-block"][a] || p.block[a] ? x(this[0], d) + "px" : this[0].currentStyle[d]
      }
      this.each(function(a) {
        1 == a.nodeType && (a.style[d] = b)
      })
    }else {
      var c = 0, e = [], g = [], h;
      for(h in a) {
        e[c] = f.camelCase(h), g[c] = a[h], c++
      }
      this.each(function(a) {
        if(1 == a.nodeType) {
          for(var b = 0, c = e.length;b < c;) {
            a.style[e[b]] = g[b], b++
          }
        }
      })
    }
    return this
  }, each:function(a) {
    for(var b = 0, c = this.length;b < c && !1 !== a(this[b], b, this);) {
      b++
    }
    return this
  }, empty:function() {
    this.each(function(a) {
      for(;a.firstChild;) {
        a.removeChild(a.firstChild)
      }
    });
    return this
  }, flash:function(a) {
    this.each(function(b) {
      var c = f.flash(a, a);
      b.parentNode.replaceChild(c, b)
    });
    return f(this.selector, this.context)
  }, hasClass:function(a, b) {
    b = "object" === typeof b ? b : this[0];
    return f.hasClass(a, b)
  }, hide:function() {
    this.each(function(a) {
      a.style.display = "none"
    });
    return this
  }, html:function(a) {
    if("object" !== typeof a && null !== a) {
      var b = this;
      this.each(function(c) {
        b.empty(c);
        c.innerHTML = a
      })
    }
    return this
  }, removeAttr:function(a, b) {
    this.each(function(b) {
      1 == b.nodeType && b.removeAttribute(a)
    });
    return this
  }, removeClass:function(a) {
    if(a) {
      a = a.split(/\s+/);
      for(var b = 0, c = this.length;b < c;) {
        var d = this[b++];
        if(d.className) {
          for(var e = " " + d.className + " ", g = 0, h = a.length;g < h;) {
            e = " " + e.replace(" " + a[g++] + " ", " ") + " "
          }
          d.className = f.trim(e)
        }
      }
    }else {
      this.each(function(a) {
        a.className && (a.className = "")
      })
    }
    return this
  }, show:function() {
    this.each(function(a) {
      a.style.display = "block"
    });
    return this
  }, text:function(a) {
    if("object" !== typeof a && null !== a) {
      var b = this;
      this.each(function(c) {
        b.empty(c);
        c.appendChild((c && c.ownerDocument || l).createTextNode(a))
      })
    }
    return this
  }, trigger:function(a) {
    this.each(function(b) {
      b[a]()
    })
  }, size:function() {
    return this.length
  }, type:"xMagic"};
  (function() {
    for(var a = "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend orientationchange change select submit keydown keypress keyup error".split(" "), b = 0;a[b++];) {
      var c = a[b];
      s.prototype[c] = function(a) {
        return function(b) {
          f.each(this, function(c) {
            f.bind(a, function(a) {
              a.preventDefault = a.preventDefault ? a.preventDefault : function() {
                return a.returnValue = !1
              };
              a.stopPropagation = a.stopPropagation ? a.stopPropagation : function() {
                a.cancelBubble = !0
              };
              b.call(c, a)
            }, c)
          });
          return this
        }
      }(c)
    }
  })();
  var f = window.xMagic = window.xMagic || function(a, b) {
    return new s(a, b)
  };
  f.addCssRule = function(a, b, c, d) {
    c = c || f.getCss("last");
    var e = c.cssRules ? c.cssRules : c.rules;
    d = d || e.length;
    c.cssRules ? c.insertRule(a + "{" + b + "}", d) : c.addRule(a, b, d);
    return f(a)
  };
  f.bind = function(a, b, c) {
    var d = function(c) {
      m.addEventListener ? c.addEventListener(a, b, 0) : m.attachEvent && c.attachEvent("on" + a, b)
    };
    c ? d(c) : this.each(function(a) {
      d(a)
    });
    return this
  };
  f.camelCase = function(a) {
    return a.replace(/\-(\w)/g, function(a, c) {
      return c.toUpperCase()
    })
  };
  f.clean = function(a) {
    return(a || "").replace(/\s+/g, " ")
  };
  f.each = function(a, b) {
    for(var c = 0, d = a.length;c < d;) {
      b.call(a, a[c++])
    }
    return this
  };
  f.flash = l.all && !m.opera ? function(a) {
    var b = document.createElement("embed");
    b.setAttribute("type", "application/x-shockwave-flash");
    b.setAttribute("pluginspage", "https://get.adobe.com/flashplayer/");
    for(var c in a) {
      b.setAttribute(c, a[c])
    }
    return b
  } : function(a) {
    var b = document.createElement("object");
    b.setAttribute("type", "application/x-shockwave-flash");
    b.setAttribute("codebase", "https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9.0.115");
    b.setAttribute("width", a.width);
    b.setAttribute("height", a.height);
    b.setAttribute("id", a.id);
    b.setAttribute("data", a.src);
    a.movie = a.src;
    delete a.width;
    delete a.height;
    delete a.src;
    delete a.id;
    for(var c in a) {
      var d = document.createElement("param");
      d.setAttribute("name", c);
      d.setAttribute("value", a[c]);
      b.appendChild(d)
    }
    return b
  };
  f.fx = function(a, b, c, d, e) {
    var g = [], h = [], k = [];
    e = 0;
    for(var l = a.length, n = 18 * l, r = d / n;e < l;) {
      var q = a[e++];
      d = w.exec(c);
      var u = f(q), p = parseFloat(w.exec(u.css(b))[2]), s = parseFloat(d[2]);
      if(d[3] && "px" != d[3].toLowerCase()) {
        var t = q.style[b] || u.css(b), u = parseFloat(w.exec(u.css(b, c).css(b))[2]);
        q.style[b] = t;
        p *= s / u
      }
      q = s - p;
      h.push(p);
      k.push(d);
      g.push(q / r)
    }
    var z = 0, x = m.setInterval(function() {
      for(var c = z, d = 0, e = a.length;d < e;) {
        a[d].style[b] = h[d] + Math.round(g[d] * c) + k[d][3], d++
      }
      z++;
      if(z == Math.round(r - 1)) {
        clearInterval(x);
        for(d = 0;d < e;) {
          c = k[d], a[d].style[b] = 0 < c[2] ? c[2] + c[3] : 0, d++
        }
        console.log(performance.now())
      }
    }, n)
  };
  f.getCss = function(a) {
    var b = document.styleSheets, c = b.length - 1, d = b[c];
    a = a.toLowerCase();
    if("last" === a) {
      return d
    }
    if("first" === a) {
      return b[0]
    }
    if(!a) {
      return b
    }
    if(!isNaN(a)) {
      return a > c ? null : b[a]
    }
  };
  f.getCssRule = function(a, b) {
    b = b || f.getCss("last");
    var c = b.cssRules ? b.cssRules : b.rules;
    if(!isNaN(a) && a < c.length - 1) {
      return c[a]
    }
  };
  f.hasClass = function(a, b) {
    return b.className && "string" === typeof a ? -1 != (" " + b.className + " ").indexOf(" " + a + " ") ? 1 : 0 : b.className
  };
  f.isArray = function(a) {
    return a.splice
  };
  f.isNodeList = function(a) {
    return a.item
  };
  f.makeArray = function(a, b) {
    b = b || [];
    if("msie" != f.browser.browser) {
      Array.prototype.push.apply(b, [].slice.call(a, 0))
    }else {
      if(9 > f.browser.version) {
        f.isArray(b) || (b.push = Array.prototype.push, b.length = b.length || 0);
        for(var c = 0, d = a.length;c < d;) {
          b.push(a[c++])
        }
      }else {
        Array.prototype.push.apply(b, a)
      }
    }
    return b
  };
  f.namespace = function(a) {
    return a ? (m[a] = f, m[a]) : f
  };
  f.ready = function(a) {
    if("function" === typeof a) {
      t ? a() : r[r.length] = a
    }else {
      if(!t) {
        for(t = 1, a = r.length;a--;) {
          r[a]()
        }
      }
    }
  };
  f.removeCssRule = function(a, b) {
    b = b || f.getCss("last");
    var c = b.cssRules ? b.cssRules : b.rules;
    isNaN(a) || a > c.length - 1 || (b.cssRules ? b.deleteRule(a) : b.removeRule(a));
    return f(a)
  };
  f.target = function(a) {
    return a.srcElement || a.target
  };
  f.tmpl = function(a, b) {
    var c = new Function("data", "with (data) {return '" + a.replace(/'/g, "\\'").replace(/<%=/g, "' + ").replace(/%>/g, " + '") + "'}");
    return b ? c(b) : c
  };
  f.trim = function(a) {
    return(a || "").replace(/^\s+|\s+$/g, "")
  };
  f.filter = Array.prototype.filter ? function(a, b, c) {
    return Array.prototype.filter.call(a, b, c)
  } : function(a, b) {
    var c = Object(this);
    if("function" !== typeof b) {
      throw new TypeError;
    }
    var d = [], e;
    for(e in c) {
      c.hasOwnProperty(e) && b.call(b, c[e], e, c) && d.push(c[e])
    }
    return d
  };
  f.isArray = function() {
  };
  f.merge = function(a, b) {
    b = b || [];
    a.length && Array.prototype.push.apply(b, a);
    return b
  };
  f.search = Array.prototype.indexOf ? function(a, b, c) {
    return Array.prototype.indexOf.call(a, b, c)
  } : function(a, b, c) {
    var d, e = Object(a), f = e.length >>> 0;
    if(0 === f) {
      return-1
    }
    d = 0;
    1 < arguments.length && (d = Number(arguments[1]), d != d ? d = 0 : 0 != d && Infinity != d && -Infinity != d && (d = (0 < d || -1) * Math.floor(Math.abs(d))));
    if(d >= f) {
      return-1
    }
    for(d = 0 <= d ? d : Math.max(f - Math.abs(d), 0);d < f;d++) {
      if(d in e && e[d] === b) {
        return d
      }
    }
    return-1
  };
  f.unique = function(a) {
    for(var b = [], c = 0, d = a.length;c < d;) {
      -1 == f.search(b, a[c]) && b.push(a[c]), c++
    }
    return b
  };
  (function() {
    var a = /(webkit)[ \/]([\w.]+)/.exec(n) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(n) || /(msie) ([\w.]+)/.exec(n) || !/compatible/.test(n) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(n) || [];
    f.browser = {browser:a[1] || "", version:a[2] || "0"}
  })();
  document.addEventListener ? document.addEventListener("DOMContentLoaded", function() {
    f.ready.call(this)
  }, !1) : document.all && !window.opera && (document.write('<script id="contentloadtag" defer="defer" src="javascript:void(0)">\x3c/script>'), document.getElementById("contentloadtag").onreadystatechange = function() {
    "complete" == this.readyState && (s("#contentloadtag")[0].parentNode.removeChild(f("#contentloadtag")[0]), f.ready.call(this))
  });
  window[k] = xMagic
})("x$");
window.gwg = window.gwg || {param:[]};
gwg.APP_LIST = ["dictionary", "quotes"];
gwg.APP_REDIRECT_LIST = {quote:"quotes"};
gwg.APP_NAME = function() {
  var k = (location.pathname.split("/")[1] || "").toLowerCase();
  return k && -1 < gwg.APP_LIST.indexOf(k) ? k : gwg.APP_REDIRECT_LIST[k] || !1
}();
x$(document).click(function(k) {
  "q" != x$.target(k).id && (x$("#q").removeClass("q-onfocus"), x$("#search-box-wrapper").removeClass("q-onfocus"))
});
x$("#q").focus(function() {
  x$("#q").addClass("q-onfocus");
  x$("#search-box-wrapper").addClass("q-onfocus")
});
/*gwg.param.qTrigger && x$("#q").trigger("focus");
 (function() {
  "dictionary" == gwg.APP_NAME && x$("#body-b-column").dblclick(function() {
    var k = x$.trim(getSelection().toString());
    k && (location.href = "/dictionary/" + k)
  });
  gwg.queryRedirect = function(k) {
    var m = escape(x$.trim(x$("#q")[0].value)), l = x$.trim(m).replace(/%20|\\s/g, "+"), n = location.host.split(".");
    k = gwg.APP_NAME || "dictionary";
    location.href = m ? "www" == n[0] ? "/" + k + "/" + l : "/" + l : "/";
    return!1
  };
 gwg.connloop = function() {
    setInterval(function() {
      var k = new (window.XMLHttpRequest || window.ActiveXObject("Microsoft.XMLHTTP"));
      k.open("HEAD", "/auto/generate_204/", 1);
      k.send(null)
    }, 45E3)
  };
  gwg.connloop();
  gwg.connloop()
})();*/
var gwg = gwg || {};
gwg.template = {popUpLink:'<a style="<%=css%>" onclick="gwg.popItUp({url: \'<%=url%>\', height: <%=height%>, width: <%=width%>});return false;" href="<%=url%>"><%=text%></a>', printLink:'<a href="#" onclick="window.print();return false;">Print</a>'};
gwg = gwg || {};
gwg.speaker = function(k) {
  this.isLoaded = function(k) {
    return"undefined" != typeof k ? 100 == k.PercentLoaded() : !1
  };
  this.play = function() {
    k.TCallLabel("/", "play")
  };
  this.stop = function() {
    k.TCallLabel("/", "stop")
  };
  this.pause = function() {
    k.TCallLabel("/", "pause")
  };
  this.playToggle = function() {
    k.TCallLabel("/", "playToggle")
  };
  this.reset = function() {
    k.TCallLabel("/", "reset")
  };
  this.load = function(m) {
    k.SetVariable("currentSong", m);
    k.TCallLabel("/", "load")
  };
  this.loadAndPlay = function(k) {
    this.load(k);
    this.play()
  };
  this.getState = function() {
    var m = k.GetVariable("playingState"), l = k.GetVariable("loadingState");
    return"playing" == m ? "loaded" == l ? m : l : "stopped" == m && "empty" == l ? l : "error" == l ? l : m
  };
  this.getPlayingState = function() {
    return k.GetVariable("playingState")
  };
  this.getLoadingState = function() {
    return k.GetVariable("loadingState")
  };
  this.registerEvent = function(m, l) {
    k.SetVariable(m, l)
  };
  this.speaker = k;
  return this
};