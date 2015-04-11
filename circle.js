/**
* Circle represents a circle object on the experimental canvas.
* (Circle.x, Circle.y) is the circle's cartesian coordinations on canvas
* Circle.isTarget tells if the circle is the target
* Circle.w is the circle radius
*/

var Circle = function(pos, w, isTarget) {
	this.pos = pos;
	this.w = w;
	this.isTarget = isTarget;
}