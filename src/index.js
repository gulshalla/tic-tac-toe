import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight':'');
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }

  createBoard = () => {
    let board = [];
    let count = 0;
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j ++) {
        row.push(this.renderSquare(count));
        count += 1;
      }
      board.push(<div className="board-row">{row}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      isAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleSortToggle() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  calculateWinner(squares) {
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

    let isDraw = true;
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a], 
          line: lines[i],
          isDraw: false,
        };
      }
    }
    return {
      winner: null,
      line: null,
      isDraw: isDraw,
    };
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winData = this.calculateWinner(current.squares);
    const winner = winData.winner;
    const isAscending = this.state.isAscending;

    const moves = history.map((step, move) => {
      const lastMove = step.lastMove;
      const row = 1 + Math.floor(lastMove / 3);
      const col = 1 + lastMove % 3;
      const desc = move ? `Go to move #${move} (${row}, ${col})` : 'Go to game start';
      return (
        <li key={move}> 
          <button 
            className={move === this.state.stepNumber ? 'move-list-item-selected' : ''}
            onClick={() => this.jumpTo(move)}> {desc} 
          </button>
        </li>
      );
    });

    if (!isAscending) moves.reverse();
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (winData.isDraw) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winData.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}> 
            {isAscending ? 'Descending':'Ascending'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
