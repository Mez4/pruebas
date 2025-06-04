import axios from 'axios'
// import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/catalogos/tipo-documentos/show-all`, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNAdd = (Seguridad: IOidc,
    Datos: {

        nombreDocumento: String,
        //clave: String,
        descripcion: String,
        activo: boolean,

    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`https://service-mc.herokuapp.com/api/catalogos/tipo-documentos/create/`, Datos, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })



export const FNUpdate = (Seguridad: IOidc,

    Datos: {
        tipoDocumentoID: number,
        nombreDocumento: String,
        //clave: String,
        descripcion: String,
        activo: boolean,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://service-mc.herokuapp.com/api/catalogos/tipo-documentos/update/${Datos.tipoDocumentoID}`, Datos, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })