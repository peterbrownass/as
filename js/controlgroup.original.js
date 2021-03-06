/*!
 * jQuery UI Controlgroup 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
! function(t) {
    "function" == typeof define && define.amd ? define(["jquery", "./core"], t) : t(jQuery)
}(function(u) {
    var s = /ui-corner-([a-z]){2,6}/g;
    return u.widget("ui.controlgroup", {
        version: "1.12.1",
        defaultElement: "<div>",
        options: {
            direction: "horizontal",
            disabled: null,
            onlyVisible: !0,
            items: {
                button: "input[type=button], input[type=submit], input[type=reset], button, a",
                controlgroupLabel: ".ui-controlgroup-label",
                checkboxradio: "input[type='checkbox'], input[type='radio']",
                selectmenu: "select",
                spinner: ".ui-spinner-input"
            }
        },
        _create: function() {
            this._enhance()
        },
        _enhance: function() {
            this.element.attr("role", "toolbar"), this.refresh()
        },
        _destroy: function() {
            this._callChildMethod("destroy"), this.childWidgets.removeData("ui-controlgroup-data"), this.element.removeAttr("role"), this.options.items.controlgroupLabel && this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap()
        },
        _initWidgets: function() {
            var l = this,
                r = [];
            u.each(this.options.items, function(o, t) {
                var e, s = {};
                if (t) return "controlgroupLabel" === o ? ((e = l.element.find(t)).each(function() {
                    var t = u(this);
                    t.children(".ui-controlgroup-label-contents").length || t.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>")
                }), l._addClass(e, null, "ui-widget ui-widget-content ui-state-default"), void(r = r.concat(e.get()))) : void(u.fn[o] && (s = l["_" + o + "Options"] ? l["_" + o + "Options"]("middle") : {
                    classes: {}
                }, l.element.find(t).each(function() {
                    var t = u(this),
                        e = t[o]("instance"),
                        i = u.widget.extend({}, s);
                    if ("button" !== o || !t.parent(".ui-spinner").length) {
                        (e = e || t[o]()[o]("instance")) && (i.classes = l._resolveClassesValues(i.classes, e)), t[o](i);
                        var n = t[o]("widget");
                        u.data(n[0], "ui-controlgroup-data", e || t[o]("instance")), r.push(n[0])
                    }
                })))
            }), this.childWidgets = u(u.unique(r)), this._addClass(this.childWidgets, "ui-controlgroup-item")
        },
        _callChildMethod: function(e) {
            this.childWidgets.each(function() {
                var t = u(this).data("ui-controlgroup-data");
                t && t[e] && t[e]()
            })
        },
        _updateCornerClass: function(t, e) {
            var i = this._buildSimpleOptions(e, "label").classes.label;
            this._removeClass(t, null, "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all"), this._addClass(t, null, i)
        },
        _buildSimpleOptions: function(t, e) {
            var i = "vertical" === this.options.direction,
                n = {
                    classes: {}
                };
            return n.classes[e] = {
                middle: "",
                first: "ui-corner-" + (i ? "top" : "left"),
                last: "ui-corner-" + (i ? "bottom" : "right"),
                only: "ui-corner-all"
            } [t], n
        },
        _spinnerOptions: function(t) {
            var e = this._buildSimpleOptions(t, "ui-spinner");
            return e.classes["ui-spinner-up"] = "", e.classes["ui-spinner-down"] = "", e
        },
        _buttonOptions: function(t) {
            return this._buildSimpleOptions(t, "ui-button")
        },
        _checkboxradioOptions: function(t) {
            return this._buildSimpleOptions(t, "ui-checkboxradio-label")
        },
        _selectmenuOptions: function(t) {
            var e = "vertical" === this.options.direction;
            return {
                width: e && "auto",
                classes: {
                    middle: {
                        "ui-selectmenu-button-open": "",
                        "ui-selectmenu-button-closed": ""
                    },
                    first: {
                        "ui-selectmenu-button-open": "ui-corner-" + (e ? "top" : "tl"),
                        "ui-selectmenu-button-closed": "ui-corner-" + (e ? "top" : "left")
                    },
                    last: {
                        "ui-selectmenu-button-open": e ? "" : "ui-corner-tr",
                        "ui-selectmenu-button-closed": "ui-corner-" + (e ? "bottom" : "right")
                    },
                    only: {
                        "ui-selectmenu-button-open": "ui-corner-top",
                        "ui-selectmenu-button-closed": "ui-corner-all"
                    }
                } [t]
            }
        },
        _resolveClassesValues: function(i, n) {
            var o = {};
            return u.each(i, function(t) {
                var e = n.options.classes[t] || "";
                e = u.trim(e.replace(s, "")), o[t] = (e + " " + i[t]).replace(/\s+/g, " ")
            }), o
        },
        _setOption: function(t, e) {
            "direction" === t && this._removeClass("ui-controlgroup-" + this.options.direction), this._super(t, e), "disabled" !== t ? this.refresh() : this._callChildMethod(e ? "disable" : "enable")
        },
        refresh: function() {
            var o, s = this;
            this._addClass("ui-controlgroup ui-controlgroup-" + this.options.direction), "horizontal" === this.options.direction && this._addClass(null, "ui-helper-clearfix"), this._initWidgets(), o = this.childWidgets, this.options.onlyVisible && (o = o.filter(":visible")), o.length && (u.each(["first", "last"], function(t, e) {
                var i = o[e]().data("ui-controlgroup-data");
                if (i && s["_" + i.widgetName + "Options"]) {
                    var n = s["_" + i.widgetName + "Options"](1 === o.length ? "only" : e);
                    n.classes = s._resolveClassesValues(n.classes, i), i.element[i.widgetName](n)
                } else s._updateCornerClass(o[e](), e)
            }), this._callChildMethod("refresh"))
        }
    })
});