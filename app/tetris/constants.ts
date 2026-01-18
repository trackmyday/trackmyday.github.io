// Game constants
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type TetrominoKey = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export const TETROMINOS: Record<TetrominoKey, { shape: (TetrominoKey | 0)[][] }> = {
  'I': {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
    ],
  },
  'J': {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0],
    ],
  },
  'L': {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L'],
    ],
  },
  'O': {
    shape: [
      ['O', 'O'],
      ['O', 'O'],
    ],
  },
  'S': {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0],
    ],
  },
  'T': {
    shape: [
      ['T', 'T', 'T'],
      [0, 'T', 0],
      [0, 0, 0],
    ],
  },
  'Z': {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0],
    ],
  },
};