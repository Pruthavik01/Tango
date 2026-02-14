// src/components/generate.js

// ============================================
// PUBLIC FUNCTION
// ============================================

export function generatePuzzle(n) {
  if (n % 2 !== 0) {
    throw new Error("Grid size must be even (4, 6, 8...)");
  }

  const solution = generateFullSolution(n);

  const allRelations = generateRelationsFromSolution(solution);

  // 🎯 Random number of hints based on board size
  const relations = pickRandomRelations(n, allRelations);

  // 🟡 Prefilled icons (sun/moon) — a few true values to help the player
  const prefills = pickRandomPrefills(n, solution);

  return { solution, relations, prefills };
}

// ============================================
// RANDOM FULL VALID SOLUTION
// ============================================

function generateFullSolution(n) {
  const board = Array.from({ length: n }, () => Array(n).fill(null));

  solveBoard(board, n);

  // shuffle rows & columns for variety
  shuffle(board);
  shuffleColumns(board);

  return board;
}

function solveBoard(board, n, row = 0, col = 0) {
  if (row === n) return true;

  const nextRow = col === n - 1 ? row + 1 : row;
  const nextCol = col === n - 1 ? 0 : col + 1;

  const values = shuffle(["sun", "moon"]);

  for (let value of values) {
    board[row][col] = value;

    if (isValid(board, n, row, col)) {
      if (solveBoard(board, n, nextRow, nextCol)) {
        return true;
      }
    }
  }

  board[row][col] = null;
  return false;
}

// ============================================
// TAKUZU RULES
// ============================================

function isValid(board, n, row, col) {
  const value = board[row][col];

  // No 3 in a row
  if (
    col >= 2 &&
    board[row][col - 1] === value &&
    board[row][col - 2] === value
  )
    return false;

  // No 3 in column
  if (
    row >= 2 &&
    board[row - 1][col] === value &&
    board[row - 2][col] === value
  )
    return false;

  // Max n/2 per row
  if (board[row].filter((v) => v === value).length > n / 2) return false;

  // Max n/2 per column
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (board[i][col] === value) count++;
  }
  if (count > n / 2) return false;

  // No duplicate full rows
  if (board[row].every((v) => v !== null)) {
    for (let i = 0; i < row; i++) {
      if (board[i].every((v, idx) => v === board[row][idx])) {
        return false;
      }
    }
  }

  return true;
}

// ============================================
// GENERATE RELATIONS
// ============================================

function generateRelationsFromSolution(solution) {
  const n = solution.length;
  const relations = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Horizontal
      if (j < n - 1) {
        relations.push({
          from: [i, j],
          to: [i, j + 1],
          symbol: solution[i][j] === solution[i][j + 1] ? "=" : "x",
        });
      }

      // Vertical
      if (i < n - 1) {
        relations.push({
          from: [i, j],
          to: [i + 1, j],
          symbol: solution[i][j] === solution[i + 1][j] ? "=" : "x",
        });
      }
    }
  }

  return relations;
}

// ============================================
// RANDOM RELATION PICKER (AUTO RANDOM COUNT)
// ============================================

function pickRandomRelations(n, relations) {
  const total = relations.length;

  // 🎯 Difficulty scaling automatically by board size
  let min, max;

  if (n === 4) {
    min = 3;
    max = 5;
  } else if (n === 6) {
    min = 5;
    max = 8;
  } else if (n === 8) {
    min = 7;
    max = 12;
  } else {
    min = Math.floor(n / 2);
    max = n + 2;
  }

  const hintCount = Math.floor(Math.random() * (max - min + 1)) + min;

  const shuffled = shuffle([...relations]);

  return shuffled.slice(0, Math.min(hintCount, total));
}

// ============================================
// RANDOM PREFILL PICKER (NEW)
// ============================================

function pickRandomPrefills(n, solution) {
  const totalCells = n * n;

  // sensible defaults per size (you can tweak these)
  let min, max;
  if (n === 4) {
    min = 2;
    max = 4;
  } else if (n === 6) {
    min = 3;
    max = 6;
  } else if (n === 8) {
    min = 5;
    max = 9;
  } else {
    min = Math.floor(n / 2);
    max = Math.min(totalCells, Math.floor(n * 1.5));
  }

  const count = Math.min(
    totalCells,
    Math.floor(Math.random() * (max - min + 1)) + min
  );

  // collect all coords and shuffle
  const coords = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      coords.push([i, j]);
    }
  }
  shuffle(coords);

  // pick first `count` and map to their solution values
  const picks = coords.slice(0, count).map(([i, j]) => ({
    pos: [i, j],
    value: solution[i][j], // "sun" or "moon"
  }));

  return picks;
}

// ============================================
// HELPERS
// ============================================

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleColumns(board) {
  const n = board.length;
  const order = shuffle([...Array(n).keys()]);
  const copy = board.map((row) => row.slice());

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      board[r][c] = copy[r][order[c]];
    }
  }
}

// ============================================
// GAME VALIDATION (FOR PLAYER BOARD)
// ============================================

export function validateBoard(board, relations) {
  const n = board.length;
  const errors = [];

  // Check rows
  for (let i = 0; i < n; i++) {
    const row = board[i];

    const sunCount = row.filter(v => v === "sun").length;
    const moonCount = row.filter(v => v === "moon").length;

    if (sunCount > n / 2 || moonCount > n / 2) {
      for (let j = 0; j < n; j++) {
        if (row[j]) {
          errors.push({ pos: [i, j], type: 'count' });
        }
      }
    }

    // Check for three consecutive same icons in row
    for (let j = 0; j < n - 2; j++) {
      if (
        row[j] &&
        row[j] === row[j + 1] &&
        row[j] === row[j + 2]
      ) {
        errors.push({ pos: [i, j], type: 'three' });
        errors.push({ pos: [i, j + 1], type: 'three' });
        errors.push({ pos: [i, j + 2], type: 'three' });
      }
    }
  }

  // Check columns
  for (let j = 0; j < n; j++) {
    let col = [];

    for (let i = 0; i < n; i++) {
      col.push(board[i][j]);
    }

    const sunCount = col.filter(v => v === "sun").length;
    const moonCount = col.filter(v => v === "moon").length;

    if (sunCount > n / 2 || moonCount > n / 2) {
      for (let i = 0; i < n; i++) {
        if (col[i]) {
          errors.push({ pos: [i, j], type: 'count' });
        }
      }
    }

    // Check for three consecutive same icons in column
    for (let i = 0; i < n - 2; i++) {
      if (
        col[i] &&
        col[i] === col[i + 1] &&
        col[i] === col[i + 2]
      ) {
        errors.push({ pos: [i, j], type: 'three' });
        errors.push({ pos: [i + 1, j], type: 'three' });
        errors.push({ pos: [i + 2, j], type: 'three' });
      }
    }
  }

  // Check relations (hints) - CRITICAL for Tango game
  if (relations && relations.length > 0) {
    for (let rel of relations) {
      const [r1, c1] = rel.from;
      const [r2, c2] = rel.to;
      
      const val1 = board[r1][c1];
      const val2 = board[r2][c2];
      
      if (val1 && val2) {
        if (rel.symbol === '=' && val1 !== val2) {
          // Equal sign means they should be the same
          errors.push({ pos: [r1, c1], type: 'hint' });
          errors.push({ pos: [r2, c2], type: 'hint' });
        } else if (rel.symbol === 'x' && val1 === val2) {
          // X means they should be different
          errors.push({ pos: [r1, c1], type: 'hint' });
          errors.push({ pos: [r2, c2], type: 'hint' });
        }
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function checkWin(board, relations) {
  const n = board.length;

  // 1) must be fully filled (no falsy values)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (!board[i][j]) return false;
    }
  }

  // 2) must satisfy all validation rules (rows, columns, relation hints)
  const { isValid } = validateBoard(board, relations);
  return !!isValid;
}