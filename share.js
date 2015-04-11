/**
* This js file contains some commonly shared simple object or functions.
*/

var canvasWidth = document.getElementById('experiment').width;
var canvasHeight = document.getElementById('experiment').height;

/* Position Object, can also be seen as a vector */
var Pos = function(x, y) {
	this.x = x;
	this.y = y;

	this.add = function(pos2) {
		var p = new Pos(this.x + pos2.x, this.y + pos2.y);
		return p;
	}

	this.multiply = function(num) {
		var p = new Pos(this.x * num, this.y * num);
		return p;
	}

	this.equal = function(pos) {
		return (this.x === pos.x && this.y === pos.y);
	}

	this.minus = function(pos) {
		var p = new Pos(this.x - pos.x, this.y - pos.y);
		return p;
	}

	this.norm = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}

/**
* Circle represents a circle object on the experimental canvas.
* (Circle.x, Circle.y) is the circle's cartesian coordinations on canvas
* Circle.isTarget tells if the circle is the target
* Circle.w is the circle radius
*/

var Circle = function(pos, w, isTarget) {
	this.pos = pos;
	this.w = w/2;
	this.isTarget = isTarget;
}

/* check if a center of a circle can appear on the canvas */
var qualifyOnCanvas = function(pos, w) {
	/*
	console.log('pox.x is ' + pos.x);
	console.log('pos.y is ' + pos.y);
	*/
	if ((w <= pos.x) && (pos.x <= (canvasWidth - w)) && (w <= pos.y) && (pos.y <= canvasHeight - w)) {
		/*console.log("on canvas");*/
		return true;
	} else {
		/*console.log('not on canvas');*/
		return false;
	}
}

/* return a random position on canvas */
var randomPos = function() {
	var p = new Pos(Math.random() * canvasWidth, Math.random() * canvasHeight);
	return p;
}

/* return a random interger between 0~n-1 inclusively */
var randomInt = function(n) {
	return Math.floor(Math.random() * n);
}

/* examine wheterh the tarPos is qualified to be created on canvas (together with its nearest)
 * four distractors. */
var examineTarPos = function(tarPos, ranw, raneww) {
	var margin = ranw * raneww * 3 / Math.sqrt(2);
	return ((tarPos.x > margin) && (tarPos.x < (canvasWidth - margin)) && (tarPos.y > margin) && (tarPos.y < (canvasHeight - margin)))
}

/* Find a random Posistion on canvas which has the required A, w, eww from curPos. */
var randomTarPos = function(curPos, ranA, ranw, raneww) {
	var randomAngle = Math.PI * (2 * Math.random() - 1);
	var tarPos = curPos.add(new Pos(ranA * Math.cos(randomAngle), ranA * Math.sin(randomAngle)));
	var qualified = examineTarPos(tarPos, ranw, raneww);
	while (!qualified) {
		randomAngle = Math.PI * (2 * Math.random() - 1);
		tarPos = curPos.add(new Pos(ranA * Math.cos(randomAngle), ranA * Math.sin(randomAngle)));
		qualified = examineTarPos(tarPos, ranw, raneww);
		/* debug use
		console.log("Loop once to find a tarPos.")
		*/
	}
	return tarPos;
}

/* Fisher-Yates shuffle to randomnize array */
var shuffle = function(array) {
	var currentIndex = array.length, temporaryValue, valueIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

/* convert a Json into a csv file */
var JSONToCSV = function(data, reportTitle) {
	var CSV = '';
	CSV += reportTitle + '\r\n\n'

	var row = '';
	for (var index in data[0]) {
		row += index + ',';
	}
	row = row.slice(0, -1);
	CSV += row + '\r\n';

	for (var i = 0; i < data.length - 1; i++) {
		var row = '';
		for (var index in data[i]) {
			row += data[i][index] + ',';
		}
		row = row.slice(0, -1);
		CSV += row + '\r\n';
	}
	return CSV;
}
