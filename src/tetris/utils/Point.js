"use strict";
exports.__esModule = true;
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.X = x;
        this.Y = y;
    }
    Point.prototype.add = function (other) {
        return new Point(this.X + other.X, this.Y + other.Y);
    };
    Point.prototype.subtract = function (other) {
        return new Point(this.X - other.X, this.Y - other.Y);
    };
    return Point;
}());
exports["default"] = Point;
