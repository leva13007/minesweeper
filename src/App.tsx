import { useState } from 'react'
import './App.css'

const rows = 10;
const columns = 8;
const mines = 4;

type Cell = {
  isMine: boolean;
  isFlagged: boolean;
  isClicked: boolean;
}

const grid: Cell[][] = Array(rows).fill(null).map(() => Array(columns).fill(null).map(() => ({
  isMine: false,
  isFlagged: false,
  isClicked: false,
})));

const createGrid = (): Cell[][] => {
  const copyGrid = grid.map(row => row.map(cell => ({...cell})));
  let placedMines = 0;
  while(mines > placedMines){
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);
    if (!copyGrid[r][c].isMine) {
      copyGrid[r][c].isMine = true;
      placedMines++;
    }
  }
  return copyGrid;
}

function App() {

  const board = createGrid()
  console.log(board);

  const leftClickHandler = () => {}
  return (
    <>
      <header>
        <h1>Minesweeper</h1>
      </header>
      <main className="main">
        {
          board.map((row,i) => (
            <div key={i} className="board-row">
              {
                row.map((cell, j) => (
                  <button onClick={leftClickHandler} key={j} className="board-cell">
                    {
                      cell.isMine && (
                        <span>M</span>
                      )
                    }
                  </button>
                ))
              }
            </div>
          ))
        }
      </main>
    </>
  )
}

export default App
