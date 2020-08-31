// Criando um módulo para deixar o código privado.
(()=>{

    // Declarando variáveis e objetos utilizados para o jogo.
    const X = 'X';
    const O = 'O';

    let jogador;
    let board = intialState();

    let jogo = {
        jogada1: document.querySelector('.jogo-velha-1'),
        jogada2: document.querySelector('.jogo-velha-2'),
        jogada3: document.querySelector('.jogo-velha-3'),
        jogada4: document.querySelector('.jogo-velha-4'),
        jogada5: document.querySelector('.jogo-velha-5'),
        jogada6: document.querySelector('.jogo-velha-6'),
        jogada7: document.querySelector('.jogo-velha-7'),
        jogada8: document.querySelector('.jogo-velha-8'),
        jogada9: document.querySelector('.jogo-velha-9')
    }

    var opcoes = {
        divOpcoesJogo : document.querySelector('.opcoes-jogo'),
        btnJogarX : document.getElementById('btn-jogar-x'),
        btnJogarO : document.getElementById('btn-jogar-o'),
        btnReiniciar: document.getElementById('btn-reiniciar'),
        proximoJogar : document.querySelector('.proximo-jogar')
    };

    // Capturando os eventos de click
    opcoes.btnJogarX.addEventListener('click', () => {
        jogador = X;

        // Esconde as opções e mostrar o texto do jogador.
        opcoes.divOpcoesJogo.classList.add('esconder');
        opcoes.proximoJogar.textContent = `Jogar como ${jogador}`;
    });
    
    opcoes.btnJogarO.addEventListener('click', () => {
        jogador = O;

        // Esconde as opções e inicia com a AI.
        opcoes.divOpcoesJogo.classList.add('esconder');
        _marcarJogada(minimax(board));
    });

    //Retorna o jogo para o estado original
    opcoes.btnReiniciar.addEventListener('click', () => {
        board = intialState();
        _atualizarJogo();
        opcoes.btnReiniciar.classList.add('esconder');
        opcoes.proximoJogar.textContent = '';
        opcoes.divOpcoesJogo.classList.remove('esconder');
    });


    jogo.jogada1.addEventListener('click', (e)=>{
        jogada(e, [0, 0]);
    });

    jogo.jogada2.addEventListener('click', (e)=>{
        jogada(e, [0, 1]);
    });

    jogo.jogada3.addEventListener('click', (e)=>{
        jogada(e, [0, 2]);
    });

    jogo.jogada4.addEventListener('click', (e)=>{
        jogada(e, [1, 0]);
    });

    jogo.jogada5.addEventListener('click', (e)=>{
        jogada(e, [1, 1]);
    });

    jogo.jogada6.addEventListener('click', (e)=>{
        jogada(e, [1, 2]);
    });

    jogo.jogada7.addEventListener('click', (e)=>{
        jogada(e, [2, 0]);
    });

    jogo.jogada8.addEventListener('click', (e)=>{
        jogada(e, [2, 1]);
    });

    jogo.jogada9.addEventListener('click', (e)=>{
        jogada(e, [2, 2]);
    });

    // Funções utilizadas no jogo

    function _marcarJogada(action){
        currentPlayer = player(board);
        x = action[0]
        y = action[1]
        board[x][y] = currentPlayer;
        _atualizarJogo();
        opcoes.proximoJogar.textContent = `Jogar como ${jogador}`;
        
        if (terminal(board))          
            gameOver();
    }

    function jogada(e, boardIndex){

        if(e.target.textContent || !jogador){
            return;
        }

        _marcarJogada(boardIndex);

        if (!terminal(board)){
            opcoes.proximoJogar.textContent = "Computador pensando...";
            setTimeout(() => {
                _marcarJogada(minimax(board))    
            }, 300); 
        }
    }

    function _atualizarJogo(){
        jogo.jogada1.textContent = board[0][0];
        jogo.jogada2.textContent = board[0][1];
        jogo.jogada3.textContent = board[0][2];
        jogo.jogada4.textContent = board[1][0];
        jogo.jogada5.textContent = board[1][1];
        jogo.jogada6.textContent = board[1][2];
        jogo.jogada7.textContent = board[2][0];
        jogo.jogada8.textContent = board[2][1];
        jogo.jogada9.textContent = board[2][2];
    }

    function gameOver(){
        jogador = null;
        opcoes.btnReiniciar.classList.remove('esconder');
        let vencedor = winner(board);
        if (!vencedor){
            opcoes.proximoJogar.textContent = "Game over: Velha";
            return;
        }
        opcoes.proximoJogar.textContent = `Game over: Jogador ${vencedor} vence!`;
    }

    function intialState(){
        return [[null, null, null], 
                [null, null, null], 
                [null, null, null]]
    }

    function player(board){
        let count = 0;
        for (array of board){
            count += array.filter(x => x).length
        }
        return (count % 2 ? O : X);
    }

    function actions(board){
        let actionSet = new Set();
        
        for ([x, i] of board.entries()){
            for([y, j] of i.entries()){
                if (!j){
                actionSet.add([x, y])
                }
            }
        }
        return actionSet;
    }

    function result(board, action){
        let x = action[0];
        let y = action[1];

        currentPlayer = player(board);
        let boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy[x][y] = currentPlayer;
        return boardCopy;
    }

    function winner(board){

        let estrategias = [ [board[0][0], board[0][1], board[0][2]],
                            [board[1][0], board[1][1], board[1][2]],
                            [board[2][0], board[2][1], board[2][2]],
                            [board[0][0], board[1][0], board[2][0]],
                            [board[0][1], board[1][1], board[2][1]],
                            [board[0][2], board[1][2], board[2][2]],
                            [board[0][0], board[1][1], board[2][2]],
                            [board[0][2], board[1][1], board[2][0]] ]   
        
        for (estrategia of estrategias){
            if (estrategia.filter(x => x == estrategia[0]).length == 3 && estrategia[0])
                return estrategia[0];
        }

        return null;   
    }

    function terminal(board){
        if (winner(board) || board.toString().length == 17)
            return true;
        
        return false;
    }

    function utility(board){
        let final = winner(board);

        if (!final)
            return 0
        
        return (final == X ? 1 : -1)
    }

    //Funções AI
    function minimax(board){
        if (terminal(board))
            return null;
        
        let bestAction = null;
        let alpha = -Infinity;
        let beta = Infinity;

        let currentValue;
        if (player(board) == X){
            let bestValue = alpha;
            for (action of actions(board)){
                currentAction = action;
                currentValue = minValue(result(board, action), alpha, beta);
                if (currentValue > bestValue){
                    bestValue = currentValue;
                    bestAction = currentAction;
                }
            }
            return bestAction;
        }
        else{
            let bestValue = beta;
            for (action of actions(board)){
                currentAction = action;
                currentValue = maxValue(result(board, action), alpha, beta);
                if (currentValue < bestValue){
                    bestValue = currentValue;
                    bestAction = currentAction;
                }
            }
            return bestAction;
        }
    }

    function maxValue(board, alpha, beta){
        if (terminal(board))
            return utility(board)
        
        let value = -Infinity;

        for (action of actions(board)){
            value = Math.max(value, minValue(result(board, action), alpha, beta));
            alpha = Math.max(alpha, value);
            if (alpha >= beta)
                break;
        }
        return value;
    }

    function minValue(board, alpha, beta){
        if (terminal(board))
            return utility(board);

        let value = Infinity;

        for (action of actions(board)){
            value = Math.min(value, maxValue(result(board, action), alpha, beta));
            beta = Math.min(beta, value);
            if (beta <= alpha)
                break
        }
        return value;
    }

})()