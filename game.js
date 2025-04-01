// 遊戲常量
const GRID_SIZE = 20;
const GRID_COUNT_X = 32;
const GRID_COUNT_Y = 18;
const GAME_SPEED = 200;

// 獲取畫布和上下文
const canvas = document.getElementById('gameCanvas');
canvas.width = GRID_SIZE * GRID_COUNT_X;
canvas.height = GRID_SIZE * GRID_COUNT_Y;
const ctx = canvas.getContext('2d');

// 遊戲狀態
let snake = [
    {x: 10, y: 10}
];
let food = generateFood();
let direction = 'right';
let score = 0;
let gameLoop;
let isPaused = false;

// 獲取按鈕元素
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// 按鈕事件監聽
startBtn.addEventListener('click', () => {
    if (!gameLoop) {
        startGame();
    }
});

pauseBtn.addEventListener('click', () => {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
        isPaused = true;
    } else if (isPaused) {
        startGame();
        isPaused = false;
    }
});

resetBtn.addEventListener('click', resetGame);

// 生成食物
function generateFood() {
    const food = {
        x: Math.floor(Math.random() * GRID_COUNT_X),
        y: Math.floor(Math.random() * GRID_COUNT_Y)
    };
    
    // 確保食物不會生成在蛇身上
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        return generateFood();
    }
    return food;
}

// 更新遊戲狀態
function update() {
    const head = {...snake[0]};
    
    // 根據方向移動蛇頭
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 檢查碰撞
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // 檢查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }
}

// 檢查碰撞
function isCollision(head) {
    // 檢查牆壁碰撞
    if (head.x < 0 || head.x >= GRID_COUNT_X || head.y < 0 || head.y >= GRID_COUNT_Y) {
        return true;
    }
    
    // 檢查自身碰撞
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 遊戲結束
function gameOver() {
    clearInterval(gameLoop);
    alert(`遊戲結束！得分：${score}`);
    resetGame();
}

// 重置遊戲
function resetGame() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    score = 0;
    document.getElementById('score').textContent = score;
    food = generateFood();
    startGame();
}

// 繪製遊戲畫面
function draw() {
    // 清空畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製浮水印
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.font = '48px "Press Start 2P", "Comic Sans MS", cursive';
    ctx.fillStyle = '#FF69B4';
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-Math.PI/4);
    ctx.textAlign = 'center';
    ctx.fillText('HIRO Snake', 0, 0);
    ctx.restore();
    
    // 繪製蛇
    snake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.arc(
            segment.x * GRID_SIZE + GRID_SIZE/2,
            segment.y * GRID_SIZE + GRID_SIZE/2,
            GRID_SIZE/2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = index === 0 ? '#FF69B4' : '#FFB6C1';
        ctx.fill();
        
        // 為蛇頭添加眼睛
        if (index === 0) {
            ctx.fillStyle = '#FFF';
            const eyeSize = GRID_SIZE/6;
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            
            switch(direction) {
                case 'up':
                    leftEyeX = segment.x * GRID_SIZE + GRID_SIZE/3;
                    leftEyeY = segment.y * GRID_SIZE + GRID_SIZE/3;
                    rightEyeX = segment.x * GRID_SIZE + GRID_SIZE*2/3;
                    rightEyeY = segment.y * GRID_SIZE + GRID_SIZE/3;
                    break;
                case 'down':
                    leftEyeX = segment.x * GRID_SIZE + GRID_SIZE/3;
                    leftEyeY = segment.y * GRID_SIZE + GRID_SIZE*2/3;
                    rightEyeX = segment.x * GRID_SIZE + GRID_SIZE*2/3;
                    rightEyeY = segment.y * GRID_SIZE + GRID_SIZE*2/3;
                    break;
                case 'left':
                    leftEyeX = segment.x * GRID_SIZE + GRID_SIZE/3;
                    leftEyeY = segment.y * GRID_SIZE + GRID_SIZE/3;
                    rightEyeX = segment.x * GRID_SIZE + GRID_SIZE/3;
                    rightEyeY = segment.y * GRID_SIZE + GRID_SIZE*2/3;
                    break;
                case 'right':
                    leftEyeX = segment.x * GRID_SIZE + GRID_SIZE*2/3;
                    leftEyeY = segment.y * GRID_SIZE + GRID_SIZE/3;
                    rightEyeX = segment.x * GRID_SIZE + GRID_SIZE*2/3;
                    rightEyeY = segment.y * GRID_SIZE + GRID_SIZE*2/3;
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.arc(rightEyeX, rightEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // 繪製食物（蘋果造型）
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE/2,
        food.y * GRID_SIZE + GRID_SIZE/2,
        GRID_SIZE/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    
    // 添加蘋果葉子
    ctx.beginPath();
    ctx.moveTo(food.x * GRID_SIZE + GRID_SIZE/2, food.y * GRID_SIZE + 2);
    ctx.quadraticCurveTo(
        food.x * GRID_SIZE + GRID_SIZE/2 + 5,
        food.y * GRID_SIZE,
        food.x * GRID_SIZE + GRID_SIZE/2 + 8,
        food.y * GRID_SIZE + 4
    );
    ctx.fillStyle = '#4CAF50';
    ctx.fill();
}

// 遊戲主循環
function gameStep() {
    update();
    draw();
}

// 開始遊戲
function startGame() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, GAME_SPEED);
    isPaused = false;
}

// 改變方向的函數
function changeDirection(newDirection) {
    switch(newDirection) {
        case 'up':
            if (direction !== 'down') direction = 'up';
            break;
        case 'down':
            if (direction !== 'up') direction = 'down';
            break;
        case 'left':
            if (direction !== 'right') direction = 'left';
            break;
        case 'right':
            if (direction !== 'left') direction = 'right';
            break;
    }
}

// 鍵盤控制
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp': changeDirection('up'); break;
        case 'ArrowDown': changeDirection('down'); break;
        case 'ArrowLeft': changeDirection('left'); break;
        case 'ArrowRight': changeDirection('right'); break;
    }
});

// 虛擬控制器事件處理
const directionButtons = document.querySelectorAll('.direction-btn[data-direction]');

// 滑鼠點擊和觸控事件
directionButtons.forEach(button => {
    const handleDirectionChange = () => {
        const newDirection = button.getAttribute('data-direction');
        changeDirection(newDirection);
    };

    button.addEventListener('mousedown', handleDirectionChange);
    button.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 防止觸控時的滾動
        handleDirectionChange();
    });
});

// 啟動遊戲
startGame();