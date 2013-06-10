require('nodeunit');
var GraphicStore = require('../model/graphic_store.js').GraphicStore;

exports['Should error when saved object does not have colours property'] = function(test) {
    test.throws(function() { GraphicStore.save({})});
    test.done();
}