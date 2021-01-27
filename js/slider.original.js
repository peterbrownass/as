/*!
 * jQuery UI Slider 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery", "./mouse", "./core"], e) : e(jQuery)
}(function(o) {
    return o.widget("ui.slider", o.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "slide",
        options: {
            animate: !1,
            classes: {
                "ui-slider": "ui-corner-all",
                "ui-slider-handle": "ui-corner-all",
                "ui-slider-range": "ui-corner-all ui-widget-header"
            },
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: !1,
            step: 1,
            value: 0,
            values: null,
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        numPages: 5,
        _create: function() {
            this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this._calculateNewMax(), this._addClass("ui-slider ui-slider-" + this.orientation, "ui-widget ui-widget-content"), this._refresh(), this._animateOff = !1
        },
        _refresh: function() {
            this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue()
        },
        _createHandles: function() {
            var e, t, i = this.options,
                s = this.element.find(".ui-slider-handle"),
                a = [];
            for (t = i.values && i.values.length || 1, s.length > t && (s.slice(t).remove(), s = s.slice(0, t)), e = s.length; e < t; e++) a.push("<span tabindex='0'></span>");
            this.handles = s.add(o(a.join("")).appendTo(this.element)), this._addClass(this.handles, "ui-slider-handle", "ui-state-default"), this.handle = this.handles.eq(0), this.handles.each(function(e) {
                o(this).data("ui-slider-handle-index", e).attr("tabIndex", 0)
            })
        },
        _createRange: function() {
            var e = this.options;
            e.range ? (!0 === e.range && (e.values ? e.values.length && 2 !== e.values.length ? e.values = [e.values[0], e.values[0]] : o.isArray(e.values) && (e.values = e.values.slice(0)) : e.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? (this._removeClass(this.range, "ui-slider-range-min ui-slider-range-max"), this.range.css({
                left: "",
                bottom: ""
            })) : (this.range = o("<div>").appendTo(this.element), this._addClass(this.range, "ui-slider-range")), "min" !== e.range && "max" !== e.range || this._addClass(this.range, "ui-slider-range-" + e.range)) : (this.range && this.range.remove(), this.range = null)
        },
        _setupEvents: function() {
            this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles)
        },
        _destroy: function() {
            this.handles.remove(), this.range && this.range.remove(), this._mouseDestroy()
        },
        _mouseCapture: function(e) {
            var t, i, s, a, n, h, l, u = this,
                r = this.options;
            return !r.disabled && (this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            }, this.elementOffset = this.element.offset(), t = {
                x: e.pageX,
                y: e.pageY
            }, i = this._normValueFromMouse(t), s = this._valueMax() - this._valueMin() + 1, this.handles.each(function(e) {
                var t = Math.abs(i - u.values(e));
                (t < s || s === t && (e === u._lastChangedValue || u.values(e) === r.min)) && (s = t, a = o(this), n = e)
            }), !1 !== this._start(e, n) && (this._mouseSliding = !0, this._handleIndex = n, this._addClass(a, null, "ui-state-active"), a.trigger("focus"), h = a.offset(), l = !o(e.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = l ? {
                left: 0,
                top: 0
            } : {
                left: e.pageX - h.left - a.width() / 2,
                top: e.pageY - h.top - a.height() / 2 - (parseInt(a.css("borderTopWidth"), 10) || 0) - (parseInt(a.css("borderBottomWidth"), 10) || 0) + (parseInt(a.css("marginTop"), 10) || 0)
            }, this.handles.hasClass("ui-state-hover") || this._slide(e, n, i), this._animateOff = !0))
        },
        _mouseStart: function() {
            return !0
        },
        _mouseDrag: function(e) {
            var t = {
                    x: e.pageX,
                    y: e.pageY
                },
                i = this._normValueFromMouse(t);
            return this._slide(e, this._handleIndex, i), !1
        },
        _mouseStop: function(e) {
            return this._removeClass(this.handles, null, "ui-state-active"), this._mouseSliding = !1, this._stop(e, this._handleIndex), this._change(e, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1
        },
        _detectOrientation: function() {
            this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function(e) {
            var t, i, s, a;
            return 1 < (i = ("horizontal" === this.orientation ? (t = this.elementSize.width, e.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (t = this.elementSize.height, e.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0))) / t) && (i = 1), i < 0 && (i = 0), "vertical" === this.orientation && (i = 1 - i), s = this._valueMax() - this._valueMin(), a = this._valueMin() + i * s, this._trimAlignValue(a)
        },
        _uiHash: function(e, t, i) {
            var s = {
                handle: this.handles[e],
                handleIndex: e,
                value: void 0 !== t ? t : this.value()
            };
            return this._hasMultipleValues() && (s.value = void 0 !== t ? t : this.values(e), s.values = i || this.values()), s
        },
        _hasMultipleValues: function() {
            return this.options.values && this.options.values.length
        },
        _start: function(e, t) {
            return this._trigger("start", e, this._uiHash(t))
        },
        _slide: function(e, t, i) {
            var s, a = this.value(),
                n = this.values();
            this._hasMultipleValues() && (s = this.values(t ? 0 : 1), a = this.values(t), 2 === this.options.values.length && !0 === this.options.range && (i = 0 === t ? Math.min(s, i) : Math.max(s, i)), n[t] = i), i !== a && !1 !== this._trigger("slide", e, this._uiHash(t, i, n)) && (this._hasMultipleValues() ? this.values(t, i) : this.value(i))
        },
        _stop: function(e, t) {
            this._trigger("stop", e, this._uiHash(t))
        },
        _change: function(e, t) {
            this._keySliding || this._mouseSliding || (this._lastChangedValue = t, this._trigger("change", e, this._uiHash(t)))
        },
        value: function(e) {
            return arguments.length ? (this.options.value = this._trimAlignValue(e), this._refreshValue(), void this._change(null, 0)) : this._value()
        },
        values: function(e, t) {
            var i, s, a;
            if (1 < arguments.length) return this.options.values[e] = this._trimAlignValue(t), this._refreshValue(), void this._change(null, e);
            if (!arguments.length) return this._values();
            if (!o.isArray(e)) return this._hasMultipleValues() ? this._values(e) : this.value();
            for (i = this.options.values, s = e, a = 0; a < i.length; a += 1) i[a] = this._trimAlignValue(s[a]), this._change(null, a);
            this._refreshValue()
        },
        _setOption: function(e, t) {
            var i, s = 0;
            switch ("range" === e && !0 === this.options.range && ("min" === t ? (this.options.value = this._values(0), this.options.values = null) : "max" === t && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), o.isArray(this.options.values) && (s = this.options.values.length), this._super(e, t), e) {
                case "orientation":
                    this._detectOrientation(), this._removeClass("ui-slider-horizontal ui-slider-vertical")._addClass("ui-slider-" + this.orientation), this._refreshValue(), this.options.range && this._refreshRange(t), this.handles.css("horizontal" === t ? "bottom" : "left", "");
                    break;
                case "value":
                    this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                    break;
                case "values":
                    for (this._animateOff = !0, this._refreshValue(), i = s - 1; 0 <= i; i--) this._change(null, i);
                    this._animateOff = !1;
                    break;
                case "step":
                case "min":
                case "max":
                    this._animateOff = !0, this._calculateNewMax(), this._refreshValue(), this._animateOff = !1;
                    break;
                case "range":
                    this._animateOff = !0, this._refresh(), this._animateOff = !1
            }
        },
        _setOptionDisabled: function(e) {
            this._super(e), this._toggleClass(null, "ui-state-disabled", !!e)
        },
        _value: function() {
            var e = this.options.value;
            return e = this._trimAlignValue(e)
        },
        _values: function(e) {
            var t, i, s;
            if (arguments.length) return t = this.options.values[e], t = this._trimAlignValue(t);
            if (this._hasMultipleValues()) {
                for (i = this.options.values.slice(), s = 0; s < i.length; s += 1) i[s] = this._trimAlignValue(i[s]);
                return i
            }
            return []
        },
        _trimAlignValue: function(e) {
            if (e <= this._valueMin()) return this._valueMin();
            if (e >= this._valueMax()) return this._valueMax();
            var t = 0 < this.options.step ? this.options.step : 1,
                i = (e - this._valueMin()) % t,
                s = e - i;
            return 2 * Math.abs(i) >= t && (s += 0 < i ? t : -t), parseFloat(s.toFixed(5))
        },
        _calculateNewMax: function() {
            var e = this.options.max,
                t = this._valueMin(),
                i = this.options.step;
            (e = Math.round((e - t) / i) * i + t) > this.options.max && (e -= i), this.max = parseFloat(e.toFixed(this._precision()))
        },
        _precision: function() {
            var e = this._precisionOf(this.options.step);
            return null !== this.options.min && (e = Math.max(e, this._precisionOf(this.options.min))), e
        },
        _precisionOf: function(e) {
            var t = e.toString(),
                i = t.indexOf(".");
            return -1 === i ? 0 : t.length - i - 1
        },
        _valueMin: function() {
            return this.options.min
        },
        _valueMax: function() {
            return this.max
        },
        _refreshRange: function(e) {
            "vertical" === e && this.range.css({
                width: "",
                left: ""
            }), "horizontal" === e && this.range.css({
                height: "",
                bottom: ""
            })
        },
        _refreshValue: function() {
            var t, i, e, s, a, n = this.options.range,
                h = this.options,
                l = this,
                u = !this._animateOff && h.animate,
                r = {};
            this._hasMultipleValues() ? this.handles.each(function(e) {
                i = (l.values(e) - l._valueMin()) / (l._valueMax() - l._valueMin()) * 100, r["horizontal" === l.orientation ? "left" : "bottom"] = i + "%", o(this).stop(1, 1)[u ? "animate" : "css"](r, h.animate), !0 === l.options.range && ("horizontal" === l.orientation ? (0 === e && l.range.stop(1, 1)[u ? "animate" : "css"]({
                    left: i + "%"
                }, h.animate), 1 === e && l.range[u ? "animate" : "css"]({
                    width: i - t + "%"
                }, {
                    queue: !1,
                    duration: h.animate
                })) : (0 === e && l.range.stop(1, 1)[u ? "animate" : "css"]({
                    bottom: i + "%"
                }, h.animate), 1 === e && l.range[u ? "animate" : "css"]({
                    height: i - t + "%"
                }, {
                    queue: !1,
                    duration: h.animate
                }))), t = i
            }) : (e = this.value(), s = this._valueMin(), a = this._valueMax(), i = a !== s ? (e - s) / (a - s) * 100 : 0, r["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[u ? "animate" : "css"](r, h.animate), "min" === n && "horizontal" === this.orientation && this.range.stop(1, 1)[u ? "animate" : "css"]({
                width: i + "%"
            }, h.animate), "max" === n && "horizontal" === this.orientation && this.range.stop(1, 1)[u ? "animate" : "css"]({
                width: 100 - i + "%"
            }, h.animate), "min" === n && "vertical" === this.orientation && this.range.stop(1, 1)[u ? "animate" : "css"]({
                height: i + "%"
            }, h.animate), "max" === n && "vertical" === this.orientation && this.range.stop(1, 1)[u ? "animate" : "css"]({
                height: 100 - i + "%"
            }, h.animate))
        },
        _handleEvents: {
            keydown: function(e) {
                var t, i, s, a = o(e.target).data("ui-slider-handle-index");
                switch (e.keyCode) {
                    case o.ui.keyCode.HOME:
                    case o.ui.keyCode.END:
                    case o.ui.keyCode.PAGE_UP:
                    case o.ui.keyCode.PAGE_DOWN:
                    case o.ui.keyCode.UP:
                    case o.ui.keyCode.RIGHT:
                    case o.ui.keyCode.DOWN:
                    case o.ui.keyCode.LEFT:
                        if (e.preventDefault(), !this._keySliding && (this._keySliding = !0, this._addClass(o(e.target), null, "ui-state-active"), !1 === this._start(e, a))) return
                }
                switch (s = this.options.step, t = i = this._hasMultipleValues() ? this.values(a) : this.value(), e.keyCode) {
                    case o.ui.keyCode.HOME:
                        i = this._valueMin();
                        break;
                    case o.ui.keyCode.END:
                        i = this._valueMax();
                        break;
                    case o.ui.keyCode.PAGE_UP:
                        i = this._trimAlignValue(t + (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case o.ui.keyCode.PAGE_DOWN:
                        i = this._trimAlignValue(t - (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case o.ui.keyCode.UP:
                    case o.ui.keyCode.RIGHT:
                        if (t === this._valueMax()) return;
                        i = this._trimAlignValue(t + s);
                        break;
                    case o.ui.keyCode.DOWN:
                    case o.ui.keyCode.LEFT:
                        if (t === this._valueMin()) return;
                        i = this._trimAlignValue(t - s)
                }
                this._slide(e, a, i)
            },
            keyup: function(e) {
                var t = o(e.target).data("ui-slider-handle-index");
                this._keySliding && (this._keySliding = !1, this._stop(e, t), this._change(e, t), this._removeClass(o(e.target), null, "ui-state-active"))
            }
        }
    })
});