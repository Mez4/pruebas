const fs = require('fs');
require('dotenv').config();

// Obtener la versión actual desde el archivo .env
const currentVersion = process.env.REACT_APP_VERSION;

// Incrementar la versión
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Actualizar la versión en el archivo .env
const envFilePath = './.env';
const envContents = fs.readFileSync(envFilePath, 'utf-8');
const updatedEnvContents = envContents.replace(
    `REACT_APP_VERSION=${currentVersion}`,
    `REACT_APP_VERSION=${newVersion}`
);
// Imprimir la nueva versión
if (process.env.REACT_APP_WORKSPACE === 'production') {
    console.log(`Versión incrementada a ${newVersion}`);
    fs.writeFileSync(envFilePath, updatedEnvContents);
} else {
    console.log(`Versión incrementada a ${newVersion} (no se actualizó el archivo .env, ambiente de desarrollo)`);
}
