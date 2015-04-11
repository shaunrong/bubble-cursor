/* 
* The TestBlock object takes A, w, eww, D as inputs and generate a test series in the following
* style:
*   1. w, eww, D will make up for 27 combinations randomly
* 	2. every combination will have 9 trials, with each of the 3 As appearing for 3 times randomly
* The test series parameters will be stored in an array in this.testSeries attribute.
*/

var TestBlock = function(A, w, eww, D) {
	this.A = A;
	this.w = w;
	this.eww = eww;
	this.D = D;
	this.combinations = [];
	this.Aseries = this.A.concat(this.A).concat(this.A);
	this.testSeries = [];

	for (var i = 0; i < this.w.length; i++) {
		for (var j = 0; j < this.eww.length; j++) {
			for (var k = 0; k < this.D.length; k++) {
				this.combinations.push([this.w[i], this.eww[j], this.D[k]])
			}
		}
	}

	for (var i = 0; i < this.combinations.length; i++) {
		this.Aseries = shuffle(this.Aseries);
		var subTests = [];
		for (var j = 0; j < this.Aseries.length; j++) {
			subTests.push([this.combinations[i][0], this.combinations[i][1], 
				this.combinations[i][2], this.Aseries[j]]);
		}
		this.testSeries.push(subTests);
	}
}