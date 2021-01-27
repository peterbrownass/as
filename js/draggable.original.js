/*!
 * jQuery UI Draggable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
! function(t) {
    "function" == typeof define && define.amd ? define(["jquery", "./mouse", "./core"], t) : t(jQuery)
}(function(P) {
    return P.widget("ui.draggable", P.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this._addClass("ui-draggable"), this._setHandleClassName(), this._mouseInit()
        },
        _setOption: function(t, e) {
            this._super(t, e), "handle" === t && (this._removeHandleClassName(), this._setHandleClassName())
        },
        _destroy: function() {
            (this.helper || this.element).is(".ui-draggable-dragging") ? this.destroyOnClear = !0 : (this._removeHandleClassName(), this._mouseDestroy())
        },
        _mouseCapture: function(t) {
            var e = this.options;
            return !(this.helper || e.disabled || 0 < P(t.target).closest(".ui-resizable-handle").length) && (this.handle = this._getHandle(t), !!this.handle && (this._blurActiveElement(t), this._blockFrames(!0 === e.iframeFix ? "iframe" : e.iframeFix), !0))
        },
        _blockFrames: function(t) {
            this.iframeBlocks = this.document.find(t).map(function() {
                var t = P(this);
                return P("<div>").css("position", "absolute").appendTo(t.parent()).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()).offset(t.offset())[0]
            })
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
        },
        _blurActiveElement: function(t) {
            var e = P.ui.safeActiveElement(this.document[0]);
            P(t.target).closest(e).length || P.ui.safeBlur(e)
        },
        _mouseStart: function(t) {
            var e = this.options;
            return this.helper = this._createHelper(t), this._addClass(this.helper, "ui-draggable-dragging"), this._cacheHelperProportions(), P.ui.ddmanager && (P.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = 0 < this.helper.parents().filter(function() {
                return "fixed" === P(this).css("position")
            }).length, this.positionAbs = this.element.offset(), this._refreshOffsets(t), this.originalPosition = this.position = this._generatePosition(t, !1), this.originalPageX = t.pageX, this.originalPageY = t.pageY, e.cursorAt && this._adjustOffsetFromHelper(e.cursorAt), this._setContainment(), !1 === this._trigger("start", t) ? (this._clear(), !1) : (this._cacheHelperProportions(), P.ui.ddmanager && !e.dropBehaviour && P.ui.ddmanager.prepareOffsets(this, t), this._mouseDrag(t, !0), P.ui.ddmanager && P.ui.ddmanager.dragStart(this, t), !0)
        },
        _refreshOffsets: function(t) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }, this.offset.click = {
                left: t.pageX - this.offset.left,
                top: t.pageY - this.offset.top
            }
        },
        _mouseDrag: function(t, e) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(t, !0), this.positionAbs = this._convertPositionTo("absolute"), !e) {
                var s = this._uiHash();
                if (!1 === this._trigger("drag", t, s)) return this._mouseUp(new P.Event("mouseup", t)), !1;
                this.position = s.position
            }
            return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", P.ui.ddmanager && P.ui.ddmanager.drag(this, t), !1
        },
        _mouseStop: function(t) {
            var e = this,
                s = !1;
            return P.ui.ddmanager && !this.options.dropBehaviour && (s = P.ui.ddmanager.drop(this, t)), this.dropped && (s = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !s || "valid" === this.options.revert && s || !0 === this.options.revert || P.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? P(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                !1 !== e._trigger("stop", t) && e._clear()
            }) : !1 !== this._trigger("stop", t) && this._clear(), !1
        },
        _mouseUp: function(t) {
            return this._unblockFrames(), P.ui.ddmanager && P.ui.ddmanager.dragStop(this, t), this.handleElement.is(t.target) && this.element.trigger("focus"), P.ui.mouse.prototype._mouseUp.call(this, t)
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new P.Event("mouseup", {
                target: this.element[0]
            })) : this._clear(), this
        },
        _getHandle: function(t) {
            return !this.options.handle || !!P(t.target).closest(this.element.find(this.options.handle)).length
        },
        _setHandleClassName: function() {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this._addClass(this.handleElement, "ui-draggable-handle")
        },
        _removeHandleClassName: function() {
            this._removeClass(this.handleElement, "ui-draggable-handle")
        },
        _createHelper: function(t) {
            var e = this.options,
                s = P.isFunction(e.helper),
                i = s ? P(e.helper.apply(this.element[0], [t])) : "clone" === e.helper ? this.element.clone().removeAttr("id") : this.element;
            return i.parents("body").length || i.appendTo("parent" === e.appendTo ? this.element[0].parentNode : e.appendTo), s && i[0] === this.element[0] && this._setPositionRelative(), i[0] === this.element[0] || /(fixed|absolute)/.test(i.css("position")) || i.css("position", "absolute"), i
        },
        _setPositionRelative: function() {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
        },
        _adjustOffsetFromHelper: function(t) {
            "string" == typeof t && (t = t.split(" ")), P.isArray(t) && (t = {
                left: +t[0],
                top: +t[1] || 0
            }), "left" in t && (this.offset.click.left = t.left + this.margins.left), "right" in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top" in t && (this.offset.click.top = t.top + this.margins.top), "bottom" in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _isRootNode: function(t) {
            return /(html|body)/i.test(t.tagName) || t === this.document[0]
        },
        _getParentOffset: function() {
            var t = this.offsetParent.offset(),
                e = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== e && P.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (t = {
                top: 0,
                left: 0
            }), {
                top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if ("relative" !== this.cssPosition) return {
                top: 0,
                left: 0
            };
            var t = this.element.position(),
                e = this._isRootNode(this.scrollParent[0]);
            return {
                top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + (e ? 0 : this.scrollParent.scrollTop()),
                left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + (e ? 0 : this.scrollParent.scrollLeft())
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var t, e, s, i = this.options,
                o = this.document[0];
            this.relativeContainer = null, i.containment ? "window" !== i.containment ? "document" !== i.containment ? i.containment.constructor !== Array ? ("parent" === i.containment && (i.containment = this.helper[0].parentNode), (s = (e = P(i.containment))[0]) && (t = /(scroll|auto)/.test(e.css("overflow")), this.containment = [(parseInt(e.css("borderLeftWidth"), 10) || 0) + (parseInt(e.css("paddingLeft"), 10) || 0), (parseInt(e.css("borderTopWidth"), 10) || 0) + (parseInt(e.css("paddingTop"), 10) || 0), (t ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(e.css("borderRightWidth"), 10) || 0) - (parseInt(e.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (t ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(e.css("borderBottomWidth"), 10) || 0) - (parseInt(e.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = e)) : this.containment = i.containment : this.containment = [0, 0, P(o).width() - this.helperProportions.width - this.margins.left, (P(o).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top] : this.containment = [P(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, P(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, P(window).scrollLeft() + P(window).width() - this.helperProportions.width - this.margins.left, P(window).scrollTop() + (P(window).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top] : this.containment = null
        },
        _convertPositionTo: function(t, e) {
            e = e || this.position;
            var s = "absolute" === t ? 1 : -1,
                i = this._isRootNode(this.scrollParent[0]);
            return {
                top: e.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.offset.scroll.top : i ? 0 : this.offset.scroll.top) * s,
                left: e.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.offset.scroll.left : i ? 0 : this.offset.scroll.left) * s
            }
        },
        _generatePosition: function(t, e) {
            var s, i, o, n, r = this.options,
                l = this._isRootNode(this.scrollParent[0]),
                a = t.pageX,
                h = t.pageY;
            return l && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }), e && (this.containment && (s = this.relativeContainer ? (i = this.relativeContainer.offset(), [this.containment[0] + i.left, this.containment[1] + i.top, this.containment[2] + i.left, this.containment[3] + i.top]) : this.containment, t.pageX - this.offset.click.left < s[0] && (a = s[0] + this.offset.click.left), t.pageY - this.offset.click.top < s[1] && (h = s[1] + this.offset.click.top), t.pageX - this.offset.click.left > s[2] && (a = s[2] + this.offset.click.left), t.pageY - this.offset.click.top > s[3] && (h = s[3] + this.offset.click.top)), r.grid && (o = r.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / r.grid[1]) * r.grid[1] : this.originalPageY, h = s ? o - this.offset.click.top >= s[1] || o - this.offset.click.top > s[3] ? o : o - this.offset.click.top >= s[1] ? o - r.grid[1] : o + r.grid[1] : o, n = r.grid[0] ? this.originalPageX + Math.round((a - this.originalPageX) / r.grid[0]) * r.grid[0] : this.originalPageX, a = s ? n - this.offset.click.left >= s[0] || n - this.offset.click.left > s[2] ? n : n - this.offset.click.left >= s[0] ? n - r.grid[0] : n + r.grid[0] : n), "y" === r.axis && (a = this.originalPageX), "x" === r.axis && (h = this.originalPageY)), {
                top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : l ? 0 : this.offset.scroll.top),
                left: a - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : l ? 0 : this.offset.scroll.left)
            }
        },
        _clear: function() {
            this._removeClass(this.helper, "ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
        },
        _trigger: function(t, e, s) {
            return s = s || this._uiHash(), P.ui.plugin.call(this, t, [e, s, this], !0), /^(drag|start|stop)/.test(t) && (this.positionAbs = this._convertPositionTo("absolute"), s.offset = this.positionAbs), P.Widget.prototype._trigger.call(this, t, e, s)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }), P.ui.plugin.add("draggable", "connectToSortable", {
        start: function(e, t, s) {
            var i = P.extend({}, t, {
                item: s.element
            });
            s.sortables = [], P(s.options.connectToSortable).each(function() {
                var t = P(this).sortable("instance");
                t && !t.options.disabled && (s.sortables.push(t), t.refreshPositions(), t._trigger("activate", e, i))
            })
        },
        stop: function(e, t, s) {
            var i = P.extend({}, t, {
                item: s.element
            });
            s.cancelHelperRemoval = !1, P.each(s.sortables, function() {
                var t = this;
                t.isOver ? (t.isOver = 0, s.cancelHelperRemoval = !0, t.cancelHelperRemoval = !1, t._storedCSS = {
                    position: t.placeholder.css("position"),
                    top: t.placeholder.css("top"),
                    left: t.placeholder.css("left")
                }, t._mouseStop(e), t.options.helper = t.options._helper) : (t.cancelHelperRemoval = !0, t._trigger("deactivate", e, i))
            })
        },
        drag: function(s, i, o) {
            P.each(o.sortables, function() {
                var t = !1,
                    e = this;
                e.positionAbs = o.positionAbs, e.helperProportions = o.helperProportions, e.offset.click = o.offset.click, e._intersectsWith(e.containerCache) && (t = !0, P.each(o.sortables, function() {
                    return this.positionAbs = o.positionAbs, this.helperProportions = o.helperProportions, this.offset.click = o.offset.click, this !== e && this._intersectsWith(this.containerCache) && P.contains(e.element[0], this.element[0]) && (t = !1), t
                })), t ? (e.isOver || (e.isOver = 1, o._parent = i.helper.parent(), e.currentItem = i.helper.appendTo(e.element).data("ui-sortable-item", !0), e.options._helper = e.options.helper, e.options.helper = function() {
                    return i.helper[0]
                }, s.target = e.currentItem[0], e._mouseCapture(s, !0), e._mouseStart(s, !0, !0), e.offset.click.top = o.offset.click.top, e.offset.click.left = o.offset.click.left, e.offset.parent.left -= o.offset.parent.left - e.offset.parent.left, e.offset.parent.top -= o.offset.parent.top - e.offset.parent.top, o._trigger("toSortable", s), o.dropped = e.element, P.each(o.sortables, function() {
                    this.refreshPositions()
                }), o.currentItem = o.element, e.fromOutside = o), e.currentItem && (e._mouseDrag(s), i.position = e.position)) : e.isOver && (e.isOver = 0, e.cancelHelperRemoval = !0, e.options._revert = e.options.revert, e.options.revert = !1, e._trigger("out", s, e._uiHash(e)), e._mouseStop(s, !0), e.options.revert = e.options._revert, e.options.helper = e.options._helper, e.placeholder && e.placeholder.remove(), i.helper.appendTo(o._parent), o._refreshOffsets(s), i.position = o._generatePosition(s, !0), o._trigger("fromSortable", s), o.dropped = !1, P.each(o.sortables, function() {
                    this.refreshPositions()
                }))
            })
        }
    }), P.ui.plugin.add("draggable", "cursor", {
        start: function(t, e, s) {
            var i = P("body"),
                o = s.options;
            i.css("cursor") && (o._cursor = i.css("cursor")), i.css("cursor", o.cursor)
        },
        stop: function(t, e, s) {
            var i = s.options;
            i._cursor && P("body").css("cursor", i._cursor)
        }
    }), P.ui.plugin.add("draggable", "opacity", {
        start: function(t, e, s) {
            var i = P(e.helper),
                o = s.options;
            i.css("opacity") && (o._opacity = i.css("opacity")), i.css("opacity", o.opacity)
        },
        stop: function(t, e, s) {
            var i = s.options;
            i._opacity && P(e.helper).css("opacity", i._opacity)
        }
    }), P.ui.plugin.add("draggable", "scroll", {
        start: function(t, e, s) {
            s.scrollParentNotHidden || (s.scrollParentNotHidden = s.helper.scrollParent(!1)), s.scrollParentNotHidden[0] !== s.document[0] && "HTML" !== s.scrollParentNotHidden[0].tagName && (s.overflowOffset = s.scrollParentNotHidden.offset())
        },
        drag: function(t, e, s) {
            var i = s.options,
                o = !1,
                n = s.scrollParentNotHidden[0],
                r = s.document[0];
            n !== r && "HTML" !== n.tagName ? (i.axis && "x" === i.axis || (s.overflowOffset.top + n.offsetHeight - t.pageY < i.scrollSensitivity ? n.scrollTop = o = n.scrollTop + i.scrollSpeed : t.pageY - s.overflowOffset.top < i.scrollSensitivity && (n.scrollTop = o = n.scrollTop - i.scrollSpeed)), i.axis && "y" === i.axis || (s.overflowOffset.left + n.offsetWidth - t.pageX < i.scrollSensitivity ? n.scrollLeft = o = n.scrollLeft + i.scrollSpeed : t.pageX - s.overflowOffset.left < i.scrollSensitivity && (n.scrollLeft = o = n.scrollLeft - i.scrollSpeed))) : (i.axis && "x" === i.axis || (t.pageY - P(r).scrollTop() < i.scrollSensitivity ? o = P(r).scrollTop(P(r).scrollTop() - i.scrollSpeed) : P(window).height() - (t.pageY - P(r).scrollTop()) < i.scrollSensitivity && (o = P(r).scrollTop(P(r).scrollTop() + i.scrollSpeed))), i.axis && "y" === i.axis || (t.pageX - P(r).scrollLeft() < i.scrollSensitivity ? o = P(r).scrollLeft(P(r).scrollLeft() - i.scrollSpeed) : P(window).width() - (t.pageX - P(r).scrollLeft()) < i.scrollSensitivity && (o = P(r).scrollLeft(P(r).scrollLeft() + i.scrollSpeed)))), !1 !== o && P.ui.ddmanager && !i.dropBehaviour && P.ui.ddmanager.prepareOffsets(s, t)
        }
    }), P.ui.plugin.add("draggable", "snap", {
        start: function(t, e, s) {
            var i = s.options;
            s.snapElements = [], P(i.snap.constructor !== String ? i.snap.items || ":data(ui-draggable)" : i.snap).each(function() {
                var t = P(this),
                    e = t.offset();
                this !== s.element[0] && s.snapElements.push({
                    item: this,
                    width: t.outerWidth(),
                    height: t.outerHeight(),
                    top: e.top,
                    left: e.left
                })
            })
        },
        drag: function(t, e, s) {
            var i, o, n, r, l, a, h, p, c, f, d = s.options,
                g = d.snapTolerance,
                u = e.offset.left,
                m = u + s.helperProportions.width,
                v = e.offset.top,
                _ = v + s.helperProportions.height;
            for (c = s.snapElements.length - 1; 0 <= c; c--) a = (l = s.snapElements[c].left - s.margins.left) + s.snapElements[c].width, p = (h = s.snapElements[c].top - s.margins.top) + s.snapElements[c].height, m < l - g || a + g < u || _ < h - g || p + g < v || !P.contains(s.snapElements[c].item.ownerDocument, s.snapElements[c].item) ? (s.snapElements[c].snapping && s.options.snap.release && s.options.snap.release.call(s.element, t, P.extend(s._uiHash(), {
                snapItem: s.snapElements[c].item
            })), s.snapElements[c].snapping = !1) : ("inner" !== d.snapMode && (i = Math.abs(h - _) <= g, o = Math.abs(p - v) <= g, n = Math.abs(l - m) <= g, r = Math.abs(a - u) <= g, i && (e.position.top = s._convertPositionTo("relative", {
                top: h - s.helperProportions.height,
                left: 0
            }).top), o && (e.position.top = s._convertPositionTo("relative", {
                top: p,
                left: 0
            }).top), n && (e.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l - s.helperProportions.width
            }).left), r && (e.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: a
            }).left)), f = i || o || n || r, "outer" !== d.snapMode && (i = Math.abs(h - v) <= g, o = Math.abs(p - _) <= g, n = Math.abs(l - u) <= g, r = Math.abs(a - m) <= g, i && (e.position.top = s._convertPositionTo("relative", {
                top: h,
                left: 0
            }).top), o && (e.position.top = s._convertPositionTo("relative", {
                top: p - s.helperProportions.height,
                left: 0
            }).top), n && (e.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l
            }).left), r && (e.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: a - s.helperProportions.width
            }).left)), !s.snapElements[c].snapping && (i || o || n || r || f) && s.options.snap.snap && s.options.snap.snap.call(s.element, t, P.extend(s._uiHash(), {
                snapItem: s.snapElements[c].item
            })), s.snapElements[c].snapping = i || o || n || r || f)
        }
    }), P.ui.plugin.add("draggable", "stack", {
        start: function(t, e, s) {
            var i, o = s.options,
                n = P.makeArray(P(o.stack)).sort(function(t, e) {
                    return (parseInt(P(t).css("zIndex"), 10) || 0) - (parseInt(P(e).css("zIndex"), 10) || 0)
                });
            n.length && (i = parseInt(P(n[0]).css("zIndex"), 10) || 0, P(n).each(function(t) {
                P(this).css("zIndex", i + t)
            }), this.css("zIndex", i + n.length))
        }
    }), P.ui.plugin.add("draggable", "zIndex", {
        start: function(t, e, s) {
            var i = P(e.helper),
                o = s.options;
            i.css("zIndex") && (o._zIndex = i.css("zIndex")), i.css("zIndex", o.zIndex)
        },
        stop: function(t, e, s) {
            var i = s.options;
            i._zIndex && P(e.helper).css("zIndex", i._zIndex)
        }
    }), P.ui.draggable
});