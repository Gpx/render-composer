"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var lodash_clonedeep_1 = require("lodash.clonedeep");
var Wrap = /** @class */ (function () {
    function Wrap(_a) {
        var ui = _a.ui, childWrap = _a.childWrap, _b = _a.data, data = _b === void 0 ? {} : _b;
        this.ui = ui;
        this.childWrap = childWrap;
        this.data = data;
    }
    Wrap.prototype.__render = function (child, data) {
        var ui;
        var thisData = typeof this.data === "function" ? this.data() : this.data;
        var finalData = __assign(__assign({}, thisData), data);
        if (this.childWrap) {
            var childResult = this.childWrap.__render(child, data);
            ui = this.ui(childResult.ui, finalData);
            finalData = __assign(__assign({}, finalData), childResult.data);
        }
        else {
            ui = this.ui(child, finalData);
        }
        return { ui: ui, data: finalData };
    };
    Wrap.prototype.wraps = function (childWrap) {
        var clone = (0, lodash_clonedeep_1["default"])(this);
        if (clone.childWrap) {
            var childWrapClone = clone.childWrap.wraps(childWrap);
            clone.childWrap = childWrapClone;
        }
        else {
            clone.childWrap = childWrap;
        }
        return clone;
    };
    Wrap.prototype.defaultData = function (data) {
        var clone = (0, lodash_clonedeep_1["default"])(this);
        clone.data = data;
        return clone;
    };
    Wrap.prototype.withRenderMethod = function (render, opts) {
        var _this = this;
        return function (child, data) {
            if (data === void 0) { data = {}; }
            var renderResult = _this.__render(child, data);
            var utils = render(renderResult.ui, opts);
            return __assign(__assign({}, utils), renderResult.data);
        };
    };
    return Wrap;
}());
function wrap(ui) {
    return new Wrap({ ui: ui });
}
exports["default"] = wrap;
