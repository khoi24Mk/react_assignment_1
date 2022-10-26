import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const SQUARE = 3;
const WIN = 3;
let win_square = [];

function Square(props) {
  return (
    <button
      className={"square " + (props.isWin ? "square-win" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWin={this.props.winSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(n) {
    let row = [];
    for (let i = n; i < n + SQUARE; i++) {
      row = row.concat(this.renderSquare(i));
      //   console.log(row);
    }
    return row;
  }

  renderRows() {
    let rows = [];
    for (let i = 0; i < SQUARE ** 2; i += SQUARE) {
      rows = rows.concat(<div className="board-row">{this.renderRow(i)}</div>);
      //   console.log(rows);
    }
    return rows;
  }

  render() {
    return <div>{this.renderRows()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isIncreasing: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i] || !squares.includes(null)) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: [Math.floor(i / SQUARE), i % SQUARE],
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  sortHandler() {
    this.setState({
      isIncreasing: !this.state.isIncreasing,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " - " + history[move].location
        : "Go to game start";
      return (
        <li key={move}>
          <button
            style={{ fontWeight: this.state.stepNumber === move ? "bold" : "" }}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (!current.squares.includes(null)) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    console.log("WINNER");
    console.log(win_square);
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winSquares={winner ? win_square : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.sortHandler()}>Sort</button>
          <ol>{this.state.isIncreasing ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function winHandlerRow(squares, currentIndex, limit) {
  if (limit === 1) {
    win_square.push(currentIndex);
    return true;
  }

  if (currentIndex % SQUARE === SQUARE - 1) {
    win_square.length = 0;
    return false;
  }

  if (
    squares[currentIndex] === squares[currentIndex + 1] &&
    squares[currentIndex] != null
  ) {
    win_square.push(currentIndex);
    return winHandlerRow(squares, currentIndex + 1, --limit);
  }

  win_square.length = 0;
  return false;
}

function winHandlerColumn(squares, currentIndex, limit) {
  if (limit === 1) {
    win_square.push(currentIndex);
    return true;
  }
  console.log("index " + currentIndex);
  console.log(Math.floor(currentIndex / SQUARE));
  if (Math.floor(currentIndex / SQUARE) === SQUARE - 1) {
    win_square.length = 0;
    return false;
  }

  if (
    squares[currentIndex] === squares[currentIndex + SQUARE] &&
    squares[currentIndex] != null
  ) {
    win_square.push(currentIndex);
    return winHandlerColumn(squares, currentIndex + SQUARE, --limit);
  }

  win_square.length = 0;
  return false;
}

function windHandlerLine1(squares, currentIndex, limit) {
  if (limit === 1) {
    win_square.push(currentIndex);
    return true;
  }
  //   console.log("index " + currentIndex);
  //   console.log(Math.floor(currentIndex / 5));
  if (Math.floor(currentIndex / SQUARE) === SQUARE - 1) {
    win_square.length = 0;
    return false;
  }
  if (currentIndex % SQUARE === SQUARE - 1) {
    win_square.length = 0;
    return false;
  }
  if (
    squares[currentIndex] === squares[currentIndex + SQUARE + 1] &&
    squares[currentIndex] != null
  ) {
    console.log(currentIndex);
    win_square.push(currentIndex);
    return windHandlerLine1(squares, currentIndex + SQUARE + 1, --limit);
  }

  win_square.length = 0;
  return false;
}

function windHandlerLine2(squares, currentIndex, limit) {
  if (limit === 1) {
    win_square.push(currentIndex);
    return true;
  }
  //   console.log("index " + currentIndex);
  //   console.log(Math.floor(currentIndex / 5));
  if (Math.floor(currentIndex / SQUARE) === SQUARE - 1) {
    win_square.length = 0;
    return false;
  }
  if (currentIndex % SQUARE === 0) {
    win_square.length = 0;
    return false;
  }
  if (
    squares[currentIndex] === squares[currentIndex + SQUARE - 1] &&
    squares[currentIndex] != null
  ) {
    console.log(currentIndex);
    win_square.push(currentIndex);
    return windHandlerLine2(squares, currentIndex + SQUARE - 1, --limit);
  }

  win_square.length = 0;
  return false;
}

function calculateWinner(squares) {
  console.log(squares);
  console.log(squares.length);
  for (let i = 0; i < squares.length; i++) {
    if (
      winHandlerRow(squares, i, WIN) ||
      winHandlerColumn(squares, i, WIN) ||
      windHandlerLine1(squares, i, WIN) ||
      windHandlerLine2(squares, i, WIN)
    ) {
      console.log("win");
      return squares[i];
    }
  }

  return null;
}
