(function() {
  'use strict';

  var loader = require.extensions['.js'];
  var spies  = {};

  require.extensions['.js'] = function(module, path) {
    if (!spies[path]) {
      return loader(module, path);
    }

    module.exports = spies[path];
  };

  function spyOnModule(module) {
    var path = require.resolve(module);
    var spy  = jasmine.createSpy('spy on module `' + path + '`');

    spies[path] = spy;
    delete require.cache[path];

    return spy;
  }

  function removeSpy(module) {
    var path = require.resolve(module);
    delete spies[path];
  }

  spyOnModule.removeSpy = removeSpy;
  module.exports = spyOnModule;
}());
