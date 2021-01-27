/*!
 * jQuery UI Accordion 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery", "./core"], e) : e(jQuery)
}(function(l) {
    return l.widget("ui.accordion", {
        version: "1.12.1",
        options: {
            active: 0,
            animate: {},
            classes: {
                "ui-accordion-header": "ui-corner-top",
                "ui-accordion-header-collapsed": "ui-corner-all",
                "ui-accordion-content": "ui-corner-bottom"
            },
            collapsible: !1,
            event: "click",
            header: "> li > :first-child, > :not(li):even",
            heightStyle: "auto",
            icons: {
                activeHeader: "ui-icon-triangle-1-s",
                header: "ui-icon-triangle-1-e"
            },
            activate: null,
            beforeActivate: null
        },
        hideProps: {
            borderTopWidth: "hide",
            borderBottomWidth: "hide",
            paddingTop: "hide",
            paddingBottom: "hide",
            height: "hide"
        },
        showProps: {
            borderTopWidth: "show",
            borderBottomWidth: "show",
            paddingTop: "show",
            paddingBottom: "show",
            height: "show"
        },
        _create: function() {
            var e = this.options;
            this.prevShow = this.prevHide = l(), this._addClass("ui-accordion", "ui-widget ui-helper-reset"), this.element.attr("role", "tablist"), e.collapsible || !1 !== e.active && null != e.active || (e.active = 0), this._processPanels(), e.active < 0 && (e.active += this.headers.length), this._refresh()
        },
        _getCreateEventData: function() {
            return {
                header: this.active,
                panel: this.active.length ? this.active.next() : l()
            }
        },
        _createIcons: function() {
            var e, t, i = this.options.icons;
            i && (e = l("<span>"), this._addClass(e, "ui-accordion-header-icon", "ui-icon " + i.header), e.prependTo(this.headers), t = this.active.children(".ui-accordion-header-icon"), this._removeClass(t, i.header)._addClass(t, null, i.activeHeader)._addClass(this.headers, "ui-accordion-icons"))
        },
        _destroyIcons: function() {
            this._removeClass(this.headers, "ui-accordion-icons"), this.headers.children(".ui-accordion-header-icon").remove()
        },
        _destroy: function() {
            var e;
            this.element.removeAttr("role"), this.headers.removeAttr("role aria-expanded aria-selected aria-controls tabIndex").removeUniqueId(), this._destroyIcons(), e = this.headers.next().css("display", "").removeAttr("role aria-hidden aria-labelledby").removeUniqueId(), "content" !== this.options.heightStyle && e.css("height", "")
        },
        _setOption: function(e, t) {
            "active" !== e ? ("event" === e && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(t)), this._super(e, t), "collapsible" !== e || t || !1 !== this.options.active || this._activate(0), "icons" === e && (this._destroyIcons(), t && this._createIcons())) : this._activate(t)
        },
        _setOptionDisabled: function(e) {
            this._super(e), this.element.attr("aria-disabled", e), this._toggleClass(null, "ui-state-disabled", !!e), this._toggleClass(this.headers.add(this.headers.next()), null, "ui-state-disabled", !!e)
        },
        _keydown: function(e) {
            if (!e.altKey && !e.ctrlKey) {
                var t = l.ui.keyCode,
                    i = this.headers.length,
                    a = this.headers.index(e.target),
                    s = !1;
                switch (e.keyCode) {
                    case t.RIGHT:
                    case t.DOWN:
                        s = this.headers[(a + 1) % i];
                        break;
                    case t.LEFT:
                    case t.UP:
                        s = this.headers[(a - 1 + i) % i];
                        break;
                    case t.SPACE:
                    case t.ENTER:
                        this._eventHandler(e);
                        break;
                    case t.HOME:
                        s = this.headers[0];
                        break;
                    case t.END:
                        s = this.headers[i - 1]
                }
                s && (l(e.target).attr("tabIndex", -1), l(s).attr("tabIndex", 0), l(s).trigger("focus"), e.preventDefault())
            }
        },
        _panelKeyDown: function(e) {
            e.keyCode === l.ui.keyCode.UP && e.ctrlKey && l(e.currentTarget).prev().trigger("focus")
        },
        refresh: function() {
            var e = this.options;
            this._processPanels(), !1 === e.active && !0 === e.collapsible || !this.headers.length ? (e.active = !1, this.active = l()) : !1 === e.active ? this._activate(0) : this.active.length && !l.contains(this.element[0], this.active[0]) ? this.headers.length === this.headers.find(".ui-state-disabled").length ? (e.active = !1, this.active = l()) : this._activate(Math.max(0, e.active - 1)) : e.active = this.headers.index(this.active), this._destroyIcons(), this._refresh()
        },
        _processPanels: function() {
            var e = this.headers,
                t = this.panels;
            this.headers = this.element.find(this.options.header), this._addClass(this.headers, "ui-accordion-header ui-accordion-header-collapsed", "ui-state-default"), this.panels = this.headers.next().filter(":not(.ui-accordion-content-active)").hide(), this._addClass(this.panels, "ui-accordion-content", "ui-helper-reset ui-widget-content"), t && (this._off(e.not(this.headers)), this._off(t.not(this.panels)))
        },
        _refresh: function() {
            var i, e = this.options,
                t = e.heightStyle,
                a = this.element.parent();
            this.active = this._findActive(e.active), this._addClass(this.active, "ui-accordion-header-active", "ui-state-active")._removeClass(this.active, "ui-accordion-header-collapsed"), this._addClass(this.active.next(), "ui-accordion-content-active"), this.active.next().show(), this.headers.attr("role", "tab").each(function() {
                var e = l(this),
                    t = e.uniqueId().attr("id"),
                    i = e.next(),
                    a = i.uniqueId().attr("id");
                e.attr("aria-controls", a), i.attr("aria-labelledby", t)
            }).next().attr("role", "tabpanel"), this.headers.not(this.active).attr({
                "aria-selected": "false",
                "aria-expanded": "false",
                tabIndex: -1
            }).next().attr({
                "aria-hidden": "true"
            }).hide(), this.active.length ? this.active.attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            }).next().attr({
                "aria-hidden": "false"
            }) : this.headers.eq(0).attr("tabIndex", 0), this._createIcons(), this._setupEvents(e.event), "fill" === t ? (i = a.height(), this.element.siblings(":visible").each(function() {
                var e = l(this),
                    t = e.css("position");
                "absolute" !== t && "fixed" !== t && (i -= e.outerHeight(!0))
            }), this.headers.each(function() {
                i -= l(this).outerHeight(!0)
            }), this.headers.next().each(function() {
                l(this).height(Math.max(0, i - l(this).innerHeight() + l(this).height()))
            }).css("overflow", "auto")) : "auto" === t && (i = 0, this.headers.next().each(function() {
                var e = l(this).is(":visible");
                e || l(this).show(), i = Math.max(i, l(this).css("height", "").height()), e || l(this).hide()
            }).height(i))
        },
        _activate: function(e) {
            var t = this._findActive(e)[0];
            t !== this.active[0] && (t = t || this.active[0], this._eventHandler({
                target: t,
                currentTarget: t,
                preventDefault: l.noop
            }))
        },
        _findActive: function(e) {
            return "number" == typeof e ? this.headers.eq(e) : l()
        },
        _setupEvents: function(e) {
            var i = {
                keydown: "_keydown"
            };
            e && l.each(e.split(" "), function(e, t) {
                i[t] = "_eventHandler"
            }), this._off(this.headers.add(this.headers.next())), this._on(this.headers, i), this._on(this.headers.next(), {
                keydown: "_panelKeyDown"
            }), this._hoverable(this.headers), this._focusable(this.headers)
        },
        _eventHandler: function(e) {
            var t, i, a = this.options,
                s = this.active,
                n = l(e.currentTarget),
                h = n[0] === s[0],
                r = h && a.collapsible,
                o = r ? l() : n.next(),
                d = s.next(),
                c = {
                    oldHeader: s,
                    oldPanel: d,
                    newHeader: r ? l() : n,
                    newPanel: o
                };
            e.preventDefault(), h && !a.collapsible || !1 === this._trigger("beforeActivate", e, c) || (a.active = !r && this.headers.index(n), this.active = h ? l() : n, this._toggle(c), this._removeClass(s, "ui-accordion-header-active", "ui-state-active"), a.icons && (t = s.children(".ui-accordion-header-icon"), this._removeClass(t, null, a.icons.activeHeader)._addClass(t, null, a.icons.header)), h || (this._removeClass(n, "ui-accordion-header-collapsed")._addClass(n, "ui-accordion-header-active", "ui-state-active"), a.icons && (i = n.children(".ui-accordion-header-icon"), this._removeClass(i, null, a.icons.header)._addClass(i, null, a.icons.activeHeader)), this._addClass(n.next(), "ui-accordion-content-active")))
        },
        _toggle: function(e) {
            var t = e.newPanel,
                i = this.prevShow.length ? this.prevShow : e.oldPanel;
            this.prevShow.add(this.prevHide).stop(!0, !0), this.prevShow = t, this.prevHide = i, this.options.animate ? this._animate(t, i, e) : (i.hide(), t.show(), this._toggleComplete(e)), i.attr({
                "aria-hidden": "true"
            }), i.prev().attr({
                "aria-selected": "false",
                "aria-expanded": "false"
            }), t.length && i.length ? i.prev().attr({
                tabIndex: -1,
                "aria-expanded": "false"
            }) : t.length && this.headers.filter(function() {
                return 0 === parseInt(l(this).attr("tabIndex"), 10)
            }).attr("tabIndex", -1), t.attr("aria-hidden", "false").prev().attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            })
        },
        _animate: function(e, i, t) {
            function a() {
                r._toggleComplete(t)
            }
            var s, n, h, r = this,
                o = 0,
                d = e.css("box-sizing"),
                c = e.length && (!i.length || e.index() < i.index()),
                l = this.options.animate || {},
                u = c && l.down || l;
            return "number" == typeof u && (h = u), "string" == typeof u && (n = u), n = n || u.easing || l.easing, h = h || u.duration || l.duration, i.length ? e.length ? (s = e.show().outerHeight(), i.animate(this.hideProps, {
                duration: h,
                easing: n,
                step: function(e, t) {
                    t.now = Math.round(e)
                }
            }), void e.hide().animate(this.showProps, {
                duration: h,
                easing: n,
                complete: a,
                step: function(e, t) {
                    t.now = Math.round(e), "height" !== t.prop ? "content-box" === d && (o += t.now) : "content" !== r.options.heightStyle && (t.now = Math.round(s - i.outerHeight() - o), o = 0)
                }
            })) : i.animate(this.hideProps, h, n, a) : e.animate(this.showProps, h, n, a)
        },
        _toggleComplete: function(e) {
            var t = e.oldPanel,
                i = t.prev();
            this._removeClass(t, "ui-accordion-content-active"), this._removeClass(i, "ui-accordion-header-active")._addClass(i, "ui-accordion-header-collapsed"), t.length && (t.parent()[0].className = t.parent()[0].className), this._trigger("activate", null, e)
        }
    })
});