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
	var cursorCanvas = document.getElementById('cursor');
	var cursorCtx = cursorCanvas.getContext('2d');
	cursorCtx.globalAlpha = 0.2;
	cursorCtx.fillStyle = 'red';
	var expData = [];
	var curTime;
	var row;
	var board;

	/*
* This a bubble cursor object.
*/

var BubbleCursor = function() {
	
	this.radius = 5;


	this.update = function(pos) {

		if ((board) && (board.circles.length !== 0)) {
			var indexCloset = 0; 
			var indexSecClosest = 0;
			var closestDistance = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
			var secondClosestDis = closestDistance

			for (var index = 0; index < board.circles.length; index++) { 
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

	var cursor = 'Normal';
	var bubbleCursor = new BubbleCursor();

	// Decide the cursor mode
	$("input[name='cursorMode']").click(function(e) {
		cursor = $("input[name='cursorMode']:checked").val();
		if (cursor === 'Bubble') {
			$("#experiment").css('cursor', 'none');
			$("#cursor").css('cursor', 'none');
		}
		if ((cursor === 'Normal') && ($("#experiment").css('cursor') === 'none')) {
			$("#experiment").css('cursor', '');
			$("#cursor").css('cursor', '');
		}
	});



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
				ctx.fill();
			} else {
				ctx.strokeStyle = '#C4C4C4';
				ctx.lineWidth = 3;
				ctx.stroke();
			}
		}
	}

	var checkCapture = function(clickPos, tarPos, ranw) {
		if (cursor === 'Normal') {
			//console.log('Normal cursor clicks.');
			return (clickPos.minus(tarPos).norm() < ranw / 2);
		} else if (cursor === 'Bubble') {
			//console.log('Bubble cursor clicks.');
			bubbleCursor.update(clickPos);
			return bubbleCursor.capturedCircle.pos.equal(tarPos);
		} else {
			console.log('cursor variable is ' + cursor);
			return false;
		}
	}

	var drawBubbleCursor = function(e) {
		var x = e.pageX - canvas.offsetLeft - 2;
		var y = e.pageY - canvas.offsetTop - 2;
		var bubbleCursorPos = new Pos(x, y);
		if (qualifyOnCanvas(bubbleCursorPos, 0)) {
			cursorCtx.clearRect(0, 0, canvasWidth, canvasHeight);
			bubbleCursor.update(bubbleCursorPos);
			cursorCtx.beginPath();
			cursorCtx.arc(x, y, bubbleCursor.radius, 2 * Math.PI, false);
			cursorCtx.fill();
			if ((bubbleCursorPos.minus(bubbleCursor.capturedCircle.pos).norm() + bubbleCursor.capturedCircle.w) > bubbleCursor.radius) {
				cursorCtx.beginPath();
				cursorCtx.arc(bubbleCursor.capturedCircle.pos.x, bubbleCursor.capturedCircle.pos.y, bubbleCursor.capturedCircle.w + 3, 2 * Math.PI, false);
				cursorCtx.fill();
			}
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
		$("input[type=radio]").attr('disabled', true);
		var ranA = A[randomInt(3)];
		var ranw = w[randomInt(3)];
		var raneww = eww[randomInt(3)];
		var ranD = D[randomInt(3)];
		var tarPos = new Pos(canvasWidth / 2, canvasHeight / 2);
		var curPos = new Pos(0, 0)
		board = new Board(curPos, tarPos, ranD, ranw, raneww);
		drawCircles(board);

		clickCheck = function(e) {
			var x = e.pageX - canvas.offsetLeft - 2;
			var y = e.pageY - canvas.offsetTop - 2;
			var clickPos = new Pos(x, y);
			if (checkCapture(clickPos, tarPos, ranw)) {
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

		if (cursor === 'Normal') {
			handlers = {click: clickCheck};
		}
		if (cursor === 'Bubble') {
			handlers = {click: clickCheck, mousemove: drawBubbleCursor};
		}
		

		//canvas.addEventListener('click', clickCheck);

		$(document).on(handlers);
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
		$(document).off(handlers);
	});

	/* start real test button */
	$("#btnStartTest").click(function(e) {
		expData = [];
		$("#messages").html("Your test will start after you hit the <span class='green'>target green"
			+ " circle</span>");
		$("#btnStartTest").attr({'disabled': 'disabled'});
		//$("#download").removeAttr('disabled');

		var testBlock = new TestBlock(A, w, eww, D);
		var tarPos = new Pos(canvasWidth / 2, canvasHeight / 2);
		var curPos = new Pos(canvasWidth / 2, 0)
		board = new Board(curPos, tarPos, 0, w[2], eww[1]);
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
			if (checkCapture(clickPos, tarPos, 2 * curRadius)) {

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

				if ( expData.length === 0 ) {
					row = 0;
					curTime = new Date().getTime() / 1000;
					//console.log(expData);
				} else {
					/* debug
					console.log("accessing expData[0]['A'] is " + expData[0]['A']);
					console.log('row number is ' + row);
					*/
					expData[row - 1]['clickTime'] = new Date().getTime() / 1000 - curTime;
					curTime = new Date().getTime() / 1000;
					//console.log(expData[row -1]);
				}

				expData[row] = {'A': AinTest, 'w': winTest, 'eww': ewwinTest, 'D': DinTest};
				
				row += 1;
				/* debug use
				console.log('row number is ' + row);
				console.log('leng of expData is ' + expData.length);
				console.log("You click into the target circle");
				console.log('Current testNum is' + testNum);
				console.log('Current seriesNum is' + seriesNum);
				*/
				$("#messages").html("You are now in test block " + (testBlock.testSeries.length - seriesNum + 1)
					+ "/" + testBlock.testSeries.length + ", test number " + (testBlock.testSeries[0].length - testNum + 1)
					+ "/" + testBlock.testSeries[0].length + " of the current block");

				testNum -= 1;
				console.log('seriesNum is ' + seriesNum);
				
				if (testNum === 0) {
					testNum = testBlock.testSeries[0].length;
					seriesNum -= 1;
					if (seriesNum === 0) {
						$(document).off(handlers);
						ctx.clearRect(0, 0, canvasWidth, canvasHeight);
						$("#messages").html("You have finished this test experiment. Please write in "
							+"<span class='sys'>Your Name</span> and download the experiment data in csv format.");
						$("#download").removeAttr('disabled');
					}
				}
			}
		}

		if (cursor === 'Normal') {
			handlers = {click: testClickCheck};
		}
		if (cursor === 'Bubble') {
			handlers = {click: testClickCheck, mousemove: drawBubbleCursor};
		}

		$(document).on(handlers);
	});

	/* Download the data in csv format, Download test Data button */
	$("#download").click(function(e) {
		if ($("#fileName").val() === "") {
			$("#messages").html("Please put in <span class='sys'>Your Name</span>.");
		} else {
			$("#messages").html("Please select the <span class='sys'>Cursor Mode</span> "
				+ "and try some warm up tests. When you think you are ready, "
				+ "please end the warm up test and start the real test.");
			$("#btnStartWarmUp").removeAttr('disabled');
			$("input[type=radio]").attr('disabled', false);

			var mode = $("input[name='cursorMode']:checked").val();
			//console.log(expData);
			var CSV = JSONToCSV(expData, mode);
			var fileName = $("#fileName").val() + '_' + mode;
			fileName = fileName.split(' ').join('_');

			var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
			var link = document.createElement('a');
			link.href = uri;
			link.style = 'visibility: hidden';
			link.download = fileName + '.csv';

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	});




})