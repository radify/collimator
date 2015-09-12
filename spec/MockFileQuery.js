import bluebird from 'bluebird';

function MockFileQuery() {
  var deferred = bluebird.defer();
  var spy      = jasmine.createSpy('mockFileQuery').and.returnValue(deferred.promise);
  spy.deferred = deferred;

  return spy;
}

export default MockFileQuery;
