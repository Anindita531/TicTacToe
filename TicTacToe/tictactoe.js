let currentPlayer = 'X';
let player1Name = '';
let player2Name = '';
let board = Array(9).fill('');
let gameMode = '';
let gameOver = false;
let player1Score = 0;
let player2Score = 0;

function startGame(mode){
    gameMode = mode;
    if(mode === 'friend'){
        document.getElementById('playerNames').style.display = 'block';
    } else {
        player1Name = prompt("Enter your name:", "You") || "You";
        player2Name = "Computer";
        document.getElementById('playerNames').style.display = 'none';
        document.getElementById('board').style.display = 'grid';
    }
}

function startTwoPlayerGame(){
    player1Name = document.getElementById('player1Name').value || 'Player 1';
    player2Name = document.getElementById('player2Name').value || 'Player 2';
    document.getElementById('playerNames').style.display = 'none';
    document.getElementById('board').style.display = 'grid';
    renderBoard();
}

function handleMove(index){
    if(!gameOver && board[index]===''){
        board[index] = currentPlayer;
        renderBoard();

        let winnerCells = checkWinner();
        if(winnerCells.length){
            highlightWinningCells(winnerCells);
            showWinner(currentPlayer);
            updateScore(currentPlayer);
            gameOver = true;
            return;
        } else if(board.every(c=>c!=='')){
            showWinner('');
            gameOver = true;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if(gameMode==='computer' && currentPlayer==='O' && !gameOver){
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove(){
    let emptyCells = board.map((c,i)=>c===''?i:null).filter(i=>i!==null);
    if(emptyCells.length){
        let move = emptyCells[Math.floor(Math.random()*emptyCells.length)];
        board[move]='O';
        renderBoard();

        let winnerCells = checkWinner();
        if(winnerCells.length){
            highlightWinningCells(winnerCells);
            showWinner('O');
            gameOver=true;
        } else if(board.every(c=>c!=='')){
            showWinner('');
            gameOver=true;
        } else {
            currentPlayer='X';
        }
    }
}

function renderBoard(){
    const allCells = document.querySelectorAll('.cell');
    for(let i = 0; i < allCells.length; i++){
        allCells[i].innerText = board[i];

        // Skip coloring finished (winning) cells
        if(allCells[i].classList.contains('finished')) continue;

        // Reset any previous winning animation
        allCells[i].classList.remove('winning-cell');

        if(board[i] === 'X'){
            allCells[i].style.backgroundColor = 'green';
        } else if(board[i] === 'O'){
            allCells[i].style.backgroundColor = 'red';
        } else {
            allCells[i].style.backgroundColor = '#2CBE20';
        }
    }
}

function checkWinner(){
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for(let win of wins){
        const [a,b,c]=win;
        if(board[a]!=='' && board[a]===board[b] && board[a]===board[c]){
            return win;
        }
    }
    return [];
}

function highlightWinningCells(cells){
    const allCells = document.getElementsByClassName('cell');
    for(let i=0;i<allCells.length;i++){
        if(cells.includes(i)){
            allCells[i].classList.add('winning-cell');

            allCells[i].addEventListener('animationend', function handler() {
                allCells[i].classList.remove('winning-cell');
                allCells[i].classList.add('finished');
                allCells[i].style.backgroundColor = '#FFD700'; // permanent gold
                allCells[i].removeEventListener('animationend', handler);
            });
        }
    }
}

function showWinner(winner){
    const box = document.getElementById('winnerBox');
    if(winner==='X'){
        box.style.backgroundColor='green';
        box.innerText = player1Name + ' wins!';
    } else if(winner==='O'){
        box.style.backgroundColor='red';
        box.innerText = gameMode==='computer' ? 'Computer wins!' : player2Name + ' wins!';
    } else {
        box.style.backgroundColor='black';
        box.style.color='white';
        box.innerText='DRAW!';
    }
    box.style.display='block';
}

function updateScore(winner){
    if(winner==='X') player1Score++;
    if(winner==='O') player2Score++;
}

function resetGame(){
    board.fill('');
    renderBoard();
    currentPlayer='X';
    gameOver=false;
    document.getElementById('winnerBox').style.display='none';
    // remove finished classes
    document.querySelectorAll('.cell').forEach(cell=>{
        cell.classList.remove('finished','winning-cell');
    });
}

function closePopup(){
    document.getElementById('popup').style.display='none';
}
