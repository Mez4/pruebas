import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

//Funcion para llenar la pantalla principal.
export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatTipoBanco/find-all`, {//
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

//Funcion para agreagar un nuevo banco
export const FNAdd = (oidc: IOidc,
    Datos: {
        descripcion: String
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}SOMA/CatTipoBanco/create`, Datos, {
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

//Funcion para actualizar un banco.
export const FNUpdate = (oidc: IOidc,
    Datos: {
        tipoBancoID: number,
        descripcion: String,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`${GetServerUrl()}SOMA/CatTipoBanco/update/${Datos.tipoBancoID}`, Datos, {
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

