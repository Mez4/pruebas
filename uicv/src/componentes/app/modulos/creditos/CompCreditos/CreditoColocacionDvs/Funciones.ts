import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { IDataTableColumn } from "react-data-table-component"
/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */



export const FNGet = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/Reportes/obtenerDias`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetTipoEstatus = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/obtenerEstatusIncremento`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetSucursales = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/obtenerSucursalesSelect`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FiltrarDatos = (Roles: any[], Columns: IDataTableColumn[], Filter: string) => {

    // Return our filtered data
    return Roles.filter(d => {

        // Iteramos las columnas
        for (let c of Columns) {

            // Check for undefined selector
            if (c.selector === undefined)
                continue

            // Intentamos obtener el dato
            try {
                let colValue = String(d[c.selector as string]).toUpperCase()
                if (colValue.includes(Filter.toUpperCase())) {
                    return true
                }
            }
            catch { continue }
        }
        return false
    })
}

export const FNgetbyfiltros = async (oidc: IOidc, Datos: {
    FechaInicio: any,
    FechaFin: any
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}Creditos/CreditosColocadoSocia/CreditoColocacionSocia`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta, 'respcreditosglobal')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
