import axios from 'axios'
// import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://tsr-lks.herokuapp.com/api/bancos/find-all`, {
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
        nombre: String,
        activo: boolean,

    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`https://tsr-lks.herokuapp.com/api/bancos/create/`, Datos, {
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
        bancoID: number,
        nombre: String,
        activo: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://tsr-lks.herokuapp.com/api/bancos/update/${Datos.bancoID}`, Datos, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })





