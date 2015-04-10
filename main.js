$(document).ready(function() {
	
	var canvasWidth = document.getElementById('experiment').width;
	var canvasHeight = document.getElementById('experiment').height;

	var conversionRate = 0.8;
	var A = [256 * conversionRate, 384 * conversionRate, 512 * conversionRate];
	var w = [16 * conversionRate, 24 * conversionRate, 32 * conversionRate];
	var eww = [1.33, 2, 3];
	var D = [0, 0.5, 1];
	var canvas = document.getElementById('experiment');
	var ctx = canvas.getContext('2d');

	/*
	var curPos = new Pos(300, 300);
	var tarPos = new Pos(300 + A[2], 300);

	var board = new Board(curPos, tarPos, D[2], w[2], eww[0]);
	*/

	var drawCircles = function(board) {
		for (var i = 0; i < board.circles.length; i++) {
			var circle = board.circles[i];
			ctx.beginPath();
			ctx.arc(circle.pos.x, circle.pos.y, circle.w, 0, 2 * Math.PI, false);
			if (circle.isTarget) {
				ctx.fillStyle = '#048046';
			} else {
				ctx.fillStyle = '#C4C4C4';
			}
			ctx.fill();
		}
	}

	

	/*
	drawCircles(board);
	*/

	/* start warm up test button */
	$("#btnStartWarmUp").click(function(e) {
		$("#messages").html("Please click on the <span class='green'>green</span> target circle"
			+" To stop, click <span class='sys'>End Warm Up Test</span> button.")
		$("#btnEndWarmUp").removeAttr('disabled');
		$("#btnStartWarmUp").attr({'disabled': 'disabled'});
		var ranA = A[randomInt(3)];
		var ranw = w[randomInt(3)];
		var raneww = eww[randomInt(3)];
		var ranD = D[randomInt(3)];
		var tarPos = new Pos(canvasWidth / 2, canvasHeight / 2);
		var curPos = new Pos(0, 0)
		var board = new Board(curPos, tarPos, ranD, ranw, raneww);
		drawCircles(board);

		clickCheck = function(e) {
			var x = e.pageX - canvas.offsetLeft - 2;
			var y = e.pageY - canvas.offsetTop - 2;
			var clickPos = new Pos(x, y);
			if (clickPos.minus(tarPos).norm() < ranw / 2) {
				ranA = A[randomInt(3)];
				ranw = w[randomInt(3)];
				raneww = eww[randomInt(3)];
				ranD = D[randomInt(3)];
				curPos = clickPos;
				tarPos = randomTarPos(curPos, ranA, ranw, raneww);
				/* debug used
				console.log("curPos is (" + curPos.x +", " + curPos.y +")");
				console.log("tarPos is (" + tarPos.x +", " + tarPos.y +")");
				*/
				board = new Board(curPos, tarPos, ranD, ranw, raneww);
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				drawCircles(board);
			}
		}

		canvas.addEventListener('click', clickCheck);
	});

	/* end warm up test button */
	$("#btnEndWarmUp").click(function(e) {
		$("#messages").html("Warm up test is over. Please click "
			+ "<span class='sys'>Start Real Test</span> to start a real test. "
			+ "Your response time will be recorded in a file. "
			+ "When the test is finished, please enter a file name and download the data.")
		$("#btnEndWarmUp").attr({'disabled': 'disabled'});
		$("#btnStartTest").removeAttr('disabled');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight)
		canvas.removeEventListener('click', clickCheck);
	});

	/* start real test button */
	$("#btnStartTest").click(function(e) {
		$("#messages").html("Your test will start after you hit the <span class='green'>target green"
			+ " circle</span>");

		var testBlock = new TestBlock(A, w, eww, D);
		var tarPos = new Pos(canvasWidth / 2, canvasHeight / 2);
		var curPos = new Pos(canvasWidth / 2, 0)
		var board = new Board(curPos, tarPos, 0, w[2], eww[1]);
		var curRadius = w[2] / 2;
		drawCircles(board);

		var seriesNum = testBlock.testSeries.length;
		/* debug use
		console.log("the length of testSeries is " + seriesNum);
		console.log(testBlock.testSeries);
		*/
		var testNum = testBlock.testSeries[0].length;

		testClickCheck = function(e) {
			/* for debug use
			console.log("You clicked");
			*/
			var x = e.pageX - canvas.offsetLeft - 2;
			var y = e.pageY - canvas.offsetTop - 2;
			var clickPos = new Pos(x, y);
			if (clickPos.minus(tarPos).norm() < curRadius) {

				var AinTest = testBlock.testSeries[seriesNum - 1][testNum - 1][3];
				var winTest = testBlock.testSeries[seriesNum - 1][testNum - 1][0];
				var ewwinTest = testBlock.testSeries[seriesNum - 1][testNum - 1][1];
				var DinTest = testBlock.testSeries[seriesNum - 1][testNum - 1][2];
				curPos = clickPos;
				tarPos = randomTarPos(curPos, AinTest, winTest, ewwinTest);
				board = new Board(curPos, tarPos, DinTest, winTest, ewwinTest);
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				drawCircles(board);
				curRadius = winTest / 2;
				/* debug use
				console.log("You click into the target circle");
				console.log('Current testNum is' + testNum);
				console.log('Current seriesNum is' + seriesNum);
				*/
				$("#messages").html("You are now in test block " + (testBlock.testSeries.length - seriesNum + 1)
					+ "/" + testBlock.testSeries.length + ", test number " + (testBlock.testSeries[0].length - testNum + 1)
					+ "/" + testBlock.testSeries[0].length + " of the current block");

				testNum -= 1;
				if (testNum === 0) {
					testNum = testBlock.testSeries[0].length;
					seriesNum -= 1;
					if (seriesNum === 0) {
						canvas.removeEventListener('click', testClickCheck);
					}
				}
			}
			
		}

		canvas.addEventListener('click', testClickCheck);

		
	});

})