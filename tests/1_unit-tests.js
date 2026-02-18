const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    assert.strictEqual(solver.validate(validPuzzle), true);
    done();
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    const invalidChar = validPuzzle.replace('1', 'X');
    assert.property(solver.validate(invalidChar), 'error');
    done();
  });

  test('Logic handles a puzzle string that is not 81 characters long', (done) => {
    assert.property(solver.validate('1.5'), 'error');
    done();
  });

  test('Logic handles a valid row placement', (done) => {
    assert.strictEqual(solver.checkRowPlacement(validPuzzle, 'A', '2', '3'), true);
    done();
  });

  test('Logic handles an invalid row placement', (done) => {
    assert.strictEqual(solver.checkRowPlacement(validPuzzle, 'A', '2', '1'), false);
    done();
  });

  test('Logic handles a valid column placement', (done) => {
    assert.strictEqual(solver.checkColPlacement(validPuzzle, 'A', '2', '3'), true);
    done();
  });

  test('Logic handles an invalid column placement', (done) => {
    assert.strictEqual(solver.checkColPlacement(validPuzzle, 'A', '2', '6'), false);
    done();
  });

  test('Logic handles a valid region (3x3 grid) placement', (done) => {
    assert.strictEqual(solver.checkRegionPlacement(validPuzzle, 'A', '2', '3'), true);
    done();
  });

  test('Logic handles an invalid region placement', (done) => {
    assert.strictEqual(solver.checkRegionPlacement(validPuzzle, 'A', '2', '5'), false);
    done();
  });

  test('Valid puzzle strings pass the solver', (done) => {
    const solved = solver.solve(validPuzzle);
    assert.property(solved, 'solution');
    done();
  });

  test('Invalid puzzle strings fail the solver', (done) => {
    const unsolvable = '9.9..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.property(solver.solve(unsolvable), 'error');
    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    assert.strictEqual(solver.solve(validPuzzle).solution, solution);
    done();
  });
});