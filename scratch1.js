var BubbleCursor = function() {
	
	this.radius = 5;


	this.update = function(pos) {

		if ((board) && (board.circles.length !== 0)) {
			var indexCloset = 0; 
			var indexSecClosest = 0;
			var closestDistance = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
			var secondClosestDis = closestDistance

			for (var index = 0；index < board.circles.length; index++) { 
				var dis = pos.minus(board.circles[index].pos).norm();
				if ( dis <= secondClosestDis && closestDistance < dis) {
					secondClosestDis = dis;
					indexSecClosest = index;
				} else if (dis <= closestDistance) {
					secondClosestDis = closestDistance;
					indexSecClosest = indexCloset;
					indexCloset = index;
					closestDistance = dis;
					this.capturedCircle = board.circles[index];
				}

				var ConD = closestDistance + this.capturedCircle.w;
				var IntD = secondClosestDis - this.capturedCircle.w;

				this.radius = Math.min(ConD, IntD);
			}
		}
	}
}

cursor = new BubbleCursor();