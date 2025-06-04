import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


//Funcion para llenar la tabla principal.
export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatArchivosDispersion/find-all`, {  //https://service-mc.herokuapp.com
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

//Funcion para agregar el archivo de dispersion.
export const FNAdd = (oidc: IOidc,
    Datos: {
        clave: String,
        descripcion: String,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}SOMA/CatArchivosDispersion/create`, Datos, {
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

//Funcion para actualizar los archivos de dispersion.
export const FNUpdate = (oidc: IOidc,
    Datos: {
        archivoDispersionID: number,
        clave: String,
        descripcion: String,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`${GetServerUrl()}SOMA/CatArchivosDispersion/update/${Datos.archivoDispersionID}`, Datos, {
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

