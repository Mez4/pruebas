import axios from 'axios'

import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'



//Funcion para obtener los datos que llenaran la tabla principal
export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}'SOMA/dispersion'`, {
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



//Funcion para agregar un nuevo dato
export const FNAdd = (oidc: IOidc,
    Datos: {

        estatus: String,
        descripcion: String,

    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(` https://services-tsr.herokuapp.com/api/cat-estatus-dispersion/crear`, Datos, {
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


//Funcion para actualizar los datos 
export const FNUpdate = (oidc: IOidc,

    Datos: {
        estatusArchivoID: number,
        estatus: String,
        descripcion: String,



    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://services-tsr.herokuapp.com/api/cat-estatus-dispersion/actualizar/${Datos.estatusArchivoID}`, Datos, {
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





