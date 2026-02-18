const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

  test('Solve a puzzle with valid puzzle string: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '8' })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.lengthOf(res.body.conflict, 1);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '1' })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.lengthOf(res.body.conflict, 2);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '2' })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.lengthOf(res.body.conflict, 3);
        done();
      });
  });
});