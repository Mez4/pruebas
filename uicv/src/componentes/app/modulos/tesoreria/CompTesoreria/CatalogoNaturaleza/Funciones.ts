import axios from 'axios'

import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatNaturaleza/naturalezas`, {
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

export const FNAdd = (Seguridad: IOidc,
    Datos: {
        NaturalezaID: number,
        Descripcion: String,


    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}SOMA/CatNaturaleza/naturalezas`, Datos, {
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



export const FNUpdate = (Seguridad: IOidc,

    Datos: {
        NaturalezaID: number,
        Descripcion: String,

    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.put(`${GetServerUrl()}SOMA/CatNaturaleza/naturalezas/${Datos.NaturalezaID}`, Datos, {
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





