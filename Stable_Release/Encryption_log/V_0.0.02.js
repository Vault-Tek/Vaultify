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
    function(l) {
        var t = bt
          , e = t.lib
          , r = e.WordArray
          , i = e.Hasher
          , n = t.algo
          , H = [];
        !function() {
            for (var t = 0; t < 64; t++)
                H[t] = 4294967296 * l.abs(l.sin(t + 1)) | 0
        }();
        var o = n.MD5 = i.extend({
            _doReset: function() {
                this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878])
            },
            _doProcessBlock: function(t, e) {
                for (var r = 0; r < 16; r++) {
                    var i = e + r
                      , n = t[i];
                    t[i] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
                }
                var o = this._hash.words
                  , s = t[e + 0]
                  , c = t[e + 1]
                  , a = t[e + 2]
                  , h = t[e + 3]
                  , l = t[e + 4]
                  , f = t[e + 5]
                  , d = t[e + 6]
                  , u = t[e + 7]
                  , p = t[e + 8]
                  , _ = t[e + 9]
                  , v = t[e + 10]
                  , y = t[e + 11]
                  , g = t[e + 12]
                  , B = t[e + 13]
                  , w = t[e + 14]
                  , k = t[e + 15]
                  , S = o[0]
                  , m = o[1]
                  , x = o[2]
                  , b = o[3];
                S = z(S, m, x, b, s, 7, H[0]),
                b = z(b, S, m, x, c, 12, H[1]),
                x = z(x, b, S, m, a, 17, H[2]),
                m = z(m, x, b, S, h, 22, H[3]),
                S = z(S, m, x, b, l, 7, H[4]),
                b = z(b, S, m, x, f, 12, H[5]),
                x = z(x, b, S, m, d, 17, H[6]),
                m = z(m, x, b, S, u, 22, H[7]),
                S = z(S, m, x, b, p, 7, H[8]),
                b = z(b, S, m, x, _, 12, H[9]),
                x = z(x, b, S, m, v, 17, H[10]),
                m = z(m, x, b, S, y, 22, H[11]),
                S = z(S, m, x, b, g, 7, H[12]),
                b = z(b, S, m, x, B, 12, H[13]),
                x = z(x, b, S, m, w, 17, H[14]),
                S = A(S, m = z(m, x, b, S, k, 22, H[15]), x, b, c, 5, H[16]),
                b = A(b, S, m, x, d, 9, H[17]),
                x = A(x, b, S, m, y, 14, H[18]),
                m = A(m, x, b, S, s, 20, H[19]),
                S = A(S, m, x, b, f, 5, H[20]),
                b = A(b, S, m, x, v, 9, H[21]),
                x = A(x, b, S, m, k, 14, H[22]),
                m = A(m, x, b, S, l, 20, H[23]),
                S = A(S, m, x, b, _, 5, H[24]),
                b = A(b, S, m, x, w, 9, H[25]),
                x = A(x, b, S, m, h, 14, H[26]),
                m = A(m, x, b, S, p, 20, H[27]),
                S = A(S, m, x, b, B, 5, H[28]),
                b = A(b, S, m, x, a, 9, H[29]),
                x = A(x, b, S, m, u, 14, H[30]),
                S = C(S, m = A(m, x, b, S, g, 20, H[31]), x, b, f, 4, H[32]),
                b = C(b, S, m, x, p, 11, H[33]),
                x = C(x, b, S, m, y, 16, H[34]),
                m = C(m, x, b, S, w, 23, H[35]),
                S = C(S, m, x, b, c, 4, H[36]),
                b = C(b, S, m, x, l, 11, H[37]),
                x = C(x, b, S, m, u, 16, H[38]),
                m = C(m, x, b, S, v, 23, H[39]),
                S = C(S, m, x, b, B, 4, H[40]),
                b = C(b, S, m, x, s, 11, H[41]),
                x = C(x, b, S, m, h, 16, H[42]),
                m = C(m, x, b, S, d, 23, H[43]),
                S = C(S, m, x, b, _, 4, H[44]),
                b = C(b, S, m, x, g, 11, H[45]),
                x = C(x, b, S, m, k, 16, H[46]),
                S = D(S, m = C(m, x, b, S, a, 23, H[47]), x, b, s, 6, H[48]),
                b = D(b, S, m, x, u, 10, H[49]),
                x = D(x, b, S, m, w, 15, H[50]),
                m = D(m, x, b, S, f, 21, H[51]),
                S = D(S, m, x, b, g, 6, H[52]),
                b = D(b, S, m, x, h, 10, H[53]),
                x = D(x, b, S, m, v, 15, H[54]),
                m = D(m, x, b, S, c, 21, H[55]),
                S = D(S, m, x, b, p, 6, H[56]),
                b = D(b, S, m, x, k, 10, H[57]),
                x = D(x, b, S, m, d, 15, H[58]),
                m = D(m, x, b, S, B, 21, H[59]),
                S = D(S, m, x, b, l, 6, H[60]),
                b = D(b, S, m, x, y, 10, H[61]),
                x = D(x, b, S, m, a, 15, H[62]),
                m = D(m, x, b, S, _, 21, H[63]),
                o[0] = o[0] + S | 0,
                o[1] = o[1] + m | 0,
                o[2] = o[2] + x | 0,
                o[3] = o[3] + b | 0
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , r = 8 * this._nDataBytes
                  , i = 8 * t.sigBytes;
                e[i >>> 5] |= 128 << 24 - i % 32;
                var n = l.floor(r / 4294967296)
                  , o = r;
                e[15 + (64 + i >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8),
                e[14 + (64 + i >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                t.sigBytes = 4 * (e.length + 1),
                this._process();
                for (var s = this._hash, c = s.words, a = 0; a < 4; a++) {
                    var h = c[a];
                    c[a] = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8)
                }
                return s
            },
            clone: function() {
                var t = i.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        });
        function z(t, e, r, i, n, o, s) {
            var c = t + (e & r | ~e & i) + n + s;
            return (c << o | c >>> 32 - o) + e
        }
        function A(t, e, r, i, n, o, s) {
            var c = t + (e & i | r & ~i) + n + s;
            return (c << o | c >>> 32 - o) + e
        }
        function C(t, e, r, i, n, o, s) {
            var c = t + (e ^ r ^ i) + n + s;
            return (c << o | c >>> 32 - o) + e
        }
        function D(t, e, r, i, n, o, s) {
            var c = t + (r ^ (e | ~i)) + n + s;
            return (c << o | c >>> 32 - o) + e
        }
        t.MD5 = i._createHelper(o),
        t.HmacMD5 = i._createHmacHelper(o)
    }(Math),
    e = (t = bt).lib,
    r = e.WordArray,
    i = e.Hasher,
    n = t.algo,
    f = [],
    o = n.SHA1 = i.extend({
        _doReset: function() {
            this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
        },
        _doProcessBlock: function(t, e) {
            for (var r = this._hash.words, i = r[0], n = r[1], o = r[2], s = r[3], c = r[4], a = 0; a < 80; a++) {
                if (a < 16)
                    f[a] = 0 | t[e + a];
                else {
                    var h = f[a - 3] ^ f[a - 8] ^ f[a - 14] ^ f[a - 16];
                    f[a] = h << 1 | h >>> 31
                }
                var l = (i << 5 | i >>> 27) + c + f[a];
                l += a < 20 ? 1518500249 + (n & o | ~n & s) : a < 40 ? 1859775393 + (n ^ o ^ s) : a < 60 ? (n & o | n & s | o & s) - 1894007588 : (n ^ o ^ s) - 899497514,
                c = s,
                s = o,
                o = n << 30 | n >>> 2,
                n = i,
                i = l
            }
            r[0] = r[0] + i | 0,
            r[1] = r[1] + n | 0,
            r[2] = r[2] + o | 0,
            r[3] = r[3] + s | 0,
            r[4] = r[4] + c | 0
        },
        _doFinalize: function() {
            var t = this._data
              , e = t.words
              , r = 8 * this._nDataBytes
              , i = 8 * t.sigBytes;
            return e[i >>> 5] |= 128 << 24 - i % 32,
            e[14 + (64 + i >>> 9 << 4)] = Math.floor(r / 4294967296),
            e[15 + (64 + i >>> 9 << 4)] = r,
            t.sigBytes = 4 * e.length,
            this._process(),
            this._hash
        },
        clone: function() {
            var t = i.clone.call(this);
            return t._hash = this._hash.clone(),
            t
        }
    }),
    t.SHA1 = i._createHelper(o),
    t.HmacSHA1 = i._createHmacHelper(o),
    function(n) {
        var t = bt
          , e = t.lib
          , r = e.WordArray
          , i = e.Hasher
          , o = t.algo
          , s = []
          , B = [];
        !function() {
            function t(t) {
                for (var e = n.sqrt(t), r = 2; r <= e; r++)
                    if (!(t % r))
                        return;
                return 1
            }
            function e(t) {
                return 4294967296 * (t - (0 | t)) | 0
            }
            for (var r = 2, i = 0; i < 64; )
                t(r) && (i < 8 && (s[i] = e(n.pow(r, .5))),
                B[i] = e(n.pow(r, 1 / 3)),
                i++),
                r++
        }();
        var w = []
          , c = o.SHA256 = i.extend({
            _doReset: function() {
                this._hash = new r.init(s.slice(0))
            },
            _doProcessBlock: function(t, e) {
                for (var r = this._hash.words, i = r[0], n = r[1], o = r[2], s = r[3], c = r[4], a = r[5], h = r[6], l = r[7], f = 0; f < 64; f++) {
                    if (f < 16)
                        w[f] = 0 | t[e + f];
                    else {
                        var d = w[f - 15]
                          , u = (d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3
                          , p = w[f - 2]
                          , _ = (p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10;
                        w[f] = u + w[f - 7] + _ + w[f - 16]
                    }
                    var v = i & n ^ i & o ^ n & o
                      , y = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22)
                      , g = l + ((c << 26 | c >>> 6) ^ (c << 21 | c >>> 11) ^ (c << 7 | c >>> 25)) + (c & a ^ ~c & h) + B[f] + w[f];
                    l = h,
                    h = a,
                    a = c,
                    c = s + g | 0,
                    s = o,
                    o = n,
                    n = i,
                    i = g + (y + v) | 0
                }
                r[0] = r[0] + i | 0,
                r[1] = r[1] + n | 0,
                r[2] = r[2] + o | 0,
                r[3] = r[3] + s | 0,
                r[4] = r[4] + c | 0,
                r[5] = r[5] + a | 0,
                r[6] = r[6] + h | 0,
                r[7] = r[7] + l | 0
            },
