import { IOidc } from '../../../../interfaces/oidc/IOidc';
import { GetServerUrl, GenerarCabeceraOIDC } from '../../../../global/variables';
import axios from 'axios'
import { DBConfia_Creditos } from '../../../../interfaces_db/DBConfia/Creditos'


/**
 * Obtenemos un registro unico de contrato utilizando el ID
 * @param {IOidc} oidc Configuración de seguridad
 * @param {number} ContratoID ID del contrato a obtener
 * @returns {DBConfia_Creditos.ICreditos_VW} Contrato en base de datos
 */
export const ObtenerContratoPorId = (oidc: IOidc, ContratoID: number): Promise<DBConfia_Creditos.IContratos_VW> =>
    new Promise((Resolve, Deny) => {

        // Comenzamos la petición a axios
        axios.get(`${GetServerUrl()}Contratos/Contratos/obtener/${ContratoID}`, GenerarCabeceraOIDC(oidc))
            .then(respuesta => {
                Resolve(respuesta.data)
            })
            .catch(error => {
                Deny(error)
            })
    })

/**
 * Obtenemos un registro unico de contrato utilizando el ID
 * @param {IOidc} oidc Configuración de seguridad
 * @param {any} Datos ID del contrato a obtener
 * @returns {DBConfia_Creditos.ICreditos_VW[]} Contrato en base de datos
 */
export const BuscarContratos = (oidc: IOidc, DatosBusqueda: {
    // Contratos de un socia en especifico
    DistribuidorID?: number

    // Contratos de un producto en especifico
    ProductoID?: number

    // Contratos registrados por una persona en especifico
    PersonaIDRegistro?: number

    // Contratos registrados por un usuario en especifico
    UsuarioIDRegistro?: string

    // Contratos creados en una fecha en especifico
    FechaInicio?: Date
    FechaFin?: Date

}): Promise<DBConfia_Creditos.IContratos_VW[]> =>
    new Promise((Resolve, Deny) => {

        // Comenzamos la petición a axios
        axios.get(`${GetServerUrl()}Contratos/Contratos/obtener`, { ...GenerarCabeceraOIDC(oidc), params: DatosBusqueda })
            .then(respuesta => {
                Resolve(respuesta.data)
            })
            .catch(error => {
                Deny(error)
            })
    })