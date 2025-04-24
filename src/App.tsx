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
})))

function App() {
  console.log(grid);

  const leftClickHandler = () => {}
  return (
    <>
      <header>
        <h1>Minesweeper</h1>
      </header>
      <main className="main">
        {
          grid.map((row,i) => (
            <div key={i} className="board-row">
              {
                row.map((cell, j) => (
                  <button onClick={leftClickHandler} key={j} className="board-cell"></button>
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
