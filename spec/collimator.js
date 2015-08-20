describe('collimator', function() {
  var collimator = require('../src/collimator');

  it('exports inspectors', function() {
    expect(collimator.tables).toBe(require('../src/inspectors/tables'));
    expect(collimator.schema).toBe(require('../src/inspectors/schema'));
    expect(collimator.relationships).toBe(require('../src/inspectors/relationships'));
  });
});
