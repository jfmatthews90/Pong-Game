// js for pong game

		//global variables
			var canvas;
			var canvasContext;
			var ballX = 50;
			var ballSpeedX = 15;
			var ballY = 50;
			var ballSpeedY = 4.5;
			var paddle1Y = 250;
			var paddle2Y = 250;
			var player1Score = 0;
			var player2Score = 0;
			var showingWinScreen = false;
			const PADDLE_HEIGHT = 100;
			const PADDLE_THICKNESS = 10;
			const WINNING_SCORE = 7;


			function calculateMousePos(evt) {
				var rect = canvas.getBoundingClientRect();
				var root = document.documentElement;
				var mouseX = evt.clientX - rect.left - root.scrollLeft;
				var mouseY = evt.clientY - rect.top - root.scrollTop;
				return {
					x:mouseX,
					y:mouseY
				};
			}

			function handleMouseClick(evt) {
				if(showingWinScreen) {
					player1Score = 0;
					player2Score = 0;
					showingWinScreen = false;
				}
			}

			//tells JavaScript not to load until window is finished loading
			window.onload = function() {
				canvas = document.getElementById('gameCanvas');
				canvasContext = canvas.getContext('2d');
				//FPS
				var framesPerSecond = 30;
				setInterval(function() {
					moveEverything();
					drawEverything();
				}, 1000/framesPerSecond); //note no () at the end of the function when doing it like this.

				canvas.addEventListener('mousedown', handleMouseClick);


				//event listener for mouse movement.
				canvas.addEventListener('mousemove',
					function(evt) {
						var mousePos = calculateMousePos(evt);
						paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
					});
			}

			//resets ball once it hits a goal
			function ballReset() {
				if(player1Score >= WINNING_SCORE ||
					player2Score >= WINNING_SCORE) {
						//player1Score = 0;
						//player2Score = 0;
						showingWinScreen = true;
				}
				ballSpeedX = -ballSpeedX;	
				ballX = canvas.width/2;
				ballY = canvas.width/2;
			}

			function computerMovement(){
				var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
				if(paddle2Y < ballY-35) {
					paddle2Y += 10;
				} else if(paddle2YCenter > ballY+35) {
					paddle2Y -= 10;
				}
			}


			//controls movement of ball and opponent
			function moveEverything() {
				//winscreen
				if(showingWinScreen) {
					return;
				}

				computerMovement();
				ballX = ballX + ballSpeedX; 
				ballY = ballY + ballSpeedY;

				if(ballX < 0) {
					if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
						ballSpeedX = -ballSpeedX;
						var deltaY = ballY
											-(paddle1Y+PADDLE_HEIGHT/2);
						ballSpeedY = deltaY * .35;
					} else {
						player2Score++; //must be before ballReset()
						ballReset();
					}					
				}		
				if(ballX > canvas.width) {
					if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
						ballSpeedX = -ballSpeedX;
						var deltaY = ballY
											-(paddle2Y+PADDLE_HEIGHT/2);
						ballSpeedY = deltaY * .35;						
					} else {
						player1Score++;	//must be before ballReset()
						ballReset();
					}			
				}
				if(ballY < 0) {
					ballSpeedY = -ballSpeedY;					
				}	
				ballY = ballY + ballSpeedY; 
				if(ballY > canvas.height) {
					ballSpeedY = -ballSpeedY;
				}
	
			}

			function drawNet() {
				for(var i=0; i<canvas.height; i+=40) {
					colorRect (canvas.width/2-1,i,2,20,'white');
				}
			}

			function drawEverything() {

				//logs ball's position
				console.log(ballX); 

				//background canvas
				colorRect(0, 0, canvas.width, canvas.height, 'black');

				//winscreen
				if(showingWinScreen) {
					canvasContext.fillStyle = "red";

						if(player1Score >= WINNING_SCORE) {
							canvasContext.fillText("Left Player Won!", 360, 100);
						} else if(player2Score >= WINNING_SCORE) {
							canvasContext.fillText("Right Player Won!", 360, 100);
						}

					canvasContext.fillText("- click to continue -", 360, 320);
					return;
				}				
				//game net
				drawNet();

				//left player paddle
				colorRect(canvas.width-790, paddle1Y, PADDLE_THICKNESS, 100, 'white');
				//right computer paddle
				colorRect(canvas.width-20, paddle2Y, PADDLE_THICKNESS, 100, 'white');
				//ball
				colorCircle(ballX, ballY, 10, 'red');
				//scoreboard
				canvasContext.fillText(player1Score, 100, 50)
				canvasContext.fillText(player2Score, canvas.width-100, 50)
			}

			//ball's color, shape, etc...
			function colorCircle(centerX, centerY, radius, drawColor) {
				canvasContext.fillStyle = drawColor;
				canvasContext.beginPath();
				canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
				canvasContext.fill();
			}

			function colorRect(leftX, topY, width, height, drawColor) {
				canvasContext.fillStyle = drawColor; 
				canvasContext.fillRect(leftX, topY, width, height);
			}


			//console.log("It's working");

