/** The board represents the canvas.
* It takes amplitutde A, distractor desntiy D, EW/W, current mouse position,
*	target position as inputs
* and generates a list of circle objects into its board.circles attributes
*/

var Board = function(curPos, tarPos, D, w, eww) {
	var squareLength = w * eww;
	var angle = Math.atan2(tarPos.y - curPos.y, tarPos.x - curPos.x)
	var vec1 = new Pos(squareLength * Math.cos(angle), 
										 squareLength * Math.sin(angle));
	var vec2 = new Pos(squareLength * Math.cos(angle + Math.PI/2),
										 squareLength * Math.sin(angle + Math.PI/2));
	this.circles = [];
	this.grid = [];
	this.cursorRadius = 5;

	/* add a layer of grid point expanding from tarPos */
	this.addLayer = function(layer) {

		var possibleGrid = [];

		var addSide = function(pos, vec, num) {
			var middlePos = tarPos.add(pos);
			for (var i = - num + 1; i <= num - 1; i++) {
				var p = middlePos.add(vec.multiply(i));
				possibleGrid.push(p);
			}
		}

		addSide(vec1.multiply(layer), vec2, layer);
		addSide(vec1.multiply(-layer), vec2, layer);
		addSide(vec2.multiply(layer), vec1, layer);
		addSide(vec2.multiply(-layer), vec1, layer);

		possibleGrid.push(tarPos.add(vec1.multiply(layer)).add(vec2.multiply(layer)));
		possibleGrid.push(tarPos.add(vec1.multiply(layer)).add(vec2.multiply(-layer)));
		possibleGrid.push(tarPos.add(vec1.multiply(-layer)).add(vec2.multiply(layer)));
		possibleGrid.push(tarPos.add(vec1.multiply(-layer)).add(vec2.multiply(-layer)));

		return possibleGrid;
	}

	/* examine the grid layer to see if all of them fall out of the canvas */
	this.examineGrid = function(possibleGrid) {
		for (var i = 0; i < possibleGrid.length; i++) {
			if (qualifyOnCanvas(possibleGrid[i], w)) {
				notFullyExceed = true;
				this.grid.push(possibleGrid[i]);
			}
		}
	}

	/* shift the center of the circle randomly */
	this.randomizePos = function(pos) {
		var ran1 = (eww - 1) / eww * (2 * Math.random() - 1) / 2;
		var ran2 = (eww - 1) / eww * (2 * Math.random() - 1) / 2;
		var p = pos.add(vec1.multiply(ran1)).add(vec2.multiply(ran2));
		return p;
	}

	/* take points from this.grid, turn them into circles and push into this.circles */
	this.addCircles = function() {
		for (var i = 0; i < this.grid.length; i++) {
			if (this.grid[i].equal(tarPos)) {
				var canvasCircle = new Circle(this.grid[i], w, true);
				this.circles.push(canvasCircle);
			} else if (Math.abs(this.grid[i].minus(tarPos).norm() - squareLength) < 0.00001) {
				var canvasCircle = new Circle(this.grid[i], w, false);
				this.circles.push(canvasCircle);
			} else if (D !== 0 && Math.random() <= D) {
				var newPos = this.randomizePos(this.grid[i]);
				/* var newPos = this.grid[i]; */
				if (qualifyOnCanvas(newPos, w)) {
					var canvasCircle = new Circle(newPos, w, false);
					this.circles.push(canvasCircle);
				}
			}
		}
	}

	/*

	this.updateCursorRadius = function(pos) {

		if (this.circles.length !== 0) {
			var indexCloset = 0; 
			var indexSecClosest = 0;
			var closestDistance = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
			var secondClosestDis = closestDistance

			for (var i = 0； i < this.circles.length; i++) { 
				var dis = pos.minus(this.circles[i].pos).norm();
				if ( dis <= secondClosestDis && closestDistance < dis) {
					secondClosestDis = dis;
					indexSecClosest = i;
				} else if (dis <= closestDistance) {
					secondClosestDis = closestDistance;
					indexSecClosest = indexCloset;
					indexCloset = i;
					closestDistance = dis;
					this.capturedCircle = this.circles[i];
				}

				var ConD = closestDistance + this.capturedCircle.w;
				var IntD = secondClosestDis - this.capturedCircle.w;

				this.cursorRadius = Math.min(ConD, IntD);
			}
		}

	*/

	/** 
	* Using the target voronoi square to expand, tiling over the board
	* In such a way we can find all possible tiling square center to position 
	* the circle object
	*/

	this.grid.push(tarPos);
	var layer = 1;
	var notFullyExceed = true;
	while (notFullyExceed) {
		notFullyExceed = false;
		var possibleGrid = this.addLayer(layer);
		/* console.log("the length of possibleGrid is " + possibleGrid.length); */
		this.examineGrid(possibleGrid);
		layer += 1;
		/* console.log(layer); */
	}


	this.addCircles();




}