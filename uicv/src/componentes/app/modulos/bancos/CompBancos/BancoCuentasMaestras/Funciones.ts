import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

//Funcion para llenar la pantalla principal.
export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatAgrupacion/find-all`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })

//Funcion para agreagar un nuevo banco
export const FNAdd = (Seguridad: IOidc,
    Datos: {
        // clave: String,
        descripcion: String,
        activo: number,

    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}SOMA/CatAgrupacion/create`, Datos, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

//Funcion para actualizar un banco.
export const FNUpdate = (Seguridad: IOidc,
    Datos: {
        agrupacionID: number,
        // clave:  String,
        descripcion: String,
        activo: number
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`${GetServerUrl()}SOMA/CatAgrupacion/update/${Datos.agrupacionID}`, Datos, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

