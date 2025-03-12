!function(t, e) {
    "object" == typeof exports ? module.exports = exports = e() : "function" == typeof define && define.amd ? define([], e) : t.CryptoJS = e()
}(this, function() {
    var h, t, e, r, i, n, f, o, s, c, a, l, d, m, x, b, H, z, A, u, p, _, v, y, g, B, w, k, S, C, D, E, R, M, F, P, W, O, I, U, K, X, L, j, N, T, q, Z, V, G, J, $, Q, Y, tt, et, rt, it, nt, ot, st, ct, at, ht, lt, ft, dt, ut, pt, _t, vt, yt, gt, Bt, wt, kt, St, bt = bt || function(l) {
        var t;
        if ("undefined" != typeof window && window.crypto && (t = window.crypto),
        !t && "undefined" != typeof window && window.msCrypto && (t = window.msCrypto),
        !t && "undefined" != typeof global && global.crypto && (t = global.crypto),
        !t && "function" == typeof require)
            try {
                t = require("crypto")
            } catch (t) {}
        function i() {
            if (t) {
                if ("function" == typeof t.getRandomValues)
                    try {
                        return t.getRandomValues(new Uint32Array(1))[0]
                    } catch (t) {}
                if ("function" == typeof t.randomBytes)
                    try {
                        return t.randomBytes(4).readInt32LE()
                    } catch (t) {}
            }
            throw new Error("Native crypto module could not be used to get secure random number.")
        }
        var r = Object.create || function(t) {
            var e;
            return n.prototype = t,
            e = new n,
            n.prototype = null,
            e
        }
        ;
        function n() {}
        var e = {}
          , o = e.lib = {}
          , s = o.Base = {
            extend: function(t) {
                var e = r(this);
                return t && e.mixIn(t),
                e.hasOwnProperty("init") && this.init !== e.init || (e.init = function() {
                    e.$super.init.apply(this, arguments)
                }
                ),
                (e.init.prototype = e).$super = this,
                e
            },
            create: function() {
                var t = this.extend();
                return t.init.apply(t, arguments),
                t
            },
            init: function() {},
            mixIn: function(t) {
                for (var e in t)
                    t.hasOwnProperty(e) && (this[e] = t[e]);
                t.hasOwnProperty("toString") && (this.toString = t.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        }
          , f = o.WordArray = s.extend({
            init: function(t, e) {
                t = this.words = t || [],
                this.sigBytes = null != e ? e : 4 * t.length
            },
            toString: function(t) {
                return (t || a).stringify(this)
            },
            concat: function(t) {
                var e = this.words
                  , r = t.words
                  , i = this.sigBytes
                  , n = t.sigBytes;
                if (this.clamp(),
                i % 4)
                    for (var o = 0; o < n; o++) {
                        var s = r[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                        e[i + o >>> 2] |= s << 24 - (i + o) % 4 * 8
                    }
                else
                    for (o = 0; o < n; o += 4)
                        e[i + o >>> 2] = r[o >>> 2];
                return this.sigBytes += n,
                this
            },
            clamp: function() {
                var t = this.words
                  , e = this.sigBytes;
                t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8,
                t.length = l.ceil(e / 4)
            },
            clone: function() {
                var t = s.clone.call(this);
                return t.words = this.words.slice(0),
                t
            },
            random: function(t) {
                for (var e = [], r = 0; r < t; r += 4)
                    e.push(i());
                return new f.init(e,t)
            }
        })
          , c = e.enc = {}
          , a = c.Hex = {
            stringify: function(t) {
                for (var e = t.words, r = t.sigBytes, i = [], n = 0; n < r; n++) {
                    var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                    i.push((o >>> 4).toString(16)),
                    i.push((15 & o).toString(16))
                }
                return i.join("")
            },
            parse: function(t) {
                for (var e = t.length, r = [], i = 0; i < e; i += 2)
                    r[i >>> 3] |= parseInt(t.substr(i, 2), 16) << 24 - i % 8 * 4;
                return new f.init(r,e / 2)
            }
        }
          , h = c.Latin1 = {
            stringify: function(t) {
                for (var e = t.words, r = t.sigBytes, i = [], n = 0; n < r; n++) {
                    var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                    i.push(String.fromCharCode(o))
                }
                return i.join("")
            },
            parse: function(t) {
                for (var e = t.length, r = [], i = 0; i < e; i++)
                    r[i >>> 2] |= (255 & t.charCodeAt(i)) << 24 - i % 4 * 8;
                return new f.init(r,e)
            }
        }
          , d = c.Utf8 = {
            stringify: function(t) {
                try {
                    return decodeURIComponent(escape(h.stringify(t)))
                } catch (t) {
                    throw new Error("Malformed UTF-8 data")
                }
            },
            parse: function(t) {
                return h.parse(unescape(encodeURIComponent(t)))
            }
        }
          , u = o.BufferedBlockAlgorithm = s.extend({
            reset: function() {
                this._data = new f.init,
                this._nDataBytes = 0
            },
            _append: function(t) {
                "string" == typeof t && (t = d.parse(t)),
                this._data.concat(t),
                this._nDataBytes += t.sigBytes
            },
            _process: function(t) {
                var e, r = this._data, i = r.words, n = r.sigBytes, o = this.blockSize, s = n / (4 * o), c = (s = t ? l.ceil(s) : l.max((0 | s) - this._minBufferSize, 0)) * o, a = l.min(4 * c, n);
                if (c) {
                    for (var h = 0; h < c; h += o)
                        this._doProcessBlock(i, h);
                    e = i.splice(0, c),
                    r.sigBytes -= a
                }
                return new f.init(e,a)
            },
            clone: function() {
                var t = s.clone.call(this);
                return t._data = this._data.clone(),
                t
            },
            _minBufferSize: 0
        })
          , p = (o.Hasher = u.extend({
            cfg: s.extend(),
            init: function(t) {
                this.cfg = this.cfg.extend(t),
                this.reset()
            },
            reset: function() {
                u.reset.call(this),
                this._doReset()
            },
            update: function(t) {
                return this._append(t),
                this._process(),
                this
            },
            finalize: function(t) {
                return t && this._append(t),
                this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function(r) {
                return function(t, e) {
                    return new r.init(e).finalize(t)
                }
            },
            _createHmacHelper: function(r) {
                return function(t, e) {
                    return new p.HMAC.init(r,e).finalize(t)
                }
            }
        }),
        e.algo = {});
        return e
    }(Math);
    function mt(t, e, r) {
        return t ^ e ^ r
    }
    function xt(t, e, r) {
        return t & e | ~t & r
    }
    function Ht(t, e, r) {
        return (t | ~e) ^ r
    }
    function zt(t, e, r) {
        return t & r | e & ~r
    }
    function At(t, e, r) {
        return t ^ (e | ~r)
    }
    function Ct(t, e) {
        return t << e | t >>> 32 - e
    }
    function Dt(t, e, r, i) {
        var n, o = this._iv;
        o ? (n = o.slice(0),
        this._iv = void 0) : n = this._prevBlock,
        i.encryptBlock(n, 0);
        for (var s = 0; s < r; s++)
            t[e + s] ^= n[s]
    }
    function Et(t) {
        if (255 == (t >> 24 & 255)) {
            var e = t >> 16 & 255
              , r = t >> 8 & 255
              , i = 255 & t;
            255 === e ? (e = 0,
            255 === r ? (r = 0,
            255 === i ? i = 0 : ++i) : ++r) : ++e,
            t = 0,
            t += e << 16,
            t += r << 8,
            t += i
        } else
            t += 1 << 24;
        return t
    }
    function Rt() {
        for (var t = this._X, e = this._C, r = 0; r < 8; r++)
            ft[r] = e[r];
        e[0] = e[0] + 1295307597 + this._b | 0,
        e[1] = e[1] + 3545052371 + (e[0] >>> 0 < ft[0] >>> 0 ? 1 : 0) | 0,
        e[2] = e[2] + 886263092 + (e[1] >>> 0 < ft[1] >>> 0 ? 1 : 0) | 0,
        e[3] = e[3] + 1295307597 + (e[2] >>> 0 < ft[2] >>> 0 ? 1 : 0) | 0,
        e[4] = e[4] + 3545052371 + (e[3] >>> 0 < ft[3] >>> 0 ? 1 : 0) | 0,
        e[5] = e[5] + 886263092 + (e[4] >>> 0 < ft[4] >>> 0 ? 1 : 0) | 0,
        e[6] = e[6] + 1295307597 + (e[5] >>> 0 < ft[5] >>> 0 ? 1 : 0) | 0,
        e[7] = e[7] + 3545052371 + (e[6] >>> 0 < ft[6] >>> 0 ? 1 : 0) | 0,
        this._b = e[7] >>> 0 < ft[7] >>> 0 ? 1 : 0;
        for (r = 0; r < 8; r++) {
            var i = t[r] + e[r]
              , n = 65535 & i
              , o = i >>> 16
              , s = ((n * n >>> 17) + n * o >>> 15) + o * o
              , c = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
            dt[r] = s ^ c
        }
        t[0] = dt[0] + (dt[7] << 16 | dt[7] >>> 16) + (dt[6] << 16 | dt[6] >>> 16) | 0,
        t[1] = dt[1] + (dt[0] << 8 | dt[0] >>> 24) + dt[7] | 0,
        t[2] = dt[2] + (dt[1] << 16 | dt[1] >>> 16) + (dt[0] << 16 | dt[0] >>> 16) | 0,
        t[3] = dt[3] + (dt[2] << 8 | dt[2] >>> 24) + dt[1] | 0,
        t[4] = dt[4] + (dt[3] << 16 | dt[3] >>> 16) + (dt[2] << 16 | dt[2] >>> 16) | 0,
        t[5] = dt[5] + (dt[4] << 8 | dt[4] >>> 24) + dt[3] | 0,
        t[6] = dt[6] + (dt[5] << 16 | dt[5] >>> 16) + (dt[4] << 16 | dt[4] >>> 16) | 0,
        t[7] = dt[7] + (dt[6] << 8 | dt[6] >>> 24) + dt[5] | 0
    }
    function Mt() {
        for (var t = this._X, e = this._C, r = 0; r < 8; r++)
            wt[r] = e[r];
        e[0] = e[0] + 1295307597 + this._b | 0,
        e[1] = e[1] + 3545052371 + (e[0] >>> 0 < wt[0] >>> 0 ? 1 : 0) | 0,
        e[2] = e[2] + 886263092 + (e[1] >>> 0 < wt[1] >>> 0 ? 1 : 0) | 0,
        e[3] = e[3] + 1295307597 + (e[2] >>> 0 < wt[2] >>> 0 ? 1 : 0) | 0,
        e[4] = e[4] + 3545052371 + (e[3] >>> 0 < wt[3] >>> 0 ? 1 : 0) | 0,
        e[5] = e[5] + 886263092 + (e[4] >>> 0 < wt[4] >>> 0 ? 1 : 0) | 0,
        e[6] = e[6] + 1295307597 + (e[5] >>> 0 < wt[5] >>> 0 ? 1 : 0) | 0,
        e[7] = e[7] + 3545052371 + (e[6] >>> 0 < wt[6] >>> 0 ? 1 : 0) | 0,
        this._b = e[7] >>> 0 < wt[7] >>> 0 ? 1 : 0;
        for (r = 0; r < 8; r++) {
            var i = t[r] + e[r]
              , n = 65535 & i
              , o = i >>> 16
              , s = ((n * n >>> 17) + n * o >>> 15) + o * o
              , c = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
            kt[r] = s ^ c
        }
        t[0] = kt[0] + (kt[7] << 16 | kt[7] >>> 16) + (kt[6] << 16 | kt[6] >>> 16) | 0,
        t[1] = kt[1] + (kt[0] << 8 | kt[0] >>> 24) + kt[7] | 0,
        t[2] = kt[2] + (kt[1] << 16 | kt[1] >>> 16) + (kt[0] << 16 | kt[0] >>> 16) | 0,
        t[3] = kt[3] + (kt[2] << 8 | kt[2] >>> 24) + kt[1] | 0,
        t[4] = kt[4] + (kt[3] << 16 | kt[3] >>> 16) + (kt[2] << 16 | kt[2] >>> 16) | 0,
        t[5] = kt[5] + (kt[4] << 8 | kt[4] >>> 24) + kt[3] | 0,
        t[6] = kt[6] + (kt[5] << 16 | kt[5] >>> 16) + (kt[4] << 16 | kt[4] >>> 16) | 0,
        t[7] = kt[7] + (kt[6] << 8 | kt[6] >>> 24) + kt[5] | 0
    }
    return h = bt.lib.WordArray,
    bt.enc.Base64 = {
        stringify: function(t) {
            var e = t.words
              , r = t.sigBytes
              , i = this._map;
            t.clamp();
            for (var n = [], o = 0; o < r; o += 3)
                for (var s = (e[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (e[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | e[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, c = 0; c < 4 && o + .75 * c < r; c++)
                    n.push(i.charAt(s >>> 6 * (3 - c) & 63));
            var a = i.charAt(64);
            if (a)
                for (; n.length % 4; )
                    n.push(a);
            return n.join("")
        },
        parse: function(t) {
            var e = t.length
              , r = this._map
              , i = this._reverseMap;
            if (!i) {
                i = this._reverseMap = [];
                for (var n = 0; n < r.length; n++)
                    i[r.charCodeAt(n)] = n
            }
            var o = r.charAt(64);
            if (o) {
                var s = t.indexOf(o);
                -1 !== s && (e = s)
            }
            return function(t, e, r) {
                for (var i = [], n = 0, o = 0; o < e; o++)
                    if (o % 4) {
                        var s = r[t.charCodeAt(o - 1)] << o % 4 * 2
                          , c = r[t.charCodeAt(o)] >>> 6 - o % 4 * 2
                          , a = s | c;
                        i[n >>> 2] |= a << 24 - n % 4 * 8,
                        n++
                    }
                return h.create(i, n)
            }(t, e, i)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    },
