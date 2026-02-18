class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (/[^1-9.]/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    return true;
  }

  letterToNumber(row) {
    const lookup = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8 };
    return lookup[row.toLowerCase()];
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    let r = this.letterToNumber(row);
    for (let i = 0; i < 9; i++) {
      if (grid[r][i] == value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    let c = column - 1;
    for (let i = 0; i < 9; i++) {
      if (grid[i][c] == value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    let r = this.letterToNumber(row);
    let c = column - 1;
    let startRow = r - (r % 3);
    let startCol = c - (c % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] == value) return false;
      }
    }
    return true;
  }

  transform(puzzleString) {
    let grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
    }
    return grid;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    let grid = this.transform(puzzleString);
    if (this.recursiveSolve(grid)) {
      return { solution: grid.flat().join('') };
    }
    return { error: 'Puzzle cannot be solved' };
  }

  recursiveSolve(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num.toString();
              if (this.recursiveSolve(grid)) return true;
              grid[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isValid(grid, row, col, num) {
    num = num.toString();
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;