import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/SucursalFisica/get`, {}, {
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

export const FNAdd = (oidc: IOidc, 
    Datos: {
        Nombre: string,
        Telefono: string, 
        vialidadTipoId : number, 
        orientacionVialidadTipoId : number, 
        AsentamientoID : number, 
        NombreVialidad: string, 
        NumeroExterior: string, 
        NumeroInterior: string, 
        ReferenciasGeograficas: string, 
        ViviendaTipoId: number
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/SucursalFisica/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, 
    Datos: {
        SucursalFisicaID: number, 
        Nombre: string, 
        Telefono: string,
        DireccionID: number,
        vialidadTipoId : number, 
        orientacionVialidadTipoId : number, 
        AsentamientoID : number, 
        NombreVialidad: string, 
        NumeroExterior: string, 
        NumeroInterior: string, 
        ReferenciasGeograficas: string, 
        ViviendaTipoId: number
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/SucursalFisica/update`, Datos, {
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

