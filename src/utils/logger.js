const levels = { INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' };

function format(level, context, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] [${context}] ${message}`;
}

export function createLogger(context) {
  return {
    info: (msg) => console.log(format(levels.INFO, context, msg)),
    warn: (msg) => console.warn(format(levels.WARN, context, msg)),
    error: (msg) => console.error(format(levels.ERROR, context, msg)),
  };
}
