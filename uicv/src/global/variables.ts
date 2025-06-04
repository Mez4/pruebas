import { IOidc } from './../interfaces/oidc/IOidc'
/**
 * Devuelve el string de conección al servidor para utilizar en todas las api
 * @returns URI del servidor
 */
export const GetServerUrl = (): string => window.location.origin === 'http://localhost:3000' ? "https://localhost:5001/api/" : "https://apisistemacv.fconfia.com/api/" //"https://apidemocv.fconfia.com/api/" //

/**
 * Generamos las cabeceras de oidc
 * @param oidc Detalle de seguridad
 */
export const GenerarCabeceraOIDC = (oidc: IOidc): any => ({
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${oidc.user.access_token}` }
})

/** Generamos un formateo de numeros para la aplicación, configurado para efectivo */
export const FormateoDinero = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', })
export const FormateoNumero = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 })
export const FormateoNumero2D = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 })
export const FormateoPorcentaje = new Intl.NumberFormat('en-US', {
    style: 'percent',
    // currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

export const DescripcionDistribuidor = (type: Number): string => type === 1 ? "Socia" : "Socias"