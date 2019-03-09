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
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i) }
      />
    )
  };
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i] ) {
      return
    }
    squares[i] = this.getMoveCharacter();
    const xIsNext = !this.state.xIsNext;
    this.setState({
      history: history.concat([{
        squares,
        play: i,
        player: this.getMoveCharacter(),
      }]),
      xIsNext,
      stepNumber: history.length,
    });
  }
  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step, move) => {
      let description;
      if (move) {
        const row = Math.floor(step.play / 3) + 1; 
        const column = (step.play % 3) + 1;
        description = `Go to move ${move} (Player: ${step.player}, Row: ${row}, Column: ${column})`
      } else {
        description = 'Go to game start';
      }
      const fontWeight = ( move === history.length - 1 ) ? 'bold' : 'normal' ; 
      return (
       <li key={move}>
         <button style={{'fontWeight': fontWeight }} onClick={() => this.jumpTo(move)}>{description}</button>
       </li>
      );
    });


    const status = winner ? `Winner: ${winner}` : `Next player: ${this.getMoveCharacter()}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
             squares={current.squares}
             onClick={(i) => this.handleClick(i) }
        />
        </div>
        <div className="game-info">
          <div>{status}</div>
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
