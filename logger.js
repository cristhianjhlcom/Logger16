// TODO: Mejorar la lógica para trace del código.
// TODO: Mejorar el código para los colores.
// TODO: Mejorar la estructura del collapse.

const ALLOW_HOSTS = ['localhost', '127.0.0.1'];

const LOG_LEVELS = Object.freeze({
	message: {
		label: 'LOG',
		style:
			'color:rgb(0, 8, 233); background-color:rgb(216, 229, 255); padding: 4px 6px; border-radius: 4px;',
		icon: '📝',
	},
	warn: {
		label: 'WARN',
		style:
			'color:rgb(168, 150, 31); background-color:rgb(255, 255, 205); padding: 4px 6px; border-radius: 4px;',
		icon: '⚠️',
	},
	error: {
		label: 'ERROR',
		style:
			'color:rgb(206, 0, 0); background-color:rgb(254, 214, 214); padding: 4px 6px; border-radius: 4px;',
		icon: '🚨',
	},
});

/**
 * Get the log level object.
 * @param {String} level
 * @returns {{label: String, style: String, icon: String}}
 */
function getLogLevel(level) {
	return LOG_LEVELS[level] ?? LOG_LEVELS.message;
}

function checkIsAllowHost() {
	if (ALLOW_HOSTS.includes(window.location.hostname)) {
		return true;
	}
	return false;
}

function fillNumber(number) {
	return String(number).padStart(2, '0');
}

function getFormattedTime() {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	return `${fillNumber(hours)}:${fillNumber(minutes)}:${fillNumber(seconds)}`;
}

// TODO: Implementar la función assert

function message(message, data, args) {
	if (!checkIsAllowHost()) return;
	const time = getFormattedTime();
	const level = getLogLevel('message');

	console.time('Tiempo ejecución');
	console.groupCollapsed(
		`%c${level.icon} ${time} [${level.label}] ${message}`,
		level.style
	);
	for (const key in data) {
		console.log(`%c${key}: ${data[key]}`, 'font-weight: bold;');
	}
	console.log(':: TRACE ::');
	for (const key in args) {
		console.log(`%c${key}: ${args[key]}`, 'font-weight: bold;');
	}
	console.timeEnd('Tiempo ejecución');
	console.groupEnd();
}

function warn(message, data, ...args) {
	if (!checkIsAllowHost()) return;
	const time = getFormattedTime();
	const level = getLogLevel('warn');

	console.time('Tiempo ejecución');
	console.log(
		`%c${level.icon} ${time} [${level.label}] ${message}`,
		level.style
	);
	console.timeEnd('Tiempo ejecución');
}

function error(message, data, ...args) {
	if (!checkIsAllowHost()) return;
	const time = getFormattedTime();
	const level = getLogLevel('error');

	console.time('Tiempo ejecución');
	console.log(
		`%c${level.icon} ${time} [${level.label}] ${message}`,
		level.style
	);
	console.timeEnd('Tiempo ejecución');
}

/*
NOTE: Asi debes exportar en tu proyecto.
module.exports = {
	message,
};
*/
