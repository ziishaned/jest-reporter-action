var lcovParse = require('lcov-parse')
  , fs = require('fs');
module.exports = function(file, format, cb) {
  var report = fs.readFileSync(file, 'utf8');
  if(typeof format === 'function') {
    cb = format;
    format = null;
  }

  format = format || 'jscoverage';

  switch(format) {
  case 'lcov':
    lcovParse(report, function(err, data) {
      if(err) return cb(err);
      var hit = found = 0;
      for(var i = 0; i < data.length; i++) {
        hit += data[i].lines.hit;
        found += data[i].lines.found;
      }
      cb(null, (hit / found) * 100);
    });
  break;
  case 'jscoverage':
    try {
      cb(null, JSON.parse(report).coverage);
    } catch(err) {
      cb(err);
    }
  break;
  default:
    cb('Unknown format: ' + format);
  break;
  }
};