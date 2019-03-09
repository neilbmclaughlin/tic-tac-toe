import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
      return {
        winner: squares[a],
        winningLine: lines[i],
      }
    }
  }
  return null;
}

function Reverse(props) {
  return (
    <button className="reverse" onClick={props.onClick }>Reverse</button>
  );
}

function Square(props) {
  const classes = `square ${props.highlight ? 'highlight' : '' }`
  return (
    <button className={classes} onClick={ props.onClick }>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, highlight) {
    return (
      <Square
        key={i}
        highlight={highlight}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i) }
      />
    )
  };

  getRowSquares(row, winningLine) {
    const squares = [];
    for(var column = 0; column < 3; column++) {
      const squareNumber = (row * 3) + column;
      const highlight = winningLine.includes(squareNumber);
      squares.push(this.renderSquare(squareNumber, highlight));
    }
    return squares;
  }

  getBoardSquares(winningLine) {
    const squares = [];
    for(var row = 0; row < 3; row++) {
        squares.push(
          <div key={row} className="board-row">{this.getRowSquares(row, winningLine)}</div>
        );
    }
    return squares;
  }

  render() {
    return (
      <div>{this.getBoardSquares(this.props.winningLine)}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        count: 0,
      }],
      xIsNext: true,
      stepNumber: 0,
      reverse: false,
    }
  }
  getMoveCharacter() {
    return this.state.xIsNext ? 'X' : 'O';
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  };
  reverse() {
    this.setState({ reverse: !this.state.reverse });
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.getMoveCharacter();
    const xIsNext = !this.state.xIsNext;
    this.setState({
      history: history.concat([{
        squares,
        play: i,
        player: this.getMoveCharacter(),
        count: history.length,
      }]),
      xIsNext,
      stepNumber: history.length,
    });
  }
  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];

    const moves = history.map( (step, move) => {
      let description;
      if (move) {
        const row = Math.floor(step.play / 3) + 1; 
        const column = (step.play % 3) + 1;
        description = `Rewind to move ${move} (Player: ${step.player}, Row: ${row}, Column: ${column})`
      } else {
        description = 'Restart Game';
      }
      const fontWeight = ( move === history.length - 1 ) ? 'bold' : 'normal' ; 
      return (
       <li key={move}>
         <button style={{'fontWeight': fontWeight }} onClick={() => this.jumpTo(move)}>{description}</button>
       </li>
      );
    });

    let status;
    const winnerDetails = calculateWinner(current.squares);
    if (winnerDetails) {
      status = `Winner: ${winnerDetails.winner}`;
    } else if (current.squares.every((s) => s)) {
      status = 'Draw'
    } else {
      status =  `Next player: ${this.getMoveCharacter()}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
             squares={current.squares}
             winningLine={winnerDetails ? winnerDetails.winningLine : []}
             onClick={(i) => this.handleClick(i) }
        />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul>{ this.state.reverse ? moves.reverse() : moves }</ul>
          <div>
            <Reverse onClick={() => this.reverse()}/>
          </div>
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
