if (process.env.NODE_ENV === 'production') {
	module.exports = require('./prod-keys');
} else if (process.env.NODE_ENV === 'test') {
	module.exports = require('./test-keys');
}
// else {
// 	module.exports = require('./dev-keys');
// }
