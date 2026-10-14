export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const other = (s) => (s === 'X' ? 'O' : 'X');
export const isFull = (board) => board.every(Boolean);
export const emptyCells = (board) =>
  board.reduce((acc, v, i) => (v ? acc : [...acc, i]), []);

export function getWinner(board) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a], line };
    }
  }
  return null;
}

// true if `symbol` has two in a line with the third cell empty
export function hasOpenTwo(board, symbol) {
  return LINES.some(([a, b, c]) => {
    const v = [board[a], board[b], board[c]];
    return v.filter((x) => x === symbol).length === 2 && v.includes(null);
  });
}

function completingMove(board, symbol) {
  for (const line of LINES) {
    const v = line.map((i) => board[i]);
    if (v.filter((x) => x === symbol).length === 2 && v.includes(null)) {
      return line[v.indexOf(null)];
    }
  }
  return null;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function minimax(board, turn, me, depth) {
  const w = getWinner(board);
  if (w) return w.symbol === me ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;
  const scores = emptyCells(board).map((i) => {
    const nb = board.slice();
    nb[i] = turn;
    return minimax(nb, other(turn), me, depth + 1);
  });
  return turn === me ? Math.max(...scores) : Math.min(...scores);
}

// level: 'easy' | 'medium' | 'hard'
export function chooseAiMove(board, me, level) {
  const empties = emptyCells(board);
  if (level === 'easy') return pick(empties);

  const win = completingMove(board, me);
  if (win !== null) return win;
  const block = completingMove(board, other(me));
  if (block !== null) return block;

  if (level === 'medium') {
    if (empties.includes(4) && Math.random() < 0.6) return 4;
    return pick(empties);
  }

  // hard = minimax (unbeatable)
  if (empties.length === 9) return pick([0, 2, 4, 6, 8]);
  let best = -Infinity;
  let moves = [];
  for (const i of empties) {
    const nb = board.slice();
    nb[i] = me;
    const s = minimax(nb, other(me), me, 1);
    if (s > best) { best = s; moves = [i]; }
    else if (s === best) moves.push(i);
  }
  return pick(moves);
}