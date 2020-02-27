var chai = require('chai')
  , expect = chai.expect
  , path = require('path')
  , coverPercent = require('../');


describe('coverage-percentage', function() {
  it('should parse lcov', function(done) {
    coverPercent(path.join(__dirname, 'fixtures/lcov.info'), 'lcov', function(err, data) {
      expect(err).to.be.null;
      expect(data).to.equal(100);
      done();
    });
  });

  it('should parse jscoverage', function(done) {
    coverPercent(path.join(__dirname, 'fixtures/coverage.json'), 'jscoverage', function(err, data) {
      expect(err).to.be.null;
      expect(data).to.equal(70.37037037037037);
      done();
    });
  });

  it('should error on unknown format', function(done) {
    coverPercent(path.join(__dirname, 'fixtures/coverage.json'), 'notAFormat', function(err, data) {
      expect(err).not.to.be.null;
      done();
    });
  });
});