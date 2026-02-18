'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' });
      
      const validation = solver.validate(puzzle);
      if (validation.error) return res.json(validation);

      if (!/^[a-i][1-9]$/i.test(coordinate)) return res.json({ error: 'Invalid coordinate' });
      if (!/^[1-9]$/.test(value)) return res.json({ error: 'Invalid value' });

      const row = coordinate[0];
      const col = coordinate[1];
      
      // If value is already at that coordinate, it's valid
      const index = (solver.letterToNumber(row) * 9) + (parseInt(col) - 1);
      if (puzzle[index] === value) return res.json({ valid: true });

      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

      if (conflicts.length === 0) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      const result = solver.solve(puzzle);
      res.json(result);
    });
};