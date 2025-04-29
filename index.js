/*
NOTE: Asi debes importarlo en tu proyecto.
const logger = require('./logger');
logger.message('Hello, world!');
*/

message(
	'hello world',
	{
		name: 'Cristhian',
		age: 25,
		city: 'Madrid',
		country: 'Spain',
	},
	{
		lineCode: 20,
		functionName: 'helloWorld',
		fileName: 'index.js',
	}
);
warn('hello world');
error('hello world');
