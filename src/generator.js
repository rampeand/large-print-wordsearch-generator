const DIRECTIONS = [
    [0, 1],   // horizontal right
    [1, 0],   // vertical down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
    [0, -1],  // horizontal left
    [-1, 0],  // vertical up
    [-1, -1], // diagonal up-left
    [1, -1]   // diagonal down-left
];

export class WordSearchGenerator {
    constructor(rows, cols, words) {
        this.rows = rows;
        this.cols = cols;
        this.baseWords = words.map(w => w.toUpperCase().replace(/[^A-Z]/g, ''));
        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(''));
        this.placedWords = [];
        this.unplacedWords = [];
    }

    generate() {
        // Sort words by length descending to place largest words first
        const sortedWords = [...this.baseWords].sort((a, b) => b.length - a.length);

        for (const word of sortedWords) {
            if (word.length === 0) continue;
            const placed = this._placeWord(word);
            if (placed) {
                this.placedWords.push(word);
            } else {
                this.unplacedWords.push(word);
            }
        }

        this._fillEmptySpaces();

        return {
            grid: this.grid,
            placedWords: this.placedWords.sort(),
            unplacedWords: this.unplacedWords.sort()
        };
    }

    _placeWord(word) {
        // Try all combinations of starting positions and directions, but randomize them
        const positions = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                positions.push([r, c]);
            }
        }

        // Shuffle positions
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        for (const [r, c] of positions) {
            // Shuffle directions for this position
            const dirs = [...DIRECTIONS];
            for (let i = dirs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
            }

            for (const [dr, dc] of dirs) {
                if (this._canPlaceWord(word, r, c, dr, dc)) {
                    this._doPlaceWord(word, r, c, dr, dc);
                    return true;
                }
            }
        }

        return false; // Could not place word
    }

    _canPlaceWord(word, r, c, dr, dc) {
        for (let i = 0; i < word.length; i++) {
            const nr = r + i * dr;
            const nc = c + i * dc;

            // Check boundaries
            if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) {
                return false;
            }

            // Check overlap
            const existingLetter = this.grid[nr][nc];
            if (existingLetter !== '' && existingLetter !== word[i]) {
                return false;
            }
        }
        return true;
    }

    _doPlaceWord(word, r, c, dr, dc) {
        for (let i = 0; i < word.length; i++) {
            const nr = r + i * dr;
            const nc = c + i * dc;
            this.grid[nr][nc] = word[i];
        }
    }

    _fillEmptySpaces() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === '') {
                    this.grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }
}
