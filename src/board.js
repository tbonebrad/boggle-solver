import dictionary from './dictionary_word_list.json';

export default class Board {
    constructor() {
        this.boardSize = 4;
        this.maxIndex = this.boardSize - 1;

        this.moves = [this.moveUp, this.moveUpRight, this.moveRight, this.moveDownRight, this.moveDown, this.moveDownLeft, this.moveLeft, this.moveUpLeft];

        this.drawBoard();
        $('#calculate-button').on('click', () => {
            $('.results').empty();
            let board = this.collectBoardInputs();
            let words = {};
            for(let i = 0; i < this.boardSize; i++) {
                for(let j = 0; j < this.boardSize; j++){
                    this.findWords(words, board, [[i,j]]);
                }
            }
            let $results = $('.results');
            Object.getOwnPropertyNames(words).forEach((word) => {
                $results.append('<li>' + word + '</li>');
            });
            console.log(words);
        });

        $( ".letter-input" ).keypress(function(e) {
            let key = e.keyCode;
            if (key >= 48 && key <= 57) {
                e.preventDefault();
                return;
            }

            let currentText = e.target.value;
            if(!currentText.length) {
                return;
            } else {
                currentText = currentText.toLowerCase();
            }
            if(currentText == 'q' && (key == 85 || key == 117)){
                return;
            } else {
                e.preventDefault();
            }

        });

    }

    drawBoard() {
        let $board = $('#board');

        for(let i = 0; i < this.boardSize; i++) {
            let html = '<div class="row">';
            for(let j = 0; j < this.boardSize; j++) {
                html = html + '<div class="col letter"><input type="text" class="form-control letter-input"></div>';
            }
            $board.append(html + '</div>');
        }
    }

    collectBoardInputs() {
        let board = [];
        document.querySelectorAll('.letter-input').forEach((element, index) => {
            let row = parseInt(index / this.boardSize);
            let column = index % this.boardSize;
            let value = element.value.toLowerCase();
            if(column == 0){
                board.push([value]);
            } else {
                board[row].push(value);
            }
        });
        return board;
    }

    isValidMove(desiredPosition, previousPositions) {
        if(desiredPosition[0] > this.maxIndex || desiredPosition[1] > this.maxIndex
            || desiredPosition[0] < 0 || desiredPosition[1] < 0){
            return false;
        }
        return !previousPositions.filter((previousPosition) => {
           return desiredPosition[0] == previousPosition[0]
            && desiredPosition[1] == previousPosition[1];
        }).length;
    }

    isValidWord(word){
        return dictionary[word] != undefined;
    }

    isQU(board, position){
        return board[position[0]][position[1]] == 'qu';
    }

    getWordFromPath(board, previousPositions){
        let word = '';
        previousPositions.forEach((position) => {
            word += board[position[0]][position[1]];
        });
        return word;
    }

    moveUp(currentPosition) {
        return [currentPosition[0] - 1, currentPosition[1]];
    }
    moveUpRight(currentPosition) {
        return [currentPosition[0] - 1, currentPosition[1] + 1];
    }
    moveRight(currentPosition) {
        return [currentPosition[0], currentPosition[1] + 1];
    }
    moveDownRight(currentPosition) {
        return [currentPosition[0] + 1, currentPosition[1] + 1];
    }
    moveDown(currentPosition) {
        return [currentPosition[0] + 1, currentPosition[1]];
    }
    moveDownLeft(currentPosition) {
        return [currentPosition[0] + 1, currentPosition[1] - 1];
    }
    moveLeft(currentPosition) {
        return [currentPosition[0], currentPosition[1] - 1];
    }
    moveUpLeft(currentPosition) {
        return [currentPosition[0] - 1, currentPosition[1] - 1];
    }

    findWords(possibleWords, board, previousPositions) {
        let word = this.getWordFromPath(board, previousPositions);
        if(word.length > 2 && this.isValidWord(word)){
            possibleWords[word] = 1;
        }
        this.moves.forEach((move) => {
            let newPosition = move(previousPositions[previousPositions.length - 1]);
            if(!this.isValidMove(newPosition, previousPositions)) {
                return;
            }
            this.findWords(possibleWords, board, previousPositions.concat([newPosition]));
        });
    }
}