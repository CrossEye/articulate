// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p;
var v;
var y;
var d = {};
var w = [];
var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var g = Array.isArray;
function m(n4, l5) {
  for (var u6 in l5) n4[u6] = l5[u6];
  return n4;
}
function b(n4) {
  n4 && n4.parentNode && n4.parentNode.removeChild(n4);
}
function k(l5, u6, t5) {
  var i4, r4, o4, e4 = {};
  for (o4 in u6) "key" == o4 ? i4 = u6[o4] : "ref" == o4 ? r4 = u6[o4] : e4[o4] = u6[o4];
  if (arguments.length > 2 && (e4.children = arguments.length > 3 ? n.call(arguments, 2) : t5), "function" == typeof l5 && null != l5.defaultProps) for (o4 in l5.defaultProps) void 0 === e4[o4] && (e4[o4] = l5.defaultProps[o4]);
  return x(l5, e4, i4, r4, null);
}
function x(n4, t5, i4, r4, o4) {
  var e4 = { type: n4, props: t5, key: i4, ref: r4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o4 ? ++u : o4, __i: -1, __u: 0 };
  return null == o4 && null != l.vnode && l.vnode(e4), e4;
}
function S(n4) {
  return n4.children;
}
function C(n4, l5) {
  this.props = n4, this.context = l5;
}
function $(n4, l5) {
  if (null == l5) return n4.__ ? $(n4.__, n4.__i + 1) : null;
  for (var u6; l5 < n4.__k.length; l5++) if (null != (u6 = n4.__k[l5]) && null != u6.__e) return u6.__e;
  return "function" == typeof n4.type ? $(n4) : null;
}
function I(n4) {
  if (n4.__P && n4.__d) {
    var u6 = n4.__v, t5 = u6.__e, i4 = [], r4 = [], o4 = m({}, u6);
    o4.__v = u6.__v + 1, l.vnode && l.vnode(o4), q(n4.__P, o4, u6, n4.__n, n4.__P.namespaceURI, 32 & u6.__u ? [t5] : null, i4, null == t5 ? $(u6) : t5, !!(32 & u6.__u), r4), o4.__v = u6.__v, o4.__.__k[o4.__i] = o4, D(i4, o4, r4), u6.__e = u6.__ = null, o4.__e != t5 && P(o4);
  }
}
function P(n4) {
  if (null != (n4 = n4.__) && null != n4.__c) return n4.__e = n4.__c.base = null, n4.__k.some(function(l5) {
    if (null != l5 && null != l5.__e) return n4.__e = n4.__c.base = l5.__e;
  }), P(n4);
}
function A(n4) {
  (!n4.__d && (n4.__d = true) && i.push(n4) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
}
function H() {
  try {
    for (var n4, l5 = 1; i.length; ) i.length > l5 && i.sort(e), n4 = i.shift(), l5 = i.length, I(n4);
  } finally {
    i.length = H.__r = 0;
  }
}
function L(n4, l5, u6, t5, i4, r4, o4, e4, f4, c4, s4) {
  var a4, h5, p5, v5, y6, _5, g5, m6 = t5 && t5.__k || w, b5 = l5.length;
  for (f4 = T(u6, l5, m6, f4, b5), a4 = 0; a4 < b5; a4++) null != (p5 = u6.__k[a4]) && (h5 = -1 != p5.__i && m6[p5.__i] || d, p5.__i = a4, _5 = q(n4, p5, h5, i4, r4, o4, e4, f4, c4, s4), v5 = p5.__e, p5.ref && h5.ref != p5.ref && (h5.ref && J(h5.ref, null, p5), s4.push(p5.ref, p5.__c || v5, p5)), null == y6 && null != v5 && (y6 = v5), (g5 = !!(4 & p5.__u)) || h5.__k === p5.__k ? (f4 = j(p5, f4, n4, g5), g5 && h5.__e && (h5.__e = null)) : "function" == typeof p5.type && void 0 !== _5 ? f4 = _5 : v5 && (f4 = v5.nextSibling), p5.__u &= -7);
  return u6.__e = y6, f4;
}
function T(n4, l5, u6, t5, i4) {
  var r4, o4, e4, f4, c4, s4 = u6.length, a4 = s4, h5 = 0;
  for (n4.__k = new Array(i4), r4 = 0; r4 < i4; r4++) null != (o4 = l5[r4]) && "boolean" != typeof o4 && "function" != typeof o4 ? ("string" == typeof o4 || "number" == typeof o4 || "bigint" == typeof o4 || o4.constructor == String ? o4 = n4.__k[r4] = x(null, o4, null, null, null) : g(o4) ? o4 = n4.__k[r4] = x(S, { children: o4 }, null, null, null) : void 0 === o4.constructor && o4.__b > 0 ? o4 = n4.__k[r4] = x(o4.type, o4.props, o4.key, o4.ref ? o4.ref : null, o4.__v) : n4.__k[r4] = o4, f4 = r4 + h5, o4.__ = n4, o4.__b = n4.__b + 1, e4 = null, -1 != (c4 = o4.__i = O(o4, u6, f4, a4)) && (a4--, (e4 = u6[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i4 > s4 ? h5-- : i4 < s4 && h5++), "function" != typeof o4.type && (o4.__u |= 4)) : c4 != f4 && (c4 == f4 - 1 ? h5-- : c4 == f4 + 1 ? h5++ : (c4 > f4 ? h5-- : h5++, o4.__u |= 4))) : n4.__k[r4] = null;
  if (a4) for (r4 = 0; r4 < s4; r4++) null != (e4 = u6[r4]) && 0 == (2 & e4.__u) && (e4.__e == t5 && (t5 = $(e4)), K(e4, e4));
  return t5;
}
function j(n4, l5, u6, t5) {
  var i4, r4;
  if ("function" == typeof n4.type) {
    for (i4 = n4.__k, r4 = 0; i4 && r4 < i4.length; r4++) i4[r4] && (i4[r4].__ = n4, l5 = j(i4[r4], l5, u6, t5));
    return l5;
  }
  n4.__e != l5 && (t5 && (l5 && n4.type && !l5.parentNode && (l5 = $(n4)), u6.insertBefore(n4.__e, l5 || null)), l5 = n4.__e);
  do {
    l5 = l5 && l5.nextSibling;
  } while (null != l5 && 8 == l5.nodeType);
  return l5;
}
function O(n4, l5, u6, t5) {
  var i4, r4, o4, e4 = n4.key, f4 = n4.type, c4 = l5[u6], s4 = null != c4 && 0 == (2 & c4.__u);
  if (null === c4 && null == e4 || s4 && e4 == c4.key && f4 == c4.type) return u6;
  if (t5 > (s4 ? 1 : 0)) {
    for (i4 = u6 - 1, r4 = u6 + 1; i4 >= 0 || r4 < l5.length; ) if (null != (c4 = l5[o4 = i4 >= 0 ? i4-- : r4++]) && 0 == (2 & c4.__u) && e4 == c4.key && f4 == c4.type) return o4;
  }
  return -1;
}
function z(n4, l5, u6) {
  "-" == l5[0] ? n4.setProperty(l5, null == u6 ? "" : u6) : n4[l5] = null == u6 ? "" : "number" != typeof u6 || _.test(l5) ? u6 : u6 + "px";
}
function N(n4, l5, u6, t5, i4) {
  var r4, o4;
  n: if ("style" == l5) if ("string" == typeof u6) n4.style.cssText = u6;
  else {
    if ("string" == typeof t5 && (n4.style.cssText = t5 = ""), t5) for (l5 in t5) u6 && l5 in u6 || z(n4.style, l5, "");
    if (u6) for (l5 in u6) t5 && u6[l5] == t5[l5] || z(n4.style, l5, u6[l5]);
  }
  else if ("o" == l5[0] && "n" == l5[1]) r4 = l5 != (l5 = l5.replace(a, "$1")), o4 = l5.toLowerCase(), l5 = o4 in n4 || "onFocusOut" == l5 || "onFocusIn" == l5 ? o4.slice(2) : l5.slice(2), n4.l || (n4.l = {}), n4.l[l5 + r4] = u6, u6 ? t5 ? u6[s] = t5[s] : (u6[s] = h, n4.addEventListener(l5, r4 ? v : p, r4)) : n4.removeEventListener(l5, r4 ? v : p, r4);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l5 = l5.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l5 && "height" != l5 && "href" != l5 && "list" != l5 && "form" != l5 && "tabIndex" != l5 && "download" != l5 && "rowSpan" != l5 && "colSpan" != l5 && "role" != l5 && "popover" != l5 && l5 in n4) try {
      n4[l5] = null == u6 ? "" : u6;
      break n;
    } catch (n5) {
    }
    "function" == typeof u6 || (null == u6 || false === u6 && "-" != l5[4] ? n4.removeAttribute(l5) : n4.setAttribute(l5, "popover" == l5 && 1 == u6 ? "" : u6));
  }
}
function V(n4) {
  return function(u6) {
    if (this.l) {
      var t5 = this.l[u6.type + n4];
      if (null == u6[c]) u6[c] = h++;
      else if (u6[c] < t5[s]) return;
      return t5(l.event ? l.event(u6) : u6);
    }
  };
}
function q(n4, u6, t5, i4, r4, o4, e4, f4, c4, s4) {
  var a4, h5, p5, v5, y6, d5, _5, k4, x5, M2, $3, I3, P3, A3, H3, T5 = u6.type;
  if (void 0 !== u6.constructor) return null;
  128 & t5.__u && (c4 = !!(32 & t5.__u), o4 = [f4 = u6.__e = t5.__e]), (a4 = l.__b) && a4(u6);
  n: if ("function" == typeof T5) try {
    if (k4 = u6.props, x5 = T5.prototype && T5.prototype.render, M2 = (a4 = T5.contextType) && i4[a4.__c], $3 = a4 ? M2 ? M2.props.value : a4.__ : i4, t5.__c ? _5 = (h5 = u6.__c = t5.__c).__ = h5.__E : (x5 ? u6.__c = h5 = new T5(k4, $3) : (u6.__c = h5 = new C(k4, $3), h5.constructor = T5, h5.render = Q), M2 && M2.sub(h5), h5.state || (h5.state = {}), h5.__n = i4, p5 = h5.__d = true, h5.__h = [], h5._sb = []), x5 && null == h5.__s && (h5.__s = h5.state), x5 && null != T5.getDerivedStateFromProps && (h5.__s == h5.state && (h5.__s = m({}, h5.__s)), m(h5.__s, T5.getDerivedStateFromProps(k4, h5.__s))), v5 = h5.props, y6 = h5.state, h5.__v = u6, p5) x5 && null == T5.getDerivedStateFromProps && null != h5.componentWillMount && h5.componentWillMount(), x5 && null != h5.componentDidMount && h5.__h.push(h5.componentDidMount);
    else {
      if (x5 && null == T5.getDerivedStateFromProps && k4 !== v5 && null != h5.componentWillReceiveProps && h5.componentWillReceiveProps(k4, $3), u6.__v == t5.__v || !h5.__e && null != h5.shouldComponentUpdate && false === h5.shouldComponentUpdate(k4, h5.__s, $3)) {
        u6.__v != t5.__v && (h5.props = k4, h5.state = h5.__s, h5.__d = false), u6.__e = t5.__e, u6.__k = t5.__k, u6.__k.some(function(n5) {
          n5 && (n5.__ = u6);
        }), w.push.apply(h5.__h, h5._sb), h5._sb = [], h5.__h.length && e4.push(h5);
        break n;
      }
      null != h5.componentWillUpdate && h5.componentWillUpdate(k4, h5.__s, $3), x5 && null != h5.componentDidUpdate && h5.__h.push(function() {
        h5.componentDidUpdate(v5, y6, d5);
      });
    }
    if (h5.context = $3, h5.props = k4, h5.__P = n4, h5.__e = false, I3 = l.__r, P3 = 0, x5) h5.state = h5.__s, h5.__d = false, I3 && I3(u6), a4 = h5.render(h5.props, h5.state, h5.context), w.push.apply(h5.__h, h5._sb), h5._sb = [];
    else do {
      h5.__d = false, I3 && I3(u6), a4 = h5.render(h5.props, h5.state, h5.context), h5.state = h5.__s;
    } while (h5.__d && ++P3 < 25);
    h5.state = h5.__s, null != h5.getChildContext && (i4 = m(m({}, i4), h5.getChildContext())), x5 && !p5 && null != h5.getSnapshotBeforeUpdate && (d5 = h5.getSnapshotBeforeUpdate(v5, y6)), A3 = null != a4 && a4.type === S && null == a4.key ? E(a4.props.children) : a4, f4 = L(n4, g(A3) ? A3 : [A3], u6, t5, i4, r4, o4, e4, f4, c4, s4), h5.base = u6.__e, u6.__u &= -161, h5.__h.length && e4.push(h5), _5 && (h5.__E = h5.__ = null);
  } catch (n5) {
    if (u6.__v = null, c4 || null != o4) if (n5.then) {
      for (u6.__u |= c4 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
      o4[o4.indexOf(f4)] = null, u6.__e = f4;
    } else {
      for (H3 = o4.length; H3--; ) b(o4[H3]);
      B(u6);
    }
    else u6.__e = t5.__e, u6.__k = t5.__k, n5.then || B(u6);
    l.__e(n5, u6, t5);
  }
  else null == o4 && u6.__v == t5.__v ? (u6.__k = t5.__k, u6.__e = t5.__e) : f4 = u6.__e = G(t5.__e, u6, t5, i4, r4, o4, e4, c4, s4);
  return (a4 = l.diffed) && a4(u6), 128 & u6.__u ? void 0 : f4;
}
function B(n4) {
  n4 && (n4.__c && (n4.__c.__e = true), n4.__k && n4.__k.some(B));
}
function D(n4, u6, t5) {
  for (var i4 = 0; i4 < t5.length; i4++) J(t5[i4], t5[++i4], t5[++i4]);
  l.__c && l.__c(u6, n4), n4.some(function(u7) {
    try {
      n4 = u7.__h, u7.__h = [], n4.some(function(n5) {
        n5.call(u7);
      });
    } catch (n5) {
      l.__e(n5, u7.__v);
    }
  });
}
function E(n4) {
  return "object" != typeof n4 || null == n4 || n4.__b > 0 ? n4 : g(n4) ? n4.map(E) : m({}, n4);
}
function G(u6, t5, i4, r4, o4, e4, f4, c4, s4) {
  var a4, h5, p5, v5, y6, w6, _5, m6 = i4.props || d, k4 = t5.props, x5 = t5.type;
  if ("svg" == x5 ? o4 = "http://www.w3.org/2000/svg" : "math" == x5 ? o4 = "http://www.w3.org/1998/Math/MathML" : o4 || (o4 = "http://www.w3.org/1999/xhtml"), null != e4) {
    for (a4 = 0; a4 < e4.length; a4++) if ((y6 = e4[a4]) && "setAttribute" in y6 == !!x5 && (x5 ? y6.localName == x5 : 3 == y6.nodeType)) {
      u6 = y6, e4[a4] = null;
      break;
    }
  }
  if (null == u6) {
    if (null == x5) return document.createTextNode(k4);
    u6 = document.createElementNS(o4, x5, k4.is && k4), c4 && (l.__m && l.__m(t5, e4), c4 = false), e4 = null;
  }
  if (null == x5) m6 === k4 || c4 && u6.data == k4 || (u6.data = k4);
  else {
    if (e4 = e4 && n.call(u6.childNodes), !c4 && null != e4) for (m6 = {}, a4 = 0; a4 < u6.attributes.length; a4++) m6[(y6 = u6.attributes[a4]).name] = y6.value;
    for (a4 in m6) y6 = m6[a4], "dangerouslySetInnerHTML" == a4 ? p5 = y6 : "children" == a4 || a4 in k4 || "value" == a4 && "defaultValue" in k4 || "checked" == a4 && "defaultChecked" in k4 || N(u6, a4, null, y6, o4);
    for (a4 in k4) y6 = k4[a4], "children" == a4 ? v5 = y6 : "dangerouslySetInnerHTML" == a4 ? h5 = y6 : "value" == a4 ? w6 = y6 : "checked" == a4 ? _5 = y6 : c4 && "function" != typeof y6 || m6[a4] === y6 || N(u6, a4, y6, m6[a4], o4);
    if (h5) c4 || p5 && (h5.__html == p5.__html || h5.__html == u6.innerHTML) || (u6.innerHTML = h5.__html), t5.__k = [];
    else if (p5 && (u6.innerHTML = ""), L("template" == t5.type ? u6.content : u6, g(v5) ? v5 : [v5], t5, i4, r4, "foreignObject" == x5 ? "http://www.w3.org/1999/xhtml" : o4, e4, f4, e4 ? e4[0] : i4.__k && $(i4, 0), c4, s4), null != e4) for (a4 = e4.length; a4--; ) b(e4[a4]);
    c4 || (a4 = "value", "progress" == x5 && null == w6 ? u6.removeAttribute("value") : null != w6 && (w6 !== u6[a4] || "progress" == x5 && !w6 || "option" == x5 && w6 != m6[a4]) && N(u6, a4, w6, m6[a4], o4), a4 = "checked", null != _5 && _5 != u6[a4] && N(u6, a4, _5, m6[a4], o4));
  }
  return u6;
}
function J(n4, u6, t5) {
  try {
    if ("function" == typeof n4) {
      var i4 = "function" == typeof n4.__u;
      i4 && n4.__u(), i4 && null == u6 || (n4.__u = n4(u6));
    } else n4.current = u6;
  } catch (n5) {
    l.__e(n5, t5);
  }
}
function K(n4, u6, t5) {
  var i4, r4;
  if (l.unmount && l.unmount(n4), (i4 = n4.ref) && (i4.current && i4.current != n4.__e || J(i4, null, u6)), null != (i4 = n4.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n5) {
      l.__e(n5, u6);
    }
    i4.base = i4.__P = null;
  }
  if (i4 = n4.__k) for (r4 = 0; r4 < i4.length; r4++) i4[r4] && K(i4[r4], u6, t5 || "function" != typeof n4.type);
  t5 || b(n4.__e), n4.__c = n4.__ = n4.__e = void 0;
}
function Q(n4, l5, u6) {
  return this.constructor(n4, u6);
}
function R(u6, t5, i4) {
  var r4, o4, e4, f4;
  t5 == document && (t5 = document.documentElement), l.__ && l.__(u6, t5), o4 = (r4 = "function" == typeof i4) ? null : i4 && i4.__k || t5.__k, e4 = [], f4 = [], q(t5, u6 = (!r4 && i4 || t5).__k = k(S, null, [u6]), o4 || d, d, t5.namespaceURI, !r4 && i4 ? [i4] : o4 ? null : t5.firstChild ? n.call(t5.childNodes) : null, e4, !r4 && i4 ? i4 : o4 ? o4.__e : t5.firstChild, r4, f4), D(e4, u6, f4);
}
n = w.slice, l = { __e: function(n4, l5, u6, t5) {
  for (var i4, r4, o4; l5 = l5.__; ) if ((i4 = l5.__c) && !i4.__) try {
    if ((r4 = i4.constructor) && null != r4.getDerivedStateFromError && (i4.setState(r4.getDerivedStateFromError(n4)), o4 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n4, t5 || {}), o4 = i4.__d), o4) return i4.__E = i4;
  } catch (l6) {
    n4 = l6;
  }
  throw n4;
} }, u = 0, t = function(n4) {
  return null != n4 && void 0 === n4.constructor;
}, C.prototype.setState = function(n4, l5) {
  var u6;
  u6 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n4 && (n4 = n4(m({}, u6), this.props)), n4 && m(u6, n4), null != n4 && this.__v && (l5 && this._sb.push(l5), A(this));
}, C.prototype.forceUpdate = function(n4) {
  this.__v && (this.__e = true, n4 && this.__h.push(n4), A(this));
}, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n4, l5) {
  return n4.__v.__b - l5.__v.__b;
}, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, s = "__a" + f, a = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;

// node_modules/htm/dist/htm.module.js
var n2 = function(t5, s4, r4, e4) {
  var u6;
  s4[0] = 0;
  for (var h5 = 1; h5 < s4.length; h5++) {
    var p5 = s4[h5++], a4 = s4[h5] ? (s4[0] |= p5 ? 1 : 2, r4[s4[h5++]]) : s4[++h5];
    3 === p5 ? e4[0] = a4 : 4 === p5 ? e4[1] = Object.assign(e4[1] || {}, a4) : 5 === p5 ? (e4[1] = e4[1] || {})[s4[++h5]] = a4 : 6 === p5 ? e4[1][s4[++h5]] += a4 + "" : p5 ? (u6 = t5.apply(a4, n2(t5, a4, r4, ["", null])), e4.push(u6), a4[0] ? s4[0] |= 2 : (s4[h5 - 2] = 0, s4[h5] = u6)) : e4.push(a4);
  }
  return e4;
};
var t2 = /* @__PURE__ */ new Map();
function htm_module_default(s4) {
  var r4 = t2.get(this);
  return r4 || (r4 = /* @__PURE__ */ new Map(), t2.set(this, r4)), (r4 = n2(this, r4.get(s4) || (r4.set(s4, r4 = (function(n4) {
    for (var t5, s5, r5 = 1, e4 = "", u6 = "", h5 = [0], p5 = function(n5) {
      1 === r5 && (n5 || (e4 = e4.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h5.push(0, n5, e4) : 3 === r5 && (n5 || e4) ? (h5.push(3, n5, e4), r5 = 2) : 2 === r5 && "..." === e4 && n5 ? h5.push(4, n5, 0) : 2 === r5 && e4 && !n5 ? h5.push(5, 0, true, e4) : r5 >= 5 && ((e4 || !n5 && 5 === r5) && (h5.push(r5, 0, e4, s5), r5 = 6), n5 && (h5.push(r5, n5, 0, s5), r5 = 6)), e4 = "";
    }, a4 = 0; a4 < n4.length; a4++) {
      a4 && (1 === r5 && p5(), p5(a4));
      for (var l5 = 0; l5 < n4[a4].length; l5++) t5 = n4[a4][l5], 1 === r5 ? "<" === t5 ? (p5(), h5 = [h5], r5 = 3) : e4 += t5 : 4 === r5 ? "--" === e4 && ">" === t5 ? (r5 = 1, e4 = "") : e4 = t5 + e4[0] : u6 ? t5 === u6 ? u6 = "" : e4 += t5 : '"' === t5 || "'" === t5 ? u6 = t5 : ">" === t5 ? (p5(), r5 = 1) : r5 && ("=" === t5 ? (r5 = 5, s5 = e4, e4 = "") : "/" === t5 && (r5 < 5 || ">" === n4[a4][l5 + 1]) ? (p5(), 3 === r5 && (h5 = h5[0]), r5 = h5, (h5 = h5[0]).push(2, 0, r5), r5 = 0) : " " === t5 || "	" === t5 || "\n" === t5 || "\r" === t5 ? (p5(), r5 = 2) : e4 += t5), 3 === r5 && "!--" === e4 && (r5 = 4, h5 = h5[0]);
    }
    return p5(), h5;
  })(s4)), r4), arguments, [])).length > 1 ? r4 : r4[0];
}

// node_modules/htm/preact/index.module.js
var m2 = htm_module_default.bind(k);

// node_modules/preact/hooks/dist/hooks.module.js
var t3;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m3 = c2.unmount;
var s2 = c2.__;
function p2(n4, t5) {
  c2.__h && c2.__h(r2, n4, o2 || t5), o2 = 0;
  var u6 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n4 >= u6.__.length && u6.__.push({}), u6.__[n4];
}
function d2(n4) {
  return o2 = 1, h2(D2, n4);
}
function h2(n4, u6, i4) {
  var o4 = p2(t3++, 2);
  if (o4.t = n4, !o4.__c && (o4.__ = [i4 ? i4(u6) : D2(void 0, u6), function(n5) {
    var t5 = o4.__N ? o4.__N[0] : o4.__[0], r4 = o4.t(t5, n5);
    t5 !== r4 && (o4.__N = [r4, o4.__[1]], o4.__c.setState({}));
  }], o4.__c = r2, !r2.__f)) {
    var f4 = function(n5, t5, r4) {
      if (!o4.__c.__H) return true;
      var u7 = o4.__c.__H.__.filter(function(n6) {
        return n6.__c;
      });
      if (u7.every(function(n6) {
        return !n6.__N;
      })) return !c4 || c4.call(this, n5, t5, r4);
      var i5 = o4.__c.props !== n5;
      return u7.some(function(n6) {
        if (n6.__N) {
          var t6 = n6.__[0];
          n6.__ = n6.__N, n6.__N = void 0, t6 !== n6.__[0] && (i5 = true);
        }
      }), c4 && c4.call(this, n5, t5, r4) || i5;
    };
    r2.__f = true;
    var c4 = r2.shouldComponentUpdate, e4 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n5, t5, r4) {
      if (this.__e) {
        var u7 = c4;
        c4 = void 0, f4(n5, t5, r4), c4 = u7;
      }
      e4 && e4.call(this, n5, t5, r4);
    }, r2.shouldComponentUpdate = f4;
  }
  return o4.__N || o4.__;
}
function y2(n4, u6) {
  var i4 = p2(t3++, 3);
  !c2.__s && C2(i4.__H, u6) && (i4.__ = n4, i4.u = u6, r2.__H.__h.push(i4));
}
function A2(n4) {
  return o2 = 5, T2(function() {
    return { current: n4 };
  }, []);
}
function T2(n4, r4) {
  var u6 = p2(t3++, 7);
  return C2(u6.__H, r4) && (u6.__ = n4(), u6.__H = r4, u6.__h = n4), u6.__;
}
function q2(n4, t5) {
  return o2 = 8, T2(function() {
    return n4;
  }, t5);
}
function j2() {
  for (var n4; n4 = f2.shift(); ) {
    var t5 = n4.__H;
    if (n4.__P && t5) try {
      t5.__h.some(z2), t5.__h.some(B2), t5.__h = [];
    } catch (r4) {
      t5.__h = [], c2.__e(r4, n4.__v);
    }
  }
}
c2.__b = function(n4) {
  r2 = null, e2 && e2(n4);
}, c2.__ = function(n4, t5) {
  n4 && t5.__k && t5.__k.__m && (n4.__m = t5.__k.__m), s2 && s2(n4, t5);
}, c2.__r = function(n4) {
  a2 && a2(n4), t3 = 0;
  var i4 = (r2 = n4.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.some(function(n5) {
    n5.__N && (n5.__ = n5.__N), n5.u = n5.__N = void 0;
  })) : (i4.__h.some(z2), i4.__h.some(B2), i4.__h = [], t3 = 0)), u2 = r2;
}, c2.diffed = function(n4) {
  v2 && v2(n4);
  var t5 = n4.__c;
  t5 && t5.__H && (t5.__H.__h.length && (1 !== f2.push(t5) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t5.__H.__.some(function(n5) {
    n5.u && (n5.__H = n5.u), n5.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n4, t5) {
  t5.some(function(n5) {
    try {
      n5.__h.some(z2), n5.__h = n5.__h.filter(function(n6) {
        return !n6.__ || B2(n6);
      });
    } catch (r4) {
      t5.some(function(n6) {
        n6.__h && (n6.__h = []);
      }), t5 = [], c2.__e(r4, n5.__v);
    }
  }), l2 && l2(n4, t5);
}, c2.unmount = function(n4) {
  m3 && m3(n4);
  var t5, r4 = n4.__c;
  r4 && r4.__H && (r4.__H.__.some(function(n5) {
    try {
      z2(n5);
    } catch (n6) {
      t5 = n6;
    }
  }), r4.__H = void 0, t5 && c2.__e(t5, r4.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n4) {
  var t5, r4 = function() {
    clearTimeout(u6), k2 && cancelAnimationFrame(t5), setTimeout(n4);
  }, u6 = setTimeout(r4, 35);
  k2 && (t5 = requestAnimationFrame(r4));
}
function z2(n4) {
  var t5 = r2, u6 = n4.__c;
  "function" == typeof u6 && (n4.__c = void 0, u6()), r2 = t5;
}
function B2(n4) {
  var t5 = r2;
  n4.__c = n4.__(), r2 = t5;
}
function C2(n4, t5) {
  return !n4 || n4.length !== t5.length || t5.some(function(t6, r4) {
    return t6 !== n4[r4];
  });
}
function D2(n4, t5) {
  return "function" == typeof t5 ? t5(n4) : t5;
}

// node_modules/@preact/signals-core/dist/signals-core.module.js
var i3 = /* @__PURE__ */ Symbol.for("preact-signals");
function t4() {
  if (!(s3 > 1)) {
    var i4, t5 = false;
    !(function() {
      var i5 = c3;
      c3 = void 0;
      while (void 0 !== i5) {
        if (i5.S.v === i5.v) i5.S.i = i5.i;
        i5 = i5.o;
      }
    })();
    while (void 0 !== h3) {
      var n4 = h3;
      h3 = void 0;
      v3++;
      while (void 0 !== n4) {
        var r4 = n4.u;
        n4.u = void 0;
        n4.f &= -3;
        if (!(8 & n4.f) && w3(n4)) try {
          n4.c();
        } catch (n5) {
          if (!t5) {
            i4 = n5;
            t5 = true;
          }
        }
        n4 = r4;
      }
    }
    v3 = 0;
    s3--;
    if (t5) throw i4;
  } else s3--;
}
function n3(i4) {
  if (s3 > 0) return i4();
  e3 = ++u3;
  s3++;
  try {
    return i4();
  } finally {
    t4();
  }
}
var r3 = void 0;
function o3(i4) {
  var t5 = r3;
  r3 = void 0;
  try {
    return i4();
  } finally {
    r3 = t5;
  }
}
var f3;
var h3 = void 0;
var s3 = 0;
var v3 = 0;
var u3 = 0;
var e3 = 0;
var c3 = void 0;
var d3 = 0;
function a3(i4) {
  if (void 0 !== r3) {
    var t5 = i4.n;
    if (void 0 === t5 || t5.t !== r3) {
      t5 = { i: 0, S: i4, p: r3.s, n: void 0, t: r3, e: void 0, x: void 0, r: t5 };
      if (void 0 !== r3.s) r3.s.n = t5;
      r3.s = t5;
      i4.n = t5;
      if (32 & r3.f) i4.S(t5);
      return t5;
    } else if (-1 === t5.i) {
      t5.i = 0;
      if (void 0 !== t5.n) {
        t5.n.p = t5.p;
        if (void 0 !== t5.p) t5.p.n = t5.n;
        t5.p = r3.s;
        t5.n = void 0;
        r3.s.n = t5;
        r3.s = t5;
      }
      return t5;
    }
  }
}
function l3(i4, t5) {
  this.v = i4;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.l = 0;
  this.W = null == t5 ? void 0 : t5.watched;
  this.Z = null == t5 ? void 0 : t5.unwatched;
  this.name = null == t5 ? void 0 : t5.name;
}
l3.prototype.brand = i3;
l3.prototype.h = function() {
  return true;
};
l3.prototype.S = function(i4) {
  var t5 = this, n4 = this.t;
  if (n4 !== i4 && void 0 === i4.e) {
    i4.x = n4;
    this.t = i4;
    if (void 0 !== n4) n4.e = i4;
    else o3(function() {
      var i5;
      null == (i5 = t5.W) || i5.call(t5);
    });
  }
};
l3.prototype.U = function(i4) {
  var t5 = this;
  if (void 0 !== this.t) {
    var n4 = i4.e, r4 = i4.x;
    if (void 0 !== n4) {
      n4.x = r4;
      i4.e = void 0;
    }
    if (void 0 !== r4) {
      r4.e = n4;
      i4.x = void 0;
    }
    if (i4 === this.t) {
      this.t = r4;
      if (void 0 === r4) o3(function() {
        var i5;
        null == (i5 = t5.Z) || i5.call(t5);
      });
    }
  }
};
l3.prototype.subscribe = function(i4) {
  var t5 = this;
  return j3(function() {
    var n4 = t5.value, o4 = r3;
    r3 = void 0;
    try {
      i4(n4);
    } finally {
      r3 = o4;
    }
  }, { name: "sub" });
};
l3.prototype.valueOf = function() {
  return this.value;
};
l3.prototype.toString = function() {
  return this.value + "";
};
l3.prototype.toJSON = function() {
  return this.value;
};
l3.prototype.peek = function() {
  var i4 = r3;
  r3 = void 0;
  try {
    return this.value;
  } finally {
    r3 = i4;
  }
};
Object.defineProperty(l3.prototype, "value", { get: function() {
  var i4 = a3(this);
  if (void 0 !== i4) i4.i = this.i;
  return this.v;
}, set: function(i4) {
  if (i4 !== this.v) {
    if (v3 > 100) throw new Error("Cycle detected");
    !(function(i5) {
      if (0 !== s3 && 0 === v3) {
        if (i5.l !== e3) {
          i5.l = e3;
          c3 = { S: i5, v: i5.v, i: i5.i, o: c3 };
        }
      }
    })(this);
    this.v = i4;
    this.i++;
    d3++;
    s3++;
    try {
      for (var n4 = this.t; void 0 !== n4; n4 = n4.x) n4.t.N();
    } finally {
      t4();
    }
  }
} });
function y3(i4, t5) {
  return new l3(i4, t5);
}
function w3(i4) {
  for (var t5 = i4.s; void 0 !== t5; t5 = t5.n) if (t5.S.i !== t5.i || !t5.S.h() || t5.S.i !== t5.i) return true;
  return false;
}
function _2(i4) {
  for (var t5 = i4.s; void 0 !== t5; t5 = t5.n) {
    var n4 = t5.S.n;
    if (void 0 !== n4) t5.r = n4;
    t5.S.n = t5;
    t5.i = -1;
    if (void 0 === t5.n) {
      i4.s = t5;
      break;
    }
  }
}
function b2(i4) {
  var t5 = i4.s, n4 = void 0;
  while (void 0 !== t5) {
    var r4 = t5.p;
    if (-1 === t5.i) {
      t5.S.U(t5);
      if (void 0 !== r4) r4.n = t5.n;
      if (void 0 !== t5.n) t5.n.p = r4;
    } else n4 = t5;
    t5.S.n = t5.r;
    if (void 0 !== t5.r) t5.r = void 0;
    t5 = r4;
  }
  i4.s = n4;
}
function p3(i4, t5) {
  l3.call(this, void 0);
  this.x = i4;
  this.s = void 0;
  this.g = d3 - 1;
  this.f = 4;
  this.W = null == t5 ? void 0 : t5.watched;
  this.Z = null == t5 ? void 0 : t5.unwatched;
  this.name = null == t5 ? void 0 : t5.name;
}
p3.prototype = new l3();
p3.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === d3) return true;
  this.g = d3;
  this.f |= 1;
  if (this.i > 0 && !w3(this)) {
    this.f &= -2;
    return true;
  }
  var i4 = r3;
  try {
    _2(this);
    r3 = this;
    var t5 = this.x();
    if (16 & this.f || this.v !== t5 || 0 === this.i) {
      this.v = t5;
      this.f &= -17;
      this.i++;
    }
  } catch (i5) {
    this.v = i5;
    this.f |= 16;
    this.i++;
  }
  r3 = i4;
  b2(this);
  this.f &= -2;
  return true;
};
p3.prototype.S = function(i4) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t5 = this.s; void 0 !== t5; t5 = t5.n) t5.S.S(t5);
  }
  l3.prototype.S.call(this, i4);
};
p3.prototype.U = function(i4) {
  if (void 0 !== this.t) {
    l3.prototype.U.call(this, i4);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t5 = this.s; void 0 !== t5; t5 = t5.n) t5.S.U(t5);
    }
  }
};
p3.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i4 = this.t; void 0 !== i4; i4 = i4.x) i4.t.N();
  }
};
Object.defineProperty(p3.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i4 = a3(this);
  this.h();
  if (void 0 !== i4) i4.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function g2(i4, t5) {
  return new p3(i4, t5);
}
function S2(i4) {
  var n4 = i4.m;
  i4.m = void 0;
  if ("function" == typeof n4) {
    s3++;
    var o4 = r3;
    r3 = void 0;
    try {
      n4();
    } catch (t5) {
      i4.f &= -2;
      i4.f |= 8;
      m4(i4);
      throw t5;
    } finally {
      r3 = o4;
      t4();
    }
  }
}
function m4(i4) {
  for (var t5 = i4.s; void 0 !== t5; t5 = t5.n) t5.S.U(t5);
  i4.x = void 0;
  i4.s = void 0;
  S2(i4);
}
function x2(i4) {
  if (r3 !== this) throw new Error("Out-of-order effect");
  b2(this);
  r3 = i4;
  this.f &= -2;
  if (8 & this.f) m4(this);
  t4();
}
function E2(i4, t5) {
  this.x = i4;
  this.m = void 0;
  this.s = void 0;
  this.u = void 0;
  this.f = 32;
  this.name = null == t5 ? void 0 : t5.name;
  if (f3) f3.push(this);
}
E2.prototype.c = function() {
  var i4 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t5 = this.x();
    if ("function" == typeof t5) this.m = t5;
  } finally {
    i4();
  }
};
E2.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  S2(this);
  _2(this);
  s3++;
  var i4 = r3;
  r3 = this;
  return x2.bind(this, i4);
};
E2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.u = h3;
    h3 = this;
  }
};
E2.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) m4(this);
};
E2.prototype.dispose = function() {
  this.d();
};
function j3(i4, t5) {
  var n4 = new E2(i4, t5);
  try {
    n4.c();
  } catch (i5) {
    n4.d();
    throw i5;
  }
  var r4 = n4.d.bind(n4);
  r4[Symbol.dispose] = r4;
  return r4;
}

// node_modules/@preact/signals/dist/signals.module.js
var l4;
var d4;
var h4;
var p4 = "undefined" != typeof window && !!window.__PREACT_SIGNALS_DEVTOOLS__;
var _3 = [];
j3(function() {
  l4 = this.N;
})();
function g3(i4, r4) {
  l[i4] = r4.bind(null, l[i4] || function() {
  });
}
function b3(i4) {
  if (h4) {
    var n4 = h4;
    h4 = void 0;
    n4();
  }
  h4 = i4 && i4.S();
}
function y4(i4) {
  var n4 = this, t5 = i4.data, e4 = useSignal(t5);
  e4.value = t5;
  var f4 = T2(function() {
    var i5 = n4, t6 = n4.__v;
    while (t6 = t6.__) if (t6.__c) {
      t6.__c.__$f |= 4;
      break;
    }
    var o4 = g2(function() {
      var i6 = e4.value.value;
      return 0 === i6 ? 0 : true === i6 ? "" : i6 || "";
    }), f5 = g2(function() {
      return !Array.isArray(o4.value) && !t(o4.value);
    }), a5 = j3(function() {
      this.N = F;
      if (f5.value) {
        var n5 = o4.value;
        if (i5.__v && i5.__v.__e && 3 === i5.__v.__e.nodeType) i5.__v.__e.data = n5;
      }
    }), v6 = n4.__$u.d;
    n4.__$u.d = function() {
      a5();
      v6.call(this);
    };
    return [f5, o4];
  }, []), a4 = f4[0], v5 = f4[1];
  return a4.value ? v5.peek() : v5.value;
}
y4.displayName = "ReactiveTextNode";
Object.defineProperties(l3.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: y4 }, props: { configurable: true, get: function() {
  var i4 = this;
  return { data: { get value() {
    return i4.value;
  } } };
} }, __b: { configurable: true, value: 1 } });
g3("__b", function(i4, n4) {
  if ("string" == typeof n4.type) {
    var r4, t5 = n4.props;
    for (var o4 in t5) if ("children" !== o4) {
      var e4 = t5[o4];
      if (e4 instanceof l3) {
        if (!r4) n4.__np = r4 = {};
        r4[o4] = e4;
        t5[o4] = e4.peek();
      }
    }
  }
  i4(n4);
});
g3("__r", function(i4, n4) {
  i4(n4);
  if (n4.type !== S) {
    b3();
    var r4, o4 = n4.__c;
    if (o4) {
      o4.__$f &= -2;
      if (void 0 === (r4 = o4.__$u)) o4.__$u = r4 = (function(i5, n5) {
        var r5;
        j3(function() {
          r5 = this;
        }, { name: n5 });
        r5.c = i5;
        return r5;
      })(function() {
        var i5;
        if (p4) null == (i5 = r4.y) || i5.call(r4);
        o4.__$f |= 1;
        o4.setState({});
      }, "function" == typeof n4.type ? n4.type.displayName || n4.type.name : "");
    }
    d4 = o4;
    b3(r4);
  }
});
g3("__e", function(i4, n4, r4, t5) {
  b3();
  d4 = void 0;
  i4(n4, r4, t5);
});
g3("diffed", function(i4, n4) {
  b3();
  d4 = void 0;
  var r4;
  if ("string" == typeof n4.type && (r4 = n4.__e)) {
    var t5 = n4.__np, o4 = n4.props;
    if (t5) {
      var e4 = r4.U;
      if (e4) for (var f4 in e4) {
        var u6 = e4[f4];
        if (void 0 !== u6 && !(f4 in t5)) {
          u6.d();
          e4[f4] = void 0;
        }
      }
      else {
        e4 = {};
        r4.U = e4;
      }
      for (var a4 in t5) {
        var c4 = e4[a4], v5 = t5[a4];
        if (void 0 === c4) {
          c4 = w4(r4, a4, v5);
          e4[a4] = c4;
        } else c4.o(v5, o4);
      }
      for (var s4 in t5) o4[s4] = t5[s4];
    }
  }
  i4(n4);
});
function w4(i4, n4, r4, t5) {
  var o4 = n4 in i4 && void 0 === i4.ownerSVGElement, e4 = y3(r4), f4 = r4.peek();
  return { o: function(i5, n5) {
    e4.value = i5;
    f4 = i5.peek();
  }, d: j3(function() {
    this.N = F;
    var r5 = e4.value.value;
    if (f4 !== r5) {
      f4 = void 0;
      if (o4) i4[n4] = r5;
      else if (null != r5 && (false !== r5 || "-" === n4[4])) i4.setAttribute(n4, r5);
      else i4.removeAttribute(n4);
    } else f4 = void 0;
  }) };
}
g3("unmount", function(i4, n4) {
  if ("string" == typeof n4.type) {
    var r4 = n4.__e;
    if (r4) {
      var t5 = r4.U;
      if (t5) {
        r4.U = void 0;
        for (var o4 in t5) {
          var e4 = t5[o4];
          if (e4) e4.d();
        }
      }
    }
    n4.__np = void 0;
  } else {
    var f4 = n4.__c;
    if (f4) {
      var u6 = f4.__$u;
      if (u6) {
        f4.__$u = void 0;
        u6.d();
      }
    }
  }
  i4(n4);
});
g3("__h", function(i4, n4, r4, t5) {
  if (t5 < 3 || 9 === t5) n4.__$f |= 2;
  i4(n4, r4, t5);
});
C.prototype.shouldComponentUpdate = function(i4, n4) {
  if (this.__R) return true;
  var r4 = this.__$u, t5 = r4 && void 0 !== r4.s;
  for (var o4 in n4) return true;
  if (this.__f || "boolean" == typeof this.u && true === this.u) {
    var e4 = 2 & this.__$f;
    if (!(t5 || e4 || 4 & this.__$f)) return true;
    if (1 & this.__$f) return true;
  } else {
    if (!(t5 || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
  }
  for (var f4 in i4) if ("__source" !== f4 && i4[f4] !== this.props[f4]) return true;
  for (var u6 in this.props) if (!(u6 in i4)) return true;
  return false;
};
function useSignal(i4, n4) {
  return T2(function() {
    return y3(i4, n4);
  }, []);
}
var q3 = function(i4) {
  queueMicrotask(function() {
    queueMicrotask(i4);
  });
};
function x3() {
  n3(function() {
    var i4;
    while (i4 = _3.shift()) l4.call(i4);
  });
}
function F() {
  if (1 === _3.push(this)) (l.requestAnimationFrame || q3)(x3);
}

// src/client/router.js
var route = y3(parseLocation());
var previousPath = y3(null);
var routes = [];
var addRoute = (pattern, component) => {
  const keys = [];
  const regex = pattern.replace(/:(\w+)/g, (_5, key) => {
    keys.push(key);
    return "([^/]+)";
  }).replace(/\*/g, () => {
    keys.push("0");
    return "(.*)";
  });
  routes.push({ regex: new RegExp(`^${regex}$`), keys, component });
};
var navigate2 = (path, replace = false) => {
  if (path === location.pathname) return;
  const prev = location.pathname + location.search;
  if (replace) {
    history.replaceState(null, "", path);
  } else {
    previousPath.value = prev;
    history.pushState(null, "", path);
  }
  route.value = parseLocation();
};
var currentMatch = g2(() => {
  const path = route.value.path;
  for (const r4 of routes) {
    const m6 = path.match(r4.regex);
    if (m6) {
      const p5 = {};
      r4.keys.forEach((key, i4) => {
        p5[key] = decodeURIComponent(m6[i4 + 1]);
      });
      return { component: r4.component, params: p5 };
    }
  }
  return { component: null, params: {} };
});
function parseLocation() {
  return {
    path: location.pathname,
    search: location.search,
    hash: location.hash
  };
}
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    route.value = parseLocation();
  });
}

// src/client/state.js
var state = {
  // Document list (for overview)
  documents: y3([]),
  // Currently selected document, version, revision
  currentDoc: y3(null),
  currentVersion: y3(null),
  currentRevision: y3(null),
  currentRevisionSeq: y3(null),
  currentDiff: y3(null),
  // Tree structure for current revision
  treeData: y3(null),
  // Currently focused node path
  currentPath: y3(null),
  // Node content cache: path -> { entry, node }
  nodeCache: y3(/* @__PURE__ */ new Map()),
  // Auth
  currentUser: y3(null),
  authChecked: y3(false),
  // Loading / error state
  loading: y3(false),
  error: y3(null),
  // Docs state
  docsTree: y3(null),
  docsContent: y3(null),
  docsPath: y3(null)
};
var buildNestedTree = g2(() => {
  const flat = state.treeData.value;
  if (!flat || flat.length === 0) return null;
  const byPath = /* @__PURE__ */ new Map();
  for (const entry of flat) {
    byPath.set(entry.path, { ...entry, children: [] });
  }
  const roots = [];
  for (const entry of flat) {
    const node = byPath.get(entry.path);
    if (entry.parent_path && byPath.has(entry.parent_path)) {
      byPath.get(entry.parent_path).children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
});

// src/client/api.js
var BASE = "/api/v1";
var request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = Object.assign(new Error(body.error || res.statusText), { status: res.status });
    if (res.status === 401 && !path.startsWith("/auth/me")) {
      const loc = location.pathname;
      if (loc !== "/login" && !loc.startsWith("/invite/")) {
        const next = encodeURIComponent(loc + location.search);
        location.href = `/login?next=${next}`;
      }
    }
    throw err;
  }
  return res.json();
};
var api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" })
};
var api_default = api;

// src/client/components/TopBar.js
var Wordmark = () => m2`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 52" class="top-bar__wordmark" aria-label="Articulate">
    <g transform="translate(4, 2) scale(0.26)">
      <rect x="20" y="10" width="160" height="155" rx="12" fill="#eff6ff"/>
      <rect x="35" y="23" width="130" height="130" rx="10" fill="#dbeafe"/>
      <rect x="50" y="37" width="100" height="104" rx="8" fill="#93c5fd"/>
      <rect x="65" y="51" width="70" height="78" rx="6" fill="#3b82f6"/>
      <rect x="78" y="63" width="44" height="54" rx="5" fill="#1e40af"/>
      <text x="100" y="95" text-anchor="middle" font-family="'Courier New', monospace"
        font-size="22" fill="white" font-weight="bold">A</text>
    </g>
    <text x="54" y="33" font-family="Georgia, serif" font-size="22" fill="white"
      font-weight="bold" letter-spacing="1">Articulate</text>
    <text x="55" y="46" font-family="Georgia, serif" font-size="6.5" fill="#93c5fd"
      letter-spacing="2.5">COLLABORATIVE DOCUMENT EDITING</text>
  </svg>
`;
var TopBar = () => {
  const doc = state.currentDoc.value;
  const version = state.currentVersion.value;
  const revSeq = state.currentRevisionSeq.value;
  const diff = state.currentDiff.value;
  const user = state.currentUser.value;
  const currentPath = route.value.path;
  const isDocsPage = currentPath.startsWith("/docs");
  const versionHref = doc && version ? `/${doc.id}/${version.id}` : null;
  const handleLogout = async (e4) => {
    e4.preventDefault();
    const next = encodeURIComponent(location.pathname + location.search);
    try {
      await api_default.post("/auth/logout");
    } catch (_5) {
    }
    state.currentUser.value = null;
    navigate2(`/login?next=${next}`);
  };
  const handleDocsToggle = (e4) => {
    e4.preventDefault();
    if (isDocsPage) {
      const prev = previousPath.value;
      navigate2(prev && !prev.startsWith("/docs") ? prev : "/");
    } else {
      navigate2("/docs");
    }
  };
  return m2`
    <header class="top-bar">
      <!-- Tier 1: brand + user -->
      <div class="top-bar__primary">
        <a class="top-bar__brand" href="/" onclick=${(e4) => {
    e4.preventDefault();
    navigate2("/");
  }}>
          <${Wordmark} />
        </a>
        <div class="top-bar__user-area">
          ${user ? m2`
              ${user.role === "admin" && m2`
                <a class="top-bar__link" href="/admin"
                  onclick=${(e4) => {
    e4.preventDefault();
    navigate2("/admin");
  }}>Admin</a>
              `}
              <span class="top-bar__user">${user.display_name || user.username}</span>
              <a class="top-bar__link" href="/login" onclick=${handleLogout}>Log out</a>
            ` : m2`
              <a class="top-bar__link" href="/login"
                onclick=${(e4) => {
    e4.preventDefault();
    navigate2("/login");
  }}>Log in</a>
            `}
        </div>
      </div>

      <!-- Tier 2: breadcrumbs + docs toggle -->
      <div class="top-bar__secondary">
        <nav class="top-bar__breadcrumbs">
          ${doc && m2`
            <a class="top-bar__crumb" href="/${doc.id}"
              onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${doc.id}`);
  }}>
              ${doc.title}
            </a>
          `}
          ${version && m2`
            <span class="top-bar__sep">/</span>
            ${diff ? m2`<a class="top-bar__crumb" href=${versionHref}
                  onclick=${(e4) => {
    e4.preventDefault();
    navigate2(versionHref);
  }}>${version.name}</a>` : m2`<span class="top-bar__current">${version.name}</span>`}
            ${version.kind === "branch" && m2`<span class="top-bar__badge">branch</span>`}
            ${!!version.locked && m2`<span class="top-bar__badge">locked</span>`}
          `}
          ${version && revSeq != null && m2`
            <span class="top-bar__sep">/</span>
            ${diff ? m2`<a class="top-bar__crumb" href=${versionHref + "/rev/" + revSeq}
                  onclick=${(e4) => {
    e4.preventDefault();
    navigate2(versionHref + "/rev/" + revSeq);
  }}>
                  Rev ${revSeq}
                </a>` : m2`<span class="top-bar__current">Rev ${revSeq}</span>`}
          `}
          ${diff && m2`
            <span class="top-bar__sep">/</span>
            <span class="top-bar__current">Diff ${diff.seqA}\u2192${diff.seqB}</span>
          `}
        </nav>
        <a class="top-bar__docs-btn" href="/docs" onclick=${handleDocsToggle}>
          ${isDocsPage ? "Close docs" : "Docs"}
        </a>
      </div>
    </header>
  `;
};
var TopBar_default = TopBar;

// src/client/components/DocumentOverview.js
var DocumentOverview = ({ params }) => {
  const { docId } = params;
  const [versions, setVersions] = d2([]);
  const [tags, setTags] = d2([]);
  const [showNewBranch, setShowNewBranch] = d2(false);
  const [branchName, setBranchName] = d2("");
  const [branchSource, setBranchSource] = d2("");
  const [busy, setBusy] = d2(false);
  y2(() => {
    state.loading.value = true;
    Promise.all([
      api_default.get(`/documents/${docId}`),
      api_default.get(`/documents/${docId}/versions`),
      api_default.get(`/documents/${docId}/tags`)
    ]).then(([doc2, vers, tgs]) => {
      state.currentDoc.value = doc2;
      state.currentVersion.value = null;
      state.currentRevision.value = null;
      state.currentRevisionSeq.value = null;
      state.currentDiff.value = null;
      state.treeData.value = null;
      setVersions(vers);
      setTags(tgs);
      state.loading.value = false;
    }).catch((err) => {
      state.error.value = err.message;
      state.loading.value = false;
    });
  }, [docId]);
  const doc = state.currentDoc.value;
  if (state.loading.value) return m2`<main class="main-content"><p>Loading...</p></main>`;
  if (!doc) return m2`<main class="main-content"><p>Document not found.</p></main>`;
  const publishedId = doc.published_version;
  const topVersions = versions.filter((v5) => v5.kind === "version");
  const branchesByParent = /* @__PURE__ */ new Map();
  for (const v5 of versions) {
    if (v5.kind !== "branch") continue;
    const parent = v5.parent_version_id || "_orphan";
    const list = branchesByParent.get(parent) || [];
    list.push(v5);
    branchesByParent.set(parent, list);
  }
  const handleCreateBranch = async () => {
    if (!branchName.trim()) return;
    setBusy(true);
    const id = branchName.trim().toLowerCase().replace(/\s+/g, "-");
    const body = { id, name: branchName.trim(), kind: "branch" };
    if (branchSource.trim()) body.forkedFromSeq = Number(branchSource.trim());
    try {
      const ver = await api_default.post(`/documents/${docId}/versions`, body);
      setVersions([...versions, ver]);
      setShowNewBranch(false);
      setBranchName("");
      setBranchSource("");
      navigate2(`/${docId}/${ver.id}`);
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  };
  return m2`
    <main class="main-content">
      <h1>${doc.title}</h1>
      <p>
        <a href="/${docId}/history" onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${docId}/history`);
  }}>
          View History Graph
        </a>
      </p>

      ${topVersions.map((v5) => m2`
        <${VersionCard}
          key=${v5.id}
          version=${v5}
          isPublished=${v5.id === publishedId}
          branches=${branchesByParent}
          docId=${docId}
          tags=${tags}
        />
      `)}

      <div class="branch-toolbar" style="margin-top: 1.5rem">
        ${!showNewBranch ? m2`<button class="btn btn--sm" onclick=${() => setShowNewBranch(true)}>New Branch</button>` : m2`
            <div class="branch-form">
              <input class="branch-form__input" type="text" placeholder="Branch name..."
                value=${branchName} onInput=${(e4) => setBranchName(e4.target.value)}
                onKeyDown=${(e4) => e4.key === "Enter" && handleCreateBranch()} />
              <input class="branch-form__input branch-form__input--sm" type="text" placeholder="From rev #"
                value=${branchSource} onInput=${(e4) => setBranchSource(e4.target.value)}
                onKeyDown=${(e4) => e4.key === "Enter" && handleCreateBranch()} />
              <button class="btn btn--primary btn--sm" onclick=${handleCreateBranch}
                disabled=${busy || !branchName.trim()}>Create</button>
              <button class="btn btn--sm" onclick=${() => setShowNewBranch(false)}>Cancel</button>
            </div>
          `}
      </div>

      ${tags.length > 0 && m2`
        <h2>Tags</h2>
        <${TagList} tags=${tags} docId=${docId} />
      `}
    </main>
  `;
};
var VersionCard = ({ version: v5, isPublished, branches, docId, tags }) => {
  const directBranches = branches.get(v5.id) || [];
  const versionTags = tags.filter((t5) => t5.revision_id && directBranches.some((b5) => b5.head_rev === t5.revision_id));
  return m2`
    <div class="version-card">
      <div class="version-card__header">
        <a class="version-card__name" href="/${docId}/${v5.id}"
          onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${docId}/${v5.id}`);
  }}>
          ${v5.name}
        </a>
        ${isPublished && m2`<span class="status-badge status-badge--published">Published</span>`}
        ${!!v5.locked && m2`<span class="status-badge status-badge--locked">Locked</span>`}
        ${v5.description && m2`<span class="version-card__desc">${v5.description}</span>`}
      </div>
      ${directBranches.length > 0 && m2`
        <div class="version-card__branches">
          <${BranchTree} branches=${directBranches} allBranches=${branches} docId=${docId} tags=${tags} depth=${0} />
        </div>
      `}
    </div>
  `;
};
var BranchTree = ({ branches, allBranches, docId, tags, depth }) => m2`
  <ul class="branch-tree ${depth > 0 ? "branch-tree--nested" : ""}">
    ${branches.map((b5) => {
  const children = allBranches.get(b5.id) || [];
  const branchTags = tags.filter((t5) => t5.revision_id === b5.head_rev);
  return m2`
        <li class="branch-tree__item" key=${b5.id}>
          <div class="branch-tree__row">
            <a class="branch-tree__link" href="/${docId}/${b5.id}"
              onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${docId}/${b5.id}`);
  }}>
              ${b5.name}
            </a>
            ${branchTags.map((t5) => m2`<span class="tag-badge tag-badge--sm" key=${t5.name}>${t5.name}</span>`)}
            ${b5.description && m2`<span class="branch-tree__desc">${b5.description}</span>`}
          </div>
          ${children.length > 0 && m2`
            <${BranchTree} branches=${children} allBranches=${allBranches} docId=${docId} tags=${tags} depth=${depth + 1} />
          `}
        </li>
      `;
})}
  </ul>
`;
var TagList = ({ tags, docId }) => m2`
  <table class="version-table">
    <thead>
      <tr>
        <th>Tag</th>
        <th>Rev</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      ${tags.map((t5) => m2`
        <tr>
          <td><span class="tag-badge">${t5.name}</span></td>
          <td>${t5.seq || "?"}</td>
          <td>${new Date(t5.created_at).toLocaleDateString()}</td>
        </tr>
      `)}
    </tbody>
  </table>
`;
var DocumentOverview_default = DocumentOverview;

// src/client/components/TreeSidebar.js
var TreeNode = ({ node, docId, versionSlug, depth = 0 }) => {
  const [expanded, setExpanded] = d2(depth < 2);
  const isActive = state.currentPath.value === node.path;
  const hasChildren = node.children && node.children.length > 0;
  const handleClick = (e4) => {
    e4.preventDefault();
    const pathSuffix = node.path;
    navigate2(`/${docId}/${versionSlug}/${pathSuffix}`);
  };
  const toggleExpand = (e4) => {
    e4.stopPropagation();
    setExpanded(!expanded);
  };
  return m2`
    <li class="tree-node ${isActive ? "tree-node--active" : ""}">
      <div class="tree-node__row" style=${{ paddingLeft: `${depth * 16 + 8}px` }}>
        ${hasChildren ? m2`<button class="tree-node__toggle" onclick=${toggleExpand}>${expanded ? "\u25BE" : "\u25B8"}</button>` : m2`<span class="tree-node__toggle tree-node__toggle--empty" />`}
        <a class="tree-node__label" href="/${docId}/${versionSlug}/${node.path}" onclick=${handleClick}>
          ${node.marker ? `${node.marker}. ` : ""}${node.caption || node.path}
        </a>
      </div>
      ${hasChildren && expanded && m2`
        <ul class="tree-node__children">
          ${node.children.map((child) => m2`
            <${TreeNode} node=${child} docId=${docId} versionSlug=${versionSlug} depth=${depth + 1} />
          `)}
        </ul>
      `}
    </li>
  `;
};
var TreeSidebar = ({ docId, versionSlug }) => {
  const tree = buildNestedTree.value;
  if (!tree) return m2`<aside class="tree-sidebar"><p class="text-muted">Loading tree...</p></aside>`;
  return m2`
    <aside class="tree-sidebar">
      <ul class="tree-root">
        ${tree.map((root2) => m2`
          <${TreeNode} node=${root2} docId=${docId} versionSlug=${versionSlug} depth=${0} />
        `)}
      </ul>
    </aside>
  `;
};
var TreeSidebar_default = TreeSidebar;

// src/shared/paths.js
var splitPath = (path) => path ? path.split("/").filter(Boolean) : [];
var joinPath = (...segments) => segments.flat().filter(Boolean).join("/");
var parentPath = (path) => {
  const segments = splitPath(path);
  return segments.length > 1 ? joinPath(segments.slice(0, -1)) : null;
};

// src/client/components/NodeBreadcrumbs.js
var NodeBreadcrumbs = ({ path, docId, versionSlug, treeData }) => {
  if (!path) return null;
  const segments = splitPath(path);
  const crumbs = segments.map((_5, i4) => {
    const crumbPath = segments.slice(0, i4 + 1).join("/");
    const entry = treeData && treeData.find((e4) => e4.path === crumbPath);
    const label = entry ? entry.marker || entry.path : segments[i4];
    return { path: crumbPath, label };
  });
  return m2`
    <nav class="breadcrumbs">
      ${crumbs.map((crumb, i4) => m2`
        ${i4 > 0 && m2`<span class="breadcrumbs__sep">\u203A</span>`}
        <a
          class="breadcrumbs__link"
          href="/${docId}/${versionSlug}/${crumb.path}"
          onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${docId}/${versionSlug}/${crumb.path}`);
  }}
        >${crumb.label}</a>
      `)}
    </nav>
  `;
};
var NodeBreadcrumbs_default = NodeBreadcrumbs;

// src/shared/markers.js
var isRoman = (s4) => /^[IVXLCDM]+$/i.test(s4);
var romanValues = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1e3 };
var parseRoman = (s4) => [...s4.toUpperCase()].reduce(
  (acc, ch, i4, arr) => romanValues[ch] < (romanValues[arr[i4 + 1]] || 0) ? acc - romanValues[ch] : acc + romanValues[ch],
  0
);
var toRoman = (n4) => {
  const pairs = [
    [1e3, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"]
  ];
  let result = "";
  for (const [value, numeral] of pairs) {
    while (n4 >= value) {
      result += numeral;
      n4 -= value;
    }
  }
  return result;
};
var nextMarker = (marker) => {
  if (/^\d+$/.test(marker))
    return String(Number(marker) + 1);
  if (/^[a-z]$/i.test(marker)) {
    const code = marker.charCodeAt(0);
    const next = String.fromCharCode(code + 1);
    return marker === marker.toUpperCase() ? next.toUpperCase() : next;
  }
  if (isRoman(marker) && marker.length > 1) {
    const val = parseRoman(marker);
    const next = toRoman(val + 1);
    return marker === marker.toLowerCase() ? next.toLowerCase() : next;
  }
  const prefixMatch = marker.match(/^(.*?)(\d+)$/);
  if (prefixMatch) {
    const [, prefix, num] = prefixMatch;
    return prefix + String(Number(num) + 1);
  }
  return marker;
};

// node_modules/marked/lib/marked.esm.js
function M() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T4 = M();
function G2(u6) {
  T4 = u6;
}
var _4 = { exec: () => null };
function k3(u6, e4 = "") {
  let t5 = typeof u6 == "string" ? u6 : u6.source, n4 = { replace: (r4, i4) => {
    let s4 = typeof i4 == "string" ? i4 : i4.source;
    return s4 = s4.replace(m5.caret, "$1"), t5 = t5.replace(r4, s4), n4;
  }, getRegex: () => new RegExp(t5, e4) };
  return n4;
}
var be = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return false;
  }
})();
var m5 = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u6) => new RegExp(`^( {0,3}${u6})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u6) => new RegExp(`^ {0,${Math.min(3, u6 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u6) => new RegExp(`^ {0,${Math.min(3, u6 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u6) => new RegExp(`^ {0,${Math.min(3, u6 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u6) => new RegExp(`^ {0,${Math.min(3, u6 - 1)}}#`), htmlBeginRegex: (u6) => new RegExp(`^ {0,${Math.min(3, u6 - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (u6) => new RegExp(`^ {0,${Math.min(3, u6 - 1)}}>`) };
var Re = /^(?:[ \t]*(?:\n|$))+/;
var Te = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var Oe = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var C4 = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var we = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var Q2 = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
var se = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var ie = k3(se).replace(/bull/g, Q2).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var ye = k3(se).replace(/bull/g, Q2).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var j4 = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var Pe = /^[^\n]+/;
var F2 = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var Se = k3(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", F2).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var $e = k3(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Q2).getRegex();
var v4 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var _e = k3("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v4).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var oe = k3(j4).replace("hr", C4).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v4).getRegex();
var Le = k3(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", oe).getRegex();
var K2 = { blockquote: Le, code: Te, def: Se, fences: Oe, heading: we, hr: C4, html: _e, lheading: ie, list: $e, newline: Re, paragraph: oe, table: _4, text: Pe };
var ne = k3("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", C4).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v4).getRegex();
var Me = { ...K2, lheading: ye, table: ne, paragraph: k3(j4).replace("hr", C4).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ne).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v4).getRegex() };
var ze = { ...K2, html: k3(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: _4, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k3(j4).replace("hr", C4).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ie).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Ee = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ie = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var ae = /^( {2,}|\\)\n(?!\s*$)/;
var Ae = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var z3 = /[\p{P}\p{S}]/u;
var H2 = /[\s\p{P}\p{S}]/u;
var W = /[^\s\p{P}\p{S}]/u;
var Ce = k3(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, H2).getRegex();
var le = /(?!~)[\p{P}\p{S}]/u;
var Be = /(?!~)[\s\p{P}\p{S}]/u;
var De = /(?:[^\s\p{P}\p{S}]|~)/u;
var qe = k3(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", be ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ue = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
var ve = k3(ue, "u").replace(/punct/g, z3).getRegex();
var He = k3(ue, "u").replace(/punct/g, le).getRegex();
var pe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ze = k3(pe, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H2).replace(/punct/g, z3).getRegex();
var Ge = k3(pe, "gu").replace(/notPunctSpace/g, De).replace(/punctSpace/g, Be).replace(/punct/g, le).getRegex();
var Ne = k3("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H2).replace(/punct/g, z3).getRegex();
var Qe = k3(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, z3).getRegex();
var je = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
var Fe = k3(je, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H2).replace(/punct/g, z3).getRegex();
var Ue = k3(/\\(punct)/, "gu").replace(/punct/g, z3).getRegex();
var Ke = k3(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var We = k3(U).replace("(?:-->|$)", "-->").getRegex();
var Xe = k3("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", We).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q4 = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
var Je = k3(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", q4).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var ce = k3(/^!?\[(label)\]\[(ref)\]/).replace("label", q4).replace("ref", F2).getRegex();
var he = k3(/^!?\[(ref)\](?:\[\])?/).replace("ref", F2).getRegex();
var Ve = k3("reflink|nolink(?!\\()", "g").replace("reflink", ce).replace("nolink", he).getRegex();
var re = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var X = { _backpedal: _4, anyPunctuation: Ue, autolink: Ke, blockSkip: qe, br: ae, code: Ie, del: _4, delLDelim: _4, delRDelim: _4, emStrongLDelim: ve, emStrongRDelimAst: Ze, emStrongRDelimUnd: Ne, escape: Ee, link: Je, nolink: he, punctuation: Ce, reflink: ce, reflinkSearch: Ve, tag: Xe, text: Ae, url: _4 };
var Ye = { ...X, link: k3(/^!?\[(label)\]\((.*?)\)/).replace("label", q4).getRegex(), reflink: k3(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q4).getRegex() };
var N2 = { ...X, emStrongRDelimAst: Ge, emStrongLDelim: He, delLDelim: Qe, delRDelim: Fe, url: k3(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", re).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k3(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", re).getRegex() };
var et = { ...N2, br: k3(ae).replace("{2,}", "*").getRegex(), text: k3(N2.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var B3 = { normal: K2, gfm: Me, pedantic: ze };
var E3 = { normal: X, gfm: N2, breaks: et, pedantic: Ye };
var tt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ke = (u6) => tt[u6];
function O2(u6, e4) {
  if (e4) {
    if (m5.escapeTest.test(u6)) return u6.replace(m5.escapeReplace, ke);
  } else if (m5.escapeTestNoEncode.test(u6)) return u6.replace(m5.escapeReplaceNoEncode, ke);
  return u6;
}
function J2(u6) {
  try {
    u6 = encodeURI(u6).replace(m5.percentDecode, "%");
  } catch {
    return null;
  }
  return u6;
}
function V2(u6, e4) {
  let t5 = u6.replace(m5.findPipe, (i4, s4, a4) => {
    let o4 = false, l5 = s4;
    for (; --l5 >= 0 && a4[l5] === "\\"; ) o4 = !o4;
    return o4 ? "|" : " |";
  }), n4 = t5.split(m5.splitPipe), r4 = 0;
  if (n4[0].trim() || n4.shift(), n4.length > 0 && !n4.at(-1)?.trim() && n4.pop(), e4) if (n4.length > e4) n4.splice(e4);
  else for (; n4.length < e4; ) n4.push("");
  for (; r4 < n4.length; r4++) n4[r4] = n4[r4].trim().replace(m5.slashPipe, "|");
  return n4;
}
function I2(u6, e4, t5) {
  let n4 = u6.length;
  if (n4 === 0) return "";
  let r4 = 0;
  for (; r4 < n4; ) {
    let i4 = u6.charAt(n4 - r4 - 1);
    if (i4 === e4 && !t5) r4++;
    else if (i4 !== e4 && t5) r4++;
    else break;
  }
  return u6.slice(0, n4 - r4);
}
function de(u6, e4) {
  if (u6.indexOf(e4[1]) === -1) return -1;
  let t5 = 0;
  for (let n4 = 0; n4 < u6.length; n4++) if (u6[n4] === "\\") n4++;
  else if (u6[n4] === e4[0]) t5++;
  else if (u6[n4] === e4[1] && (t5--, t5 < 0)) return n4;
  return t5 > 0 ? -2 : -1;
}
function ge(u6, e4 = 0) {
  let t5 = e4, n4 = "";
  for (let r4 of u6) if (r4 === "	") {
    let i4 = 4 - t5 % 4;
    n4 += " ".repeat(i4), t5 += i4;
  } else n4 += r4, t5++;
  return n4;
}
function fe(u6, e4, t5, n4, r4) {
  let i4 = e4.href, s4 = e4.title || null, a4 = u6[1].replace(r4.other.outputLinkReplace, "$1");
  n4.state.inLink = true;
  let o4 = { type: u6[0].charAt(0) === "!" ? "image" : "link", raw: t5, href: i4, title: s4, text: a4, tokens: n4.inlineTokens(a4) };
  return n4.state.inLink = false, o4;
}
function nt(u6, e4, t5) {
  let n4 = u6.match(t5.other.indentCodeCompensation);
  if (n4 === null) return e4;
  let r4 = n4[1];
  return e4.split(`
`).map((i4) => {
    let s4 = i4.match(t5.other.beginningSpace);
    if (s4 === null) return i4;
    let [a4] = s4;
    return a4.length >= r4.length ? i4.slice(r4.length) : i4;
  }).join(`
`);
}
var w5 = class {
  options;
  rules;
  lexer;
  constructor(e4) {
    this.options = e4 || T4;
  }
  space(e4) {
    let t5 = this.rules.block.newline.exec(e4);
    if (t5 && t5[0].length > 0) return { type: "space", raw: t5[0] };
  }
  code(e4) {
    let t5 = this.rules.block.code.exec(e4);
    if (t5) {
      let n4 = t5[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t5[0], codeBlockStyle: "indented", text: this.options.pedantic ? n4 : I2(n4, `
`) };
    }
  }
  fences(e4) {
    let t5 = this.rules.block.fences.exec(e4);
    if (t5) {
      let n4 = t5[0], r4 = nt(n4, t5[3] || "", this.rules);
      return { type: "code", raw: n4, lang: t5[2] ? t5[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t5[2], text: r4 };
    }
  }
  heading(e4) {
    let t5 = this.rules.block.heading.exec(e4);
    if (t5) {
      let n4 = t5[2].trim();
      if (this.rules.other.endingHash.test(n4)) {
        let r4 = I2(n4, "#");
        (this.options.pedantic || !r4 || this.rules.other.endingSpaceChar.test(r4)) && (n4 = r4.trim());
      }
      return { type: "heading", raw: t5[0], depth: t5[1].length, text: n4, tokens: this.lexer.inline(n4) };
    }
  }
  hr(e4) {
    let t5 = this.rules.block.hr.exec(e4);
    if (t5) return { type: "hr", raw: I2(t5[0], `
`) };
  }
  blockquote(e4) {
    let t5 = this.rules.block.blockquote.exec(e4);
    if (t5) {
      let n4 = I2(t5[0], `
`).split(`
`), r4 = "", i4 = "", s4 = [];
      for (; n4.length > 0; ) {
        let a4 = false, o4 = [], l5;
        for (l5 = 0; l5 < n4.length; l5++) if (this.rules.other.blockquoteStart.test(n4[l5])) o4.push(n4[l5]), a4 = true;
        else if (!a4) o4.push(n4[l5]);
        else break;
        n4 = n4.slice(l5);
        let p5 = o4.join(`
`), c4 = p5.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r4 = r4 ? `${r4}
${p5}` : p5, i4 = i4 ? `${i4}
${c4}` : c4;
        let d5 = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(c4, s4, true), this.lexer.state.top = d5, n4.length === 0) break;
        let h5 = s4.at(-1);
        if (h5?.type === "code") break;
        if (h5?.type === "blockquote") {
          let R2 = h5, f4 = R2.raw + `
` + n4.join(`
`), S3 = this.blockquote(f4);
          s4[s4.length - 1] = S3, r4 = r4.substring(0, r4.length - R2.raw.length) + S3.raw, i4 = i4.substring(0, i4.length - R2.text.length) + S3.text;
          break;
        } else if (h5?.type === "list") {
          let R2 = h5, f4 = R2.raw + `
` + n4.join(`
`), S3 = this.list(f4);
          s4[s4.length - 1] = S3, r4 = r4.substring(0, r4.length - h5.raw.length) + S3.raw, i4 = i4.substring(0, i4.length - R2.raw.length) + S3.raw, n4 = f4.substring(s4.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r4, tokens: s4, text: i4 };
    }
  }
  list(e4) {
    let t5 = this.rules.block.list.exec(e4);
    if (t5) {
      let n4 = t5[1].trim(), r4 = n4.length > 1, i4 = { type: "list", raw: "", ordered: r4, start: r4 ? +n4.slice(0, -1) : "", loose: false, items: [] };
      n4 = r4 ? `\\d{1,9}\\${n4.slice(-1)}` : `\\${n4}`, this.options.pedantic && (n4 = r4 ? n4 : "[*+-]");
      let s4 = this.rules.other.listItemRegex(n4), a4 = false;
      for (; e4; ) {
        let l5 = false, p5 = "", c4 = "";
        if (!(t5 = s4.exec(e4)) || this.rules.block.hr.test(e4)) break;
        p5 = t5[0], e4 = e4.substring(p5.length);
        let d5 = ge(t5[2].split(`
`, 1)[0], t5[1].length), h5 = e4.split(`
`, 1)[0], R2 = !d5.trim(), f4 = 0;
        if (this.options.pedantic ? (f4 = 2, c4 = d5.trimStart()) : R2 ? f4 = t5[1].length + 1 : (f4 = d5.search(this.rules.other.nonSpaceChar), f4 = f4 > 4 ? 1 : f4, c4 = d5.slice(f4), f4 += t5[1].length), R2 && this.rules.other.blankLine.test(h5) && (p5 += h5 + `
`, e4 = e4.substring(h5.length + 1), l5 = true), !l5) {
          let S3 = this.rules.other.nextBulletRegex(f4), Y = this.rules.other.hrRegex(f4), ee = this.rules.other.fencesBeginRegex(f4), te = this.rules.other.headingBeginRegex(f4), me = this.rules.other.htmlBeginRegex(f4), xe = this.rules.other.blockquoteBeginRegex(f4);
          for (; e4; ) {
            let Z = e4.split(`
`, 1)[0], A3;
            if (h5 = Z, this.options.pedantic ? (h5 = h5.replace(this.rules.other.listReplaceNesting, "  "), A3 = h5) : A3 = h5.replace(this.rules.other.tabCharGlobal, "    "), ee.test(h5) || te.test(h5) || me.test(h5) || xe.test(h5) || S3.test(h5) || Y.test(h5)) break;
            if (A3.search(this.rules.other.nonSpaceChar) >= f4 || !h5.trim()) c4 += `
` + A3.slice(f4);
            else {
              if (R2 || d5.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ee.test(d5) || te.test(d5) || Y.test(d5)) break;
              c4 += `
` + h5;
            }
            R2 = !h5.trim(), p5 += Z + `
`, e4 = e4.substring(Z.length + 1), d5 = A3.slice(f4);
          }
        }
        i4.loose || (a4 ? i4.loose = true : this.rules.other.doubleBlankLine.test(p5) && (a4 = true)), i4.items.push({ type: "list_item", raw: p5, task: !!this.options.gfm && this.rules.other.listIsTask.test(c4), loose: false, text: c4, tokens: [] }), i4.raw += p5;
      }
      let o4 = i4.items.at(-1);
      if (o4) o4.raw = o4.raw.trimEnd(), o4.text = o4.text.trimEnd();
      else return;
      i4.raw = i4.raw.trimEnd();
      for (let l5 of i4.items) {
        if (this.lexer.state.top = false, l5.tokens = this.lexer.blockTokens(l5.text, []), l5.task) {
          if (l5.text = l5.text.replace(this.rules.other.listReplaceTask, ""), l5.tokens[0]?.type === "text" || l5.tokens[0]?.type === "paragraph") {
            l5.tokens[0].raw = l5.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l5.tokens[0].text = l5.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let c4 = this.lexer.inlineQueue.length - 1; c4 >= 0; c4--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c4].src)) {
              this.lexer.inlineQueue[c4].src = this.lexer.inlineQueue[c4].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let p5 = this.rules.other.listTaskCheckbox.exec(l5.raw);
          if (p5) {
            let c4 = { type: "checkbox", raw: p5[0] + " ", checked: p5[0] !== "[ ]" };
            l5.checked = c4.checked, i4.loose ? l5.tokens[0] && ["paragraph", "text"].includes(l5.tokens[0].type) && "tokens" in l5.tokens[0] && l5.tokens[0].tokens ? (l5.tokens[0].raw = c4.raw + l5.tokens[0].raw, l5.tokens[0].text = c4.raw + l5.tokens[0].text, l5.tokens[0].tokens.unshift(c4)) : l5.tokens.unshift({ type: "paragraph", raw: c4.raw, text: c4.raw, tokens: [c4] }) : l5.tokens.unshift(c4);
          }
        }
        if (!i4.loose) {
          let p5 = l5.tokens.filter((d5) => d5.type === "space"), c4 = p5.length > 0 && p5.some((d5) => this.rules.other.anyLine.test(d5.raw));
          i4.loose = c4;
        }
      }
      if (i4.loose) for (let l5 of i4.items) {
        l5.loose = true;
        for (let p5 of l5.tokens) p5.type === "text" && (p5.type = "paragraph");
      }
      return i4;
    }
  }
  html(e4) {
    let t5 = this.rules.block.html.exec(e4);
    if (t5) return { type: "html", block: true, raw: t5[0], pre: t5[1] === "pre" || t5[1] === "script" || t5[1] === "style", text: t5[0] };
  }
  def(e4) {
    let t5 = this.rules.block.def.exec(e4);
    if (t5) {
      let n4 = t5[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r4 = t5[2] ? t5[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i4 = t5[3] ? t5[3].substring(1, t5[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t5[3];
      return { type: "def", tag: n4, raw: t5[0], href: r4, title: i4 };
    }
  }
  table(e4) {
    let t5 = this.rules.block.table.exec(e4);
    if (!t5 || !this.rules.other.tableDelimiter.test(t5[2])) return;
    let n4 = V2(t5[1]), r4 = t5[2].replace(this.rules.other.tableAlignChars, "").split("|"), i4 = t5[3]?.trim() ? t5[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s4 = { type: "table", raw: t5[0], header: [], align: [], rows: [] };
    if (n4.length === r4.length) {
      for (let a4 of r4) this.rules.other.tableAlignRight.test(a4) ? s4.align.push("right") : this.rules.other.tableAlignCenter.test(a4) ? s4.align.push("center") : this.rules.other.tableAlignLeft.test(a4) ? s4.align.push("left") : s4.align.push(null);
      for (let a4 = 0; a4 < n4.length; a4++) s4.header.push({ text: n4[a4], tokens: this.lexer.inline(n4[a4]), header: true, align: s4.align[a4] });
      for (let a4 of i4) s4.rows.push(V2(a4, s4.header.length).map((o4, l5) => ({ text: o4, tokens: this.lexer.inline(o4), header: false, align: s4.align[l5] })));
      return s4;
    }
  }
  lheading(e4) {
    let t5 = this.rules.block.lheading.exec(e4);
    if (t5) {
      let n4 = t5[1].trim();
      return { type: "heading", raw: t5[0], depth: t5[2].charAt(0) === "=" ? 1 : 2, text: n4, tokens: this.lexer.inline(n4) };
    }
  }
  paragraph(e4) {
    let t5 = this.rules.block.paragraph.exec(e4);
    if (t5) {
      let n4 = t5[1].charAt(t5[1].length - 1) === `
` ? t5[1].slice(0, -1) : t5[1];
      return { type: "paragraph", raw: t5[0], text: n4, tokens: this.lexer.inline(n4) };
    }
  }
  text(e4) {
    let t5 = this.rules.block.text.exec(e4);
    if (t5) return { type: "text", raw: t5[0], text: t5[0], tokens: this.lexer.inline(t5[0]) };
  }
  escape(e4) {
    let t5 = this.rules.inline.escape.exec(e4);
    if (t5) return { type: "escape", raw: t5[0], text: t5[1] };
  }
  tag(e4) {
    let t5 = this.rules.inline.tag.exec(e4);
    if (t5) return !this.lexer.state.inLink && this.rules.other.startATag.test(t5[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t5[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t5[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t5[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t5[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t5[0] };
  }
  link(e4) {
    let t5 = this.rules.inline.link.exec(e4);
    if (t5) {
      let n4 = t5[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n4)) {
        if (!this.rules.other.endAngleBracket.test(n4)) return;
        let s4 = I2(n4.slice(0, -1), "\\");
        if ((n4.length - s4.length) % 2 === 0) return;
      } else {
        let s4 = de(t5[2], "()");
        if (s4 === -2) return;
        if (s4 > -1) {
          let o4 = (t5[0].indexOf("!") === 0 ? 5 : 4) + t5[1].length + s4;
          t5[2] = t5[2].substring(0, s4), t5[0] = t5[0].substring(0, o4).trim(), t5[3] = "";
        }
      }
      let r4 = t5[2], i4 = "";
      if (this.options.pedantic) {
        let s4 = this.rules.other.pedanticHrefTitle.exec(r4);
        s4 && (r4 = s4[1], i4 = s4[3]);
      } else i4 = t5[3] ? t5[3].slice(1, -1) : "";
      return r4 = r4.trim(), this.rules.other.startAngleBracket.test(r4) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n4) ? r4 = r4.slice(1) : r4 = r4.slice(1, -1)), fe(t5, { href: r4 && r4.replace(this.rules.inline.anyPunctuation, "$1"), title: i4 && i4.replace(this.rules.inline.anyPunctuation, "$1") }, t5[0], this.lexer, this.rules);
    }
  }
  reflink(e4, t5) {
    let n4;
    if ((n4 = this.rules.inline.reflink.exec(e4)) || (n4 = this.rules.inline.nolink.exec(e4))) {
      let r4 = (n4[2] || n4[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i4 = t5[r4.toLowerCase()];
      if (!i4) {
        let s4 = n4[0].charAt(0);
        return { type: "text", raw: s4, text: s4 };
      }
      return fe(n4, i4, n4[0], this.lexer, this.rules);
    }
  }
  emStrong(e4, t5, n4 = "") {
    let r4 = this.rules.inline.emStrongLDelim.exec(e4);
    if (!r4 || !r4[1] && !r4[2] && !r4[3] && !r4[4] || r4[4] && n4.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r4[1] || r4[3] || "") || !n4 || this.rules.inline.punctuation.exec(n4)) {
      let s4 = [...r4[0]].length - 1, a4, o4, l5 = s4, p5 = 0, c4 = r4[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c4.lastIndex = 0, t5 = t5.slice(-1 * e4.length + s4); (r4 = c4.exec(t5)) != null; ) {
        if (a4 = r4[1] || r4[2] || r4[3] || r4[4] || r4[5] || r4[6], !a4) continue;
        if (o4 = [...a4].length, r4[3] || r4[4]) {
          l5 += o4;
          continue;
        } else if ((r4[5] || r4[6]) && s4 % 3 && !((s4 + o4) % 3)) {
          p5 += o4;
          continue;
        }
        if (l5 -= o4, l5 > 0) continue;
        o4 = Math.min(o4, o4 + l5 + p5);
        let d5 = [...r4[0]][0].length, h5 = e4.slice(0, s4 + r4.index + d5 + o4);
        if (Math.min(s4, o4) % 2) {
          let f4 = h5.slice(1, -1);
          return { type: "em", raw: h5, text: f4, tokens: this.lexer.inlineTokens(f4) };
        }
        let R2 = h5.slice(2, -2);
        return { type: "strong", raw: h5, text: R2, tokens: this.lexer.inlineTokens(R2) };
      }
    }
  }
  codespan(e4) {
    let t5 = this.rules.inline.code.exec(e4);
    if (t5) {
      let n4 = t5[2].replace(this.rules.other.newLineCharGlobal, " "), r4 = this.rules.other.nonSpaceChar.test(n4), i4 = this.rules.other.startingSpaceChar.test(n4) && this.rules.other.endingSpaceChar.test(n4);
      return r4 && i4 && (n4 = n4.substring(1, n4.length - 1)), { type: "codespan", raw: t5[0], text: n4 };
    }
  }
  br(e4) {
    let t5 = this.rules.inline.br.exec(e4);
    if (t5) return { type: "br", raw: t5[0] };
  }
  del(e4, t5, n4 = "") {
    let r4 = this.rules.inline.delLDelim.exec(e4);
    if (!r4) return;
    if (!(r4[1] || "") || !n4 || this.rules.inline.punctuation.exec(n4)) {
      let s4 = [...r4[0]].length - 1, a4, o4, l5 = s4, p5 = this.rules.inline.delRDelim;
      for (p5.lastIndex = 0, t5 = t5.slice(-1 * e4.length + s4); (r4 = p5.exec(t5)) != null; ) {
        if (a4 = r4[1] || r4[2] || r4[3] || r4[4] || r4[5] || r4[6], !a4 || (o4 = [...a4].length, o4 !== s4)) continue;
        if (r4[3] || r4[4]) {
          l5 += o4;
          continue;
        }
        if (l5 -= o4, l5 > 0) continue;
        o4 = Math.min(o4, o4 + l5);
        let c4 = [...r4[0]][0].length, d5 = e4.slice(0, s4 + r4.index + c4 + o4), h5 = d5.slice(s4, -s4);
        return { type: "del", raw: d5, text: h5, tokens: this.lexer.inlineTokens(h5) };
      }
    }
  }
  autolink(e4) {
    let t5 = this.rules.inline.autolink.exec(e4);
    if (t5) {
      let n4, r4;
      return t5[2] === "@" ? (n4 = t5[1], r4 = "mailto:" + n4) : (n4 = t5[1], r4 = n4), { type: "link", raw: t5[0], text: n4, href: r4, tokens: [{ type: "text", raw: n4, text: n4 }] };
    }
  }
  url(e4) {
    let t5;
    if (t5 = this.rules.inline.url.exec(e4)) {
      let n4, r4;
      if (t5[2] === "@") n4 = t5[0], r4 = "mailto:" + n4;
      else {
        let i4;
        do
          i4 = t5[0], t5[0] = this.rules.inline._backpedal.exec(t5[0])?.[0] ?? "";
        while (i4 !== t5[0]);
        n4 = t5[0], t5[1] === "www." ? r4 = "http://" + t5[0] : r4 = t5[0];
      }
      return { type: "link", raw: t5[0], text: n4, href: r4, tokens: [{ type: "text", raw: n4, text: n4 }] };
    }
  }
  inlineText(e4) {
    let t5 = this.rules.inline.text.exec(e4);
    if (t5) {
      let n4 = this.lexer.state.inRawBlock;
      return { type: "text", raw: t5[0], text: t5[0], escaped: n4 };
    }
  }
};
var x4 = class u4 {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e4) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e4 || T4, this.options.tokenizer = this.options.tokenizer || new w5(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t5 = { other: m5, block: B3.normal, inline: E3.normal };
    this.options.pedantic ? (t5.block = B3.pedantic, t5.inline = E3.pedantic) : this.options.gfm && (t5.block = B3.gfm, this.options.breaks ? t5.inline = E3.breaks : t5.inline = E3.gfm), this.tokenizer.rules = t5;
  }
  static get rules() {
    return { block: B3, inline: E3 };
  }
  static lex(e4, t5) {
    return new u4(t5).lex(e4);
  }
  static lexInline(e4, t5) {
    return new u4(t5).inlineTokens(e4);
  }
  lex(e4) {
    e4 = e4.replace(m5.carriageReturn, `
`), this.blockTokens(e4, this.tokens);
    for (let t5 = 0; t5 < this.inlineQueue.length; t5++) {
      let n4 = this.inlineQueue[t5];
      this.inlineTokens(n4.src, n4.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e4, t5 = [], n4 = false) {
    for (this.tokenizer.lexer = this, this.options.pedantic && (e4 = e4.replace(m5.tabCharGlobal, "    ").replace(m5.spaceLine, "")); e4; ) {
      let r4;
      if (this.options.extensions?.block?.some((s4) => (r4 = s4.call({ lexer: this }, e4, t5)) ? (e4 = e4.substring(r4.raw.length), t5.push(r4), true) : false)) continue;
      if (r4 = this.tokenizer.space(e4)) {
        e4 = e4.substring(r4.raw.length);
        let s4 = t5.at(-1);
        r4.raw.length === 1 && s4 !== void 0 ? s4.raw += `
` : t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.code(e4)) {
        e4 = e4.substring(r4.raw.length);
        let s4 = t5.at(-1);
        s4?.type === "paragraph" || s4?.type === "text" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s4.text += `
` + r4.text, this.inlineQueue.at(-1).src = s4.text) : t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.fences(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.heading(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.hr(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.blockquote(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.list(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.html(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.def(e4)) {
        e4 = e4.substring(r4.raw.length);
        let s4 = t5.at(-1);
        s4?.type === "paragraph" || s4?.type === "text" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s4.text += `
` + r4.raw, this.inlineQueue.at(-1).src = s4.text) : this.tokens.links[r4.tag] || (this.tokens.links[r4.tag] = { href: r4.href, title: r4.title }, t5.push(r4));
        continue;
      }
      if (r4 = this.tokenizer.table(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      if (r4 = this.tokenizer.lheading(e4)) {
        e4 = e4.substring(r4.raw.length), t5.push(r4);
        continue;
      }
      let i4 = e4;
      if (this.options.extensions?.startBlock) {
        let s4 = 1 / 0, a4 = e4.slice(1), o4;
        this.options.extensions.startBlock.forEach((l5) => {
          o4 = l5.call({ lexer: this }, a4), typeof o4 == "number" && o4 >= 0 && (s4 = Math.min(s4, o4));
        }), s4 < 1 / 0 && s4 >= 0 && (i4 = e4.substring(0, s4 + 1));
      }
      if (this.state.top && (r4 = this.tokenizer.paragraph(i4))) {
        let s4 = t5.at(-1);
        n4 && s4?.type === "paragraph" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s4.text += `
` + r4.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s4.text) : t5.push(r4), n4 = i4.length !== e4.length, e4 = e4.substring(r4.raw.length);
        continue;
      }
      if (r4 = this.tokenizer.text(e4)) {
        e4 = e4.substring(r4.raw.length);
        let s4 = t5.at(-1);
        s4?.type === "text" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s4.text += `
` + r4.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s4.text) : t5.push(r4);
        continue;
      }
      if (e4) {
        let s4 = "Infinite loop on byte: " + e4.charCodeAt(0);
        if (this.options.silent) {
          console.error(s4);
          break;
        } else throw new Error(s4);
      }
    }
    return this.state.top = true, t5;
  }
  inline(e4, t5 = []) {
    return this.inlineQueue.push({ src: e4, tokens: t5 }), t5;
  }
  inlineTokens(e4, t5 = []) {
    this.tokenizer.lexer = this;
    let n4 = e4, r4 = null;
    if (this.tokens.links) {
      let o4 = Object.keys(this.tokens.links);
      if (o4.length > 0) for (; (r4 = this.tokenizer.rules.inline.reflinkSearch.exec(n4)) != null; ) o4.includes(r4[0].slice(r4[0].lastIndexOf("[") + 1, -1)) && (n4 = n4.slice(0, r4.index) + "[" + "a".repeat(r4[0].length - 2) + "]" + n4.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r4 = this.tokenizer.rules.inline.anyPunctuation.exec(n4)) != null; ) n4 = n4.slice(0, r4.index) + "++" + n4.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i4;
    for (; (r4 = this.tokenizer.rules.inline.blockSkip.exec(n4)) != null; ) i4 = r4[2] ? r4[2].length : 0, n4 = n4.slice(0, r4.index + i4) + "[" + "a".repeat(r4[0].length - i4 - 2) + "]" + n4.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n4 = this.options.hooks?.emStrongMask?.call({ lexer: this }, n4) ?? n4;
    let s4 = false, a4 = "";
    for (; e4; ) {
      s4 || (a4 = ""), s4 = false;
      let o4;
      if (this.options.extensions?.inline?.some((p5) => (o4 = p5.call({ lexer: this }, e4, t5)) ? (e4 = e4.substring(o4.raw.length), t5.push(o4), true) : false)) continue;
      if (o4 = this.tokenizer.escape(e4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.tag(e4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.link(e4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.reflink(e4, this.tokens.links)) {
        e4 = e4.substring(o4.raw.length);
        let p5 = t5.at(-1);
        o4.type === "text" && p5?.type === "text" ? (p5.raw += o4.raw, p5.text += o4.text) : t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.emStrong(e4, n4, a4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.codespan(e4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.br(e4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.del(e4, n4, a4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (o4 = this.tokenizer.autolink(e4)) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      if (!this.state.inLink && (o4 = this.tokenizer.url(e4))) {
        e4 = e4.substring(o4.raw.length), t5.push(o4);
        continue;
      }
      let l5 = e4;
      if (this.options.extensions?.startInline) {
        let p5 = 1 / 0, c4 = e4.slice(1), d5;
        this.options.extensions.startInline.forEach((h5) => {
          d5 = h5.call({ lexer: this }, c4), typeof d5 == "number" && d5 >= 0 && (p5 = Math.min(p5, d5));
        }), p5 < 1 / 0 && p5 >= 0 && (l5 = e4.substring(0, p5 + 1));
      }
      if (o4 = this.tokenizer.inlineText(l5)) {
        e4 = e4.substring(o4.raw.length), o4.raw.slice(-1) !== "_" && (a4 = o4.raw.slice(-1)), s4 = true;
        let p5 = t5.at(-1);
        p5?.type === "text" ? (p5.raw += o4.raw, p5.text += o4.text) : t5.push(o4);
        continue;
      }
      if (e4) {
        let p5 = "Infinite loop on byte: " + e4.charCodeAt(0);
        if (this.options.silent) {
          console.error(p5);
          break;
        } else throw new Error(p5);
      }
    }
    return t5;
  }
};
var y5 = class {
  options;
  parser;
  constructor(e4) {
    this.options = e4 || T4;
  }
  space(e4) {
    return "";
  }
  code({ text: e4, lang: t5, escaped: n4 }) {
    let r4 = (t5 || "").match(m5.notSpaceStart)?.[0], i4 = e4.replace(m5.endingNewline, "") + `
`;
    return r4 ? '<pre><code class="language-' + O2(r4) + '">' + (n4 ? i4 : O2(i4, true)) + `</code></pre>
` : "<pre><code>" + (n4 ? i4 : O2(i4, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e4 }) {
    return `<blockquote>
${this.parser.parse(e4)}</blockquote>
`;
  }
  html({ text: e4 }) {
    return e4;
  }
  def(e4) {
    return "";
  }
  heading({ tokens: e4, depth: t5 }) {
    return `<h${t5}>${this.parser.parseInline(e4)}</h${t5}>
`;
  }
  hr(e4) {
    return `<hr>
`;
  }
  list(e4) {
    let t5 = e4.ordered, n4 = e4.start, r4 = "";
    for (let a4 = 0; a4 < e4.items.length; a4++) {
      let o4 = e4.items[a4];
      r4 += this.listitem(o4);
    }
    let i4 = t5 ? "ol" : "ul", s4 = t5 && n4 !== 1 ? ' start="' + n4 + '"' : "";
    return "<" + i4 + s4 + `>
` + r4 + "</" + i4 + `>
`;
  }
  listitem(e4) {
    return `<li>${this.parser.parse(e4.tokens)}</li>
`;
  }
  checkbox({ checked: e4 }) {
    return "<input " + (e4 ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e4 }) {
    return `<p>${this.parser.parseInline(e4)}</p>
`;
  }
  table(e4) {
    let t5 = "", n4 = "";
    for (let i4 = 0; i4 < e4.header.length; i4++) n4 += this.tablecell(e4.header[i4]);
    t5 += this.tablerow({ text: n4 });
    let r4 = "";
    for (let i4 = 0; i4 < e4.rows.length; i4++) {
      let s4 = e4.rows[i4];
      n4 = "";
      for (let a4 = 0; a4 < s4.length; a4++) n4 += this.tablecell(s4[a4]);
      r4 += this.tablerow({ text: n4 });
    }
    return r4 && (r4 = `<tbody>${r4}</tbody>`), `<table>
<thead>
` + t5 + `</thead>
` + r4 + `</table>
`;
  }
  tablerow({ text: e4 }) {
    return `<tr>
${e4}</tr>
`;
  }
  tablecell(e4) {
    let t5 = this.parser.parseInline(e4.tokens), n4 = e4.header ? "th" : "td";
    return (e4.align ? `<${n4} align="${e4.align}">` : `<${n4}>`) + t5 + `</${n4}>
`;
  }
  strong({ tokens: e4 }) {
    return `<strong>${this.parser.parseInline(e4)}</strong>`;
  }
  em({ tokens: e4 }) {
    return `<em>${this.parser.parseInline(e4)}</em>`;
  }
  codespan({ text: e4 }) {
    return `<code>${O2(e4, true)}</code>`;
  }
  br(e4) {
    return "<br>";
  }
  del({ tokens: e4 }) {
    return `<del>${this.parser.parseInline(e4)}</del>`;
  }
  link({ href: e4, title: t5, tokens: n4 }) {
    let r4 = this.parser.parseInline(n4), i4 = J2(e4);
    if (i4 === null) return r4;
    e4 = i4;
    let s4 = '<a href="' + e4 + '"';
    return t5 && (s4 += ' title="' + O2(t5) + '"'), s4 += ">" + r4 + "</a>", s4;
  }
  image({ href: e4, title: t5, text: n4, tokens: r4 }) {
    r4 && (n4 = this.parser.parseInline(r4, this.parser.textRenderer));
    let i4 = J2(e4);
    if (i4 === null) return O2(n4);
    e4 = i4;
    let s4 = `<img src="${e4}" alt="${O2(n4)}"`;
    return t5 && (s4 += ` title="${O2(t5)}"`), s4 += ">", s4;
  }
  text(e4) {
    return "tokens" in e4 && e4.tokens ? this.parser.parseInline(e4.tokens) : "escaped" in e4 && e4.escaped ? e4.text : O2(e4.text);
  }
};
var $2 = class {
  strong({ text: e4 }) {
    return e4;
  }
  em({ text: e4 }) {
    return e4;
  }
  codespan({ text: e4 }) {
    return e4;
  }
  del({ text: e4 }) {
    return e4;
  }
  html({ text: e4 }) {
    return e4;
  }
  text({ text: e4 }) {
    return e4;
  }
  link({ text: e4 }) {
    return "" + e4;
  }
  image({ text: e4 }) {
    return "" + e4;
  }
  br() {
    return "";
  }
  checkbox({ raw: e4 }) {
    return e4;
  }
};
var b4 = class u5 {
  options;
  renderer;
  textRenderer;
  constructor(e4) {
    this.options = e4 || T4, this.options.renderer = this.options.renderer || new y5(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $2();
  }
  static parse(e4, t5) {
    return new u5(t5).parse(e4);
  }
  static parseInline(e4, t5) {
    return new u5(t5).parseInline(e4);
  }
  parse(e4) {
    this.renderer.parser = this;
    let t5 = "";
    for (let n4 = 0; n4 < e4.length; n4++) {
      let r4 = e4[n4];
      if (this.options.extensions?.renderers?.[r4.type]) {
        let s4 = r4, a4 = this.options.extensions.renderers[s4.type].call({ parser: this }, s4);
        if (a4 !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s4.type)) {
          t5 += a4 || "";
          continue;
        }
      }
      let i4 = r4;
      switch (i4.type) {
        case "space": {
          t5 += this.renderer.space(i4);
          break;
        }
        case "hr": {
          t5 += this.renderer.hr(i4);
          break;
        }
        case "heading": {
          t5 += this.renderer.heading(i4);
          break;
        }
        case "code": {
          t5 += this.renderer.code(i4);
          break;
        }
        case "table": {
          t5 += this.renderer.table(i4);
          break;
        }
        case "blockquote": {
          t5 += this.renderer.blockquote(i4);
          break;
        }
        case "list": {
          t5 += this.renderer.list(i4);
          break;
        }
        case "checkbox": {
          t5 += this.renderer.checkbox(i4);
          break;
        }
        case "html": {
          t5 += this.renderer.html(i4);
          break;
        }
        case "def": {
          t5 += this.renderer.def(i4);
          break;
        }
        case "paragraph": {
          t5 += this.renderer.paragraph(i4);
          break;
        }
        case "text": {
          t5 += this.renderer.text(i4);
          break;
        }
        default: {
          let s4 = 'Token with "' + i4.type + '" type was not found.';
          if (this.options.silent) return console.error(s4), "";
          throw new Error(s4);
        }
      }
    }
    return t5;
  }
  parseInline(e4, t5 = this.renderer) {
    this.renderer.parser = this;
    let n4 = "";
    for (let r4 = 0; r4 < e4.length; r4++) {
      let i4 = e4[r4];
      if (this.options.extensions?.renderers?.[i4.type]) {
        let a4 = this.options.extensions.renderers[i4.type].call({ parser: this }, i4);
        if (a4 !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i4.type)) {
          n4 += a4 || "";
          continue;
        }
      }
      let s4 = i4;
      switch (s4.type) {
        case "escape": {
          n4 += t5.text(s4);
          break;
        }
        case "html": {
          n4 += t5.html(s4);
          break;
        }
        case "link": {
          n4 += t5.link(s4);
          break;
        }
        case "image": {
          n4 += t5.image(s4);
          break;
        }
        case "checkbox": {
          n4 += t5.checkbox(s4);
          break;
        }
        case "strong": {
          n4 += t5.strong(s4);
          break;
        }
        case "em": {
          n4 += t5.em(s4);
          break;
        }
        case "codespan": {
          n4 += t5.codespan(s4);
          break;
        }
        case "br": {
          n4 += t5.br(s4);
          break;
        }
        case "del": {
          n4 += t5.del(s4);
          break;
        }
        case "text": {
          n4 += t5.text(s4);
          break;
        }
        default: {
          let a4 = 'Token with "' + s4.type + '" type was not found.';
          if (this.options.silent) return console.error(a4), "";
          throw new Error(a4);
        }
      }
    }
    return n4;
  }
};
var P2 = class {
  options;
  block;
  constructor(e4) {
    this.options = e4 || T4;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e4) {
    return e4;
  }
  postprocess(e4) {
    return e4;
  }
  processAllTokens(e4) {
    return e4;
  }
  emStrongMask(e4) {
    return e4;
  }
  provideLexer() {
    return this.block ? x4.lex : x4.lexInline;
  }
  provideParser() {
    return this.block ? b4.parse : b4.parseInline;
  }
};
var D3 = class {
  defaults = M();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b4;
  Renderer = y5;
  TextRenderer = $2;
  Lexer = x4;
  Tokenizer = w5;
  Hooks = P2;
  constructor(...e4) {
    this.use(...e4);
  }
  walkTokens(e4, t5) {
    let n4 = [];
    for (let r4 of e4) switch (n4 = n4.concat(t5.call(this, r4)), r4.type) {
      case "table": {
        let i4 = r4;
        for (let s4 of i4.header) n4 = n4.concat(this.walkTokens(s4.tokens, t5));
        for (let s4 of i4.rows) for (let a4 of s4) n4 = n4.concat(this.walkTokens(a4.tokens, t5));
        break;
      }
      case "list": {
        let i4 = r4;
        n4 = n4.concat(this.walkTokens(i4.items, t5));
        break;
      }
      default: {
        let i4 = r4;
        this.defaults.extensions?.childTokens?.[i4.type] ? this.defaults.extensions.childTokens[i4.type].forEach((s4) => {
          let a4 = i4[s4].flat(1 / 0);
          n4 = n4.concat(this.walkTokens(a4, t5));
        }) : i4.tokens && (n4 = n4.concat(this.walkTokens(i4.tokens, t5)));
      }
    }
    return n4;
  }
  use(...e4) {
    let t5 = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e4.forEach((n4) => {
      let r4 = { ...n4 };
      if (r4.async = this.defaults.async || r4.async || false, n4.extensions && (n4.extensions.forEach((i4) => {
        if (!i4.name) throw new Error("extension name required");
        if ("renderer" in i4) {
          let s4 = t5.renderers[i4.name];
          s4 ? t5.renderers[i4.name] = function(...a4) {
            let o4 = i4.renderer.apply(this, a4);
            return o4 === false && (o4 = s4.apply(this, a4)), o4;
          } : t5.renderers[i4.name] = i4.renderer;
        }
        if ("tokenizer" in i4) {
          if (!i4.level || i4.level !== "block" && i4.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s4 = t5[i4.level];
          s4 ? s4.unshift(i4.tokenizer) : t5[i4.level] = [i4.tokenizer], i4.start && (i4.level === "block" ? t5.startBlock ? t5.startBlock.push(i4.start) : t5.startBlock = [i4.start] : i4.level === "inline" && (t5.startInline ? t5.startInline.push(i4.start) : t5.startInline = [i4.start]));
        }
        "childTokens" in i4 && i4.childTokens && (t5.childTokens[i4.name] = i4.childTokens);
      }), r4.extensions = t5), n4.renderer) {
        let i4 = this.defaults.renderer || new y5(this.defaults);
        for (let s4 in n4.renderer) {
          if (!(s4 in i4)) throw new Error(`renderer '${s4}' does not exist`);
          if (["options", "parser"].includes(s4)) continue;
          let a4 = s4, o4 = n4.renderer[a4], l5 = i4[a4];
          i4[a4] = (...p5) => {
            let c4 = o4.apply(i4, p5);
            return c4 === false && (c4 = l5.apply(i4, p5)), c4 || "";
          };
        }
        r4.renderer = i4;
      }
      if (n4.tokenizer) {
        let i4 = this.defaults.tokenizer || new w5(this.defaults);
        for (let s4 in n4.tokenizer) {
          if (!(s4 in i4)) throw new Error(`tokenizer '${s4}' does not exist`);
          if (["options", "rules", "lexer"].includes(s4)) continue;
          let a4 = s4, o4 = n4.tokenizer[a4], l5 = i4[a4];
          i4[a4] = (...p5) => {
            let c4 = o4.apply(i4, p5);
            return c4 === false && (c4 = l5.apply(i4, p5)), c4;
          };
        }
        r4.tokenizer = i4;
      }
      if (n4.hooks) {
        let i4 = this.defaults.hooks || new P2();
        for (let s4 in n4.hooks) {
          if (!(s4 in i4)) throw new Error(`hook '${s4}' does not exist`);
          if (["options", "block"].includes(s4)) continue;
          let a4 = s4, o4 = n4.hooks[a4], l5 = i4[a4];
          P2.passThroughHooks.has(s4) ? i4[a4] = (p5) => {
            if (this.defaults.async && P2.passThroughHooksRespectAsync.has(s4)) return (async () => {
              let d5 = await o4.call(i4, p5);
              return l5.call(i4, d5);
            })();
            let c4 = o4.call(i4, p5);
            return l5.call(i4, c4);
          } : i4[a4] = (...p5) => {
            if (this.defaults.async) return (async () => {
              let d5 = await o4.apply(i4, p5);
              return d5 === false && (d5 = await l5.apply(i4, p5)), d5;
            })();
            let c4 = o4.apply(i4, p5);
            return c4 === false && (c4 = l5.apply(i4, p5)), c4;
          };
        }
        r4.hooks = i4;
      }
      if (n4.walkTokens) {
        let i4 = this.defaults.walkTokens, s4 = n4.walkTokens;
        r4.walkTokens = function(a4) {
          let o4 = [];
          return o4.push(s4.call(this, a4)), i4 && (o4 = o4.concat(i4.call(this, a4))), o4;
        };
      }
      this.defaults = { ...this.defaults, ...r4 };
    }), this;
  }
  setOptions(e4) {
    return this.defaults = { ...this.defaults, ...e4 }, this;
  }
  lexer(e4, t5) {
    return x4.lex(e4, t5 ?? this.defaults);
  }
  parser(e4, t5) {
    return b4.parse(e4, t5 ?? this.defaults);
  }
  parseMarkdown(e4) {
    return (n4, r4) => {
      let i4 = { ...r4 }, s4 = { ...this.defaults, ...i4 }, a4 = this.onError(!!s4.silent, !!s4.async);
      if (this.defaults.async === true && i4.async === false) return a4(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n4 > "u" || n4 === null) return a4(new Error("marked(): input parameter is undefined or null"));
      if (typeof n4 != "string") return a4(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n4) + ", string expected"));
      if (s4.hooks && (s4.hooks.options = s4, s4.hooks.block = e4), s4.async) return (async () => {
        let o4 = s4.hooks ? await s4.hooks.preprocess(n4) : n4, p5 = await (s4.hooks ? await s4.hooks.provideLexer() : e4 ? x4.lex : x4.lexInline)(o4, s4), c4 = s4.hooks ? await s4.hooks.processAllTokens(p5) : p5;
        s4.walkTokens && await Promise.all(this.walkTokens(c4, s4.walkTokens));
        let h5 = await (s4.hooks ? await s4.hooks.provideParser() : e4 ? b4.parse : b4.parseInline)(c4, s4);
        return s4.hooks ? await s4.hooks.postprocess(h5) : h5;
      })().catch(a4);
      try {
        s4.hooks && (n4 = s4.hooks.preprocess(n4));
        let l5 = (s4.hooks ? s4.hooks.provideLexer() : e4 ? x4.lex : x4.lexInline)(n4, s4);
        s4.hooks && (l5 = s4.hooks.processAllTokens(l5)), s4.walkTokens && this.walkTokens(l5, s4.walkTokens);
        let c4 = (s4.hooks ? s4.hooks.provideParser() : e4 ? b4.parse : b4.parseInline)(l5, s4);
        return s4.hooks && (c4 = s4.hooks.postprocess(c4)), c4;
      } catch (o4) {
        return a4(o4);
      }
    };
  }
  onError(e4, t5) {
    return (n4) => {
      if (n4.message += `
Please report this to https://github.com/markedjs/marked.`, e4) {
        let r4 = "<p>An error occurred:</p><pre>" + O2(n4.message + "", true) + "</pre>";
        return t5 ? Promise.resolve(r4) : r4;
      }
      if (t5) return Promise.reject(n4);
      throw n4;
    };
  }
};
var L2 = new D3();
function g4(u6, e4) {
  return L2.parse(u6, e4);
}
g4.options = g4.setOptions = function(u6) {
  return L2.setOptions(u6), g4.defaults = L2.defaults, G2(g4.defaults), g4;
};
g4.getDefaults = M;
g4.defaults = T4;
g4.use = function(...u6) {
  return L2.use(...u6), g4.defaults = L2.defaults, G2(g4.defaults), g4;
};
g4.walkTokens = function(u6, e4) {
  return L2.walkTokens(u6, e4);
};
g4.parseInline = L2.parseInline;
g4.Parser = b4;
g4.parser = b4.parse;
g4.Renderer = y5;
g4.TextRenderer = $2;
g4.Lexer = x4;
g4.lexer = x4.lex;
g4.Tokenizer = w5;
g4.Hooks = P2;
g4.parse = g4;
var Qt = g4.options;
var jt = g4.setOptions;
var Ft = g4.use;
var Ut = g4.walkTokens;
var Kt = g4.parseInline;
var Xt = b4.parse;
var Jt = x4.lex;

// src/client/lib/markdown.js
var escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var renderCrossRefs = (html, onNavigate) => {
  return html.replace(
    /\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]/g,
    (_5, path, display) => {
      const text = display || path;
      return `<a href="#" class="cross-ref" data-path="${escapeHtml(path)}">${escapeHtml(text)}</a>`;
    }
  );
};

// src/client/components/NodeEditor.js
var NodeEditor = ({ node, onSave, onCancel }) => {
  const [body, setBody] = d2(node.body || "");
  const [caption, setCaption] = d2(node.caption || "");
  const [dirty, setDirty] = d2(false);
  const textareaRef = A2(null);
  y2(() => {
    setBody(node.body || "");
    setCaption(node.caption || "");
    setDirty(false);
  }, [node.path, node.node_id]);
  y2(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, [node.path]);
  const handleBodyChange = (e4) => {
    setBody(e4.target.value);
    setDirty(true);
  };
  const handleCaptionChange = (e4) => {
    setCaption(e4.target.value);
    setDirty(true);
  };
  const handleSave = () => {
    if (!dirty) return;
    onSave({ body, caption });
    setDirty(false);
  };
  const handleKeyDown = (e4) => {
    if (e4.ctrlKey && e4.key === "s") {
      e4.preventDefault();
      handleSave();
    }
    if (e4.key === "Escape") {
      onCancel();
    }
  };
  const insertAt = (before, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end);
    const replacement = `${before}${selected}${after}`;
    const newBody = body.slice(0, start) + replacement + body.slice(end);
    setBody(newBody);
    setDirty(true);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    });
  };
  return m2`
    <div class="node-editor" onkeydown=${handleKeyDown}>
      <${EditorToolbar} onInsert=${insertAt} />
      <div class="node-editor__fields">
        <label class="node-editor__label">
          Caption
          <input
            class="node-editor__caption"
            type="text"
            value=${caption}
            onInput=${handleCaptionChange}
          />
        </label>
        <label class="node-editor__label">
          Body
          <textarea
            ref=${textareaRef}
            class="node-editor__body"
            value=${body}
            onInput=${handleBodyChange}
            rows=${Math.max(8, body.split("\n").length + 2)}
          />
        </label>
      </div>
      <div class="node-editor__actions">
        <button class="btn btn--primary" onclick=${handleSave} disabled=${!dirty}>
          Save (Ctrl+S)
        </button>
        <button class="btn" onclick=${onCancel}>
          Done
        </button>
      </div>
    </div>
  `;
};
var EditorToolbar = ({ onInsert }) => m2`
  <div class="editor-toolbar">
    <button class="editor-toolbar__btn" onclick=${() => onInsert("**", "**")} title="Bold">B</button>
    <button class="editor-toolbar__btn editor-toolbar__btn--italic" onclick=${() => onInsert("*", "*")} title="Italic">I</button>
    <button class="editor-toolbar__btn" onclick=${() => onInsert("`", "`")} title="Code">${"</>"}</button>
    <button class="editor-toolbar__btn" onclick=${() => onInsert("[[", "]]")} title="Cross-reference">Xref</button>
  </div>
`;
var NodeEditor_default = NodeEditor;

// src/client/components/SubtreeNode.js
var SubtreeNode = ({ node, childNodes, allNodes, docId, versionSlug, editingPath, addingChildOf, onEdit, onSave, onCancel, onAddChild, onAddChildSubmit, onCancelAdd, onDelete, readOnly }) => {
  const bodyHtml = node.body ? renderCrossRefs(g4(node.body)) : "";
  const isEditing = editingPath === node.path;
  const isAddingChild = addingChildOf === node.path;
  const handleLinkClick = (e4) => {
    const link = e4.target.closest(".cross-ref");
    if (link) {
      e4.preventDefault();
      navigate2(`/${docId}/${versionSlug}/${link.dataset.path}`);
    }
  };
  return m2`
    <div class="subtree-node" data-depth=${node.depth}>
      <div class="subtree-node__header">
        ${node.marker && m2`<span class="subtree-node__marker">${node.marker}.</span>`}
        <span class="subtree-node__caption">${node.caption || ""}</span>
        ${!readOnly && m2`
          <div class="subtree-node__actions">
            <button class="subtree-btn" onclick=${() => onEdit(node.path)} title="Edit">✎</button>
            <button class="subtree-btn" onclick=${() => onAddChild(node.path)} title="Add child">+</button>
            <button class="subtree-btn subtree-btn--danger" onclick=${() => onDelete(node.path)} title="Delete">🗑</button>
          </div>
        `}
      </div>
      ${isEditing ? m2`<${NodeEditor_default}
            node=${node}
            onSave=${(data) => onSave(node.path, data)}
            onCancel=${onCancel}
          />` : bodyHtml && m2`
            <div class="subtree-node__body" onclick=${handleLinkClick} dangerouslySetInnerHTML=${{ __html: bodyHtml }} />
          `}
      ${isAddingChild && m2`
        <${AddChildForm}
          parentPath=${node.path}
          siblings=${childNodes}
          onSubmit=${onAddChildSubmit}
          onCancel=${onCancelAdd}
        />
      `}
      ${childNodes.length > 0 && m2`
        <div class="subtree-node__children">
          ${childNodes.map((child) => {
    const grandchildren = allNodes.filter((n4) => n4.parent_path === child.path);
    return m2`<${SubtreeNode}
              key=${child.path}
              node=${child}
              childNodes=${grandchildren}
              allNodes=${allNodes}
              docId=${docId}
              versionSlug=${versionSlug}
              editingPath=${editingPath}
              addingChildOf=${addingChildOf}
              onEdit=${onEdit}
              onSave=${onSave}
              onCancel=${onCancel}
              onAddChild=${onAddChild}
              onAddChildSubmit=${onAddChildSubmit}
              onCancelAdd=${onCancelAdd}
              onDelete=${onDelete}
              readOnly=${readOnly}
            />`;
  })}
        </div>
      `}
    </div>
  `;
};
var AddChildForm = ({ parentPath: parentPath2, siblings, onSubmit, onCancel }) => {
  const lastMarker = siblings.length > 0 ? siblings[siblings.length - 1].marker : null;
  const [marker, setMarker] = d2(lastMarker ? nextMarker(lastMarker) : "1");
  const [caption, setCaption] = d2("");
  const [body, setBody] = d2("");
  const [busy, setBusy] = d2(false);
  const bodyRef = A2(null);
  const insertAt = (before, after = "") => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end);
    const newBody = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(newBody);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    });
  };
  const handleSubmit = async () => {
    if (!marker) return;
    setBusy(true);
    await onSubmit(parentPath2, { marker, caption, body });
    setBusy(false);
  };
  return m2`
    <div class="subtree-add-form">
      <div class="subtree-add-form__fields">
        <label class="node-editor__label">
          Marker
          <input class="node-editor__caption" type="text" value=${marker} onInput=${(e4) => setMarker(e4.target.value)} />
        </label>
        <label class="node-editor__label">
          Caption
          <input class="node-editor__caption" type="text" value=${caption} onInput=${(e4) => setCaption(e4.target.value)} placeholder="Section title" />
        </label>
        <label class="node-editor__label">
          Body
          <${EditorToolbar} onInsert=${insertAt} />
          <textarea ref=${bodyRef} class="node-editor__body" value=${body} onInput=${(e4) => setBody(e4.target.value)} rows="4" />
        </label>
      </div>
      <div class="subtree-add-form__buttons">
        <button class="btn btn--primary btn--sm" onclick=${handleSubmit} disabled=${busy || !marker}>Add</button>
        <button class="btn btn--sm" onclick=${onCancel}>Cancel</button>
      </div>
    </div>
  `;
};
var SubtreeNode_default = SubtreeNode;

// src/client/components/RevisionControls.js
var RevisionControls = ({ revisionId, versionId, docId, versionSlug, readOnly = false, viewingHistory = false }) => {
  const [showActions, setShowActions] = d2(false);
  const [showPublish, setShowPublish] = d2(false);
  const [showHistory, setShowHistory] = d2(false);
  const [showFork, setShowFork] = d2(false);
  const [showTag, setShowTag] = d2(false);
  const [revisions, setRevisions] = d2([]);
  const [revDetail, setRevDetail] = d2(null);
  const [publishMessage, setPublishMessage] = d2("");
  const [message, setMessage] = d2("");
  const [forkName, setForkName] = d2("");
  const [tagName, setTagName] = d2("");
  const [busy, setBusy] = d2(false);
  const [publishedSeq, setPublishedSeq] = d2(null);
  const [tags, setTags] = d2([]);
  const panelRef = A2(null);
  y2(() => {
    api_default.get(`/revisions/${revisionId}`).then((rev) => {
      setRevDetail(rev);
      state.currentRevisionSeq.value = rev.seq;
    }).catch(() => setRevDetail(null));
  }, [revisionId]);
  y2(() => {
    api_default.get(`/documents/${docId}/tags`).then(setTags).catch(() => setTags([]));
  }, [docId]);
  y2(() => {
    api_default.get(`/documents/${docId}`).then((doc) => {
      if (!doc.published_version || doc.published_version === versionId) return null;
      return api_default.get(`/documents/${docId}/versions`).then((versions) => {
        const pub = versions.find((v5) => v5.id === doc.published_version);
        return pub?.head_rev ? api_default.get(`/revisions/${pub.head_rev}`) : null;
      });
    }).then((rev) => setPublishedSeq(rev?.seq || null)).catch(() => setPublishedSeq(null));
  }, [docId, versionId]);
  y2(() => {
    if (!showActions) return;
    const handler = (e4) => {
      if (panelRef.current && !panelRef.current.contains(e4.target)) {
        setShowActions(false);
        setShowPublish(false);
        setShowFork(false);
        setShowTag(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions]);
  y2(() => {
    if (!showActions) return;
    const handler = (e4) => {
      if (e4.key === "Escape") {
        setShowActions(false);
        setShowPublish(false);
        setShowFork(false);
        setShowTag(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showActions]);
  const parentSeq = revDetail?.parent_seq;
  const seq = revDetail?.seq;
  const version = state.currentVersion.value;
  const locked = !!version?.locked;
  const revTags = tags.filter((t5) => t5.revision_id === revisionId);
  const handlePublish = async () => {
    if (!publishMessage.trim()) return;
    setBusy(true);
    await api_default.patch(`/revisions/${revisionId}/publish`, { message: publishMessage.trim() });
    setBusy(false);
    setShowPublish(false);
    setPublishMessage("");
    const rev = await api_default.get(`/revisions/${revisionId}`);
    setRevDetail(rev);
  };
  const handleNewRevision = async () => {
    if (!message.trim()) return;
    setBusy(true);
    try {
      const result = await api_default.post(`/versions/${versionId}/revisions`, {
        message: message.trim(),
        changes: []
      });
      if (result.id) state.currentRevision.value = result.id;
      setMessage("");
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  };
  const handleShowHistory = async () => {
    if (!showHistory) {
      const revs = await api_default.get(`/versions/${versionId}/revisions`);
      setRevisions(revs);
    }
    setShowHistory(!showHistory);
  };
  const handleFork = async () => {
    if (!forkName.trim()) return;
    setBusy(true);
    const id = forkName.trim().toLowerCase().replace(/\s+/g, "-");
    try {
      const ver = await api_default.post(`/documents/${docId}/versions`, {
        id,
        name: forkName.trim(),
        kind: "branch",
        forkedFrom: revisionId
      });
      setShowFork(false);
      setForkName("");
      navigate2(`/${docId}/${ver.id}`);
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  };
  const handleTag = async () => {
    if (!tagName.trim()) return;
    setBusy(true);
    try {
      await api_default.post(`/documents/${docId}/tags`, { name: tagName.trim(), revisionId });
      setShowTag(false);
      setTagName("");
      const updated = await api_default.get(`/documents/${docId}/tags`);
      setTags(updated);
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  };
  return m2`
    <div class="rev-strip" ref=${panelRef}>

      <!-- Always-visible strip -->
      <div class="rev-strip__bar">
        <span class="rev-strip__id" title=${revisionId}>Rev ${seq || "?"}</span>
        ${revTags.map((t5) => m2`<span class="tag-badge" key=${t5.name}>${t5.name}</span>`)}
        ${locked && m2`<span class="status-badge status-badge--locked">Locked</span>`}
        <button class="rev-strip__toggle ${showActions ? "rev-strip__toggle--active" : ""}"
          onclick=${() => setShowActions(!showActions)}
          title=${showActions ? "Hide actions" : "Show actions"}>
          ≡ Actions
        </button>
        ${!readOnly && !locked && m2`
          <div class="rev-strip__save">
            <input class="rev-strip__message" type="text"
              placeholder="Revision note…"
              value=${message}
              onInput=${(e4) => setMessage(e4.target.value)}
              onKeyDown=${(e4) => e4.key === "Enter" && handleNewRevision()} />
            <button class="btn btn--sm" onclick=${handleNewRevision}
              disabled=${busy || !message.trim()}>Save</button>
          </div>
        `}
      </div>

      <!-- Expandable actions panel -->
      ${showActions && m2`
        <div class="rev-strip__panel">

          ${!readOnly && !locked && m2`
            <div class="rev-strip__group">
              ${!showPublish ? m2`<button class="btn btn--sm" onclick=${() => setShowPublish(true)}>Publish…</button>` : m2`
                  <div class="branch-form">
                    <input class="branch-form__input" type="text"
                      placeholder="Describe this revision…"
                      value=${publishMessage}
                      onInput=${(e4) => setPublishMessage(e4.target.value)}
                      onKeyDown=${(e4) => e4.key === "Enter" && handlePublish()} />
                    <button class="btn btn--primary btn--sm" onclick=${handlePublish}
                      disabled=${busy || !publishMessage.trim()}>Confirm</button>
                    <button class="btn btn--sm" onclick=${() => setShowPublish(false)}>Cancel</button>
                  </div>
                `}
            </div>
          `}

          <div class="rev-strip__group">
            ${parentSeq && m2`
              <button class="btn btn--sm"
                onclick=${() => navigate2(`/${docId}/${versionSlug}/rev/${seq}/diff/${parentSeq}/${seq}`)}>
                Diff from parent
              </button>
            `}
            ${publishedSeq && seq && m2`
              <button class="btn btn--sm"
                onclick=${() => navigate2(`/${docId}/${versionSlug}/rev/${seq}/diff/${publishedSeq}/${seq}`)}>
                Compare to published
              </button>
            `}
            <button class="btn btn--sm" onclick=${() => navigate2(`/${docId}/history${seq ? "?rev=" + seq : ""}`)}>
              Full history graph
            </button>
          </div>

          <div class="rev-strip__group">
            ${!showFork ? m2`<button class="btn btn--sm" onclick=${() => setShowFork(true)}>Fork branch…</button>` : m2`
                <div class="branch-form">
                  <input class="branch-form__input" type="text" placeholder="Branch name…"
                    value=${forkName} onInput=${(e4) => setForkName(e4.target.value)}
                    onKeyDown=${(e4) => e4.key === "Enter" && handleFork()} />
                  <button class="btn btn--primary btn--sm" onclick=${handleFork}
                    disabled=${busy || !forkName.trim()}>Create</button>
                  <button class="btn btn--sm" onclick=${() => setShowFork(false)}>Cancel</button>
                </div>
              `}
            ${!showTag ? m2`<button class="btn btn--sm" onclick=${() => setShowTag(true)}>Tag…</button>` : m2`
                <div class="branch-form">
                  <input class="branch-form__input" type="text" placeholder="Tag name…"
                    value=${tagName} onInput=${(e4) => setTagName(e4.target.value)}
                    onKeyDown=${(e4) => e4.key === "Enter" && handleTag()} />
                  <button class="btn btn--primary btn--sm" onclick=${handleTag}
                    disabled=${busy || !tagName.trim()}>Create</button>
                  <button class="btn btn--sm" onclick=${() => setShowTag(false)}>Cancel</button>
                </div>
              `}
            ${version?.kind === "branch" && seq && m2`
              <button class="btn btn--sm" onclick=${() => {
    const params = new URLSearchParams({ from: seq });
    if (publishedSeq) params.set("into", publishedSeq);
    if (versionId) params.set("target", versionId);
    navigate2(`/${docId}/merge?${params}`);
  }}>Merge…</button>
            `}
          </div>

          <div class="rev-strip__group">
            <button class="btn btn--sm" onclick=${handleShowHistory}>
              ${showHistory ? "Hide revision list" : "Revision list"}
            </button>
          </div>

          ${showHistory && m2`
            <${RevisionHistory}
              revisions=${revisions}
              currentId=${revisionId}
              docId=${docId}
              versionSlug=${versionSlug}
              tags=${tags}
            />
          `}
        </div>
      `}
    </div>
  `;
};
var RevisionHistory = ({ revisions, currentId, docId, versionSlug, tags }) => {
  const [selectedA, setSelectedA] = d2(null);
  const [selectedB, setSelectedB] = d2(null);
  const seqById = new Map(revisions.map((r4) => [r4.id, r4.seq]));
  const tagsByRevId = /* @__PURE__ */ new Map();
  for (const t5 of tags) {
    const list = tagsByRevId.get(t5.revision_id) || [];
    list.push(t5.name);
    tagsByRevId.set(t5.revision_id, list);
  }
  const handleCompare = () => {
    if (selectedA && selectedB && selectedA !== selectedB) {
      const a4 = seqById.get(selectedA);
      const b5 = seqById.get(selectedB);
      if (a4 && b5) {
        const sorted = [a4, b5].sort((x5, y6) => x5 - y6);
        const revSeq = seqById.get(currentId) || sorted[1];
        navigate2(`/${docId}/${versionSlug}/rev/${revSeq}/diff/${sorted[0]}/${sorted[1]}`);
      }
    }
  };
  return m2`
    <div class="revision-history">
      <div class="revision-history__toolbar">
        <button class="btn btn--primary btn--sm" onclick=${handleCompare}
          disabled=${!selectedA || !selectedB || selectedA === selectedB}>
          Compare selected
        </button>
      </div>
      <table class="revision-history__table">
        <thead>
          <tr>
            <th>A</th><th>B</th><th>#</th><th>Message</th><th>Tags</th><th>Date</th><th></th>
          </tr>
        </thead>
        <tbody>
          ${revisions.map((rev) => m2`
            <tr class=${rev.id === currentId ? "revision-history__current" : ""}>
              <td><input type="radio" name="diffA" checked=${selectedA === rev.id} onchange=${() => setSelectedA(rev.id)} /></td>
              <td><input type="radio" name="diffB" checked=${selectedB === rev.id} onchange=${() => setSelectedB(rev.id)} /></td>
              <td class="revision-history__seq">${rev.seq || "?"}</td>
              <td>${rev.message || m2`<span class="text-muted">-</span>`}</td>
              <td>${(tagsByRevId.get(rev.id) || []).map((name) => m2`<span class="tag-badge tag-badge--sm" key=${name}>${name}</span> `)}</td>
              <td class="revision-history__date">${(/* @__PURE__ */ new Date(rev.created_at + "Z")).toLocaleString()}</td>
              <td>
                ${rev.parent_id && seqById.get(rev.parent_id) && m2`
                  <a class="revision-history__diff-link"
                    href="/${docId}/${versionSlug}/rev/${rev.seq}/diff/${seqById.get(rev.parent_id)}/${rev.seq}"
                    onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${docId}/${versionSlug}/rev/${rev.seq}/diff/${seqById.get(rev.parent_id)}/${rev.seq}`);
  }}>
                    diff
                  </a>
                `}
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `;
};
var RevisionControls_default = RevisionControls;

// src/client/components/NodeContextView.js
var LOCK_RENEW_INTERVAL = 3 * 6e4;
var NodeContextView = ({ revisionId, path, docId, versionSlug, readOnly = false }) => {
  const [subtree, setSubtree] = d2(null);
  const [loading, setLoading] = d2(true);
  const [editingPath, setEditingPath] = d2(null);
  const [addingChildOf, setAddingChildOf] = d2(null);
  const [liveRevisionId, setLiveRevisionId] = d2(revisionId);
  const autosaveTimer = A2(null);
  const lockRenewTimer = A2(null);
  const revId = liveRevisionId || revisionId;
  const loadSubtree = q2(async (rid) => {
    const data = await api_default.get(`/revisions/${rid}/subtree/${path}`);
    setSubtree(data);
  }, [path]);
  y2(() => {
    if (!revId || !path) return;
    setLoading(true);
    loadSubtree(revId).then(() => {
      setLoading(false);
      state.currentPath.value = path;
    }).catch(() => {
      setSubtree(null);
      setLoading(false);
    });
  }, [revisionId, liveRevisionId, path]);
  y2(() => {
    setLiveRevisionId(revisionId);
    setEditingPath(null);
    setAddingChildOf(null);
  }, [revisionId]);
  const refreshAfterChange = q2(async (newRevId) => {
    setLiveRevisionId(newRevId);
    state.currentRevision.value = newRevId;
    await loadSubtree(newRevId);
    const tree = await api_default.get(`/revisions/${newRevId}/tree`);
    state.treeData.value = tree;
  }, [loadSubtree]);
  const handleEdit = q2(async (nodePath) => {
    const result = await api_default.post(`/revisions/${revId}/locks/${nodePath}`, {});
    if (!result.acquired) {
      alert(`This node is being edited by ${result.holder}. Try again after ${new Date(result.expiresAt).toLocaleTimeString()}.`);
      return;
    }
    setEditingPath(nodePath);
    setAddingChildOf(null);
    lockRenewTimer.current = setInterval(() => {
      api_default.patch(`/revisions/${revId}/locks/${nodePath}`, {}).catch(() => {
      });
    }, LOCK_RENEW_INTERVAL);
  }, [revId]);
  const handleDoneEditing = q2(() => {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }
    if (lockRenewTimer.current) {
      clearInterval(lockRenewTimer.current);
      lockRenewTimer.current = null;
    }
    if (editingPath) {
      api_default.delete(`/revisions/${revId}/locks/${editingPath}`).catch(() => {
      });
    }
    setEditingPath(null);
  }, [editingPath, revId]);
  const handleSave = q2(async (nodePath, { body, caption }) => {
    const result = await api_default.put(`/revisions/${revId}/nodes/${nodePath}`, { body, caption });
    if (result.changed) {
      await refreshAfterChange(result.revisionId);
    }
  }, [revId, refreshAfterChange]);
  const handleAddChild = q2((nodePath) => {
    setAddingChildOf(nodePath);
    setEditingPath(null);
  }, []);
  const handleAddChildSubmit = q2(async (parentNodePath, { marker, caption, body }) => {
    const result = await api_default.post(`/revisions/${revId}/children/${parentNodePath}`, {
      marker,
      caption,
      body
    });
    setAddingChildOf(null);
    if (result.revisionId) {
      await refreshAfterChange(result.revisionId);
    }
  }, [revId, refreshAfterChange]);
  const handleCancelAdd = q2(() => {
    setAddingChildOf(null);
  }, []);
  const handleDelete = q2(async (nodePath) => {
    if (!confirm("Delete this node and all its children?")) return;
    const result = await api_default.delete(`/revisions/${revId}/nodes/${nodePath}`);
    if (result.revisionId) {
      await refreshAfterChange(result.revisionId);
      if (nodePath === path) {
        const parent = parentPath(path);
        if (parent) navigate2(`/${docId}/${versionSlug}/${parent}`);
      }
    }
  }, [revId, refreshAfterChange, path, docId, versionSlug]);
  if (loading) return m2`<div class="node-context"><p class="text-muted">Loading...</p></div>`;
  if (!subtree || subtree.length === 0) return m2`<div class="node-context"><p>Node not found.</p></div>`;
  const rootNode = subtree.find((n4) => n4.path === path);
  if (!rootNode) return m2`<div class="node-context"><p>Node not found.</p></div>`;
  const childNodes = subtree.filter((n4) => n4.parent_path === path);
  return m2`
    <div class="node-context">
      <${SubtreeNode_default}
        node=${rootNode}
        childNodes=${childNodes}
        allNodes=${subtree}
        docId=${docId}
        versionSlug=${versionSlug}
        editingPath=${editingPath}
        addingChildOf=${addingChildOf}
        onEdit=${handleEdit}
        onSave=${handleSave}
        onCancel=${handleDoneEditing}
        onAddChild=${handleAddChild}
        onAddChildSubmit=${handleAddChildSubmit}
        onCancelAdd=${handleCancelAdd}
        onDelete=${handleDelete}
        readOnly=${readOnly}
      />
    </div>
  `;
};
var NodeContextView_default = NodeContextView;

// src/client/components/RevisionView.js
var RevisionView = ({ params }) => {
  const { docId, versionSlug, revSeq } = params;
  const pathParam = params["0"] || null;
  y2(() => {
    state.currentDiff.value = null;
    state.loading.value = true;
    Promise.all([
      api_default.get(`/documents/${docId}`),
      api_default.get(`/documents/${docId}/versions`)
    ]).then(([doc, versions]) => {
      state.currentDoc.value = doc;
      const version2 = versions.find((v5) => v5.id === versionSlug);
      if (!version2) {
        state.error.value = "Version not found";
        state.loading.value = false;
        return;
      }
      state.currentVersion.value = version2;
      const revPromise = revSeq ? api_default.get(`/documents/${docId}/rev/${revSeq}`).then((rev) => rev.id) : Promise.resolve(version2.head_rev);
      return revPromise.then((revId) => {
        state.currentRevision.value = revId;
        return api_default.get(`/revisions/${revId}/tree`).then((tree) => {
          state.treeData.value = tree;
          state.loading.value = false;
          if (!pathParam && tree.length > 0) {
            state.currentPath.value = tree[0].path;
          } else {
            state.currentPath.value = pathParam;
          }
        });
      });
    }).catch((err) => {
      state.error.value = err.message;
      state.loading.value = false;
    });
  }, [docId, versionSlug, revSeq]);
  y2(() => {
    if (pathParam !== null) {
      state.currentPath.value = pathParam;
    }
  }, [pathParam]);
  const revisionId = state.currentRevision.value;
  const currentPath = pathParam || state.currentPath.value;
  const treeData = state.treeData.value;
  const version = state.currentVersion.value;
  if (state.loading.value) {
    return m2`<main class="main-content"><p>Loading...</p></main>`;
  }
  const isBranch = version?.kind === "branch";
  const isReadOnly = !isBranch || !!version?.locked;
  const viewingHistory = !!revSeq;
  return m2`
    <div class="revision-view">
      <${TreeSidebar_default} docId=${docId} versionSlug=${versionSlug} />
      <main class="content-area">
        ${revisionId && m2`
          <${RevisionControls_default}
            revisionId=${revisionId}
            versionId=${versionSlug}
            docId=${docId}
            versionSlug=${versionSlug}
            readOnly=${isReadOnly}
            viewingHistory=${viewingHistory}
          />
        `}
        ${isReadOnly && !viewingHistory && m2`
          <div class="readonly-banner">
            ${version?.locked ? "This version is locked." : "This is a version. To make changes, work on a branch."}
          </div>
        `}
        ${viewingHistory && m2`
          <div class="readonly-banner">
            Viewing historical revision. ${""}
            <a href="/${docId}/${versionSlug}" onclick=${(e4) => {
    e4.preventDefault();
    navigate(`/${docId}/${versionSlug}`);
  }}>
              Return to tip
            </a>
          </div>
        `}
        ${currentPath && m2`
          <${NodeBreadcrumbs_default}
            path=${currentPath}
            docId=${docId}
            versionSlug=${versionSlug}
            treeData=${treeData}
          />
        `}
        ${revisionId && currentPath ? m2`<${NodeContextView_default}
              revisionId=${revisionId}
              path=${currentPath}
              docId=${docId}
              versionSlug=${versionSlug}
              readOnly=${isReadOnly || viewingHistory}
            />` : m2`<p class="text-muted">Select a node from the tree.</p>`}
      </main>
    </div>
  `;
};
var RevisionView_default = RevisionView;

// src/shared/diff.js
var diffLines = (a4, b5) => {
  const aLines = a4.split("\n");
  const bLines = b5.split("\n");
  const m6 = aLines.length;
  const n4 = bLines.length;
  const dp = Array.from({ length: m6 + 1 }, () => new Uint16Array(n4 + 1));
  for (let i5 = 1; i5 <= m6; i5++) {
    for (let j6 = 1; j6 <= n4; j6++) {
      dp[i5][j6] = aLines[i5 - 1] === bLines[j6 - 1] ? dp[i5 - 1][j6 - 1] + 1 : Math.max(dp[i5 - 1][j6], dp[i5][j6 - 1]);
    }
  }
  const result = [];
  let i4 = m6, j5 = n4;
  while (i4 > 0 || j5 > 0) {
    if (i4 > 0 && j5 > 0 && aLines[i4 - 1] === bLines[j5 - 1]) {
      result.push({ type: "equal", value: aLines[i4 - 1] });
      i4--;
      j5--;
    } else if (j5 > 0 && (i4 === 0 || dp[i4][j5 - 1] >= dp[i4 - 1][j5])) {
      result.push({ type: "add", value: bLines[j5 - 1] });
      j5--;
    } else {
      result.push({ type: "remove", value: aLines[i4 - 1] });
      i4--;
    }
  }
  return result.reverse();
};
var diffWords = (a4, b5) => {
  const aWords = a4.split(/(\s+)/);
  const bWords = b5.split(/(\s+)/);
  const m6 = aWords.length;
  const n4 = bWords.length;
  const dp = Array.from({ length: m6 + 1 }, () => new Uint16Array(n4 + 1));
  for (let i5 = 1; i5 <= m6; i5++) {
    for (let j6 = 1; j6 <= n4; j6++) {
      dp[i5][j6] = aWords[i5 - 1] === bWords[j6 - 1] ? dp[i5 - 1][j6 - 1] + 1 : Math.max(dp[i5 - 1][j6], dp[i5][j6 - 1]);
    }
  }
  const result = [];
  let i4 = m6, j5 = n4;
  while (i4 > 0 || j5 > 0) {
    if (i4 > 0 && j5 > 0 && aWords[i4 - 1] === bWords[j5 - 1]) {
      result.push({ type: "equal", value: aWords[i4 - 1] });
      i4--;
      j5--;
    } else if (j5 > 0 && (i4 === 0 || dp[i4][j5 - 1] >= dp[i4 - 1][j5])) {
      result.push({ type: "add", value: bWords[j5 - 1] });
      j5--;
    } else {
      result.push({ type: "remove", value: aWords[i4 - 1] });
      i4--;
    }
  }
  return result.reverse();
};

// src/client/components/DiffView.js
var DiffView = ({ params }) => {
  const { docId, versionSlug, seqA, seqB } = params;
  const [diff, setDiff] = d2(null);
  const [loading, setLoading] = d2(true);
  const [error, setError] = d2(null);
  y2(() => {
    Promise.all([
      api_default.get(`/documents/${docId}`),
      api_default.get(`/documents/${docId}/versions`)
    ]).then(([doc, versions]) => {
      state.currentDoc.value = doc;
      const version = versions.find((v5) => v5.id === versionSlug);
      if (version) state.currentVersion.value = version;
    }).catch(() => {
    });
    return () => {
      state.currentDiff.value = null;
    };
  }, [docId, versionSlug]);
  y2(() => {
    setLoading(true);
    api_default.get(`/documents/${docId}/diff/${seqA}/${seqB}`).then((data) => {
      setDiff(data);
      state.currentRevisionSeq.value = data.to.seq;
      state.currentDiff.value = { seqA: data.from.seq, seqB: data.to.seq };
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [docId, seqA, seqB]);
  if (loading) return m2`<main class="main-content"><p>Loading diff...</p></main>`;
  if (error) return m2`<main class="main-content"><p class="text-muted">Error: ${error}</p></main>`;
  if (!diff) return m2`<main class="main-content"><p>No diff data.</p></main>`;
  const { from, to, summary, added, removed, modified } = diff;
  const hasChanges = summary.added + summary.removed + summary.modified > 0;
  return m2`
    <main class="main-content diff-view">
      <div class="diff-view__header">
        <div class="diff-view__messages">
          ${from.message && m2`<div class="diff-msg"><strong>From:</strong> ${from.message}</div>`}
          ${to.message && m2`<div class="diff-msg"><strong>To:</strong> ${to.message}</div>`}
        </div>
      </div>

      <div class="diff-summary">
        <span class="diff-stat diff-stat--added">${summary.added} added</span>
        <span class="diff-stat diff-stat--removed">${summary.removed} removed</span>
        <span class="diff-stat diff-stat--modified">${summary.modified} modified</span>
        <span class="diff-stat diff-stat--unchanged">${summary.unchanged} unchanged</span>
      </div>

      ${!hasChanges && m2`<p class="text-muted">No changes between these revisions.</p>`}

      ${added.length > 0 && m2`
        <section class="diff-section">
          <h3 class="diff-section__title diff-section__title--added">Added</h3>
          ${added.map((entry) => m2`
            <details class="diff-entry diff-entry--added" open>
              <summary class="diff-entry__header">
                ${entry.marker && m2`<span class="diff-entry__marker">${entry.marker}.</span>`}
                <span class="diff-entry__caption">${entry.caption || entry.path}</span>
                <span class="diff-entry__path">${entry.path}</span>
              </summary>
              ${entry.body && m2`
                <div class="diff-entry__body">
                  <div class="diff-line diff-line--add">${entry.body}</div>
                </div>
              `}
            </details>
          `)}
        </section>
      `}

      ${removed.length > 0 && m2`
        <section class="diff-section">
          <h3 class="diff-section__title diff-section__title--removed">Removed</h3>
          ${removed.map((entry) => m2`
            <details class="diff-entry diff-entry--removed">
              <summary class="diff-entry__header">
                ${entry.marker && m2`<span class="diff-entry__marker">${entry.marker}.</span>`}
                <span class="diff-entry__caption">${entry.caption || entry.path}</span>
                <span class="diff-entry__path">${entry.path}</span>
              </summary>
              ${entry.body && m2`
                <div class="diff-entry__body">
                  <div class="diff-line diff-line--remove">${entry.body}</div>
                </div>
              `}
            </details>
          `)}
        </section>
      `}

      ${modified.length > 0 && m2`
        <section class="diff-section">
          <h3 class="diff-section__title diff-section__title--modified">Modified</h3>
          ${modified.map((entry) => m2`
            <${DiffEntry} entry=${entry} />
          `)}
        </section>
      `}

    </main>
  `;
};
var pairLines = (lines) => {
  const result = [];
  let i4 = 0;
  while (i4 < lines.length) {
    if (lines[i4].type === "remove" && i4 + 1 < lines.length && lines[i4 + 1].type === "add") {
      result.push({ type: "pair", remove: lines[i4].value, add: lines[i4 + 1].value });
      i4 += 2;
    } else {
      result.push(lines[i4]);
      i4++;
    }
  }
  return result;
};
var WordDiffLine = ({ type, text, words }) => {
  if (!words) {
    return m2`<div class="diff-line diff-line--${type}">${text || "\xA0"}</div>`;
  }
  const filterType = type === "remove" ? "remove" : "add";
  return m2`
    <div class="diff-line diff-line--${type}">${words.map(
    (w6) => w6.type === "equal" ? w6.value : w6.type === filterType ? m2`<span class="diff-word diff-word--${w6.type}">${w6.value}</span>` : null
  )}</div>
  `;
};
var DiffEntry = ({ entry }) => {
  const { path, from, to, lines, captionChanged } = entry;
  const paired = pairLines(lines);
  return m2`
    <div class="diff-entry diff-entry--modified">
      <div class="diff-entry__header">
        <span class="diff-entry__marker">${from.marker || to.marker}.</span>
        <span class="diff-entry__caption">
          ${captionChanged ? m2`<del class="diff-del">${from.caption}</del> <ins class="diff-ins">${to.caption}</ins>` : from.caption || path}
        </span>
        <span class="diff-entry__path">${path}</span>
      </div>
      <div class="diff-entry__body">
        ${paired.map((item) => {
    if (item.type === "pair") {
      const words = diffWords(item.remove, item.add);
      return m2`
              <${WordDiffLine} type="remove" text=${item.remove} words=${words} />
              <${WordDiffLine} type="add" text=${item.add} words=${words} />
            `;
    }
    return m2`<div class="diff-line diff-line--${item.type}">${item.value || "\xA0"}</div>`;
  })}
      </div>
    </div>
  `;
};
var DiffView_default = DiffView;

// src/client/components/MergeView.js
var MergeView = ({ params }) => {
  const { docId } = params;
  const [versions, setVersions] = d2([]);
  const [seqA, setSeqA] = d2("");
  const [seqB, setSeqB] = d2("");
  const [targetVersionId, setTargetVersionId] = d2("");
  const [preview, setPreview] = d2(null);
  const [resolutions, setResolutions] = d2({});
  const [message, setMessage] = d2("");
  const [loading, setLoading] = d2(false);
  const [error, setError] = d2(null);
  const [committed, setCommitted] = d2(null);
  y2(() => {
    const url = new URL(location.href);
    const from = url.searchParams.get("from");
    const into = url.searchParams.get("into");
    const target = url.searchParams.get("target");
    if (from) setSeqA(from);
    if (into) setSeqB(into);
    if (target) setTargetVersionId(target);
  }, []);
  y2(() => {
    Promise.all([
      api_default.get(`/documents/${docId}`),
      api_default.get(`/documents/${docId}/versions`)
    ]).then(([doc, vers]) => {
      state.currentDoc.value = doc;
      state.currentVersion.value = null;
      state.currentRevision.value = null;
      state.currentRevisionSeq.value = null;
      state.currentDiff.value = null;
      setVersions(vers);
      if (!targetVersionId && doc.published_version) {
        setTargetVersionId(doc.published_version);
      }
    }).catch(() => {
    });
  }, [docId]);
  const handlePreview = async () => {
    if (!seqA || !seqB) return;
    setLoading(true);
    setError(null);
    setPreview(null);
    setResolutions({});
    try {
      const data = await api_default.post(`/documents/${docId}/merge/preview`, {
        seqA: Number(seqA),
        seqB: Number(seqB)
      });
      setPreview(data);
      if (!message) {
        setMessage(`Merge Rev ${data.from.seq} + Rev ${data.to.seq}`);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  const handleResolve = (path, resolution) => {
    setResolutions((prev) => ({ ...prev, [path]: resolution }));
  };
  const allResolved = preview ? preview.conflicts.every((c4) => resolutions[c4.path]) : false;
  const handleCommit = async () => {
    if (!allResolved && preview?.conflicts.length > 0) return;
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const rev = await api_default.post(`/documents/${docId}/merge/commit`, {
        seqA: Number(seqA),
        seqB: Number(seqB),
        targetVersionId,
        message: message.trim(),
        resolutions
      });
      setCommitted(rev);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  if (committed) {
    const version = versions.find((v5) => v5.id === targetVersionId);
    const versionSlug = version?.id || targetVersionId;
    return m2`
      <main class="main-content merge-view">
        <h1>Merge Complete</h1>
        <p>Created Rev ${committed.seq} on ${version?.name || targetVersionId}.</p>
        <p>
          <a href="/${docId}/${versionSlug}/rev/${committed.seq}"
            onclick=${(e4) => {
      e4.preventDefault();
      navigate2(`/${docId}/${versionSlug}/rev/${committed.seq}`);
    }}>
            View merged revision
          </a>
        </p>
      </main>
    `;
  }
  return m2`
    <main class="main-content merge-view">
      <h1>Merge Revisions</h1>

      <div class="merge-setup">
        <div class="merge-setup__row">
          <label class="merge-setup__label">
            Ours (Rev #)
            <input class="merge-setup__input" type="number" value=${seqA}
              onInput=${(e4) => setSeqA(e4.target.value)}
              placeholder="e.g. 5" />
          </label>
          <label class="merge-setup__label">
            Theirs (Rev #)
            <input class="merge-setup__input" type="number" value=${seqB}
              onInput=${(e4) => setSeqB(e4.target.value)}
              placeholder="e.g. 3" />
          </label>
          <label class="merge-setup__label">
            Target version
            <select class="merge-setup__input" value=${targetVersionId}
              onChange=${(e4) => setTargetVersionId(e4.target.value)}>
              <option value="">Select...</option>
              ${versions.map((v5) => m2`
                <option key=${v5.id} value=${v5.id}>${v5.name} (${v5.kind})</option>
              `)}
            </select>
          </label>
        </div>
        <button class="btn btn--primary" onclick=${handlePreview}
          disabled=${loading || !seqA || !seqB}>
          ${loading ? "Loading..." : "Preview Merge"}
        </button>
      </div>

      ${error && m2`<p class="merge-error">${error}</p>`}

      ${preview && m2`
        <div class="merge-results">
          <div class="diff-summary">
            <span class="diff-stat diff-stat--added">${preview.summary.auto} auto-merged</span>
            <span class="diff-stat ${preview.summary.conflicts > 0 ? "diff-stat--removed" : "diff-stat--unchanged"}">
              ${preview.summary.conflicts} conflict${preview.summary.conflicts !== 1 ? "s" : ""}
            </span>
            <span class="diff-stat diff-stat--unchanged">LCA: Rev ${preview.lca.seq}</span>
          </div>

          ${preview.conflicts.length > 0 && m2`
            <section class="merge-section">
              <h3 class="merge-section__title merge-section__title--conflicts">
                Conflicts (${preview.conflicts.length})
              </h3>
              ${preview.conflicts.map((conflict) => m2`
                <${ConflictCard}
                  key=${conflict.path}
                  conflict=${conflict}
                  resolution=${resolutions[conflict.path]}
                  onResolve=${(r4) => handleResolve(conflict.path, r4)}
                />
              `)}
            </section>
          `}

          ${preview.merged.length > 0 && m2`
            <section class="merge-section">
              <h3 class="merge-section__title">Auto-merged (${preview.merged.length})</h3>
              <div class="merge-auto-list">
                ${preview.merged.map((entry) => m2`
                  <div class="merge-auto" key=${entry.path}>
                    ${entry.marker && m2`<span class="diff-entry__marker">${entry.marker}.</span>`}
                    <span class="merge-auto__caption">${entry.caption || entry.path}</span>
                    <span class="diff-entry__path">${entry.path}</span>
                  </div>
                `)}
              </div>
            </section>
          `}

          <div class="merge-commit">
            <h3>Commit Merge</h3>
            <input class="merge-commit__message" type="text"
              placeholder="Merge message..."
              value=${message}
              onInput=${(e4) => setMessage(e4.target.value)}
              onKeyDown=${(e4) => e4.key === "Enter" && allResolved && handleCommit()} />
            <button class="btn btn--primary" onclick=${handleCommit}
              disabled=${loading || !message.trim() || !allResolved && preview.conflicts.length > 0}>
              ${loading ? "Committing..." : "Commit Merge"}
            </button>
            ${!allResolved && preview.conflicts.length > 0 && m2`
              <span class="text-muted" style="font-size:0.85rem">
                Resolve all conflicts before committing
              </span>
            `}
          </div>
        </div>
      `}
    </main>
  `;
};
var ConflictCard = ({ conflict, resolution, onResolve }) => {
  const [editing, setEditing] = d2(false);
  const [editBody, setEditBody] = d2("");
  const [editCaption, setEditCaption] = d2("");
  const { path, type, base, ours, theirs } = conflict;
  const resolved = !!resolution;
  const startEdit = (source) => {
    const entry = source === "ours" ? ours : theirs;
    setEditBody(entry?.body || "");
    setEditCaption(entry?.caption || "");
    setEditing(true);
  };
  const saveEdit = () => {
    onResolve({ body: editBody, caption: editCaption });
    setEditing(false);
  };
  const baseBody = base?.body || "";
  const oursBody = ours?.body || "";
  const theirsBody = theirs?.body || "";
  return m2`
    <div class="merge-conflict ${resolved ? "merge-conflict--resolved" : ""}">
      <div class="merge-conflict__header">
        <span class="merge-conflict__path">
          ${(ours || theirs || base)?.marker && m2`<strong>${(ours || theirs || base).marker}.</strong>`}
          ${" "}${(ours || theirs || base)?.caption || path}
        </span>
        <span class="merge-conflict__type">${type}</span>
        ${resolved && m2`<span class="merge-conflict__resolved-badge">Resolved</span>`}
      </div>

      ${type === "delete-modify" && m2`
        <div class="merge-conflict__info">
          ${!ours ? "Deleted in ours, modified in theirs" : "Modified in ours, deleted in theirs"}
        </div>
      `}

      <div class="merge-conflict__sides">
        ${ours && m2`
          <div class="merge-conflict__side merge-conflict__side--ours">
            <div class="merge-conflict__side-label">Ours</div>
            <${DiffPanel} base=${baseBody} content=${oursBody} />
          </div>
        `}
        ${theirs && m2`
          <div class="merge-conflict__side merge-conflict__side--theirs">
            <div class="merge-conflict__side-label">Theirs</div>
            <${DiffPanel} base=${baseBody} content=${theirsBody} />
          </div>
        `}
      </div>

      <div class="merge-conflict__actions">
        ${ours && m2`
          <button class="btn btn--sm ${resolution === "ours" ? "btn--primary" : ""}"
            onclick=${() => onResolve("ours")}>
            Use Ours
          </button>
        `}
        ${theirs && m2`
          <button class="btn btn--sm ${resolution === "theirs" ? "btn--primary" : ""}"
            onclick=${() => onResolve("theirs")}>
            Use Theirs
          </button>
        `}
        ${type === "delete-modify" && m2`
          <button class="btn btn--sm btn--danger"
            onclick=${() => onResolve(ours ? "ours" : "theirs")}>
            ${ours ? "Keep (ours)" : "Keep (theirs)"}
          </button>
          <button class="btn btn--sm"
            onclick=${() => onResolve(!ours ? "theirs" : "ours")}>
            Delete
          </button>
        `}
        <button class="btn btn--sm" onclick=${() => startEdit(ours ? "ours" : "theirs")}>
          Edit
        </button>
      </div>

      ${editing && m2`
        <div class="merge-editor">
          <label class="merge-editor__label">
            Caption
            <input class="merge-editor__caption" type="text"
              value=${editCaption}
              onInput=${(e4) => setEditCaption(e4.target.value)} />
          </label>
          <label class="merge-editor__label">
            Body
            <textarea class="merge-editor__body"
              value=${editBody}
              onInput=${(e4) => setEditBody(e4.target.value)}
              rows=${Math.max(6, editBody.split("\n").length + 2)} />
          </label>
          <div class="merge-editor__actions">
            <button class="btn btn--primary btn--sm" onclick=${saveEdit}>
              Apply Edit
            </button>
            <button class="btn btn--sm" onclick=${() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      `}
    </div>
  `;
};
var DiffPanel = ({ base, content }) => {
  if (base === content) {
    return m2`<div class="merge-diff-panel"><div class="diff-line diff-line--equal">${content || "(empty)"}</div></div>`;
  }
  const lines = diffLines(base, content);
  const paired = pairLines2(lines);
  return m2`
    <div class="merge-diff-panel">
      ${paired.map((item, i4) => {
    if (item.type === "pair") {
      const words = diffWords(item.remove, item.add);
      return m2`
            <div key=${i4} class="diff-line diff-line--remove">${words.map((w6) => w6.type === "equal" ? w6.value : w6.type === "remove" ? m2`<span class="diff-word diff-word--remove">${w6.value}</span>` : null)}</div>
            <div class="diff-line diff-line--add">${words.map((w6) => w6.type === "equal" ? w6.value : w6.type === "add" ? m2`<span class="diff-word diff-word--add">${w6.value}</span>` : null)}</div>
          `;
    }
    return m2`<div key=${i4} class="diff-line diff-line--${item.type}">${item.value || "\xA0"}</div>`;
  })}
    </div>
  `;
};
var pairLines2 = (lines) => {
  const result = [];
  let i4 = 0;
  while (i4 < lines.length) {
    if (lines[i4].type === "remove" && i4 + 1 < lines.length && lines[i4 + 1].type === "add") {
      result.push({ type: "pair", remove: lines[i4].value, add: lines[i4 + 1].value });
      i4 += 2;
    } else {
      result.push(lines[i4]);
      i4++;
    }
  }
  return result;
};
var MergeView_default = MergeView;

// src/client/components/BranchGraph.js
var LANE_WIDTH = 140;
var ROW_HEIGHT = 44;
var NODE_RADIUS = 8;
var PAD = { top: 36, left: 40, right: 220, bottom: 24 };
var LANE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#14b8a6"
];
var truncate = (s4, n4 = 36) => s4 && s4.length > n4 ? s4.slice(0, n4) + "\u2026" : s4;
var layoutGraph = (versions, revisions, tags, publishedVersionId) => {
  const byId = new Map(versions.map((v5) => [v5.id, v5]));
  const childrenOf = /* @__PURE__ */ new Map();
  for (const v5 of versions) {
    if (v5.parent_version_id) {
      const list = childrenOf.get(v5.parent_version_id) || [];
      list.push(v5);
      childrenOf.set(v5.parent_version_id, list);
    }
  }
  const sorted = [];
  const addWithChildren = (v5) => {
    sorted.push(v5);
    const children = (childrenOf.get(v5.id) || []).sort(
      (a4, b5) => a4.created_at < b5.created_at ? -1 : 1
    );
    for (const c4 of children) addWithChildren(c4);
  };
  const topLevel = versions.filter((v5) => !v5.parent_version_id).sort((a4, b5) => {
    if (a4.id === publishedVersionId) return -1;
    if (b5.id === publishedVersionId) return 1;
    return a4.created_at < b5.created_at ? -1 : 1;
  });
  for (const v5 of topLevel) addWithChildren(v5);
  const laneByVersion = new Map(sorted.map((v5, i4) => [v5.id, i4]));
  const revById = new Map(revisions.map((r4) => [r4.id, r4]));
  const tagsByRevId = /* @__PURE__ */ new Map();
  for (const t5 of tags) {
    const list = tagsByRevId.get(t5.revision_id) || [];
    list.push(t5.name);
    tagsByRevId.set(t5.revision_id, list);
  }
  const versionById = new Map(versions.map((v5) => [v5.id, v5]));
  const nodes = revisions.map((rev, rowIndex) => {
    const lane = laneByVersion.get(rev.version_id) ?? 0;
    return {
      id: rev.id,
      seq: rev.seq,
      message: rev.message,
      created_at: rev.created_at,
      published: rev.published,
      version_id: rev.version_id,
      parent_id: rev.parent_id,
      merge_sources: rev.merge_sources,
      tags: tagsByRevId.get(rev.id) || [],
      lane,
      x: PAD.left + lane * LANE_WIDTH,
      y: PAD.top + rowIndex * ROW_HEIGHT,
      color: LANE_COLORS[lane % LANE_COLORS.length]
    };
  });
  const nodeById = new Map(nodes.map((n4) => [n4.id, n4]));
  const edges = [];
  for (const node of nodes) {
    if (node.parent_id && nodeById.has(node.parent_id)) {
      const parent = nodeById.get(node.parent_id);
      edges.push({ from: parent, to: node, type: "parent" });
    }
    if (!node.parent_id) {
      const ver = versionById.get(node.version_id);
      if (ver?.forked_from && nodeById.has(ver.forked_from)) {
        const source = nodeById.get(ver.forked_from);
        edges.push({ from: source, to: node, type: "fork" });
      }
    }
    if (node.merge_sources) {
      for (const srcId of node.merge_sources) {
        if (nodeById.has(srcId)) {
          const source = nodeById.get(srcId);
          edges.push({ from: source, to: node, type: "merge" });
        }
      }
    }
  }
  const laneCount = sorted.length;
  const width = PAD.left + laneCount * LANE_WIDTH + PAD.right;
  const height = PAD.top + nodes.length * ROW_HEIGHT + PAD.bottom;
  const lanes = sorted.map((v5, i4) => ({
    version: v5,
    x: PAD.left + i4 * LANE_WIDTH,
    color: LANE_COLORS[i4 % LANE_COLORS.length]
  }));
  return { nodes, edges, lanes, width, height };
};
var edgePath = (from, to) => {
  if (from.x === to.x) {
    return `M ${from.x} ${from.y + NODE_RADIUS} L ${to.x} ${to.y - NODE_RADIUS}`;
  }
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y + NODE_RADIUS} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - NODE_RADIUS}`;
};
var BranchGraph = ({ params }) => {
  const { docId } = params;
  const [data, setData] = d2(null);
  const [loading, setLoading] = d2(true);
  const [error, setError] = d2(null);
  const highlightSeq = (() => {
    try {
      const url = new URL(location.href);
      const rev = url.searchParams.get("rev");
      return rev ? Number(rev) : null;
    } catch {
      return null;
    }
  })();
  y2(() => {
    setLoading(true);
    Promise.all([
      api_default.get(`/documents/${docId}`),
      api_default.get(`/documents/${docId}/history`)
    ]).then(([doc, history2]) => {
      state.currentDoc.value = doc;
      state.currentVersion.value = null;
      state.currentRevision.value = null;
      state.currentRevisionSeq.value = null;
      state.currentDiff.value = null;
      const layout = layoutGraph(history2.versions, history2.revisions, history2.tags, doc.published_version);
      setData(layout);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [docId]);
  if (loading) return m2`<main class="branch-graph"><p>Loading...</p></main>`;
  if (error) return m2`<main class="branch-graph"><p class="text-muted">Error: ${error}</p></main>`;
  if (!data) return null;
  const { nodes, edges, lanes, width, height } = data;
  return m2`
    <main class="branch-graph">
      <div class="branch-graph__nav">
        <a href="/${docId}" onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${docId}`);
  }}>
          \u2190 Back to document
        </a>
      </div>

      <div class="branch-graph__container">
        <svg class="branch-graph__svg" viewBox="0 0 ${width} ${height}"
          width=${width} height=${height}>

          ${lanes.map((lane) => m2`
            <text key=${"lane-" + lane.version.id}
              class="branch-graph__lane-label"
              x=${lane.x} y=${16}
              fill=${lane.color}>
              ${lane.version.kind === "branch" ? "\u2514 " : ""}${lane.version.name}
            </text>
          `)}

          ${edges.map((edge, i4) => m2`
            <path key=${"edge-" + i4}
              class=${"branch-graph__edge" + (edge.type === "merge" ? " branch-graph__edge--merge" : "")}
              d=${edgePath(edge.from, edge.to)}
              stroke=${edge.type === "merge" ? edge.from.color : edge.to.color}
            />
          `)}

          ${nodes.map((node) => {
    const versionId = node.version_id;
    const isHighlighted = highlightSeq === node.seq;
    return m2`
              <g key=${node.id} class="branch-graph__node"
                onclick=${() => navigate2(`/${docId}/${versionId}/rev/${node.seq}`)}>
                <title>${"Rev " + node.seq + (node.message ? " \u2014 " + node.message : "") + "\n" + (/* @__PURE__ */ new Date(node.created_at + "Z")).toLocaleString()}</title>
                ${isHighlighted && m2`
                  <circle class="branch-graph__current"
                    cx=${node.x} cy=${node.y} r=${NODE_RADIUS + 5}
                    stroke=${node.color} />
                `}
                <circle class="branch-graph__circle"
                  cx=${node.x} cy=${node.y} r=${NODE_RADIUS}
                  fill=${node.color} />
                <text class="branch-graph__seq"
                  x=${node.x + NODE_RADIUS + 6} y=${node.y + 4}>
                  ${node.seq}
                </text>
                <text class="branch-graph__message"
                  x=${node.x + NODE_RADIUS + 28} y=${node.y + 4}>
                  ${truncate(node.message) || ""}
                </text>
                ${node.tags.map((tag, ti) => m2`
                  <rect key=${"tag-" + ti} class="branch-graph__tag-bg"
                    x=${node.x + NODE_RADIUS + 6 + ti * 70} y=${node.y + 8}
                    width=${Math.min(tag.length * 6.5 + 8, 66)} height=${14}
                    rx=${3} />
                  <text key=${"tagt-" + ti} class="branch-graph__tag-text"
                    x=${node.x + NODE_RADIUS + 10 + ti * 70} y=${node.y + 18}
                    font-size="9">
                    ${truncate(tag, 8)}
                  </text>
                `)}
              </g>
            `;
  })}
        </svg>
      </div>
    </main>
  `;
};
var BranchGraph_default = BranchGraph;

// src/client/components/DocsPage.js
var toUrlPath = (p5) => p5.replace(/\.md$/, "").replace(/ /g, "+");
var fromUrlPath = (p5) => p5.replace(/\+/g, " ");
var DocsSidebar = ({ tree, currentPath, onSelect }) => {
  if (!tree) return null;
  return m2`
    <aside class="docs-sidebar">
      <ul class="docs-toc">
        ${tree.map((item) => m2`
          <${DocsTocItem} item=${item} currentPath=${currentPath} onSelect=${onSelect} depth=${0} />
        `)}
      </ul>
    </aside>
  `;
};
var DocsTocItem = ({ item, currentPath, onSelect, depth }) => {
  const [expanded, setExpanded] = d2(true);
  const isSection = item.type === "section";
  const isActive = currentPath === item.path;
  return m2`
    <li class="docs-toc__item">
      <div class="docs-toc__row ${isActive ? "docs-toc__row--active" : ""}" style=${{ paddingLeft: `${depth * 16 + 8}px` }}>
        ${isSection && m2`
          <button class="docs-toc__toggle" onclick=${() => setExpanded(!expanded)}>
            ${expanded ? "\u25BE" : "\u25B8"}
          </button>
        `}
        <a
          class="docs-toc__link"
          href="/docs/${toUrlPath(item.path)}"
          onclick=${(e4) => {
    e4.preventDefault();
    onSelect(item.path);
  }}
        >${item.name}</a>
      </div>
      ${isSection && expanded && item.children && item.children.length > 0 && m2`
        <ul class="docs-toc__children">
          ${item.children.map((child) => m2`
            <${DocsTocItem} item=${child} currentPath=${currentPath} onSelect=${onSelect} depth=${depth + 1} />
          `)}
        </ul>
      `}
    </li>
  `;
};
var DocsPage = ({ params }) => {
  const [tree, setTree] = d2(null);
  const [content, setContent] = d2(null);
  const [currentPath, setCurrentPath] = d2(null);
  const urlPath = params["0"] || null;
  y2(() => {
    state.currentDoc.value = null;
    state.currentVersion.value = null;
    api_default.get("/docs/tree").then(setTree).catch(() => {
    });
  }, []);
  y2(() => {
    const docPath = urlPath ? fromUrlPath(urlPath) : "index.md";
    setCurrentPath(urlPath ? fromUrlPath(urlPath) : null);
    api_default.get(`/docs/content/${docPath}`).then((data) => setContent(data.html)).catch(() => setContent("<p>Page not found.</p>"));
  }, [urlPath]);
  const handleSelect = (fsPath) => {
    navigate2(`/docs/${toUrlPath(fsPath)}`);
  };
  return m2`
    <div class="docs-view">
      <${DocsSidebar} tree=${tree} currentPath=${currentPath} onSelect=${handleSelect} />
      <main class="docs-content">
        ${content ? m2`<div dangerouslySetInnerHTML=${{ __html: content }} />` : m2`<p>Loading...</p>`}
      </main>
    </div>
  `;
};
var DocsPage_default = DocsPage;

// src/client/components/LoginPage.js
var getNextPath = () => {
  try {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    return next ? decodeURIComponent(next) : "/";
  } catch {
    return "/";
  }
};
var LoginPage = () => {
  const [username, setUsername] = d2("");
  const [password, setPassword] = d2("");
  const [error, setError] = d2(null);
  const [loading, setLoading] = d2(false);
  const [forceChange, setForceChange] = d2(false);
  const [newPassword, setNewPassword] = d2("");
  const [confirmPassword, setConfirmPassword] = d2("");
  const handleLogin = async (e4) => {
    e4.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api_default.post("/auth/login", {
        username,
        password
      });
      if (result.forcePasswordChange) {
        setForceChange(true);
        setLoading(false);
        return;
      }
      state.currentUser.value = result.user;
      navigate2(getNextPath());
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };
  const handlePasswordChange = async (e4) => {
    e4.preventDefault();
    setError(null);
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api_default.patch("/auth/me/password", {
        current: password,
        newPassword
      });
      const data = await api_default.get("/auth/me");
      state.currentUser.value = data.user;
      navigate2(getNextPath());
    } catch (err) {
      setError(err.message || "Password change failed");
      setLoading(false);
    }
  };
  if (forceChange) {
    return m2`
      <main class="main-content auth-page">
        <div class="auth-card">
          <h1>Change Password</h1>
          <p class="text-muted">You must change your password before continuing.</p>
          ${error && m2`<div class="auth-error">${error}</div>`}
          <form onsubmit=${handlePasswordChange}>
            <label class="auth-label">
              New Password
              <input type="password" class="auth-input" value=${newPassword}
                oninput=${(e4) => setNewPassword(e4.target.value)} required minlength="6" />
            </label>
            <label class="auth-label">
              Confirm Password
              <input type="password" class="auth-input" value=${confirmPassword}
                oninput=${(e4) => setConfirmPassword(e4.target.value)} required minlength="6" />
            </label>
            <button type="submit" class="auth-btn" disabled=${loading}>
              ${loading ? "Saving\u2026" : "Set New Password"}
            </button>
          </form>
        </div>
      </main>
    `;
  }
  return m2`
    <main class="main-content auth-page">
      <div class="auth-card">
        <h1>Log In</h1>
        ${error && m2`<div class="auth-error">${error}</div>`}
        <form onsubmit=${handleLogin}>
          <label class="auth-label">
            Username
            <input type="text" class="auth-input" value=${username}
              oninput=${(e4) => setUsername(e4.target.value)} required autofocus />
          </label>
          <label class="auth-label">
            Password
            <input type="password" class="auth-input" value=${password}
              oninput=${(e4) => setPassword(e4.target.value)} required />
          </label>
          <button type="submit" class="auth-btn" disabled=${loading}>
            ${loading ? "Logging in\u2026" : "Log In"}
          </button>
        </form>
      </div>
    </main>
  `;
};
var LoginPage_default = LoginPage;

// src/client/components/InvitePage.js
var InvitePage = ({ params }) => {
  const token = params["0"] || params.token;
  const invite = y3(null);
  const error = y3(null);
  const loading = y3(true);
  const username = y3("");
  const password = y3("");
  const displayName = y3("");
  const submitting = y3(false);
  y2(() => {
    api_default.get(`/invites/accept/${token}`).then((data) => {
      invite.value = data;
      loading.value = false;
    }).catch((err) => {
      error.value = err.message || "Invalid invite";
      loading.value = false;
    });
  }, [token]);
  const handleSubmit = async (e4) => {
    e4.preventDefault();
    error.value = null;
    if (password.value.length < 6) {
      error.value = "Password must be at least 6 characters";
      return;
    }
    submitting.value = true;
    try {
      const result = await api_default.post(`/invites/accept/${token}`, {
        username: username.value,
        password: password.value,
        displayName: displayName.value || void 0
      });
      state.currentUser.value = result.user;
      navigate2("/");
    } catch (err) {
      error.value = err.message || "Registration failed";
      submitting.value = false;
    }
  };
  if (loading.value) {
    return m2`<main class="main-content auth-page"><p>Loading\u2026</p></main>`;
  }
  if (error.value && !invite.value) {
    return m2`
      <main class="main-content auth-page">
        <div class="auth-card">
          <h1>Invalid Invite</h1>
          <p class="auth-error">${error.value}</p>
          <a href="/login" onclick=${(e4) => {
      e4.preventDefault();
      navigate2("/login");
    }}>Go to login</a>
        </div>
      </main>
    `;
  }
  return m2`
    <main class="main-content auth-page">
      <div class="auth-card">
        <h1>Create Account</h1>
        <p class="text-muted">You've been invited as <strong>${invite.value.role}</strong>.</p>
        ${error.value && m2`<div class="auth-error">${error.value}</div>`}
        <form onsubmit=${handleSubmit}>
          <label class="auth-label">
            Username
            <input type="text" class="auth-input" value=${username.value}
              oninput=${(e4) => {
    username.value = e4.target.value;
  }} required autofocus />
          </label>
          <label class="auth-label">
            Display Name (optional)
            <input type="text" class="auth-input" value=${displayName.value}
              oninput=${(e4) => {
    displayName.value = e4.target.value;
  }} />
          </label>
          <label class="auth-label">
            Password
            <input type="password" class="auth-input" value=${password.value}
              oninput=${(e4) => {
    password.value = e4.target.value;
  }} required minlength="6" />
          </label>
          <button type="submit" class="auth-btn" disabled=${submitting.value}>
            ${submitting.value ? "Creating account\u2026" : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  `;
};
var InvitePage_default = InvitePage;

// src/client/components/AdminPanel.js
var AdminPanel = () => {
  const user = state.currentUser.value;
  if (!user || user.role !== "admin") {
    return m2`
      <main class="main-content">
        <h1>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </main>
    `;
  }
  return m2`
    <main class="main-content admin-page">
      <h1>Admin Panel</h1>
      <div class="admin-sections">
        <${UserSection} />
        <${InviteSection} />
      </div>
    </main>
  `;
};
var UserSection = () => {
  const users = y3([]);
  const error = y3(null);
  const showForm = y3(false);
  const formUsername = y3("");
  const formPassword = y3("");
  const formDisplayName = y3("");
  const formRole = y3("editor");
  const loadUsers = () => {
    api_default.get("/users").then((data) => {
      users.value = data;
    }).catch((err) => {
      error.value = err.message;
    });
  };
  y2(loadUsers, []);
  const handleCreate = async (e4) => {
    e4.preventDefault();
    error.value = null;
    try {
      await api_default.post("/users", {
        username: formUsername.value,
        password: formPassword.value,
        displayName: formDisplayName.value || void 0,
        role: formRole.value
      });
      formUsername.value = "";
      formPassword.value = "";
      formDisplayName.value = "";
      formRole.value = "editor";
      showForm.value = false;
      loadUsers();
    } catch (err) {
      error.value = err.message;
    }
  };
  const handleDelete = async (userId, username) => {
    if (!confirm(`Delete user "${username}"?`)) return;
    try {
      await api_default.delete(`/users/${userId}`);
      loadUsers();
    } catch (err) {
      error.value = err.message;
    }
  };
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api_default.patch(`/users/${userId}`, { role: newRole });
      loadUsers();
    } catch (err) {
      error.value = err.message;
    }
  };
  return m2`
    <section class="admin-section">
      <h2>Users</h2>
      ${error.value && m2`<div class="auth-error">${error.value}</div>`}
      <table class="admin-table">
        <thead>
          <tr><th>Username</th><th>Display Name</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${users.value.map((u6) => m2`
            <tr key=${u6.id}>
              <td>${u6.username}</td>
              <td>${u6.display_name || "\u2014"}</td>
              <td>
                <select value=${u6.role} onchange=${(e4) => handleRoleChange(u6.id, e4.target.value)}>
                  <option value="admin">admin</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
              </td>
              <td>
                ${u6.id !== state.currentUser.value?.id && m2`
                  <button class="btn btn--small btn--danger" onclick=${() => handleDelete(u6.id, u6.username)}>Delete</button>
                `}
              </td>
            </tr>
          `)}
        </tbody>
      </table>

      ${showForm.value ? m2`
          <form class="admin-form" onsubmit=${handleCreate}>
            <input type="text" class="auth-input" placeholder="Username" value=${formUsername.value}
              oninput=${(e4) => {
    formUsername.value = e4.target.value;
  }} required />
            <input type="text" class="auth-input" placeholder="Display Name" value=${formDisplayName.value}
              oninput=${(e4) => {
    formDisplayName.value = e4.target.value;
  }} />
            <input type="password" class="auth-input" placeholder="Password" value=${formPassword.value}
              oninput=${(e4) => {
    formPassword.value = e4.target.value;
  }} required minlength="6" />
            <select class="auth-input" value=${formRole.value} onchange=${(e4) => {
    formRole.value = e4.target.value;
  }}>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
              <option value="viewer">viewer</option>
            </select>
            <div class="admin-form__actions">
              <button type="submit" class="btn btn--primary">Create User</button>
              <button type="button" class="btn" onclick=${() => {
    showForm.value = false;
  }}>Cancel</button>
            </div>
          </form>
        ` : m2`<button class="btn btn--primary" onclick=${() => {
    showForm.value = true;
  }}>Add User</button>`}
    </section>
  `;
};
var InviteSection = () => {
  const invites = y3([]);
  const error = y3(null);
  const inviteRole = y3("editor");
  const inviteHours = y3(72);
  const newInviteUrl = y3(null);
  const loadInvites = () => {
    api_default.get("/invites").then((data) => {
      invites.value = data;
    }).catch((err) => {
      error.value = err.message;
    });
  };
  y2(loadInvites, []);
  const handleGenerate = async () => {
    error.value = null;
    newInviteUrl.value = null;
    try {
      const invite = await api_default.post("/invites", {
        role: inviteRole.value,
        expiresInHours: Number(inviteHours.value)
      });
      newInviteUrl.value = `${location.origin}/invite/${invite.token}`;
      loadInvites();
    } catch (err) {
      error.value = err.message;
    }
  };
  const handleRevoke = async (token) => {
    try {
      await api_default.delete(`/invites/${token}`);
      loadInvites();
    } catch (err) {
      error.value = err.message;
    }
  };
  const copyUrl = () => {
    if (newInviteUrl.value) navigator.clipboard?.writeText(newInviteUrl.value);
  };
  return m2`
    <section class="admin-section">
      <h2>Invites</h2>
      ${error.value && m2`<div class="auth-error">${error.value}</div>`}

      <div class="admin-invite-gen">
        <select class="auth-input" value=${inviteRole.value} onchange=${(e4) => {
    inviteRole.value = e4.target.value;
  }}>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
          <option value="viewer">viewer</option>
        </select>
        <label class="admin-invite-hours">
          Expires in
          <input type="number" class="auth-input" value=${inviteHours.value} min="1" max="720"
            oninput=${(e4) => {
    inviteHours.value = e4.target.value;
  }} style="width: 5rem" />
          hours
        </label>
        <button class="btn btn--primary" onclick=${handleGenerate}>Generate Invite</button>
      </div>

      ${newInviteUrl.value && m2`
        <div class="admin-invite-url">
          <input type="text" class="auth-input" value=${newInviteUrl.value} readonly onclick=${(e4) => e4.target.select()} />
          <button class="btn" onclick=${copyUrl}>Copy</button>
        </div>
      `}

      ${invites.value.length > 0 && m2`
        <table class="admin-table">
          <thead>
            <tr><th>Role</th><th>Status</th><th>Expires</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${invites.value.map((inv) => {
    const expired = new Date(inv.expires_at) < /* @__PURE__ */ new Date();
    const status = inv.used_at ? "Used" : expired ? "Expired" : "Active";
    return m2`
                <tr key=${inv.token}>
                  <td>${inv.role}</td>
                  <td class=${`invite-status invite-status--${status.toLowerCase()}`}>${status}</td>
                  <td>${new Date(inv.expires_at).toLocaleString()}</td>
                  <td>
                    ${!inv.used_at && m2`
                      <button class="btn btn--small btn--danger" onclick=${() => handleRevoke(inv.token)}>Revoke</button>
                    `}
                  </td>
                </tr>
              `;
  })}
          </tbody>
        </table>
      `}
    </section>
  `;
};
var AdminPanel_default = AdminPanel;

// src/client/app.js
addRoute("/login", LoginPage_default);
addRoute("/invite/*", InvitePage_default);
addRoute("/admin", AdminPanel_default);
addRoute("/docs", DocsPage_default);
addRoute("/docs/*", DocsPage_default);
addRoute("/:docId/merge", MergeView_default);
addRoute("/:docId/history", BranchGraph_default);
addRoute("/:docId", DocumentOverview_default);
addRoute("/:docId/:versionSlug/rev/:revSeq/diff/:seqA/:seqB", DiffView_default);
addRoute("/:docId/:versionSlug/diff/:seqA/:seqB", DiffView_default);
addRoute("/:docId/:versionSlug/rev/:revSeq", RevisionView_default);
addRoute("/:docId/:versionSlug/rev/:revSeq/*", RevisionView_default);
addRoute("/:docId/:versionSlug", RevisionView_default);
addRoute("/:docId/:versionSlug/*", RevisionView_default);
addRoute("/", null);
var App = () => {
  const { component: Component, params: p5 } = currentMatch.value;
  y2(() => {
    api_default.get("/auth/me").then((data) => {
      state.currentUser.value = data.user;
    }).catch(() => {
    }).finally(() => {
      state.authChecked.value = true;
    });
    api_default.get("/documents").then((docs) => {
      state.documents.value = docs;
    }).catch(() => {
    });
  }, []);
  return m2`
    <div class="app">
      <${TopBar_default} />
      <div class="app__body">
        ${Component ? m2`<${Component} params=${p5} />` : m2`<${Home} />`}
      </div>
    </div>
  `;
};
var Home = () => {
  const docs = state.documents.value;
  return m2`
    <main class="main-content">
      <h1>Articulate</h1>
      <p>Collaborative editing for hierarchical legal and policy documents.</p>
      ${docs.length > 0 ? m2`
          <h2>Documents</h2>
          <ul class="doc-list">
            ${docs.map((d5) => m2`
              <li><a href="/${d5.id}" onclick=${(e4) => {
    e4.preventDefault();
    navigate2(`/${d5.id}`);
  }}>${d5.title}</a></li>
            `)}
          </ul>
        ` : m2`<p class="text-muted">No documents yet. Import one to get started.</p>`}
    </main>
  `;
};
var app_default = App;

// src/client/index.js
var root = document.getElementById("app");
R(m2`<${app_default} />`, root);
if (true) {
  const events = new EventSource("/__live-reload");
  events.onmessage = (e4) => {
    if (e4.data === "reload") location.reload();
  };
}
