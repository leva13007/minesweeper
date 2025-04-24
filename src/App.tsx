import React, { useState } from 'react'
import './App.css'

const rows = 10;
const columns = 8;
const mines = 14;

type Cell = {
  isMine: boolean;
  isFlagged: boolean;
  isClicked: boolean;
  mineCount: number;
}

const grid: Cell[][] = Array(rows).fill(null).map(() => Array(columns).fill(null).map(() => ({
  isMine: false,
  isFlagged: false,
  isClicked: false,
  mineCount: 0,
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

  const directions = [
    [-1,-1], [-1,0], [-1,1],
    [0, -1],         [0, 1],
    [1,-1],  [1,0],  [1,1]
  ]

  for(let r = 0; r< rows; r++) {
    for(let c = 0; c< columns; c++) {
      if(copyGrid[r][c].isMine) continue;

      let count = 0;
      for (let [dr, dc] of directions){
        if (copyGrid?.[r + dr]?.[c + dc]?.isMine) count++;
      }
      copyGrid[r][c].mineCount = count;
    }
  }

  return copyGrid;
}

function App() {
  const [board, setBoard] = useState(createGrid())

  const leftClickHandler = (r: number,c: number) => {
    setBoard(prev => {
      const copyGrid = prev.map(row => row.map(cell => ({...cell})));
      copyGrid[r][c].isClicked = true;
      return copyGrid;
    });
  }

  const rightClickHandler = (e: React.MouseEvent, r: number,c: number) => {
    e.preventDefault();
    setBoard(prev => {
      const copyGrid = prev.map(row => row.map(cell => ({...cell})));
      copyGrid[r][c].isFlagged = !copyGrid[r][c].isFlagged;
      return copyGrid;
    });
  }

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
                row.map((cell, j) => {
                  const className = cell.isClicked ? "clicked" : ''
                  return (
                    <button
                      onClick={() => leftClickHandler(i,j)}
                      onContextMenu={(e: React.MouseEvent) => rightClickHandler(e,i,j)}
                      key={j}
                      className={`board-cell ${className}`}
                    >
                      {
                        cell.isMine && (
                          <span>💣</span>
                        )
                      }
                      {
                        cell.isFlagged && (
                          <span>🚩</span>
                        )
                      }
                      {
                        cell.mineCount ? (
                          <span>{cell.mineCount}</span>
                        ) : null
                      }
                    </button>
                  )
                })
              }
            </div>
          ))
        }
      </main>
    </>
  )
}

export default App
