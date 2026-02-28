import { WordSearchGenerator } from './generator.js';
import { themes } from './themes.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme');
  const rowsInput = document.getElementById('rows');
  const colsInput = document.getElementById('cols');
  const fontSizeInput = document.getElementById('fontSize');
  const fontSizeDisplay = document.getElementById('fontSizeDisplay');
  const wordListFontSizeInput = document.getElementById('wordListFontSize');
  const wordListFontSizeDisplay = document.getElementById('wordListFontSizeDisplay');
  const maxWordsInput = document.getElementById('maxWords');
  const generateBtn = document.getElementById('generateBtn');
  const printBtn = document.getElementById('printBtn');

  const numPuzzlesInput = document.getElementById('numPuzzles');
  const previewWrapper = document.getElementById('previewWrapper');

  // Populate themes
  themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name;
    themeSelect.appendChild(option);
  });

  // Event listeners
  fontSizeInput.addEventListener('input', (e) => {
    fontSizeDisplay.textContent = e.target.value;
    document.documentElement.style.setProperty('--cell-font-size', `${e.target.value}px`);
  });

  wordListFontSizeInput.addEventListener('input', (e) => {
    wordListFontSizeDisplay.textContent = e.target.value;
    document.documentElement.style.setProperty('--list-font-size', `${e.target.value}px`);
  });

  generateBtn.addEventListener('click', generatePuzzles);

  printBtn.addEventListener('click', () => {
    window.print();
  });

  function generatePuzzles() {
    const selectedThemeId = themeSelect.value;
    const theme = themes.find(t => t.id === selectedThemeId);

    const rows = parseInt(rowsInput.value) || 15;
    const cols = parseInt(colsInput.value) || 15;
    const maxWords = parseInt(maxWordsInput.value) || 15;
    const numPuzzles = parseInt(numPuzzlesInput.value) || 1;

    let wordsToUse = [...theme.words];

    // Shuffle words
    for (let i = wordsToUse.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordsToUse[i], wordsToUse[j]] = [wordsToUse[j], wordsToUse[i]];
    }

    // Clear previous puzzles
    previewWrapper.innerHTML = '';

    let usedWordsIndex = 0;

    for (let p = 0; p < numPuzzles; p++) {
      // Slice the words so there are no repeats, taking at most `maxWords`
      // If we run out of words, we loop back to the start
      let puzzleWords = [];
      for (let w = 0; w < maxWords; w++) {
        if (usedWordsIndex >= wordsToUse.length) {
          usedWordsIndex = 0; // Wrap around if we don't have enough words to fill all puzzles
        }
        puzzleWords.push(wordsToUse[usedWordsIndex]);
        usedWordsIndex++;
      }

      // Generate puzzle
      const generator = new WordSearchGenerator(rows, cols, puzzleWords);
      const result = generator.generate();

      renderPuzzlePage(theme.name, result.grid, result.placedWords, rows, cols, p + 1);
    }
  }

  function renderPuzzlePage(title, grid, words, rows, cols, pageNum) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'page-content';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'header';
    const h2 = document.createElement('h2');
    h2.textContent = `${title} (Puzzle ${pageNum})`;
    headerDiv.appendChild(h2);

    const gridWrapperDiv = document.createElement('div');
    gridWrapperDiv.className = 'grid-wrapper';
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    gridContainer.style.setProperty('--grid-rows', rows);
    gridContainer.style.setProperty('--grid-cols', cols);

    // Render grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.textContent = grid[r][c];
        gridContainer.appendChild(cell);
      }
    }
    gridWrapperDiv.appendChild(gridContainer);

    const wordListWrapperDiv = document.createElement('div');
    wordListWrapperDiv.className = 'word-list-wrapper';
    const wordList = document.createElement('div');
    wordList.className = 'word-list';

    // Render word list
    words.forEach(word => {
      const span = document.createElement('span');
      span.className = 'word-item';
      span.textContent = word;
      wordList.appendChild(span);
    });
    wordListWrapperDiv.appendChild(wordList);

    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(gridWrapperDiv);
    contentDiv.appendChild(wordListWrapperDiv);
    pageDiv.appendChild(contentDiv);

    previewWrapper.appendChild(pageDiv);
  }

  // Initialize CSS vars on document element
  document.documentElement.style.setProperty('--cell-font-size', `${fontSizeInput.value}px`);
  document.documentElement.style.setProperty('--list-font-size', `${wordListFontSizeInput.value}px`);

  // Generate initial puzzles
  generatePuzzles();
});
