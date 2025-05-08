// @ts-check
/**
 * @fileoverview Módulo de logging personalizado para aplicaciones web.
 * @module Logger
 * @author Cristhian Hernandez<cristhianjhl@gmail.com>
 * @version 1.0.0
 */

/**
 * @typedef {Object} TraceType
 * @property {String} linenumber - Número de línea donde se generó el log
 * @property {String} filepath - Ruta del archivo donde se generó el log
 * @property {String} classname - Nombre de la clase donde se generó el log
 * @property {String} method - Nombre del método donde se generó el log
 */

/**
 * @typedef {Object} LogType
 * @property {String} label - Etiqueta de nivel de log (LOG, SUCCESS, WARN, ERROR)
 * @property {String} style - Estilo CSS para el mensaje en consola
 * @property {String} icon - Icono que se mostrará junto al mensaje
 */

/**
 * @typedef {Object} LogLevelParams
 * @property {String} type - Tipo de log ('message', 'success', 'warn', 'error', 'default')
 * @property {String} borderColor - Color del borde izquierdo para el estilo del log
 */

/**
 * Lista de hosts permitidos para mostrar logs
 * @constant {Array<String>} ALLOW_HOSTS
 */
const ALLOW_HOSTS = ['localhost', '127.0.0.1'];

/**
 * Niveles de log disponibles
 * @constant {Object} LOG_LEVELS
 * @property {String} LOG - Nivel de log informativo
 * @property {String} SUCCESS - Nivel de log para operaciones exitosas
 * @property {String} WARN - Nivel de log para advertencias
 * @property {String} ERROR - Nivel de log para errores
 * @property {String} DEFAULT - Default value.
 */
const LOG_LEVELS = Object.freeze({
  LOG: 'LOG',
  SUCCESS: 'SUCCESS',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEFAULT: 'DEFAULT',
});

/**
 * Obtiene el objeto de configuración para un nivel de log específico
 * @param {LogLevelParams} [params] - Parámetros para configurar el nivel de log
 * @param {String} [params.type='default'] - Tipo de log
 * @param {String} [params.borderColor='#292bd5'] - Color del borde
 * @returns {LogType} Objeto con la configuración del nivel de log
 *
 * @example
 * // Ejemplo de uso
 * const logConfig = getLogLevelObject({ type: 'error', borderColor: '#ff0000' });
 */
function getLogLevelObject(
  { type, borderColor } = {
    type: 'default',
    borderColor: '#292bd5',
  }
) {
  const obj = {
    'color': '#1a1a1a',
    'background-color': '#eeeeee',
    'border-left': 5px solid ${borderColor},
    'padding': '6px 8px',
    'border-radius': '5px',
  };

  // Convertir objeto a string con formato "key: value" separado por punto y coma
  const style = Object.entries(obj)
    .map(([key, value]) => ${key}: ${value})
    .join('; ');

  const types = Object.freeze({
    [LOG_LEVELS.LOG]: {
      label: 'LOG',
      style,
      icon: '📝',
    },
    [LOG_LEVELS.SUCCESS]: {
      label: 'SUCCESS',
      style,
      icon: '✅',
    },
    [LOG_LEVELS.WARN]: {
      label: 'WARN',
      style,
      icon: '⚠',
    },
    [LOG_LEVELS.ERROR]: {
      label: 'ERROR',
      style,
      icon: '🚨',
    },
    [LOG_LEVELS.DEFAULT]: {
      label: 'DEFAULT',
      style,
      icon: '🚨',
    },
  });

  return types[type] || types[LOG_LEVELS.DEFAULT];
}

/**
 * Verifica si el host actual está en la lista de hosts permitidos
 * @returns {Boolean} true si el host está permitido, false en caso contrario
 */
function checkIsAllowHost() {
  return ALLOW_HOSTS.includes(window.location.hostname);
}

/**
 * Rellena un número con ceros a la izquierda hasta completar 2 dígitos
 * @param {Number} number - Número a rellenar
 * @returns {String} Número rellenado con ceros
 */
function fillNumber(number) {
  return String(number).padStart(2, '0');
}

/**
 * Obtiene la hora actual formateada (HH:MM:SS)
 * @returns {String} Hora formateada
 */
function getFormattedTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return ${fillNumber(hours)}:${fillNumber(minutes)}:${fillNumber(seconds)};
}

/**
 * Imprime información de rastreo en la consola
 * @param {TraceType|null} params - Objeto con información de rastreo
 * @returns {void}
 */
function printTraceInformation(params) {
  if (!params) return;

  if (Object.entries(params).length === 0) return;

  const entries = Object.entries(params);

  for (let idx = 0; idx < entries.length; idx += 1) {
    const [key, value] = entries[idx];
    console.log(%c${key}: ${value}, 'font-weight: bold;');
  }
}

/**
 * Función auxiliar interna para estandarizar el logging
 * @private
 * @param {String} logLevel - Nivel de log (de LOG_LEVELS)
 * @param {String} msg - Mensaje a mostrar
 * @param {String} borderColor - Color del borde para el estilo
 * @param {TraceType|null} [params=null] - Información de rastreo adicional
 * @returns {void}
 */
function _log(logLevel, msg, borderColor, params = null) {
  if (!checkIsAllowHost()) return;

  const time = getFormattedTime();
  const log = getLogLevelObject({ type: logLevel, borderColor });

  console.groupCollapsed(%c${log.icon} ${time} [${log.label}] ${msg}, log.style);
  console.time('Tiempo ejecución');
  printTraceInformation(params);
  console.timeEnd('Tiempo ejecución');
  console.groupEnd();
}

/**
 * Implementación del método assert para logging
 * @param {Boolean} condition - Condición a evaluar
 * @param {String} msg - Mensaje a mostrar si la condición es falsa
 * @param {TraceType|null} [params=null] - Información de rastreo adicional
 * @returns {Boolean} - Retorna el valor de la condición evaluada
 */
function assert(condition, msg, params = null) {
  if (!checkIsAllowHost()) return condition;

  if (!condition) {
    const time = getFormattedTime();
    const log = getLogLevelObject({ type: LOG_LEVELS.ERROR, borderColor: '#ff0000' });

    console.groupCollapsed(%c${log.icon} ${time} [ASSERT] ${msg}, log.style);
    console.time('Tiempo ejecución');
    printTraceInformation(params);
    console.trace('Stack trace:');
    console.timeEnd('Tiempo ejecución');
    console.groupEnd();
  }

  return condition;
}

/**
 * Registra un mensaje informativo en la consola
 * @param {String} msg - Mensaje a mostrar
 * @param {TraceType|null} [params=null] - Información de rastreo adicional
 * @returns {void}
 */
function message(msg, params = null) {
  _log(LOG_LEVELS.LOG, msg, '#0000ff', params);
}

/**
 * Registra un mensaje de éxito en la consola
 * @param {String} msg - Mensaje a mostrar
 * @param {TraceType|null} [params=null] - Información de rastreo adicional
 * @returns {void}
 */
function success(msg, params = null) {
  _log(LOG_LEVELS.SUCCESS, msg, '#00ff00', params);
}

/**
 * Registra un mensaje de advertencia en la consola
 * @param {String} msg - Mensaje a mostrar
 * @param {TraceType|null} [params=null] - Información de rastreo adicional
 * @returns {void}
 */
function warn(msg, params = null) {
  _log(LOG_LEVELS.WARN, msg, '#ff00ff', params);
}

/**
 * Registra un mensaje de error en la consola
 * @param {String} msg - Mensaje a mostrar
 * @param {TraceType|null} [params=null] - Información de rastreo adicional
 * @returns {void}
 */
function error(msg, params = null) {
  _log(LOG_LEVELS.ERROR, msg, '#ff0000', params);
}
