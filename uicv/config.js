// config.js
let version = process.env.REACT_APP_VERSION;

// Incrementar la versión
const [major, minor, patch] = version.split('.').map(Number);
version = `${major}.${minor}.${patch + 1}`;

export { version };
