/*!
 * jQuery UI Tooltip 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
! function(t) {
    "function" == typeof define && define.amd ? define(["jquery", "./core"], t) : t(jQuery)
}(function(d) {
    return d.widget("ui.tooltip", {
        version: "1.12.1",
        options: {
            classes: {
                "ui-tooltip": "ui-corner-all ui-widget-shadow"
            },
            content: function() {
                var t = d(this).attr("title") || "";
                return d("<a>").text(t).html()
            },
            hide: !0,
            items: "[title]:not([disabled])",
            position: {
                my: "left top+15",
                at: "left bottom",
                collision: "flipfit flip"
            },
            show: !0,
            track: !1,
            close: null,
            open: null
        },
        _addDescribedBy: function(t, i) {
            var e = (t.attr("aria-describedby") || "").split(/\s+/);
            e.push(i), t.data("ui-tooltip-id", i).attr("aria-describedby", d.trim(e.join(" ")))
        },
        _removeDescribedBy: function(t) {
            var i = t.data("ui-tooltip-id"),
                e = (t.attr("aria-describedby") || "").split(/\s+/),
                o = d.inArray(i, e); - 1 !== o && e.splice(o, 1), t.removeData("ui-tooltip-id"), (e = d.trim(e.join(" "))) ? t.attr("aria-describedby", e) : t.removeAttr("aria-describedby")
        },
        _create: function() {
            this._on({
                mouseover: "open",
                focusin: "open"
            }), this.tooltips = {}, this.parents = {}, this.liveRegion = d("<div>").attr({
                role: "log",
                "aria-live": "assertive",
                "aria-relevant": "additions"
            }).appendTo(this.document[0].body), this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible"), this.disabledTitles = d([])
        },
        _setOption: function(t, i) {
            var e = this;
            this._super(t, i), "content" === t && d.each(this.tooltips, function(t, i) {
                e._updateContent(i.element)
            })
        },
        _setOptionDisabled: function(t) {
            this[t ? "_disable" : "_enable"]()
        },
        _disable: function() {
            var o = this;
            d.each(this.tooltips, function(t, i) {
                var e = d.Event("blur");
                e.target = e.currentTarget = i.element[0], o.close(e, !0)
            }), this.disabledTitles = this.disabledTitles.add(this.element.find(this.options.items).addBack().filter(function() {
                var t = d(this);
                if (t.is("[title]")) return t.data("ui-tooltip-title", t.attr("title")).removeAttr("title")
            }))
        },
        _enable: function() {
            this.disabledTitles.each(function() {
                var t = d(this);
                t.data("ui-tooltip-title") && t.attr("title", t.data("ui-tooltip-title"))
            }), this.disabledTitles = d([])
        },
        open: function(t) {
            var e = this,
                i = d(t ? t.target : this.element).closest(this.options.items);
            i.length && !i.data("ui-tooltip-id") && (i.attr("title") && i.data("ui-tooltip-title", i.attr("title")), i.data("ui-tooltip-open", !0), t && "mouseover" === t.type && i.parents().each(function() {
                var t, i = d(this);
                i.data("ui-tooltip-open") && ((t = d.Event("blur")).target = t.currentTarget = this, e.close(t, !0)), i.attr("title") && (i.uniqueId(), e.parents[this.id] = {
                    element: this,
                    title: i.attr("title")
                }, i.attr("title", ""))
            }), this._registerCloseHandlers(t, i), this._updateContent(i, t))
        },
        _updateContent: function(i, e) {
            var t, o = this.options.content,
                n = this,
                s = e ? e.type : null;
            if ("string" == typeof o || o.nodeType || o.jquery) return this._open(e, i, o);
            (t = o.call(i[0], function(t) {
                n._delay(function() {
                    i.data("ui-tooltip-open") && (e && (e.type = s), this._open(e, i, t))
                })
            })) && this._open(e, i, t)
        },
        _open: function(t, i, e) {
            var o, n, s, l, a = d.extend({}, this.options.position);

            function r(t) {
                a.of = t, n.is(":hidden") || n.position(a)
            }
            e && ((o = this._find(i)) ? o.tooltip.find(".ui-tooltip-content").html(e) : (i.is("[title]") && (t && "mouseover" === t.type ? i.attr("title", "") : i.removeAttr("title")), o = this._tooltip(i), n = o.tooltip, this._addDescribedBy(i, n.attr("id")), n.find(".ui-tooltip-content").html(e), this.liveRegion.children().hide(), (l = d("<div>").html(n.find(".ui-tooltip-content").html())).removeAttr("name").find("[name]").removeAttr("name"), l.removeAttr("id").find("[id]").removeAttr("id"), l.appendTo(this.liveRegion), this.options.track && t && /^mouse/.test(t.type) ? (this._on(this.document, {
                mousemove: r
            }), r(t)) : n.position(d.extend({
                of: i
            }, this.options.position)), n.hide(), this._show(n, this.options.show), this.options.track && this.options.show && this.options.show.delay && (s = this.delayedShow = setInterval(function() {
                n.is(":visible") && (r(a.of), clearInterval(s))
            }, d.fx.interval)), this._trigger("open", t, {
                tooltip: n
            })))
        },
        _registerCloseHandlers: function(t, e) {
            var i = {
                keyup: function(t) {
                    if (t.keyCode === d.ui.keyCode.ESCAPE) {
                        var i = d.Event(t);
                        i.currentTarget = e[0], this.close(i, !0)
                    }
                }
            };
            e[0] !== this.element[0] && (i.remove = function() {
                this._removeTooltip(this._find(e).tooltip)
            }), t && "mouseover" !== t.type || (i.mouseleave = "close"), t && "focusin" !== t.type || (i.focusout = "close"), this._on(!0, e, i)
        },
        close: function(t) {
            var i, e = this,
                o = d(t ? t.currentTarget : this.element),
                n = this._find(o);
            n ? (i = n.tooltip, n.closing || (clearInterval(this.delayedShow), o.data("ui-tooltip-title") && !o.attr("title") && o.attr("title", o.data("ui-tooltip-title")), this._removeDescribedBy(o), n.hiding = !0, i.stop(!0), this._hide(i, this.options.hide, function() {
                e._removeTooltip(d(this))
            }), o.removeData("ui-tooltip-open"), this._off(o, "mouseleave focusout keyup"), o[0] !== this.element[0] && this._off(o, "remove"), this._off(this.document, "mousemove"), t && "mouseleave" === t.type && d.each(this.parents, function(t, i) {
                d(i.element).attr("title", i.title), delete e.parents[t]
            }), n.closing = !0, this._trigger("close", t, {
                tooltip: i
            }), n.hiding || (n.closing = !1))) : o.removeData("ui-tooltip-open")
        },
        _tooltip: function(t) {
            var i = d("<div>").attr("role", "tooltip"),
                e = d("<div>").appendTo(i),
                o = i.uniqueId().attr("id");
            return this._addClass(e, "ui-tooltip-content"), this._addClass(i, "ui-tooltip", "ui-widget ui-widget-content"), i.appendTo(this._appendTo(t)), this.tooltips[o] = {
                element: t,
                tooltip: i
            }
        },
        _find: function(t) {
            var i = t.data("ui-tooltip-id");
            return i ? this.tooltips[i] : null
        },
        _removeTooltip: function(t) {
            t.remove(), delete this.tooltips[t.attr("id")]
        },
        _appendTo: function(t) {
            var i = t.closest(".ui-front, dialog");
            return i.length || (i = this.document[0].body), i
        },
        _destroy: function() {
            var n = this;
            d.each(this.tooltips, function(t, i) {
                var e = d.Event("blur"),
                    o = i.element;
                e.target = e.currentTarget = o[0], n.close(e, !0), d("#" + t).remove(), o.data("ui-tooltip-title") && (o.attr("title") || o.attr("title", o.data("ui-tooltip-title")), o.removeData("ui-tooltip-title"))
            }), this.liveRegion.remove()
        }
    }), !1 !== d.uiBackCompat && d.widget("ui.tooltip", d.ui.tooltip, {
        options: {
            tooltipClass: null
        },
        _tooltip: function() {
            var t = this._superApply(arguments);
            return this.options.tooltipClass && t.tooltip.addClass(this.options.tooltipClass), t
        }
    }), d.ui.tooltip
});