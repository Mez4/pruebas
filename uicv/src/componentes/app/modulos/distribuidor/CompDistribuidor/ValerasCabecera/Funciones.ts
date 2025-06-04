import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/ValerasCabecera/get`, {}, {
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

    export const FNGetFolioSiguiente = (oidc: IOidc, Datos: { serieId: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/ValerasCabecera/getFolioInicial`, Datos, {
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

/**
 * Funcion para agregar un tipo de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
 export const FNAdd = (oidc: IOidc, Datos: { ProductoID: number, serieId: number, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, RegistroPersonaID: number, ValerasFraccionID: number }) =>
 new Promise((Resolver: any, Denegar: any) => {
    //Datos.FolioInicial = parseInt(Datos.FolioInicial.toString())  
    //Datos.FolioFinal = parseInt(Datos.FolioFinal.toString())
    Datos.RegistroUsuarioId = oidc.user.profile.sub
    console.log('Datos', Datos)
    axios.post(`${GetServerUrl()}distribuidor/ValerasCabecera/add`, Datos, {
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

export const FNAccion = (oidc: IOidc, Datos: { ValeraCabeceraID: number, Evento: number }) =>
 new Promise((Resolver: any, Denegar: any) => {
    console.log('Datos', Datos)
    axios.post(`${GetServerUrl()}distribuidor/ValerasCabecera/accion`, Datos, {
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

export const FNGetFileM = (oidc: IOidc, Datos: { ValeraCabeceraID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('###', Datos)
        axios.post(`${GetServerUrl()}distribuidor/ValerasCabecera/getFileM`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob'
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })