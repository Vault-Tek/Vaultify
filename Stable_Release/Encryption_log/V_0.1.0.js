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
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , r = 8 * this._nDataBytes
                  , i = 8 * t.sigBytes;
                return e[i >>> 5] |= 128 << 24 - i % 32,
                e[14 + (64 + i >>> 9 << 4)] = n.floor(r / 4294967296),
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
        });
        t.SHA256 = i._createHelper(c),
        t.HmacSHA256 = i._createHmacHelper(c)
    }(Math),
    function() {
        var n = bt.lib.WordArray
          , t = bt.enc;
        t.Utf16 = t.Utf16BE = {
            stringify: function(t) {
                for (var e = t.words, r = t.sigBytes, i = [], n = 0; n < r; n += 2) {
                    var o = e[n >>> 2] >>> 16 - n % 4 * 8 & 65535;
                    i.push(String.fromCharCode(o))
                }
                return i.join("")
            },
            parse: function(t) {
                for (var e = t.length, r = [], i = 0; i < e; i++)
                    r[i >>> 1] |= t.charCodeAt(i) << 16 - i % 2 * 16;
                return n.create(r, 2 * e)
            }
        };
        function s(t) {
            return t << 8 & 4278255360 | t >>> 8 & 16711935
        }
        t.Utf16LE = {
            stringify: function(t) {
                for (var e = t.words, r = t.sigBytes, i = [], n = 0; n < r; n += 2) {
                    var o = s(e[n >>> 2] >>> 16 - n % 4 * 8 & 65535);
                    i.push(String.fromCharCode(o))
                }
                return i.join("")
            },
            parse: function(t) {
                for (var e = t.length, r = [], i = 0; i < e; i++)
                    r[i >>> 1] |= s(t.charCodeAt(i) << 16 - i % 2 * 16);
                return n.create(r, 2 * e)
            }
        }
    }(),
    function() {
        if ("function" == typeof ArrayBuffer) {
            var t = bt.lib.WordArray
              , n = t.init;
            (t.init = function(t) {
                if (t instanceof ArrayBuffer && (t = new Uint8Array(t)),
                (t instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array) && (t = new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),
                t instanceof Uint8Array) {
                    for (var e = t.byteLength, r = [], i = 0; i < e; i++)
                        r[i >>> 2] |= t[i] << 24 - i % 4 * 8;
                    n.call(this, r, e)
                } else
                    n.apply(this, arguments)
            }
            ).prototype = t
        }
    }(),
    Math,
    c = (s = bt).lib,
    a = c.WordArray,
    l = c.Hasher,
    d = s.algo,
    m = a.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
    x = a.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
    b = a.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
    H = a.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
    z = a.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
    A = a.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
    u = d.RIPEMD160 = l.extend({
        _doReset: function() {
            this._hash = a.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
        },
        _doProcessBlock: function(t, e) {
            for (var r = 0; r < 16; r++) {
                var i = e + r
                  , n = t[i];
                t[i] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
            }
            var o, s, c, a, h, l, f, d, u, p, _, v = this._hash.words, y = z.words, g = A.words, B = m.words, w = x.words, k = b.words, S = H.words;
            l = o = v[0],
            f = s = v[1],
            d = c = v[2],
            u = a = v[3],
            p = h = v[4];
            for (r = 0; r < 80; r += 1)
                _ = o + t[e + B[r]] | 0,
                _ += r < 16 ? mt(s, c, a) + y[0] : r < 32 ? xt(s, c, a) + y[1] : r < 48 ? Ht(s, c, a) + y[2] : r < 64 ? zt(s, c, a) + y[3] : At(s, c, a) + y[4],
                _ = (_ = Ct(_ |= 0, k[r])) + h | 0,
                o = h,
                h = a,
                a = Ct(c, 10),
                c = s,
                s = _,
                _ = l + t[e + w[r]] | 0,
                _ += r < 16 ? At(f, d, u) + g[0] : r < 32 ? zt(f, d, u) + g[1] : r < 48 ? Ht(f, d, u) + g[2] : r < 64 ? xt(f, d, u) + g[3] : mt(f, d, u) + g[4],
                _ = (_ = Ct(_ |= 0, S[r])) + p | 0,
                l = p,
                p = u,
                u = Ct(d, 10),
                d = f,
                f = _;
            _ = v[1] + c + u | 0,
            v[1] = v[2] + a + p | 0,
            v[2] = v[3] + h + l | 0,
            v[3] = v[4] + o + f | 0,
            v[4] = v[0] + s + d | 0,
            v[0] = _
        },
        _doFinalize: function() {
            var t = this._data
              , e = t.words
              , r = 8 * this._nDataBytes
              , i = 8 * t.sigBytes;
            e[i >>> 5] |= 128 << 24 - i % 32,
            e[14 + (64 + i >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8),
            t.sigBytes = 4 * (e.length + 1),
            this._process();
            for (var n = this._hash, o = n.words, s = 0; s < 5; s++) {
                var c = o[s];
                o[s] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
            }
            return n
        },
        clone: function() {
            var t = l.clone.call(this);
            return t._hash = this._hash.clone(),
            t
        }
    }),
    s.RIPEMD160 = l._createHelper(u),
    s.HmacRIPEMD160 = l._createHmacHelper(u),
    p = bt.lib.Base,
    _ = bt.enc.Utf8,
    bt.algo.HMAC = p.extend({
        init: function(t, e) {
            t = this._hasher = new t.init,
            "string" == typeof e && (e = _.parse(e));
            var r = t.blockSize
              , i = 4 * r;
            e.sigBytes > i && (e = t.finalize(e)),
            e.clamp();
            for (var n = this._oKey = e.clone(), o = this._iKey = e.clone(), s = n.words, c = o.words, a = 0; a < r; a++)
                s[a] ^= 1549556828,
                c[a] ^= 909522486;
            n.sigBytes = o.sigBytes = i,
            this.reset()
        },
        reset: function() {
            var t = this._hasher;
            t.reset(),
            t.update(this._iKey)
        },
        update: function(t) {
            return this._hasher.update(t),
            this
        },
        finalize: function(t) {
            var e = this._hasher
              , r = e.finalize(t);
            return e.reset(),
            e.finalize(this._oKey.clone().concat(r))
        }
    }),
    y = (v = bt).lib,
    g = y.Base,
    B = y.WordArray,
    w = v.algo,
    k = w.SHA1,
    S = w.HMAC,
    C = w.PBKDF2 = g.extend({
        cfg: g.extend({
            keySize: 4,
            hasher: k,
            iterations: 1
        }),
        init: function(t) {
            this.cfg = this.cfg.extend(t)
        },
        compute: function(t, e) {
            for (var r = this.cfg, i = S.create(r.hasher, t), n = B.create(), o = B.create([1]), s = n.words, c = o.words, a = r.keySize, h = r.iterations; s.length < a; ) {
                var l = i.update(e).finalize(o);
                i.reset();
                for (var f = l.words, d = f.length, u = l, p = 1; p < h; p++) {
                    u = i.finalize(u),
                    i.reset();
                    for (var _ = u.words, v = 0; v < d; v++)
                        f[v] ^= _[v]
                }
                n.concat(l),
                c[0]++
            }
            return n.sigBytes = 4 * a,
            n
        }
    }),
    v.PBKDF2 = function(t, e, r) {
        return C.create(r).compute(t, e)
    }
    ,
    E = (D = bt).lib,
    R = E.Base,
    M = E.WordArray,
    F = D.algo,
    P = F.MD5,
    W = F.EvpKDF = R.extend({
        cfg: R.extend({
            keySize: 4,
            hasher: P,
            iterations: 1
        }),
        init: function(t) {
            this.cfg = this.cfg.extend(t)
        },
        compute: function(t, e) {
            for (var r, i = this.cfg, n = i.hasher.create(), o = M.create(), s = o.words, c = i.keySize, a = i.iterations; s.length < c; ) {
                r && n.update(r),
                r = n.update(t).finalize(e),
                n.reset();
                for (var h = 1; h < a; h++)
                    r = n.finalize(r),
                    n.reset();
                o.concat(r)
            }
            return o.sigBytes = 4 * c,
            o
        }
    }),
    D.EvpKDF = function(t, e, r) {
        return W.create(r).compute(t, e)
    }
    ,
    I = (O = bt).lib.WordArray,
    U = O.algo,
    K = U.SHA256,
    X = U.SHA224 = K.extend({
        _doReset: function() {
            this._hash = new I.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
        },
        _doFinalize: function() {
            var t = K._doFinalize.call(this);
            return t.sigBytes -= 4,
            t
        }
    }),
    O.SHA224 = K._createHelper(X),
    O.HmacSHA224 = K._createHmacHelper(X),
    L = bt.lib,
    j = L.Base,
    N = L.WordArray,
    (T = bt.x64 = {}).Word = j.extend({
        init: function(t, e) {
            this.high = t,
            this.low = e
        }
    }),
    T.WordArray = j.extend({
        init: function(t, e) {
            t = this.words = t || [],
            this.sigBytes = null != e ? e : 8 * t.length
        },
        toX32: function() {
            for (var t = this.words, e = t.length, r = [], i = 0; i < e; i++) {
                var n = t[i];
                r.push(n.high),
                r.push(n.low)
            }
            return N.create(r, this.sigBytes)
        },
        clone: function() {
            for (var t = j.clone.call(this), e = t.words = this.words.slice(0), r = e.length, i = 0; i < r; i++)
                e[i] = e[i].clone();
            return t
        }
    }),
    function(d) {
        var t = bt
          , e = t.lib
          , u = e.WordArray
          , i = e.Hasher
          , l = t.x64.Word
          , r = t.algo
          , C = []
          , D = []
          , E = [];
        !function() {
            for (var t = 1, e = 0, r = 0; r < 24; r++) {
                C[t + 5 * e] = (r + 1) * (r + 2) / 2 % 64;
                var i = (2 * t + 3 * e) % 5;
                t = e % 5,
                e = i
            }
            for (t = 0; t < 5; t++)
                for (e = 0; e < 5; e++)
                    D[t + 5 * e] = e + (2 * t + 3 * e) % 5 * 5;
            for (var n = 1, o = 0; o < 24; o++) {
                for (var s = 0, c = 0, a = 0; a < 7; a++) {
                    if (1 & n) {
                        var h = (1 << a) - 1;
                        h < 32 ? c ^= 1 << h : s ^= 1 << h - 32
                    }
                    128 & n ? n = n << 1 ^ 113 : n <<= 1
                }
                E[o] = l.create(s, c)
            }
        }();
        var R = [];
        !function() {
            for (var t = 0; t < 25; t++)
                R[t] = l.create()
        }();
        var n = r.SHA3 = i.extend({
            cfg: i.cfg.extend({
                outputLength: 512
            }),
            _doReset: function() {
                for (var t = this._state = [], e = 0; e < 25; e++)
                    t[e] = new l.init;
                this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
            },
            _doProcessBlock: function(t, e) {
                for (var r = this._state, i = this.blockSize / 2, n = 0; n < i; n++) {
                    var o = t[e + 2 * n]
                      , s = t[e + 2 * n + 1];
                    o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                    s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
                    (x = r[n]).high ^= s,
                    x.low ^= o
                }
                for (var c = 0; c < 24; c++) {
                    for (var a = 0; a < 5; a++) {
                        for (var h = 0, l = 0, f = 0; f < 5; f++) {
                            h ^= (x = r[a + 5 * f]).high,
                            l ^= x.low
                        }
                        var d = R[a];
                        d.high = h,
                        d.low = l
                    }
                    for (a = 0; a < 5; a++) {
                        var u = R[(a + 4) % 5]
                          , p = R[(a + 1) % 5]
                          , _ = p.high
                          , v = p.low;
                        for (h = u.high ^ (_ << 1 | v >>> 31),
                        l = u.low ^ (v << 1 | _ >>> 31),
                        f = 0; f < 5; f++) {
                            (x = r[a + 5 * f]).high ^= h,
                            x.low ^= l
                        }
                    }
                    for (var y = 1; y < 25; y++) {
                        var g = (x = r[y]).high
                          , B = x.low
                          , w = C[y];
                        l = w < 32 ? (h = g << w | B >>> 32 - w,
                        B << w | g >>> 32 - w) : (h = B << w - 32 | g >>> 64 - w,
                        g << w - 32 | B >>> 64 - w);
                        var k = R[D[y]];
                        k.high = h,
                        k.low = l
                    }
                    var S = R[0]
                      , m = r[0];
                    S.high = m.high,
                    S.low = m.low;
                    for (a = 0; a < 5; a++)
                        for (f = 0; f < 5; f++) {
                            var x = r[y = a + 5 * f]
                              , b = R[y]
                              , H = R[(a + 1) % 5 + 5 * f]
                              , z = R[(a + 2) % 5 + 5 * f];
                            x.high = b.high ^ ~H.high & z.high,
                            x.low = b.low ^ ~H.low & z.low
                        }
                    x = r[0];
                    var A = E[c];
                    x.high ^= A.high,
                    x.low ^= A.low
                }
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , r = (this._nDataBytes,
                8 * t.sigBytes)
                  , i = 32 * this.blockSize;
                e[r >>> 5] |= 1 << 24 - r % 32,
                e[(d.ceil((1 + r) / i) * i >>> 5) - 1] |= 128,
                t.sigBytes = 4 * e.length,
                this._process();
                for (var n = this._state, o = this.cfg.outputLength / 8, s = o / 8, c = [], a = 0; a < s; a++) {
                    var h = n[a]
                      , l = h.high
                      , f = h.low;
                    l = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8),
                    f = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8),
                    c.push(f),
                    c.push(l)
                }
                return new u.init(c,o)
            },
            clone: function() {
                for (var t = i.clone.call(this), e = t._state = this._state.slice(0), r = 0; r < 25; r++)
                    e[r] = e[r].clone();
                return t
            }
        });
        t.SHA3 = i._createHelper(n),
        t.HmacSHA3 = i._createHmacHelper(n)
    }(Math),
    function() {
        var t = bt
          , e = t.lib.Hasher
          , r = t.x64
          , i = r.Word
          , n = r.WordArray
          , o = t.algo;
        function s() {
            return i.create.apply(i, arguments)
        }
        var mt = [s(1116352408, 3609767458), s(1899447441, 602891725), s(3049323471, 3964484399), s(3921009573, 2173295548), s(961987163, 4081628472), s(1508970993, 3053834265), s(2453635748, 2937671579), s(2870763221, 3664609560), s(3624381080, 2734883394), s(310598401, 1164996542), s(607225278, 1323610764), s(1426881987, 3590304994), s(1925078388, 4068182383), s(2162078206, 991336113), s(2614888103, 633803317), s(3248222580, 3479774868), s(3835390401, 2666613458), s(4022224774, 944711139), s(264347078, 2341262773), s(604807628, 2007800933), s(770255983, 1495990901), s(1249150122, 1856431235), s(1555081692, 3175218132), s(1996064986, 2198950837), s(2554220882, 3999719339), s(2821834349, 766784016), s(2952996808, 2566594879), s(3210313671, 3203337956), s(3336571891, 1034457026), s(3584528711, 2466948901), s(113926993, 3758326383), s(338241895, 168717936), s(666307205, 1188179964), s(773529912, 1546045734), s(1294757372, 1522805485), s(1396182291, 2643833823), s(1695183700, 2343527390), s(1986661051, 1014477480), s(2177026350, 1206759142), s(2456956037, 344077627), s(2730485921, 1290863460), s(2820302411, 3158454273), s(3259730800, 3505952657), s(3345764771, 106217008), s(3516065817, 3606008344), s(3600352804, 1432725776), s(4094571909, 1467031594), s(275423344, 851169720), s(430227734, 3100823752), s(506948616, 1363258195), s(659060556, 3750685593), s(883997877, 3785050280), s(958139571, 3318307427), s(1322822218, 3812723403), s(1537002063, 2003034995), s(1747873779, 3602036899), s(1955562222, 1575990012), s(2024104815, 1125592928), s(2227730452, 2716904306), s(2361852424, 442776044), s(2428436474, 593698344), s(2756734187, 3733110249), s(3204031479, 2999351573), s(3329325298, 3815920427), s(3391569614, 3928383900), s(3515267271, 566280711), s(3940187606, 3454069534), s(4118630271, 4000239992), s(116418474, 1914138554), s(174292421, 2731055270), s(289380356, 3203993006), s(460393269, 320620315), s(685471733, 587496836), s(852142971, 1086792851), s(1017036298, 365543100), s(1126000580, 2618297676), s(1288033470, 3409855158), s(1501505948, 4234509866), s(1607167915, 987167468), s(1816402316, 1246189591)]
          , xt = [];
        !function() {
            for (var t = 0; t < 80; t++)
                xt[t] = s()
        }();
        var c = o.SHA512 = e.extend({
            _doReset: function() {
                this._hash = new n.init([new i.init(1779033703,4089235720), new i.init(3144134277,2227873595), new i.init(1013904242,4271175723), new i.init(2773480762,1595750129), new i.init(1359893119,2917565137), new i.init(2600822924,725511199), new i.init(528734635,4215389547), new i.init(1541459225,327033209)])
            },
            _doProcessBlock: function(t, e) {
                for (var r = this._hash.words, i = r[0], n = r[1], o = r[2], s = r[3], c = r[4], a = r[5], h = r[6], l = r[7], f = i.high, d = i.low, u = n.high, p = n.low, _ = o.high, v = o.low, y = s.high, g = s.low, B = c.high, w = c.low, k = a.high, S = a.low, m = h.high, x = h.low, b = l.high, H = l.low, z = f, A = d, C = u, D = p, E = _, R = v, M = y, F = g, P = B, W = w, O = k, I = S, U = m, K = x, X = b, L = H, j = 0; j < 80; j++) {
                    var N, T, q = xt[j];
                    if (j < 16)
                        T = q.high = 0 | t[e + 2 * j],
                        N = q.low = 0 | t[e + 2 * j + 1];
                    else {
                        var Z = xt[j - 15]
                          , V = Z.high
                          , G = Z.low
                          , J = (V >>> 1 | G << 31) ^ (V >>> 8 | G << 24) ^ V >>> 7
                          , $ = (G >>> 1 | V << 31) ^ (G >>> 8 | V << 24) ^ (G >>> 7 | V << 25)
                          , Q = xt[j - 2]
                          , Y = Q.high
                          , tt = Q.low
                          , et = (Y >>> 19 | tt << 13) ^ (Y << 3 | tt >>> 29) ^ Y >>> 6
                          , rt = (tt >>> 19 | Y << 13) ^ (tt << 3 | Y >>> 29) ^ (tt >>> 6 | Y << 26)
                          , it = xt[j - 7]
                          , nt = it.high
                          , ot = it.low
                          , st = xt[j - 16]
                          , ct = st.high
                          , at = st.low;
                        T = (T = (T = J + nt + ((N = $ + ot) >>> 0 < $ >>> 0 ? 1 : 0)) + et + ((N += rt) >>> 0 < rt >>> 0 ? 1 : 0)) + ct + ((N += at) >>> 0 < at >>> 0 ? 1 : 0),
                        q.high = T,
                        q.low = N
                    }
                    var ht, lt = P & O ^ ~P & U, ft = W & I ^ ~W & K, dt = z & C ^ z & E ^ C & E, ut = A & D ^ A & R ^ D & R, pt = (z >>> 28 | A << 4) ^ (z << 30 | A >>> 2) ^ (z << 25 | A >>> 7), _t = (A >>> 28 | z << 4) ^ (A << 30 | z >>> 2) ^ (A << 25 | z >>> 7), vt = (P >>> 14 | W << 18) ^ (P >>> 18 | W << 14) ^ (P << 23 | W >>> 9), yt = (W >>> 14 | P << 18) ^ (W >>> 18 | P << 14) ^ (W << 23 | P >>> 9), gt = mt[j], Bt = gt.high, wt = gt.low, kt = X + vt + ((ht = L + yt) >>> 0 < L >>> 0 ? 1 : 0), St = _t + ut;
                    X = U,
                    L = K,
                    U = O,
                    K = I,
                    O = P,
                    I = W,
                    P = M + (kt = (kt = (kt = kt + lt + ((ht = ht + ft) >>> 0 < ft >>> 0 ? 1 : 0)) + Bt + ((ht = ht + wt) >>> 0 < wt >>> 0 ? 1 : 0)) + T + ((ht = ht + N) >>> 0 < N >>> 0 ? 1 : 0)) + ((W = F + ht | 0) >>> 0 < F >>> 0 ? 1 : 0) | 0,
                    M = E,
                    F = R,
                    E = C,
                    R = D,
                    C = z,
                    D = A,
                    z = kt + (pt + dt + (St >>> 0 < _t >>> 0 ? 1 : 0)) + ((A = ht + St | 0) >>> 0 < ht >>> 0 ? 1 : 0) | 0
                }
                d = i.low = d + A,
                i.high = f + z + (d >>> 0 < A >>> 0 ? 1 : 0),
                p = n.low = p + D,
                n.high = u + C + (p >>> 0 < D >>> 0 ? 1 : 0),
                v = o.low = v + R,
                o.high = _ + E + (v >>> 0 < R >>> 0 ? 1 : 0),
                g = s.low = g + F,
                s.high = y + M + (g >>> 0 < F >>> 0 ? 1 : 0),
                w = c.low = w + W,
                c.high = B + P + (w >>> 0 < W >>> 0 ? 1 : 0),
                S = a.low = S + I,
                a.high = k + O + (S >>> 0 < I >>> 0 ? 1 : 0),
                x = h.low = x + K,
                h.high = m + U + (x >>> 0 < K >>> 0 ? 1 : 0),
                H = l.low = H + L,
                l.high = b + X + (H >>> 0 < L >>> 0 ? 1 : 0)
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , r = 8 * this._nDataBytes
                  , i = 8 * t.sigBytes;
                return e[i >>> 5] |= 128 << 24 - i % 32,
                e[30 + (128 + i >>> 10 << 5)] = Math.floor(r / 4294967296),
                e[31 + (128 + i >>> 10 << 5)] = r,
                t.sigBytes = 4 * e.length,
                this._process(),
                this._hash.toX32()
            },
            clone: function() {
                var t = e.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            },
            blockSize: 32
        });
        t.SHA512 = e._createHelper(c),
        t.HmacSHA512 = e._createHmacHelper(c)
    }(),
    Z = (q = bt).x64,
    V = Z.Word,
    G = Z.WordArray,
    J = q.algo,
    $ = J.SHA512,
    Q = J.SHA384 = $.extend({
        _doReset: function() {
            this._hash = new G.init([new V.init(3418070365,3238371032), new V.init(1654270250,914150663), new V.init(2438529370,812702999), new V.init(355462360,4144912697), new V.init(1731405415,4290775857), new V.init(2394180231,1750603025), new V.init(3675008525,1694076839), new V.init(1203062813,3204075428)])
        },
        _doFinalize: function() {
            var t = $._doFinalize.call(this);
            return t.sigBytes -= 16,
            t
        }
    }),
    q.SHA384 = $._createHelper(Q),
    q.HmacSHA384 = $._createHmacHelper(Q),
    bt.lib.Cipher || function() {
        var t = bt
          , e = t.lib
          , r = e.Base
          , a = e.WordArray
          , i = e.BufferedBlockAlgorithm
          , n = t.enc
          , o = (n.Utf8,
        n.Base64)
          , s = t.algo.EvpKDF
          , c = e.Cipher = i.extend({
            cfg: r.extend(),
            createEncryptor: function(t, e) {
                return this.create(this._ENC_XFORM_MODE, t, e)
            },
            createDecryptor: function(t, e) {
                return this.create(this._DEC_XFORM_MODE, t, e)
            },
            init: function(t, e, r) {
                this.cfg = this.cfg.extend(r),
                this._xformMode = t,
                this._key = e,
                this.reset()
            },
            reset: function() {
                i.reset.call(this),
                this._doReset()
            },
            process: function(t) {
                return this._append(t),
                this._process()
            },
            finalize: function(t) {
                return t && this._append(t),
                this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function(i) {
                return {
                    encrypt: function(t, e, r) {
                        return h(e).encrypt(i, t, e, r)
                    },
                    decrypt: function(t, e, r) {
                        return h(e).decrypt(i, t, e, r)
                    }
                }
            }
        });
        function h(t) {
            return "string" == typeof t ? w : g
        }
        e.StreamCipher = c.extend({
            _doFinalize: function() {
                return this._process(!0)
            },
            blockSize: 1
        });
        var l, f = t.mode = {}, d = e.BlockCipherMode = r.extend({
            createEncryptor: function(t, e) {
                return this.Encryptor.create(t, e)
            },
            createDecryptor: function(t, e) {
                return this.Decryptor.create(t, e)
            },
            init: function(t, e) {
                this._cipher = t,
                this._iv = e
            }
        }), u = f.CBC = ((l = d.extend()).Encryptor = l.extend({
            processBlock: function(t, e) {
                var r = this._cipher
                  , i = r.blockSize;
                p.call(this, t, e, i),
                r.encryptBlock(t, e),
                this._prevBlock = t.slice(e, e + i)
            }
        }),
        l.Decryptor = l.extend({
            processBlock: function(t, e) {
                var r = this._cipher
                  , i = r.blockSize
                  , n = t.slice(e, e + i);
                r.decryptBlock(t, e),
                p.call(this, t, e, i),
                this._prevBlock = n
            }
        }),
        l);
        function p(t, e, r) {
            var i, n = this._iv;
            n ? (i = n,
            this._iv = void 0) : i = this._prevBlock;
            for (var o = 0; o < r; o++)
                t[e + o] ^= i[o]
        }
        var _ = (t.pad = {}).Pkcs7 = {
            pad: function(t, e) {
                for (var r = 4 * e, i = r - t.sigBytes % r, n = i << 24 | i << 16 | i << 8 | i, o = [], s = 0; s < i; s += 4)
                    o.push(n);
                var c = a.create(o, i);
                t.concat(c)
            },
            unpad: function(t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        }
          , v = (e.BlockCipher = c.extend({
            cfg: c.cfg.extend({
                mode: u,
                padding: _
            }),
            reset: function() {
                var t;
                c.reset.call(this);
                var e = this.cfg
                  , r = e.iv
                  , i = e.mode;
                this._xformMode == this._ENC_XFORM_MODE ? t = i.createEncryptor : (t = i.createDecryptor,
                this._minBufferSize = 1),
                this._mode && this._mode.__creator == t ? this._mode.init(this, r && r.words) : (this._mode = t.call(i, this, r && r.words),
                this._mode.__creator = t)
            },
            _doProcessBlock: function(t, e) {
                this._mode.processBlock(t, e)
            },
            _doFinalize: function() {
                var t, e = this.cfg.padding;
                return this._xformMode == this._ENC_XFORM_MODE ? (e.pad(this._data, this.blockSize),
                t = this._process(!0)) : (t = this._process(!0),
                e.unpad(t)),
                t
            },
            blockSize: 4
        }),
        e.CipherParams = r.extend({
            init: function(t) {
                this.mixIn(t)
            },
            toString: function(t) {
                return (t || this.formatter).stringify(this)
            }
        }))
          , y = (t.format = {}).OpenSSL = {
            stringify: function(t) {
                var e = t.ciphertext
                  , r = t.salt;
                return (r ? a.create([1398893684, 1701076831]).concat(r).concat(e) : e).toString(o)
            },
            parse: function(t) {
                var e, r = o.parse(t), i = r.words;
                return 1398893684 == i[0] && 1701076831 == i[1] && (e = a.create(i.slice(2, 4)),
                i.splice(0, 4),
                r.sigBytes -= 16),
                v.create({
                    ciphertext: r,
                    salt: e
                })
            }
        }
          , g = e.SerializableCipher = r.extend({
            cfg: r.extend({
                format: y
            }),
            encrypt: function(t, e, r, i) {
                i = this.cfg.extend(i);
                var n = t.createEncryptor(r, i)
                  , o = n.finalize(e)
                  , s = n.cfg;
                return v.create({
                    ciphertext: o,
                    key: r,
                    iv: s.iv,
                    algorithm: t,
                    mode: s.mode,
                    padding: s.padding,
                    blockSize: t.blockSize,
                    formatter: i.format
                })
            },
            decrypt: function(t, e, r, i) {
                return i = this.cfg.extend(i),
                e = this._parse(e, i.format),
                t.createDecryptor(r, i).finalize(e.ciphertext)
            },
            _parse: function(t, e) {
                return "string" == typeof t ? e.parse(t, this) : t
            }
        })
          , B = (t.kdf = {}).OpenSSL = {
            execute: function(t, e, r, i) {
                i = i || a.random(8);
                var n = s.create({
                    keySize: e + r
                }).compute(t, i)
                  , o = a.create(n.words.slice(e), 4 * r);
                return n.sigBytes = 4 * e,
                v.create({
                    key: n,
                    iv: o,
                    salt: i
                })
            }
        }
          , w = e.PasswordBasedCipher = g.extend({
            cfg: g.cfg.extend({
                kdf: B
            }),
            encrypt: function(t, e, r, i) {
                var n = (i = this.cfg.extend(i)).kdf.execute(r, t.keySize, t.ivSize);
                i.iv = n.iv;
                var o = g.encrypt.call(this, t, e, n.key, i);
                return o.mixIn(n),
                o
            },
            decrypt: function(t, e, r, i) {
                i = this.cfg.extend(i),
                e = this._parse(e, i.format);
                var n = i.kdf.execute(r, t.keySize, t.ivSize, e.salt);
                return i.iv = n.iv,
                g.decrypt.call(this, t, e, n.key, i)
            }
        })
    }(),
    bt.mode.CFB = ((Y = bt.lib.BlockCipherMode.extend()).Encryptor = Y.extend({
        processBlock: function(t, e) {
            var r = this._cipher
              , i = r.blockSize;
            Dt.call(this, t, e, i, r),
            this._prevBlock = t.slice(e, e + i)
        }
    }),
    Y.Decryptor = Y.extend({
        processBlock: function(t, e) {
            var r = this._cipher
              , i = r.blockSize
              , n = t.slice(e, e + i);
            Dt.call(this, t, e, i, r),
            this._prevBlock = n
        }
    }),
    Y),
    bt.mode.ECB = ((tt = bt.lib.BlockCipherMode.extend()).Encryptor = tt.extend({
        processBlock: function(t, e) {
            this._cipher.encryptBlock(t, e)
        }
    }),
    tt.Decryptor = tt.extend({
        processBlock: function(t, e) {
            this._cipher.decryptBlock(t, e)
        }
    }),
    tt),
    bt.pad.AnsiX923 = {
        pad: function(t, e) {
            var r = t.sigBytes
              , i = 4 * e
              , n = i - r % i
              , o = r + n - 1;
            t.clamp(),
            t.words[o >>> 2] |= n << 24 - o % 4 * 8,
            t.sigBytes += n
        },
        unpad: function(t) {
            var e = 255 & t.words[t.sigBytes - 1 >>> 2];
            t.sigBytes -= e
        }
    },
    bt.pad.Iso10126 = {
        pad: function(t, e) {
            var r = 4 * e
              , i = r - t.sigBytes % r;
            t.concat(bt.lib.WordArray.random(i - 1)).concat(bt.lib.WordArray.create([i << 24], 1))
        },
        unpad: function(t) {
            var e = 255 & t.words[t.sigBytes - 1 >>> 2];
            t.sigBytes -= e
        }
    },
    bt.pad.Iso97971 = {
        pad: function(t, e) {
            t.concat(bt.lib.WordArray.create([2147483648], 1)),
            bt.pad.ZeroPadding.pad(t, e)
        },
        unpad: function(t) {
            bt.pad.ZeroPadding.unpad(t),
            t.sigBytes--
        }
    },
    bt.mode.OFB = (et = bt.lib.BlockCipherMode.extend(),
    rt = et.Encryptor = et.extend({
        processBlock: function(t, e) {
            var r = this._cipher
              , i = r.blockSize
              , n = this._iv
              , o = this._keystream;
            n && (o = this._keystream = n.slice(0),
            this._iv = void 0),
            r.encryptBlock(o, 0);
            for (var s = 0; s < i; s++)
                t[e + s] ^= o[s]
        }
    }),
    et.Decryptor = rt,
    et),
    bt.pad.NoPadding = {
        pad: function() {},
        unpad: function() {}
    },
    it = bt.lib.CipherParams,
    nt = bt.enc.Hex,
    bt.format.Hex = {
        stringify: function(t) {
            return t.ciphertext.toString(nt)
        },
        parse: function(t) {
            var e = nt.parse(t);
            return it.create({
                ciphertext: e
            })
        }
    },
    function() {
        var t = bt
          , e = t.lib.BlockCipher
          , r = t.algo
          , h = []
          , l = []
          , f = []
          , d = []
          , u = []
          , p = []
          , _ = []
          , v = []
          , y = []
          , g = [];
        !function() {
            for (var t = [], e = 0; e < 256; e++)
                t[e] = e < 128 ? e << 1 : e << 1 ^ 283;
            var r = 0
              , i = 0;
            for (e = 0; e < 256; e++) {
                var n = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4;
                n = n >>> 8 ^ 255 & n ^ 99,
                h[r] = n;
                var o = t[l[n] = r]
                  , s = t[o]
                  , c = t[s]
                  , a = 257 * t[n] ^ 16843008 * n;
                f[r] = a << 24 | a >>> 8,
                d[r] = a << 16 | a >>> 16,
                u[r] = a << 8 | a >>> 24,
                p[r] = a;
                a = 16843009 * c ^ 65537 * s ^ 257 * o ^ 16843008 * r;
                _[n] = a << 24 | a >>> 8,
                v[n] = a << 16 | a >>> 16,
                y[n] = a << 8 | a >>> 24,
                g[n] = a,
                r ? (r = o ^ t[t[t[c ^ o]]],
                i ^= t[t[i]]) : r = i = 1
            }
        }();
        var B = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
          , i = r.AES = e.extend({
            _doReset: function() {
                if (!this._nRounds || this._keyPriorReset !== this._key) {
                    for (var t = this._keyPriorReset = this._key, e = t.words, r = t.sigBytes / 4, i = 4 * (1 + (this._nRounds = 6 + r)), n = this._keySchedule = [], o = 0; o < i; o++)
                        o < r ? n[o] = e[o] : (a = n[o - 1],
                        o % r ? 6 < r && o % r == 4 && (a = h[a >>> 24] << 24 | h[a >>> 16 & 255] << 16 | h[a >>> 8 & 255] << 8 | h[255 & a]) : (a = h[(a = a << 8 | a >>> 24) >>> 24] << 24 | h[a >>> 16 & 255] << 16 | h[a >>> 8 & 255] << 8 | h[255 & a],
                        a ^= B[o / r | 0] << 24),
                        n[o] = n[o - r] ^ a);
                    for (var s = this._invKeySchedule = [], c = 0; c < i; c++) {
                        o = i - c;
                        if (c % 4)
                            var a = n[o];
                        else
                            a = n[o - 4];
                        s[c] = c < 4 || o <= 4 ? a : _[h[a >>> 24]] ^ v[h[a >>> 16 & 255]] ^ y[h[a >>> 8 & 255]] ^ g[h[255 & a]]
                    }
                }
            },
            encryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._keySchedule, f, d, u, p, h)
            },
            decryptBlock: function(t, e) {
                var r = t[e + 1];
                t[e + 1] = t[e + 3],
                t[e + 3] = r,
                this._doCryptBlock(t, e, this._invKeySchedule, _, v, y, g, l);
                r = t[e + 1];
                t[e + 1] = t[e + 3],
                t[e + 3] = r
            },
            _doCryptBlock: function(t, e, r, i, n, o, s, c) {
                for (var a = this._nRounds, h = t[e] ^ r[0], l = t[e + 1] ^ r[1], f = t[e + 2] ^ r[2], d = t[e + 3] ^ r[3], u = 4, p = 1; p < a; p++) {
                    var _ = i[h >>> 24] ^ n[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ s[255 & d] ^ r[u++]
                      , v = i[l >>> 24] ^ n[f >>> 16 & 255] ^ o[d >>> 8 & 255] ^ s[255 & h] ^ r[u++]
                      , y = i[f >>> 24] ^ n[d >>> 16 & 255] ^ o[h >>> 8 & 255] ^ s[255 & l] ^ r[u++]
                      , g = i[d >>> 24] ^ n[h >>> 16 & 255] ^ o[l >>> 8 & 255] ^ s[255 & f] ^ r[u++];
                    h = _,
                    l = v,
                    f = y,
                    d = g
                }
                _ = (c[h >>> 24] << 24 | c[l >>> 16 & 255] << 16 | c[f >>> 8 & 255] << 8 | c[255 & d]) ^ r[u++],
                v = (c[l >>> 24] << 24 | c[f >>> 16 & 255] << 16 | c[d >>> 8 & 255] << 8 | c[255 & h]) ^ r[u++],
                y = (c[f >>> 24] << 24 | c[d >>> 16 & 255] << 16 | c[h >>> 8 & 255] << 8 | c[255 & l]) ^ r[u++],
                g = (c[d >>> 24] << 24 | c[h >>> 16 & 255] << 16 | c[l >>> 8 & 255] << 8 | c[255 & f]) ^ r[u++];
                t[e] = _,
                t[e + 1] = v,
                t[e + 2] = y,
                t[e + 3] = g
            },
            keySize: 8
        });
        t.AES = e._createHelper(i)
    }(),
    function() {
        var t = bt
          , e = t.lib
          , n = e.WordArray
          , r = e.BlockCipher
          , i = t.algo
          , h = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]
          , l = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]
          , f = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]
          , d = [{
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
        }, {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
        }, {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
        }, {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
        }, {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
        }, {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
        }, {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
        }, {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
        }]
          , u = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679]
          , o = i.DES = r.extend({
            _doReset: function() {
                for (var t = this._key.words, e = [], r = 0; r < 56; r++) {
                    var i = h[r] - 1;
                    e[r] = t[i >>> 5] >>> 31 - i % 32 & 1
                }
                for (var n = this._subKeys = [], o = 0; o < 16; o++) {
                    var s = n[o] = []
                      , c = f[o];
                    for (r = 0; r < 24; r++)
                        s[r / 6 | 0] |= e[(l[r] - 1 + c) % 28] << 31 - r % 6,
                        s[4 + (r / 6 | 0)] |= e[28 + (l[r + 24] - 1 + c) % 28] << 31 - r % 6;
                    s[0] = s[0] << 1 | s[0] >>> 31;
                    for (r = 1; r < 7; r++)
                        s[r] = s[r] >>> 4 * (r - 1) + 3;
                    s[7] = s[7] << 5 | s[7] >>> 27
                }
                var a = this._invSubKeys = [];
                for (r = 0; r < 16; r++)
                    a[r] = n[15 - r]
            },
            encryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._subKeys)
            },
            decryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._invSubKeys)
            },
            _doCryptBlock: function(t, e, r) {
                this._lBlock = t[e],
                this._rBlock = t[e + 1],
                p.call(this, 4, 252645135),
                p.call(this, 16, 65535),
                _.call(this, 2, 858993459),
                _.call(this, 8, 16711935),
                p.call(this, 1, 1431655765);
                for (var i = 0; i < 16; i++) {
                    for (var n = r[i], o = this._lBlock, s = this._rBlock, c = 0, a = 0; a < 8; a++)
                        c |= d[a][((s ^ n[a]) & u[a]) >>> 0];
                    this._lBlock = s,
                    this._rBlock = o ^ c
                }
                var h = this._lBlock;
                this._lBlock = this._rBlock,
                this._rBlock = h,
                p.call(this, 1, 1431655765),
                _.call(this, 8, 16711935),
                _.call(this, 2, 858993459),
                p.call(this, 16, 65535),
                p.call(this, 4, 252645135),
                t[e] = this._lBlock,
                t[e + 1] = this._rBlock
            },
            keySize: 2,
            ivSize: 2,
            blockSize: 2
        });
        function p(t, e) {
            var r = (this._lBlock >>> t ^ this._rBlock) & e;
            this._rBlock ^= r,
            this._lBlock ^= r << t
        }
        function _(t, e) {
            var r = (this._rBlock >>> t ^ this._lBlock) & e;
            this._lBlock ^= r,
            this._rBlock ^= r << t
        }
        t.DES = r._createHelper(o);
        var s = i.TripleDES = r.extend({
            _doReset: function() {
                var t = this._key.words;
                if (2 !== t.length && 4 !== t.length && t.length < 6)
                    throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
                var e = t.slice(0, 2)
                  , r = t.length < 4 ? t.slice(0, 2) : t.slice(2, 4)
                  , i = t.length < 6 ? t.slice(0, 2) : t.slice(4, 6);
                this._des1 = o.createEncryptor(n.create(e)),
                this._des2 = o.createEncryptor(n.create(r)),
                this._des3 = o.createEncryptor(n.create(i))
            },
            encryptBlock: function(t, e) {
                this._des1.encryptBlock(t, e),
                this._des2.decryptBlock(t, e),
                this._des3.encryptBlock(t, e)
            },
            decryptBlock: function(t, e) {
                this._des3.decryptBlock(t, e),
                this._des2.encryptBlock(t, e),
                this._des1.decryptBlock(t, e)
            },
            keySize: 6,
            ivSize: 2,
            blockSize: 2
        });
        t.TripleDES = r._createHelper(s)
    }(),
    function() {
        var t = bt
          , e = t.lib.StreamCipher
          , r = t.algo
          , i = r.RC4 = e.extend({
            _doReset: function() {
                for (var t = this._key, e = t.words, r = t.sigBytes, i = this._S = [], n = 0; n < 256; n++)
                    i[n] = n;
                n = 0;
                for (var o = 0; n < 256; n++) {
                    var s = n % r
                      , c = e[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                    o = (o + i[n] + c) % 256;
                    var a = i[n];
                    i[n] = i[o],
                    i[o] = a
                }
                this._i = this._j = 0
            },
            _doProcessBlock: function(t, e) {
                t[e] ^= n.call(this)
            },
            keySize: 8,
            ivSize: 0
        });
        function n() {
            for (var t = this._S, e = this._i, r = this._j, i = 0, n = 0; n < 4; n++) {
                r = (r + t[e = (e + 1) % 256]) % 256;
                var o = t[e];
                t[e] = t[r],
                t[r] = o,
                i |= t[(t[e] + t[r]) % 256] << 24 - 8 * n
            }
            return this._i = e,
            this._j = r,
            i
        }
        t.RC4 = e._createHelper(i);
        var o = r.RC4Drop = i.extend({
            cfg: i.cfg.extend({
                drop: 192
            }),
            _doReset: function() {
                i._doReset.call(this);
                for (var t = this.cfg.drop; 0 < t; t--)
                    n.call(this)
            }
        });
        t.RC4Drop = e._createHelper(o)
    }(),
    bt.mode.CTRGladman = (ot = bt.lib.BlockCipherMode.extend(),
    st = ot.Encryptor = ot.extend({
        processBlock: function(t, e) {
            var r, i = this._cipher, n = i.blockSize, o = this._iv, s = this._counter;
            o && (s = this._counter = o.slice(0),
            this._iv = void 0),
            0 === ((r = s)[0] = Et(r[0])) && (r[1] = Et(r[1]));
            var c = s.slice(0);
            i.encryptBlock(c, 0);
            for (var a = 0; a < n; a++)
                t[e + a] ^= c[a]
        }
    }),
    ot.Decryptor = st,
    ot),
    at = (ct = bt).lib.StreamCipher,
    ht = ct.algo,
    lt = [],
    ft = [],
    dt = [],
    ut = ht.Rabbit = at.extend({
        _doReset: function() {
            for (var t = this._key.words, e = this.cfg.iv, r = 0; r < 4; r++)
                t[r] = 16711935 & (t[r] << 8 | t[r] >>> 24) | 4278255360 & (t[r] << 24 | t[r] >>> 8);
            var i = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16]
              , n = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]];
            for (r = this._b = 0; r < 4; r++)
                Rt.call(this);
            for (r = 0; r < 8; r++)
                n[r] ^= i[r + 4 & 7];
            if (e) {
                var o = e.words
                  , s = o[0]
                  , c = o[1]
                  , a = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
                  , h = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                  , l = a >>> 16 | 4294901760 & h
                  , f = h << 16 | 65535 & a;
                n[0] ^= a,
                n[1] ^= l,
                n[2] ^= h,
                n[3] ^= f,
                n[4] ^= a,
                n[5] ^= l,
                n[6] ^= h,
                n[7] ^= f;
                for (r = 0; r < 4; r++)
                    Rt.call(this)
            }
        },
        _doProcessBlock: function(t, e) {
            var r = this._X;
            Rt.call(this),
            lt[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
            lt[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
            lt[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
            lt[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
            for (var i = 0; i < 4; i++)
                lt[i] = 16711935 & (lt[i] << 8 | lt[i] >>> 24) | 4278255360 & (lt[i] << 24 | lt[i] >>> 8),
                t[e + i] ^= lt[i]
        },
        blockSize: 4,
        ivSize: 2
    }),
    ct.Rabbit = at._createHelper(ut),
    bt.mode.CTR = (pt = bt.lib.BlockCipherMode.extend(),
    _t = pt.Encryptor = pt.extend({
        processBlock: function(t, e) {
            var r = this._cipher
              , i = r.blockSize
              , n = this._iv
              , o = this._counter;
            n && (o = this._counter = n.slice(0),
            this._iv = void 0);
            var s = o.slice(0);
            r.encryptBlock(s, 0),
            o[i - 1] = o[i - 1] + 1 | 0;
            for (var c = 0; c < i; c++)
                t[e + c] ^= s[c]
        }
    }),
    pt.Decryptor = _t,
    pt),
    yt = (vt = bt).lib.StreamCipher,
    gt = vt.algo,
    Bt = [],
    wt = [],
    kt = [],
    St = gt.RabbitLegacy = yt.extend({
        _doReset: function() {
            for (var t = this._key.words, e = this.cfg.iv, r = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], i = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]], n = this._b = 0; n < 4; n++)
                Mt.call(this);
            for (n = 0; n < 8; n++)
                i[n] ^= r[n + 4 & 7];
            if (e) {
                var o = e.words
                  , s = o[0]
                  , c = o[1]
                  , a = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
                  , h = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                  , l = a >>> 16 | 4294901760 & h
                  , f = h << 16 | 65535 & a;
                i[0] ^= a,
                i[1] ^= l,
                i[2] ^= h,
                i[3] ^= f,
                i[4] ^= a,
                i[5] ^= l,
                i[6] ^= h,
                i[7] ^= f;
                for (n = 0; n < 4; n++)
                    Mt.call(this)
            }
        },
        _doProcessBlock: function(t, e) {
            var r = this._X;
            Mt.call(this),
            Bt[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
            Bt[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
            Bt[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
            Bt[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
            for (var i = 0; i < 4; i++)
                Bt[i] = 16711935 & (Bt[i] << 8 | Bt[i] >>> 24) | 4278255360 & (Bt[i] << 24 | Bt[i] >>> 8),
                t[e + i] ^= Bt[i]
        },
        blockSize: 4,
        ivSize: 2
    }),
    vt.RabbitLegacy = yt._createHelper(St),
    bt.pad.ZeroPadding = {
        pad: function(t, e) {
            var r = 4 * e;
            t.clamp(),
            t.sigBytes += r - (t.sigBytes % r || r)
        },
        unpad: function(t) {
            var e = t.words
              , r = t.sigBytes - 1;
            for (r = t.sigBytes - 1; 0 <= r; r--)
                if (e[r >>> 2] >>> 24 - r % 4 * 8 & 255) {
                    t.sigBytes = r + 1;
                    break
                }
        }
    },
    bt
});
( () => {
    var qv = Object.create;
    var Hi = Object.defineProperty;
    var $v = Object.getOwnPropertyDescriptor;
    var Lv = Object.getOwnPropertyNames;
    var Mv = Object.getPrototypeOf
      , Nv = Object.prototype.hasOwnProperty;
    var df = r => Hi(r, "__esModule", {
        value: !0
    });
    var hf = r => {
        if (typeof require != "undefined")
            return require(r);
        throw new Error('Dynamic require of "' + r + '" is not supported')
    }
    ;
    var P = (r, e) => () => (r && (e = r(r = 0)),
    e);
    var x = (r, e) => () => (e || r((e = {
        exports: {}
    }).exports, e),
    e.exports)
      , Ge = (r, e) => {
        df(r);
        for (var t in e)
            Hi(r, t, {
                get: e[t],
                enumerable: !0
            })
    }
      , Bv = (r, e, t) => {
        if (e && typeof e == "object" || typeof e == "function")
            for (let i of Lv(e))
                !Nv.call(r, i) && i !== "default" && Hi(r, i, {
                    get: () => e[i],
                    enumerable: !(t = $v(e, i)) || t.enumerable
                });
        return r
    }
      , pe = r => Bv(df(Hi(r != null ? qv(Mv(r)) : {}, "default", r && r.__esModule && "default"in r ? {
        get: () => r.default,
        enumerable: !0
    } : {
        value: r,
        enumerable: !0
    })), r);
    var m, u = P( () => {
        m = {
            platform: "",
            env: {},
            versions: {
                node: "14.17.6"
            }
        }
    }
    );
    var Fv, be, ft = P( () => {
        u();
        Fv = 0,
        be = {
            readFileSync: r => self[r] || "",
            statSync: () => ({
                mtimeMs: Fv++
            }),
            promises: {
                readFile: r => Promise.resolve(self[r] || "")
            }
        }
    }
    );
    var Fs = x( (oP, gf) => {
        u();
        "use strict";
        var mf = class {
            constructor(e={}) {
                if (!(e.maxSize && e.maxSize > 0))
                    throw new TypeError("`maxSize` must be a number greater than 0");
                if (typeof e.maxAge == "number" && e.maxAge === 0)
                    throw new TypeError("`maxAge` must be a number greater than 0");
                this.maxSize = e.maxSize,
                this.maxAge = e.maxAge || 1 / 0,
                this.onEviction = e.onEviction,
                this.cache = new Map,
                this.oldCache = new Map,
                this._size = 0
            }
            _emitEvictions(e) {
                if (typeof this.onEviction == "function")
                    for (let[t,i] of e)
                        this.onEviction(t, i.value)
            }
            _deleteIfExpired(e, t) {
                return typeof t.expiry == "number" && t.expiry <= Date.now() ? (typeof this.onEviction == "function" && this.onEviction(e, t.value),
                this.delete(e)) : !1
            }
            _getOrDeleteIfExpired(e, t) {
                if (this._deleteIfExpired(e, t) === !1)
                    return t.value
            }
            _getItemValue(e, t) {
                return t.expiry ? this._getOrDeleteIfExpired(e, t) : t.value
            }
            _peek(e, t) {
                let i = t.get(e);
                return this._getItemValue(e, i)
            }
            _set(e, t) {
                this.cache.set(e, t),
                this._size++,
                this._size >= this.maxSize && (this._size = 0,
                this._emitEvictions(this.oldCache),
                this.oldCache = this.cache,
                this.cache = new Map)
            }
            _moveToRecent(e, t) {
                this.oldCache.delete(e),
                this._set(e, t)
            }
            *_entriesAscending() {
                for (let e of this.oldCache) {
                    let[t,i] = e;
                    this.cache.has(t) || this._deleteIfExpired(t, i) === !1 && (yield e)
                }
                for (let e of this.cache) {
                    let[t,i] = e;
                    this._deleteIfExpired(t, i) === !1 && (yield e)
                }
            }
            get(e) {
                if (this.cache.has(e)) {
                    let t = this.cache.get(e);
                    return this._getItemValue(e, t)
                }
                if (this.oldCache.has(e)) {
                    let t = this.oldCache.get(e);
                    if (this._deleteIfExpired(e, t) === !1)
                        return this._moveToRecent(e, t),
                        t.value
                }
            }
            set(e, t, {maxAge: i=this.maxAge === 1 / 0 ? void 0 : Date.now() + this.maxAge}={}) {
                this.cache.has(e) ? this.cache.set(e, {
                    value: t,
                    maxAge: i
                }) : this._set(e, {
                    value: t,
                    expiry: i
                })
            }
            has(e) {
                return this.cache.has(e) ? !this._deleteIfExpired(e, this.cache.get(e)) : this.oldCache.has(e) ? !this._deleteIfExpired(e, this.oldCache.get(e)) : !1
            }
            peek(e) {
                if (this.cache.has(e))
                    return this._peek(e, this.cache);
                if (this.oldCache.has(e))
                    return this._peek(e, this.oldCache)
            }
            delete(e) {
                let t = this.cache.delete(e);
                return t && this._size--,
                this.oldCache.delete(e) || t
            }
            clear() {
                this.cache.clear(),
                this.oldCache.clear(),
                this._size = 0
            }
            resize(e) {
                if (!(e && e > 0))
                    throw new TypeError("`maxSize` must be a number greater than 0");
                let t = [...this._entriesAscending()]
                  , i = t.length - e;
                i < 0 ? (this.cache = new Map(t),
                this.oldCache = new Map,
                this._size = t.length) : (i > 0 && this._emitEvictions(t.slice(0, i)),
                this.oldCache = new Map(t.slice(i)),
                this.cache = new Map,
                this._size = 0),
                this.maxSize = e
            }
            *keys() {
                for (let[e] of this)
                    yield e
            }
            *values() {
                for (let[,e] of this)
                    yield e
            }
            *[Symbol.iterator]() {
                for (let e of this.cache) {
                    let[t,i] = e;
                    this._deleteIfExpired(t, i) === !1 && (yield[t, i.value])
                }
                for (let e of this.oldCache) {
                    let[t,i] = e;
                    this.cache.has(t) || this._deleteIfExpired(t, i) === !1 && (yield[t, i.value])
                }
            }
            *entriesDescending() {
                let e = [...this.cache];
                for (let t = e.length - 1; t >= 0; --t) {
                    let i = e[t]
                      , [n,s] = i;
                    this._deleteIfExpired(n, s) === !1 && (yield[n, s.value])
                }
                e = [...this.oldCache];
                for (let t = e.length - 1; t >= 0; --t) {
                    let i = e[t]
                      , [n,s] = i;
                    this.cache.has(n) || this._deleteIfExpired(n, s) === !1 && (yield[n, s.value])
                }
            }
            *entriesAscending() {
                for (let[e,t] of this._entriesAscending())
                    yield[e, t.value]
            }
            get size() {
                if (!this._size)
                    return this.oldCache.size;
                let e = 0;
                for (let t of this.oldCache.keys())
                    this.cache.has(t) || e++;
                return Math.min(this._size + e, this.maxSize)
            }
        }
        ;
        gf.exports = mf
    }
    );
    var yf, bf = P( () => {
        u();
        yf = r => r && r._hash
    }
    );
    function Wi(r) {
        return yf(r, {
            ignoreUnknown: !0
        })
    }
    var wf = P( () => {
        u();
        bf()
    }
    );
    function xt(r) {
        if (r = `${r}`,
        r === "0")
            return "0";
        if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(r))
            return r.replace(/^[+-]?/, t => t === "-" ? "" : "-");
        let e = ["var", "calc", "min", "max", "clamp"];
        for (let t of e)
            if (r.includes(`${t}(`))
                return `calc(${r} * -1)`
    }
    var Gi = P( () => {
        u()
    }
    );
    var vf, xf = P( () => {
        u();
        vf = ["preflight", "container", "accessibility", "pointerEvents", "visibility", "position", "inset", "isolation", "zIndex", "order", "gridColumn", "gridColumnStart", "gridColumnEnd", "gridRow", "gridRowStart", "gridRowEnd", "float", "clear", "margin", "boxSizing", "lineClamp", "display", "aspectRatio", "size", "height", "maxHeight", "minHeight", "width", "minWidth", "maxWidth", "flex", "flexShrink", "flexGrow", "flexBasis", "tableLayout", "captionSide", "borderCollapse", "borderSpacing", "transformOrigin", "translate", "rotate", "skew", "scale", "transform", "animation", "cursor", "touchAction", "userSelect", "resize", "scrollSnapType", "scrollSnapAlign", "scrollSnapStop", "scrollMargin", "scrollPadding", "listStylePosition", "listStyleType", "listStyleImage", "appearance", "columns", "breakBefore", "breakInside", "breakAfter", "gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateColumns", "gridTemplateRows", "flexDirection", "flexWrap", "placeContent", "placeItems", "alignContent", "alignItems", "justifyContent", "justifyItems", "gap", "space", "divideWidth", "divideStyle", "divideColor", "divideOpacity", "placeSelf", "alignSelf", "justifySelf", "overflow", "overscrollBehavior", "scrollBehavior", "textOverflow", "hyphens", "whitespace", "textWrap", "wordBreak", "borderRadius", "borderWidth", "borderStyle", "borderColor", "borderOpacity", "backgroundColor", "backgroundOpacity", "backgroundImage", "gradientColorStops", "boxDecorationBreak", "backgroundSize", "backgroundAttachment", "backgroundClip", "backgroundPosition", "backgroundRepeat", "backgroundOrigin", "fill", "stroke", "strokeWidth", "objectFit", "objectPosition", "padding", "textAlign", "textIndent", "verticalAlign", "fontFamily", "fontSize", "fontWeight", "textTransform", "fontStyle", "fontVariantNumeric", "lineHeight", "letterSpacing", "textColor", "textOpacity", "textDecoration", "textDecorationColor", "textDecorationStyle", "textDecorationThickness", "textUnderlineOffset", "fontSmoothing", "placeholderColor", "placeholderOpacity", "caretColor", "accentColor", "opacity", "backgroundBlendMode", "mixBlendMode", "boxShadow", "boxShadowColor", "outlineStyle", "outlineWidth", "outlineOffset", "outlineColor", "ringWidth", "ringColor", "ringOpacity", "ringOffsetWidth", "ringOffsetColor", "blur", "brightness", "contrast", "dropShadow", "grayscale", "hueRotate", "invert", "saturate", "sepia", "filter", "backdropBlur", "backdropBrightness", "backdropContrast", "backdropGrayscale", "backdropHueRotate", "backdropInvert", "backdropOpacity", "backdropSaturate", "backdropSepia", "backdropFilter", "transitionProperty", "transitionDelay", "transitionDuration", "transitionTimingFunction", "willChange", "contain", "content", "forcedColorAdjust"]
    }
    );
    function kf(r, e) {
        return r === void 0 ? e : Array.isArray(r) ? r : [...new Set(e.filter(i => r !== !1 && r[i] !== !1).concat(Object.keys(r).filter(i => r[i] !== !1)))]
    }
    var Sf = P( () => {
        u()
    }
    );
    var Af = {};
    Ge(Af, {
        default: () => Qe
    });
    var Qe, Qi = P( () => {
        u();
        Qe = new Proxy({},{
            get: () => String
        })
    }
    );
    function js(r, e, t) {
        typeof m != "undefined" && m.env.JEST_WORKER_ID || t && Cf.has(t) || (t && Cf.add(t),
        console.warn(""),
        e.forEach(i => console.warn(r, "-", i)))
    }
    function zs(r) {
        return Qe.dim(r)
    }
    var Cf, G, Be = P( () => {
        u();
        Qi();
        Cf = new Set;
        G = {
            info(r, e) {
                js(Qe.bold(Qe.cyan("info")), ...Array.isArray(r) ? [r] : [e, r])
            },
            warn(r, e) {
                ["content-problems"].includes(r) || js(Qe.bold(Qe.yellow("warn")), ...Array.isArray(r) ? [r] : [e, r])
            },
            risk(r, e) {
                js(Qe.bold(Qe.magenta("risk")), ...Array.isArray(r) ? [r] : [e, r])
            }
        }
    }
    );
    var _f = {};
    Ge(_f, {
        default: () => Us
    });
    function qr({version: r, from: e, to: t}) {
        G.warn(`${e}-color-renamed`, [`As of Tailwind CSS ${r}, \`${e}\` has been renamed to \`${t}\`.`, "Update your configuration file to silence this warning."])
    }
    var Us, Vs = P( () => {
        u();
        Be();
        Us = {
            inherit: "inherit",
            current: "currentColor",
            transparent: "transparent",
            black: "#000",
            white: "#fff",
            slate: {
                50: "#f8fafc",
                100: "#f1f5f9",
                200: "#e2e8f0",
                300: "#cbd5e1",
                400: "#94a3b8",
                500: "#64748b",
                600: "#475569",
                700: "#334155",
                800: "#1e293b",
                900: "#0f172a",
                950: "#020617"
            },
            gray: {
                50: "#f9fafb",
                100: "#f3f4f6",
                200: "#e5e7eb",
                300: "#d1d5db",
                400: "#9ca3af",
                500: "#6b7280",
                600: "#4b5563",
                700: "#374151",
                800: "#1f2937",
                900: "#111827",
                950: "#030712"
            },
            zinc: {
                50: "#fafafa",
                100: "#f4f4f5",
                200: "#e4e4e7",
                300: "#d4d4d8",
                400: "#a1a1aa",
                500: "#71717a",
                600: "#52525b",
                700: "#3f3f46",
                800: "#27272a",
                900: "#18181b",
                950: "#09090b"
            },
            neutral: {
                50: "#fafafa",
                100: "#f5f5f5",
                200: "#e5e5e5",
                300: "#d4d4d4",
                400: "#a3a3a3",
                500: "#737373",
                600: "#525252",
                700: "#404040",
                800: "#262626",
                900: "#171717",
                950: "#0a0a0a"
            },
            stone: {
                50: "#fafaf9",
                100: "#f5f5f4",
                200: "#e7e5e4",
                300: "#d6d3d1",
                400: "#a8a29e",
                500: "#78716c",
                600: "#57534e",
                700: "#44403c",
                800: "#292524",
                900: "#1c1917",
                950: "#0c0a09"
            },
            red: {
                50: "#fef2f2",
                100: "#fee2e2",
                200: "#fecaca",
                300: "#fca5a5",
                400: "#f87171",
                500: "#ef4444",
                600: "#dc2626",
                700: "#b91c1c",
                800: "#991b1b",
                900: "#7f1d1d",
                950: "#450a0a"
            },
            orange: {
                50: "#fff7ed",
                100: "#ffedd5",
                200: "#fed7aa",
                300: "#fdba74",
                400: "#fb923c",
                500: "#f97316",
                600: "#ea580c",
                700: "#c2410c",
                800: "#9a3412",
                900: "#7c2d12",
                950: "#431407"
            },
            amber: {
                50: "#fffbeb",
                100: "#fef3c7",
                200: "#fde68a",
                300: "#fcd34d",
                400: "#fbbf24",
                500: "#f59e0b",
                600: "#d97706",
                700: "#b45309",
                800: "#92400e",
                900: "#78350f",
                950: "#451a03"
            },
            yellow: {
                50: "#fefce8",
                100: "#fef9c3",
                200: "#fef08a",
                300: "#fde047",
                400: "#facc15",
                500: "#eab308",
                600: "#ca8a04",
                700: "#a16207",
                800: "#854d0e",
                900: "#713f12",
                950: "#422006"
            },
            lime: {
                50: "#f7fee7",
                100: "#ecfccb",
                200: "#d9f99d",
                300: "#bef264",
                400: "#a3e635",
                500: "#84cc16",
                600: "#65a30d",
                700: "#4d7c0f",
                800: "#3f6212",
                900: "#365314",
                950: "#1a2e05"
            },
            green: {
                50: "#f0fdf4",
                100: "#dcfce7",
                200: "#bbf7d0",
                300: "#86efac",
                400: "#4ade80",
                500: "#22c55e",
                600: "#16a34a",
                700: "#15803d",
                800: "#166534",
                900: "#14532d",
                950: "#052e16"
            },
            emerald: {
                50: "#ecfdf5",
                100: "#d1fae5",
                200: "#a7f3d0",
                300: "#6ee7b7",
                400: "#34d399",
                500: "#10b981",
                600: "#059669",
                700: "#047857",
                800: "#065f46",
                900: "#064e3b",
                950: "#022c22"
            },
            teal: {
                50: "#f0fdfa",
                100: "#ccfbf1",
                200: "#99f6e4",
                300: "#5eead4",
                400: "#2dd4bf",
                500: "#14b8a6",
                600: "#0d9488",
                700: "#0f766e",
                800: "#115e59",
                900: "#134e4a",
                950: "#042f2e"
            },
            cyan: {
                50: "#ecfeff",
                100: "#cffafe",
                200: "#a5f3fc",
                300: "#67e8f9",
                400: "#22d3ee",
                500: "#06b6d4",
                600: "#0891b2",
                700: "#0e7490",
                800: "#155e75",
                900: "#164e63",
                950: "#083344"
            },
            sky: {
                50: "#f0f9ff",
                100: "#e0f2fe",
                200: "#bae6fd",
                300: "#7dd3fc",
                400: "#38bdf8",
                500: "#0ea5e9",
                600: "#0284c7",
                700: "#0369a1",
                800: "#075985",
                900: "#0c4a6e",
                950: "#082f49"
            },
            blue: {
                50: "#eff6ff",
                100: "#dbeafe",
                200: "#bfdbfe",
                300: "#93c5fd",
                400: "#60a5fa",
                500: "#3b82f6",
                600: "#2563eb",
                700: "#1d4ed8",
                800: "#1e40af",
                900: "#1e3a8a",
                950: "#172554"
            },
            indigo: {
                50: "#eef2ff",
                100: "#e0e7ff",
                200: "#c7d2fe",
                300: "#a5b4fc",
                400: "#818cf8",
                500: "#6366f1",
                600: "#4f46e5",
                700: "#4338ca",
                800: "#3730a3",
                900: "#312e81",
                950: "#1e1b4b"
            },
            violet: {
                50: "#f5f3ff",
                100: "#ede9fe",
                200: "#ddd6fe",
                300: "#c4b5fd",
                400: "#a78bfa",
                500: "#8b5cf6",
                600: "#7c3aed",
                700: "#6d28d9",
                800: "#5b21b6",
                900: "#4c1d95",
                950: "#2e1065"
            },
            purple: {
                50: "#faf5ff",
                100: "#f3e8ff",
                200: "#e9d5ff",
                300: "#d8b4fe",
                400: "#c084fc",
                500: "#a855f7",
                600: "#9333ea",
                700: "#7e22ce",
                800: "#6b21a8",
                900: "#581c87",
                950: "#3b0764"
            },
            fuchsia: {
                50: "#fdf4ff",
                100: "#fae8ff",
                200: "#f5d0fe",
                300: "#f0abfc",
                400: "#e879f9",
                500: "#d946ef",
                600: "#c026d3",
                700: "#a21caf",
                800: "#86198f",
                900: "#701a75",
                950: "#4a044e"
            },
            pink: {
                50: "#fdf2f8",
                100: "#fce7f3",
                200: "#fbcfe8",
                300: "#f9a8d4",
                400: "#f472b6",
                500: "#ec4899",
                600: "#db2777",
                700: "#be185d",
                800: "#9d174d",
                900: "#831843",
                950: "#500724"
            },
            rose: {
                50: "#fff1f2",
                100: "#ffe4e6",
                200: "#fecdd3",
                300: "#fda4af",
                400: "#fb7185",
                500: "#f43f5e",
                600: "#e11d48",
                700: "#be123c",
                800: "#9f1239",
                900: "#881337",
                950: "#4c0519"
            },
            get lightBlue() {
                return qr({
                    version: "v2.2",
                    from: "lightBlue",
                    to: "sky"
                }),
                this.sky
            },
            get warmGray() {
                return qr({
                    version: "v3.0",
                    from: "warmGray",
                    to: "stone"
                }),
                this.stone
            },
            get trueGray() {
                return qr({
                    version: "v3.0",
                    from: "trueGray",
                    to: "neutral"
                }),
                this.neutral
            },
            get coolGray() {
                return qr({
                    version: "v3.0",
                    from: "coolGray",
                    to: "gray"
                }),
                this.gray
            },
            get blueGray() {
                return qr({
                    version: "v3.0",
                    from: "blueGray",
                    to: "slate"
                }),
                this.slate
            }
        }
    }
    );
    function Hs(r, ...e) {
        for (let t of e) {
            for (let i in t)
                r?.hasOwnProperty?.(i) || (r[i] = t[i]);
            for (let i of Object.getOwnPropertySymbols(t))
                r?.hasOwnProperty?.(i) || (r[i] = t[i])
        }
        return r
    }
    var Ef = P( () => {
        u()
    }
    );
    function kt(r) {
        if (Array.isArray(r))
            return r;
        let e = r.split("[").length - 1
          , t = r.split("]").length - 1;
        if (e !== t)
            throw new Error(`Path is invalid. Has unbalanced brackets: ${r}`);
        return r.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean)
    }
    var Yi = P( () => {
        u()
    }
    );
    function we(r, e) {
        return Ki.future.includes(e) ? r.future === "all" || (r?.future?.[e] ?? Of[e] ?? !1) : Ki.experimental.includes(e) ? r.experimental === "all" || (r?.experimental?.[e] ?? Of[e] ?? !1) : !1
    }
    function Tf(r) {
        return r.experimental === "all" ? Ki.experimental : Object.keys(r?.experimental ?? {}).filter(e => Ki.experimental.includes(e) && r.experimental[e])
    }
    function Rf(r) {
        if (m.env.JEST_WORKER_ID === void 0 && Tf(r).length > 0) {
            let e = Tf(r).map(t => Qe.yellow(t)).join(", ");
            G.warn("experimental-flags-enabled", [`You have enabled experimental features: ${e}`, "Experimental features in Tailwind CSS are not covered by semver, may introduce breaking changes, and can change at any time."])
        }
    }
    var Of, Ki, ct = P( () => {
        u();
        Qi();
        Be();
        Of = {
            optimizeUniversalDefaults: !1,
            generalizedModifiers: !0,
            disableColorOpacityUtilitiesByDefault: !1,
            relativeContentPathsByDefault: !1
        },
        Ki = {
            future: ["hoverOnlyWhenSupported", "respectDefaultRingColorOpacity", "disableColorOpacityUtilitiesByDefault", "relativeContentPathsByDefault"],
            experimental: ["optimizeUniversalDefaults", "generalizedModifiers"]
        }
    }
    );
    function Pf(r) {
        ( () => {
            if (r.purge || !r.content || !Array.isArray(r.content) && !(typeof r.content == "object" && r.content !== null))
                return !1;
            if (Array.isArray(r.content))
                return r.content.every(t => typeof t == "string" ? !0 : !(typeof t?.raw != "string" || t?.extension && typeof t?.extension != "string"));
            if (typeof r.content == "object" && r.content !== null) {
                if (Object.keys(r.content).some(t => !["files", "relative", "extract", "transform"].includes(t)))
                    return !1;
                if (Array.isArray(r.content.files)) {
                    if (!r.content.files.every(t => typeof t == "string" ? !0 : !(typeof t?.raw != "string" || t?.extension && typeof t?.extension != "string")))
                        return !1;
                    if (typeof r.content.extract == "object") {
                        for (let t of Object.values(r.content.extract))
                            if (typeof t != "function")
                                return !1
                    } else if (!(r.content.extract === void 0 || typeof r.content.extract == "function"))
                        return !1;
                    if (typeof r.content.transform == "object") {
                        for (let t of Object.values(r.content.transform))
                            if (typeof t != "function")
                                return !1
                    } else if (!(r.content.transform === void 0 || typeof r.content.transform == "function"))
                        return !1;
                    if (typeof r.content.relative != "boolean" && typeof r.content.relative != "undefined")
                        return !1
                }
                return !0
            }
            return !1
        }
        )() || G.warn("purge-deprecation", ["The `purge`/`content` options have changed in Tailwind CSS v3.0.", "Update your configuration file to eliminate this warning.", "https://tailwindcss.com/docs/upgrade-guide#configure-content-sources"]),
        r.safelist = ( () => {
            let {content: t, purge: i, safelist: n} = r;
            return Array.isArray(n) ? n : Array.isArray(t?.safelist) ? t.safelist : Array.isArray(i?.safelist) ? i.safelist : Array.isArray(i?.options?.safelist) ? i.options.safelist : []
        }
        )(),
        r.blocklist = ( () => {
            let {blocklist: t} = r;
            if (Array.isArray(t)) {
                if (t.every(i => typeof i == "string"))
                    return t;
                G.warn("blocklist-invalid", ["The `blocklist` option must be an array of strings.", "https://tailwindcss.com/docs/content-configuration#discarding-classes"])
            }
            return []
        }
        )(),
        typeof r.prefix == "function" ? (G.warn("prefix-function", ["As of Tailwind CSS v3.0, `prefix` cannot be a function.", "Update `prefix` in your configuration to be a string to eliminate this warning.", "https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function"]),
        r.prefix = "") : r.prefix = r.prefix ?? "",
        r.content = {
            relative: ( () => {
                let {content: t} = r;
                return t?.relative ? t.relative : we(r, "relativeContentPathsByDefault")
            }
            )(),
            files: ( () => {
                let {content: t, purge: i} = r;
                return Array.isArray(i) ? i : Array.isArray(i?.content) ? i.content : Array.isArray(t) ? t : Array.isArray(t?.content) ? t.content : Array.isArray(t?.files) ? t.files : []
            }
            )(),
            extract: ( () => {
                let t = ( () => r.purge?.extract ? r.purge.extract : r.content?.extract ? r.content.extract : r.purge?.extract?.DEFAULT ? r.purge.extract.DEFAULT : r.content?.extract?.DEFAULT ? r.content.extract.DEFAULT : r.purge?.options?.extractors ? r.purge.options.extractors : r.content?.options?.extractors ? r.content.options.extractors : {})()
                  , i = {}
                  , n = ( () => {
                    if (r.purge?.options?.defaultExtractor)
                        return r.purge.options.defaultExtractor;
                    if (r.content?.options?.defaultExtractor)
                        return r.content.options.defaultExtractor
                }
                )();
                if (n !== void 0 && (i.DEFAULT = n),
                typeof t == "function")
                    i.DEFAULT = t;
                else if (Array.isArray(t))
                    for (let {extensions: s, extractor: a} of t ?? [])
                        for (let o of s)
                            i[o] = a;
                else
                    typeof t == "object" && t !== null && Object.assign(i, t);
                return i
            }
            )(),
            transform: ( () => {
                let t = ( () => r.purge?.transform ? r.purge.transform : r.content?.transform ? r.content.transform : r.purge?.transform?.DEFAULT ? r.purge.transform.DEFAULT : r.content?.transform?.DEFAULT ? r.content.transform.DEFAULT : {})()
                  , i = {};
                return typeof t == "function" ? i.DEFAULT = t : typeof t == "object" && t !== null && Object.assign(i, t),
                i
            }
            )()
        };
        for (let t of r.content.files)
            if (typeof t == "string" && /{([^,]*?)}/g.test(t)) {
                G.warn("invalid-glob-braces", [`The glob pattern ${zs(t)} in your Tailwind CSS configuration is invalid.`, `Update it to ${zs(t.replace(/{([^,]*?)}/g, "$1"))} to silence this warning.`]);
                break
            }
        return r
    }
    var If = P( () => {
        u();
        ct();
        Be()
    }
    );
    function ke(r) {
        if (Object.prototype.toString.call(r) !== "[object Object]")
            return !1;
        let e = Object.getPrototypeOf(r);
        return e === null || Object.getPrototypeOf(e) === null
    }
    var Kt = P( () => {
        u()
    }
    );
    function St(r) {
        return Array.isArray(r) ? r.map(e => St(e)) : typeof r == "object" && r !== null ? Object.fromEntries(Object.entries(r).map( ([e,t]) => [e, St(t)])) : r
    }
    var Xi = P( () => {
        u()
    }
    );
    function jt(r) {
        return r.replace(/\\,/g, "\\2c ")
    }
    var Zi = P( () => {
        u()
    }
    );
    var Ws, Df = P( () => {
        u();
        Ws = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 134, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 250, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 221],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [112, 128, 144],
            slategrey: [112, 128, 144],
            snow: [255, 250, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 50]
        }
    }
    );
    function $r(r, {loose: e=!1}={}) {
        if (typeof r != "string")
            return null;
        if (r = r.trim(),
        r === "transparent")
            return {
                mode: "rgb",
                color: ["0", "0", "0"],
                alpha: "0"
            };
        if (r in Ws)
            return {
                mode: "rgb",
                color: Ws[r].map(s => s.toString())
            };
        let t = r.replace(zv, (s, a, o, l, c) => ["#", a, a, o, o, l, l, c ? c + c : ""].join("")).match(jv);
        if (t !== null)
            return {
                mode: "rgb",
                color: [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)].map(s => s.toString()),
                alpha: t[4] ? (parseInt(t[4], 16) / 255).toString() : void 0
            };
        let i = r.match(Uv) ?? r.match(Vv);
        if (i === null)
            return null;
        let n = [i[2], i[3], i[4]].filter(Boolean).map(s => s.toString());
        return n.length === 2 && n[0].startsWith("var(") ? {
            mode: i[1],
            color: [n[0]],
            alpha: n[1]
        } : !e && n.length !== 3 || n.length < 3 && !n.some(s => /^var\(.*?\)$/.test(s)) ? null : {
            mode: i[1],
            color: n,
            alpha: i[5]?.toString?.()
        }
    }
    function Gs({mode: r, color: e, alpha: t}) {
        let i = t !== void 0;
        return r === "rgba" || r === "hsla" ? `${r}(${e.join(", ")}${i ? `, ${t}` : ""})` : `${r}(${e.join(" ")}${i ? ` / ${t}` : ""})`
    }
    var jv, zv, At, Ji, qf, Ct, Uv, Vv, Qs = P( () => {
        u();
        Df();
        jv = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i,
        zv = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i,
        At = /(?:\d+|\d*\.\d+)%?/,
        Ji = /(?:\s*,\s*|\s+)/,
        qf = /\s*[,/]\s*/,
        Ct = /var\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\(--[^ )]*?\)))?\)/,
        Uv = new RegExp(`^(rgba?)\\(\\s*(${At.source}|${Ct.source})(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${qf.source}(${At.source}|${Ct.source}))?\\s*\\)$`),
        Vv = new RegExp(`^(hsla?)\\(\\s*((?:${At.source})(?:deg|rad|grad|turn)?|${Ct.source})(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${qf.source}(${At.source}|${Ct.source}))?\\s*\\)$`)
    }
    );
    function Je(r, e, t) {
        if (typeof r == "function")
            return r({
                opacityValue: e
            });
        let i = $r(r, {
            loose: !0
        });
        return i === null ? t : Gs({
            ...i,
            alpha: e
        })
    }
    function Ae({color: r, property: e, variable: t}) {
        let i = [].concat(e);
        if (typeof r == "function")
            return {
                [t]: "1",
                ...Object.fromEntries(i.map(s => [s, r({
                    opacityVariable: t,
                    opacityValue: `var(${t}, 1)`
                })]))
            };
        let n = $r(r);
        return n === null ? Object.fromEntries(i.map(s => [s, r])) : n.alpha !== void 0 ? Object.fromEntries(i.map(s => [s, r])) : {
            [t]: "1",
            ...Object.fromEntries(i.map(s => [s, Gs({
                ...n,
                alpha: `var(${t}, 1)`
            })]))
        }
    }
    var Lr = P( () => {
        u();
        Qs()
    }
    );
    function ve(r, e) {
        let t = []
          , i = []
          , n = 0
          , s = !1;
        for (let a = 0; a < r.length; a++) {
            let o = r[a];
            t.length === 0 && o === e[0] && !s && (e.length === 1 || r.slice(a, a + e.length) === e) && (i.push(r.slice(n, a)),
            n = a + e.length),
            s = s ? !1 : o === "\\",
            o === "(" || o === "[" || o === "{" ? t.push(o) : (o === ")" && t[t.length - 1] === "(" || o === "]" && t[t.length - 1] === "[" || o === "}" && t[t.length - 1] === "{") && t.pop()
        }
        return i.push(r.slice(n)),
        i
    }
    var zt = P( () => {
        u()
    }
    );
    function en(r) {
        return ve(r, ",").map(t => {
            let i = t.trim()
              , n = {
                raw: i
            }
              , s = i.split(Wv)
              , a = new Set;
            for (let o of s)
                $f.lastIndex = 0,
                !a.has("KEYWORD") && Hv.has(o) ? (n.keyword = o,
                a.add("KEYWORD")) : $f.test(o) ? a.has("X") ? a.has("Y") ? a.has("BLUR") ? a.has("SPREAD") || (n.spread = o,
                a.add("SPREAD")) : (n.blur = o,
                a.add("BLUR")) : (n.y = o,
                a.add("Y")) : (n.x = o,
                a.add("X")) : n.color ? (n.unknown || (n.unknown = []),
                n.unknown.push(o)) : n.color = o;
            return n.valid = n.x !== void 0 && n.y !== void 0,
            n
        }
        )
    }
    function Lf(r) {
        return r.map(e => e.valid ? [e.keyword, e.x, e.y, e.blur, e.spread, e.color].filter(Boolean).join(" ") : e.raw).join(", ")
    }
    var Hv, Wv, $f, Ys = P( () => {
        u();
        zt();
        Hv = new Set(["inset", "inherit", "initial", "revert", "unset"]),
        Wv = /\ +(?![^(]*\))/g,
        $f = /^-?(\d+|\.\d+)(.*?)$/g
    }
    );
    function Ks(r) {
        return Gv.some(e => new RegExp(`^${e}\\(.*\\)`).test(r))
    }
    function K(r, e=null, t=!0) {
        let i = e && Qv.has(e.property);
        return r.startsWith("--") && !i ? `var(${r})` : r.includes("url(") ? r.split(/(url\(.*?\))/g).filter(Boolean).map(n => /^url\(.*?\)$/.test(n) ? n : K(n, e, !1)).join("") : (r = r.replace(/([^\\])_+/g, (n, s) => s + " ".repeat(n.length - 1)).replace(/^_/g, " ").replace(/\\_/g, "_"),
        t && (r = r.trim()),
        r = Yv(r),
        r)
    }
    function Ye(r) {
        return r.includes("=") && (r = r.replace(/(=.*)/g, (e, t) => {
            if (t[1] === "'" || t[1] === '"')
                return t;
            if (t.length > 2) {
                let i = t[t.length - 1];
                if (t[t.length - 2] === " " && (i === "i" || i === "I" || i === "s" || i === "S"))
                    return `="${t.slice(1, -2)}" ${t[t.length - 1]}`
            }
            return `="${t.slice(1)}"`
        }
        )),
        r
    }
    function Yv(r) {
        let e = ["theme"]
          , t = ["min-content", "max-content", "fit-content", "safe-area-inset-top", "safe-area-inset-right", "safe-area-inset-bottom", "safe-area-inset-left", "titlebar-area-x", "titlebar-area-y", "titlebar-area-width", "titlebar-area-height", "keyboard-inset-top", "keyboard-inset-right", "keyboard-inset-bottom", "keyboard-inset-left", "keyboard-inset-width", "keyboard-inset-height", "radial-gradient", "linear-gradient", "conic-gradient", "repeating-radial-gradient", "repeating-linear-gradient", "repeating-conic-gradient", "anchor-size"];
        return r.replace(/(calc|min|max|clamp)\(.+\)/g, i => {
            let n = "";
            function s() {
                let a = n.trimEnd();
                return a[a.length - 1]
            }
            for (let a = 0; a < i.length; a++) {
                let o = function(f) {
                    return f.split("").every( (d, p) => i[a + p] === d)
                }
                  , l = function(f) {
                    let d = 1 / 0;
                    for (let h of f) {
                        let b = i.indexOf(h, a);
                        b !== -1 && b < d && (d = b)
                    }
                    let p = i.slice(a, d);
                    return a += p.length - 1,
                    p
                }
                  , c = i[a];
                if (o("var"))
                    n += l([")", ","]);
                else if (t.some(f => o(f))) {
                    let f = t.find(d => o(d));
                    n += f,
                    a += f.length - 1
                } else
                    e.some(f => o(f)) ? n += l([")"]) : o("[") ? n += l(["]"]) : ["+", "-", "*", "/"].includes(c) && !["(", "+", "-", "*", "/", ","].includes(s()) ? n += ` ${c} ` : n += c
            }
            return n.replace(/\s+/g, " ")
        }
        )
    }
    function Xs(r) {
        return r.startsWith("url(")
    }
    function Zs(r) {
        return !isNaN(Number(r)) || Ks(r)
    }
    function Mr(r) {
        return r.endsWith("%") && Zs(r.slice(0, -1)) || Ks(r)
    }
    function Nr(r) {
        return r === "0" || new RegExp(`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${Xv}$`).test(r) || Ks(r)
    }
    function Mf(r) {
        return Zv.has(r)
    }
    function Nf(r) {
        let e = en(K(r));
        for (let t of e)
            if (!t.valid)
                return !1;
        return !0
    }
    function Bf(r) {
        let e = 0;
        return ve(r, "_").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : $r(i, {
            loose: !0
        }) !== null ? (e++,
        !0) : !1)) ? e > 0 : !1
    }
    function Ff(r) {
        let e = 0;
        return ve(r, ",").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : Xs(i) || ex(i) || ["element(", "image(", "cross-fade(", "image-set("].some(n => i.startsWith(n)) ? (e++,
        !0) : !1)) ? e > 0 : !1
    }
    function ex(r) {
        r = K(r);
        for (let e of Jv)
            if (r.startsWith(`${e}(`))
                return !0;
        return !1
    }
    function jf(r) {
        let e = 0;
        return ve(r, "_").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : tx.has(i) || Nr(i) || Mr(i) ? (e++,
        !0) : !1)) ? e > 0 : !1
    }
    function zf(r) {
        let e = 0;
        return ve(r, ",").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : i.includes(" ") && !/(['"])([^"']+)\1/g.test(i) || /^\d/g.test(i) ? !1 : (e++,
        !0))) ? e > 0 : !1
    }
    function Uf(r) {
        return rx.has(r)
    }
    function Vf(r) {
        return ix.has(r)
    }
    function Hf(r) {
        return nx.has(r)
    }
    var Gv, Qv, Kv, Xv, Zv, Jv, tx, rx, ix, nx, Br = P( () => {
        u();
        Qs();
        Ys();
        zt();
        Gv = ["min", "max", "clamp", "calc"];
        Qv = new Set(["scroll-timeline-name", "timeline-scope", "view-timeline-name", "font-palette", "anchor-name", "anchor-scope", "position-anchor", "position-try-options", "scroll-timeline", "animation-timeline", "view-timeline", "position-try"]);
        Kv = ["cm", "mm", "Q", "in", "pc", "pt", "px", "em", "ex", "ch", "rem", "lh", "rlh", "vw", "vh", "vmin", "vmax", "vb", "vi", "svw", "svh", "lvw", "lvh", "dvw", "dvh", "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax"],
        Xv = `(?:${Kv.join("|")})`;
        Zv = new Set(["thin", "medium", "thick"]);
        Jv = new Set(["conic-gradient", "linear-gradient", "radial-gradient", "repeating-conic-gradient", "repeating-linear-gradient", "repeating-radial-gradient"]);
        tx = new Set(["center", "top", "right", "bottom", "left"]);
        rx = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded", "math", "emoji", "fangsong"]);
        ix = new Set(["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"]);
        nx = new Set(["larger", "smaller"])
    }
    );
    function Wf(r) {
        let e = ["cover", "contain"];
        return ve(r, ",").every(t => {
            let i = ve(t, "_").filter(Boolean);
            return i.length === 1 && e.includes(i[0]) ? !0 : i.length !== 1 && i.length !== 2 ? !1 : i.every(n => Nr(n) || Mr(n) || n === "auto")
        }
        )
    }
    var Gf = P( () => {
        u();
        Br();
        zt()
    }
    );
    function Qf(r, e) {
        r.walkClasses(t => {
            t.value = e(t.value),
            t.raws && t.raws.value && (t.raws.value = jt(t.raws.value))
        }
        )
    }
    function Yf(r, e) {
        if (!_t(r))
            return;
        let t = r.slice(1, -1);
        if (!!e(t))
            return K(t)
    }
    function sx(r, e={}, t) {
        let i = e[r];
        if (i !== void 0)
            return xt(i);
        if (_t(r)) {
            let n = Yf(r, t);
            return n === void 0 ? void 0 : xt(n)
        }
    }
    function tn(r, e={}, {validate: t= () => !0}={}) {
        let i = e.values?.[r];
        return i !== void 0 ? i : e.supportsNegativeValues && r.startsWith("-") ? sx(r.slice(1), e.values, t) : Yf(r, t)
    }
    function _t(r) {
        return r.startsWith("[") && r.endsWith("]")
    }
    function Kf(r) {
        let e = r.lastIndexOf("/")
          , t = r.lastIndexOf("[", e)
          , i = r.indexOf("]", e);
        return r[e - 1] === "]" || r[e + 1] === "[" || t !== -1 && i !== -1 && t < e && e < i && (e = r.lastIndexOf("/", t)),
        e === -1 || e === r.length - 1 ? [r, void 0] : _t(r) && !r.includes("]/[") ? [r, void 0] : [r.slice(0, e), r.slice(e + 1)]
    }
    function Xt(r) {
        if (typeof r == "string" && r.includes("<alpha-value>")) {
            let e = r;
            return ({opacityValue: t=1}) => e.replace(/<alpha-value>/g, t)
        }
        return r
    }
    function Xf(r) {
        return K(r.slice(1, -1))
    }
    function ax(r, e={}, {tailwindConfig: t={}}={}) {
        if (e.values?.[r] !== void 0)
            return Xt(e.values?.[r]);
        let[i,n] = Kf(r);
        if (n !== void 0) {
            let s = e.values?.[i] ?? (_t(i) ? i.slice(1, -1) : void 0);
            return s === void 0 ? void 0 : (s = Xt(s),
            _t(n) ? Je(s, Xf(n)) : t.theme?.opacity?.[n] === void 0 ? void 0 : Je(s, t.theme.opacity[n]))
        }
        return tn(r, e, {
            validate: Bf
        })
    }
    function ox(r, e={}) {
        return e.values?.[r]
    }
    function qe(r) {
        return (e, t) => tn(e, t, {
            validate: r
        })
    }
    function lx(r, e) {
        let t = r.indexOf(e);
        return t === -1 ? [void 0, r] : [r.slice(0, t), r.slice(t + 1)]
    }
    function ea(r, e, t, i) {
        if (t.values && e in t.values)
            for (let {type: s} of r ?? []) {
                let a = Js[s](e, t, {
                    tailwindConfig: i
                });
                if (a !== void 0)
                    return [a, s, null]
            }
        if (_t(e)) {
            let s = e.slice(1, -1)
              , [a,o] = lx(s, ":");
            if (!/^[\w-_]+$/g.test(a))
                o = s;
            else if (a !== void 0 && !Zf.includes(a))
                return [];
            if (o.length > 0 && Zf.includes(a))
                return [tn(`[${o}]`, t), a, null]
        }
        let n = ta(r, e, t, i);
        for (let s of n)
            return s;
        return []
    }
    function *ta(r, e, t, i) {
        let n = we(i, "generalizedModifiers")
          , [s,a] = Kf(e);
        if (n && t.modifiers != null && (t.modifiers === "any" || typeof t.modifiers == "object" && (a && _t(a) || a in t.modifiers)) || (s = e,
        a = void 0),
        a !== void 0 && s === "" && (s = "DEFAULT"),
        a !== void 0 && typeof t.modifiers == "object") {
            let l = t.modifiers?.[a] ?? null;
            l !== null ? a = l : _t(a) && (a = Xf(a))
        }
        for (let {type: l} of r ?? []) {
            let c = Js[l](s, t, {
                tailwindConfig: i
            });
            c !== void 0 && (yield[c, l, a ?? null])
        }
    }
    var Js, Zf, Fr = P( () => {
        u();
        Zi();
        Lr();
        Br();
        Gi();
        Gf();
        ct();
        Js = {
            any: tn,
            color: ax,
            url: qe(Xs),
            image: qe(Ff),
            length: qe(Nr),
            percentage: qe(Mr),
            position: qe(jf),
            lookup: ox,
            "generic-name": qe(Uf),
            "family-name": qe(zf),
            number: qe(Zs),
            "line-width": qe(Mf),
            "absolute-size": qe(Vf),
            "relative-size": qe(Hf),
            shadow: qe(Nf),
            size: qe(Wf)
        },
        Zf = Object.keys(Js)
    }
    );
    function X(r) {
        return typeof r == "function" ? r({}) : r
    }
    var ra = P( () => {
        u()
    }
    );
    function Zt(r) {
        return typeof r == "function"
    }
    function jr(r, ...e) {
        let t = e.pop();
        for (let i of e)
            for (let n in i) {
                let s = t(r[n], i[n]);
                s === void 0 ? ke(r[n]) && ke(i[n]) ? r[n] = jr({}, r[n], i[n], t) : r[n] = i[n] : r[n] = s
            }
        return r
    }
    function ux(r, ...e) {
        return Zt(r) ? r(...e) : r
    }
    function fx(r) {
        return r.reduce( (e, {extend: t}) => jr(e, t, (i, n) => i === void 0 ? [n] : Array.isArray(i) ? [n, ...i] : [n, i]), {})
    }
    function cx(r) {
        return {
            ...r.reduce( (e, t) => Hs(e, t), {}),
            extend: fx(r)
        }
    }
    function Jf(r, e) {
        if (Array.isArray(r) && ke(r[0]))
            return r.concat(e);
        if (Array.isArray(e) && ke(e[0]) && ke(r))
            return [r, ...e];
        if (Array.isArray(e))
            return e
    }
    function px({extend: r, ...e}) {
        return jr(e, r, (t, i) => !Zt(t) && !i.some(Zt) ? jr({}, t, ...i, Jf) : (n, s) => jr({}, ...[t, ...i].map(a => ux(a, n, s)), Jf))
    }
    function *dx(r) {
        let e = kt(r);
        if (e.length === 0 || (yield e,
        Array.isArray(r)))
            return;
        let t = /^(.*?)\s*\/\s*([^/]+)$/
          , i = r.match(t);
        if (i !== null) {
            let[,n,s] = i
              , a = kt(n);
            a.alpha = s,
            yield a
        }
    }
    function hx(r) {
        let e = (t, i) => {
            for (let n of dx(t)) {
                let s = 0
                  , a = r;
                for (; a != null && s < n.length; )
                    a = a[n[s++]],
                    a = Zt(a) && (n.alpha === void 0 || s <= n.length - 1) ? a(e, ia) : a;
                if (a !== void 0) {
                    if (n.alpha !== void 0) {
                        let o = Xt(a);
                        return Je(o, n.alpha, X(o))
                    }
                    return ke(a) ? St(a) : a
                }
            }
            return i
        }
        ;
        return Object.assign(e, {
            theme: e,
            ...ia
        }),
        Object.keys(r).reduce( (t, i) => (t[i] = Zt(r[i]) ? r[i](e, ia) : r[i],
        t), {})
    }
    function ec(r) {
        let e = [];
        return r.forEach(t => {
            e = [...e, t];
            let i = t?.plugins ?? [];
            i.length !== 0 && i.forEach(n => {
                n.__isOptionsFunction && (n = n()),
                e = [...e, ...ec([n?.config ?? {}])]
            }
            )
        }
        ),
        e
    }
    function mx(r) {
        return [...r].reduceRight( (t, i) => Zt(i) ? i({
            corePlugins: t
        }) : kf(i, t), vf)
    }
    function gx(r) {
        return [...r].reduceRight( (t, i) => [...t, ...i], [])
    }
    function na(r) {
        let e = [...ec(r), {
            prefix: "",
            important: !1,
            separator: ":"
        }];
        return Pf(Hs({
            theme: hx(px(cx(e.map(t => t?.theme ?? {})))),
            corePlugins: mx(e.map(t => t.corePlugins)),
            plugins: gx(r.map(t => t?.plugins ?? []))
        }, ...e))
    }
    var ia, tc = P( () => {
        u();
        Gi();
        xf();
        Sf();
        Vs();
        Ef();
        Yi();
        If();
        Kt();
        Xi();
        Fr();
        Lr();
        ra();
        ia = {
            colors: Us,
            negative(r) {
                return Object.keys(r).filter(e => r[e] !== "0").reduce( (e, t) => {
                    let i = xt(r[t]);
                    return i !== void 0 && (e[`-${t}`] = i),
                    e
                }
                , {})
            },
            breakpoints(r) {
                return Object.keys(r).filter(e => typeof r[e] == "string").reduce( (e, t) => ({
                    ...e,
                    [`screen-${t}`]: r[t]
                }), {})
            }
        }
    }
    );
    var rn = x( (f3, rc) => {
        u();
        rc.exports = {
            content: [],
            presets: [],
            darkMode: "media",
            theme: {
                accentColor: ({theme: r}) => ({
                    ...r("colors"),
                    auto: "auto"
                }),
                animation: {
                    none: "none",
                    spin: "spin 1s linear infinite",
                    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                    bounce: "bounce 1s infinite"
                },
                aria: {
                    busy: 'busy="true"',
                    checked: 'checked="true"',
                    disabled: 'disabled="true"',
                    expanded: 'expanded="true"',
                    hidden: 'hidden="true"',
                    pressed: 'pressed="true"',
                    readonly: 'readonly="true"',
                    required: 'required="true"',
                    selected: 'selected="true"'
                },
                aspectRatio: {
                    auto: "auto",
                    square: "1 / 1",
                    video: "16 / 9"
                },
                backdropBlur: ({theme: r}) => r("blur"),
                backdropBrightness: ({theme: r}) => r("brightness"),
                backdropContrast: ({theme: r}) => r("contrast"),
                backdropGrayscale: ({theme: r}) => r("grayscale"),
                backdropHueRotate: ({theme: r}) => r("hueRotate"),
                backdropInvert: ({theme: r}) => r("invert"),
                backdropOpacity: ({theme: r}) => r("opacity"),
                backdropSaturate: ({theme: r}) => r("saturate"),
                backdropSepia: ({theme: r}) => r("sepia"),
                backgroundColor: ({theme: r}) => r("colors"),
                backgroundImage: {
                    none: "none",
                    "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
                    "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
                    "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
                    "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
                    "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
                    "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
                    "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
                    "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
                },
                backgroundOpacity: ({theme: r}) => r("opacity"),
                backgroundPosition: {
                    bottom: "bottom",
                    center: "center",
                    left: "left",
                    "left-bottom": "left bottom",
                    "left-top": "left top",
                    right: "right",
                    "right-bottom": "right bottom",
                    "right-top": "right top",
                    top: "top"
                },
                backgroundSize: {
                    auto: "auto",
                    cover: "cover",
                    contain: "contain"
                },
                blur: {
                    0: "0",
                    none: "",
                    sm: "4px",
                    DEFAULT: "8px",
                    md: "12px",
                    lg: "16px",
                    xl: "24px",
                    "2xl": "40px",
                    "3xl": "64px"
                },
                borderColor: ({theme: r}) => ({
                    ...r("colors"),
                    DEFAULT: r("colors.gray.200", "currentColor")
                }),
                borderOpacity: ({theme: r}) => r("opacity"),
                borderRadius: {
                    none: "0px",
                    sm: "0.125rem",
                    DEFAULT: "0.25rem",
                    md: "0.375rem",
                    lg: "0.5rem",
                    xl: "0.75rem",
                    "2xl": "1rem",
                    "3xl": "1.5rem",
                    full: "9999px"
                },
                borderSpacing: ({theme: r}) => ({
                    ...r("spacing")
                }),
                borderWidth: {
                    DEFAULT: "1px",
                    0: "0px",
                    2: "2px",
                    4: "4px",
                    8: "8px"
                },
                boxShadow: {
                    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
                    none: "none"
                },
                boxShadowColor: ({theme: r}) => r("colors"),
                brightness: {
                    0: "0",
                    50: ".5",
                    75: ".75",
                    90: ".9",
                    95: ".95",
                    100: "1",
                    105: "1.05",
                    110: "1.1",
                    125: "1.25",
                    150: "1.5",
                    200: "2"
                },
                caretColor: ({theme: r}) => r("colors"),
                colors: ({colors: r}) => ({
                    inherit: r.inherit,
                    current: r.current,
                    transparent: r.transparent,
                    black: r.black,
                    white: r.white,
                    slate: r.slate,
                    gray: r.gray,
                    zinc: r.zinc,
                    neutral: r.neutral,
                    stone: r.stone,
                    red: r.red,
                    orange: r.orange,
                    amber: r.amber,
                    yellow: r.yellow,
                    lime: r.lime,
                    green: r.green,
                    emerald: r.emerald,
                    teal: r.teal,
                    cyan: r.cyan,
                    sky: r.sky,
                    blue: r.blue,
                    indigo: r.indigo,
                    violet: r.violet,
                    purple: r.purple,
                    fuchsia: r.fuchsia,
                    pink: r.pink,
                    rose: r.rose
                }),
                columns: {
                    auto: "auto",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                    11: "11",
                    12: "12",
                    "3xs": "16rem",
                    "2xs": "18rem",
                    xs: "20rem",
                    sm: "24rem",
                    md: "28rem",
                    lg: "32rem",
                    xl: "36rem",
                    "2xl": "42rem",
                    "3xl": "48rem",
                    "4xl": "56rem",
                    "5xl": "64rem",
                    "6xl": "72rem",
                    "7xl": "80rem"
                },
                container: {},
                content: {
                    none: "none"
                },
                contrast: {
                    0: "0",
                    50: ".5",
                    75: ".75",
                    100: "1",
                    125: "1.25",
                    150: "1.5",
                    200: "2"
                },
                cursor: {
                    auto: "auto",
                    default: "default",
                    pointer: "pointer",
                    wait: "wait",
                    text: "text",
                    move: "move",
                    help: "help",
                    "not-allowed": "not-allowed",
                    none: "none",
                    "context-menu": "context-menu",
                    progress: "progress",
                    cell: "cell",
                    crosshair: "crosshair",
                    "vertical-text": "vertical-text",
                    alias: "alias",
                    copy: "copy",
                    "no-drop": "no-drop",
                    grab: "grab",
                    grabbing: "grabbing",
                    "all-scroll": "all-scroll",
                    "col-resize": "col-resize",
                    "row-resize": "row-resize",
                    "n-resize": "n-resize",
                    "e-resize": "e-resize",
                    "s-resize": "s-resize",
                    "w-resize": "w-resize",
                    "ne-resize": "ne-resize",
                    "nw-resize": "nw-resize",
                    "se-resize": "se-resize",
                    "sw-resize": "sw-resize",
                    "ew-resize": "ew-resize",
                    "ns-resize": "ns-resize",
                    "nesw-resize": "nesw-resize",
                    "nwse-resize": "nwse-resize",
                    "zoom-in": "zoom-in",
                    "zoom-out": "zoom-out"
                },
                divideColor: ({theme: r}) => r("borderColor"),
                divideOpacity: ({theme: r}) => r("borderOpacity"),
                divideWidth: ({theme: r}) => r("borderWidth"),
                dropShadow: {
                    sm: "0 1px 1px rgb(0 0 0 / 0.05)",
                    DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
                    md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
                    lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
                    xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
                    "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
                    none: "0 0 #0000"
                },
                fill: ({theme: r}) => ({
                    none: "none",
                    ...r("colors")
                }),
                flex: {
                    1: "1 1 0%",
                    auto: "1 1 auto",
                    initial: "0 1 auto",
                    none: "none"
                },
                flexBasis: ({theme: r}) => ({
                    auto: "auto",
                    ...r("spacing"),
                    "1/2": "50%",
                    "1/3": "33.333333%",
                    "2/3": "66.666667%",
                    "1/4": "25%",
                    "2/4": "50%",
                    "3/4": "75%",
                    "1/5": "20%",
                    "2/5": "40%",
                    "3/5": "60%",
                    "4/5": "80%",
                    "1/6": "16.666667%",
                    "2/6": "33.333333%",
                    "3/6": "50%",
                    "4/6": "66.666667%",
                    "5/6": "83.333333%",
                    "1/12": "8.333333%",
                    "2/12": "16.666667%",
                    "3/12": "25%",
                    "4/12": "33.333333%",
                    "5/12": "41.666667%",
                    "6/12": "50%",
                    "7/12": "58.333333%",
                    "8/12": "66.666667%",
                    "9/12": "75%",
                    "10/12": "83.333333%",
                    "11/12": "91.666667%",
                    full: "100%"
                }),
                flexGrow: {
                    0: "0",
                    DEFAULT: "1"
                },
                flexShrink: {
                    0: "0",
                    DEFAULT: "1"
                },
                fontFamily: {
                    sans: ["ui-sans-serif", "system-ui", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
                    serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
                    mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", '"Liberation Mono"', '"Courier New"', "monospace"]
                },
                fontSize: {
                    xs: ["0.75rem", {
                        lineHeight: "1rem"
                    }],
                    sm: ["0.875rem", {
                        lineHeight: "1.25rem"
                    }],
                    base: ["1rem", {
                        lineHeight: "1.5rem"
                    }],
                    lg: ["1.125rem", {
                        lineHeight: "1.75rem"
                    }],
                    xl: ["1.25rem", {
                        lineHeight: "1.75rem"
                    }],
                    "2xl": ["1.5rem", {
                        lineHeight: "2rem"
                    }],
                    "3xl": ["1.875rem", {
                        lineHeight: "2.25rem"
                    }],
                    "4xl": ["2.25rem", {
                        lineHeight: "2.5rem"
                    }],
                    "5xl": ["3rem", {
                        lineHeight: "1"
                    }],
                    "6xl": ["3.75rem", {
                        lineHeight: "1"
                    }],
                    "7xl": ["4.5rem", {
                        lineHeight: "1"
                    }],
                    "8xl": ["6rem", {
                        lineHeight: "1"
                    }],
                    "9xl": ["8rem", {
                        lineHeight: "1"
                    }]
                },
                fontWeight: {
                    thin: "100",
                    extralight: "200",
                    light: "300",
                    normal: "400",
                    medium: "500",
                    semibold: "600",
                    bold: "700",
                    extrabold: "800",
                    black: "900"
                },
                gap: ({theme: r}) => r("spacing"),
                gradientColorStops: ({theme: r}) => r("colors"),
                gradientColorStopPositions: {
                    "0%": "0%",
                    "5%": "5%",
                    "10%": "10%",
                    "15%": "15%",
                    "20%": "20%",
                    "25%": "25%",
                    "30%": "30%",
                    "35%": "35%",
                    "40%": "40%",
                    "45%": "45%",
                    "50%": "50%",
                    "55%": "55%",
                    "60%": "60%",
                    "65%": "65%",
                    "70%": "70%",
                    "75%": "75%",
                    "80%": "80%",
                    "85%": "85%",
                    "90%": "90%",
                    "95%": "95%",
                    "100%": "100%"
                },
                grayscale: {
                    0: "0",
                    DEFAULT: "100%"
                },
                gridAutoColumns: {
                    auto: "auto",
                    min: "min-content",
                    max: "max-content",
                    fr: "minmax(0, 1fr)"
                },
                gridAutoRows: {
                    auto: "auto",
                    min: "min-content",
                    max: "max-content",
                    fr: "minmax(0, 1fr)"
                },
                gridColumn: {
                    auto: "auto",
                    "span-1": "span 1 / span 1",
                    "span-2": "span 2 / span 2",
                    "span-3": "span 3 / span 3",
                    "span-4": "span 4 / span 4",
                    "span-5": "span 5 / span 5",
                    "span-6": "span 6 / span 6",
                    "span-7": "span 7 / span 7",
                    "span-8": "span 8 / span 8",
                    "span-9": "span 9 / span 9",
                    "span-10": "span 10 / span 10",
                    "span-11": "span 11 / span 11",
                    "span-12": "span 12 / span 12",
                    "span-full": "1 / -1"
                },
                gridColumnEnd: {
                    auto: "auto",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                    11: "11",
                    12: "12",
                    13: "13"
                },
                gridColumnStart: {
                    auto: "auto",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                    11: "11",
                    12: "12",
                    13: "13"
                },
                gridRow: {
                    auto: "auto",
                    "span-1": "span 1 / span 1",
                    "span-2": "span 2 / span 2",
                    "span-3": "span 3 / span 3",
                    "span-4": "span 4 / span 4",
                    "span-5": "span 5 / span 5",
                    "span-6": "span 6 / span 6",
                    "span-7": "span 7 / span 7",
                    "span-8": "span 8 / span 8",
                    "span-9": "span 9 / span 9",
                    "span-10": "span 10 / span 10",
                    "span-11": "span 11 / span 11",
                    "span-12": "span 12 / span 12",
                    "span-full": "1 / -1"
                },
                gridRowEnd: {
                    auto: "auto",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                    11: "11",
                    12: "12",
                    13: "13"
                },
                gridRowStart: {
                    auto: "auto",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                    11: "11",
                    12: "12",
                    13: "13"
                },
                gridTemplateColumns: {
                    none: "none",
                    subgrid: "subgrid",
                    1: "repeat(1, minmax(0, 1fr))",
                    2: "repeat(2, minmax(0, 1fr))",
                    3: "repeat(3, minmax(0, 1fr))",
                    4: "repeat(4, minmax(0, 1fr))",
                    5: "repeat(5, minmax(0, 1fr))",
                    6: "repeat(6, minmax(0, 1fr))",
                    7: "repeat(7, minmax(0, 1fr))",
                    8: "repeat(8, minmax(0, 1fr))",
                    9: "repeat(9, minmax(0, 1fr))",
                    10: "repeat(10, minmax(0, 1fr))",
                    11: "repeat(11, minmax(0, 1fr))",
                    12: "repeat(12, minmax(0, 1fr))"
                },
                gridTemplateRows: {
                    none: "none",
                    subgrid: "subgrid",
                    1: "repeat(1, minmax(0, 1fr))",
                    2: "repeat(2, minmax(0, 1fr))",
                    3: "repeat(3, minmax(0, 1fr))",
                    4: "repeat(4, minmax(0, 1fr))",
                    5: "repeat(5, minmax(0, 1fr))",
                    6: "repeat(6, minmax(0, 1fr))",
                    7: "repeat(7, minmax(0, 1fr))",
                    8: "repeat(8, minmax(0, 1fr))",
                    9: "repeat(9, minmax(0, 1fr))",
                    10: "repeat(10, minmax(0, 1fr))",
                    11: "repeat(11, minmax(0, 1fr))",
                    12: "repeat(12, minmax(0, 1fr))"
                },
                height: ({theme: r}) => ({
                    auto: "auto",
                    ...r("spacing"),
                    "1/2": "50%",
                    "1/3": "33.333333%",
                    "2/3": "66.666667%",
                    "1/4": "25%",
                    "2/4": "50%",
                    "3/4": "75%",
                    "1/5": "20%",
                    "2/5": "40%",
                    "3/5": "60%",
                    "4/5": "80%",
                    "1/6": "16.666667%",
                    "2/6": "33.333333%",
                    "3/6": "50%",
                    "4/6": "66.666667%",
                    "5/6": "83.333333%",
                    full: "100%",
                    screen: "100vh",
                    svh: "100svh",
                    lvh: "100lvh",
                    dvh: "100dvh",
                    min: "min-content",
                    max: "max-content",
                    fit: "fit-content"
                }),
                hueRotate: {
                    0: "0deg",
                    15: "15deg",
                    30: "30deg",
                    60: "60deg",
                    90: "90deg",
                    180: "180deg"
                },
                inset: ({theme: r}) => ({
                    auto: "auto",
                    ...r("spacing"),
                    "1/2": "50%",
                    "1/3": "33.333333%",
                    "2/3": "66.666667%",
                    "1/4": "25%",
                    "2/4": "50%",
                    "3/4": "75%",
                    full: "100%"
                }),
                invert: {
                    0: "0",
                    DEFAULT: "100%"
                },
                keyframes: {
                    spin: {
                        to: {
                            transform: "rotate(360deg)"
                        }
                    },
                    ping: {
                        "75%, 100%": {
                            transform: "scale(2)",
                            opacity: "0"
                        }
                    },
                    pulse: {
                        "50%": {
                            opacity: ".5"
                        }
                    },
                    bounce: {
                        "0%, 100%": {
                            transform: "translateY(-25%)",
                            animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
                        },
                        "50%": {
                            transform: "none",
                            animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
                        }
                    }
                },
                letterSpacing: {
                    tighter: "-0.05em",
                    tight: "-0.025em",
                    normal: "0em",
                    wide: "0.025em",
                    wider: "0.05em",
                    widest: "0.1em"
                },
                lineHeight: {
                    none: "1",
                    tight: "1.25",
                    snug: "1.375",
                    normal: "1.5",
                    relaxed: "1.625",
                    loose: "2",
                    3: ".75rem",
                    4: "1rem",
                    5: "1.25rem",
                    6: "1.5rem",
                    7: "1.75rem",
                    8: "2rem",
                    9: "2.25rem",
                    10: "2.5rem"
                },
                listStyleType: {
                    none: "none",
                    disc: "disc",
                    decimal: "decimal"
                },
                listStyleImage: {
                    none: "none"
                },
                margin: ({theme: r}) => ({
                    auto: "auto",
                    ...r("spacing")
                }),
                lineClamp: {
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6"
                },
                maxHeight: ({theme: r}) => ({
                    ...r("spacing"),
                    none: "none",
                    full: "100%",
                    screen: "100vh",
                    svh: "100svh",
                    lvh: "100lvh",
                    dvh: "100dvh",
                    min: "min-content",
                    max: "max-content",
                    fit: "fit-content"
                }),
                maxWidth: ({theme: r, breakpoints: e}) => ({
                    ...r("spacing"),
                    none: "none",
                    xs: "20rem",
                    sm: "24rem",
                    md: "28rem",
                    lg: "32rem",
                    xl: "36rem",
                    "2xl": "42rem",
                    "3xl": "48rem",
                    "4xl": "56rem",
                    "5xl": "64rem",
                    "6xl": "72rem",
                    "7xl": "80rem",
                    full: "100%",
                    min: "min-content",
                    max: "max-content",
                    fit: "fit-content",
                    prose: "65ch",
                    ...e(r("screens"))
                }),
                minHeight: ({theme: r}) => ({
                    ...r("spacing"),
                    full: "100%",
                    screen: "100vh",
                    svh: "100svh",
                    lvh: "100lvh",
                    dvh: "100dvh",
                    min: "min-content",
                    max: "max-content",
                    fit: "fit-content"
                }),
                minWidth: ({theme: r}) => ({
                    ...r("spacing"),
                    full: "100%",
                    min: "min-content",
                    max: "max-content",
                    fit: "fit-content"
                }),
                objectPosition: {
                    bottom: "bottom",
                    center: "center",
                    left: "left",
                    "left-bottom": "left bottom",
                    "left-top": "left top",
                    right: "right",
                    "right-bottom": "right bottom",
                    "right-top": "right top",
                    top: "top"
                },
                opacity: {
                    0: "0",
                    5: "0.05",
                    10: "0.1",
                    15: "0.15",
                    20: "0.2",
                    25: "0.25",
                    30: "0.3",
                    35: "0.35",
                    40: "0.4",
                    45: "0.45",
                    50: "0.5",
                    55: "0.55",
                    60: "0.6",
                    65: "0.65",
                    70: "0.7",
                    75: "0.75",
                    80: "0.8",
                    85: "0.85",
                    90: "0.9",
                    95: "0.95",
                    100: "1"
                },
                order: {
                    first: "-9999",
                    last: "9999",
                    none: "0",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                    11: "11",
                    12: "12"
                },
                outlineColor: ({theme: r}) => r("colors"),
                outlineOffset: {
                    0: "0px",
                    1: "1px",
                    2: "2px",
                    4: "4px",
                    8: "8px"
                },
                outlineWidth: {
                    0: "0px",
                    1: "1px",
                    2: "2px",
                    4: "4px",
                    8: "8px"
                },
                padding: ({theme: r}) => r("spacing"),
                placeholderColor: ({theme: r}) => r("colors"),
                placeholderOpacity: ({theme: r}) => r("opacity"),
                ringColor: ({theme: r}) => ({
                    DEFAULT: r("colors.blue.500", "#3b82f6"),
                    ...r("colors")
                }),
                ringOffsetColor: ({theme: r}) => r("colors"),
                ringOffsetWidth: {
                    0: "0px",
                    1: "1px",
                    2: "2px",
                    4: "4px",
                    8: "8px"
                },
                ringOpacity: ({theme: r}) => ({
                    DEFAULT: "0.5",
                    ...r("opacity")
                }),
                ringWidth: {
                    DEFAULT: "3px",
                    0: "0px",
                    1: "1px",
                    2: "2px",
                    4: "4px",
                    8: "8px"
