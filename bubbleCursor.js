/*
* This a bubble cursor object.
*/

var BubbleCursor = function() {
	
	this.radius = 5;

	this.updateRadius = function() {
		if (this.capturedCircle) {

		}
	}

	this.update = function(pos) {
		if (board.circles.length !== 0) {
			var indexCloset = 0; 
			var indexSecClosest = 0;
			var closestDistance = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
			var secondClosestDis = closestDistance
			for (var i = 0； i < board.circles.length; i++) { 
				var dis = pos.minus(board.circles[i].pos).norm();
				if ( dis <= secondClosestDis && closestDistance < dis) {
					secondClosestDis = dis;
					indexSecClosest = i;
				} else if (dis <= closestDistance) {
					secondClosestDis = closestDistance;
					indexSecClosest = indexCloset;
					indexCloset = i;
					closestDistance = dis;
					this.capturedCircle = board.circles[i];
				}

				var ConD = closestDistance + this.capturedCircle.w;
				var IntD = secondClosestDis - this.capturedCircle.w;

				this.radius = Math.min(ConD, IntD);
			}
		}
	}
}