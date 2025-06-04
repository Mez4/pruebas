import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/asentamiento/get`, {}, {
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

export const FNAdd = (oidc: IOidc, Datos: {
    CodigoPostal: number,
    Asentamiento: string,
    Tipo_asenta: string,
    Municipio: string,
    Estado: string,
    Ciudad: string,
    oficina_postal: string,
    id_estado: number,
    id_oficina_postal: string,
    c_CP: string,
    id_tipo_asentamiento: number,
    id_municipio: number,
    id_asentamiento: number,
    zona: string,
    id_ciudad: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        Datos.oficina_postal = Datos.id_oficina_postal
        axios.post(`${GetServerUrl()}catalogos/asentamiento/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: {
    AsentamientoID: number,
    CodigoPostal: number,
    Asentamiento: string,
    Tipo_asenta: string,
    Municipio: string,
    Estado: string,
    Ciudad: string,
    oficina_postal: string,
    id_estado: number,
    id_oficina_postal: string,
    c_CP: string,
    id_tipo_asentamiento: number,
    id_municipio: number,
    id_asentamiento: number,
    zona: string,
    id_ciudad: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        Datos.oficina_postal = Datos.id_oficina_postal
        axios.post(`${GetServerUrl()}catalogos/asentamiento/update`, Datos, {
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

