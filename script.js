const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;


// creating Ball properties
const ball = {
    x: canvas.width / 2,// positioning the ball from x and y axis , ie to centre
    y: canvas.height /2,
    size: 10,
    // animation of ball
    speed: 4,
    dx: 4, // direction movement in x axis
    dy: -4 //direction movement in y axis
}


// creating paddle properties
const paddle = {
    x: canvas.width / 2 - 40,// positioning the paddle from x and y axis , -40 coz total width will be 80 and we want 40
    y: canvas.height - 20, //-20 coz to move it up
    w: 80,
    h: 10,
    // animation of paddle
    speed: 8,
    dx: 0, // direction movement in x axis
}

// create bricks properties
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45, //posititon of brick on x and y axis
    offsetY: 60,
    visible: true
}

// create bricks 
// we have made an array of 9 rows and inside that array we created array of 5 columns
    // (for more info- video5 from 7:34)
const bricks = [];
for(let i = 0; i < brickRowCount; i++){
    bricks[i] = []; //array for each row
    for(let j= 0; j < brickColumnCount; j++){ //loop into coloum count
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX; //creating x and y value
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = {x,y, ...brickInfo }
    }
}


// for showcasing the array of bricks:-
// console.log(bricks);




// drawing Ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); //creating circle using arc(xvalue, yvalue, radius , startangle, endangle)
    ctx.fillStyle = '#0095dd' ; //coloring ball
    ctx.fill();
    ctx.closePath();
}

// drawing Paddle
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h); //creating rectangle using rect(xvalue, yvalue, width, height)
    ctx.fillStyle = '#0095dd' ; //coloring paddle
    ctx.fill();
    ctx.closePath();
}




// draw score on canvas
function drawScore(){
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`, canvas.width - 100,30)
}


// draw bricks on canvas
function drawBricks() {
    bricks.forEach(column =>{  //looping through columns
        column.forEach(brick =>{
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'; //conditional (ternary) operator(if brick is visible then 0095dd, else=transparent)
            ctx.fill();
            ctx.closePath();
        })
    })
}

// move paddle on canvas
function movePaddle(){
    paddle.x += paddle.dx;


    //wall detection
    if (paddle.x + paddle.w > canvas.width){ //takes care that paddle dont go beyond canvas on right side
        paddle.x = canvas.width - paddle.w; //mistake here
    }
    if (paddle.x < 0){ //takes care that paddle dont go beyond canvas on left side
        paddle.x = 0;
    
    }

}


//Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

        // wall collison ( right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1; // we use -1 coz we want to turn ball the other way so converting it to -ve value
    }

    // wall collison ( top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1;
    }

    // paddle collison
    if( ball.x - ball.size > paddle.x && //checking for left side 
        ball.x + ball.size < paddle.x + paddle.w &&  // checking for r-side
        ball.y + ball.size > paddle.y){
        ball.dy = -ball.speed;
    }
    

    //brick collison
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if(
                    ball.x - ball.size > brick.x && //left side brick check
                    ball.x + ball.size < brick.x + brick.w && //right side brick check
                    ball.y + ball.size > brick.y && //top brick check
                    ball.y - ball.size < brick.y + brick.h // bottom brick check
                ){
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
    });




    //hit bottom ball = lose
    if(ball.y + ball.size > canvas.height){
        showAllBricks();
        score = 0;
    }
}

// increase score
function increaseScore (){
    score++;

    if(score % (brickRowCount * brickRowCount)=== 0 ){
        showAllBricks();
    }
}

//make all brick appear
function showAllBricks(){
    bricks.forEach(column =>{
        column.forEach(brick => (brick.visible = true));
    });
}




// draw everything
function draw(){
    //clear canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);


    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}



// update canvas drawing and animation
function update() {
    movePaddle();
    moveBall();
     
    draw();

    requestAnimationFrame(update);
}

update();



// keydown event
function keyDown(e){
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = -paddle.speed
    }
}

// keyup event
function keyUp(e){
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = 0;
    }
}


// keyboard event handler
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// show rules and close event listner
rulesBtn.addEventListener('click',  ()=>
    rules.classList.add('show'));
closeBtn.addEventListener('click',  ()=>
    rules.classList.remove('show'));