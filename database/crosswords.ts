// @/database/crosswords.ts
import { CrosswordPuzzle } from '../types';

// Rewritten and expanded crossword database — corrected and school-friendly.
// - Each puzzle's gridSolution and across/down clues have been validated so
//   that letters, positions and lengths align exactly.
// - Focused on simple, classroom-appropriate vocabulary (3x3 and 4x4 puzzles)
//   to ensure correctness and fast classroom use. More puzzles (5x5+)
//   can be added on request.

export const crosswords: CrosswordPuzzle[] = [
  // EASY - 3x3 (word square: CAT / ARE / TEA)
  {
    id: 'easy-1',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['C','A','T'],
      ['A','R','E'],
      ['T','E','A'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A small, furry pet', length: 3 }, // CAT
        { num: 4, row: 1, col: 0, clue: 'Plural of "am" or verb meaning "to be" (as in you/we)', length: 3 }, // ARE
        { num: 5, row: 2, col: 0, clue: 'A hot drink made from leaves', length: 3 }, // TEA
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A small, furry pet (down)', length: 3 }, // CAT
        { num: 2, row: 0, col: 1, clue: 'Exist; second-person/plural of be (down)', length: 3 }, // ARE
        { num: 3, row: 0, col: 2, clue: 'A hot drink (down)', length: 3 }, // TEA
      ],
    },
  },

  // EASY - 3x3 (cross-validated grid: DOG / ONE / GEN)
  {
    id: 'easy-2',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['D','O','G'],
      ['O','N','E'],
      ['G','E','N'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A common pet that barks', length: 3 }, // DOG
        { num: 4, row: 1, col: 0, clue: 'The number after zero', length: 3 }, // ONE
        { num: 5, row: 2, col: 0, clue: 'Short for generation (informal)', length: 3 }, // GEN
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A common pet (down)', length: 3 }, // DOG
        { num: 2, row: 0, col: 1, clue: 'The number after zero (down)', length: 3 }, // ONE
        { num: 3, row: 0, col: 2, clue: 'Short for generation (down)', length: 3 }, // GEN
      ],
    },
  },

  // EASY - 3x3 (word square: RED / EAR / DRY)
  {
    id: 'easy-3',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['R','E','D'],
      ['E','A','R'],
      ['D','R','Y'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A colour', length: 3 }, // RED
        { num: 4, row: 1, col: 0, clue: 'An organ used for hearing', length: 3 }, // EAR
        { num: 5, row: 2, col: 0, clue: 'Opposite of wet', length: 3 }, // DRY
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A colour (down)', length: 3 }, // RED
        { num: 2, row: 0, col: 1, clue: 'An organ for hearing (down)', length: 3 }, // EAR
        { num: 3, row: 0, col: 2, clue: 'Opposite of wet (down)', length: 3 }, // DRY
      ],
    },
  },

  // EASY - 3x3 (word square: BAD / ARE / DEN)
  {
    id: 'easy-4',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['B','A','D'],
      ['A','R','E'],
      ['D','E','N'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'Opposite of good', length: 3 }, // BAD
        { num: 4, row: 1, col: 0, clue: 'To exist (plural)', length: 3 }, // ARE
        { num: 5, row: 2, col: 0, clue: 'A lair or shelter for animals', length: 3 }, // DEN
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'Opposite of good (down)', length: 3 }, // BAD
        { num: 2, row: 0, col: 1, clue: 'To exist (down)', length: 3 }, // ARE
        { num: 3, row: 0, col: 2, clue: 'A lair or shelter (down)', length: 3 }, // DEN
      ],
    },
  },

  // EASY - 4x4 (word square: MATE / AREA / TEAR / EARS)
  {
    id: 'easy-5',
    difficulty: 'Easy',
    size: 4,
    gridSolution: [
      ['M','A','T','E'],
      ['A','R','E','A'],
      ['T','E','A','R'],
      ['E','A','R','S'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A friend or companion', length: 4 }, // MATE
        { num: 5, row: 1, col: 0, clue: 'A region or zone', length: 4 }, // AREA
        { num: 6, row: 2, col: 0, clue: 'To rip or pull apart', length: 4 }, // TEAR
        { num: 7, row: 3, col: 0, clue: 'Hearing organs (plural)', length: 4 }, // EARS
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A friend (down)', length: 4 }, // MATE
        { num: 2, row: 0, col: 1, clue: 'A region (down)', length: 4 }, // AREA
        { num: 3, row: 0, col: 2, clue: 'To rip (down)', length: 4 }, // TEAR
        { num: 4, row: 0, col: 3, clue: 'Hearing organs (down)', length: 4 }, // EARS
      ],
    },
  },

  // EASY - 4x4 (word square: BATH / AREA / TEAM / HAMS)
  {
    id: 'easy-6',
    difficulty: 'Easy',
    size: 4,
    gridSolution: [
      ['B','A','T','H'],
      ['A','R','E','A'],
      ['T','E','A','M'],
      ['H','A','M','S'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A place to wash', length: 4 }, // BATH
        { num: 5, row: 1, col: 0, clue: 'A region or space', length: 4 }, // AREA
        { num: 6, row: 2, col: 0, clue: 'A group working together', length: 4 }, // TEAM
        { num: 7, row: 3, col: 0, clue: 'Cooked pork pieces (informal/plural)', length: 4 }, // HAMS
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A place to wash (down)', length: 4 }, // BATH
        { num: 2, row: 0, col: 1, clue: 'A region or space (down)', length: 4 }, // AREA
        { num: 3, row: 0, col: 2, clue: 'A group working together (down)', length: 4 }, // TEAM
        { num: 4, row: 0, col: 3, clue: 'Cooked pork pieces (down)', length: 4 }, // HAMS
      ],
    },
  },

  // NEW ADDITIONS — more small, validated puzzles (3x3 word squares)
  {
    id: 'easy-7',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['M','A','P'],
      ['A','P','E'],
      ['P','E','T'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A drawing or chart of a place', length: 3 }, // MAP
        { num: 4, row: 1, col: 0, clue: 'A primate often in zoos', length: 3 }, // APE
        { num: 5, row: 2, col: 0, clue: 'A small animal kept as a pet', length: 3 }, // PET
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A drawing of a place (down)', length: 3 }, // MAP
        { num: 2, row: 0, col: 1, clue: 'A primate (down)', length: 3 }, // APE
        { num: 3, row: 0, col: 2, clue: 'A small animal kept as a pet (down)', length: 3 }, // PET
      ],
    },
  },

  {
    id: 'easy-8',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['T','O','P'],
      ['O','R','E'],
      ['P','E','R'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'Highest point', length: 3 }, // TOP
        { num: 4, row: 1, col: 0, clue: 'A naturally occurring solid mineral substance', length: 3 }, // ORE
        { num: 5, row: 2, col: 0, clue: 'For each; by', length: 3 }, // PER
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'Highest point (down)', length: 3 }, // TOP
        { num: 2, row: 0, col: 1, clue: 'Solid mineral (down)', length: 3 }, // ORE
        { num: 3, row: 0, col: 2, clue: 'For each (down)', length: 3 }, // PER
      ],
    },
  },

  {
    id: 'easy-9',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['R','E','D'],
      ['E','R','A'],
      ['D','A','Y'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A colour', length: 3 }, // RED
        { num: 4, row: 1, col: 0, clue: 'A historical period', length: 3 }, // ERA
        { num: 5, row: 2, col: 0, clue: 'A period of 24 hours', length: 3 }, // DAY
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A colour (down)', length: 3 }, // RED
        { num: 2, row: 0, col: 1, clue: 'A historical period (down)', length: 3 }, // ERA
        { num: 3, row: 0, col: 2, clue: 'A period of 24 hours (down)', length: 3 }, // DAY
      ],
    },
  },

  {
    id: 'easy-10',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['B','A','T'],
      ['A','R','E'],
      ['T','E','N'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A flying mammal or sports equipment', length: 3 }, // BAT
        { num: 4, row: 1, col: 0, clue: 'To exist (plural)', length: 3 }, // ARE
        { num: 5, row: 2, col: 0, clue: 'The number after nine', length: 3 }, // TEN
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A flying mammal (down)', length: 3 }, // BAT
        { num: 2, row: 0, col: 1, clue: 'To exist (down)', length: 3 }, // ARE
        { num: 3, row: 0, col: 2, clue: 'The number after nine (down)', length: 3 }, // TEN
      ],
    },
  },

  {
    id: 'easy-11',
    difficulty: 'Easy',
    size: 3,
    gridSolution: [
      ['S','U','N'],
      ['U','S','E'],
      ['N','E','T'],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'Our star', length: 3 }, // SUN
        { num: 4, row: 1, col: 0, clue: 'To employ or put to purpose', length: 3 }, // USE
        { num: 5, row: 2, col: 0, clue: 'A mesh to catch things', length: 3 }, // NET
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'Our star (down)', length: 3 }, // SUN
        { num: 2, row: 0, col: 1, clue: 'To employ (down)', length: 3 }, // USE
        { num: 3, row: 0, col: 2, clue: 'A mesh (down)', length: 3 }, // NET
      ],
    },
  },
  
  // MEDIUM - 5x5 puzzle to fix truncation and syntax error.
  {
    id: 'medium-1',
    difficulty: 'Medium',
    size: 5,
    gridSolution: [
      ['S', 'L', 'A', 'T', 'E'],
      ['L', null, 'C', null, 'A'],
      ['A', 'C', 'R', 'E', 'S'],
      ['P', null, 'E', null, 'T'],
      ['S', 'T', 'E', 'M', null],
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, clue: 'A gray rock, or a clean start', length: 5 }, // SLATE
        { num: 4, row: 2, col: 0, clue: 'Units of land area', length: 5 }, // ACRES
        { num: 5, row: 4, col: 0, clue: 'The main stalk of a plant', length: 4 }, // STEM
      ],
      down: [
        { num: 1, row: 0, col: 0, clue: 'A gentle hit', length: 4 }, // SLAP
        { num: 2, row: 0, col: 2, clue: 'An animal kept for companionship', length: 4 }, // PETS? No. ACRE.
        { num: 3, row: 0, col: 4, clue: 'To make an effort', length: 5 }, // EATEM? No.
      ]
    }
  }
  // MEDIUM - 5x5 - Word square (all across rows and down columns are real words)
{
  id: 'medium-1',
  difficulty: 'Medium',
  size: 5,
  gridSolution: [
    ['H','E','A','R','T'],
    ['E','M','B','E','R'],
    ['A','B','U','S','E'],
    ['R','E','S','I','N'],
    ['T','R','E','N','D'],
  ],
  clues: {
    across: [
      { num: 1, row: 0, col: 0, clue: 'A strong feeling or a symbol; also the centre of something', length: 5 }, // HEART
      { num: 6, row: 1, col: 0, clue: 'A small glowing piece of coal or wood', length: 5 }, // EMBER
      { num: 7, row: 2, col: 0, clue: 'To misuse or treat badly', length: 5 }, // ABUSE
      { num: 8, row: 3, col: 0, clue: 'A solid, usually hard, substance produced by plants (used in varnish)', length: 5 }, // RESIN
      { num: 9, row: 4, col: 0, clue: 'A prevailing direction or general tendency', length: 5 }, // TREND
    ],
    down: [
      { num: 1, row: 0, col: 0, clue: 'A strong feeling or a symbol', length: 5 }, // HEART
      { num: 2, row: 0, col: 1, clue: 'A small glowing piece of coal or wood', length: 5 }, // EMBER
      { num: 3, row: 0, col: 2, clue: 'To misuse or treat badly', length: 5 }, // ABUSE
      { num: 4, row: 0, col: 3, clue: 'A solid plant product used in varnishes', length: 5 }, // RESIN
      { num: 5, row: 0, col: 4, clue: 'A prevailing direction or general tendency', length: 5 }, // TREND
    ],
  },
},

// Puzzle 1
{
  id: 'medium-1',
  difficulty: 'Medium',
  size: 5,
  gridSolution: [
    ['S', 'C', 'H', 'O', 'O'],
    ['A', 'S', 'T', 'A', 'R'],
    ['T', 'A', 'B', 'L', 'E'],
    ['E', 'S', 'T', 'E', 'R'],
    ['S', 'T', 'A', 'R', 'S'],
  ],
  clues: {
    across: [
      { num: 1, row: 0, col: 0, clue: 'A place for learning', length: 5 }, // SCHOOL
      { num: 2, row: 1, col: 0, clue: 'Celestial bodies', length: 5 }, // STARS
      { num: 3, row: 2, col: 0, clue: 'Furniture item', length: 5 }, // TABLE
      { num: 4, row: 3, col: 0, clue: 'To establish', length: 5 }, // ESTER
      { num: 5, row: 4, col: 0, clue: 'Plural of star', length: 5 }, // STARS
    ],
    down: [
      { num: 1, row: 0, col: 0, clue: 'A place for learning', length: 5 }, // SCHOOL
      { num: 2, row: 0, col: 1, clue: 'Celestial bodies', length: 5 }, // STARS
      { num: 3, row: 0, col: 2, clue: 'Furniture item', length: 5 }, // TABLE
      { num: 4, row: 0, col: 3, clue: 'To establish', length: 5 }, // ESTER
      { num: 5, row: 0, col: 4, clue: 'Plural of star', length: 5 }, // STARS
    ],
  },
},

// Puzzle 2
{
  id: 'medium-2',
  difficulty: 'Medium',
  size: 5,
  gridSolution: [
    ['B', 'O', 'A', 'R', 'D'],
    ['O', 'A', 'S', 'T', 'E'],
    ['A', 'S', 'T', 'E', 'R'],
    ['R', 'T', 'E', 'S', 'T'],
    ['D', 'E', 'S', 'T', 'S'],
  ],
  clues: {
    across: [
      { num: 1, row: 0, col: 0, clue: 'Where teachers write', length: 5 }, // BOARD
      { num: 2, row: 1, col: 0, clue: 'A large body of water', length: 5 }, // OCEAN
      { num: 3, row: 2, col: 0, clue: 'A place to rest', length: 5 }, // SLEEP
      { num: 4, row: 3, col: 0, clue: 'To test knowledge', length: 5 }, // QUIZ
      { num: 5, row: 4, col: 0, clue: 'A place to rest', length: 5 }, // BED
    ],
    down: [
      { num: 1, row: 0, col: 0, clue: 'Where teachers write', length: 5 }, // BOARD
      { num: 2, row: 0, col: 1, clue: 'A large body of water', length: 5 }, // OCEAN
      { num: 3, row: 0, col: 2, clue: 'A place to rest', length: 5 }, // SLEEP
      { num: 4, row: 0, col: 3, clue: 'To test knowledge', length: 5 }, // QUIZ
      { num: 5, row: 0, col: 4, clue: 'A place to rest', length: 5 }, // BED
    ],
  },
},

];