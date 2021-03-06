import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//FIX TODO:
// 1. Update setState calls to use prevState instead of this.state.
//
// 2. Change callbacks using the handling events page's [https://reactjs.org/docs/handling-events.html]
//    recommended method.

//FEATURE TODO:
//1. [-] Display location of each move using row and col.
//2. [ ] Bold the currently selected item in a move.
//3. [-] Use loops to store board state instead of hardcoding it.
//4. [-] Option to sort moves in ascending and descending order.
//5. [-] Highlight the winning squares.
//6. [-] Display a draw message when no one wins. 


function Square(props) {

    let style = null;

    if (props.highlight) {
        style = { backgroundColor: '#4CAF50' };
    }

    return (
        <button className='square'
            onClick={(props.onClick)} style={style}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        }
    }

 

    renderSquare(i, winner) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={winner && winner.includes(i)}
            />);
    }

    render() {
        
        return (
            <div>
                {
                    Array(3).fill(1).map((_, i) => (
                            <div className="board-row">
                                {this.renderSquare(0 + i*3, this.props.winner)}
                                {this.renderSquare(1 + i*3, this.props.winner)}
                                {this.renderSquare(2 + i*3, this.props.winner)}
                            </div>
                        
                    ))
                }
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            selected: [],
            stepNumber: 0,
            xIsNext: true,
            reverse: false,
        }

        this.handleClick = this.handleClick.bind(this)
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        let selected;
        if(this.state.selected.length === 0){
            selected = this.state.selected.slice();
        }else{
            selected = this.state.selected.slice(0, this.state.stepNumber);
        }
        const current = history[history.length - 1];
        const squares = current.squares.slice()

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? "X" : "O"
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            selected: selected.concat([i]),
            //incorrect way of accessing previous state
            xIsNext: !this.state.xIsNext
        })
    }

    checkComplete(squares) {
        for (let i = 0; i < 10; i++) {
            if (squares[i] === null) return false;
        }
        return true;
    }


    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;

        console.log(this.state.selected)

        if (winner) {
            status = `Winner: ${winner[3]}`
        } else if (this.checkComplete(current.squares)) {
            status = `Match draw`
        } else {
            status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
        }

        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ` where ${this.state.selected[move-1] + 1} was selected`:
                'Go to game start';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })

        if (this.state.reverse) {
            moves.reverse()
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={this.handleClick} winner={winner} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => {
                        this.setState({
                            reverse: !this.state.reverse
                        })
                    }}> {this.state.reverse ? 'Ascending' : 'Descending'}  </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [...lines[i], squares[a]];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

