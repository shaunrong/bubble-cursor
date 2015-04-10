var addAndMultiply = function(x, y) {
	this.x = x;
	this.y = y;

	this.show = function() {
		console.log(this.multiply());
	}
	
	this.multiply = function() {
		return this.x * this.y;
	}

}


var a = new addAndMultiply(2,2);

a.show();