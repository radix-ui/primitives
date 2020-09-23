if (process.env.NODE_ENV === 'production') {
  module.exports = require('./pkg.production.min.js');
} else {
  module.exports = require('./pkg.development.js');
}
