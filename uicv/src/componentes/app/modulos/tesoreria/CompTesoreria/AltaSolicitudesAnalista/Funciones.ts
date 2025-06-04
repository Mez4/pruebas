import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
//import { GetServerUrl } from '../../../../../global/variables'

//Funcion para obtener los datos generales de la pantalla principal
export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/listar/meme/0`, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


    //Funcion para hacer el filtrado de la solicitud en base al usuario iniciado en sesión
    // y en base al id de la solicitud.
export const FNGetFiltroSolicitudes = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/listar/meme/${Id}`, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

//Funcion para traer el log de la solicitud.
export const FNGetLog = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/log-solicitud/21`, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

//Funcion para obter los analistas
export const FNGetAnalistas = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/mesa-credito/show-analistas-director/meme`, { //// CAMBAIR POR LA API QUE LE VOY A PEDIR AL DANIEL
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    //Funcion para hacer una nueva solicitud
export const FNAdd = (Seguridad: IOidc, Datos: {
    solicitudMcID: number,
    usuario: string,
    analistaID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        // Datos.personaID = Datos.personaID
        axios.post(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/listar/meme/true`, Datos, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


//Funciones para traer los estatus de las solicitudes.
export const FNGetEstatusSolicitud = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/catalogos/estatus-validacion/listar`, { //// CAMBAIR POR LA API QUE LE VOY A PEDIR AL DANIEL
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    //FAuncion para actaulizar el el analista de la solicitud
export const FNUpdate = (Seguridad: IOidc,
    Datos: {
        solicitudMcID: number,
        usuario:       String,
        analistaID:    number,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/asignar-solicitud-analista`, Datos, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

