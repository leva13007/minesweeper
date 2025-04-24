import React, { useState } from 'react'
import './App.css'

const rows = 10;
const columns = 8;
const mines = 4;

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

const directions = [
  [-1,-1], [-1,0], [-1,1],
  [0, -1],         [0, 1],
  [1,-1],  [1,0],  [1,1]
]

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

const waterFallHandler = (g: Cell[][], row: number, col: number): Cell[][] => {
  const copyGrid = g.map(row => row.map(cell => ({...cell})));
  const visited = new Set<string>();
  const dfs = (r: number, c: number) => {
    const key = `${r}-${c}`;
    const cell = copyGrid?.[r]?.[c];
    if (!cell || cell.isClicked || cell.isFlagged || visited.has(key)) return;

    visited.add(key);
    cell.isClicked = true;

    if(cell.mineCount === 0 && !cell.isMine){
      for (let [dr, dc] of directions){
        dfs(r+dr, c+dc)
      }
    }
  }
  dfs(row, col);
  return copyGrid;
}

function App() {
  const [board, setBoard] = useState(createGrid())

  const leftClickHandler = (r: number,c: number) => {
    if (board[r][c].isFlagged) return;
    setBoard(prev => {
      const copyGrid = prev.map(row => row.map(cell => ({...cell})));
      const cell = copyGrid[r][c];
      if (cell.mineCount === 0) {
        return waterFallHandler(copyGrid, r, c);
      }

      copyGrid[r][c].isClicked = true;
      return copyGrid;
    });
  }

  const rightClickHandler = (e: React.MouseEvent, r: number,c: number) => {
    e.preventDefault();
    if (board[r][c].isClicked) return;
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
                        cell.isClicked ? (
                          cell.isMine ? (
                            <span className="mine">💣</span>
                          ) : cell.mineCount ? (
                            <span className={`mine-count-${cell.mineCount}`}>{cell.mineCount}</span>
                          ) : null
                        ) : null
                      }
                      {
                        cell.isFlagged && (
                          <span>🚩</span>
                        )
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
